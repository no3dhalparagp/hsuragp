"use client"
import { ColumnDef } from "@tanstack/react-table";
import { NitDetail } from "@/types/nitDetails";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { formatDate } from "@/utils/utils";

export const columns: ColumnDef<NitDetail>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "memoNumber",
    header: "NIT Number",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {row.original.memoNumber || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "publishingDate",
    header: "Publishing Date",
    cell: ({ row }) => formatDate(row.original.publishingDate),
  },
  {
    accessorKey: "endTime",
    header: "End Date",
    cell: ({ row }) => formatDate(row.original.endTime),
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
          className="gap-2 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
          asChild
        >
          <a href={doc} download>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </Button>
      ) : (
        <div className="flex items-center gap-2 text-gray-400">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Not available</span>
        </div>
      );
    },
  },
];
