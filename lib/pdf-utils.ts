"use server" 
/**
 * Convert a PDF file to Base64.
 * @param file - The PDF file (as a `File` object) to convert.
 * @returns A promise that resolves to the Base64 string representation of the PDF file.
 */
/**
 * Convert a PDF file to Base64.
 * @param file - The PDF file (as a `File` object) to convert.
 * @param returnFullDataUrl - If true, return the full Data URL; otherwise, return only the Base64 string.
 * @returns A promise that resolves to the Base64 string or Data URL representation of the PDF file.
 */
import { blockname, gpcode, gpname, nameinprodhan, gpaddress } from "@/constants/gpinfor";
export async  function convertPdfToBase64(
  file: File,
  returnFullDataUrl: boolean = false
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    // Validate that a file is provided
    if (!file) {
      return reject(new Error("No file provided"));
    }

    // Validate that the file is a PDF
    if (file.type !== "application/pdf") {
      return reject(new Error("Invalid file type. Only PDFs are allowed."));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        // Resolve the full Data URL or just the Base64 string based on the flag
        const base64String = reader.result;
        resolve(returnFullDataUrl ? base64String : base64String.split(",")[1]);
      } else {
        reject(new Error("Failed to convert file to Base64"));
      }
    };

    reader.onerror = (error) => {
      reject(new Error(`Error reading file: `));
    };
  });
}

/**
 * Fetch a PDF file from the public folder and convert it to Base64.
 * @param filePath - Path to the file in the public folder (e.g., "/myfile.pdf").
 * @returns A promise that resolves to the Base64 string representation of the PDF file.
 */
export async function fetchPdfFromPublicAndConvertToBase64(
  filePath: string
): Promise<string> {
  try {
    // Fetch the PDF file from the public folder
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to fetch the file. Status: ${response.status}`);
    }

    // Convert the response to a Blob (Binary Large Object)
    const blob = await response.blob();

    // Convert the Blob to Base64 using FileReader
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        if (reader.result && typeof reader.result === "string") {
          // Extract the Base64 part from the Data URL
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert file to Base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  } catch (error) {
    throw new Error(`Error fetching or converting the file`);
  }
}

import { Workorderdetails } from "@/types/tender-manage";
import { workorderforward } from "@/constants";
import { formatDate } from "@/utils/utils";
import { getworklenthbynitno } from "@/lib/auth";
import { getBase64FromUrl } from "@/utils";

/**
 * Transforms a Workorderdetails object into the input format for the work order certificate PDF template.
 */
export async function getWorkOrderCertificateInput(workOrderDetails: Workorderdetails) {
  const getNitYear = (): number => {
    const memoDate = workOrderDetails.Bidagency?.WorksDetail?.nitDetails?.memoDate;
    return memoDate ? new Date(memoDate).getFullYear() : new Date().getFullYear();
  };

  const workorderyear = workOrderDetails.awardofcontractdetails.workordeermemodate.getFullYear() || "";

  const calculateBidPercentage = (): string => {
    const estimateAmount = workOrderDetails.Bidagency?.WorksDetail?.finalEstimateAmount || 0;
    const biddingAmount = workOrderDetails.Bidagency?.biddingAmount || 0;
    if (estimateAmount && biddingAmount && estimateAmount !== 0) {
      const percentage = ((estimateAmount - biddingAmount) / estimateAmount) * 100;
      return percentage.toFixed(2);
    }
    return "0.00";
  };

  const createTableData = (): string[][] => {
    const data = [
      "1",
      workOrderDetails.Bidagency?.WorksDetail?.ApprovedActionPlanDetails?.activityDescription,
      `${workOrderDetails.Bidagency?.WorksDetail?.finalEstimateAmount}`,
      `${workOrderDetails.Bidagency?.biddingAmount}`,
      "As per Govt. Norms and latest guideline of Govt.",
    ];
    return [data.map((item) => (item || "N/A").toString())];
  };

  const nitworkcount = await getworklenthbynitno(
    workOrderDetails.Bidagency?.WorksDetail?.nitDetails.memoNumber || 0,
    workOrderDetails.Bidagency?.WorksDetail?.nitDetailsId || ""
  );
  const logoBase64 = await getBase64FromUrl("/images/logo.png");
  const bidPercentage = calculateBidPercentage();
  const table = createTableData();

  return {
    refno: `${workOrderDetails.awardofcontractdetails?.workodermenonumber || ""}/DGP/${workorderyear}`,
    gpname: `${gpname}`,
          gpaddress: `${gpaddress} , ${blockname}, Dakshin Dinajpur`,
          gpname2: `${nameinprodhan}`,
          gpname3: `${nameinprodhan}`,
    logo: logoBase64,
    refdate: formatDate(workOrderDetails.awardofcontractdetails?.workordeermemodate) || "",
    agencyname: workOrderDetails.Bidagency?.agencydetails?.name || "",
    agencyadd: `${workOrderDetails.Bidagency?.agencydetails?.contactDetails || ""} - ${workOrderDetails.Bidagency?.agencydetails.mobileNumber || ""}`,
    fund: workOrderDetails.Bidagency?.WorksDetail?.ApprovedActionPlanDetails?.schemeName || "",
    worksl: `${workOrderDetails.Bidagency?.WorksDetail?.workslno || ""} out of ${nitworkcount}`,
    nitno: `${workOrderDetails.Bidagency?.WorksDetail?.nitDetails?.memoNumber || ""}/DGP/${getNitYear()} ${workOrderDetails.Bidagency?.WorksDetail?.nitDetails?.memoDate ? formatDate(workOrderDetails.Bidagency?.WorksDetail?.nitDetails?.memoDate) : ""}`,
    workname: `${workOrderDetails.Bidagency?.WorksDetail?.ApprovedActionPlanDetails?.activityDescription || ""}-${workOrderDetails.Bidagency?.WorksDetail?.ApprovedActionPlanDetails?.activityCode || ""}`,
    body1: `As the rate offered by you for execution of the above mentioned scheme under ${workOrderDetails.Bidagency?.WorksDetail?.ApprovedActionPlanDetails?.schemeName || ""} fund, invited vide above NIT is found to be the 1st lowest, also in view of the agreement executed by you on ${formatDate(workOrderDetails.awardofcontractdetails?.workordeermemodate) || ""} for accomplishing the proposed consolidated work, following are the stipulated terms and conditions and the work order is hereby issued for execution of work at the accepted rate which is ${bidPercentage}% less than the NIT Tendered Amount.`,
    body2: "Entire work will have to be completed under the effective and technical guidance of Nirman Sahayak of Gram Panchayat. The said work shall have to be completed within 30(Thirty) days from the date of receiving the work order.",
    table: table,
    forwardtable: workorderforward.map((term, i) => [`${i + 1}. ${term}`]) || [],
  };
}
