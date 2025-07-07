"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { db } from "@/lib/db";
import * as XLSX from "xlsx";
import { revalidatePath } from "next/cache";

// --- SERVER ACTION ---
type UploadResult = { message: string };

export async function bulkUploadAction(
  prevState: UploadResult | undefined,
  formData: FormData
): Promise<UploadResult> {
  "use server";
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return { message: "No file uploaded." };
  }
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" });
    if (!Array.isArray(rows) || rows.length === 0) {
      return { message: "Excel file is empty or invalid." };
    }
    const requiredCols = [
      "name",
      "mobileNumber",
      "email",
      "pan",
      "tin",
      "gst",
      "contactDetails",
    ];
    const firstRow = rows[0];
    for (const col of requiredCols) {
      if (!(col in firstRow)) {
        return { message: `Missing required column: ${col}` };
      }
    }
    let success = 0;
    let failed = 0;
    let errors: string[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        await db.agencyDetails.create({
          data: {
            name: String(row.name),
            mobileNumber: row.mobileNumber ? String(row.mobileNumber) : null,
            email: row.email ? String(row.email) : null,
            pan: row.pan ? String(row.pan) : null,
            tin: row.tin ? String(row.tin) : null,
            gst: row.gst ? String(row.gst) : null,
            contactDetails: String(row.contactDetails),
          },
        });
        success++;
      } catch (e: any) {
        failed++;
        errors.push(`Row ${i + 2}: ${e.message}`);
      }
    }
    revalidatePath("/admindashboard/manage-vendor/view");
    return {
      message: `Upload complete. Success: ${success}, Failed: ${failed}${
        errors.length ? "\nErrors:\n" + errors.join("\n") : ""
      }`,
    };
  } catch (err: any) {
    return { message: `Error processing file: ${err.message}` };
  }
}

// --- CLIENT COMPONENT ---
export default function BulkUploadVendorPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(bulkUploadAction, undefined);

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Bulk Upload Vendors (Agencies)</h1>
      <p className="mb-2 text-gray-600">
        Upload an Excel (.xlsx) file with the following columns:
        <br />
        <b>name, mobileNumber, email, pan, tin, gst, contactDetails</b>
      </p>
      <form ref={formRef} action={formAction} method="POST" encType="multipart/form-data" className="space-y-4">
        <input type="file" name="file" accept=".xlsx" required className="block" />
        <Button type="submit">Upload</Button>
      </form>
      {state?.message && (
        <div className="mt-4 p-2 bg-gray-100 border rounded whitespace-pre-line">{state.message}</div>
      )}
    </div>
  );
} 