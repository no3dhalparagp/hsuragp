"use client"

import type React from "react"

import { useState } from "react"
import type { WorksDetailWithRelations } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircledIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

type BidType = {
  id: string
  agencydetails: {
    id: string
    name: string
    agencyType: "FARM" | "INDIVIDUAL"
    mobileNumber: string | null
  }
  biddingAmount: number | null
}

type AOCFormProps = {
  works: WorksDetailWithRelations[]
}

export default function AOCForm({ works }: AOCFormProps) {
  const [selectedWorkId, setSelectedWorkId] = useState<string>("")
  const [selectedBidId, setSelectedBidId] = useState<string>("")
  const [aocMemoNumber, setAocMemoNumber] = useState<string>("")
  const [aocMemoDate, setAocMemoDate] = useState<Date | undefined>(undefined)

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const selectedWork = works.find((work) => work.id === selectedWorkId)
  const bids: BidType[] = selectedWork?.biddingAgencies || []

  const getBidRank = (bidId: string) => {
    const sortedBids = [...bids].sort(
      (a, b) => (a.biddingAmount || Number.POSITIVE_INFINITY) - (b.biddingAmount || Number.POSITIVE_INFINITY),
    )
    return sortedBids.findIndex((bid) => bid.id === bidId) + 1
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!selectedWorkId || !selectedBidId || !aocMemoNumber || !aocMemoDate) {
      toast({
        title: "Missing required fields",
        description: "Please select a work, a bidder, enter memo number and pick a date.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const selectedBid = bids.find((bid) => bid.id === selectedBidId)
      const selectedBidAmount = selectedBid?.biddingAmount ?? null
      const response = await fetch("/api/aoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workId: selectedWorkId,
          bidId: selectedBidId,
          aocMemoNumber,
          aocMemoDate: format(aocMemoDate, "yyyy-MM-dd"),
          bidAmount: selectedBidAmount,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error?.error || "Failed to create AOC")
      }

      toast({
        title: "AOC created",
        description: "The Acceptance of Contract has been saved successfully.",
      })
      setSelectedWorkId("")
      setSelectedBidId("")
      setAocMemoNumber("")
      setAocMemoDate(undefined)
    } catch (error) {
      console.error("Error creating AOC:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error creating AOC",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Acceptance of Contract</h1>
        <p className="text-gray-600">Select a work project and winning bidder to generate the AOC document</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Contract Details</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Work Selection */}
            <div className="space-y-3">
              <Label htmlFor="work" className="text-sm font-medium text-gray-700">
                Select Work Project *
              </Label>
              <Select value={selectedWorkId} onValueChange={setSelectedWorkId}>
                <SelectTrigger id="work" className="h-12">
                  <SelectValue placeholder="Choose a work project" />
                </SelectTrigger>
                <SelectContent className="max-w-2xl">
                  {works.map((work) => {
                    const description = work.ApprovedActionPlanDetails?.activityDescription || ""
                    const truncated = description.slice(0, 60) + (description.length > 60 ? "..." : "")
                    return (
                      <SelectItem key={work.id} value={work.id} className="py-3">
                        <div className="flex flex-col items-start w-full">
                          <span className="font-medium text-gray-900 mb-1">{work.nitDetails?.memoNumber}</span>
                          <span className="text-sm text-gray-600 leading-relaxed">{truncated}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              {selectedWork && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Selected Work Project:</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-blue-800">Memo Number: </span>
                      <span className="text-sm text-blue-700">{selectedWork.nitDetails?.memoNumber}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-blue-800">Full Description: </span>
                      <p className="text-sm text-blue-700 leading-relaxed mt-1">
                        {selectedWork.ApprovedActionPlanDetails?.activityDescription || "No description available"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bidder Selection */}
            {selectedWork && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Select Winning Bidder *</Label>
                  <Badge variant="secondary" className="text-xs">
                    {bids.length} {bids.length === 1 ? "bid" : "bids"} received
                  </Badge>
                </div>

                {bids.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="font-medium">No bids available</p>
                    <p className="text-sm">This work project has no submitted bids yet.</p>
                  </div>
                ) : (
                  <RadioGroup value={selectedBidId} onValueChange={setSelectedBidId} className="space-y-3">
                    {[...bids]
                      .sort(
                        (a, b) =>
                          (a.biddingAmount || Number.POSITIVE_INFINITY) - (b.biddingAmount || Number.POSITIVE_INFINITY),
                      )
                      .map((bid, index) => {
                        const isSelected = selectedBidId === bid.id
                        const rank = getBidRank(bid.id)
                        const isLowest = rank === 1

                        return (
                          <label
                            key={bid.id}
                            htmlFor={`bid-${bid.id}`}
                            className={cn(
                              "flex items-center justify-between gap-4 border-2 rounded-lg p-4 cursor-pointer transition-all duration-200",
                              isSelected
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                              isLowest && "ring-2 ring-green-100",
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <RadioGroupItem
                                id={`bid-${bid.id}`}
                                value={bid.id}
                                className={cn("w-5 h-5", isSelected && "border-blue-500")}
                              />
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                                    isLowest ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600",
                                  )}
                                >
                                  {rank}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                                    {bid.agencydetails.name}
                                    {isLowest && <CheckCircledIcon className="w-4 h-4 text-green-600" />}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Badge
                                      variant={bid.agencydetails.agencyType === "FARM" ? "default" : "secondary"}
                                      className="text-xs"
                                    >
                                      {bid.agencydetails.agencyType === "FARM" ? "Farm" : "Individual"}
                                    </Badge>
                                    {isLowest && (
                                      <Badge variant="outline" className="text-xs text-green-700 border-green-200">
                                        Lowest Bid
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={cn("text-lg font-bold", isLowest ? "text-green-700" : "text-gray-900")}>
                                {bid.biddingAmount !== null ? `₹${bid.biddingAmount.toLocaleString()}` : "N/A"}
                              </div>
                              {isLowest && bid.biddingAmount && (
                                <div className="text-xs text-green-600 font-medium">Best Value</div>
                              )}
                            </div>
                          </label>
                        )
                      })}
                  </RadioGroup>
                )}
              </div>
            )}
          </div>
        </div>

        {/* AOC Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">AOC Memo Details</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AOC Memo Number */}
              <div className="space-y-3">
                <Label htmlFor="aocMemoNumber" className="text-sm font-medium text-gray-700">
                  AOC Memo Number *
                </Label>
                <Input
                  id="aocMemoNumber"
                  value={aocMemoNumber}
                  onChange={(e) => setAocMemoNumber(e.target.value)}
                  placeholder="Enter memo number (e.g., AOC/2024/001)"
                  className="h-12"
                  required
                />
              </div>

              {/* AOC Memo Date */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">AOC Memo Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !aocMemoDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-3 h-4 w-4" />
                      {aocMemoDate ? format(aocMemoDate, "PPP") : <span>Select memo date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={aocMemoDate}
                      onSelect={setAocMemoDate}
                      initialFocus
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-8 py-3 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              "Create AOC Document"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
