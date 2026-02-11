"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

type AgencyDetails = {
  id: string;
  name: string;
  mobileNumber: string | null;
  email: string | null;
  pan: string | null;
  tin: string | null;
  gst: string | null;
  contactDetails: string;
  agencyType: "FARM" | "INDIVIDUAL";
  proprietorName: string | null;
};

export const columns: ColumnDef<AgencyDetails>[] = [
  {
    accessorFn: (_, index) => index + 1,
    header: "#",
    id: "index",
  },
  {
    accessorKey: "name",
    header: "Agency",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{row.original.name}</span>
        <span className="text-sm text-gray-500">
          {row.original.tin || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "agencyType",
    header: "Type",
    cell: ({ row }) => {
      const isFarm = row.original.agencyType === "FARM";
      return (
        <Badge
          variant="outline"
          className={
            isFarm
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-blue-200 bg-blue-50 text-blue-700"
          }
        >
          {isFarm ? "Farm" : "Individual"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "proprietorName",
    header: "Proprietor",
    cell: ({ row }) => (
      <span className="text-gray-900">
        {row.original.agencyType === "FARM"
          ? row.original.proprietorName || "N/A"
          : "-"}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-gray-900">{row.original.email || "N/A"}</span>
        <span className="text-sm text-gray-500">
          {row.original.mobileNumber || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: () => (
      <Badge
        variant="outline"
        className="border-green-200 bg-green-50 text-green-700"
      >
        Active
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded-lg border-gray-300 shadow-sm"
          asChild
        >
          <Link
            href={`/admindashboard/manage-vendor/edit-agency/${row.original.id}`}
            aria-label={`Edit ${row.original.name}`}
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded-lg border-red-200 bg-red-50 shadow-sm hover:bg-red-100/50"
          aria-label={`Delete ${row.original.name}`}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    ),
  },
];
