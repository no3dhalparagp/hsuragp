import React from "react";
import { convertToWords } from "@/utils/convertToWords";
import { MBEntry, MBPrintMetadata } from "./types";

interface AbstractPageProps {
  pageNo: number;
  entries: MBEntry[];
  estimatedCost: string | number;
  tenderedAmount: string | number;
  metadata: MBPrintMetadata;
}

export const AbstractPage: React.FC<AbstractPageProps> = ({
  pageNo,
  entries,
  estimatedCost,
  tenderedAmount,
  metadata,
}) => {
  // Financial calculations wrapped to avoid NaN / negative issues
  const safeNumber = (val: any): number => {
    const n = typeof val === "number" ? val : parseFloat(val ?? "0");
    return Number.isFinite(n) ? n : 0;
  };

  // 1. Calculate Itemwise Total
  const itemwiseTotal = Math.max(
    0,
    entries.reduce((sum, entry) => sum + safeNumber(entry.amount), 0),
  );

  // 2. Calculate Contractual Percentage
  const estCost = Math.max(0, safeNumber(estimatedCost));
  const tendAmount = Math.max(0, safeNumber(tenderedAmount));
  let percentage = 0;
  let isLess = true;

  if (estCost > 0 && tendAmount > 0) {
    if (tendAmount < estCost) {
      percentage =
        Math.round(((estCost - tendAmount) / estCost) * 100 * 100) / 100;
      isLess = true;
    } else if (tendAmount > estCost) {
      percentage =
        Math.round(((tendAmount - estCost) / estCost) * 100 * 100) / 100;
      isLess = false;
    } else {
      percentage = 0;
    }
  }

  // 3. Calculate Less/Add Amount
  const adjustmentAmount =
    percentage > 0 ? (itemwiseTotal * percentage) / 100 : 0;
  const actualValue = isLess
    ? itemwiseTotal - adjustmentAmount
    : itemwiseTotal + adjustmentAmount;

  // 4. Round to nearest integer (SAY)
  const sayValue = Math.round(actualValue);

  // 5. Taxes (CGST 9%, SGST 9%)
  const cgstRate = 9.0;
  const sgstRate = 9.0;
  const cgstAmount = Math.round((sayValue * cgstRate) / 100);
  const sgstAmount = Math.round((sayValue * sgstRate) / 100);

  // 6. Sub Total
  const subTotal = sayValue + cgstAmount + sgstAmount;

  // 7. Cess (1%)
  const cessRate = 1.0;
  const cessAmount = Math.round((subTotal * cessRate) / 100);

  // 8. Gross Bill Amount
  const grossBillAmount = subTotal + cessAmount;

  // Format helper
  const fmt = (num: number) => num.toFixed(2);

  return (
    <div className="page-container" key="abstract-page">
      <div className="page-border">
        <div className="page-header">
          <div>MB No: {metadata.mbNumber}</div>
          <div style={{ textAlign: "center", flex: 1 }}>ABSTRACT OF COST</div>
          <div>Page No: {pageNo}</div>
        </div>

        <div style={{ width: "100%", margin: "0 auto", fontSize: "11px" }}>
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Description</th>
                <th style={{ textAlign: "right", width: "120px" }}>
                  Amount (Rs.)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold" }}>Total of Work Value</td>
                <td className="text-right" style={{ fontWeight: "bold" }}>
                  {fmt(itemwiseTotal)}
                </td>
              </tr>
              <tr>
                <td>
                  {isLess ? "Less Contractor Less" : "Add Contractor Add"} (
                  {percentage.toFixed(2)}%)
                </td>
                <td className="text-right">
                  {isLess ? "(-)" : "(+)"} {fmt(adjustmentAmount)}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold" }}>Total Value of Work Done</td>
                <td className="text-right" style={{ fontWeight: "bold" }}>
                  {fmt(actualValue)}
                </td>
              </tr>
              <tr>
                <td>SAY</td>
                <td className="text-right">{fmt(sayValue)}</td>
              </tr>
              <tr>
                <td>Add CGST @ {cgstRate}%</td>
                <td className="text-right">{fmt(cgstAmount)}</td>
              </tr>
              <tr>
                <td>Add SGST @ {sgstRate}%</td>
                <td className="text-right">{fmt(sgstAmount)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold" }}>Sub Total</td>
                <td className="text-right" style={{ fontWeight: "bold" }}>
                  {fmt(subTotal)}
                </td>
              </tr>
              <tr>
                <td>Add Labour Cess @ {cessRate}%</td>
                <td className="text-right">{fmt(cessAmount)}</td>
              </tr>
              <tr className="total-row">
                <td style={{ fontSize: "12px", fontWeight: "bold" }}>
                  GROSS BILL AMOUNT
                </td>
                <td
                  className="text-right"
                  style={{ fontSize: "12px", fontWeight: "bold" }}
                >
                  Rs. {fmt(grossBillAmount)}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: "20px", fontWeight: "bold" }}>
            (Rupees {convertToWords(grossBillAmount)} Only)
          </div>

          <div className="signature-block">
            <div className="signature-line">
              Measured by
              <br />
              {metadata.measuredBy}
            </div>
            <div className="signature-line">
              Checked by
              <br />
              (Signature & Designation)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
