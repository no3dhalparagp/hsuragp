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
