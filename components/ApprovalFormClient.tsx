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
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="text-2xl font-bold text-primary">
          Application Review
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Update application status with memo details or rejection remarks
        </p>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Decision</FormLabel>
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
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                        >
                          <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                          <span className="font-medium">Approve</span>
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
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-destructive [&:has([data-state=checked])]:border-destructive cursor-pointer transition-colors"
                        >
                          <XCircle className="h-6 w-6 text-red-500 mb-2" />
                          <span className="font-medium">Reject</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchStatus === "approved" && (
              <div className="space-y-4 bg-green-50/50 p-4 rounded-lg border border-green-100">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="memonumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Memo Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={memoNumber}
                            onChange={(e) => {
                              setMemoNumber(e.target.value);
                              field.onChange(e);
                            }}
                            className="bg-background"
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
                        <FormLabel>Memo Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={watchStatus === "approved"} // Disable when approved
                              >
                                {field.value ? (
                                  formatDate(field.value) // Format as dd-MM-yyyy
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
                                // Disable all dates except today when approved
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
              </div>
            )}

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Remarks{" "}
                    <span className="text-muted-foreground font-normal">
                      ({watchStatus === "approved" ? "optional" : "required"})
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
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="border-t pt-6">
            <Button
              type="submit"
              className="w-full gap-2"
              variant={watchStatus === "rejected" ? "destructive" : "default"}
              size="lg"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : watchStatus === "approved" ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Confirm Approval
                </>
              ) : watchStatus === "rejected" ? (
                <>
                  <XCircle className="h-4 w-4" />
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
