"use client"

import { useState, useTransition, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { CheckCircle, CalendarIcon, Banknote, Landmark } from "lucide-react"
import { updateDepositStatus } from "@/action/deposits"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

/* ==============================
   Payment Method Enum
================================ */
export const PAYMENT_METHODS = {
  CHEQUE: "CHEQUE",
  ONLINE_TRANSFER: "ONLINE_TRANSFER",
  CASH: "CASH",
} as const

type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS]

/* ==============================
   Validation Schema
================================ */
const formSchema = z
  .object({
    paymentMethod: z.enum([
      PAYMENT_METHODS.CHEQUE,
      PAYMENT_METHODS.ONLINE_TRANSFER,
      PAYMENT_METHODS.CASH,
    ]),
    chequeNumber: z.string().trim().optional(),
    chequeDate: z.coerce.date().optional(),
    transactionId: z.string().trim().optional(),
    paymentDate: z.coerce.date({
      required_error: "Payment date is required",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === PAYMENT_METHODS.CHEQUE) {
      if (!data.chequeNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chequeNumber"],
          message: "Cheque number is required",
        })
      }
      if (!data.chequeDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chequeDate"],
          message: "Cheque date is required",
        })
      }
    }

    if (
      data.paymentMethod === PAYMENT_METHODS.ONLINE_TRANSFER &&
      !data.transactionId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["transactionId"],
        message: "Transaction ID is required",
      })
    }
  })

/* ==============================
   Date Picker Component
================================ */
function DatePicker({
  value,
  onChange,
  placeholder,
}: {
  value?: Date
  onChange: (date?: Date) => void
  placeholder: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-full justify-between text-left font-normal"
        >
          {value ? (
            format(value, "PPP")
          ) : (
            <span className="text-muted-foreground">
              {placeholder}
            </span>
          )}
          <CalendarIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

/* ==============================
   Main Component
================================ */
export function MarkPaidButton({
  depositId,
  onPaid,
}: {
  depositId: string
  onPaid?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: undefined,
      chequeNumber: "",
      chequeDate: undefined,
      transactionId: "",
      paymentDate: undefined,
    },
  })

  const paymentMethod = form.watch("paymentMethod")
  const showCheque = paymentMethod === PAYMENT_METHODS.CHEQUE
  const showTransaction =
    paymentMethod === PAYMENT_METHODS.ONLINE_TRANSFER

  const handleSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      startTransition(async () => {
        try {
          const result = await updateDepositStatus({
            depositId,
            ...values,
          })

          if (result?.success) {
            toast.success("Deposit marked as paid", {
              description:
                "Security deposit payment successfully recorded.",
            })

            onPaid?.()
            router.refresh()
            setOpen(false)
            form.reset()
          } else {
            toast.error(
              result?.message ||
                "Failed to update deposit status",
            )
          }
        } catch (error) {
          console.error(error)
          toast.error("Unexpected error occurred")
        }
      })
    },
    [depositId, router, onPaid, form],
  )

  const handleOpenChange = useCallback(
    (state: boolean) => {
      if (!isPending) {
        setOpen(state)
        if (!state) form.reset()
      }
    },
    [form, isPending],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
        >
          <CheckCircle className="h-4 w-4" />
          Mark as Paid
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[480px]"
        onInteractOutside={(e) =>
          isPending && e.preventDefault()
        }
        onEscapeKeyDown={(e) =>
          isPending && e.preventDefault()
        }
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Record Payment Details
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Payment Method
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CHEQUE">
                        Cheque
                      </SelectItem>
                      <SelectItem value="ONLINE_TRANSFER">
                        Online Transfer
                      </SelectItem>
                      <SelectItem value="CASH">
                        Cash
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showCheque && (
              <>
                <FormField
                  control={form.control}
                  name="chequeNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
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
                    <FormItem>
                      <FormLabel>
                        Cheque Date
                      </FormLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select cheque date"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {showTransaction && (
              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
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

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Payment Date
                  </FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select payment date"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-green-600 hover:bg-green-700"
            >
              {isPending
                ? "Processing..."
                : "Confirm Payment"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
