"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Workorderdetails } from "@/types/tender-manage";
import { Printer, Loader2 } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import type { Font } from "@pdfme/common";
import { workorderforward } from "@/constants";
import { formatDate } from "@/utils/utils";
import { getworklenthbynitno } from "@/lib/auth";
import { getBase64FromUrl } from "@/utils";
const templatePath = "/templates/workordercertificate.json";

const customFonts: Font = {
  serif: {
    data: "https://example.com/fonts/serif.ttf",
    fallback: true,
  },
  sans_serif: {
    data: "https://example.com/fonts/sans_serif.ttf",
  },
};

type WorkOrderCertificatePDFProps = {
  workOrderDetails: Workorderdetails;
};

export default function Component({
  workOrderDetails,
}: WorkOrderCertificatePDFProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const getNitYear = (): number => {
    const memoDate =
      workOrderDetails.Bidagency?.WorksDetail?.nitDetails?.memoDate;
    return memoDate
      ? new Date(memoDate).getFullYear()
      : new Date().getFullYear();
  };

  const workorderyear =
    workOrderDetails.awardofcontractdetails.workordeermemodate.getFullYear() ||
    "";

  const calculateBidPercentage = (): string => {
    const estimateAmount =
      workOrderDetails.Bidagency?.WorksDetail?.finalEstimateAmount || 0;
    const biddingAmount = workOrderDetails.Bidagency?.biddingAmount || 0;

    if (estimateAmount && biddingAmount && estimateAmount !== 0) {
      const percentage =
        ((estimateAmount - biddingAmount) / estimateAmount) * 100;
      return percentage.toFixed(2);
    }
    return "0.00";
  };

  const createTableData = (): string[][] => {
    const data = [
      "1",
      workOrderDetails.Bidagency?.WorksDetail?.ApprovedActionPlanDetails
        ?.activityDescription,
      `${workOrderDetails.Bidagency?.WorksDetail?.finalEstimateAmount}`,
      `${workOrderDetails.Bidagency?.biddingAmount}`,
      "As per Govt. Norms and latest guideline of Govt.",
    ];

    return [data.map((item) => (item || "N/A").toString())];
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    const nitworkcount = await getworklenthbynitno(
      workOrderDetails.Bidagency?.WorksDetail?.nitDetails.memoNumber || 0,
      workOrderDetails.Bidagency?.WorksDetail?.nitDetailsId || ""
    );

    try {
      const bidPercentage = calculateBidPercentage();
      const table = await createTableData();

      if (table.length === 0 || table[0].length === 0) {
        throw new Error("Invalid table data");
      }
const logoBase64 = await getBase64FromUrl("/images/logo.png");
      const inputs = [
        {
          refno: `${
            workOrderDetails.awardofcontractdetails?.workodermenonumber || ""
          }/DGP/${workorderyear}`,
         gpname: "",
          gpaddress: "",
          gpname2: "",
          gpname3: "",
          refdate:
            formatDate(
              workOrderDetails.awardofcontractdetails?.workordeermemodate
            ) || "",
          agencyname: workOrderDetails.Bidagency?.agencydetails?.name || "",
          agencyadd: `${
            workOrderDetails.Bidagency?.agencydetails?.contactDetails || ""
          } - ${workOrderDetails.Bidagency?.agencydetails.mobileNumber || ""}`,
          fund:
            workOrderDetails.Bidagency?.WorksDetail?.ApprovedActionPlanDetails
              ?.schemeName || "",
          worksl: `${
            workOrderDetails.Bidagency?.WorksDetail?.workslno || ""
          } out of ${nitworkcount}`,
          nitno: `${
            workOrderDetails.Bidagency?.WorksDetail?.nitDetails?.memoNumber ||
            ""
          }/DGP/${getNitYear()} ${
            workOrderDetails.Bidagency?.WorksDetail?.nitDetails?.memoDate
              ? formatDate(
                  workOrderDetails.Bidagency?.WorksDetail?.nitDetails?.memoDate
                )
              : ""
          }`,
          workname: `${
            workOrderDetails.Bidagency?.WorksDetail?.ApprovedActionPlanDetails
              ?.activityDescription || ""
          }-${
            workOrderDetails.Bidagency?.WorksDetail?.ApprovedActionPlanDetails
              ?.activityCode || ""
          }`,
          body1: `As the rate offered by you for execution of the above mentioned scheme under ${
            workOrderDetails.Bidagency?.WorksDetail?.ApprovedActionPlanDetails
              ?.schemeName || ""
          } fund, invited vide above NIT is found to be the 1st lowest, also in view of the agreement executed by you on ${
            formatDate(
              workOrderDetails.awardofcontractdetails?.workordeermemodate
            ) || ""
          } for accomplishing the proposed consolidated work, following are the stipulated terms and conditions and the work order is hereby issued for execution of work at the accepted rate which is ${bidPercentage}% less than the NIT Tendered Amount.`,
          body2:
            "Entire work will have to be completed under the effective and technical guidance of Nirman Sahayak of Gram Panchayat. The said work shall have to be completed within 30(Thirty) days from the date of receiving the work order.",
          table: table,
          forwardtable:
            workorderforward.map((term, i) => [`${i + 1}. ${term}`]) || [],
        },
      ];

      console.log("Stringified inputs:", JSON.stringify(inputs, null, 2));

      const pdf = await generatePDF(templatePath, inputs);
      if (!pdf || !pdf.buffer) {
        throw new Error("PDF generation failed");
      }

      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `work_order_certificate_${
        workOrderDetails.id || "unknown"
      }.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Work Order Certificate PDF generated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error in PDF generation:", error);
      let errorMessage = "An unknown error occurred while generating the PDF.";

      if (error instanceof Error) {
        if (error.message.includes("value.split is not a function")) {
          errorMessage =
            "Error processing text data. Please check the input values and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGeneratePDF}
      disabled={isGenerating}
      aria-label="Generate PDF"
      className="w-full transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Printer className="h-4 w-4" />
      )}
    </Button>
  );
}
