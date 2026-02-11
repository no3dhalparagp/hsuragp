"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { generatePDF } from "../pdfgenerator";
import type { WarishApplicationProps, WarishDetailProps } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Printer, Loader2 } from "lucide-react";
import { formatDate } from "@/utils/utils";
import { domain_url } from "@/constants";
const templatePath = "/templates/warishcertificate.json";

// Function to convert image to base64
const getBase64FromUrl = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
};

type WarishCertificatePDFProps = {
  applicationDetails: WarishApplicationProps;
  mode?: "downloadOnly" | "uploadAndDownload";
};

export default function WarishCertificatePDF({
  applicationDetails,
  mode = "downloadOnly",
}: WarishCertificatePDFProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const buildWarishTree = (
    details: WarishDetailProps[]
  ): WarishDetailProps[] => {
    const map = new Map<string, WarishDetailProps>();
    details.forEach((detail) =>
      map.set(detail.id, { ...detail, children: [] })
    );

    const rootDetails: WarishDetailProps[] = [];
    map.forEach((detail) => {
      if (detail.parentId) {
        const parent = map.get(detail.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(detail);
        }
      } else {
        rootDetails.push(detail);
      }
    });

    return rootDetails;
  };

  const getSerialNumber = (depth: number, index: number): string => {
    if (depth === 0) return `${index + 1}`;
    if (depth === 1) return String.fromCharCode(65 + index);
    return String.fromCharCode(97 + index);
  };

  const generateTableData = (
    details: WarishDetailProps[],
    depth: number = 0,
    parentIndex: string = ""
  ): Array<[string, string, string, string, string]> => {
    return details.flatMap((detail, index) => {
      // Generate current index based on depth and parentIndex
      const currentIndex = parentIndex
        ? `${parentIndex}.${getSerialNumber(depth, index)}`
        : getSerialNumber(depth, index);
      const name =
        detail.livingStatus === "dead" ? `Late ${detail.name}` : detail.name;
      const relation = detail.relation;

      const row: [string, string, string, string, string] = [
        currentIndex,
        name,
        relation,
        detail.maritialStatus,
        detail.hasbandName ? detail.hasbandName : "",
      ];

      const rows = [row];

      // Recursively generate rows for children
      if (detail.children && detail.children.length > 0) {
        rows.push(
          ...generateTableData(detail.children, depth + 1, currentIndex)
        );
      }

      return rows;
    });
  };

  const body1 = `Certified that late ${applicationDetails.nameOfDeceased}, ${
    applicationDetails.gender === "male"
      ? "son of"
      : applicationDetails.gender === "female" &&
        applicationDetails.maritialStatus === "unmarried"
      ? "daughter of"
      : "wife of"
  } ${
    applicationDetails.gender === "female" &&
    applicationDetails.maritialStatus === "married"
      ? applicationDetails.spouseName
      : applicationDetails.fatherName
  } residing at ${applicationDetails.villageName} Village, ${
    applicationDetails.postOffice
  } Post Office, Hili Police Station of Dakshin Dinajpur District, West Bengal State, expired on ${
    applicationDetails.dateOfDeath
      ? formatDate(applicationDetails.dateOfDeath)
      : ""
  }, leaving behind the following persons as his/her legal heirs`;

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    try {
      const rootWarishDetails = await buildWarishTree(
        applicationDetails.warishDetails
      );
      const tableData = await generateTableData(rootWarishDetails);

      // Load and convert logo to base64
      const logoBase64 = await getBase64FromUrl("/images/logo.png");

      const inputs = [
        {
          logo: logoBase64,
          ref: applicationDetails.warishRefNo,
          refdate: applicationDetails.warishRefDate
            ? formatDate(applicationDetails.warishRefDate)
            : "",
          field12: `Further Certified that the all above persons are known to me & there is no other legal heir/heiress of late ${applicationDetails.nameOfDeceased}`,
          table: tableData,
          body1: body1,
          field20: `${domain_url}/services/e-governance/verification?id=${applicationDetails.id}`,
        },
      ];

      const pdf = await generatePDF(templatePath, inputs);
      const blob = new Blob([pdf], { type: "application/pdf" });

      // Always provide a download to the user first
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `warish_certificate_${applicationDetails.id || "unknown"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      if (mode === "uploadAndDownload") {
        const base64Data: string = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string | null;
            if (!result) {
              reject(new Error("Failed to read PDF blob as data URL"));
              return;
            }
            // result format: data:application/pdf;base64,AAAA...
            const commaIndex = result.indexOf(",");
            resolve(commaIndex >= 0 ? result.substring(commaIndex + 1) : result);
          };
          reader.onerror = () => reject(reader.error || new Error("FileReader error"));
          reader.readAsDataURL(blob);
        });

        const resp = await fetch("/api/warish/certificate/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: `warish_certificate_${applicationDetails.id || "unknown"}.pdf`,
            fileType: "application/pdf",
            base64: `data:application/pdf;base64,${base64Data}`,
            warishId: applicationDetails.id,
          }),
        });

        if (!resp.ok) {
          throw new Error("Upload failed");
        }

        // Refresh the page after successful upload
        router.refresh();
      }

      toast({
        title: "Success",
        description: "Warish Certificate PDF generated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error in PDF generation:", error);
      let errorMessage = "An unknown error occurred while generating the PDF.";

      if (error instanceof Error) {
        if (error.message.includes("Unknown schema type")) {
          errorMessage =
            "There's an issue with the PDF template. Please contact support.";
        } else if (error.message.includes("Failed to load the PDF template")) {
          errorMessage =
            "Failed to load the PDF template. Please try again later.";
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
    <div className="flex flex-col items-center space-y-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              aria-label="Generate PDF"
              className="w-10 h-10 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Printer className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate PDF</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
