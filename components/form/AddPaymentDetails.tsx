"use client"

import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Loader2,
  Calendar as CalendarIcon,
  CheckCircle,
  Receipt,
  Calculator,
  FileText,
  TrendingDown,
  Shield,
  AlertTriangle,
} from "lucide-react"
import { formatDate } from "@/utils/utils"
import { formSchema, type FormValues } from "@/schema/formSchema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { toast } from "sonner"
import { addPaymentDetails, updatePaymentDetails } from "@/action/payment-details"
import { cn } from "@/lib/utils"

type Props = {
  workId: string
  awardedCost: number
  onSuccess: () => void
  initialValues?: Partial<FormValues>
  paymentDetailsId?: string
}

export function AddPaymentDetailsForm({
  workId,
  awardedCost,
  onSuccess,
  initialValues,
  paymentDetailsId,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [securityDepositPercentage, setSecurityDepositPercentage] = useState<number>(10)
  const [grossAmountExceedsAwarded, setGrossAmountExceedsAwarded] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossBillAmount: initialValues?.grossBillAmount ?? 0,
      lessIncomeTax: initialValues?.lessIncomeTax ?? 0,
      lessLabourWelfareCess: initialValues?.lessLabourWelfareCess ?? 0,
      lessTdsCgst: initialValues?.lessTdsCgst ?? 0,
      lessTdsSgst: initialValues?.lessTdsSgst ?? 0,
      mbrefno: initialValues?.mbrefno ?? "",
      securityDeposit: initialValues?.securityDeposit ?? 0,
      billPaymentDate: initialValues?.billPaymentDate ?? new Date(),
      workcompletaitiondate: initialValues?.workcompletaitiondate,
      eGramVoucher: initialValues?.eGramVoucher ?? "",
      eGramVoucherDate: initialValues?.eGramVoucherDate ?? new Date(),
      gpmsVoucherNumber: initialValues?.gpmsVoucherNumber ?? "",
      gpmsVoucherDate: initialValues?.gpmsVoucherDate ?? new Date(),
      billType: initialValues?.billType,
      netAmount: initialValues?.netAmount ?? 0,
    },
  })

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)

  const [grossAmount, incomeTax, labourCess, tdsCgst, tdsSgst] = useWatch({
    control: form.control,
    name: [
      "grossBillAmount",
      "lessIncomeTax",
      "lessLabourWelfareCess",
      "lessTdsCgst",
      "lessTdsSgst",
    ],
  })

  useEffect(() => {
    setGrossAmountExceedsAwarded(grossAmount > awardedCost)
  }, [grossAmount, awardedCost])

  const securityDeposit = Math.round((grossAmount * securityDepositPercentage) / 100)
  const netAmount = Math.round(
    grossAmount - incomeTax - labourCess - tdsCgst - tdsSgst - securityDeposit
  )
  const totalDeduction = incomeTax + labourCess + tdsCgst + tdsSgst + securityDeposit

  useEffect(() => {
    form.setValue("securityDeposit", securityDeposit)
    form.setValue("netAmount", netAmount)
  }, [securityDeposit, netAmount, form])

  const onSubmit = async (values: FormValues) => {
    if (values.grossBillAmount > awardedCost) {
      setError("Gross bill amount cannot exceed awarded contract value.")
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const response = paymentDetailsId
        ? await updatePaymentDetails(values, workId, paymentDetailsId)
        : await addPaymentDetails(values, workId)

      if (response?.error) {
        setError(response.error)
        toast.error(response.error)
        return
      }

      toast.success(
        paymentDetailsId
          ? "Payment updated successfully"
          : "Payment added successfully"
      )

      form.reset()
      onSuccess()
    } catch {
      toast.error("Submission failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full border border-gray-300 shadow-sm">
      <CardContent className="p-6">
        {error && (
          <Alert className="mb-4 border-orange-300 bg-orange-50 text-orange-900">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* BILL SECTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded">
                  <Receipt className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Bill Information</h3>
              </div>

              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                <div className="flex justify-between">
                  <span className="text-sm">Awarded Contract Value</span>
                  <span className="font-bold text-orange-900">
                    {formatCurrency(awardedCost)}
                  </span>
                </div>
              </div>

              {/* Gross Amount */}
              <FormField
                control={form.control}
                name="grossBillAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gross Bill Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {grossAmountExceedsAwarded && (
                <Alert className="border-orange-300 bg-orange-50 text-orange-900">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Gross amount exceeds awarded contract value.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />

            {/* SECURITY DEPOSIT */}
            <div>
              <h3 className="font-semibold mb-3">Security Deposit</h3>
              <div className="flex gap-2">
                {[0, 5, 10].map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={securityDepositPercentage === p ? "default" : "outline"}
                    onClick={() => setSecurityDepositPercentage(p)}
                    className={cn(
                      securityDepositPercentage === p &&
                        "bg-orange-600 hover:bg-orange-700 text-white"
                    )}
                  >
                    {p}%
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* CALCULATED SUMMARY */}
            <div className="space-y-3">
              <h3 className="font-semibold">Summary</h3>

              <div className="bg-orange-50 p-4 rounded border border-orange-200">
                <div className="flex justify-between text-sm text-orange-700">
                  <span>Total Deductions</span>
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div className="font-bold text-orange-900">
                  {formatCurrency(totalDeduction)}
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded border border-orange-200">
                <div className="flex justify-between text-sm text-orange-700">
                  <span>Security Deposit</span>
                  <Shield className="w-4 h-4" />
                </div>
                <div className="font-bold text-orange-900">
                  {formatCurrency(securityDeposit)}
                </div>
              </div>

              <div className="bg-orange-100 p-4 rounded border border-orange-400">
                <div className="flex justify-between text-sm font-semibold text-orange-800">
                  <span>Net Amount Payable</span>
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold text-orange-900">
                  {formatCurrency(netAmount)}
                </div>
              </div>
            </div>

            <CardFooter className="px-0 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || grossAmountExceedsAwarded}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                {paymentDetailsId ? "Update Payment" : "Add Payment"}
              </Button>
            </CardFooter>

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
