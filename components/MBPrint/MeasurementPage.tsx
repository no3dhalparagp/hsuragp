"use client";

import React from "react";
import { PrintRow } from "./types";

interface MeasurementPageProps {

  rows: PrintRow[];

  pageIndex: number;

  mbNumber: string;

  metadata: any;

  broughtForwardQuantity: number;

  broughtForwardAmount: number;

  carryForwardQuantity: number;

  carryForwardAmount: number;

}

export function MeasurementPage({

  rows,

  pageIndex,

  mbNumber,

  metadata,

  broughtForwardQuantity,

  broughtForwardAmount,

  carryForwardQuantity,

  carryForwardAmount,

}: MeasurementPageProps) {

  const totalPages =
    metadata.totalMeasurementPages ?? 1;

  const showBroughtForward =
    pageIndex > 0;

  const showCarryForward =
    pageIndex < totalPages - 1;

  // Page numbers: Cover=1, Rules=2, Details=3, then measurement pages start at 4
  const pageNumber = (metadata.startPage ? metadata.startPage + pageIndex : pageIndex + 4);

  return (

    <div className="page-container">

      <div className="page-border">

        {/* HEADER */}

        <div className="page-header">

          <div>

            <b>
              Measurement Book No:
            </b>{" "}
            {mbNumber}

          </div>

          <div className="page-number">

            Page No: {pageNumber}

          </div>

        </div>

        {/* CONTENT */}

        <div className="content">

          <table>

            <thead>

              <tr>

                <th style={{ width: "6%" }}>
                  Sl No
                </th>

                <th className="cell-description" style={{ width: "34%" }}>
                  Particulars
                </th>

                <th style={{ width: "6%" }}>
                  No
                </th>

                <th style={{ width: "12%" }}>
                  Length
                </th>

                <th style={{ width: "12%" }}>
                  Breadth
                </th>

                <th style={{ width: "12%" }}>
                  Depth
                </th>

                <th style={{ width: "10%" }}>
                  Quantity
                </th>

                <th style={{ width: "8%" }}>
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              {/* BROUGHT FORWARD */}

              {showBroughtForward && (

                <tr className="total-row">

                  <td colSpan={6}>
                    Brought Forward
                  </td>

                  <td className="text-right">
                    {(Number(broughtForwardQuantity) || 0).toFixed(3)}
                  </td>
                  <td className="text-right">
                    {(Number(broughtForwardAmount) || 0).toFixed(2)}
                  </td>

                </tr>

              )}

              {/* MAIN ROWS */}

              {rows.map((row, index): React.ReactNode => {

                /* GROUP HEADER */

                if (row.type === "group-header") {

                  return (

                    <tr
                      key={index}
                      className="group-header"
                    >

                      <td className="text-center bold">

                        {row.slNo}

                      </td>

                      <td colSpan={7} className="bold cell-description-wide">

                        {row.description}

                      </td>

                    </tr>

                  );

                }

                /* ITEM HEADER */

                if (row.type === "header") {

                  return (

                    <tr key={index}>

                      <td className="text-center">

                        {row.slNo}

                      </td>

                      <td colSpan={7} className="cell-description-wide">

                        {row.entry.workItemDescription}

                      </td>

                    </tr>

                  );

                }

                /* MEASUREMENT ROW */

                if (row.type === "measurement") {

                  const m =
                    row.measurement;

                  return (

                    <tr key={index}>

                      {/* SL NO */}
                      <td></td>

                      {/* DESCRIPTION / PARTICULARS */}
                      <td className="cell-description">
                        {(m.description && String(m.description).trim()) || row.parentEntry?.workItemDescription || ""}
                      </td>

                      {/* NOS */}
                      <td className="text-center">

                        {m.nos}

                      </td>

                      {/* LENGTH */}
                      <td className="text-right">

                        {m.length}

                      </td>

                      {/* BREADTH */}
                      <td className="text-right">

                        {m.breadth}

                      </td>

                      {/* DEPTH */}
                      <td className="text-right">

                        {m.depth}

                      </td>

                      {/* QUANTITY */}
                      <td className="text-right">

                        {m.quantity}

                      </td>

                      {/* AMOUNT */}
                      <td></td>

                    </tr>

                  );

                }

                /* TOTAL */

                if (row.type === "total") {

                  return (

                    <tr
                      key={index}
                      className="total-row"
                    >

                      <td colSpan={6}>
                        Total
                      </td>

                      <td className="text-right">
                        {(Number(row.entry.quantityExecuted) || 0).toFixed(3)}
                      </td>
                      <td className="text-right">
                        {(Number(row.entry.amount) || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                }

                return null;
              })}

              {/* CARRIED FORWARD */}

              {showCarryForward && (
                <tr className="total-row">
                  <td colSpan={6}>
                    Carried Forward
                  </td>
                  <td className="text-right">
                    {(Number(carryForwardQuantity) || 0).toFixed(3)}
                  </td>
                  <td className="text-right">
                    {(Number(carryForwardAmount) || 0).toFixed(2)}
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* SIGNATURE */}

        <div className="signature-block">

          <div className="signature-line">

            Measured by

          </div>

          <div className="signature-line">

            Checked by

          </div>

        </div>

      </div>

    </div>

  );

}
