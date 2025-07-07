"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { updateNitNumber } from "@/action/bookNitNuber";
import "react-datepicker/dist/react-datepicker.css";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Calendar,
  MapPin,
  Clock,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const NitEditValidationSchema = z.object({
  id: z.string().nonempty("NIT ID is required"),
  tendermemonumber: z.string().nonempty("Tender Reference Number is required"),
  tendermemodate: z.union([z.string().min(1), z.coerce.date()]),
  tender_pulishing_Date: z.union([z.string().min(1), z.coerce.date()]),
  tender_document_Download_from: z.union([z.string().min(1), z.coerce.date()]),
  tender_start_time_from: z.union([z.string().min(1), z.coerce.date()]),
  tender_end_date_time_from: z.union([z.string().min(1), z.coerce.date()]),
  tender_techinical_bid_opening_date: z.union([
    z.string().min(1),
    z.coerce.date(),
  ]),
  tender_financial_bid_opening_date: z
    .union([z.string().min(1), z.coerce.date()])
    .optional(),
  tender_place_opening_bids: z
    .string()
    .nonempty("Place for Opening Bids is required"),
  tender_vilidity_bids: z.string().nonempty("Validity of Bids is required"),
  supplynit: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

type FormValues = z.infer<typeof NitEditValidationSchema>;

interface EditNitFormProps {
  initialData: FormValues;
  onCancel?: () => void;
}

export default function NitEditForm({
  initialData,
  onCancel,
}: EditNitFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(NitEditValidationSchema),
    defaultValues: initialData,
  });

  const onSubmit = (values: FormValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (typeof value === "boolean") {
            formData.append(key, value ? "on" : "off");
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        const data = await updateNitNumber(formData);
        if (data?.success) {
          setSuccess(data.success);
        }
        if (data?.error) {
          setError(data.error);
        }
      } catch (error) {
        console.error("Failed to update tender:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const renderFormSection = (
    title: string,
    icon: React.ReactNode,
    children: React.ReactNode
  ) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit NIT</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" className="mb-6">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <input type="hidden" {...form.register("id")} />
              {renderFormSection(
                "Tender Details",
                <FileText className="h-5 w-5" />,
                <>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="tendermemonumber"
                    placeholder="Enter NIT Memo Number"
                    label="Tender Reference Number *"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="tendermemodate"
                    label="Tender Booking Date *"
                    dateFormat="MM/dd/yyyy"
                  />
                </>
              )}

              {renderFormSection(
                "Tender Schedule",
                <Calendar className="h-5 w-5" />,
                <>
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="tender_pulishing_Date"
                    label="Publishing Date *"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeSelect
                  />
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="tender_document_Download_from"
                    label="Document Download From *"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeSelect
                  />
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="tender_start_time_from"
                    label="Start Time From *"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeSelect
                  />
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="tender_end_date_time_from"
                    label="End Date Time From *"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeSelect
                  />
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="tender_techinical_bid_opening_date"
                    label="Technical Bid Opening Date *"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeSelect
                  />
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="tender_financial_bid_opening_date"
                    label="Financial Bid Opening Date"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeSelect
                  />
                </>
              )}

              {renderFormSection(
                "Bid Details",
                <MapPin className="h-5 w-5" />,
                <>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="tender_place_opening_bids"
                    placeholder="Enter place for opening bids"
                    label="Place for Opening Bids *"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="tender_vilidity_bids"
                    placeholder="Enter validity of bids"
                    label="Validity of Bids *"
                  />
                  <div className="col-span-2">
                    <CustomFormField
                      fieldType={FormFieldType.CHECKBOX}
                      control={form.control}
                      name="supplynit"
                      label="For Supply NIT"
                    />
                  </div>
                </>
              )}
              {/* // do not show edit and delete button */}

              {initialData.isPublished ? (
                ""
              ) : (
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel ? onCancel : () => router.back()}
                    className="flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Clock className="animate-spin mr-2 h-4 w-4" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Update Tender
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
