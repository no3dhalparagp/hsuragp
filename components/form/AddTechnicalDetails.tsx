"use client"

import { useState, useTransition, useCallback } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle2, ArrowLeft, Loader2, FileCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CustomFormField, { FormFieldType } from "@/components/CustomFormField"
import { addtechnicaldetailsofagency } from "@/action/bookNitNuber"
import { AddTechnicalDetailsSchema, type AddTechnicalDetailsSchemaType } from "@/schema/tender-management-schema"

interface AddTechnicalDetailsProps {
  agencyid: string
  isDialogMode?: boolean
  afterSubmit?: () => void
}

export default function AddTechnicalDetails({ agencyid, isDialogMode = false, afterSubmit }: AddTechnicalDetailsProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const form = useForm<AddTechnicalDetailsSchemaType>({
    resolver: zodResolver(AddTechnicalDetailsSchema),
    defaultValues: {
      credencial: {
        sixtyperamtput: false,
        workorder: false,
        paymentcertificate: false,
        comcertificat: false,
      },
      validityofdocument: {
        itreturn: false,
        gst: false,
        ptax: false,
        tradelicence: false,
      },
      byelow: false,
      pfregistrationupdatechalan: false,
      declaration: false,
      machinary: false,
      qualify: false,
      remarks: "",
    },
  })

  const onSubmit = useCallback(
    async (data: AddTechnicalDetailsSchemaType) => {
      setError(null)
      setSuccess(null)
      setIsDialogOpen(false)

      startTransition(async () => {
        try {
          const result = await addtechnicaldetailsofagency(data, agencyid)
          if (result.error) {
            setError(result.error)
          } else if (result.success) {
            setSuccess(result.success)

            if (isDialogMode && afterSubmit) {
              afterSubmit()
            } else {
              form.reset()
              setTimeout(() => router.back(), 1500)
            }
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : "An unexpected error occurred.")
        }
      })
    },
    [agencyid, router, form, isDialogMode, afterSubmit],
  )

  const handleSubmitClick = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      if (isDialogMode) {
        onSubmit(form.getValues())
      } else {
        setIsDialogOpen(true)
      }
    }
  }

  const resetForm = () => {
    form.reset()
    setError(null)
    setSuccess(null)
  }

  const toggleAllCheckboxes = (field: "credencial" | "validityofdocument") => {
    const currentValues = form.getValues(field)
    const allChecked = Object.values(currentValues).every(Boolean)
    const newValues = Object.keys(currentValues).reduce(
      (acc, key) => {
        return { ...acc, [key]: !allChecked }
      },
      {} as typeof currentValues,
    )
    form.setValue(field, newValues)
  }

  const qualify = form.watch("qualify")

  const tooltips = {
    credencial: {
      sixtyperamtput: "60% of the payment amount put forward",
      workorder: "Official work order documentation",
      paymentcertificate: "Certificate confirming payment",
      comcertificat: "Completion certificate for previous projects",
    },
    validityofdocument: {
      itreturn: "Income Tax Return documents",
      gst: "Goods and Services Tax registration",
      ptax: "Professional Tax registration",
      tradelicence: "Valid trade license",
    },
    byelow: "Organization's bye-laws and regulations",
    pfregistrationupdatechalan: "Provident Fund registration documents",
    declaration: "Signed declaration of compliance",
    machinary: "List of machinery and equipment owned",
    qualify: "Agency qualifies based on technical criteria",
  }

  return (
    <Form {...form}>
      <Card className="w-full max-w-4xl mx-auto shadow-xl border-0 bg-gradient-to-br from-slate-50 to-slate-100">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <FileCheck className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Technical Details</h2>
            </div>
            {!isDialogMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmitClick()
            }}
            className="space-y-8"
          >
            {error && (
              <div
                className="bg-red-50 text-red-900 p-4 rounded-lg flex items-center space-x-3 border border-red-200 shadow-sm"
                role="alert"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div
                className="bg-emerald-50 text-emerald-900 p-4 rounded-lg flex items-center space-x-3 border border-emerald-200 shadow-sm"
                role="alert"
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                <p className="text-sm font-medium">{success}</p>
              </div>
            )}

            <div className="space-y-8">
              <fieldset className="p-6 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                    1
                  </div>
                  <legend className="text-lg font-bold text-slate-900">Credentials</legend>
                </div>

                <div className="flex items-center space-x-3 mb-6 p-3 bg-slate-50 rounded-lg">
                  <Checkbox
                    id="selectCredencialDocuments"
                    onClick={() => toggleAllCheckboxes("credencial")}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor="selectCredencialDocuments"
                    className="text-sm font-semibold text-slate-700 cursor-pointer"
                  >
                    Select All Credential Documents
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(form.getValues("credencial")).map(([key]) => (
                    <CustomFormField
                      key={key}
                      fieldType={FormFieldType.CHECKBOX}
                      control={form.control}
                      name={`credencial.${key}`}
                      label={key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase())}
                      tooltip={tooltips.credencial[key as keyof typeof tooltips.credencial]}
                    />
                  ))}
                </div>
              </fieldset>

              <Separator className="bg-slate-200" />

              <fieldset className="p-6 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
                    2
                  </div>
                  <legend className="text-lg font-bold text-slate-900">Validity of Documents</legend>
                </div>
                <div className="flex items-center space-x-3 mb-6 p-3 bg-slate-50 rounded-lg">
                  <Checkbox
                    id="selectValidityDocuments"
                    onClick={() => toggleAllCheckboxes("validityofdocument")}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor="selectValidityDocuments"
                    className="text-sm font-semibold text-slate-700 cursor-pointer"
                  >
                    Select All Validity Documents
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(form.getValues("validityofdocument")).map(([key]) => (
                    <CustomFormField
                      key={key}
                      fieldType={FormFieldType.CHECKBOX}
                      control={form.control}
                      name={`validityofdocument.${key}`}
                      label={key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase())}
                      tooltip={tooltips.validityofdocument[key as keyof typeof tooltips.validityofdocument]}
                    />
                  ))}
                </div>
              </fieldset>

              <Separator className="bg-slate-200" />

              <fieldset className="p-6 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
                    3
                  </div>
                  <legend className="text-lg font-bold text-slate-900">Other Details</legend>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="byelow"
                    label="Bye-laws"
                    tooltip={tooltips.byelow}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="pfregistrationupdatechalan"
                    label="PF Registration"
                    tooltip={tooltips.pfregistrationupdatechalan}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="declaration"
                    label="Declaration"
                    tooltip={tooltips.declaration}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="machinary"
                    label="Machinery"
                    tooltip={tooltips.machinary}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="qualify"
                    label="Qualifies"
                    tooltip={tooltips.qualify}
                  />
                </div>
              </fieldset>

              {!qualify && (
                <div className="p-6 border border-slate-200 rounded-lg bg-white shadow-sm">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="remarks"
                    label="Remarks"
                    placeholder="Enter your remarks here..."
                  />
                </div>
              )}
            </div>

            <CardFooter className="flex justify-between px-0 pt-6 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isPending}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {!isDialogMode && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="border-slate-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-slate-900">Confirm Submission</DialogTitle>
              <DialogDescription className="text-slate-600">
                Are you sure you want to submit the technical details? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isPending}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => onSubmit(form.getValues())}
                disabled={isPending}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Form>
  )
}
