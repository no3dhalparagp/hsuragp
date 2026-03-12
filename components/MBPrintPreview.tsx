"use client";

import React, { useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Printer, X, FileDown } from "lucide-react";

import {
  MBPrintPreviewProps,
  PrintRow,
  MBEntry,
  Measurement,
} from "./MBPrint/types";

import { CoverPage } from "./MBPrint/CoverPage";
import { RulesPage } from "./MBPrint/RulesPage";
import { DetailsPage } from "./MBPrint/DetailsPage";
import { MeasurementPage } from "./MBPrint/MeasurementPage";
import { AbstractPage } from "./MBPrint/AbstractPage";
import { BlankPage } from "./MBPrint/BlankPage";

import { printStyles } from "./MBPrint/printStyles";

// @ts-ignore
import html2pdf from "html2pdf.js";

/** Ensure measurements is always an array (API may return JSON string or object). */
function normalizeMeasurements(entry: MBEntry): Measurement[] {
  const m = entry.measurements;
  if (Array.isArray(m)) return m;
  if (m == null) return [];
  if (typeof m === "string") {
    try {
      const parsed = JSON.parse(m);
      return Array.isArray(parsed) ? parsed : [parsed].filter(Boolean);
    } catch {
      return [];
    }
  }
  return [m].filter(Boolean);
}

export function MBPrintPreview({
  entries,
  workDetails,
  estimateItems = [],
  metadata,
  onClose,
}: MBPrintPreviewProps) {

  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const toAlpha = (n: number) => String.fromCharCode(97 + n);

  /* ============================================
     BUILD PRINT ROWS
  ============================================ */

  const rows = useMemo(() => {
    const out: PrintRow[] = [];
    let mainSl = 0;
    let subSl = 0;
    let lastEstimateId: string | null = null;

    entries.forEach((entry) => {
      const measurements = normalizeMeasurements(entry);
      const entryWithMeasurements = { ...entry, measurements };

      const parent = estimateItems.find((i) => i.id === entry.estimateItemId);
      const schedulePageNo = parent?.schedulePageNo ?? "";

      if (entry.estimateItemId !== lastEstimateId) {
        mainSl++;
        subSl = 0;
        lastEstimateId = entry.estimateItemId;
        const parentDesc = parent?.description ?? "";
        const cleaned =
          schedulePageNo && parentDesc.startsWith(schedulePageNo)
            ? parentDesc.slice(schedulePageNo.length)
            : parentDesc;
        out.push({
          type: "group-header",
          slNo: mainSl,
          description: cleaned,
          schedulePageNo,
        });
      }

      const baseDesc =
        schedulePageNo && entry.workItemDescription.startsWith(schedulePageNo)
          ? entry.workItemDescription.slice(schedulePageNo.length)
          : entry.workItemDescription;
      const firstParticular = measurements[0]?.description?.trim?.();
      const headerDesc = firstParticular || baseDesc;

      const isSubItem = !!entry.subItemId;
      const slNo = isSubItem ? `${mainSl}(${toAlpha(subSl++)})` : mainSl;

      out.push({
        type: "header",
        entry: { ...entryWithMeasurements, workItemDescription: headerDesc },
        slNo,
        hasMeasurements: measurements.length > 0,
        showParentHeader: false,
        isSubItem,
      });

      measurements.forEach((measurement, idx) => {
        out.push({
          type: "measurement",
          measurement,
          idx: idx + 1,
          parentEntry: entryWithMeasurements,
        });
      });

      if (measurements.length > 0) {
        out.push({ type: "total", entry: entryWithMeasurements });
      }
    });

    return out;
  }, [entries, estimateItems]);

  /* ============================================
     PAGINATION
     Half A4 landscape usable content height:
       Sheet 210mm - page padding 5mm*2 - border padding 4mm*2 - header 10mm - footer 16mm ≈ 156mm
       156mm × 3.7795 px/mm ≈ 590px → use 520px with safety margin
  ============================================ */

  const pages = useMemo(() => {
    const MAX_HEIGHT = 520;

    const estimateHeight = (row: PrintRow) => {
      if (row.type === "group-header") {
        const chars = row.description?.length ?? 0;
        const lines = Math.max(1, Math.ceil(chars / 50));
        return 20 + lines * 16;
      }
      if (row.type === "header") {
        const chars = row.entry.workItemDescription.length;
        const lines = Math.max(1, Math.ceil(chars / 50));
        return 20 + lines * 16;
      }
      if (row.type === "measurement") return 22;
      if (row.type === "total") return 26;
      return 22;
    };

    // Group: header always stays with its measurements + total in same block
    const blocks: PrintRow[][] = [];
    let currentBlock: PrintRow[] = [];

    rows.forEach((row) => {
      if (row.type === "group-header" || row.type === "header") {
        if (currentBlock.length > 0) {
          blocks.push(currentBlock);
          currentBlock = [];
        }
        currentBlock.push(row);
      } else {
        currentBlock.push(row);
      }
    });
    if (currentBlock.length > 0) blocks.push(currentBlock);

    const TRANSFER_ROW = 26; // height reserved for Brought/Carried Forward row

    const newPages: PrintRow[][] = [];
    let currentPage: PrintRow[] = [];
    let pageHeight = 0;

    blocks.forEach((block) => {
      const blockH = block.reduce((sum, row) => sum + estimateHeight(row), 0);
      // Reserve space for a "Carried Forward" row
      const overhead = currentPage.length > 0 ? TRANSFER_ROW : 0;
      if (pageHeight + blockH + overhead > MAX_HEIGHT && currentPage.length > 0) {
        newPages.push(currentPage);
        currentPage = [];
        pageHeight = TRANSFER_ROW; // account for "Brought Forward" on next page
      }
      currentPage.push(...block);
      pageHeight += blockH;
    });

    if (currentPage.length) newPages.push(currentPage);
    return newPages;
  }, [rows]);

  const safeWorkDetails = workDetails ?? {};
  const safeMetadata = {
    mbNumber: metadata?.mbNumber ?? "",
    mbPageNumber: metadata?.mbPageNumber ?? "",
    measuredDate: metadata?.measuredDate ?? "",
    measuredBy: metadata?.measuredBy ?? "",
  };

  /* ============================================
     BUILD MEASUREMENT PAGES
  ============================================ */

  let runningQty = 0;
  let runningAmount = 0;

  const measurementPages = pages.map((pageRows, index) => {
    const pageQty = pageRows
      .filter((r) => r.type === "total")
      .reduce(
        (sum, r) =>
          sum + (r.type === "total" ? Number(r.entry.quantityExecuted) || 0 : 0),
        0
      );

    const pageAmount = pageRows
      .filter((r) => r.type === "total")
      .reduce(
        (sum, r) => sum + (r.type === "total" ? Number(r.entry.amount) || 0 : 0),
        0
      );

    const broughtQty = runningQty;
    const broughtAmt = runningAmount;

    runningQty += pageQty;
    runningAmount += pageAmount;

    return (
      <MeasurementPage
        key={index}
        rows={pageRows}
        pageIndex={index}
        mbNumber={safeMetadata.mbNumber}
        metadata={{
          ...safeMetadata,
          totalMeasurementPages: pages.length,
        }}
        broughtForwardQuantity={broughtQty}
        broughtForwardAmount={broughtAmt}
        carryForwardQuantity={runningQty}
        carryForwardAmount={runningAmount}
      />
    );
  });

  /* ============================================
     ALL PAGES (sequential order)
  ============================================ */

  const estimatedCost =
    workDetails?.ApprovedActionPlanDetails?.estimatedCost ??
    workDetails?.finalEstimateAmount ??
    0;

  const tenderedAmount =
    workDetails?.AwardofContract?.workorderdetails?.[0]?.Bidagency
      ?.biddingAmount ?? 0;

  const allPages: JSX.Element[] = [
    <CoverPage key="cover" metadata={safeMetadata} />,
    <RulesPage key="rules" />,
    <DetailsPage key="details" workDetails={safeWorkDetails} />,
    ...measurementPages,
    <AbstractPage
      key="abstract"
      pageNo={measurementPages.length + 4}
      entries={entries}
      metadata={safeMetadata}
      estimatedCost={estimatedCost}
      tenderedAmount={tenderedAmount}
    />,
  ];

  // Pad to even count so every sheet has two pages
  if (allPages.length % 2 === 1) {
    allPages.push(<BlankPage key="blank" pageNo={allPages.length + 1} />);
  }

  /* ============================================
     BOOKLET SHEETS: saddle-stitch imposition
     Sheet 1 = [Page 1  |  Last Page]
     Sheet 2 = [Page 2  |  2nd-last Page]
     Sheet 3 = [Page 3  |  3rd-last Page]  … and so on.
     When sheets are folded and stacked, pages read in order.
  ============================================ */

  const sheets: JSX.Element[][] = [];
  const total = allPages.length;
  for (let i = 0; i < total / 2; i++) {
    sheets.push([allPages[i], allPages[total - 1 - i]]);
  }

  /* ============================================
     PRINT FUNCTION
  ============================================ */

  const handlePrint = () => {
    if (!printRef.current) return;

    const win = window.open("", "_blank");
    if (!win) return;

    const content = printRef.current.innerHTML;
    const doc = win.document;
    doc.open();
    doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Measurement Book - ${metadata.mbNumber || "Print"}</title>
  <style>${printStyles}</style>
</head>
<body>
  <div class="print-root">${content}</div>
</body>
</html>
    `);
    doc.close();

    const doPrint = () => {
      win.focus();
      win.print();
      win.onafterprint = () => win.close();
    };

    if (doc.readyState === "complete") {
      setTimeout(doPrint, 100);
    } else {
      win.onload = () => setTimeout(doPrint, 100);
    }
  };

  /* ============================================
     PDF FUNCTION
  ============================================ */

  const handlePDF = async () => {
    if (!printRef.current) return;

    setIsGenerating(true);
    try {
      const filename = `mb-${metadata?.mbNumber || "measurement-book"}.pdf`;
      await html2pdf().from(printRef.current).save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  /* ============================================
     UI
  ============================================ */

  return (
    <div className="fixed inset-0 bg-black/80 z-50">
      <div className="bg-white m-6 h-full flex flex-col">

        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <b>MB Print Preview</b>
            <span className="ml-4 text-sm text-gray-500">
              {allPages.length} pages · {sheets.length} sheets (A4 landscape, 2-up)
            </span>
          </div>

          <div className="flex gap-2">
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>

            <Button onClick={handlePDF} disabled={isGenerating}>
              <FileDown className="w-4 h-4 mr-2" />
              PDF
            </Button>

            <Button variant="ghost" onClick={onClose}>
              <X />
            </Button>
          </div>
        </div>

        <div
          ref={printRef}
          className="flex-1 overflow-auto bg-gray-300 p-6 space-y-6"
        >
          {sheets.map((sheet, index) => (
            <div
              key={index}
              className="sheet shadow-lg"
              style={{ margin: "0 auto" }}
            >
              {sheet[0]}
              {sheet[1]}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
