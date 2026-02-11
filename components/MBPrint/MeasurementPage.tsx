import React from "react";
import { PrintRow, MBEntry, MBPrintMetadata } from "./types";
import { BlankPage } from "./BlankPage";

interface MeasurementPageProps {
  rows: PrintRow[];
  pageIndex: number;
  mbNumber: string;
  metadata: MBPrintMetadata;
  broughtForwardQuantity: number;
  broughtForwardAmount: number;
  carryForwardQuantity: number;
  carryForwardAmount: number;
}

const getFullDescription = (entry: MBEntry, showParentHeader: boolean) => {
  // Original logic was simple:
  // if (!estimateItems || estimateItems.length === 0) return entry.workItemDescription;
  // return entry.workItemDescription;
  return entry.workItemDescription;
};

export const MeasurementPage: React.FC<MeasurementPageProps> = ({
  rows,
  pageIndex,
  mbNumber,
  metadata,
  broughtForwardQuantity,
  broughtForwardAmount,
  carryForwardQuantity,
  carryForwardAmount,
}) => {
  if (!rows || rows.length === 0) return <BlankPage pageNo={pageIndex + 4} />;

  const displayPageNo = pageIndex + 4;

  return (
    <div className="page-container" key={`measure-${displayPageNo}`}>
      <div className="page-border">
        <div className="page-header">
          <div>MB No: {mbNumber}</div>
          <div style={{ textAlign: "center", flex: 1 }}>MEASUREMENT BOOK</div>
          <div>Page No: {displayPageNo}</div>
        </div>

        <div className="content">
          <table>
            <thead>
              <tr>
                <th style={{ width: "4%" }}>Sl</th>
                <th style={{ width: "6%" }}>Page No</th>
                <th style={{ width: "28%" }}>Particulars</th>
                <th style={{ width: "4%" }}>No</th>
                <th style={{ width: "6%" }}>L (m)</th>
                <th style={{ width: "6%" }}>B (m)</th>
                <th style={{ width: "6%" }}>D (m)</th>
                <th style={{ width: "10%" }}>Contents</th>
                <th style={{ width: "4%" }}>Unit</th>
                <th style={{ width: "10%" }}>Rate</th>
                <th style={{ width: "16%" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Brought forward row */}
              {(broughtForwardQuantity > 0 || broughtForwardAmount > 0) && (
                <tr>
                  <td colSpan={7} className="text-right">
                    Brought forward
                  </td>
                  <td className="text-right">
                    {broughtForwardQuantity.toFixed(3)}
                  </td>
                  <td></td>
                  <td></td>
                  <td className="text-right">
                    {broughtForwardAmount.toFixed(2)}
                  </td>
                </tr>
              )}

              {rows.map((row, idx) => {
                if (row.type === "group-header") {
                  return (
                    <tr
                      key={`group-${idx}`}
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      <td className="text-center">{row.slNo}</td>
                      <td className="text-center">
                        {row.schedulePageNo || ""}
                      </td>
                      <td colSpan={9}>{row.description}</td>
                    </tr>
                  );
                } else if (row.type === "header") {
                  const entry = row.entry;
                  const hasMeasurements = row.hasMeasurements;
                  const isSubItem = row.isSubItem;

                  if (!hasMeasurements) {
                    return (
                      <tr key={`header-${idx}`}>
                        <td
                          className="text-center"
                          style={{ fontWeight: "bold" }}
                        >
                          {row.slNo}
                        </td>
                        <td className="text-center">
                          {/* Schedule Page No only for parent/main items if available in entry, but usually in group-header */}
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            paddingLeft: isSubItem ? "20px" : "4px",
                          }}
                        >
                          {getFullDescription(entry, row.showParentHeader)}
                        </td>
                        <td className="text-center">
                          {entry.measurements?.[0]?.nos || ""}
                        </td>
                        <td className="text-center">
                          {entry.measurements?.[0]?.length?.toFixed(2) || ""}
                        </td>
                        <td className="text-center">
                          {entry.measurements?.[0]?.breadth?.toFixed(2) || ""}
                        </td>
                        <td className="text-center">
                          {entry.measurements?.[0]?.depth?.toFixed(2) || ""}
                        </td>
                        <td
                          className="text-right"
                          style={{ fontWeight: "bold" }}
                        >
                          {entry.quantityExecuted.toFixed(3)}
                        </td>
                        <td className="text-center">{entry.unit}</td>
                        <td className="text-right">{entry.rate.toFixed(2)}</td>
                        <td className="text-right">
                          {entry.amount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        key={`header-${idx}`}
                        style={{ borderBottom: "none" }}
                      >
                        <td
                          className="text-center"
                          style={{ fontWeight: "bold" }}
                        >
                          {row.slNo}
                        </td>
                        <td className="text-center"></td>
                        <td
                          colSpan={9}
                          style={{
                            fontWeight: "bold",
                            paddingLeft: isSubItem ? "20px" : "4px",
                          }}
                        >
                          {getFullDescription(entry, row.showParentHeader)}
                        </td>
                      </tr>
                    );
                  }
                } else if (row.type === "measurement") {
                  const m = row.measurement;
                  const parentEntry = row.parentEntry;
                  const measurementIndex = row.idx;
                  const rate = parentEntry?.rate || 0;

                  return (
                    <tr
                      key={idx}
                      style={{ borderTop: "none", borderBottom: "none" }}
                    >
                      <td
                        style={{ borderTop: "none", borderBottom: "none" }}
                      ></td>
                      <td
                        style={{ borderTop: "none", borderBottom: "none" }}
                      ></td>
                      <td style={{ paddingLeft: "20px" }}>
                        {m.description || "Measurement"}
                      </td>
                      <td className="text-center">{m.nos || ""}</td>
                      <td className="text-center">
                        {m.length ? m.length.toFixed(2) : ""}
                      </td>
                      <td className="text-center">
                        {m.breadth ? m.breadth.toFixed(2) : ""}
                      </td>
                      <td className="text-center">
                        {m.depth ? m.depth.toFixed(2) : ""}
                      </td>
                      <td className="text-right">
                        {m.quantity ? m.quantity.toFixed(3) : ""}
                      </td>
                      <td></td>
                      <td></td>
                      <td className="text-right">
                        {m.quantity && rate > 0
                          ? (m.quantity * rate).toFixed(2)
                          : ""}
                      </td>
                    </tr>
                  );
                } else {
                  const entry = row.entry;
                  return (
                    <tr key={idx} className="total-row">
                      <td></td>
                      <td></td>
                      <td
                        className="text-right"
                        style={{ paddingRight: "10px" }}
                      >
                        Total:
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-right">
                        {entry.quantityExecuted.toFixed(3)}
                      </td>
                      <td className="text-center">{entry.unit}</td>
                      <td className="text-right">{entry.rate.toFixed(2)}</td>
                      <td className="text-right">
                        {entry.amount.toFixed(2)}
                      </td>
                    </tr>
                  );
                }
              })}

              {/* Carried forward row */}
              {(carryForwardQuantity > 0 || carryForwardAmount > 0) && (
                <tr>
                  <td colSpan={7} className="text-right">
                    Carried forward
                  </td>
                  <td className="text-right">
                    {carryForwardQuantity.toFixed(3)}
                  </td>
                  <td></td>
                  <td></td>
                  <td className="text-right">
                    {carryForwardAmount.toFixed(2)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
          </div>
        </div>
      </div>
    </div>
  );
};
