/**
 * Bill Abstract PDF Generator
 * 
 * This module generates PDF documents for bill abstracts in construction projects.
 * It creates a structured PDF with table, calculations, and signature sections.
 * 
 * Features:
 * - Dynamic table with automatic page breaks
 * - Text sanitization for PDF compatibility
 * - Multi-line text handling with word wrapping
 * - Vertical and horizontal grid lines
 * - Calculation section with tax breakdown
 * - Certificate and signature sections
 */

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

/**
 * Represents a single entry in the bill abstract table
 */
interface BillAbstractEntry {
  /** Description of the work item */
  workItemDescription: string;
  /** Measurement book number */
  mbNumber: string;
  /** Page number in the measurement book */
  mbPageNumber: string;
  /** Quantity of work executed */
  quantityExecuted: number;
  /** Unit of measurement */
  unit: string;
  /** Rate per unit */
  rate: number;
  /** Total amount (quantity × rate) */
  amount: number;
  /** Optional remarks */
  remarks?: string;
  /** Whether this entry is a header row (for parent items) */
  isHeader?: boolean;
  /** Whether this entry is a sub-item (for indentation) */
  isSubItem?: boolean;
  /** Custom serial number */
  slNo?: string;
}

/**
 * Complete data structure for generating a bill abstract PDF
 */
interface BillAbstractPDFData {
  /** Type of bill (e.g., "First Bill", "Final Bill") */
  billType: string;
  /** Name of the project */
  projectName: string;
  /** Location of the project */
  projectLocation: string;
  /** Array of work item entries */
  entries: BillAbstractEntry[];
  /** Total amount before deductions */
  itemwiseTotal: number;
  /** Contractual deduction percentage */
  contractualPercent: string;
  /** Contractual deduction amount */
  contractualDeduction: number;
  /** Value after contractual deduction */
  actualValue: number;
  /** Rounded amount (SAY) */
  sayAmount: number;
  /** CGST percentage */
  cgstPercent: string;
  /** CGST amount */
  cgstAmount: number;
  /** SGST percentage */
  sgstPercent: string;
  /** SGST amount */
  sgstAmount: number;
  /** Labor welfare cess percentage */
  lwcPercent: string;
  /** Labor welfare cess amount */
  lwcAmount: number;
  /** Subtotal after adding GST */
  subTotal: number;
  /** Gross bill amount including all taxes */
  grossBillAmount: number;
  /** Measurement book number */
  mbNumber: string;
  /** Measurement book pages */
  mbPages: string;
}

// ============================================================================
// PDF CONFIGURATION CONSTANTS
// ============================================================================

/**
 * PDF configuration constants
 * All values are in PDF points (1/72 inch)
 * A4 size: 595.28 × 841.89 points
 */
const PDF_CONFIG = {
  /** A4 page size in points [width, height] */
  PAGE_SIZE: [595.28, 841.89] as [number, number],

  /** Page margins in points */
  MARGIN: {
    TOP: 25,
    BOTTOM: 25,
    LEFT: 15,
    RIGHT: 15
  },

  /** Font sizes for different text elements */
  FONT_SIZES: {
    TITLE: 12,      // Main title
    HEADER: 10,     // Section headers
    NORMAL: 8,      // Regular text
    SMALL: 7,       // Table cells, footnotes
    FOOTER: 7       // Footer text
  } as Record<string, number>,

  /** Line heights corresponding to font sizes */
  LINE_HEIGHTS: {
    TITLE: 14,
    HEADER: 12,
    NORMAL: 10,
    SMALL: 9,
    FOOTER: 8
  } as Record<string, number>,

  /** Table-specific measurements */
  TABLE: {
    ROW_MIN_HEIGHT: 16,     // Minimum height for table rows
    HEADER_HEIGHT: 30,      // Height of table header
    CELL_PADDING: 3         // Padding inside table cells
  } as Record<string, number>
};

// ============================================================================
// MAIN PDF GENERATION FUNCTION
// ============================================================================

/**
 * Generates a PDF document for a bill abstract
 * @param originalData - Complete bill abstract data
 * @returns Promise resolving to PDF as Uint8Array
 */
export async function generateBillAbstractPDF(originalData: BillAbstractPDFData): Promise<Uint8Array> {
  // Step 1: Sanitize input data to prevent PDF generation errors
  const cleanText = (text: string | undefined): string => {
    if (!text) return '';
    return text
      .replace(/\r/g, '')  // Remove carriage returns
      .replace(/[^\x00-\x7F\x0A]/g, '?')  // Replace non-ASCII with '?'
      .replace(/[\x00-\x09\x0B-\x1F\x7F]/g, '');  // Remove control characters
  };

  // Create sanitized copy of data
  const data = {
    ...originalData,
    billType: cleanText(originalData.billType),
    projectName: cleanText(originalData.projectName),
    projectLocation: cleanText(originalData.projectLocation),
    entries: originalData.entries.map(e => ({
      ...e,
      workItemDescription: cleanText(e.workItemDescription),
      unit: cleanText(e.unit),
      remarks: e.remarks ? cleanText(e.remarks) : undefined,
      mbNumber: cleanText(e.mbNumber),
      mbPageNumber: cleanText(e.mbPageNumber)
    })),
    mbNumber: cleanText(originalData.mbNumber),
    mbPages: cleanText(originalData.mbPages)
  };

  // Step 2: Create PDF document and embed fonts
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Step 3: Define table column widths (in points)
  // [SlNo, Items, MB No & Page, Qty, Unit, Rate, Amount, Remarks]
  const COLUMN_WIDTHS = [30, 180, 55, 55, 35, 55, 70, 80];

  // Calculate starting X positions for each column
  const colX: number[] = [];
  let currentX = PDF_CONFIG.MARGIN.LEFT;
  COLUMN_WIDTHS.forEach((width, index) => {
    colX.push(currentX);
    currentX += width;
  });

  // Step 4: Add first page and set up coordinates
  let page = pdfDoc.addPage(PDF_CONFIG.PAGE_SIZE);
  const { width, height } = page.getSize();

  // Y-coordinate starts from top of page (minus margin)
  let y = height - PDF_CONFIG.MARGIN.TOP;

  // Step 5: Draw header section (title, project info)
  y = drawHeaderSection(page, data, y, width, helveticaBold);

  // Step 6: Draw table with automatic page breaks
  const tableResult = drawTableWithPages(
    pdfDoc,
    page,
    data.entries,
    y,
    width,
    height,
    COLUMN_WIDTHS,
    colX,
    helvetica,
    helveticaBold
  );

  // Update page and y position after table drawing
  page = tableResult.page;
  y = tableResult.y;

  // Step 7: Draw calculation section (check if new page needed)
  const calculationSpaceNeeded = 150;
  if (y < PDF_CONFIG.MARGIN.BOTTOM + calculationSpaceNeeded) {
    // Not enough space, add new page
    page = pdfDoc.addPage(PDF_CONFIG.PAGE_SIZE);
    y = height - PDF_CONFIG.MARGIN.TOP;
  }

  y = drawCalculationSection(page, data, y, width, helvetica, helveticaBold);

  // Step 8: Draw certificate and signatures
  y = drawCertificateAndSignatures(pdfDoc, page, data, y, width, height, helvetica, helveticaBold);

  // Step 9: Save and return PDF
  return await pdfDoc.save();
}

// ============================================================================
// HEADER SECTION
// ============================================================================

/**
 * Draws the header section of the PDF
 * Includes title, bill type, and project information
 */
function drawHeaderSection(
  page: PDFPage,
  data: BillAbstractPDFData,
  y: number,
  width: number,
  helveticaBold: PDFFont
): number {
  // Draw main title
  const title = 'BILL ABSTRACT FORM';
  const titleWidth = helveticaBold.widthOfTextAtSize(title, PDF_CONFIG.FONT_SIZES.TITLE);
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.TITLE,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });

  // Draw underline for title
  page.drawLine({
    start: { x: (width - titleWidth) / 2, y: y - 2 },
    end: { x: (width + titleWidth) / 2, y: y - 2 },
    thickness: 1,
  });

  y -= PDF_CONFIG.LINE_HEIGHTS.TITLE;

  // Draw bill type (centered below title)
  const billTypeWidth = helveticaBold.widthOfTextAtSize(data.billType, PDF_CONFIG.FONT_SIZES.HEADER);
  page.drawText(data.billType, {
    x: (width - billTypeWidth) / 2,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.HEADER,
    font: helveticaBold,
  });

  y -= 20; // Extra spacing

  // Draw "Name of Work" label
  page.drawText('Name of Work :-', {
    x: PDF_CONFIG.MARGIN.LEFT,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.HEADER,
    font: helveticaBold,
  });

  y -= PDF_CONFIG.LINE_HEIGHTS.HEADER;

  // Draw project name (with location if available)
  const projectText = data.projectLocation
    ? `${data.projectName}, ${data.projectLocation}`
    : data.projectName;

  // Split project text into multiple lines if too long
  const projectLines = splitText(
    projectText,
    helveticaBold,
    PDF_CONFIG.FONT_SIZES.NORMAL,
    width - 2 * PDF_CONFIG.MARGIN.LEFT
  );

  // Draw each line of project text
  projectLines.forEach(line => {
    page.drawText(line, {
      x: PDF_CONFIG.MARGIN.LEFT,
      y: y,
      size: PDF_CONFIG.FONT_SIZES.NORMAL,
      font: helveticaBold
    });
    y -= PDF_CONFIG.LINE_HEIGHTS.NORMAL;
  });

  y -= 15; // Extra spacing after header

  return y;
}

// ============================================================================
// TABLE MANAGEMENT WITH PAGE BREAKS
// ============================================================================

/**
 * Manages table drawing across multiple pages with automatic page breaks
 * Returns the final page and Y position after table is drawn
 */
function drawTableWithPages(
  pdfDoc: PDFDocument,
  startPage: PDFPage,
  entries: BillAbstractEntry[],
  startY: number,
  width: number,
  height: number,
  colWidths: number[],
  colX: number[],
  helvetica: PDFFont,
  helveticaBold: PDFFont
): { page: PDFPage; y: number } {
  let page = startPage;
  let y = startY;

  // Draw table header on first page
  y = drawTableHeader(page, y, width, colX, colWidths, helveticaBold);

  // Store starting Y for drawing vertical grid lines later
  const tableStartY = y;

  // Draw each table entry with automatic page break detection
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    // Check if we need a new page (leave space for at least 3 more rows)
    const minSpaceNeeded = PDF_CONFIG.MARGIN.BOTTOM + (PDF_CONFIG.TABLE.ROW_MIN_HEIGHT * 3);
    if (y < minSpaceNeeded) {
      // Close current table on this page
      page.drawLine({
        start: { x: PDF_CONFIG.MARGIN.LEFT, y: y },
        end: { x: width - PDF_CONFIG.MARGIN.RIGHT, y: y },
        thickness: 1
      });

      // Add new page
      page = pdfDoc.addPage(PDF_CONFIG.PAGE_SIZE);
      y = height - PDF_CONFIG.MARGIN.TOP;

      // Draw continuation notice
      page.drawText('(Continued from previous page)', {
        x: PDF_CONFIG.MARGIN.LEFT,
        y: y,
        size: PDF_CONFIG.FONT_SIZES.SMALL,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.5)
      });
      y -= 15;

      // Draw table header on new page
      y = drawTableHeader(page, y, width, colX, colWidths, helveticaBold);
    }

    // Draw the table row
    y = drawTableRow(
      page,
      i + 1,
      entry,
      y,
      colX,
      colWidths,
      helvetica,
      helveticaBold,
      width
    );
  }

  // Close the table on the final page
  page.drawLine({
    start: { x: PDF_CONFIG.MARGIN.LEFT, y: y },
    end: { x: width - PDF_CONFIG.MARGIN.RIGHT, y: y },
    thickness: 1
  });

  y -= 20; // Spacing after table

  return { page, y };
}

// ============================================================================
// TABLE HEADER
// ============================================================================

/**
 * Draws the table header with column titles
 */
function drawTableHeader(
  page: PDFPage,
  y: number,
  width: number,
  colX: number[],
  colWidths: number[],
  helveticaBold: PDFFont
): number {
  // Draw top border of table
  page.drawLine({
    start: { x: PDF_CONFIG.MARGIN.LEFT, y: y },
    end: { x: width - PDF_CONFIG.MARGIN.RIGHT, y: y },
    thickness: 1
  });

  // Column headers (some with line breaks)
  const headers = [
    'Sl\nNo.',
    'Items',
    'MB No. &\nPage No.',
    'Quantity\nexecuted',
    'Unit',
    'Rate',
    'Amount',
    'Remarks\n(If any)'
  ];

  // Starting Y position for header text
  const headerY = y - 12;

  // Draw each column header
  for (let i = 0; i < headers.length; i++) {
    const lines = headers[i].split('\n');
    let textY = headerY;

    // Calculate vertical centering for multi-line headers
    const totalTextHeight = lines.length * PDF_CONFIG.LINE_HEIGHTS.SMALL;
    const verticalOffset = (PDF_CONFIG.TABLE.HEADER_HEIGHT - totalTextHeight - 10) / 2;
    textY = headerY - verticalOffset;

    // Draw each line of the header
    lines.forEach(line => {
      const textWidth = helveticaBold.widthOfTextAtSize(line, PDF_CONFIG.FONT_SIZES.SMALL);
      const centerX = colX[i] + (colWidths[i] - textWidth) / 2;

      page.drawText(line, {
        x: centerX,
        y: textY,
        size: PDF_CONFIG.FONT_SIZES.SMALL,
        font: helveticaBold,
      });
      textY -= PDF_CONFIG.LINE_HEIGHTS.SMALL;
    });
  }

  // Move Y position down by header height
  y -= PDF_CONFIG.TABLE.HEADER_HEIGHT;

  // Draw bottom border of header
  page.drawLine({
    start: { x: PDF_CONFIG.MARGIN.LEFT, y: y },
    end: { x: width - PDF_CONFIG.MARGIN.RIGHT, y: y },
    thickness: 1
  });

  return y;
}

// ============================================================================
// TABLE ROW DRAWING
// ============================================================================

/**
 * Draws a single table row with proper text positioning to prevent overlap
 * Returns the updated Y position after drawing the row
 */
function drawTableRow(
  page: PDFPage,
  index: number | null,
  entry: BillAbstractEntry,
  y: number,
  colX: number[],
  colWidths: number[],
  helvetica: PDFFont,
  helveticaBold: PDFFont,
  width: number
): number {
  // Check if sub-item for indentation
  const isSubItem = entry.isSubItem || /^(?:[a-z]\)|\([a-z]\)|[ivx]+\)|\([ivx]+\))/.test(entry.workItemDescription.trim().toLowerCase());

  // Determine Serial Number
  const serialNo = entry.slNo || (index !== null ? index.toString() : "");

  // Prepare cell content for each column
  const cells = [
    entry.isHeader ? serialNo : serialNo,
    entry.isHeader ? "" : entry.workItemDescription,
    `${entry.mbNumber ? 'MB-' + entry.mbNumber : ''}${entry.mbPageNumber ? '\nP-' + entry.mbPageNumber : ''}`,
    entry.quantityExecuted ? entry.quantityExecuted.toFixed(3) : "",
    entry.unit,
    entry.rate ? entry.rate.toFixed(2) : "",
    entry.amount.toFixed(2),
    entry.remarks || ''
  ];

  // If it is a header row
  if (entry.isHeader) {
    // Draw Header Row
    const slNo = serialNo;
    const description = entry.workItemDescription;
    const amount = "";

    let maxHeaderHeight = PDF_CONFIG.TABLE.ROW_MIN_HEIGHT;

    // Sl No Column (0)
    const slLines = splitText(slNo, helveticaBold, PDF_CONFIG.FONT_SIZES.SMALL, colWidths[0] - PDF_CONFIG.TABLE.CELL_PADDING * 2);

    // Description spans columns 1 to 6
    const lastColIndex = 6;
    const descWidth = colWidths.slice(1, lastColIndex + 1).reduce((sum, w) => sum + w, 0) - PDF_CONFIG.TABLE.CELL_PADDING * 2;
    const descLines = splitText(description, helveticaBold, PDF_CONFIG.FONT_SIZES.SMALL, descWidth);

    const lineHeight = PDF_CONFIG.LINE_HEIGHTS.SMALL;
    const padding = PDF_CONFIG.TABLE.CELL_PADDING * 2;
    const extraVerticalPadding = 8;

    maxHeaderHeight = Math.max(
      maxHeaderHeight,
      slLines.length * lineHeight + padding + extraVerticalPadding,
      descLines.length * lineHeight + padding + extraVerticalPadding
    );

    // Draw Background (Light Gray for headers)
    const bgY = y - maxHeaderHeight;
    page.drawRectangle({
      x: PDF_CONFIG.MARGIN.LEFT,
      y: bgY,
      width: width - PDF_CONFIG.MARGIN.LEFT - PDF_CONFIG.MARGIN.RIGHT,
      height: maxHeaderHeight,
      color: rgb(0.95, 0.95, 0.95),
    });

    // Start text lower down
    const textStartY = y - PDF_CONFIG.TABLE.CELL_PADDING - (extraVerticalPadding / 2);

    // 1. Draw Sl No
    let lineY = textStartY;
    slLines.forEach(line => {
      const width = helveticaBold.widthOfTextAtSize(line, PDF_CONFIG.FONT_SIZES.SMALL);
      page.drawText(line, {
        x: colX[0] + (colWidths[0] - width) / 2,
        y: lineY,
        size: PDF_CONFIG.FONT_SIZES.SMALL,
        font: helveticaBold
      });
      lineY -= lineHeight;
    });

    // 2. Draw Description
    lineY = textStartY;
    descLines.forEach(line => {
      page.drawText(line, {
        x: colX[1] + PDF_CONFIG.TABLE.CELL_PADDING,
        y: lineY,
        size: PDF_CONFIG.FONT_SIZES.SMALL,
        font: helveticaBold
      });
      lineY -= lineHeight;
    });

    y -= maxHeaderHeight;
    
    // Draw separator line
    page.drawLine({
      start: { x: PDF_CONFIG.MARGIN.LEFT, y: y },
      end: { x: width - PDF_CONFIG.MARGIN.RIGHT, y: y },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8)
    });

    // Draw vertical grid lines for header row
    const rowTopY = y + maxHeaderHeight;
    const rowBottomY = y;

    // Left Border
    page.drawLine({
      start: { x: colX[0], y: rowTopY },
      end: { x: colX[0], y: rowBottomY },
      thickness: 1
    });

    // Right Border
    const rightBorderX = width - PDF_CONFIG.MARGIN.RIGHT;
    page.drawLine({
      start: { x: rightBorderX, y: rowTopY },
      end: { x: rightBorderX, y: rowBottomY },
      thickness: 1
    });

    // Internal column lines for header
    page.drawLine({
      start: { x: colX[1], y: rowTopY },
      end: { x: colX[1], y: rowBottomY },
      thickness: 1
    });

    page.drawLine({
      start: { x: colX[7], y: rowTopY },
      end: { x: colX[7], y: rowBottomY },
      thickness: 1
    });

    return y;
  }

  // Calculate maximum height needed for this row
  let maxCellHeight = PDF_CONFIG.TABLE.ROW_MIN_HEIGHT;
  const cellLines: string[][] = [];

  // Process each cell to determine line breaks and required height
  for (let i = 0; i < cells.length; i++) {
    let availableWidth = colWidths[i] - PDF_CONFIG.TABLE.CELL_PADDING * 2;
    if (i === 1 && isSubItem) {
      availableWidth -= 25;
    }

    const lines = splitText(cells[i], helvetica, PDF_CONFIG.FONT_SIZES.SMALL, availableWidth);
    cellLines.push(lines);

    const cellHeight = lines.length * PDF_CONFIG.LINE_HEIGHTS.SMALL + PDF_CONFIG.TABLE.CELL_PADDING * 2;
    maxCellHeight = Math.max(maxCellHeight, cellHeight);
  }

  // Starting Y position for text in cells
  const textStartY = y - PDF_CONFIG.TABLE.CELL_PADDING - 6;

  // Draw content for each cell
  for (let i = 0; i < cells.length; i++) {
    const lines = cellLines[i];
    let lineY = textStartY;

    // Determine text alignment for each column
    let align: 'left' | 'center' | 'right' = 'left';
    if (i === 0 || i === 2 || i === 4) align = 'center';
    if (i === 3 || i === 5 || i === 6) align = 'right';

    // Calculate total text height for this cell
    const totalTextHeight = lines.length * PDF_CONFIG.LINE_HEIGHTS.SMALL;
    const cellHeight = maxCellHeight - PDF_CONFIG.TABLE.CELL_PADDING * 2;

    let verticalOffset = Math.max(0, (cellHeight - totalTextHeight) / 2);
    if (i === 1) {
      verticalOffset = 0; // Top align description
    }

    lineY = textStartY - verticalOffset;

    // Draw each line of text in the cell
    lines.forEach(line => {
      const textWidth = helvetica.widthOfTextAtSize(line, PDF_CONFIG.FONT_SIZES.SMALL);
      let textX = colX[i] + PDF_CONFIG.TABLE.CELL_PADDING;

      // Indentation for sub-items in Items column
      if (i === 1 && isSubItem) {
        textX += 25;
      }

      // Adjust X position based on alignment
      if (align === 'center') {
        textX = colX[i] + (colWidths[i] - textWidth) / 2;
      } else if (align === 'right') {
        textX = colX[i] + colWidths[i] - textWidth - PDF_CONFIG.TABLE.CELL_PADDING;
      }

      page.drawText(line, {
        x: textX,
        y: lineY,
        size: PDF_CONFIG.FONT_SIZES.SMALL,
        font: helvetica
      });
      lineY -= PDF_CONFIG.LINE_HEIGHTS.SMALL;
    });
  }

  // Update Y position for next row
  y -= maxCellHeight;

  // Draw vertical grid lines for this row
  const rowTopY = y + maxCellHeight;
  const rowBottomY = y;

  // Left Border
  page.drawLine({
    start: { x: colX[0], y: rowTopY },
    end: { x: colX[0], y: rowBottomY },
    thickness: 1
  });

  // Right Border
  const rightBorderX = width - PDF_CONFIG.MARGIN.RIGHT;
  page.drawLine({
    start: { x: rightBorderX, y: rowTopY },
    end: { x: rightBorderX, y: rowBottomY },
    thickness: 1
  });

  // Internal Column Lines
  const skipIndices = new Set<number>();

  if (entry.isHeader) {
    skipIndices.add(2);
    skipIndices.add(3);
    skipIndices.add(4);
    skipIndices.add(5);

    const amount = entry.amount > 0;
    if (!amount) {
      skipIndices.add(6);
    }
  }

  for (let i = 1; i < colX.length; i++) {
    if (!skipIndices.has(i)) {
      page.drawLine({
        start: { x: colX[i], y: rowTopY },
        end: { x: colX[i], y: rowBottomY },
        thickness: 1
      });
    }
  }

  // Draw bottom border for this row
  page.drawLine({
    start: { x: PDF_CONFIG.MARGIN.LEFT, y: rowBottomY },
    end: { x: width - PDF_CONFIG.MARGIN.RIGHT, y: rowBottomY },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8)
  });

  return y;
}

// ============================================================================
// CALCULATION SECTION
// ============================================================================

/**
 * Draws the calculation section with amounts, taxes, and totals
 * All calculations are right-aligned for easy reading
 */
function drawCalculationSection(
  page: PDFPage,
  data: BillAbstractPDFData,
  y: number,
  width: number,
  helvetica: PDFFont,
  helveticaBold: PDFFont
): number {
  // X positions for labels and values
  const rightAlignX = width - PDF_CONFIG.MARGIN.RIGHT - 100;
  const labelX = width - PDF_CONFIG.MARGIN.RIGHT - 300;

  // Total of Work Value
  page.drawText('Total of Work Value=', {
    x: labelX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helveticaBold
  });
  page.drawText(data.itemwiseTotal.toFixed(2), {
    x: rightAlignX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helveticaBold
  });
  y -= 15;

  // Contractual Deduction
  const contractualPercentNum = parseFloat(data.contractualPercent);
  const deductionLabel = contractualPercentNum > 0
    ? (data.itemwiseTotal > data.actualValue ? "Less Contractor Less" : "Add Contractor Add")
    : "Contractual Adjustment";

  page.drawText(`${deductionLabel} @ ${data.contractualPercent}%`, {
    x: labelX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helvetica
  });
  page.drawText(data.contractualDeduction.toFixed(2), {
    x: rightAlignX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helvetica
  });
  y -= 15;

  // Total Value of Work Done
  page.drawText('Total Value of Work done', {
    x: labelX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helveticaBold
  });
  page.drawText(data.actualValue.toFixed(2), {
    x: rightAlignX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helveticaBold
  });
  y -= 15;

  // SAY Amount (rounded)
  page.drawText('SAY', {
    x: labelX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helveticaBold
  });
  page.drawText(data.sayAmount.toFixed(2), {
    x: rightAlignX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helveticaBold
  });
  y -= 20;

  // "Add:-" label for tax section
  page.drawText('Add:-', {
    x: labelX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helveticaBold
  });
  y -= 15;

  // CGST (Central Goods and Services Tax)
  page.drawText(`Add CGST @ ${data.cgstPercent}%`, {
    x: labelX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helvetica
  });
  page.drawText(data.cgstAmount.toFixed(0), {
    x: rightAlignX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helvetica
  });
  y -= 15;

  // SGST (State Goods and Services Tax)
  page.drawText(`Add SGST @ ${data.sgstPercent}%`, {
    x: labelX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helvetica
  });
  page.drawText(data.sgstAmount.toFixed(0), {
    x: rightAlignX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helvetica
  });
  y -= 15;

  // Sub Total (after GST)
  page.drawText('Sub Total=', {
    x: labelX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helveticaBold
  });
  page.drawText(data.subTotal.toFixed(2), {
    x: rightAlignX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helveticaBold
  });
  y -= 15;

  // Labor Welfare Cess
  page.drawText(`Add L.W.Cess @ ${data.lwcPercent}%`, {
    x: labelX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helvetica
  });
  page.drawText(data.lwcAmount.toFixed(0), {
    x: rightAlignX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.NORMAL,
    font: helvetica
  });
  y -= 20;

  // GROSS BILL AMOUNT (final total)
  page.drawText('GROSS BILL AMOUNT=', {
    x: labelX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.HEADER,
    font: helveticaBold
  });
  page.drawText(data.grossBillAmount.toFixed(0), {
    x: rightAlignX,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.HEADER,
    font: helveticaBold
  });

  y -= 20;

  return y;
}

// ============================================================================
// CERTIFICATE AND SIGNATURES SECTION
// ============================================================================

/**
 * Draws the certificate text and signature blocks
 * Handles page overflow by adjusting Y position
 */
function drawCertificateAndSignatures(
  pdfDoc: PDFDocument,
  page: PDFPage,
  data: BillAbstractPDFData,
  y: number,
  width: number,
  height: number,
  helvetica: PDFFont,
  helveticaBold: PDFFont
): number {
  // Check if we have enough space for certificate and signatures
  const signatureSpaceNeeded = 200;
  if (y < PDF_CONFIG.MARGIN.BOTTOM + signatureSpaceNeeded) {
    page = pdfDoc.addPage(PDF_CONFIG.PAGE_SIZE);
    y = height - PDF_CONFIG.MARGIN.TOP;
  }

  // Create appropriate certificate text
  // The mbPages will always be in "1 to lastPage" or "1" format
  let certText: string;
  
  // Check if it contains "to" (e.g., "1 to 25")
  if (data.mbPages.includes(' to ')) {
    // Range format (e.g., "1 to 25")
    certText = `Certified that the foregoing claim is correct and the necessary measurements were made by me and are recorded at pages ${data.mbPages} of measurement Book No. ${data.mbNumber}. And that the work has been satisfactorily performed as per specification.`;
  } else {
    // Single page format (e.g., "1")
    certText = `Certified that the foregoing claim is correct and the necessary measurements were made by me and are recorded at page No. ${data.mbPages} of measurement Book No. ${data.mbNumber}. And that the work has been satisfactorily performed as per specification.`;
  }

  // Split certificate text into multiple lines
  const certLines = splitText(
    certText,
    helvetica,
    PDF_CONFIG.FONT_SIZES.SMALL,
    width - 2 * PDF_CONFIG.MARGIN.LEFT
  );

  // Draw each line of certificate text
  certLines.forEach(line => {
    page.drawText(line, {
      x: PDF_CONFIG.MARGIN.LEFT,
      y: y,
      size: PDF_CONFIG.FONT_SIZES.SMALL,
      font: helvetica
    });
    y -= PDF_CONFIG.LINE_HEIGHTS.SMALL;
  });

  y -= 40;

  // Signature labels (4 columns)
  const signatures = [
    'Sig.of Contractor',
    'Sig.of Nirman Sahayak',
    'Sig.of E.A./Secretary',
    'Sig.of Pradhan'
  ];

  const sigColumnWidth = (width - 2 * PDF_CONFIG.MARGIN.LEFT) / 4;
  const sigY = y;

  // Draw each signature label centered in its column
  signatures.forEach((sig, index) => {
    const columnX = PDF_CONFIG.MARGIN.LEFT + (sigColumnWidth * index);
    const textWidth = helveticaBold.widthOfTextAtSize(sig, PDF_CONFIG.FONT_SIZES.SMALL);
    const centerX = columnX + (sigColumnWidth - textWidth) / 2;

    page.drawText(sig, {
      x: centerX,
      y: sigY,
      size: PDF_CONFIG.FONT_SIZES.SMALL,
      font: helveticaBold
    });
  });

  y -= 50;

  // Note to Executive Assistant
  page.drawText('Placed to Executive Assistant for checking & necessary deduction.', {
    x: PDF_CONFIG.MARGIN.LEFT,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.SMALL,
    font: helvetica
  });

  y -= 30;

  // Final signature (right-aligned)
  const finalSig = 'Sig.of Nirman Sahayak';
  const finalSigWidth = helveticaBold.widthOfTextAtSize(finalSig, PDF_CONFIG.FONT_SIZES.SMALL);
  page.drawText(finalSig, {
    x: width - PDF_CONFIG.MARGIN.RIGHT - finalSigWidth,
    y: y,
    size: PDF_CONFIG.FONT_SIZES.SMALL,
    font: helveticaBold
  });

  return y;
}

// ============================================================================
// TEXT WRAPPING UTILITY
// ============================================================================

/**
 * Splits text into multiple lines based on available width
 * Handles both explicit line breaks (\n) and word wrapping
 * @param text - Text to split
 * @param font - PDF font for width calculation
 * @param size - Font size
 * @param maxWidth - Maximum width available
 * @returns Array of text lines
 */
function splitText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  if (!text) return [''];

  // Normalize line endings
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rawLines = normalizedText.split('\n');
  const finalLines: string[] = [];

  // Process each raw line (from explicit line breaks)
  rawLines.forEach(rawLine => {
    if (!rawLine.trim()) {
      finalLines.push('');
      return;
    }

    const words = rawLine.split(' ');
    let currentLine = words[0] || '';

    // Process each word in the line
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + ' ' + word;

      try {
        const width = font.widthOfTextAtSize(testLine, size);
        if (width <= maxWidth) {
          currentLine = testLine;
        } else {
          finalLines.push(currentLine);
          currentLine = word;
        }
      } catch (e) {
        const estimatedWidth = testLine.length * size * 0.6;
        if (estimatedWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          finalLines.push(currentLine);
          currentLine = word;
        }
      }
    }

    // Add the last line
    if (currentLine) {
      finalLines.push(currentLine);
    }
  });

  return finalLines;
}
