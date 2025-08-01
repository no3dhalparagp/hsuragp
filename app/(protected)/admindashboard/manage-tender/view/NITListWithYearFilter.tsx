"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Eye, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NITCopy } from "@/components/PrintTemplet/PrintNIt-copy";
import { formatDateTime } from "@/utils/utils";

type NITListWithYearFilterProps = {
  nits: any[]; // Replace 'any' with your actual NIT type if available
  onDeleteNit: (id: string) => void;
};

export default function NITListWithYearFilter({
  nits,
  onDeleteNit,
}: NITListWithYearFilterProps) {
  // Helper to get financial year string from a date
  function getFinancialYear(date: string | number | Date) {
    const d = new Date(date);
    const year = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
    const nextYear = (year + 1).toString().slice(-2);
    return `${year}-${nextYear}`;
  }

  // Compute all available financial years
  const years = useMemo(() => {
    const set = new Set<string>();
    nits.forEach((nit) => set.add(getFinancialYear(nit.memoDate)));
    return Array.from(set).sort().reverse() as string[];
  }, [nits]);

  const [selectedYear, setSelectedYear] = useState(years[0] || "");

  const filteredNits = useMemo(
    () => nits.filter((nit) => getFinancialYear(nit.memoDate) === selectedYear),
    [nits, selectedYear]
  );

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="fy-select" className="font-medium">
          Financial Year:
        </label>
        <select
          id="fy-select"
          className="border rounded px-2 py-1"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {filteredNits.length > 0 ? (
        <div className="space-y-4">
          {filteredNits.map((nit, index) => {
            const nitYear = new Date(nit.memoDate).getFullYear();
            return (
              <div
                key={nit.id}
                className="group flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-100 hover:shadow-sm transition-all"
              >
                <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                  <div className="text-gray-500 font-medium">#{index + 1}</div>
                  <div>
                    <Link
                      href={`/admindashboard/manage-tender/view/${nit.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {nit.memoNumber}/DGP/{nitYear}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDateTime(nit.memoDate).dateOnly}
                    </p>
                  </div>
                  <div>
                    <Badge
                      variant="outline"
                      className={`text-sm ${
                        nit.isPublished
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-orange-200 bg-orange-50 text-orange-700"
                      }`}
                    >
                      {nit.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <span className="font-medium">
                      {nit.WorksDetail.length || "0"}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">works</span>
                  </div>
                  <div className="flex justify-end items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:bg-gray-100"
                            asChild
                          >
                            <Link
                              href={`/admindashboard/manage-tender/view/${nit.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {!nit.isPublished && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:bg-blue-50"
                              asChild
                            >
                              <Link
                                href={`/admindashboard/manage-tender/add/${nit.id}`}
                              >
                                <PlusCircle className="w-4 h-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Add Work</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {nit.WorksDetail.length === 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                if (onDeleteNit) await onDeleteNit(nit.id);
                              }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                type="submit"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </form>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete NIT</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <NITCopy nitdetails={nit} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <div className="inline-block bg-blue-50 p-4 rounded-full">
            <AlertCircle className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No NITs Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            No NITs found for the selected financial year.
          </p>
        </div>
      )}
    </>
  );
}
