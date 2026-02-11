"use client"
import { ColumnDef } from "@tanstack/react-table";
import { NitDetail } from "@/types/nitDetails";
import { Button } from "@/components/ui/button";
import { Download, FileX, FileText } from "lucide-react";
import { formatDate } from "@/utils/utils";

export const columns: ColumnDef<NitDetail>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => (
      <span className="font-medium text-gray-700">{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "memoNumber",
    header: "NIT Number",
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900">
        {row.original.memoNumber || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "publishingDate",
    header: "Publishing Date",
    cell: ({ row }) => (
      <span className="text-gray-600">{formatDate(row.original.publishingDate)}</span>
    ),
  },
  {
    accessorKey: "endTime",
    header: "End Date",
    cell: ({ row }) => (
      <span className="text-gray-600">{formatDate(row.original.endTime)}</span>
    ),
  },
  {
    accessorKey: "publishhardcopy",
    header: "Document",
    cell: ({ row }) => {
      const doc = row.original.publishhardcopy;
      return doc ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 transition-colors shadow-sm"
          asChild
        >
          <a href={doc} download>
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </Button>
      ) : (
        <div className="flex items-center gap-2 text-gray-400">
          <FileX className="w-4 h-4" />
          <span>Unavailable</span>
        </div>
      );
    },
  },
];
