"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { workCoverPageType } from "@/types/worksdetails";
import { Printer, Loader2 } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import { formatDate, getFinancialYear } from "@/utils/utils";
import { getworklenthbynitno } from "@/lib/auth";

const templatePath = "/templates/coverpage.json";

type CoverPagePDFProps = {
  workCoverPageType: workCoverPageType;
};

export default function CoverPagePrint({
  workCoverPageType,
}: CoverPagePDFProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const fyear = workCoverPageType.completionDate
    ? getFinancialYear(workCoverPageType.completionDate)
    : "N/A";

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    const nitworkcount = await getworklenthbynitno(
      workCoverPageType.nitDetails.memoNumber,
      workCoverPageType.nitDetails.id
    );
    try {
      const inputs = [
        {
          field3: `Financial Year : ${fyear}`,
          fund: `Fund-${workCoverPageType.ApprovedActionPlanDetails.schemeName}`,
          watermark: workCoverPageType.workslno.toFixed(),
          workname:
            workCoverPageType.ApprovedActionPlanDetails.activityDescription,

          nitmemo: `${
            workCoverPageType.nitDetails.memoNumber
          }/DGP/${workCoverPageType.nitDetails.memoDate.getFullYear()}`,
          nitmeodate: formatDate(workCoverPageType.nitDetails.memoDate),
          workslno: `${workCoverPageType.workslno.toFixed()} out of ${nitworkcount}`,
          workordermemo: `${
            workCoverPageType.AwardofContract?.workodermenonumber
          }/DGP/${workCoverPageType.AwardofContract?.workordeermemodate.getFullYear()}`,
          workmemodate: workCoverPageType.AwardofContract?.workordeermemodate
            ? formatDate(workCoverPageType.AwardofContract?.workordeermemodate)
            : "",
          agrementdetails: `${
            workCoverPageType.AwardofContract?.workorderdetails[0].Bidagency
              ?.AggrementModel[0].aggrementno
          } Date: ${
            workCoverPageType.AwardofContract?.workorderdetails[0].Bidagency
              ?.AggrementModel[0].aggrementdate
              ? formatDate(
                  workCoverPageType.AwardofContract?.workorderdetails[0]
                    .Bidagency?.AggrementModel[0].aggrementdate
                )
              : ""
          }`,
          agencydetails: `${workCoverPageType.AwardofContract?.workorderdetails[0].Bidagency?.agencydetails.name} Address: ${workCoverPageType.AwardofContract?.workorderdetails[0].Bidagency?.agencydetails.contactDetails} Mobile No ${workCoverPageType.AwardofContract?.workorderdetails[0].Bidagency?.agencydetails.mobileNumber}`,

          // [[\"₹123,564.00\",\"₹123,564.00\",\"₹123,564.00\"]]"
          fundetailstable: [
            [
              `₹${workCoverPageType.finalEstimateAmount.toFixed(2)}`,
              `₹${workCoverPageType.AwardofContract?.workorderdetails[0].Bidagency?.biddingAmount?.toFixed(
                2
              )}`,
              `₹${workCoverPageType.paymentDetails[0].grossBillAmount.toFixed(
                2
              )}`,
            ],
          ],

          paymentdetails:
            workCoverPageType.paymentDetails?.map((item) => {
              const incomeTax = item.lessIncomeTax?.incomeTaaxAmount || 0;
              const labourCess =
                item.lessLabourWelfareCess?.labourWelfarecessAmt || 0;
              const securityDeposit =
                item.securityDeposit?.securityDepositAmt || 0;
              const cgst = item.lessTdsCgst?.tdscgstAmt || 0;
              const sgst = item.lessTdsSgst?.tdsSgstAmt || 0;
              const totalgst = cgst + sgst;
              const totalDeduction =
                incomeTax + labourCess + securityDeposit + cgst + sgst;

              return [
                `₹${item.grossBillAmount.toFixed(2)}`,
                `₹${incomeTax.toFixed(2)}`,
                `₹${labourCess.toFixed(2)}`,
                `₹${securityDeposit.toFixed(2)}`,
                `₹${totalgst.toFixed(2)}`,
                `₹${totalDeduction.toFixed(2)}`,
                `₹${item.netAmt.toFixed(2)}`,
                item.billType || "N/A",
              ];
            }) || [],

          activitycode:
            workCoverPageType.ApprovedActionPlanDetails.activityCode.toFixed(),
          workcompletation: workCoverPageType.completionDate
            ? formatDate(workCoverPageType.completionDate)
            : "",
        },
      ];

      const pdf = await generatePDF(templatePath, inputs);
      if (!pdf || !pdf.buffer) {
        throw new Error("PDF generation failed.");
      }

      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "work_order_certificate.pdf";
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Work Order Certificate PDF generated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
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
