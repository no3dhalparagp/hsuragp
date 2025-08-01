"use client";

import { ColumnDef } from "@tanstack/react-table";
import { NitDetailsProps } from "@/types/tender-manage";
import { formatDate } from "@/utils/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<NitDetailsProps>[] = [
  {
    accessorKey: "id",
    header: "Sl No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "memoNumber",
    header: "NIT Number",
    cell: ({ row }) => row.original.memoNumber || "N/A",
  },
  {
    accessorKey: "workName",
    header: "Work Name",
    cell: ({ row }) => {
      const workDetail = row.original.WorksDetail[0];
      return (
        workDetail?.ApprovedActionPlanDetails?.activityDescription || "N/A"
      );
    },
  },
  {
    accessorKey: "technicalBidOpeningDate",
    header: "Technical Bid Opening",
    cell: ({ row }) =>
      formatDate(row.original.technicalBidOpeningDate) || "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link
        href={`/admindashboard/manage-tender/addbidderdetails/${row.original.id}`}
      >
        <Button
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label={`Add Bidder Details for NIT ${
            row.original.memoNumber || ""
          }`}
        >
          Add Bidder Details
        </Button>
      </Link>
    ),
  },
];
