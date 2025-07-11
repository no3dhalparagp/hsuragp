"use server";

import { nitDocumentSchema } from "@/schema/nitDocumentSchema";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadNITDocument(nitId: string, formData: FormData) {
  const file = formData.get("file") as File;

  try {
    nitDocumentSchema.parse({ file });
  } catch (error) {
    return {
      success: false,
      message: "Invalid file. Please upload a PDF file less than 5MB.",
    };
  }

  try {
    // Convert File to Buffer
    const buffer = await file.arrayBuffer();

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "nit-documents",
          resource_type: "raw",
          format: "pdf",
          type: "upload",
          access_mode: "public",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(Buffer.from(buffer));
    });

    // Type assertion for TypeScript
    const uploadResult = result as { secure_url: string };

    // Update the database with the new URL
    await db.nitDetails.update({
      where: { id: nitId },
      data: { publishhardcopy: uploadResult.secure_url },
    });

    console.log(
      `NIT Document "${file.name}" uploaded successfully for NIT ID: ${nitId}`
    );

    revalidatePath("/nit-documents"); // Adjust this path as needed

    return { success: true, message: "NIT document uploaded successfully" };
  } catch (error) {
    console.error("NIT document upload error:", error);
    return { success: false, message: "Failed to upload NIT document" };
  }
}
