"use client";

import React, { useState } from "react";
import { generatePDF } from "../pdfgenerator";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Printer } from "lucide-react";
import { workdetailsbyid } from "@/data/apareport";
import { formatDate } from "@/lib/utils/date";
import { aoctype } from "@/types/aoc";

const templatePath = "/templates/awardofcontact.json";

export const Aocprint = ({ workdetails }: { workdetails: aoctype }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    try {
      // Validate required data
      if (
        !workdetails ||
        !workdetails.nitDetails ||
        !workdetails.biddingAgencies?.[0] ||
        !workdetails.ApprovedActionPlanDetails
      ) {
        throw new Error("Incomplete work details data");
      }

      const estimate = workdetails.finalEstimateAmount || 0;
      const biddingamount = workdetails.biddingAgencies[0].biddingAmount || 0;

      // Calculate percentage difference safely
      const percentageLess =
        estimate > 0
          ? (((estimate - biddingamount) / estimate) * 100).toFixed(2) + "%"
          : "0%";

      // Format date safely
      const memoDate = workdetails.nitDetails.memoDate;
      const formattedDate = memoDate ? formatDate(memoDate) : "";
      const year = memoDate ? memoDate.getFullYear() : "";

      // Build NIT string once for reuse
      const nitString = `${workdetails.nitDetails.memoNumber}/DGP/${year} Dated: ${formattedDate}`;

      const inputs = [
        {
          awardofcontile: `Award of Contract – NIT No: ${nitString}, Work Sl. No.: ${workdetails.workslno}`,
          agencyname: workdetails.biddingAgencies[0].agencydetails.name,
          agencyadd:
            workdetails.biddingAgencies[0].agencydetails.contactDetails,
          fund: workdetails.ApprovedActionPlanDetails.schemeName,
          nitno: nitString,
          field28: `This is to inform you that your bid in response to the e-Tender ${nitString}, floated by Dhalpara Gram Panchayat, for the following work has been accepted:`,
          field31: [
            [
              "Name of Work:",
              workdetails.ApprovedActionPlanDetails.activityDescription,
            ],
            ["Estimated Amount:", `₹${estimate.toLocaleString("en-IN")}`],
            ["Location", workdetails.ApprovedActionPlanDetails.locationofAsset],
            ["Time of Completion:", "30 days"],
            ["Your Quoted Rate:", percentageLess],
          ],
        },
      ];

      // Rest of the PDF generation code remains the same
      const pdf = await generatePDF(templatePath, inputs);
      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated_pdf.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error in PDF generation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4">
      <Button
        onClick={handleGeneratePDF}
        disabled={isGenerating}
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        aria-busy={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Printer className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
