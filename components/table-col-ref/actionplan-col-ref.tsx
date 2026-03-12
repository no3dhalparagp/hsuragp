"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ApprovedActionPlanDetails } from "@prisma/client";

export const actionplancolumns: ColumnDef<ApprovedActionPlanDetails>[] = [
  {
    id: "slNo",
    header: "SL No.",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination?.pageIndex ?? 0;
      const pageSize = table.getState().pagination?.pageSize ?? 10;
      return pageIndex * pageSize + row.index + 1;
    },
  },

  {
    accessorKey: "activityCode",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Activity Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("activityCode")}</div>,
  },

  {
    accessorKey: "activityDescription",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[400px] whitespace-normal">
        {row.getValue("activityDescription")}
      </div>
    ),
  },

  {
    accessorKey: "financialYear",
    header: "Financial Year",
    cell: ({ row }) => <div>{row.getValue("financialYear")}</div>,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const plan = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={`/admindashboard/work-manage/edit/${plan.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="text-red-600">
              <Link href={`/admindashboard/work-manage/delete/${plan.id}`}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
