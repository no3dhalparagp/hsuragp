"use client";

import { Aocprint } from "@/components/PrintTemplet/aocprint";
import { ShowNitDetails } from "@/components/ShowNitDetails";
import { aoctype } from "@/types/aoc";
import { ColumnDef } from "@tanstack/react-table";
import { IndianRupee } from "lucide-react";
import React from "react";

// Helper function to find the agency with the lowest valid bid
const getLowestBidAgency = (agencies: aoctype["biddingAgencies"]) => {
  if (!agencies || agencies.length === 0) return null;

  // Filter out agencies with null biddingAmount and create safe array
  const validAgencies = agencies.filter(
    (agency) => agency.biddingAmount !== null
  );

  if (validAgencies.length === 0) return null;

  return validAgencies.reduce((minAgency, currentAgency) =>
    currentAgency.biddingAmount! < minAgency.biddingAmount!
      ? currentAgency
      : minAgency
  );
};

export const columns: ColumnDef<aoctype>[] = [
  {
    accessorFn: (row) => row.id,
    header: "SL NO",
    cell: ({ row }) => <div>{row.index + 1}</div>,
    size: 80,
  },
  {
    accessorFn: (row) => row.nitDetails.memoNumber,
    header: "NIT DETAILS",
    cell: ({ row }) => (
      <div className="min-w-[180px] py-2">
        <ShowNitDetails
          nitdetails={row.original.nitDetails.memoNumber || 0}
          memoDate={row.original.nitDetails.memoDate || new Date()}
          workslno={row.original.workslno || 0}
        />
      </div>
    ),
    size: 220,
  },
  {
    header: "AGENCY",
    cell: ({ row }) => {
      const lowestAgency = getLowestBidAgency(row.original.biddingAgencies);
      const agencyName = lowestAgency?.agencydetails?.name || "N/A";

      return (
        <div className="font-medium text-primary truncate max-w-[220px] py-2">
          {agencyName}
        </div>
      );
    },
    size: 200,
  },
  {
    header: "BID AMOUNT (₹)",
    cell: ({ row }) => {
      const lowestAgency = getLowestBidAgency(row.original.biddingAgencies);
      const amount = lowestAgency?.biddingAmount;

      return (
        <div className="flex items-center gap-1 font-medium py-2">
          <IndianRupee className="w-4 h-4 text-muted-foreground" />
          <span className="tracking-tighter">
            {amount !== null && amount !== undefined
              ? amount.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })
              : "N/A"}
          </span>
        </div>
      );
    },
    size: 150,
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => <Aocprint workdetails={row.original} />,
  },
];
