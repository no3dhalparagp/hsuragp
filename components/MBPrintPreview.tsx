"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, X, FileDown, Loader2 } from "lucide-react";
import { MBEntry, MBPrintPreviewProps, PrintRow } from "./MBPrint/types";
import { CoverPage } from "./MBPrint/CoverPage";
import { RulesPage } from "./MBPrint/RulesPage";
import { DetailsPage } from "./MBPrint/DetailsPage";
import { MeasurementPage } from "./MBPrint/MeasurementPage";
import { AbstractPage } from "./MBPrint/AbstractPage";
import { BlankPage } from "./MBPrint/BlankPage";
import { printStyles } from "./MBPrint/printStyles";

// @ts-ignore
import html2pdf from "html2pdf.js";

export function MBPrintPreview({
  entries,
  workDetails,
  estimateItems = [],
  metadata,
  onClose,
}: MBPrintPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const toAlpha = (n: number) => String.fromCharCode(96 + n);

  const handleGeneratePDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);

    const element = printRef.current;
    
    // Configure options for A4 landscape booklet
    const opt = {
      margin: 0,
      filename: `MB_Booklet_${metadata.mbNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false 
      },
      jsPDF: { 
        unit: "mm", 
        format: "a4", 
        orientation: "landscape" 
      },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const w = window.open("", "_blank");
    if (!w) return alert("Allow popup to print");

    w.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Measurement Book</title>
          <style>${printStyles}</style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);

    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  /* ---------------- MB ROW BUILD ---------------- */

  const rows: PrintRow[] = [];
  let mainSl = 0;
  let subSl = 0;
  let lastEstimateId: string | null = null;

  entries.forEach((e) => {
    const isSub = !!e.subItemId;

    if (e.estimateItemId !== lastEstimateId) {
      mainSl++;
      subSl = 0;
      lastEstimateId = e.estimateItemId;

      const parent = estimateItems.find((i) => i.id === e.estimateItemId);
      if (parent) {
        rows.push({
          type: "group-header",
          slNo: mainSl,
          description: parent.description,
          schedulePageNo: parent.schedulePageNo,
        });
      }
    }

    // For sub-items, show numbering like 1(a), 1(b), etc.
    const slNo = isSub ? `${mainSl}(${toAlpha(++subSl)})` : mainSl;

    rows.push({
      type: "header",
      entry: e,
      slNo,
      hasMeasurements: !!e.measurements?.length,
      showParentHeader: false,
      isSubItem: isSub,
    });

    e.measurements?.forEach((m, i) => {
      rows.push({
        type: "measurement",
        measurement: m,
        idx: i + 1,
        parentEntry: e,
      });
    });

    if (e.measurements?.length) {
      rows.push({ type: "total", entry: e });
    }
  });

  /* ---------------- PAGINATION ---------------- */

  // We reserve 2 lines per page for Brought forward / Carried forward
  // so effective data lines per page are slightly reduced.
  const LINES = 20;
  const pages: PrintRow[][] = [];

  // First, group rows into logical blocks so that
  // a header + its measurements + its total never split across pages.
  const blocks: PrintRow[][] = [];
  for (let i = 0; i < rows.length; ) {
    const r = rows[i];

    // Group-header stands alone as its own block
    if (r.type === "group-header") {
      blocks.push([r]);
      i += 1;
      continue;
    }

    if (r.type === "header") {
      const block: PrintRow[] = [r];
      let j = i + 1;
      while (
        j < rows.length &&
        rows[j].type !== "header" &&
        rows[j].type !== "group-header"
      ) {
        block.push(rows[j]);
        j++;
      }
      blocks.push(block);
      i = j;
      continue;
    }

    // Fallback: single row block
    blocks.push([r]);
    i += 1;
  }

  // Now paginate by blocks
  let currentPage: PrintRow[] = [];
  let currentCount = 0;

  const blockSize = (block: PrintRow[]) =>
    block.reduce((sum, r) => {
      let lines = 1;
      if (r.type === "group-header") lines = 2;
      else if (r.type === "header") {
        const descLen = r.entry.workItemDescription?.length || 0;
        // Estimate: 25 chars per line for the description column
        const textLines = Math.ceil(descLen / 25) || 1;
        lines = Math.max(1, textLines);
      }
      return sum + lines;
    }, 0);

  blocks.forEach((block) => {
    const need = blockSize(block);
    if (currentCount + need > LINES && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentCount = 0;
    }
    currentPage.push(...block);
    currentCount += need;
  });

  if (currentPage.length) pages.push(currentPage);

  /* ---------------- CARRY / BROUGHT FORWARD ---------------- */

  const pageSummaries = pages.map((pageRows) => {
    const pageQuantity = pageRows
      .filter((r) => r.type === "total")
      .reduce(
        (sum, r) => sum + (r.type === "total" ? r.entry.quantityExecuted : 0),
        0,
      );
    const pageAmount = pageRows
      .filter((r) => r.type === "total")
      .reduce((sum, r) => sum + (r.type === "total" ? r.entry.amount : 0), 0);
    return { pageQuantity, pageAmount };
  });

  let runningQuantity = 0;
  let runningAmount = 0;

  const measurementPages = pages.map((r, i) => {
    const { pageQuantity, pageAmount } = pageSummaries[i];
    const broughtForwardQuantity = runningQuantity;
    const broughtForwardAmount = runningAmount;

    runningQuantity += pageQuantity;
    runningAmount += pageAmount;

    const carryForwardQuantity = runningQuantity;
    const carryForwardAmount = runningAmount;

    return (
      <MeasurementPage
        key={i}
        rows={r}
        pageIndex={i}
        mbNumber={metadata.mbNumber}
        metadata={metadata}
        broughtForwardQuantity={broughtForwardQuantity}
        broughtForwardAmount={broughtForwardAmount}
        carryForwardQuantity={carryForwardQuantity}
        carryForwardAmount={carryForwardAmount}
      />
    );
  });

  // Extract financial details for AbstractPage
  const aap = workDetails?.ApprovedActionPlanDetails || {};
  const estimatedCost = aap.estimatedCost || 0;

  const aoc = workDetails?.AwardofContract || {};
  const workOrderDetails = aoc?.workorderdetails?.[0] || {};
  const bidAgency = workOrderDetails?.Bidagency || {};
  const tenderedAmount = bidAgency?.biddingAmount || 0;

  const allPages: JSX.Element[] = [
    <CoverPage key="c" metadata={metadata} />,
    <RulesPage key="r" />,
    <DetailsPage key="d" workDetails={workDetails} />,
    ...measurementPages,
    <AbstractPage
      key="a"
      pageNo={measurementPages.length + 4}
      entries={entries}
      metadata={metadata}
      estimatedCost={estimatedCost}
      tenderedAmount={tenderedAmount}
    />,
  ];

  // Ensure we have an even number of logical pages so each sheet has two sides.
  // We add at most ONE blank page to avoid duplicated blank pages in print.
  if (allPages.length % 2 === 1) {
    const nextNo = allPages.length + 1;
    allPages.push(<BlankPage key={`blank-${nextNo}`} pageNo={nextNo} />);
  }

  /* ---------------- BOOKLET IMPOSITION ---------------- */

  const sheets: JSX.Element[][] = [];
  const pageCount = allPages.length;
  const sheetCount = pageCount / 2;

  for (let sheetIndex = 0; sheetIndex < sheetCount; sheetIndex++) {
    const leftIndex =
      sheetIndex % 2 === 0 ? pageCount - 1 - sheetIndex : sheetIndex;
    const rightIndex =
      sheetIndex % 2 === 0 ? sheetIndex : pageCount - 1 - sheetIndex;

    sheets.push([allPages[leftIndex], allPages[rightIndex]]);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      <div className="bg-white m-6 rounded shadow flex flex-col h-full">
        <div className="p-4 border-b flex justify-between">
          <b>MB Print Preview</b>
          <div className="flex gap-2">
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button onClick={handleGeneratePDF} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4 mr-2" /> Generate PDF
                </>
              )}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              <X />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-200 p-6">
          <div ref={printRef}>
            {sheets.map((s, i) => (
              <div key={i} className="sheet">
                {s[0]}
                {s[1]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}