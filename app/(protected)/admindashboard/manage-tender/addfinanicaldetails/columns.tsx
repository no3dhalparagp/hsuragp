"use client";

import { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddFinancialDetailsType } from "@/types";
import { EyeIcon } from "lucide-react";
import { ShowNitDetails } from "@/components/ShowNitDetails";

export const columns: ColumnDef<AddFinancialDetailsType>[] = [
  {
    accessorKey: "id",
    header: "Sl No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "memoNumber",
    header: " Tender Information",
    cell: ({ row }) => (
      <ShowNitDetails
        nitdetails={row.original.nitDetails.memoNumber}
        memoDate={row.original.nitDetails.memoDate}
        workslno={row.original.workslno}
      />
    ),
  },
  {
    accessorKey: "workName",
    header: "Activity Details",
    cell: ({ row }) => {
      const workDetail = row.original.ApprovedActionPlanDetails;
      return workDetail.activityDescription;
    },
  },
  {
    accessorKey: "tenderStatus",
    header: "Stage",
    cell: ({ row }) => row.original.tenderStatus,
  },
  {
    id: "Actions",
    cell: ({ row }) => (
      <Link
        href={`/admindashboard/manage-tender/addfinanicaldetails/${row.original.id}`}
      >
        <Button
          size="sm"
          variant="outline"
          className="group-hover:bg-primary/10"
        >
          <EyeIcon className="w-4 h-4 mr-2" />
          Review
        </Button>
      </Link>
    ),
  },
];
