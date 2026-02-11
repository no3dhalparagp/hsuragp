
"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, IndianRupee, CalendarCheck, FileText, Check, Filter, Download, Search, ChevronDown } from "lucide-react"
import { ShowNitDetails } from "@/components/ShowNitDetails"
import type { Deposit } from "@/types"
import { formatDate } from "@/utils/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { MarkPaidButton } from "./MarkPaidButton"
import { motion } from "framer-motion"

interface SecurityDepositsPageProps {
  deposits: Deposit[]
}

type SecurityDepositStatus = "paid" | "unpaid"

// Utility functions
const normalizeStatus = (status: SecurityDepositStatus): "paid" | "unpaid" => {
  return status === "paid" ? "paid" : "unpaid"
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const calculateMaturityDate = (completionDate: Date | null) => {
  if (!completionDate) return null
  const maturityDate = new Date(completionDate)
  maturityDate.setMonth(maturityDate.getMonth() + 6)
  return maturityDate
}

const calculateDaysRemaining = (maturityDate: Date | null) => {
  if (!maturityDate) return null
  const today = new Date()
  const maturity = new Date(maturityDate)
  if (isNaN(maturity.getTime())) return null
  const diffTime = maturity.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Add new component for table row
const DepositTableRow = memo(
  ({
    deposit,
    index,
    selectedDeposits,
    onToggleSelection,
    depositStatuses,
    onPaid,
  }: {
    deposit: Deposit
    index: number
    selectedDeposits: Set<string>
    onToggleSelection: (id: string) => void
    depositStatuses: Record<string, "paid" | "unpaid">
    onPaid: (id: string) => void
  }) => {
    if (!deposit.PaymentDetails || deposit.PaymentDetails.length === 0) {
      return null
    }

    const paymentDetail = deposit.PaymentDetails[0]
    const worksDetails = paymentDetail.WorksDetail
    const completionDate = worksDetails?.completionDate
    const maturityDate = calculateMaturityDate(completionDate)
    const daysRemaining = calculateDaysRemaining(maturityDate)
    const nitDetails = worksDetails?.nitDetails
    const bidAgency = worksDetails?.AwardofContract?.workorderdetails[0]?.Bidagency?.agencydetails.name
    const currentStatus = depositStatuses[deposit.id] || normalizeStatus(deposit.paymentstatus)

    return (
      <TableRow className="border-b border-slate-200 hover:bg-slate-50/80 transition-colors">
        <TableCell className="px-6 py-4">
          <Checkbox
            checked={selectedDeposits.has(deposit.id)}
            onCheckedChange={() => onToggleSelection(deposit.id)}
            aria-label={`Select deposit ${index + 1}`}
          />
        </TableCell>
        <TableCell className="px-6 py-4 font-medium text-slate-900">{index + 1}</TableCell>
        <TableCell className="px-6 py-4 max-w-[200px] truncate">{bidAgency}</TableCell>
        <TableCell className="px-6 py-4">
          {nitDetails && (
            <ShowNitDetails
              nitdetails={nitDetails.memoNumber}
              memoDate={nitDetails.memoDate}
              workslno={worksDetails?.workslno || ""}
            />
          )}
        </TableCell>
        <TableCell className="px-6 py-4 font-semibold text-right text-slate-900">
          {formatCurrency(deposit.securityDepositAmt)}
        </TableCell>
        <TableCell className="px-6 py-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{maturityDate ? formatDate(maturityDate) : "N/A"}</span>
            <span
              className={`text-xs ${
                daysRemaining !== null && daysRemaining < 0
                  ? "text-rose-600 font-medium"
                  : daysRemaining !== null && daysRemaining <= 7
                    ? "text-amber-600 font-medium"
                    : "text-slate-500"
              }`}
            >
              {daysRemaining === null 
                ? "" 
                : daysRemaining < 0 
                  ? "Matured"
                  : `${daysRemaining} days remaining`}
            </span>
          </div>
        </TableCell>
        <TableCell className="px-6 py-4">
          <Badge
            variant={currentStatus === "paid" ? "default" : "destructive"}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              currentStatus === "paid"
                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                : "bg-rose-100 text-rose-800 hover:bg-rose-200"
            }`}
          >
            {currentStatus === "paid" ? "Paid" : "Unpaid"}
          </Badge>
        </TableCell>
        <TableCell className="px-6 py-4">
          {currentStatus === "unpaid" && (
            <MarkPaidButton
              depositId={deposit.id}
              onPaid={() => onPaid(deposit.id)}
            />
          )}
        </TableCell>
      </TableRow>
    )
  },
)

DepositTableRow.displayName = "DepositTableRow"

export function SecurityDepositsPage({ deposits }: SecurityDepositsPageProps) {
  const [selectedDeposits, setSelectedDeposits] = useState<Set<string>>(new Set())
  const [selectedFund, setSelectedFund] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("unpaid") // Default to unpaid
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [depositStatuses, setDepositStatuses] = useState<Record<string, "paid" | "unpaid">>(() => {
    const initialStatuses: Record<string, "paid" | "unpaid"> = {}
    deposits.forEach((deposit) => {
      initialStatuses[deposit.id] = normalizeStatus(deposit.paymentstatus)
    })
    return initialStatuses
  })

  // Memoize fund types
  const fundTypes = useMemo(
    () =>
      Array.from(
        new Set(
          deposits
            .map((d) => d.PaymentDetails?.[0]?.WorksDetail?.ApprovedActionPlanDetails?.schemeName)
            .filter(Boolean),
        ),
      ),
    [deposits],
  )

  // Memoize filtered deposits
  const filteredDeposits = useMemo(
    () =>
      deposits.filter((deposit) => {
        const fundMatch =
          selectedFund === "all" ||
          deposit.PaymentDetails?.[0]?.WorksDetail?.ApprovedActionPlanDetails?.schemeName === selectedFund

        const currentStatus = depositStatuses[deposit.id] || normalizeStatus(deposit.paymentstatus)
        const statusMatch =
          statusFilter === "all" ||
          (statusFilter === "paid" && currentStatus === "paid") ||
          (statusFilter === "unpaid" && currentStatus === "unpaid")

        // Search functionality
        const bidAgency =
          deposit.PaymentDetails?.[0]?.WorksDetail?.AwardofContract?.workorderdetails[0]?.Bidagency?.agencydetails
            .name || ""
        const nitNumber = String(deposit.PaymentDetails?.[0]?.WorksDetail?.nitDetails?.memoNumber || "")
        const searchMatch =
          searchQuery === "" ||
          bidAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nitNumber.toLowerCase().includes(searchQuery.toLowerCase())

        return fundMatch && statusMatch && searchMatch
      }),
    [deposits, selectedFund, statusFilter, depositStatuses, searchQuery],
  )

  // Memoize summary calculations
  const summary = useMemo(() => {
    let maturedCount = 0
    let approachingCount = 0
    let activeCount = 0
    let totalDeposits = 0

    filteredDeposits.forEach((deposit) => {
      const paymentDetail = deposit.PaymentDetails?.[0]
      const worksDetails = paymentDetail?.WorksDetail
      const completionDate = worksDetails?.completionDate
      const maturityDate = calculateMaturityDate(completionDate)
      const daysRemaining = calculateDaysRemaining(maturityDate)

      if (daysRemaining === null) return

      if (daysRemaining < 0) {
        maturedCount++
      } else if (daysRemaining <= 7) {
        approachingCount++
      } else {
        activeCount++
      }

      totalDeposits += deposit.securityDepositAmt
    })

    return { maturedCount, approachingCount, activeCount, totalDeposits }
  }, [filteredDeposits])

  // Optimize handlers with useCallback
  const toggleDepositSelection = useCallback((depositId: string) => {
    setSelectedDeposits((prev) => {
      const newSelection = new Set(prev)
      if (newSelection.has(depositId)) {
        newSelection.delete(depositId)
      } else {
        newSelection.add(depositId)
      }
      return newSelection
    })
  }, [])

  const toggleAllDeposits = useCallback(() => {
    setSelectedDeposits((prev) =>
      prev.size === filteredDeposits.length ? new Set() : new Set(filteredDeposits.map((d) => d.id)),
    )
  }, [filteredDeposits])

  const markSelectedAsPaid = useCallback(() => {
    setDepositStatuses((prev) => {
      const newStatuses = { ...prev }
      selectedDeposits.forEach((depositId) => {
        newStatuses[depositId] = "paid"
      })
      return newStatuses
    })
    setSelectedDeposits(new Set())
  }, [selectedDeposits])

  const handlePaidOptimistic = useCallback((depositId: string) => {
    setDepositStatuses((prev) => ({ ...prev, [depositId]: "paid" }))
    setSelectedDeposits((prev) => {
      const next = new Set(prev)
      next.delete(depositId)
      return next
    })
  }, [])

  // Optimize PDF export
  const exportToPDF = useCallback(() => {
    try {
      const doc = new jsPDF("landscape", "mm", "a4")
      const pageWidth = doc.internal.pageSize.getWidth()

      // Header
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("Security Deposits Report", pageWidth / 2, 20, {
        align: "center",
      })

      // Subheader
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      const currentDate = new Date().toLocaleDateString("en-IN")
      const fundFilterText = selectedFund === "all" ? "All Fund Types" : selectedFund
      const statusFilterText = statusFilter === "all" ? "All Statuses" : statusFilter
      doc.text(
        `Generated on: ${currentDate} | Fund: ${fundFilterText} | Status: ${statusFilterText}`,
        pageWidth / 2,
        30,
        { align: "center" },
      )

      // Summary
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("Summary:", 14, 45)
      doc.setFont("helvetica", "normal")
      doc.text(`Total Deposits: ${formatCurrency(summary.totalDeposits)}`, 14, 52)
      doc.text(
        `Active: ${summary.activeCount} | Approaching Maturity: ${summary.approachingCount} | Matured: ${summary.maturedCount}`,
        14,
        59,
      )

      // Table data
      const tableData = filteredDeposits.map((deposit, index) => {
        const paymentDetail = deposit.PaymentDetails?.[0]
        const worksDetails = paymentDetail?.WorksDetail
        const nitDetails = worksDetails?.nitDetails
        const bidAgency = worksDetails?.AwardofContract?.workorderdetails[0]?.Bidagency?.agencydetails.name || "N/A"
        const completionDate = worksDetails?.completionDate
        const maturityDate = calculateMaturityDate(completionDate)
        const daysRemaining = calculateDaysRemaining(maturityDate)
        const currentStatus = depositStatuses[deposit.id] || normalizeStatus(deposit.paymentstatus)

        return [
          index + 1,
          bidAgency,
          nitDetails?.memoNumber || "N/A",
          deposit.securityDepositAmt,
          maturityDate ? formatDate(maturityDate) : "N/A",
          daysRemaining === null 
            ? "N/A" 
            : daysRemaining < 0 
              ? "Matured" 
              : `${daysRemaining} days`,
          currentStatus === "paid" ? "Paid" : "unpaid",
        ]
      })

      // Generate table
      autoTable(doc, {
        head: [["Sl No", "Agency Name", "NIT Details", "Amount", "Maturity Date", "Days Remaining", "Status"]],
        body: tableData,
        startY: 70,
        theme: "striped",
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 10,
          halign: "center",
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 15 },
          1: { halign: "left", cellWidth: 50 },
          2: { halign: "left", cellWidth: 35 },
          3: { halign: "right", cellWidth: 35 },
          4: { halign: "center", cellWidth: 30 },
          5: { halign: "center", cellWidth: 30 },
          6: { halign: "center", cellWidth: 25 },
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        margin: { top: 70, left: 14, right: 14 },
        didParseCell: (data) => {
          if (data.column.index === 6 && data.section === "body") {
            if (data.cell.text[0] === "Paid") {
              data.cell.styles.textColor = [16, 185, 129]
              data.cell.styles.fontStyle = "bold"
            } else {
              data.cell.styles.textColor = [225, 29, 72]
              data.cell.styles.fontStyle = "bold"
            }
          }

          if (data.column.index === 5 && data.section === "body") {
            const daysText = data.cell.text[0]
            if (daysText !== "N/A") {
              if (daysText === "Matured") {
                data.cell.styles.textColor = [225, 29, 72]
                data.cell.styles.fontStyle = "bold"
              } else if (!isNaN(parseInt(daysText))) {
                const days = parseInt(daysText)
                if (days <= 7) {
                  data.cell.styles.textColor = [245, 158, 11]
                  data.cell.styles.fontStyle = "bold"
                }
              }
            }
          }
        },
      })

      // Footer
      const finalY = (doc as any).lastAutoTable.finalY || 70
      doc.setFontSize(8)
      doc.setFont("helvetica", "italic")
      doc.text("© Security Deposits Management System", pageWidth / 2, finalY + 20, { align: "center" })

      // Page numbers
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, {
          align: "right",
        })
      }

      const fileName = `security-deposits-${new Date().toISOString().slice(0, 10)}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }, [filteredDeposits, selectedFund, statusFilter, depositStatuses, summary])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-md border border-slate-200 p-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="bg-indigo-100 p-2.5 rounded-xl">
                    <IndianRupee className="h-8 w-8 text-indigo-600" />
                  </div>
                  Security Deposits Management
                </h1>
                <p className="text-slate-600 text-lg">Track and manage all security deposits in one place</p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 px-4 py-2.5 rounded-xl"
                  onClick={exportToPDF}
                >
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="search"
              placeholder="Search by agency name or NIT number..."
              className="pl-12 py-6 bg-white border-slate-200 rounded-xl shadow-sm focus-visible:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          {/* Filters and Summary Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="lg:col-span-1 border-slate-200 shadow-md rounded-xl overflow-hidden">
                <CardHeader className="pb-3 border-b border-slate-200 bg-slate-50">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    <Filter className="h-4 w-4 text-indigo-500" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Fund Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Fund Type</label>
                      <Select value={selectedFund} onValueChange={setSelectedFund}>
                        <SelectTrigger className="w-full border-slate-200 rounded-lg">
                          <SelectValue placeholder="Select fund" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Fund Types</SelectItem>
                          {fundTypes.map((fund) => (
                            <SelectItem key={fund} value={fund}>
                              {fund}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full border-slate-200 rounded-lg">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Summary Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Deposits Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border border-slate-200 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-600">Total Deposits</p>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {formatCurrency(summary.totalDeposits)}
                        </h3>
                      </div>
                      <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-200 transition-colors">
                        <IndianRupee className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Active Deposits Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border border-slate-200 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-600">Active</p>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {summary.activeCount}
                        </h3>
                      </div>
                      <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-200 transition-colors">
                        <CalendarCheck className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Approaching Maturity Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="border border-slate-200 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-600">Approaching</p>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                          {summary.approachingCount}
                        </h3>
                      </div>
                      <div className="bg-amber-100 p-3 rounded-xl group-hover:bg-amber-200 transition-colors">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Matured Deposits Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="border border-slate-200 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-600">Matured</p>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                          {summary.maturedCount}
                        </h3>
                      </div>
                      <div className="bg-rose-100 p-3 rounded-xl group-hover:bg-rose-200 transition-colors">
                        <Clock className="h-6 w-6 text-rose-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedDeposits.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-indigo-200 bg-indigo-50 shadow-md rounded-xl">
                <CardContent className="py-4 px-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-800">
                      {selectedDeposits.size} deposit
                      {selectedDeposits.size > 1 ? "s" : ""} selected
                    </span>
                    <Button
                      onClick={markSelectedAsPaid}
                      className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 px-4 py-2.5 rounded-lg"
                    >
                      <Check className="h-4 w-4" />
                      Mark Selected as Paid
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Deposits Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="border border-slate-200 rounded-xl shadow-md overflow-hidden">
              <CardHeader className="border-b border-slate-200 py-4 px-6 bg-slate-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    Deposit Records
                  </CardTitle>
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md font-medium">
                      {filteredDeposits.length}
                    </span>
                    deposits found
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredDeposits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                      <Clock className="h-16 w-16 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-700 mb-2">No Security Deposits Found</h3>
                    <p className="text-slate-500 max-w-md">
                      No deposits match the selected filters. Try adjusting your filter criteria.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-12 px-6 py-4">
                            <Checkbox
                              checked={selectedDeposits.size === filteredDeposits.length && filteredDeposits.length > 0}
                              onCheckedChange={toggleAllDeposits}
                              aria-label="Select all deposits"
                            />
                          </TableHead>
                          <TableHead className="px-6 py-4 font-semibold text-slate-700">#</TableHead>
                          <TableHead className="px-6 py-4 font-semibold text-slate-700">
                            <div className="flex items-center gap-1">
                              Agency
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                          </TableHead>
                          <TableHead className="px-6 py-4 font-semibold text-slate-700">NIT Details</TableHead>
                          <TableHead className="px-6 py-4 font-semibold text-slate-700 text-right">
                            <div className="flex items-center justify-end gap-1">
                              Amount
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                          </TableHead>
                          <TableHead className="px-6 py-4 font-semibold text-slate-700">
                            <div className="flex items-center gap-1">
                              Maturity
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                          </TableHead>
                          <TableHead className="px-6 py-4 font-semibold text-slate-700">Status</TableHead>
                          <TableHead className="px-6 py-4 font-semibold text-slate-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDeposits.map((deposit, index) => (
                          <DepositTableRow
                            key={deposit.id}
                            deposit={deposit}
                            index={index}
                            selectedDeposits={selectedDeposits}
                            onToggleSelection={toggleDepositSelection}
                            depositStatuses={depositStatuses}
                            onPaid={handlePaidOptimistic}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
