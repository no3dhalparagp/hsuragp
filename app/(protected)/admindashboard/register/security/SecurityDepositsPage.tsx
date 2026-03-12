"use client"

import {
  useState,
  useMemo,
  useCallback,
  memo,
  useDeferredValue,
} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  IndianRupee,
  CalendarCheck,
  FileText,
  Check,
  Filter,
  Download,
  Search,
  ChevronDown,
} from "lucide-react"
import { ShowNitDetails } from "@/components/ShowNitDetails"
import type { Deposit } from "@/types"
import { formatDate } from "@/utils/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { motion } from "framer-motion"

interface SecurityDepositsPageProps {
  deposits: Deposit[]
}

type SecurityDepositStatus = "paid" | "unpaid"

const normalizeStatus = (
  status: SecurityDepositStatus,
): "paid" | "unpaid" => {
  return status === "paid" ? "paid" : "unpaid"
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

const calculateMaturityDate = (completionDate: Date | null) => {
  if (!completionDate) return null
  const date = new Date(completionDate)
  date.setMonth(date.getMonth() + 6)
  return date
}

const calculateDaysRemaining = (maturityDate: Date | null) => {
  if (!maturityDate) return null
  const today = new Date()
  const diff =
    maturityDate.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function SecurityDepositsPage({
  deposits,
}: SecurityDepositsPageProps) {
  const [selectedDeposits, setSelectedDeposits] =
    useState<Set<string>>(new Set())
  const [selectedFund, setSelectedFund] =
    useState<string>("all")
  const [statusFilter, setStatusFilter] =
    useState<string>("unpaid")
  const [searchQuery, setSearchQuery] =
    useState<string>("")
  const [sortBy, setSortBy] = useState<
    "agency" | "amount" | null
  >(null)

  const deferredSearch = useDeferredValue(searchQuery)

  const [depositStatuses, setDepositStatuses] =
    useState<Record<string, "paid" | "unpaid">>(
      () => {
        const initial: Record<
          string,
          "paid" | "unpaid"
        > = {}
        deposits.forEach((d) => {
          initial[d.id] = normalizeStatus(
            d.paymentstatus,
          )
        })
        return initial
      },
    )

  const fundTypes = useMemo(
    () =>
      Array.from(
        new Set(
          deposits
            .map(
              (d) =>
                d.PaymentDetails?.[0]?.WorksDetail
                  ?.ApprovedActionPlanDetails
                  ?.schemeName,
            )
            .filter(Boolean),
        ),
      ),
    [deposits],
  )

  const filteredDeposits = useMemo(() => {
    let data = deposits.filter((deposit) => {
      const fundMatch =
        selectedFund === "all" ||
        deposit.PaymentDetails?.[0]?.WorksDetail
          ?.ApprovedActionPlanDetails?.schemeName ===
          selectedFund

      const currentStatus =
        depositStatuses[deposit.id] ||
        normalizeStatus(deposit.paymentstatus)

      const statusMatch =
        statusFilter === "all" ||
        currentStatus === statusFilter

      const agency =
        deposit.PaymentDetails?.[0]?.WorksDetail
          ?.AwardofContract
          ?.workorderdetails[0]?.Bidagency
          ?.agencydetails.name || ""

      const searchMatch =
        deferredSearch === "" ||
        agency
          .toLowerCase()
          .includes(deferredSearch.toLowerCase())

      return fundMatch && statusMatch && searchMatch
    })

    if (sortBy === "agency") {
      data.sort((a, b) => {
        const nameA =
          a.PaymentDetails?.[0]?.WorksDetail
            ?.AwardofContract
            ?.workorderdetails[0]?.Bidagency
            ?.agencydetails.name || ""
        const nameB =
          b.PaymentDetails?.[0]?.WorksDetail
            ?.AwardofContract
            ?.workorderdetails[0]?.Bidagency
            ?.agencydetails.name || ""
        return nameA.localeCompare(nameB)
      })
    }

    if (sortBy === "amount") {
      data.sort(
        (a, b) =>
          b.securityDepositAmt -
          a.securityDepositAmt,
      )
    }

    return data
  }, [
    deposits,
    selectedFund,
    statusFilter,
    depositStatuses,
    deferredSearch,
    sortBy,
  ])

  const summary = useMemo(() => {
    let matured = 0
    let approaching = 0
    let active = 0
    let total = 0

    filteredDeposits.forEach((deposit) => {
      const status =
        depositStatuses[deposit.id] ||
        normalizeStatus(deposit.paymentstatus)

      if (status === "paid") return

      const completionDate =
        deposit.PaymentDetails?.[0]?.WorksDetail
          ?.completionDate
      const maturity =
        calculateMaturityDate(completionDate)
      const days =
        calculateDaysRemaining(maturity)

      if (days === null) return

      if (days < 0) matured++
      else if (days <= 7) approaching++
      else active++

      total += deposit.securityDepositAmt
    })

    return {
      matured,
      approaching,
      active,
      total,
    }
  }, [filteredDeposits, depositStatuses])

  const handlePaid = useCallback(
    async (depositId: string) => {
      try {
        await fetch(
          `/api/security-deposit/${depositId}/mark-paid`,
          { method: "PATCH" },
        )

        setDepositStatuses((prev) => ({
          ...prev,
          [depositId]: "paid",
        }))
      } catch (error) {
        console.error(error)
      }
    },
    [],
  )

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF("landscape", "mm", "a4")
    doc.setFontSize(18)
    doc.text(
      "Security Deposits Register",
      148,
      15,
      { align: "center" },
    )

    autoTable(doc, {
      head: [
        [
          "Sl",
          "Agency",
          "Amount",
          "Status",
        ],
      ],
      body: filteredDeposits.map(
        (d, i) => [
          i + 1,
          d.PaymentDetails?.[0]?.WorksDetail
            ?.AwardofContract
            ?.workorderdetails[0]?.Bidagency
            ?.agencydetails.name || "N/A",
          formatCurrency(
            d.securityDepositAmt,
          ),
          depositStatuses[d.id] ||
          normalizeStatus(d.paymentstatus),
        ],
      ),
      startY: 25,
    })

    doc.save(
      `security-deposits-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`,
    )
  }, [filteredDeposits, depositStatuses])

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>
              Security Deposits Management
            </CardTitle>
            <Button
              onClick={exportToPDF}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="flex gap-4">
            <Input
              placeholder="Search agency..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />

            <Select
              value={selectedFund}
              onValueChange={setSelectedFund}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Funds
                </SelectItem>
                {fundTypes.map((fund) => (
                  <SelectItem
                    key={fund}
                    value={fund}
                  >
                    {fund}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() =>
                setSortBy("agency")
              }
              variant="secondary"
            >
              Sort Agency
            </Button>

            <Button
              onClick={() =>
                setSortBy("amount")
              }
              variant="secondary"
            >
              Sort Amount
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid grid-cols-4 gap-4 p-6">
            <div>
              <p>Active</p>
              <h2 className="text-2xl font-bold">
                {summary.active}
              </h2>
            </div>
            <div>
              <p>Approaching</p>
              <h2 className="text-2xl font-bold">
                {summary.approaching}
              </h2>
            </div>
            <div>
              <p>Matured</p>
              <h2 className="text-2xl font-bold">
                {summary.matured}
              </h2>
            </div>
            <div>
              <p>Total</p>
              <h2 className="text-2xl font-bold">
                {formatCurrency(summary.total)}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>
                  Agency
                </TableHead>
                <TableHead>
                  Amount
                </TableHead>
                <TableHead>
                  Status
                </TableHead>
                <TableHead>
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeposits.map(
                (deposit, index) => {
                  const status =
                    depositStatuses[
                      deposit.id
                    ] ||
                    normalizeStatus(
                      deposit.paymentstatus,
                    )

                  const completionDate =
                    deposit.PaymentDetails?.[0]
                      ?.WorksDetail
                      ?.completionDate

                  const maturity =
                    calculateMaturityDate(
                      completionDate,
                    )

                  const days =
                    calculateDaysRemaining(
                      maturity,
                    )

                  return (
                    <TableRow
                      key={deposit.id}
                      className={
                        days !== null &&
                        days < 0 &&
                        status ===
                          "unpaid"
                          ? "bg-rose-50"
                          : ""
                      }
                    >
                      <TableCell>
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        {
                          deposit
                            .PaymentDetails?.[0]
                            ?.WorksDetail
                            ?.AwardofContract
                            ?.workorderdetails[0]
                            ?.Bidagency
                            ?.agencydetails
                            .name
                        }
                      </TableCell>
                      <TableCell>
                        {formatCurrency(
                          deposit.securityDepositAmt,
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge>
                          {status === "paid"
                            ? "Paid"
                            : "Unpaid"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {status ===
                          "unpaid" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handlePaid(
                                deposit.id,
                              )
                            }
                          >
                            Mark Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                },
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
