import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatDateTime } from "@/utils/utils";
import { ShowNitDetails } from "@/components/ShowNitDetails";

const NitDetailsPage = async () => {
  const dateover = await db.nitDetails.findMany({
    where: {
      technicalBidOpeningDate: {
        lt: new Date(),
      },
    },
    include: {
      WorksDetail: {
        where: {
          tenderStatus: {
            in: ["published", "TechnicalBidOpening"],
          },
        },
        include: {
          ApprovedActionPlanDetails: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="space-y-1">
            <Link
              href="/admindashboard/home"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              NIT Management
            </h1>
            <p className="text-sm text-gray-500">
              Manage tender processes and bidder information
            </p>
          </div>
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Table className="divide-y divide-gray-200">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="py-4 text-gray-600 font-semibold">
                  NIT Details
                </TableHead>
                <TableHead className="py-4 text-gray-600 font-semibold">
                  Work Information
                </TableHead>
                <TableHead className="py-4 text-gray-600 font-semibold">
                  Dates
                </TableHead>
                <TableHead className="py-4 text-gray-600 font-semibold text-center">
                  Status
                </TableHead>
                <TableHead className="py-4 text-gray-600 font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {dateover.length > 0 ? (
                dateover.flatMap((item) =>
                  item.WorksDetail.map((worklist, index) => (
                    <TableRow
                      key={`${item.id}-${index}`}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="py-4">
                        <ShowNitDetails
                          nitdetails={item.memoNumber}
                          memoDate={item.memoDate}
                          workslno={worklist.workslno}
                        />
                      </TableCell>
                      <TableCell className="py-4 max-w-[300px]">
                        <p className="font-medium text-gray-900 truncate">
                          {worklist.ApprovedActionPlanDetails
                            ?.activityDescription || "N/A"}
                        </p>
                      </TableCell>
                      <TableCell className="py-4">
                        <div>
                          <span className="text-sm text-gray-500">
                            Bid Opening:{" "}
                            {item.technicalBidOpeningDate
                              ? formatDateTime(item.technicalBidOpeningDate)
                                  .dateOnly
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                          In Progress
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <Link
                          href={`/admindashboard/manage-tender/addbidderdetails/${worklist.id}`}
                        >
                          <Button className="gap-2" size="sm">
                            <Plus className="h-4 w-4" />
                            Add Bidder
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="rounded-full bg-gray-100 p-4">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.25 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        No active NITs found
                      </h3>
                      <p className="text-sm text-gray-500">
                        Create a new NIT or check back later
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default NitDetailsPage;
