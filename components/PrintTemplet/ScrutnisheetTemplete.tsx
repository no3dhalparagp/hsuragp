

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileDown, Loader2, Printer } from "lucide-react";
import { generatePDF } from "../pdfgenerator";
import { workdetailsforprint } from "@/types";

const templatePath = "/templates/scrutnisheettemplete.json";

type PDFGeneratorProps = {
  workdetails: workdetailsforprint;
};

export default function PDFGeneratorComponent({
  workdetails,
}: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const inputs = [
        {
          field2: `Scrutiny Report of Tender Papers for NIT No. ${
            workdetails.nitDetails.memoNumber
          }/DGP/${new Date(
            workdetails.nitDetails.memoDate
          ).getFullYear()}  Dated: ${
            workdetails.nitDetails.memoDate
              ? new Date(workdetails.nitDetails.memoDate).toLocaleDateString()
              : "N/A"
          } Sl No. ${workdetails.workslno}`,
          field4:
            workdetails.ApprovedActionPlanDetails.activityDescription || "N/A",
          field32: workdetails.nitDetails.endTime
            ? new Date(workdetails.nitDetails.endTime).toLocaleString()
            : "N/A",
          field33: workdetails.nitDetails.technicalBidOpeningDate
            ? new Date(
                workdetails.nitDetails.technicalBidOpeningDate
              ).toLocaleString()
            : "N/A",
          field35: workdetails.ApprovedActionPlanDetails.schemeName,
          field20: workdetails.finalEstimateAmount.toString(),
          emd: workdetails.earnestMoneyFee.toFixed(2),
          pcharge: workdetails.participationFee.toFixed(2),
          field31: workdetails.finalEstimateAmount.toFixed(2),
          agencytable: workdetails.biddingAgencies.map((agency, index) => [
            (index + 1).toString(),
            agency.agencydetails.name,
            workdetails.participationFee.toFixed(2),
            workdetails.earnestMoneyFee.toFixed(2),
            agency.technicalEvelution?.credencial?.sixtyperamtput
              ? "Yes"
              : "No",
            agency.technicalEvelution?.credencial?.workorder ? "Yes" : "No",
            agency.technicalEvelution?.credencial?.paymentcertificate
              ? "Yes"
              : "No",
            agency.technicalEvelution?.credencial?.comcertificat ? "Yes" : "No",
            agency.technicalEvelution?.validityofdocument?.itreturn
              ? "Yes"
              : "No",
            agency.technicalEvelution?.validityofdocument?.gst ? "Yes" : "No",
            agency.technicalEvelution?.validityofdocument?.tradelicence
              ? "Yes"
              : "No",
            agency.technicalEvelution?.validityofdocument?.ptax ? "Yes" : "No",
            agency.technicalEvelution?.byelow ? "Yes" : "No",
            agency.technicalEvelution?.qualify ? "Yes" : "No",
            agency.technicalEvelution?.remarks || "-",
          ]),
          field29: (() => {
            const qualifiedBidders = workdetails.biddingAgencies.filter(
              (agency) => agency.technicalEvelution?.qualify
            ).length;
            const totalBidders = workdetails.biddingAgencies.length;

            if (qualifiedBidders > 0) {
              if (qualifiedBidders >= 3) {
                return `${totalBidders} nos. bidder${
                  totalBidders !== 1 ? "s" : ""
                } have participated in this e-tender and found ${qualifiedBidders} nos. have satisfied the clauses of Technical Bid and they are declared as qualified. Since there are three or more qualified bidders, the Financial Bid of the qualified bidder${
                  qualifiedBidders !== 1 ? "s" : ""
                } may be opened.`;
              } else {
                return `${totalBidders} nos. bidder${
                  totalBidders !== 1 ? "s" : ""
                } have participated in this e-tender and found ${qualifiedBidders} nos. have satisfied the clauses of Technical Bid and they are declared as qualified. However, as there are fewer than three qualified bidders, the Financial Bid cannot be opened at this time.`;
              }
            } else {
              return `${totalBidders} nos. bidder${
                totalBidders !== 1 ? "s" : ""
              } have participated in this e-tender but none have satisfied the clauses of Technical Bid. No bidders are qualified for the Financial Bid opening.`;
            }
          })(),
        },
      ];

      const pdf = await generatePDF(templatePath, inputs);
      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated_pdf_${workdetails.id || "unknown"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (error) {
      console.error("Error in PDF generation:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGeneratePDF}
      disabled={isGenerating}
      className="w-full sm:w-auto"
      aria-busy={isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Printer className="h-4 w-4" />
      )}
    </Button>
  );
}
