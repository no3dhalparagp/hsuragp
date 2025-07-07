"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useTransition, useEffect } from "react"
import { Loader2, FileText, Building, AlertCircle, CheckCircle2 } from "lucide-react"
import type { workdetailfinanicalProps } from "@/types"
import { addFinancialDetails } from "@/action/bookNitNuber"
import { FaRupeeSign } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const bidSchema = z.object({
  bids: z.array(
    z.object({
      agencyId: z.string(),
      lessPercentage: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
        message: "Less percentage must be between 0 and 100",
      }),
      bidAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Bid amount must be a positive number",
      }),
    }),
  ),
})

type BidFormValues = z.infer<typeof bidSchema>

export default function FinancialBidDetails({ work }: { work: workdetailfinanicalProps }) {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()
  const [localWork, setLocalWork] = useState(work)

  useEffect(() => {
    setLocalWork(work)
  }, [work])

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      bids: localWork.biddingAgencies.map((agency) => ({
        agencyId: agency.id,
        lessPercentage: "",
        bidAmount: "",
      })),
    },
  })

  const onSubmit = async (data: BidFormValues) => {
    setError(undefined)
    setSuccess(undefined)
    startTransition(() => {
      Promise.all(data.bids.map((bid) => addFinancialDetails(bid.agencyId, bid.bidAmount, localWork.id)))
        .then((results) => {
          const errors = results.filter((r) => r?.error).map((r) => r?.error)
          if (errors.length) {
            setError(errors.join(". "))
          } else {
            setLocalWork(prev => ({
              ...prev,
              biddingAgencies: prev.biddingAgencies.map(agency => {
                const submittedBid = data.bids.find(bid => bid.agencyId === agency.id)
                if (submittedBid) {
                  return { ...agency, biddingAmount: Number(submittedBid.bidAmount) }
                }
                return agency
              })
            }))
            setSuccess("All bids submitted successfully")
            router.push("/admindashboard/manage-tender/addfinanicaldetails")
          }
        })
    })
  }

  const calculateBidAmount = (index: number, lessPercentage: string) => {
    const percentage = Number.parseFloat(lessPercentage)
    if (!isNaN(percentage)) {
      const bidAmount = localWork.finalEstimateAmount * (1 - percentage / 100)
      form.setValue(`bids.${index}.bidAmount`, bidAmount.toFixed(2))
    }
  }

  const allBidsEntered = !localWork.biddingAgencies.some((bit) => bit.biddingAmount == null)

  const calculateLowestBid = () => {
    const validBids = form
      .getValues()
      .bids.filter((bid) => !isNaN(Number.parseFloat(bid.bidAmount)) && Number.parseFloat(bid.bidAmount) > 0)
    if (validBids.length === 0) return null

    const lowestBid = validBids.reduce((lowest, current) => {
      return Number.parseFloat(current.bidAmount) < Number.parseFloat(lowest.bidAmount) ? current : lowest
    })

    const lowestBidAgency = localWork.biddingAgencies.find((agency) => agency.id === lowestBid.agencyId)
    return {
      agencyName: lowestBidAgency?.agencydetails.name || "Unknown",
      amount: Number.parseFloat(lowestBid.bidAmount),
    }
  }

  if (!localWork) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Work Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">The requested work details could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default" className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-primary/90 to-primary/80 text-white rounded-t-lg">
          <div className="flex flex-col space-y-2">
            <CardTitle className="text-2xl md:text-3xl font-bold">Financial Bid Details</CardTitle>
            <CardDescription className="text-primary-foreground/90">
              {localWork.ApprovedActionPlanDetails.activityDescription}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="mb-8 bg-muted/20 p-6 rounded-lg border border-muted">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <FileText className="mr-2 h-5 w-5 text-primary" /> Tender Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Memo Number</p>
                <p className="font-medium text-foreground">{localWork.nitDetails.memoNumber}/DGP/2024</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimate Value</p>
                <p className="font-medium text-foreground">
                  {localWork.finalEstimateAmount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                </p>
              </div>
            </div>
          </div>

          {allBidsEntered ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="text-xl font-semibold text-green-700">All Bids Entered</h3>
              <p className="text-muted-foreground">Bids have already been submitted for all agencies.</p>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[30%]">Agency Name</TableHead>
                    <TableHead className="w-[20%]">Less Percentage</TableHead>
                    <TableHead className="w-[20%]">Bid Amount</TableHead>
                    <TableHead className="w-[20%]">Less Value</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localWork.biddingAgencies.map((agency, index) => {
                    const bidAmount = Number.parseFloat(form.watch(`bids.${index}.bidAmount`))
                    const lessValue = localWork.finalEstimateAmount - (isNaN(bidAmount) ? 0 : bidAmount)
                    const isBidValid = !isNaN(bidAmount) && bidAmount > 0

                    return (
                      <TableRow key={agency.id} className="hover:bg-muted/10">
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Building className="h-5 w-5 text-muted-foreground" />
                            <span>{agency.agencydetails.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="0.00%"
                            {...form.register(`bids.${index}.lessPercentage`)}
                            onChange={(e) => {
                              form.setValue(`bids.${index}.lessPercentage`, e.target.value)
                              calculateBidAmount(index, e.target.value)
                            }}
                            className="w-full"
                          />
                          {form.formState.errors.bids?.[index]?.lessPercentage && (
                            <p className="text-sm text-destructive mt-1">
                              {form.formState.errors.bids[index]?.lessPercentage?.message}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="relative">
                            <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="0.00"
                              className="pl-8"
                              {...form.register(`bids.${index}.bidAmount`)}
                            />
                          </div>
                          {form.formState.errors.bids?.[index]?.bidAmount && (
                            <p className="text-sm text-destructive mt-1">
                              {form.formState.errors.bids[index]?.bidAmount?.message}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {lessValue.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                          </span>
                        </TableCell>
                        <TableCell>
                          {isBidValid ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-destructive" />
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              <div className="space-y-4">
                {form
                  .getValues()
                  .bids.some(
                    (bid) => !isNaN(Number.parseFloat(bid.bidAmount)) && Number.parseFloat(bid.bidAmount) > 0,
                  ) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-green-800 mb-2">Lowest Bidder</h4>
                    {(() => {
                      const lowestBid = calculateLowestBid()
                      return lowestBid ? (
                        <p className="text-green-700">
                          <span className="font-medium">{lowestBid.agencyName}</span> with a bid of{" "}
                          <span className="font-medium">
                            {lowestBid.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                          </span>
                        </p>
                      ) : (
                        <p className="text-yellow-700">No valid bids to compare.</p>
                      )
                    })()}
                  </div>
                )}
                <div className="flex justify-end">
                  <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? "Saving Bids..." : "Save All Bids"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
