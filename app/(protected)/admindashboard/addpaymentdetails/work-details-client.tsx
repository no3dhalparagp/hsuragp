"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Edit, FileText, Building2, IndianRupee, Hash, Filter, X } from "lucide-react"
import { ShowNitDetails } from "@/components/ShowNitDetails"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {AddPaymentDetailsForm} from "@/components/form/AddPaymentDetails";

interface WorkDetailsClientProps {
  initialWorkDetails: any[]
  schemeNames: string[]
}

export function WorkDetailsClient({ initialWorkDetails, schemeNames }: WorkDetailsClientProps) {
  const [selectedScheme, setSelectedScheme] = useState<string>("all")
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null)

  // Filter work details based on selected scheme
  const filteredWorkDetails = useMemo(() => {
    if (selectedScheme === "all") {
      return initialWorkDetails
    }
    return initialWorkDetails.filter((work) => work.ApprovedActionPlanDetails?.schemeName === selectedScheme)
  }, [initialWorkDetails, selectedScheme])

  // Calculate totals based on filtered data
  const totalWorks = filteredWorkDetails.length
  const totalAwardedValue = filteredWorkDetails.reduce((sum, work) => {
    const amount = work.AwardofContract?.workorderdetails[0]?.Bidagency?.biddingAmount || 0
    return sum + amount
  }, 0)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const clearFilter = () => {
    setSelectedScheme("all")
  }

  const handleEditClick = (workId: string) => {
    setSelectedWorkId(workId)
    setOpenDialog(true)
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Filter Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <Filter className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-900">Filter Works</h3>
                <p className="text-sm text-purple-600">Filter by scheme name</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={selectedScheme} onValueChange={setSelectedScheme}>
                <SelectTrigger className="w-64 bg-white">
                  <SelectValue placeholder="Select scheme name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schemes</SelectItem>
                  {schemeNames.map((scheme) => (
                    <SelectItem key={scheme} value={scheme}>
                      {scheme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedScheme !== "all" && (
                <Button variant="outline" size="sm" onClick={clearFilter} className="bg-white hover:bg-gray-50">
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
          {selectedScheme !== "all" && (
            <div className="mt-4 p-3 bg-purple-100 rounded-lg">
              <p className="text-sm text-purple-700">
                <strong>Active Filter:</strong> Showing works for scheme &quot;{selectedScheme}&quot;
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  {selectedScheme === "all" ? "Total Works" : "Filtered Works"}
                </p>
                <h3 className="text-2xl font-bold text-blue-900 mt-1">{totalWorks}</h3>
                {selectedScheme !== "all" && (
                  <p className="text-xs text-blue-500 mt-1">of {initialWorkDetails.length} total works</p>
                )}
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  {selectedScheme === "all" ? "Total Awarded Value" : "Filtered Awarded Value"}
                </p>
                <h3 className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(totalAwardedValue)}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <IndianRupee className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                Work Details
                {selectedScheme !== "all" && (
                  <span className="text-blue-200 text-lg font-normal ml-2">- {selectedScheme}</span>
                )}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {selectedScheme === "all"
                  ? "Overview of all ongoing projects with awarded contracts"
                  : `Projects filtered by scheme: ${selectedScheme}`}
              </CardDescription>
            </div>
            <div className="p-3 bg-white/10 rounded-full">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="p-4 font-semibold text-gray-700">SL No</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-700">NIT Details</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-700">Work Name</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-700">Scheme Name</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-700">Agency Name</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-700">Awarded Cost</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-700 text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkDetails.length > 0 ? (
                  filteredWorkDetails.map((work, index) => (
                    <TableRow key={work.id} className="hover:bg-gray-50/50">
                      <TableCell className="p-4">
                        <div className="flex items-center">
                          <Hash className="h-4 w-4 text-gray-400 mr-2" />
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <ShowNitDetails
                          nitdetails={work.nitDetails.memoNumber}
                          memoDate={work.nitDetails.memoDate}
                          workslno={work.workslno}
                        />
                      </TableCell>
                      <TableCell className="p-4 font-medium">
                        {work.ApprovedActionPlanDetails?.activityDescription}
                      </TableCell>
                      <TableCell className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {work.ApprovedActionPlanDetails?.schemeName || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="p-4">
                        {work.AwardofContract?.workorderdetails[0]?.Bidagency?.agencydetails?.name}
                      </TableCell>
                      <TableCell className="p-4 font-semibold text-green-700">
                        {formatCurrency(work.AwardofContract?.workorderdetails[0]?.Bidagency?.biddingAmount || 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog open={openDialog && selectedWorkId === work.id} onOpenChange={setOpenDialog}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              onClick={() => handleEditClick(work.id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl">Add Payment Details</DialogTitle>
                              <div className="text-sm text-gray-500">
                                Work: {work.ApprovedActionPlanDetails?.activityDescription}
                              </div>
                            </DialogHeader>
                            <div className="py-4">
                              {selectedWorkId && (
                                <AddPaymentDetailsForm 
                                  workId={selectedWorkId}
                                  awardedCost={work.AwardofContract?.workorderdetails[0]?.Bidagency?.biddingAmount || 0}
                                  onSuccess={() => setOpenDialog(false)}
                                />
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-lg">
                          {selectedScheme === "all"
                            ? "No work details found"
                            : `No work details found for scheme ${selectedScheme}`}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {selectedScheme === "all"
                            ? "Add new work details to get started"
                            : "Try selecting a different scheme or clear the filter"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
