
"use client"
import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Trash2, Eye, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { NITCopy } from "@/components/PrintTemplet/PrintNIt-copy";

import { formatDateTime } from "@/utils/utils"
import { gpcode } from "@/constants/gpinfor"
type NITListWithYearFilterProps = {
  nits: any[] // Replace 'any' with your actual NIT type if available
  onDeleteNit: (id: string) => void
}

export default function NITListWithYearFilter({ nits, onDeleteNit }: NITListWithYearFilterProps) {
  // Helper to get financial year string from a date
  function getFinancialYear(date: string | number | Date) {
    const d = new Date(date)
    const year = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1
    const nextYear = (year + 1).toString().slice(-2)
    return `${year}-${nextYear}`
  }

  // Compute all available financial years
  const years = useMemo(() => {
    const set = new Set<string>()
    nits.forEach((nit) => set.add(getFinancialYear(nit.memoDate)))
    return Array.from(set).sort().reverse() as string[]
  }, [nits])

  const [selectedYear, setSelectedYear] = useState(years[0] || "")

  const filteredNits = useMemo(
    () => nits.filter((nit) => getFinancialYear(nit.memoDate) === selectedYear),
    [nits, selectedYear],
  )

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 px-4 sm:px-0">
        <label htmlFor="fy-select" className="font-medium whitespace-nowrap">
          Financial Year:
        </label>
        <select
          id="fy-select"
          className="border rounded px-3 py-2 sm:py-1 w-full sm:w-auto text-sm sm:text-base"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {filteredNits.length > 0 ? (
        <div className="space-y-3 px-4 sm:px-0">
          {filteredNits.map((nit, index) => {
            const nitYear = new Date(nit.memoDate).getFullYear()
            return (
              <div
                key={nit.id}
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-100 hover:shadow-sm transition-all"
              >
                <div className="flex-1 flex flex-col sm:grid sm:grid-cols-5 gap-3 sm:gap-4">
                  {/* Index - hidden on mobile, shown on tablet+ */}
                  <div className="hidden sm:block text-gray-500 font-medium">#{index + 1}</div>

                  {/* NIT Details */}
                  <div className="sm:col-span-1">
                    <Link
                      href={`/admindashboard/manage-tender/view/${nit.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base break-all"
                    >
                      {nit.memoNumber}/{gpcode}/{nitYear}
                    </Link>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{formatDateTime(nit.memoDate).dateOnly}</p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 sm:block">
                    <span className="sm:hidden text-xs text-gray-600 font-medium min-w-fit">Status:</span>
                    <Badge
                      variant="outline"
                      className={`text-xs sm:text-sm w-fit ${
                        nit.isPublished
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-orange-200 bg-orange-50 text-orange-700"
                      }`}
                    >
                      {nit.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  {/* Works Count */}
                  <div className="flex items-center gap-2 sm:block sm:text-center">
                    <span className="sm:hidden text-xs text-gray-600 font-medium">Works:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm sm:text-base">{nit.WorksDetail.length || "0"}</span>
                      <span className="text-xs sm:text-sm text-gray-500">works</span>
                    </div>
                  </div>

                  {/* Action Buttons - stack vertically on mobile, horizontal on desktop */}
                  <div className="flex flex-wrap gap-2 sm:flex sm:justify-end sm:items-center sm:space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:bg-gray-100 flex-1 sm:flex-none"
                            asChild
                          >
                            <Link href={`/admindashboard/manage-tender/view/${nit.id}`}>
                              <Eye className="w-4 h-4" />
                              <span className="sm:hidden ml-2">View</span>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {!nit.isPublished && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50 flex-1 sm:flex-none"
                              asChild
                            >
                              <Link href={`/admindashboard/manage-tender/add/${nit.id}`}>
                                <PlusCircle className="w-4 h-4" />
                                <span className="sm:hidden ml-2">Add Work</span>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add Work</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {nit.WorksDetail.length === 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault()
                                if (onDeleteNit) await onDeleteNit(nit.id)
                              }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                                type="submit"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="sm:hidden ml-2">Delete</span>
                              </Button>
                            </form>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete NIT</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <div className="flex-1 sm:flex-none">
                      <NITCopy nitdetails={nit} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4 px-4">
          <div className="inline-block bg-blue-50 p-4 rounded-full">
            <AlertCircle className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">No NITs Found</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            No NITs found for the selected financial year.
          </p>
        </div>
      )}
    </>
  )
}
