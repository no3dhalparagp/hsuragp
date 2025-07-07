"use client";
import { useState, useRef, useTransition, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createNestedWarishDetails } from "@/action/warishApplicationAction";
import {
  warishFormSchema,
  type WarishFormValuesType,
} from "@/schema/warishSchema";
import { ApplicationInfo } from "./application-info";
import { WarishTable } from "./warish-table";
import { defaultValues } from "./constants";
import {
  CheckCircle2,
  ClipboardList,
  Users,
  SendHorizonal,
  ChevronLeft,
  Eye,
} from "lucide-react";

// Extracted Preview Component
const FormPreview = ({ values }: { values: WarishFormValuesType }) => (
  <div className="space-y-6 focus:outline-none">
    {/* Applicant & Deceased Preview */}
    <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-primary">Applicant & Deceased Information Preview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2 text-gray-700">Applicant Details</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Name</dt>
              <dd className="font-medium">{values.applicantName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Mobile Number</dt>
              <dd className="font-medium">{values.applicantMobileNumber}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Fathers Name</dt>
              <dd className="font-medium">{values.fatherName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Village</dt>
              <dd className="font-medium">{values.villageName}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Post Office</dt>
              <dd className="font-medium">{values.postOffice}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h4 className="font-medium mb-2 text-gray-700">Deceased Details</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Name</dt>
              <dd className="font-medium">{values.nameOfDeceased}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Date of Death</dt>
              <dd className="font-medium">
                {values.dateOfDeath ? new Date(values.dateOfDeath).toLocaleDateString() : "N/A"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Relation with Applicant</dt>
              <dd className="font-medium">{values.relationwithdeceased}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Gender</dt>
              <dd className="font-medium">{values.gender}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Marital Status</dt>
              <dd className="font-medium">{values.maritialStatus}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    {/* Warish Details Preview */}
    <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-primary">Warish Details Preview</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relation</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Living Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spouse Name</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {values.warishDetails?.map((warish, index) => (
              <tr key={index}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{warish.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{warish.relation}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{warish.gender}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{warish.livingStatus}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{warish.husbandName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Total Warish: {values.warishDetails?.length || 0}
      </p>
    </div>
  </div>
);

export default function WarishFormComponent() {
  const [acnumber, setAcnumber] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const form = useForm<WarishFormValuesType>({
    resolver: zodResolver(warishFormSchema),
    defaultValues,
    shouldUnregister: false,
  });

  // Memoized field groups
  const step1Fields = useMemo<(keyof WarishFormValuesType)[]>(
    () => [
      "applicantName",
      "applicantMobileNumber",
      "nameOfDeceased",
      "dateOfDeath",
      "gender",
      "maritialStatus",
      "fatherName",
      "spouseName",
      "villageName",
      "postOffice",
      "relationwithdeceased"
    ],
    []
  );

  const step2Fields = useMemo<(keyof WarishFormValuesType)[]>(
    () => ["warishDetails"],
    []
  );

  // Memoized reset function
  const resetForm = useCallback(() => {
    form.reset(defaultValues);
    setStep(1);
  }, [form]);

  // Memoized step navigation
  const nextStep = useCallback(async (e?: React.MouseEvent) => {
    // Prevent any form submission
    e?.preventDefault();
    e?.stopPropagation();
    
    if (step === 1) {
      const isValid = await form.trigger(step1Fields);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await form.trigger(step2Fields);
      if (isValid) setStep(3);
    }
  }, [step, form, step1Fields, step2Fields]);

  const prevStep = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  // Handle Next/Review button click
  const handleNextClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    nextStep(e);
  }, [nextStep]);

  // Submit handler
  const onSubmit = useCallback(async (data: WarishFormValuesType) => {
    // Only allow submission in step 3 (preview)
    if (step !== 3) {
      console.log("Form submission prevented - not in step 3");
      return;
    }

    console.log("Submitting form in step 3");
    startTransition(async () => {
      try {
        const result = await createNestedWarishDetails(data);
        if (result?.errors) {
          toast({
            title: "Error / ত্রুটি",
            description: result.message,
            variant: "destructive",
          });
        } else if (result?.success) {
          resetForm();
          toast({
            title: "Success / সফল",
            description: result.data?.acknowlegment?.toString(),
          });
          setAcnumber(result.data?.acknowlegment?.toString() || "");
        }
      } catch (error) {
        console.error("Failed to add warish details:", error);
        toast({
          title: "Error / ত্রুটি",
          description: "An unexpected error occurred. Please try again. / একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
          variant: "destructive",
        });
      } finally {
        router.refresh();
      }
    });
  }, [step, startTransition, toast, resetForm, router]);

  // Handle Enter key behavior
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (step !== 3) {
          e.preventDefault();
          nextStep();
        } else {
          // In step 3 (preview), prevent automatic form submission on Enter
          e.preventDefault();
        }
      }
    };

    const formElement = formRef.current;
    formElement?.addEventListener("keydown", handleKeyDown);

    return () => formElement?.removeEventListener("keydown", handleKeyDown);
  }, [nextStep, step]);

  // Auto-focus preview container
  useEffect(() => {
    if (step === 3) {
      previewRef.current?.focus({ preventScroll: true });
    }
  }, [step]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 md:space-y-8"
        >
          {acnumber && (
            <div className="bg-emerald-50/80 p-3 md:p-4 rounded-xl border border-emerald-200 flex items-center gap-2 md:gap-3">
              <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
              <p className="text-xs md:text-sm font-medium text-emerald-700">
                Acknowledgment Number / স্বীকৃতি নম্বর:{" "}
                <span className="font-semibold break-all">{acnumber}</span>
              </p>
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex justify-center mb-6">
            <ol className="flex items-center w-full max-w-md">
              {[1, 2, 3].map((stepNum) => (
                <li 
                  key={stepNum}
                  className={`flex items-center ${stepNum > 1 ? "w-full" : ""}`}
                  aria-current={step === stepNum ? "step" : undefined}
                >
                  {stepNum > 1 && (
                    <div className={`flex-1 h-1 ${step >= stepNum ? "bg-primary" : "bg-gray-300"}`} />
                  )}
                  <div className={`flex flex-col items-center ${step >= stepNum ? "text-primary" : "text-gray-400"}`}>
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= stepNum ? "bg-primary text-white" : "bg-gray-200"}`}>
                      {stepNum}
                    </div>
                    <div className="text-xs mt-1">
                      {stepNum === 1 ? "Applicant & Deceased" : 
                       stepNum === 2 ? "Warish Details" : "Review & Submit"}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Step 1: Applicant & Deceased Information */}
          {step === 1 && (
            <section aria-labelledby="step1-heading">
              <div className="bg-gradient-to-br from-primary/95 to-primary/80 text-primary-foreground px-4 py-3 md:px-6 md:py-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 md:gap-3">
                  <ClipboardList className="h-5 w-5 md:h-6 md:w-6" />
                  <h2 id="step1-heading" className="text-lg md:text-xl font-bold tracking-tight">
                    Applicant & Deceased Information
                  </h2>
                </div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
                <ApplicationInfo form={form} />
              </div>
            </section>
          )}

          {/* Step 2: Warish Details */}
          {step === 2 && (
            <section aria-labelledby="step2-heading">
              <div className="bg-gradient-to-br from-primary/95 to-primary/80 text-primary-foreground px-4 py-3 md:px-6 md:py-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 md:gap-3">
                  <Users className="h-5 w-5 md:h-6 md:w-6" />
                  <h2 id="step2-heading" className="text-lg md:text-xl font-bold tracking-tight">
                    Warish Details / ওয়ারিশ তথ্য
                  </h2>
                </div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                <WarishTable form={form} />
              </div>
            </section>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <section aria-labelledby="step3-heading">
              <div className="bg-gradient-to-br from-primary/95 to-primary/80 text-primary-foreground px-4 py-3 md:px-6 md:py-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 md:gap-3">
                  <Eye className="h-5 w-5 md:h-6 md:w-6" />
                  <h2 id="step3-heading" className="text-lg md:text-xl font-bold tracking-tight">
                    Review Application / আবেদন পর্যালোচনা
                  </h2>
                </div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
                <div ref={previewRef} tabIndex={-1} className="focus:outline-none">
                  <FormPreview values={form.getValues()} />
                </div>
              </div>
            </section>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous / পূর্ববর্তী
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextClick}
                className="ml-auto"
              >
                {step === 1 ? "Next / পরবর্তী" : "Review / পর্যালোচনা"}
                <ChevronLeft className="h-4 w-4 rotate-180 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="ml-auto"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <span className="animate-pulse">Submitting... / জমা দেওয়া হচ্ছে...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <SendHorizonal className="w-4 h-4" />
                    <span>Submit Application / আবেদন জমা দিন</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
