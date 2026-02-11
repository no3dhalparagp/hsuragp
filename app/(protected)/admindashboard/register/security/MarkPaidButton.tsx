
"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Constants for payment methods
const PAYMENT_METHODS = {
  CHEQUE: "CHEQUE",
  ONLINE_TRANSFER: "ONLINE_TRANSFER",
  CASH: "CASH",
} as const;

// Optimized form schema
const formSchema = z.object({
  paymentMethod: z.nativeEnum(PAYMENT_METHODS, {
    required_error: "Please select a payment method",
  }),
  chequeNumber: z.string().optional(),
  chequeDate: z.coerce.date().optional(),
  transactionId: z.string().optional(),
  paymentDate: z.coerce.date({
    required_error: "Payment date is required",
  }),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === PAYMENT_METHODS.CHEQUE) {
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
  if (data.paymentMethod === PAYMENT_METHODS.ONLINE_TRANSFER && !data.transactionId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["transactionId"],
      message: "Transaction ID is required",
    });
  }
});

// Sub-components for better readability
const PaymentMethodSelect = () => (
  <SelectContent>
    <SelectItem value={PAYMENT_METHODS.CHEQUE} className="h-11">
      <div className="flex items-center gap-3">
        <Landmark className="h-5 w-5 text-blue-600" />
        <span>Cheque Payment</span>
      </div>
    </SelectItem>
    <SelectItem value={PAYMENT_METHODS.ONLINE_TRANSFER} className="h-11">
      <div className="flex items-center gap-3">
        <Banknote className="h-5 w-5 text-green-600" />
        <span>Online Transfer</span>
      </div>
    </SelectItem>
    <SelectItem value={PAYMENT_METHODS.CASH} className="h-11">
      <div className="flex items-center gap-3">
        <Banknote className="h-5 w-5 text-yellow-600" />
        <span>Cash Payment</span>
      </div>
    </SelectItem>
  </SelectContent>
);

const DatePicker = ({ value, onChange, placeholder }: { 
  value?: Date; 
  onChange: (date?: Date) => void;
  placeholder: string;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="h-12 w-full pl-3 text-left font-normal"
      >
        {value ? format(value, "PPP") : <span className="text-gray-500">{placeholder}</span>}
        <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        initialFocus
      />
    </PopoverContent>
  </Popover>
);

export function MarkPaidButton({ depositId, onPaid }: { depositId: string; onPaid?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: undefined,
      chequeNumber: "",
      transactionId: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");
  const showChequeFields = paymentMethod === PAYMENT_METHODS.CHEQUE;
  const showTransactionId = paymentMethod === PAYMENT_METHODS.ONLINE_TRANSFER;

  // Memoized submit handler
  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const result = await updateDepositStatus({ depositId, ...values });
        
        if (result.success) {
          toast.success("Deposit marked as paid", {
            description: "Security deposit payment has been recorded",
          });
          // Optimistic UI update for parent table
          onPaid?.();
          
          router.refresh();
          setOpen(false);
        } else {
          toast.error("Failed to update deposit", {
            description: result.message || "Please check your input and try again",
          });
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  }, [depositId, router, onPaid]);

  // Reset form when dialog closes
  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open);
    if (!open) form.reset();
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

      <DialogContent
        className="sm:max-w-[480px]"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-sm text-gray-600 -mt-2">
              Record how this security deposit was received and the relevant dates.
            </p>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-medium">Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <PaymentMethodSelect />
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(showChequeFields || showTransactionId) && (
              <div className="rounded-lg border p-4 bg-gray-50">
                {showChequeFields && (
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
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Pick a cheque date"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {showTransactionId && (
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
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Pick a payment date"
                  />
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
