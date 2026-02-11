import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface EstimateItem {
  slNo: number;
  schedulePageNo: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  measurements?: Array<{
    description: string;
    nos: number;
    length: number;
    breadth: number;
    depth: number;
    quantity: number;
  }>;
  subItems?: Array<{
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
  }>;
}

interface EstimatePDFData {
  projectName: string;
  projectLocation: string;
  activityCode: string;
  fund: string;
  items: EstimateItem[];
  itemwiseTotal: number;
  gstAmount: number;
  costExclLWC: number;
  lwcAmount: number;
  costInclLWC: number;
  contingency: number;
  grandTotal: number;
  amountInWords: string;
  mode: 'detailed' | 'abstract';
}

export async function generateEstimatePDF(data: EstimatePDFData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595, 842]); // A4 Portrait
  const { width, height } = page.getSize();
  
  const primaryColor = rgb(0.12, 0.29, 0.49);
  const accentColor = rgb(0.0, 0.47, 0.75);
  const successColor = rgb(0, 0.5, 0);
  const lightBg = rgb(0.95, 0.97, 1);

  let yPosition = height - 40;

  // Header
  page.drawRectangle({
    x: 0,
    y: height - 140,
    width: width,
    height: 140,
    color: primaryColor,
  });

  page.drawText('PROBABLE ESTIMATE', {
    x: 50,
    y: height - 50,
    size: 22,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(data.mode === 'detailed' ? 'Detailed Estimate with Measurements' : 'Abstract Estimate', {
    x: 50,
    y: height - 75,
    size: 11,
    font: helvetica,
    color: rgb(0.9, 0.9, 0.9),
  });

  // Project Info Box
  yPosition = height - 100;
  const infoBoxTop = yPosition - 10;
  
  page.drawText(`Project: ${truncate(data.projectName, 60)}`, { x: 50, y: infoBoxTop, size: 9, font: helvetica, color: rgb(1, 1, 1) });
  page.drawText(`Location: ${truncate(data.projectLocation, 60)}`, { x: 50, y: infoBoxTop - 15, size: 9, font: helvetica, color: rgb(1, 1, 1) });
  
  page.drawText(`Code: ${data.activityCode}`, { x: 400, y: infoBoxTop, size: 9, font: helvetica, color: rgb(1, 1, 1) });
  page.drawText(`Fund: ${truncate(data.fund, 25)}`, { x: 400, y: infoBoxTop - 15, size: 9, font: helvetica, color: rgb(1, 1, 1) });

  yPosition = height - 160;

  // Table Header
  const tableTop = yPosition;
  let tableHeaders: string[];
  let colWidths: number[];

  if (data.mode === 'detailed') {
    tableHeaders = ['Sl', 'Page', 'Description', 'Nos', 'L', 'B', 'D', 'Qty', 'Unit', 'Rate', 'Amount'];
    colWidths = [25, 30, 140, 30, 30, 30, 30, 40, 35, 50, 65];
  } else {
    tableHeaders = ['Sl', 'Page', 'Description', 'Qty', 'Unit', 'Rate', 'Amount'];
    colWidths = [30, 40, 200, 60, 50, 70, 85];
  }

  page.drawRectangle({
    x: 30,
    y: tableTop - 22,
    width: width - 60,
    height: 22,
    color: accentColor,
  });

  let xPos = 35;
  tableHeaders.forEach((header, i) => {
    page.drawText(header, {
      x: xPos,
      y: tableTop - 15,
      size: 8,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    xPos += colWidths[i];
  });

  yPosition = tableTop - 27;

  // Table Rows
  data.items.forEach((item, index) => {
    if (yPosition < 180) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - 50;
    }

    const rowBg = index % 2 === 0 ? rgb(1, 1, 1) : rgb(0.97, 0.97, 0.97);
    
    if (data.mode === 'detailed') {
      // Description Row
      page.drawRectangle({ x: 30, y: yPosition - 15, width: width - 60, height: 15, color: rowBg });
      
      xPos = 35;
      const descRowData = [
        item.slNo.toString(),
        item.schedulePageNo,
        truncate(item.description, 25),
        '', '', '', '', '', '', '', ''
      ];
      
      descRowData.forEach((text, i) => {
        page.drawText(text, { x: xPos, y: yPosition - 10, size: 7, font: helvetica, color: rgb(0, 0, 0) });
        xPos += colWidths[i];
      });
      yPosition -= 15;

      // Sub-items
      if (item.subItems && item.subItems.length > 0) {
        item.subItems.forEach((sub, idx) => {
          if (yPosition < 180) {
            page = pdfDoc.addPage([595, 842]);
            yPosition = height - 50;
          }
          
          page.drawRectangle({ x: 30, y: yPosition - 15, width: width - 60, height: 15, color: rowBg });
          
          xPos = 35;
          const subRowData = [
            '', '',
            `   ${String.fromCharCode(97 + idx)}) ${truncate(sub.description, 25)}`,
            '', '', '', '',
            sub.quantity.toFixed(2),
            sub.unit,
            sub.rate.toFixed(2),
            sub.amount.toFixed(2)
          ];
          
          subRowData.forEach((text, i) => {
             const align = i >= 7 ? 'right' : 'left';
             const textX = align === 'right' ? xPos + colWidths[i] - 5 : xPos;
             page.drawText(text, { x: textX, y: yPosition - 10, size: 7, font: helvetica, color: rgb(0.2, 0.2, 0.2) });
             xPos += colWidths[i];
          });
          yPosition -= 15;
        });
      }

      // Measurements
      if (item.measurements && item.measurements.length > 0) {
        item.measurements.forEach((m) => {
          if (yPosition < 180) {
            page = pdfDoc.addPage([595, 842]);
            yPosition = height - 50;
          }
          
          page.drawRectangle({ x: 30, y: yPosition - 12, width: width - 60, height: 12, color: rgb(0.99, 0.99, 0.99) });
          
          xPos = 35;
          const measData = [
            '', '', 
            truncate(m.description, 20),
            m.nos.toString(),
            m.length.toString(),
            m.breadth.toString(),
            m.depth.toString(),
            m.quantity.toFixed(2),
            '', '', ''
          ];
          
          measData.forEach((text, i) => {
            page.drawText(text, { x: xPos, y: yPosition - 8, size: 6.5, font: helvetica, color: rgb(0.3, 0.3, 0.3) });
            xPos += colWidths[i];
          });
          yPosition -= 12;
        });
      }

      // Total Row
      page.drawRectangle({ x: 30, y: yPosition - 13, width: width - 60, height: 13, color: lightBg });
      
      xPos = 35;
      const totalData = [
        '', '', 'Total', '', '', '', '',
        item.quantity.toFixed(2),
        item.unit,
        item.rate.toFixed(2),
        item.amount.toFixed(2)
      ];
      
      totalData.forEach((text, i) => {
        const align = i >= 7 ? 'right' : 'left';
        const textX = align === 'right' ? xPos + colWidths[i] - 5 : xPos;
        page.drawText(text, { x: textX, y: yPosition - 9, size: 7, font: helveticaBold, color: rgb(0, 0, 0) });
        xPos += colWidths[i];
      });
      yPosition -= 18;

    } else {
      // Abstract mode - single row
      page.drawRectangle({ x: 30, y: yPosition - 18, width: width - 60, height: 18, color: rowBg });
      
      xPos = 35;
      const rowData = [
        item.slNo.toString(),
        item.schedulePageNo,
        truncate(item.description, 35),
        item.quantity.toFixed(2),
        item.unit,
        item.rate.toFixed(2),
        item.amount.toFixed(2)
      ];
      
      rowData.forEach((text, i) => {
        const align = i >= 3 ? 'right' : 'left';
        const textX = align === 'right' ? xPos + colWidths[i] - 5 : xPos;
        page.drawText(text, { x: textX, y: yPosition - 12, size: 8, font: helvetica, color: rgb(0, 0, 0) });
        xPos += colWidths[i];
      });
      yPosition -= 18;

      if (item.subItems && item.subItems.length > 0) {
        item.subItems.forEach((sub, idx) => {
          if (yPosition < 180) {
            page = pdfDoc.addPage([595, 842]);
            yPosition = height - 50;
          }

          page.drawRectangle({ x: 30, y: yPosition - 18, width: width - 60, height: 18, color: rowBg });
          
          xPos = 35;
          const rowData = [
            '', '',
            `   ${String.fromCharCode(97 + idx)}) ${truncate(sub.description, 35)}`,
            sub.quantity.toFixed(2),
            sub.unit,
            sub.rate.toFixed(2),
            sub.amount.toFixed(2)
          ];
          
          rowData.forEach((text, i) => {
            const align = i >= 3 ? 'right' : 'left';
            const textX = align === 'right' ? xPos + colWidths[i] - 5 : xPos;
            page.drawText(text, { x: textX, y: yPosition - 12, size: 8, font: helvetica, color: rgb(0.2, 0.2, 0.2) });
            xPos += colWidths[i];
          });
          yPosition -= 18;
        });
      }
    }
  });

  // Summary Section
  yPosition -= 15;
  
  const summaryItems = [
    { label: 'Itemwise Total', value: data.itemwiseTotal },
    { label: 'Add: GST @18%', value: data.gstAmount },
    { label: 'Cost of Civil Work (Excl. LWC)', value: data.costExclLWC },
    { label: 'Add: LWC @1%', value: data.lwcAmount },
    { label: 'Cost of Civil Work (Incl. LWC)', value: data.costInclLWC },
  ];

  if (data.contingency > 0) {
    summaryItems.push({ label: 'Add: Contingency', value: data.contingency });
  }

  summaryItems.forEach((item) => {
    if (yPosition < 100) {
      page = pdfDoc.addPage([595, 842]);
      yPosition = height - 50;
    }

    page.drawText(item.label, { x: 350, y: yPosition, size: 9, font: helvetica, color: rgb(0, 0, 0) });
    page.drawText(`Rs. ${item.value.toFixed(2)}`, { x: 480, y: yPosition, size: 9, font: helvetica, color: rgb(0, 0, 0) });
    yPosition -= 15;
  });

  // Grand Total
  page.drawRectangle({
    x: 330,
    y: yPosition - 30,
    width: 235,
    height: 30,
    color: successColor,
  });

  page.drawText('GRAND TOTAL (SAY)', {
    x: 340,
    y: yPosition - 18,
    size: 11,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(`Rs. ${data.grandTotal.toFixed(2)}`, {
    x: 480,
    y: yPosition - 18,
    size: 12,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  yPosition -= 50;

  // Amount in Words
  page.drawRectangle({
    x: 30,
    y: yPosition - 30,
    width: width - 60,
    height: 30,
    color: lightBg,
    borderColor: accentColor,
    borderWidth: 1,
  });

  page.drawText('Amount in Words:', { x: 40, y: yPosition - 12, size: 8, font: helveticaBold, color: primaryColor });
  page.drawText(truncate(data.amountInWords, 80), { x: 40, y: yPosition - 24, size: 8, font: helvetica, color: rgb(0, 0, 0) });

  // Footer
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 25,
    color: primaryColor,
  });

  const currentDate = new Date().toLocaleDateString();
  page.drawText(`Generated on: ${currentDate}`, {
    x: 40,
    y: 8,
    size: 7,
    font: helvetica,
    color: rgb(1, 1, 1),
  });

  page.drawText('Probable Estimate - Official Document', {
    x: width - 210,
    y: 8,
    size: 7,
    font: helvetica,
    color: rgb(1, 1, 1),
  });

  return await pdfDoc.save();
}

function truncate(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}
