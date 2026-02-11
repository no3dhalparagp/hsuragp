"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Loader2, CalendarIcon } from "lucide-react";

import { approvedSchema } from "@/schema/approveschema";
import { approvedWarishApplication } from "@/action/warishApplicationAction";
import { formatDate } from "@/utils/utils";

type ApprovalFormValues = z.infer<typeof approvedSchema>;

export default function ApprovalFormClient({
  id,
  initialMemoNumber,
}: {
  id: string;
  initialMemoNumber: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [memoNumber, setMemoNumber] = useState(initialMemoNumber);

  const form = useForm<ApprovalFormValues>({
    resolver: zodResolver(approvedSchema),
    defaultValues: {
      status: undefined,
      memonumber: memoNumber,
      memodate: undefined,
      remarks: "",
    },
  });

  const watchStatus = form.watch("status");

  // Automatically set the current date when status is approved
  useEffect(() => {
    if (watchStatus === "approved") {
      const currentDate = new Date();
      form.setValue("memodate", currentDate);
    } else {
      form.setValue("memodate", undefined);
    }
  }, [watchStatus, form]);

  const onSubmit = useCallback(
    async (values: ApprovalFormValues) => {
      startTransition(async () => {
        try {
          const submissionValues = {
            ...values,
            memonumber: values.status === "approved" ? memoNumber : "",
            memodate:
              values.status === "approved" ? values.memodate : undefined,
          };
          await approvedWarishApplication(submissionValues, id);
          toast({
            title: "Success",
            description: `Application ${values.status}`,
          });
          router.push("/admindashboard/manage-warish/approve");
        } catch (error) {
          console.error("Error updating application:", error);
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to update application status",
            variant: "destructive",
          });
        }
      });
    },
    [id, memoNumber, router]
  );

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-2xl overflow-hidden border-0">
      <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white p-6">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-full">
            <CheckCircle className="h-6 w-6" />
          </div>
          Application Review
        </CardTitle>
        <p className="text-primary-foreground/90">
          Update application status with memo details or rejection remarks
        </p>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Decision
              </h3>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div>
                          <RadioGroupItem
                            value="approved"
                            id="status-approved"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="status-approved"
                            className={cn(
                              "flex flex-col items-center justify-between rounded-xl border-2 p-5 hover:bg-green-50 transition-colors cursor-pointer",
                              field.value === "approved"
                                ? "border-green-500 bg-green-50"
                                : "border-muted bg-popover"
                            )}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="bg-green-100 p-2 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                              </div>
                              <span className="font-medium text-base">
                                Approve
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                              Create memo for approval
                            </p>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="rejected"
                            id="status-rejected"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="status-rejected"
                            className={cn(
                              "flex flex-col items-center justify-between rounded-xl border-2 p-5 hover:bg-red-50 transition-colors cursor-pointer",
                              field.value === "rejected"
                                ? "border-red-500 bg-red-50"
                                : "border-muted bg-popover"
                            )}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="bg-red-100 p-2 rounded-full">
                                <XCircle className="h-6 w-6 text-red-600" />
                              </div>
                              <span className="font-medium text-base">
                                Reject
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                              Provide rejection reason
                            </p>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {watchStatus === "approved" && (
              <div className="space-y-4 bg-green-50/30 p-5 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Approval Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="memonumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Memo Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={memoNumber}
                            onChange={(e) => {
                              setMemoNumber(e.target.value);
                              field.onChange(e);
                            }}
                            className="bg-background shadow-sm"
                            placeholder="Enter memo number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="memodate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-foreground">
                          Memo Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "text-left font-normal h-11 shadow-sm",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={watchStatus === "approved"}
                              >
                                {field.value ? (
                                  formatDate(field.value)
                                ) : (
                                  <span>Select date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                watchStatus === "approved"
                                  ? date.getTime() !==
                                    new Date().setHours(0, 0, 0, 0)
                                  : date > new Date() ||
                                    date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <p className="text-sm text-green-700 bg-green-100/50 p-3 rounded-lg">
                  Memo date is automatically set to today for approvals
                </p>
              </div>
            )}

            <div className="mt-6">
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <span>Remarks</span>
                      {watchStatus === "rejected" && (
                        <span className="text-destructive">*</span>
                      )}
                      <span className="text-sm text-muted-foreground font-normal ml-2">
                        {watchStatus === "approved"
                          ? "(optional)"
                          : "(required)"}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={
                          watchStatus === "approved"
                            ? "Add any additional comments..."
                            : "Please provide reason for rejection"
                        }
                        className="min-h-[120px] shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="bg-muted/50 px-6 py-5 border-t">
            <Button
              type="submit"
              className={cn(
                "w-full gap-2 h-12 text-base font-semibold transition-all",
                watchStatus === "rejected"
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              )}
              size="lg"
              disabled={isPending || !watchStatus}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : watchStatus === "approved" ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Confirm Approval
                </>
              ) : watchStatus === "rejected" ? (
                <>
                  <XCircle className="h-5 w-5" />
                  Confirm Rejection
                </>
              ) : (
                "Submit Decision"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
