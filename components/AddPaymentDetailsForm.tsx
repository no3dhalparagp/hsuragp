// components/AddPaymentDetailsForm.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface AddPaymentDetailsFormProps {
  workId: string
  onSuccess: () => void
}

export function AddPaymentDetailsForm({ workId, onSuccess }: AddPaymentDetailsFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      referenceNumber: "",
      amount: "",
      paymentMethod: "",
      remarks: "",
      document: ""
    }
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Reset form on success
      reset()
      setDate(new Date())
      
      toast.success("Payment details added successfully!", {
        description: `Reference: ${data.referenceNumber} - Amount: ₹${data.amount}`,
      })
      
      // Close dialog after successful submission
      onSuccess()
    } catch (error) {
      toast.error("Failed to add payment details", {
        description: "Please try again later",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="referenceNumber">Reference Number *</Label>
          <Input
            id="referenceNumber"
            placeholder="Enter payment reference number"
            {...register("referenceNumber", { required: "Reference number is required" })}
          />
          {errors.referenceNumber && (
            <p className="text-red-500 text-sm">{errors.referenceNumber.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Payment Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                required
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹) *</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter payment amount"
            {...register("amount", { 
              required: "Amount is required",
              min: { value: 1, message: "Amount must be greater than 0" }
            })}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method *</Label>
          <Select
            onValueChange={(value) => setValue("paymentMethod", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cheque">Cheque</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="online">Online Payment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            placeholder="Add any additional remarks"
            rows={3}
            {...register("remarks")}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="document">Upload Supporting Document</Label>
          <div className="flex items-center gap-4">
            <Input
              id="document"
              type="file"
              accept=".pdf,.jpg,.png"
              {...register("document")}
            />
            <span className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB)</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            reset()
            setDate(new Date())
          }}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Add Payment"
          )}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Work Information</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-600">Work ID:</div>
          <div className="font-medium">{workId}</div>
          <div className="text-gray-600">Status:</div>
          <div className="font-medium text-green-600">Active</div>
        </div>
      </div>
    </form>
  )
}
