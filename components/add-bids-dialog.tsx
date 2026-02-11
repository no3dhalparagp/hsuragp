
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Minus,
  Users,
  FileText,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Building2,
  Phone,
  User,
} from "lucide-react"
import { addBidsToQuotation, getAvailableBidders } from "@/lib/actions/add-bids"
import { useCurrentUser } from "@/hooks/use-current-user"
import { formatCurrency } from "@/lib/utils/date"

interface Bidder {
  id: string
  name: string
  type: string
  contactPerson: string
  phone: string
}

interface BidEntry {
  bidderId: string
  amount: string
  percentage: string
  inputMode: "manual" | "percentage"
  remarks: string
}

interface QuotationInfo {
  id: string
  nitNo: string
  workName: string
  estimatedAmount: number
}

interface AddBidsDialogProps {
  quotation: QuotationInfo
  onBidsAdded: () => void
}

const MINIMUM_BIDDERS_REQUIRED = 3

export function AddBidsDialog({ quotation, onBidsAdded }: AddBidsDialogProps) {
  const [open, setOpen] = useState(false)
  const [bidders, setBidders] = useState<Bidder[]>([])
  const [bids, setBids] = useState<BidEntry[]>([
    { bidderId: "", amount: "", percentage: "", inputMode: "manual", remarks: "" },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const user = useCurrentUser()

  useEffect(() => {
    if (open) {
      loadBidders()
    }
  }, [open])

  const loadBidders = async () => {
    setIsLoading(true)
    try {
      const result = await getAvailableBidders()
      if (result.success) {
        setBidders(result.data || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load bidders",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while loading bidders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAmountFromPercentage = (percentage: string, estimatedAmount: number) => {
    const percentValue = Number.parseFloat(percentage)
    if (isNaN(percentValue) || percentValue < 0) return ""
    return (estimatedAmount * (percentValue / 100)).toFixed(2)
  }

  const calculatePercentageFromAmount = (amount: string, estimatedAmount: number) => {
    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue) || estimatedAmount === 0) return ""
    return ((amountValue / estimatedAmount) * 100).toFixed(2)
  }

  const getEffectiveAmount = (bid: BidEntry) => {
    if (bid.inputMode === "percentage" && bid.percentage) {
      return calculateAmountFromPercentage(bid.percentage, quotation.estimatedAmount)
    }
    return bid.amount || ""
  }

  const updateBid = (index: number, field: keyof BidEntry, value: string) => {
    const updatedBids = [...bids]
    const currentBid = { ...updatedBids[index] }

    if (field === "inputMode") {
      currentBid[field] = value as "manual" | "percentage"
      // When switching modes, preserve the effective amount
      if (value === "percentage") {
        // Switching to percentage mode
        if (currentBid.amount) {
          currentBid.percentage = calculatePercentageFromAmount(currentBid.amount, quotation.estimatedAmount)
        } else {
          currentBid.percentage = ""
        }
      } else {
        // Switching to manual mode
        if (currentBid.percentage) {
          currentBid.amount = calculateAmountFromPercentage(currentBid.percentage, quotation.estimatedAmount)
        } else {
          currentBid.amount = ""
        }
      }
    } else if (field === "percentage") {
      currentBid.percentage = value
      // Auto-calculate amount when percentage changes
      if (value && !isNaN(Number.parseFloat(value))) {
        currentBid.amount = calculateAmountFromPercentage(value, quotation.estimatedAmount)
      } else {
        currentBid.amount = ""
      }
    } else if (field === "amount") {
      currentBid.amount = value
      // Auto-calculate percentage for reference when amount changes
      if (value && !isNaN(Number.parseFloat(value))) {
        currentBid.percentage = calculatePercentageFromAmount(value, quotation.estimatedAmount)
      } else {
        currentBid.percentage = ""
      }
    } else {
      currentBid[field] = value
    }

    updatedBids[index] = currentBid
    setBids(updatedBids)
  }

  const addBidRow = () => {
    setBids([...bids, { bidderId: "", amount: "", percentage: "", inputMode: "manual", remarks: "" }])
  }

  const removeBidRow = (index: number) => {
    if (bids.length > 1) {
      setBids(bids.filter((_, i) => i !== index))
    }
  }

  const getSelectedBidder = (bidderId: string) => {
    return bidders.find((b) => b.id === bidderId)
  }

  const getBidDifference = (bid: BidEntry) => {
    const effectiveAmount = getEffectiveAmount(bid)
    const bidAmount = Number.parseFloat(effectiveAmount)
    if (isNaN(bidAmount)) return null
    return bidAmount - quotation.estimatedAmount
  }

  const getValidBidsCount = () => {
    return bids.filter((bid) => bid.bidderId && getEffectiveAmount(bid)).length
  }

  const getAvailableBiddersForEntry = (currentIndex: number) => {
    const selectedBidderIds = bids
      .filter((_, bidIndex) => bidIndex !== currentIndex)
      .map((b) => b.bidderId)
      .filter(Boolean)

    return bidders.filter(
      (bidder) => bidder.id === bids[currentIndex].bidderId || !selectedBidderIds.includes(bidder.id),
    )
  }

  const isMinimumRequirementMet = () => {
    return getValidBidsCount() >= MINIMUM_BIDDERS_REQUIRED
  }

  const validateBids = () => {
    const errors: string[] = []
    const usedBidders = new Set<string>()

    // Check minimum bidders requirement
    const validBids = bids.filter((bid) => bid.bidderId && getEffectiveAmount(bid))
    if (validBids.length < MINIMUM_BIDDERS_REQUIRED) {
      errors.push(
        `Minimum ${MINIMUM_BIDDERS_REQUIRED} bidders required. Currently have ${validBids.length} valid bids.`,
      )
    }

    bids.forEach((bid, index) => {
      if (!bid.bidderId) {
        errors.push(`Bid ${index + 1}: Please select a bidder`)
      } else if (usedBidders.has(bid.bidderId)) {
        errors.push(`Bid ${index + 1}: Bidder already selected`)
      } else {
        usedBidders.add(bid.bidderId)
      }

      const effectiveAmount = getEffectiveAmount(bid)
      if (bid.inputMode === "percentage") {
        if (!bid.percentage || isNaN(Number.parseFloat(bid.percentage)) || Number.parseFloat(bid.percentage) <= 0) {
          errors.push(`Bid ${index + 1}: Please enter a valid percentage`)
        }
      } else {
        if (!effectiveAmount || isNaN(Number.parseFloat(effectiveAmount)) || Number.parseFloat(effectiveAmount) <= 0) {
          errors.push(`Bid ${index + 1}: Please enter a valid amount`)
        }
      }
    })

    return errors
  }

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add bids",
        variant: "destructive",
      })
      return
    }

    const errors = validateBids()
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const bidData = bids.map((bid) => ({
        bidderId: bid.bidderId,
        amount: Number.parseFloat(getEffectiveAmount(bid)),
        remarks: bid.remarks || undefined,
      }))

      const result = await addBidsToQuotation(quotation.id, bidData, user.id)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Bids added successfully",
        })
        setOpen(false)
        setBids([{ bidderId: "", amount: "", percentage: "", inputMode: "manual", remarks: "" }])
        onBidsAdded()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add bids",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Bids
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            Add Bids to Quotation
          </DialogTitle>
          <DialogDescription className="text-base">
            Submit competitive bids for this quotation and compare against the estimated amount
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Quotation Info Card */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                Quotation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-md">
                    <FileText className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NIT/NIQ Number</p>
                    <p className="font-semibold">{quotation.nitNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-2 bg-white rounded-md">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Amount</p>
                    <p className="font-semibold text-green-700">{formatCurrency(quotation.estimatedAmount)}</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Work Description</p>
                <p className="font-medium text-gray-900">{quotation.workName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Minimum Bidders Warning */}
          {!isMinimumRequirementMet() && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-orange-800">Minimum Bidders Required</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    You need at least {MINIMUM_BIDDERS_REQUIRED} valid bidders to submit this quotation. Currently you
                    have {getValidBidsCount()} valid bid{getValidBidsCount() !== 1 ? "s" : ""}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bids Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-orange-600" />
                  Bid Entries ({bids.length})
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBidRow}
                  className="border-dashed border-2 hover:border-solid bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Bid
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600">Loading available bidders...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {bids.map((bid, index) => (
                    <Card
                      key={index}
                      className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900">Bid Entry #{index + 1}</h4>
                          </div>
                          {bids.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBidRow(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Minus className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Bidder Selection */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Select Bidder
                            </Label>
                            <Select value={bid.bidderId} onValueChange={(value) => updateBid(index, "bidderId", value)}>
                              <SelectTrigger className="h-12">
                                <SelectValue
                                  placeholder={
                                    getAvailableBiddersForEntry(index).length === 0
                                      ? "No more bidders available"
                                      : "Choose a bidder..."
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableBiddersForEntry(index).map((bidder) => (
                                  <SelectItem key={bidder.id} value={bidder.id}>
                                    <div className="flex items-center gap-3 py-2">
                                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Building2 className="h-5 w-5 text-gray-600" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">{bidder.name}</p>
                                        <p className="text-sm text-gray-500">
                                          {bidder.type} • {bidder.contactPerson}
                                        </p>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {bid.bidderId && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                                <Phone className="h-4 w-4" />
                                <span>Contact: {getSelectedBidder(bid.bidderId)?.phone}</span>
                              </div>
                            )}
                          </div>

                          {/* Bid Amount */}
                          <div className="space-y-4">
                            <Label className="text-sm font-medium flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Bid Amount
                            </Label>

                            {/* Input Mode Toggle */}
                            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                              <Button
                                type="button"
                                variant={bid.inputMode === "manual" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => updateBid(index, "inputMode", "manual")}
                                className="flex-1 h-8 text-xs"
                              >
                                Manual Amount
                              </Button>
                              <Button
                                type="button"
                                variant={bid.inputMode === "percentage" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => updateBid(index, "inputMode", "percentage")}
                                className="flex-1 h-8 text-xs"
                              >
                                Percentage
                              </Button>
                            </div>

                            {/* Input Fields */}
                            {bid.inputMode === "manual" ? (
                              <div className="space-y-2">
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  value={bid.amount}
                                  onChange={(e) => updateBid(index, "amount", e.target.value)}
                                  min="0"
                                  step="0.01"
                                  className="h-12 text-lg"
                                />
                                {bid.amount && !isNaN(Number.parseFloat(bid.amount)) && bid.inputMode === "manual" && (
                                  <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded-md">
                                    <span className="font-medium">Equivalent to:</span>{" "}
                                    {calculatePercentageFromAmount(bid.amount, quotation.estimatedAmount)}% of estimated
                                    amount
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="relative">
                                  <Input
                                    type="number"
                                    placeholder="100.00"
                                    value={bid.percentage}
                                    onChange={(e) => updateBid(index, "percentage", e.target.value)}
                                    min="0"
                                    step="0.01"
                                    className="h-12 text-lg pr-8"
                                  />
                                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                    %
                                  </span>
                                </div>
                                {bid.percentage &&
                                  !isNaN(Number.parseFloat(bid.percentage)) &&
                                  bid.inputMode === "percentage" && (
                                    <div className="text-xs text-gray-600 bg-green-50 p-2 rounded-md">
                                      <span className="font-medium">Calculated Amount:</span>{" "}
                                      {formatCurrency(
                                        Number.parseFloat(
                                          calculateAmountFromPercentage(bid.percentage, quotation.estimatedAmount),
                                        ),
                                      )}
                                    </div>
                                  )}
                              </div>
                            )}

                            {/* Bid Difference Display */}
                            {(() => {
                              const difference = getBidDifference(bid)
                              if (difference === null) return null
                              const isBelow = difference < 0
                              const Icon = isBelow ? TrendingDown : TrendingUp
                              const effectiveAmount = getEffectiveAmount(bid)

                              // Calculate percentage difference more accurately
                              let percentageDiff = "0.00"
                              if (effectiveAmount && !isNaN(Number.parseFloat(effectiveAmount))) {
                                const actualPercentage =
                                  (Number.parseFloat(effectiveAmount) / quotation.estimatedAmount) * 100
                                percentageDiff = (actualPercentage - 100).toFixed(2)
                              }

                              return (
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className={`${
                                      isBelow
                                        ? "bg-green-100 text-green-800 border-green-200"
                                        : "bg-red-100 text-red-800 border-red-200"
                                    } flex items-center gap-1`}
                                  >
                                    <Icon className="h-3 w-3" />
                                    {isBelow ? "Savings" : "Excess"}: {formatCurrency(Math.abs(difference))}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {Number.parseFloat(percentageDiff) >= 0 ? "+" : ""}
                                    {percentageDiff}%
                                  </Badge>
                                </div>
                              )
                            })()}
                          </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Remarks */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Additional Remarks (Optional)</Label>
                          <Textarea
                            placeholder="Enter any special conditions, notes, or remarks about this bid..."
                            value={bid.remarks}
                            onChange={(e) => updateBid(index, "remarks", e.target.value)}
                            rows={3}
                            className="resize-none"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <div className="text-sm space-y-1">
            <div className="text-gray-600">
              {bids.length} bid{bids.length !== 1 ? "s" : ""} ready for submission
            </div>
            <div className={`text-xs ${isMinimumRequirementMet() ? "text-green-600" : "text-orange-600"}`}>
              {isMinimumRequirementMet() ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Minimum requirement met ({getValidBidsCount()}/{MINIMUM_BIDDERS_REQUIRED} bidders)
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Need {MINIMUM_BIDDERS_REQUIRED - getValidBidsCount()} more bidder
                  {MINIMUM_BIDDERS_REQUIRED - getValidBidsCount() !== 1 ? "s" : ""} (minimum {MINIMUM_BIDDERS_REQUIRED}{" "}
                  required)
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading || !isMinimumRequirementMet()}
              className="bg-blue-600 hover:bg-blue-700 min-w-[120px] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>
                    Submit {bids.length} Bid{bids.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
