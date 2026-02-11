import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';

interface MBEntry {
  type?: 'header' | 'entry';
  slNo: string | number;
  schedulePageNo: string;
  workItemDescription: string;
  quantityExecuted?: number;
  unit?: string;
  rate?: number;
  amount?: number;
  measuredDate?: string;
  isSubItem?: boolean;
  measurements?: Array<{
    description: string;
    nos: number;
    length: number;
    breadth: number;
    depth: number;
    quantity: number;
  }>;
}

interface MBPDFData {
  mbNumber: string;
  mbPageNumber: string;
  workName: string;
  location: string;
  contractorName: string;
  measuredBy: string;
  activityCode: string;
  agreementAmount: string;
  entries: MBEntry[];
}

export async function generateMeasurementBookPDF(data: MBPDFData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Helper to add a new page
  const addNewPage = () => {
    const p = pdfDoc.addPage([842, 595]); // A4 Landscape
    return p;
  };

  let page = addNewPage();
  const { width, height } = page.getSize();
  
  const primaryColor = rgb(0.12, 0.29, 0.49); // Dark Blue
  const accentColor = rgb(0.0, 0.47, 0.75); // Bright Blue
  const lightGray = rgb(0.95, 0.95, 0.95);
  const darkGray = rgb(0.3, 0.3, 0.3);

  let yPosition = height - 40;

  // Header Drawing Function
  const drawHeader = (currentPage: any) => {
    currentPage.drawRectangle({
      x: 0,
      y: height - 120,
      width: width,
      height: 120,
      color: primaryColor,
    });

    currentPage.drawRectangle({
      x: 0,
      y: height - 120,
      width: width,
      height: 60,
      color: rgb(0.08, 0.22, 0.38),
      opacity: 0.5,
    });

    currentPage.drawText('MEASUREMENT BOOK', {
      x: 50,
      y: height - 50,
      size: 24,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    currentPage.drawText(`MB No: ${data.mbNumber} | Page: ${data.mbPageNumber}`, {
      x: 50,
      y: height - 75,
      size: 12,
      font: helvetica,
      color: rgb(0.9, 0.9, 0.9),
    });

    currentPage.drawText('OFFICE OF THE PRADHAN', {
      x: 50,
      y: height - 95,
      size: 10,
      font: helvetica,
      color: rgb(0.8, 0.8, 0.8),
    });
  };

  drawHeader(page);

  yPosition = height - 140;

  // Project Details Box
  page.drawRectangle({
    x: 40,
    y: yPosition - 85,
    width: width - 80,
    height: 85,
    borderColor: accentColor,
    borderWidth: 2,
    color: rgb(0.98, 0.99, 1),
  });

  // Details Grid
  const detailsY = yPosition - 20;
  const leftCol = 50;
  const rightCol = 420;

  page.drawText('Project Name:', { x: leftCol, y: detailsY, size: 9, font: helveticaBold, color: darkGray });
  page.drawText(truncateText(data.workName, 50), { x: leftCol + 90, y: detailsY, size: 9, font: helvetica, color: rgb(0, 0, 0) });

  page.drawText('Location:', { x: leftCol, y: detailsY - 18, size: 9, font: helveticaBold, color: darkGray });
  page.drawText(truncateText(data.location, 50), { x: leftCol + 90, y: detailsY - 18, size: 9, font: helvetica, color: rgb(0, 0, 0) });

  page.drawText('Contractor:', { x: leftCol, y: detailsY - 36, size: 9, font: helveticaBold, color: darkGray });
  page.drawText(truncateText(data.contractorName, 50), { x: leftCol + 90, y: detailsY - 36, size: 9, font: helvetica, color: rgb(0, 0, 0) });

  page.drawText('Activity Code:', { x: rightCol, y: detailsY, size: 9, font: helveticaBold, color: darkGray });
  page.drawText(data.activityCode, { x: rightCol + 90, y: detailsY, size: 9, font: helvetica, color: rgb(0, 0, 0) });

  page.drawText('Agreement Amount:', { x: rightCol, y: detailsY - 18, size: 9, font: helveticaBold, color: darkGray });
  page.drawText(`Rs. ${data.agreementAmount}`, { x: rightCol + 110, y: detailsY - 18, size: 9, font: helvetica, color: rgb(0, 0, 0) });

  page.drawText('Measured By:', { x: rightCol, y: detailsY - 36, size: 9, font: helveticaBold, color: darkGray });
  page.drawText(data.measuredBy, { x: rightCol + 90, y: detailsY - 36, size: 9, font: helvetica, color: rgb(0, 0, 0) });

  yPosition -= 110;

  // Table Config
  const tableHeaders = ['Sl', 'Page No', 'Description', 'Measurements', 'Qty', 'Unit', 'Rate', 'Amount'];
  // Adjusted column widths to accommodate Page No
  const colWidths = [30, 40, 200, 180, 60, 40, 70, 90]; 
  const tableHeaderHeight = 25;
  
  const drawTableHeader = (currentPage: any, y: number) => {
    currentPage.drawRectangle({
      x: 40,
      y: y - tableHeaderHeight,
      width: width - 80,
      height: tableHeaderHeight,
      color: accentColor,
    });

    let xPos = 40;
    tableHeaders.forEach((header, i) => {
      currentPage.drawText(header, {
        x: xPos + 5,
        y: y - 17,
        size: 9,
        font: helveticaBold,
        color: rgb(1, 1, 1),
      });
      xPos += colWidths[i];
    });
  };

  drawTableHeader(page, yPosition);
  yPosition -= tableHeaderHeight + 5;

  // Table Rows
  let totalAmount = 0;

  for (let index = 0; index < data.entries.length; index++) {
    const entry = data.entries[index];
    const isHeader = entry.type === 'header';
    
    // Calculate required height for this entry
    // Base height for description line
    let requiredHeight = 20; 
    
    // Height for measurements
    if (!isHeader && entry.measurements && entry.measurements.length > 0) {
        requiredHeight += entry.measurements.length * 15;
    }

    if (yPosition - requiredHeight < 50) {
      page = addNewPage();
      yPosition = height - 50;
      drawTableHeader(page, yPosition);
      yPosition -= tableHeaderHeight + 5;
    }

    const rowColor = isHeader ? rgb(0.95, 0.95, 1) : (index % 2 === 0 ? rgb(1, 1, 1) : lightGray);
    
    let currentY = yPosition;
    let xPos = 40;

    // Background for header
    if (isHeader) {
        page.drawRectangle({
            x: 40,
            y: currentY - 15,
            width: width - 80,
            height: 15,
            color: rowColor
        });
    }

    // Draw Main Entry Row (Description etc)
    const slNo = entry.slNo.toString();
    const pageNo = entry.schedulePageNo || "";
    const description = truncateText(entry.workItemDescription, 60);
    const qty = entry.quantityExecuted !== undefined ? entry.quantityExecuted.toFixed(2) : "";
    const unit = entry.unit || "";
    const rate = entry.rate !== undefined ? entry.rate.toFixed(2) : "";
    const amount = entry.amount !== undefined ? entry.amount.toFixed(2) : "";

    // Indent description if subitem
    const descXOffset = entry.isSubItem ? 15 : 0;
    // Bold font for header
    const fontToUse = isHeader ? helveticaBold : helvetica;

    const drawCellRight = (text: string, colIdx: number, y: number) => {
        let x = 40;
        for(let i=0; i<colIdx; i++) x += colWidths[i];
        const width = colWidths[colIdx];
        const textWidth = fontToUse.widthOfTextAtSize(text, 8);
        page.drawText(text, { x: x + width - textWidth - 5, y: y, size: 8, font: fontToUse, color: rgb(0,0,0) });
    };

    const drawCellLeft = (text: string, colIdx: number, y: number, xOffset: number = 0) => {
        let x = 40;
        for(let i=0; i<colIdx; i++) x += colWidths[i];
        page.drawText(text, { x: x + 5 + xOffset, y: y, size: 8, font: fontToUse, color: rgb(0,0,0) });
    };

    // Redraw using helpers
    drawCellLeft(slNo, 0, currentY - 10);
    drawCellLeft(pageNo, 1, currentY - 10);
    drawCellLeft(description, 2, currentY - 10, descXOffset);
    
    if (!isHeader) {
        // Skip measurements col
        drawCellRight(qty, 4, currentY - 10);
        drawCellLeft(unit, 5, currentY - 10);
        drawCellRight(rate, 6, currentY - 10);
        drawCellRight(amount, 7, currentY - 10);
    }

    currentY -= 15; // Move down for measurements

    // Draw Measurements (Only for non-header entries)
    if (!isHeader && entry.measurements && entry.measurements.length > 0) {
        entry.measurements.forEach(m => {
            const measText = `${m.description ? m.description + ': ' : ''}${m.nos} × ${m.length} × ${m.breadth} × ${m.depth} = ${m.quantity.toFixed(2)}`;
            // Measurement column is index 3
            drawCellLeft(measText, 3, currentY - 10);
            currentY -= 15;
        });
    }

    // Separator line
    page.drawLine({
        start: { x: 40, y: currentY },
        end: { x: width - 40, y: currentY },
        thickness: 0.5,
        color: lightGray,
    });

    yPosition = currentY - 5;
    if (entry.amount) {
        totalAmount += entry.amount;
    }
  }

  // Total Section
  yPosition -= 10;
  
  if (yPosition < 50) {
      page = addNewPage();
      yPosition = height - 50;
  }

  page.drawRectangle({
    x: 40,
    y: yPosition - 25,
    width: width - 80,
    height: 25,
    color: rgb(0.95, 0.97, 1),
    borderColor: accentColor,
    borderWidth: 2,
  });

  page.drawText('Total Value of Work Done:', {
    x: 500,
    y: yPosition - 17,
    size: 10,
    font: helveticaBold,
    color: primaryColor,
  });

  page.drawText(`Rs. ${totalAmount.toFixed(2)}`, {
    x: 680,
    y: yPosition - 17,
    size: 11,
    font: helveticaBold,
    color: rgb(0, 0.5, 0),
  });

  // Footer with Signatures
  yPosition -= 60;
  if (yPosition < 50) {
    page = addNewPage();
    yPosition = height - 100;
  }
  
  page.drawText('Measured By:', { x: 100, y: yPosition, size: 9, font: helvetica, color: darkGray });
  page.drawText('_______________________', { x: 80, y: yPosition - 20, size: 9, font: helvetica, color: darkGray });
  page.drawText(data.measuredBy, { x: 100, y: yPosition - 35, size: 8, font: helveticaBold, color: rgb(0, 0, 0) });

  page.drawText('Verified By:', { x: 550, y: yPosition, size: 9, font: helvetica, color: darkGray });
  page.drawText('_______________________', { x: 530, y: yPosition - 20, size: 9, font: helvetica, color: darkGray });
  page.drawText('Pradhan', { x: 570, y: yPosition - 35, size: 8, font: helveticaBold, color: rgb(0, 0, 0) });

  // Add footer to all pages
  const pages = pdfDoc.getPages();
  pages.forEach(p => {
    const { width: pWidth } = p.getSize();
    p.drawRectangle({
        x: 0,
        y: 0,
        width: pWidth,
        height: 30,
        color: primaryColor,
    });
    const currentDate = new Date().toLocaleDateString();
    p.drawText(`Generated on: ${currentDate}`, {
        x: 50,
        y: 10,
        size: 8,
        font: helvetica,
        color: rgb(1, 1, 1),
    });
    p.drawText('Measurement Book - Official Document', {
        x: pWidth - 250,
        y: 10,
        size: 8,
        font: helvetica,
        color: rgb(1, 1, 1),
    });
  });

  return await pdfDoc.save();
}

function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}
