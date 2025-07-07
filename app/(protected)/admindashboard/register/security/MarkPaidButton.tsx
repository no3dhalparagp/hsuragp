"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { CheckCircle, CalendarIcon, Banknote, Landmark } from "lucide-react";
import { updateDepositStatus } from "@/action/deposits";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const formSchema = z
  .object({
    paymentMethod: z.enum(["CHEQUE", "ONLINE_TRANSFER", "CASH"], {
      required_error: "Please select a payment method",
    }),
    chequeNumber: z.string().optional(),
    chequeDate: z.date().optional(),
    transactionId: z.string().optional(),
    paymentDate: z.date({
      required_error: "Payment date is required",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "CHEQUE") {
      if (!data.chequeNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chequeNumber"],
          message: "Cheque number is required",
        });
      }
      if (!data.chequeDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chequeDate"],
          message: "Cheque date is required",
        });
      }
    }
    if (data.paymentMethod === "ONLINE_TRANSFER" && !data.transactionId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["transactionId"],
        message: "Transaction ID is required",
      });
    }
  });

export function MarkPaidButton({ depositId }: { depositId: string }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: undefined,
      chequeNumber: "",
      transactionId: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      await updateDepositStatus({
        depositId,
        ...values,
        chequeNumber:
          values.paymentMethod === "CHEQUE" ? values.chequeNumber : undefined,
        chequeDate:
          values.paymentMethod === "CHEQUE" ? values.chequeDate : undefined,
        transactionId:
          values.paymentMethod === "ONLINE_TRANSFER"
            ? values.transactionId
            : undefined,
      });
      setOpen(false);
      form.reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
        >
          <CheckCircle className="h-4 w-4" />
          Mark as Paid
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-medium">Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CHEQUE" className="h-11">
                        <div className="flex items-center gap-3">
                          <Landmark className="h-5 w-5 text-blue-600" />
                          <span>Cheque Payment</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ONLINE_TRANSFER" className="h-11">
                        <div className="flex items-center gap-3">
                          <Banknote className="h-5 w-5 text-green-600" />
                          <span>Online Transfer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="CASH" className="h-11">
                        <div className="flex items-center gap-3">
                          <Banknote className="h-5 w-5 text-yellow-600" />
                          <span>Cash Payment</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMethod && (
              <div className="rounded-lg border p-4 bg-gray-50">
                {paymentMethod === "CHEQUE" && (
                  <>
                    <FormField
                      control={form.control}
                      name="chequeNumber"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel className="font-medium">
                            Cheque Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter cheque number"
                              {...field}
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="chequeDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-medium">
                            Cheque Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="h-12 w-full pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span className="text-gray-500">
                                      Pick a cheque date
                                    </span>
                                  )}
                                  <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {paymentMethod === "ONLINE_TRANSFER" && (
                  <FormField
                    control={form.control}
                    name="transactionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Transaction ID
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter transaction ID"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-medium">Payment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="h-12 w-full pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-gray-500">
                              Pick a payment date
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </div>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Confirm Payment
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
