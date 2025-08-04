"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import FormSubmitButton from "@/components/FormSubmitButton";
import { submitEnquiryReport } from "@/action/warishApplicationAction";
import { useRouter } from "next/navigation";

export default function EnquiryReportForm({
  applicationId,
  initialReport = "",
}: {
  applicationId: string;
  initialReport?: string;
}) {
  const router = useRouter();

  const [report, setReport] = useState(initialReport);
  const [isPending, startTransition] = useTransition();
  const [submitStatus, setSubmitStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const characterLimit = 1000;
  const characterCount = report.length;
  const progress = (characterCount / characterLimit) * 100;

  const handleSubmit = async (formData: FormData) => {
    try {
      formData.append("applicationId", applicationId);
      startTransition(async () => {
        const result = await submitEnquiryReport(formData);
        if (result.success) {
          setSubmitStatus({ type: "success", message: result.message });
          setReport("");
          setTimeout(() => {
            router.push("/employeedashboard/warish/view-assigned/");
            router.refresh();
          }, 1000);
        } else {
          setSubmitStatus({
            type: "error",
            message: result.message || "Failed to submit report",
          });
        }
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  return (
    <Card className="mt-6 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Staff Enquiry Report
        </CardTitle>
        <CardDescription>
          Provide detailed information about your enquiry for the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report" className="text-sm font-medium">
              Enquiry Report
            </Label>
            <Textarea
              id="report"
              name="report"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="Enter your detailed enquiry report here..."
              className="min-h-[100px] resize-none"
              maxLength={characterLimit}
              required
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <Progress value={progress} className="w-1/2" />
              <span>
                {characterCount}/{characterLimit} characters
              </span>
            </div>
          </div>
          <FormSubmitButton disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Enquiry Report"}
          </FormSubmitButton>
        </form>
      </CardContent>
      <CardFooter>
        {submitStatus.type === "success" && (
          <Alert
            variant="default"
            className="bg-green-50 border-green-200 text-green-800 w-full"
          >
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{submitStatus.message}</AlertDescription>
          </Alert>
        )}
        {submitStatus.type === "error" && (
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitStatus.message}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
} 
