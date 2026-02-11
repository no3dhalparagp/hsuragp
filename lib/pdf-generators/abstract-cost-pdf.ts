import { generate } from '@pdfme/generator';
import { text, image, barcodes } from '@pdfme/schemas';
import { table } from '@pdfme/schemas';

interface EstimateItem {
  slNo: number;
  schedulePageNo: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  subItems?: Array<{
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
  }>;
}

interface AbstractCostPDFData {
  projectName: string;
  projectLocation: string;
  activityCode: string;
  fund: string;
  items: EstimateItem[];
  itemwiseTotal: number;
  gstAmount: number;
  costCivilWork: number;
  lwcAmount: number;
  costCivilWorkIncl: number;
  contingencyAmount: number;
  grandTotal: number;
  sayAmount: number;
  amountInWords: string;
}

export async function generateAbstractPDF(data: AbstractCostPDFData): Promise<Uint8Array> {
  // Fetch the template
  const templateResponse = await fetch('/templates/probable-estimate-abstract.json');
  if (!templateResponse.ok) {
    throw new Error('Failed to load abstract estimate template');
  }
  const template = await templateResponse.json();

  // Prepare table data
  const tableData: string[][] = [];
  
  data.items.forEach(item => {
    // Add main item row
    tableData.push([
      item.slNo.toString(),
      item.schedulePageNo || '',
      item.description,
      item.quantity.toFixed(2),
      item.unit,
      item.rate.toFixed(2),
      item.amount.toFixed(2)
    ]);

    // Add sub-item rows if they exist
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach((sub, idx) => {
        tableData.push([
          '', // Sl No empty
          '', // Page No empty
          `   ${String.fromCharCode(97 + idx)}) ${sub.description}`, // Indented description
          sub.quantity.toFixed(2),
          sub.unit,
          sub.rate.toFixed(2),
          sub.amount.toFixed(2)
        ]);
      });
    }
  });

  // Define inputs
  const inputs = [{
    projectName: data.projectName,
    projectLocation: data.projectLocation,
    activityCode: data.activityCode,
    fund: data.fund,
    workitemstable: JSON.stringify(tableData),
    itemwiseTotal: data.itemwiseTotal.toFixed(2),
    gstPercent: "18",
    gstAmount: data.gstAmount.toFixed(2),
    costCivilWork: data.costCivilWork.toFixed(2),
    lwcAmount: data.lwcAmount.toFixed(2),
    costCivilWorkIncl: data.costCivilWorkIncl.toFixed(2),
    contingencyAmount: data.contingencyAmount.toFixed(2),
    grandTotal: data.grandTotal.toFixed(2),
    sayAmount: data.sayAmount.toFixed(2),
    amountInWords: data.amountInWords,
  }];

  // Define plugins
  const plugins = {
    text,
    image,
    qrcode: barcodes.qrcode,
    table,
  };

  // Generate PDF
  const pdf = await generate({ template, inputs, plugins });
  return pdf;
}
