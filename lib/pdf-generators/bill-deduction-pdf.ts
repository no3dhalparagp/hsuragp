import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';

interface BillDeductionPDFData {
  gpName: string;
  blockName: string;
  workName: string;
  activityCode: string;
  fund: string;
  estimatedAmount: string;
  nitNo: string;
  nitDate: string;
  workSlNo: string;
  woMemoNo: string;
  woDate: string;
  agreementNo: string; // usually same as WO in some contexts, but let's keep separate
  agreementDate: string;
  commencementDate: string;
  completionDate: string;
  measurementDate: string;
  agencyName: string;
  agencyAddress: string;
  grossBillAmount: number;
  deductions: {
    incomeTax: { percent: string; amount: number };
    gstTds: { percent: string; amount: number };
    labourCess: { percent: string; amount: number };
    securityDeposit: { percent: string; amount: number };
  };
  totalDeduction: number;
  netPayable: number;
  amountInWords: string;
  voucherNo: string;
  voucherDate: string;
  paymentDate: string;
}

export async function generateBillDeductionPDF(data: BillDeductionPDFData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // A4 Landscape maybe? No, image looks Portrait.
  // The image shows split 50-50 logic.
  let page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const margin = 30;
  const contentWidth = width - 2 * margin;

  let y = height - margin;

  // Header Title - Centered
  // "NO.3 DHALPARA GRAM PANCHAYAT"
  const title = "NO.3 DHALPARA GRAM PANCHAYAT";
  const subTitle = "HILI DEVELOPMENT BLOCK, DAKSHIN DINAJPUR";

  const drawCenteredText = (text: string, yPos: number, font: PDFFont, size: number) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - w) / 2, y: yPos, size, font, color: rgb(0, 0, 0) });
  };

  drawCenteredText(title, y, timesRomanBold, 14);
  page.drawLine({
    start: { x: (width - timesRomanBold.widthOfTextAtSize(title, 14)) / 2, y: y - 2 },
    end: { x: (width + timesRomanBold.widthOfTextAtSize(title, 14)) / 2, y: y - 2 },
    thickness: 1
  });

  y -= 15;
  drawCenteredText(subTitle, y, timesRoman, 10);
  page.drawLine({
    start: { x: (width - timesRoman.widthOfTextAtSize(subTitle, 10)) / 2, y: y - 2 },
    end: { x: (width + timesRoman.widthOfTextAtSize(subTitle, 10)) / 2, y: y - 2 },
    thickness: 1
  });

  y -= 20;

  // BILL DETAILS Title right aligned? Image says "BILL DETAILS"
  // Actually image shows "Name of work:-" on left, "BILL DETAILS" centered on right column?
  // Let's create a layout.

  const midX = width / 2;

  // Left Column Start
  let leftY = y;
  const leftX = margin;
  const rightX = midX + 10;

  // Name of work
  page.drawText("Name of work:-", { x: leftX, y: leftY, size: 10, font: helveticaBold });
  leftY -= 12;
  const workNameLines = splitText(data.workName, helvetica, 9, midX - margin - 10);
  workNameLines.forEach(l => {
    page.drawText(l, { x: leftX, y: leftY, size: 9, font: helvetica });
    leftY -= 11;
  });

  leftY -= 5;
  page.drawText(`Activity Code                         ${data.activityCode}`, { x: leftX, y: leftY, size: 9, font: helveticaBold });

  leftY -= 15;

  // Fund
  page.drawText(`Fund:-     ${data.fund}`, { x: leftX, y: leftY, size: 9, font: helvetica });

  // Estimated Amount on new line
  leftY -= 15;
  page.drawText(`Estimated Amount:-  Rs. ${data.estimatedAmount}`, { x: leftX, y: leftY, size: 9, font: helvetica });

  leftY -= 15;

  // NIT No, Memo No | Date
  page.drawText(`NIT No, Memo.No.       ${data.nitNo}`, { x: leftX, y: leftY, size: 9, font: helvetica });
  page.drawText(`Date:- ${data.nitDate || '..................'}`, { x: leftX + 180, y: leftY, size: 9, font: helvetica });
  leftY -= 12;
  page.drawText(`Work Sl No :-              ${data.workSlNo}`, { x: leftX, y: leftY, size: 9, font: helvetica });
  leftY -= 12;
  page.drawText(`W/O Memo.No.            ${data.woMemoNo}`, { x: leftX, y: leftY, size: 9, font: helvetica });
  page.drawText(`Date:- ${data.woDate || '..................'}`, { x: leftX + 180, y: leftY, size: 9, font: helvetica });
  leftY -= 12;
  page.drawText(`Agreement No.             ${data.agreementNo || '..................'}`, { x: leftX, y: leftY, size: 9, font: helvetica });
  page.drawText(`Date:- ${data.agreementDate || '..................'}`, { x: leftX + 180, y: leftY, size: 9, font: helvetica });

  leftY -= 20;

  // Res No of Artha-O-Parikalpana
  // wrap this text
  const resText = "Res.No.of Artha-O-Parikalpana Upa Samity Meeting-";
  const resLines = splitText(resText, helvetica, 9, 130);
  let resY = leftY;
  resLines.forEach(l => {
    page.drawText(l, { x: leftX, y: resY, size: 9, font: helvetica });
    resY -= 11;
  });
  // Date next to the block
  page.drawText("Date:- ..................", { x: leftX + 140, y: leftY - 5, size: 9, font: helvetica });

  leftY = resY - 10;

  // Commencement
  page.drawText(`Commencement Date of Work:-`, { x: leftX, y: leftY, size: 9, font: helvetica });

  // Align right side of left column
  const alignRightLeftCol = leftX + 180; // Adjusted for better alignment

  page.drawText(data.commencementDate || '..................', { x: alignRightLeftCol, y: leftY, size: 9, font: helvetica });

  leftY -= 15;
  page.drawText(`Completion Date of Work:-`, { x: leftX, y: leftY, size: 9, font: helvetica });
  page.drawText(data.completionDate || '..................', { x: alignRightLeftCol, y: leftY, size: 9, font: helvetica });

  leftY -= 15;
  page.drawText(`Date of Final Measurement of Work:-`, { x: leftX, y: leftY, size: 9, font: helvetica });
  page.drawText(data.measurementDate || '..................', { x: alignRightLeftCol, y: leftY, size: 9, font: helvetica });

  leftY -= 20;
  page.drawText(`Name of Agency awareded the work:-`, { x: leftX, y: leftY, size: 9, font: helvetica });
  leftY -= 12;
  page.drawText(data.agencyName, { x: leftX, y: leftY, size: 9, font: helveticaBold });

  if (data.agencyAddress) {
    leftY -= 12;
    const addrLines = splitText(data.agencyAddress, helvetica, 8, midX - margin);
    addrLines.forEach(l => {
      page.drawText(l, { x: leftX, y: leftY, size: 8, font: helvetica });
      leftY -= 10;
    });
  }


  // --- Right Column (Financials) ---
  let rightY = y;

  // Actually centered relative to right column?
  page.drawText("BILL DETAILS", { x: rightX + 60, y: rightY, size: 10, font: helveticaBold });
  // Underline
  page.drawLine({ start: { x: rightX + 60, y: rightY - 2 }, end: { x: rightX + 130, y: rightY - 2 }, thickness: 1 });

  rightY -= 20;

  // Gross Bill Amount
  page.drawText("Gross Bill Amount:-", { x: rightX, y: rightY, size: 10, font: helveticaBold });
  // Since we rounded, let's keep toFixed(2) to show .00 or just remove? User said "rounded". Standard bill has .00.
  page.drawText(`Rs. ${data.grossBillAmount.toFixed(2)}`, { x: width - margin - 70, y: rightY, size: 10, font: helveticaBold });

  rightY -= 25;
  page.drawText("Deductions:-", { x: rightX, y: rightY, size: 10, font: helveticaBold });

  rightY -= 15;

  // Helper for deduction line
  const drawDeduction = (label: string, percent: string, amount: number) => {
    page.drawText(`Less ${label} @`, { x: rightX, y: rightY, size: 9, font: helvetica });
    page.drawText(`${percent}%`, { x: rightX + 140, y: rightY, size: 9, font: helvetica });
    page.drawText(`Rs. ${amount.toFixed(2)}`, { x: width - margin - 70, y: rightY, size: 9, font: helvetica });
    rightY -= 15;
  };

  drawDeduction("Income Tax", data.deductions.incomeTax.percent, data.deductions.incomeTax.amount);
  drawDeduction("GST(TDS)", data.deductions.gstTds.percent, data.deductions.gstTds.amount); // Image has GST(TDS) as 0.00 usually?
  drawDeduction("Labour Welfare Cess", data.deductions.labourCess.percent, data.deductions.labourCess.amount);

  rightY -= 5;
  if (parseFloat(data.deductions.securityDeposit.percent) > 0) {
    drawDeduction("Security Deposit", data.deductions.securityDeposit.percent, data.deductions.securityDeposit.amount);
  }

  // Total Deduction line
  // Adjust position: Draw line slightly above the Total Deduction text (which is at rightY)
  // And aligned with the amount column if possible, or full width. 
  // Let's make it span the amount area predominantly for clarity.
  page.drawLine({ start: { x: width - margin - 80, y: rightY + 5 }, end: { x: width - margin, y: rightY + 5 }, thickness: 0.5 });

  page.drawText("Total Deduction", { x: rightX, y: rightY, size: 9, font: helveticaBold });
  page.drawText(`Rs. ${data.totalDeduction.toFixed(2)}`, { x: width - margin - 70, y: rightY, size: 9, font: helveticaBold });

  rightY -= 15;
  page.drawText("Net Payable Amount", { x: rightX, y: rightY, size: 10, font: helveticaBold });
  page.drawText(`Rs. ${data.netPayable.toFixed(2)}`, { x: width - margin - 70, y: rightY, size: 10, font: helveticaBold });

  rightY -= 20;
  // Amount in words
  const ruleText = `[Rule: ${data.amountInWords}]`;
  const ruleLines = splitText(ruleText, helveticaBold, 9, width - rightX - margin);
  ruleLines.forEach(l => {
    page.drawText(l, { x: rightX, y: rightY, size: 9, font: helveticaBold, lineHeight: 12 });
    rightY -= 12;
  });

  rightY -= 40;
  page.drawText("All necessary deduction has been made by me", { x: rightX, y: rightY, size: 9, font: helvetica });

  rightY -= 40;
  page.drawLine({ start: { x: rightX + 50, y: rightY }, end: { x: width - margin, y: rightY }, thickness: 0.5 }); // dotted usually?
  page.drawText("Signature of E.A.", { x: rightX + 80, y: rightY - 12, size: 9, font: helvetica });


  // Vertical Line separate
  // Find lowest Y
  const lowestY = Math.min(leftY, rightY) - 20;

  page.drawLine({
    start: { x: midX, y: height - margin - 35 },
    end: { x: midX, y: lowestY },
    thickness: 1
  });

  y = lowestY - 20;

  // Certify text
  const certify = "Certified that all necessary checks have been applied as per Govt. Rules in this office and the payment has been made to proper party. The Bill has been paid by PFMS/Cheque No.................. Dated................. Of 15TH. CFC Fund";
  const certLines = splitText(certify, helvetica, 9, width - 2 * margin);
  certLines.forEach(l => {
    page.drawText(l, { x: margin, y, size: 9, font: helvetica });
    y -= 12;
  });

  y -= 40;

  // Signatures Row 1
  // Signature of E.A. (With Seal) - Left
  // Signature of Pradhan (With Seal) - Right

  const sigY1 = y;
  page.drawText("_________________________", { x: margin, y: sigY1, size: 10, font: helvetica });
  page.drawText("Signature of E.A.(With Seal)", { x: margin, y: sigY1 - 15, size: 9, font: helvetica });

  page.drawText("_________________________", { x: width - margin - 180, y: sigY1, size: 10, font: helvetica });
  page.drawText("Signature of Pradhan (With Seal)", { x: width - margin - 180, y: sigY1 - 15, size: 9, font: helvetica });

  y -= 60;

  // As per details above agreed
  page.drawText("As per details above agreed to receive an amount", { x: margin, y, size: 9, font: helvetica });
  page.drawText("of", { x: margin, y: y - 12, size: 9, font: helvetica });

  page.drawText(`Rs. ${data.netPayable.toFixed(2)}`, { x: margin + 250, y, size: 9, font: helveticaBold });

  y -= 30;
  page.drawText(`In Words:-   [${data.amountInWords}]`, { x: margin + 10, y, size: 9, font: helveticaBold });

  y -= 60;

  // Signature of Contractor (Center of Right Half?)
  page.drawText("_________________________", { x: midX - 50, y, size: 10, font: helvetica });
  page.drawText("Signature of the Contractor (With Seal)", { x: midX - 60, y: y - 15, size: 9, font: helvetica });

  // Stamp Box
  page.drawRectangle({
    x: width - margin - 80,
    y: y - 20,
    width: 80,
    height: 60,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("Rev.Stamp worth", { x: width - margin - 75, y: y + 20, size: 8, font: helvetica });
  page.drawText("Rs.1.00 to be affixed", { x: width - margin - 78, y: y + 10, size: 8, font: helvetica });

  y -= 50; // Below stamp box

  y -= 20;

  // Entry text
  page.drawText(`The above bill has been entered in the Cash Book Vide Voucher No. ${data.voucherNo || '..................'} Dated ${data.voucherDate || '..................'} And Cash Book Page No.-`, { x: margin, y, size: 9, font: helvetica });

  y -= 40;
  // Signature of Secretary
  page.drawText("_________________________", { x: width - margin - 180, y, size: 10, font: helvetica });
  page.drawText("Signature of Secretary(With Seal)", { x: width - margin - 180, y: y - 15, size: 9, font: helvetica });


  return await pdfDoc.save();
}

// Helper to split text
function splitText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = font.widthOfTextAtSize(currentLine + " " + word, size);
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

