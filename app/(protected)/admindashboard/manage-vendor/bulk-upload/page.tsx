"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { bulkUploadAction, UploadResult } from "./action";

export default function BulkUploadVendorPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState<UploadResult, FormData>(
    bulkUploadAction,
    { message: "" }
  );

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