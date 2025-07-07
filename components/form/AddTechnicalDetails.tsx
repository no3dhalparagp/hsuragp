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
import { AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react"
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
}

export default function AddTechnicalDetails({ agencyid = "default-agency-id" }: AddTechnicalDetailsProps) {
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
            form.reset()
            // Give user time to see success message before navigating back
            setTimeout(() => router.back(), 1500)
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : "An unexpected error occurred.")
        }
      })
    },
    [agencyid, router, form],
  )

  const handleSubmitClick = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      setIsDialogOpen(true)
    }
  }

  const resetForm = () => {
    form.reset()
    setError(null)
    setSuccess(null)
  }

  const toggleAllCheckboxes = (field: keyof AddTechnicalDetailsSchemaType) => {
    const currentValues = form.getValues(field)
    if (typeof currentValues !== "object" || !currentValues) return

    const allChecked = Object.values(currentValues).every(Boolean)

    Object.keys(currentValues).forEach((key) => {
      form.setValue(`${field}.${key}` as any, !allChecked)
    })
  }

  const qualify = form.watch("qualify")

  // Tooltips for form fields
  const tooltips = {
    credencial: {
      sixtyperamtput: "60% of the payment amount put forward",
      workorder: "Official document authorizing work to begin",
      paymentcertificate: "Certificate confirming payment has been made",
      comcertificat: "Completion certificate for previous projects",
    },
    validityofdocument: {
      itreturn: "Income Tax Return documents",
      gst: "Goods and Services Tax registration",
      ptax: "Professional Tax registration",
      tradelicence: "Valid trade license from local authority",
    },
    byelow: "Organization's bye-laws and regulations",
    pfregistrationupdatechalan: "Provident Fund registration and updated chalans",
    declaration: "Signed declaration of compliance",
    machinary: "List of machinery and equipment owned",
    qualify: "Agency qualifies based on technical criteria",
  }

  return (
    <Form {...form}>
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-muted/50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">Add Technical Details</h2>
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(handleSubmitClick)} className="space-y-8">
            {error && (
              <div
                className="bg-destructive/15 text-destructive p-4 rounded-md flex items-center space-x-2 border border-destructive/30"
                role="alert"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div
                className="bg-green-100 text-green-800 p-4 rounded-md flex items-center space-x-2 border border-green-300"
                role="alert"
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            <div className="space-y-6">
              <fieldset className="p-4 border rounded-md bg-muted/10">
                <legend className="text-lg font-semibold px-2">Credentials</legend>

                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox id="selectCredencialDocuments" onClick={() => toggleAllCheckboxes("credencial")} />
                  <label
                    htmlFor="selectCredencialDocuments"
                    className="text-sm font-medium leading-none cursor-pointer"
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
                      label={key}
                      tooltip={tooltips.credencial[key as keyof typeof tooltips.credencial]}
                    />
                  ))}
                </div>
              </fieldset>

              <Separator />

              <fieldset className="p-4 border rounded-md bg-muted/10">
                <legend className="text-lg font-semibold px-2">Validity of Documents</legend>
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox id="selectValidityDocuments" onClick={() => toggleAllCheckboxes("validityofdocument")} />
                  <label htmlFor="selectValidityDocuments" className="text-sm font-medium leading-none cursor-pointer">
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
                      label={key}
                      tooltip={tooltips.validityofdocument[key as keyof typeof tooltips.validityofdocument]}
                    />
                  ))}
                </div>
              </fieldset>

              <Separator />

              <fieldset className="p-4 border rounded-md bg-muted/10">
                <legend className="text-lg font-semibold px-2">Other Details</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="byelow"
                    label="byelow"
                    tooltip={tooltips.byelow}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="pfregistrationupdatechalan"
                    label="pfregistrationupdatechalan"
                    tooltip={tooltips.pfregistrationupdatechalan}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="declaration"
                    label="declaration"
                    tooltip={tooltips.declaration}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="machinary"
                    label="machinary"
                    tooltip={tooltips.machinary}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="qualify"
                    label="qualify"
                    tooltip={tooltips.qualify}
                  />
                </div>
              </fieldset>

              {!qualify && (
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="remarks"
                  label="Remarks"



                  
                  placeholder="Enter your remarks here..."
                />
              )}
            </div>

            <CardFooter className="flex justify-between px-0 pt-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                Reset Form
              </Button>
              <Button type="submit" className="relative">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit the technical details for this agency? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => form.handleSubmit(onSubmit)()}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  )
}

