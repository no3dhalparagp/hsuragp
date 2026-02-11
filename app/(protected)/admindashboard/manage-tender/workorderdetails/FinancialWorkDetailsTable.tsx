"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileTextIcon, AlertCircleIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import WorkOrderAOCDialog from "./WorkOrderAOCDialog"

export default function FinancialWorkDetailsTable({
  financialWorkDetails,
}: {
  financialWorkDetails: any[]
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Financial Evaluation Works</h1>
          <p className="mt-2 text-sm text-gray-500">Works pending acceptance of contract (AOC)</p>
        </div>
        <Badge variant="secondary" className="px-4 py-2 text-base">
          Total Works: {financialWorkDetails.length}
        </Badge>
      </div>

      {financialWorkDetails.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <div className="flex flex-col items-center justify-center gap-4">
            <AlertCircleIcon className="h-16 w-16 text-gray-400/80" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">No works in financial evaluation</h3>
              <p className="text-sm text-gray-500">
                All works have completed processing or none have reached this stage
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="border-collapse">
              <TableHeader className="bg-gray-50/80">
                <TableRow>
                  <TableHead className="w-12 text-gray-600 font-semibold">#</TableHead>
                  <TableHead className="min-w-[180px] text-gray-600 font-semibold">NIT Details</TableHead>
                  <TableHead className="w-28 text-gray-600 font-semibold">Status</TableHead>
                  <TableHead className="min-w-[200px] text-gray-600 font-semibold">Activity</TableHead>
                  <TableHead className="w-20 text-gray-600 font-semibold">Code</TableHead>
                  <TableHead className="w-32 text-right text-gray-600 font-semibold">Estimated Cost</TableHead>
                  <TableHead className="w-40 text-right text-gray-600 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialWorkDetails.map((item, i) => {
                  const isExpanded = expandedRows.has(item.id)
                  return (
                    <>
                      <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-medium text-gray-600">{i + 1}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-900">NIT No. {item.nitDetails.memoNumber}</span>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>Work No. {item.workslno}</span>
                              <span className="text-gray-300">•</span>
                              <span>{item.nitDetails.memoDate.getFullYear()}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-orange-100 text-orange-800">
                            Financial Evaluation
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <div className="flex items-start">
                            <div 
                              className={`text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}
                              onClick={() => toggleRowExpansion(item.id)}
                            >
                              {item.ApprovedActionPlanDetails.activityDescription}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-6 w-6 p-0"
                              onClick={() => toggleRowExpansion(item.id)}
                            >
                              {isExpanded ? (
                                <ChevronUpIcon className="h-4 w-4" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">#{item.ApprovedActionPlanDetails.activityCode}</TableCell>
                        <TableCell className="text-right font-medium text-gray-900">
                          ₹{item.ApprovedActionPlanDetails.estimatedCost.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            className="gap-2 bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                            onClick={() => {
                              setSelectedWorkId(item.id)
                              setDialogOpen(true)
                            }}
                          >
                            <FileTextIcon className="h-4 w-4" />
                            Process AOC
                          </Button>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow className="bg-blue-50/30">
                          <TableCell colSpan={7} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Activity Details</h4>
                                <p className="text-gray-600">{item.ApprovedActionPlanDetails.activityDescription}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                                <p className="text-sm text-gray-600">Work ID: {item.id}</p>
                                <p className="text-sm text-gray-600">NIT Memo Date: {item.nitDetails.memoDate.toLocaleDateString()}</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      <WorkOrderAOCDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setSelectedWorkId(null)
        }}
        workId={selectedWorkId}
      />
    </div>
  )
}
