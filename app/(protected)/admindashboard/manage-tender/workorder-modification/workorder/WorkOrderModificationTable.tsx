"use client"

import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"
import WorkOrderModificationDialog from "./WorkOrderModificationDialog"

export default function WorkOrderModificationTable({ workOrders }: { workOrders: any[] }) {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="w-12 text-gray-600 font-semibold">#</TableHead>
              <TableHead className="min-w-[180px] text-gray-600 font-semibold">NIT Details</TableHead>
              <TableHead className="w-32 text-gray-600 font-semibold">Memo No</TableHead>
              <TableHead className="w-32 text-gray-600 font-semibold">Memo Date</TableHead>
              <TableHead className="w-24 text-gray-600 font-semibold">Delivery</TableHead>
              <TableHead className="w-40 text-right text-gray-600 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.map((item, i) => (
              <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium text-gray-600">{i + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900">NIT No. {item.nitDetails?.memoNumber}</span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Work No. {item.workslno}</span>
                      <span className="text-gray-300">•</span>
                      <span>{item.nitDetails?.memoDate ? new Date(item.nitDetails.memoDate).getFullYear() : ""}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{(Array.isArray(item.AwardofContract) ? item.AwardofContract[0]?.workodermenonumber : item.AwardofContract?.workodermenonumber) ?? "-"}</TableCell>
                <TableCell>{(() => { const ao = Array.isArray(item.AwardofContract) ? item.AwardofContract[0] : item.AwardofContract; return ao?.workordeermemodate ? new Date(ao.workordeermemodate).toLocaleDateString() : "-" })()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={(Array.isArray(item.AwardofContract) ? item.AwardofContract[0]?.isdelivery : item.AwardofContract?.isdelivery) ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {(Array.isArray(item.AwardofContract) ? item.AwardofContract[0]?.isdelivery : item.AwardofContract?.isdelivery) ? "Delivered" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" className="gap-2" onClick={() => { setSelectedId(item.id); setOpen(true) }}>
                    <PencilIcon className="h-4 w-4" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <WorkOrderModificationDialog open={open} onOpenChange={setOpen} workId={selectedId} />
    </div>
  )
}

