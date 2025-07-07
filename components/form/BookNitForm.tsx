"use client";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { bookNitNumber } from "@/action/bookNitNuber";
import "react-datepicker/dist/react-datepicker.css";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { NitBookValidationSchema } from "@/schema";

// Validation Schema

type FormValues = z.infer<typeof NitBookValidationSchema>;

export default function BookNitForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(NitBookValidationSchema),
    defaultValues: {
      tendermemonumber: "",
      tendermemodate: undefined,
      tender_pulishing_Date: undefined,
      tender_document_Download_from: undefined,
      tender_start_time_from: undefined,
      tender_end_date_time_from: undefined,
      tender_techinical_bid_opening_date: undefined,
      tender_financial_bid_opening_date: undefined,
      tender_place_opening_bids: "",
      tender_vilidity_bids: "",
      supplynit: false,
      supplyitemname: "",
      nitCount: "1st call",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        await bookNitNumber(values).then((data) => {
          if (data?.success) {
            startTransition(() => {
              formRef.current?.reset();
              setSuccess(data.success);
              form.reset();
            });
          }

          if (data?.error) {
            setError(data.error);
          }
        });
      } catch (error) {
        console.error("Failed to create tender:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div className=" mx-auto bg-gradient-to-b from-white to-gray-50 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 my-12">
      {/* Error and Success Messages */}
      <div className="space-y-4 p-2">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mx-2 flex items-center gap-3 animate-fade-in shadow-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl mx-2 flex items-center gap-3 animate-fade-in shadow-sm">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-8 space-y-12"
          ref={formRef}
        >
          {/* Section styling improvements */}
          <div className="space-y-10">
            {/* Section Headers */}
            <div className="relative">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                <div className="bg-blue-100 p-3.5 rounded-2xl shadow-sm">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                    Tender Details
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Enter basic tender information
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="tendermemonumber"
                label="Tender Reference Number"
                placeholder="NIT Memo Number"
                containerClass="space-y-2"
                labelClass="text-sm font-semibold text-gray-700"
                inputClass="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="tendermemodate"
                label="Tender Booking Date"
                dateFormat="dd/MM/yyyy HH:mm"
                showTimeSelect
                containerClass="space-y-2"
                labelClass="text-sm font-semibold text-gray-700"
              />
            </div>
          </div>

          {/* Tender Schedule Section */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="bg-purple-100 p-3.5 rounded-2xl shadow-sm">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                  Tender Schedule
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Provide schedule details for the tender
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              {[
                { name: "tender_pulishing_Date", label: "Publishing Date" },
                {
                  name: "tender_document_Download_from",
                  label: "Document Download From",
                },
                { name: "tender_start_time_from", label: "Start Time From" },
                {
                  name: "tender_end_date_time_from",
                  label: "End Date Time From",
                },
                {
                  name: "tender_techinical_bid_opening_date",
                  label: "Technical Bid Opening Date",
                },
              ].map((field) => (
                <CustomFormField
                  key={field.name}
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name={field.name as keyof FormValues}
                  label={field.label}
                  dateFormat="dd/MM/yyyy HH:mm"
                  showTimeSelect
                  containerClass="space-y-2"
                  labelClass="text-sm font-semibold text-gray-700"
                />
              ))}
            </div>
          </div>

          {/* Bid Details Section */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="bg-green-100 p-3.5 rounded-2xl shadow-sm">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                  Bid Details
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Provide bid-related information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="tender_place_opening_bids"
                label="Place for Opening Bids"
                placeholder="Enter location"
                containerClass="space-y-2"
                labelClass="text-sm font-semibold text-gray-700"
                inputClass="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="tender_vilidity_bids"
                label="Validity of Bids"
                placeholder="Enter validity period"
                containerClass="space-y-2"
                labelClass="text-sm font-semibold text-gray-700"
                inputClass="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <div className="flex items-center gap-2 pt-2">
                <CustomFormField
                  fieldType={FormFieldType.CHECKBOX}
                  control={form.control}
                  name="supplynit"
                  label="For Supply NIT"
                  containerClass="flex items-center gap-2"
                  labelClass="text-sm font-semibold text-gray-700"
                />
              </div>
              {form.watch("supplynit") && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="supplyitemname"
                  label="Supply Item Name"
                  placeholder="Enter supply item name"
                  containerClass="space-y-2"
                  labelClass="text-sm font-semibold text-gray-700"
                  inputClass="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              )}
            </div>
          </div>

          {/* Submit Button with improved styling */}
          <div className="pt-10">
            <Button
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 
            hover:to-indigo-700 text-white text-base font-semibold rounded-2xl shadow-lg transition-all duration-300 
            transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed
            focus:ring-4 focus:ring-blue-200 focus:outline-none"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-3">
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-5 w-5" />
                  <span>Create Tender</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

