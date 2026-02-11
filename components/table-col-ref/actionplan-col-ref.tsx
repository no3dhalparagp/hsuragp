"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApprovedActionPlanDetails } from "@prisma/client";

export const actionplancolumns: ColumnDef<ApprovedActionPlanDetails>[] = [
  {
    accessorKey: "slNo",
    header: "SL No.",
    cell: ({ row }) => <div className="w-[80px]">{row.index + 1}</div>,
  },
  {
    accessorKey: "activityCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Activity Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("activityCode")}</div>,
  },
  {
    accessorKey: "activityDescription",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("activityDescription")}</div>,
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
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/admindashboard/work-manage/edit/${plan.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
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
