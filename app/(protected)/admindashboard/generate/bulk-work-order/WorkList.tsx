"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Loader2,
  Calendar,
  IndianRupee,
  FileText,
  Filter,
  Building2,
  SearchX,
  CheckCircle2,
} from "lucide-react";

import type { Workorderdetails } from "@/types/tender-manage";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

import { ShowNitDetails } from "@/components/ShowNitDetails";
import { generateworkorderPDFAll } from "@/components/PrintTemplet/all-work-order";
import { formatDate } from "@/utils/utils";

interface WorkListProps {
  works: Workorderdetails[];
}

function getFinancialYear(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

export function WorkList({ works }: WorkListProps) {
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedFund, setSelectedFund] = useState<string>("all");
  const [selectedMemo, setSelectedMemo] = useState<string>("all");

  /* ---------------- GROUP BY FINANCIAL YEAR ---------------- */

  const worksByYear = useMemo(() => {
    const grouped = works.reduce(
      (acc, work) => {
        const date = work.awardofcontractdetails?.workordeermemodate
          ? new Date(work.awardofcontractdetails.workordeermemodate)
          : null;

        if (date) {
          const fy = getFinancialYear(date);

          if (!acc[fy]) acc[fy] = new Set();
          acc[fy].add(work);
        }

        return acc;
      },
      {} as Record<string, Set<Workorderdetails>>,
    );

    return Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .reduce(
        (acc, year) => {
          acc[year] = Array.from(grouped[year]);
          return acc;
        },
        {} as Record<string, Workorderdetails[]>,
      );
  }, [works]);

  /* ---------------- UNIQUE FUNDS ---------------- */

  const uniqueFunds = useMemo(() => {
    const funds = new Set<string>();

    works.forEach((work) => {
      const scheme =
        work.Bidagency?.WorksDetail?.ApprovedActionPlanDetails?.schemeName;

      if (scheme) funds.add(scheme);
    });

    return Array.from(funds).sort();
  }, [works]);

  /* ---------------- UNIQUE MEMOS ---------------- */

  const uniqueMemos = useMemo(() => {
    const memos = new Set<string>();

    works.forEach((work) => {
      const memo = work.Bidagency?.WorksDetail?.nitDetails?.memoNumber;

      if (memo) memos.add(memo.toString());
    });

    return Array.from(memos).sort((a, b) => Number(a) - Number(b));
  }, [works]);

  /* ---------------- FILTERED WORKS ---------------- */

  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      const date = work.awardofcontractdetails?.workordeermemodate
        ? new Date(work.awardofcontractdetails.workordeermemodate)
        : null;

      const fy = date ? getFinancialYear(date) : null;

      const scheme =
        work.Bidagency?.WorksDetail?.ApprovedActionPlanDetails?.schemeName;

      const memo =
        work.Bidagency?.WorksDetail?.nitDetails?.memoNumber?.toString();

      return (
        (selectedYear === "all" || fy === selectedYear) &&
        (selectedFund === "all" || scheme === selectedFund) &&
        (selectedMemo === "all" || memo === selectedMemo)
      );
    });
  }, [works, selectedYear, selectedFund, selectedMemo]);

  /* ---------------- TOTAL VALUE ---------------- */

  const totalValue = filteredWorks.reduce(
    (sum, w) => sum + (w.Bidagency?.biddingAmount ?? 0),
    0,
  );

  /* ---------------- SELECT LOGIC ---------------- */

  const allSelected =
    filteredWorks.length > 0 &&
    filteredWorks.every((w) => selectedWorks.includes(w.id));

  const someSelected =
    filteredWorks.some((w) => selectedWorks.includes(w.id)) && !allSelected;

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const ids = filteredWorks.map((w) => w.id);
      setSelectedWorks(ids);
    } else {
      setSelectedWorks([]);
    }
  };

  /* ---------------- GENERATE PDF ---------------- */

  const handleGeneratePDF = async () => {
    if (selectedWorks.length === 0) {
      alert("Select at least one work");
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch("/api/bulk-work-order-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workIds: selectedWorks }),
      });

      const data = await res.json();

      await generateworkorderPDFAll(data);
    } catch (error) {
      console.error(error);
      alert("PDF generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl border-none">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-slate-400">Total Works</p>
              <h2 className="text-2xl font-bold">{works.length}</h2>
            </div>
            <Building2 className="w-8 h-8 text-emerald-400" />
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-slate-500">Filtered</p>
              <h2 className="text-2xl font-bold">{filteredWorks.length}</h2>
            </div>
            <Filter className="w-8 h-8 text-slate-400" />
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-slate-500">Selected</p>
              <h2 className="text-2xl font-bold text-emerald-600">
                {selectedWorks.length}
              </h2>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-white dark:bg-slate-900 shadow-sm">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase text-slate-500">Total Value</p>
              <h2 className="text-lg font-bold">
                ₹{totalValue.toLocaleString("en-IN")}
              </h2>
            </div>
            <IndianRupee className="w-8 h-8 text-emerald-500" />
          </CardContent>
        </Card>

      </div>

      {/* FILTER BAR */}

      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between bg-white dark:bg-slate-900 p-6 rounded-3xl shadow border">

        <div className="flex gap-4 flex-wrap">

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="Financial Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {Object.keys(worksByYear).map((year) => (
                <SelectItem key={year} value={year}>
                  FY {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedFund} onValueChange={setSelectedFund}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="Fund" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Funds</SelectItem>
              {uniqueFunds.map((fund) => (
                <SelectItem key={fund} value={fund}>
                  {fund}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMemo} onValueChange={setSelectedMemo}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="Memo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Memos</SelectItem>
              {uniqueMemos.map((memo) => (
                <SelectItem key={memo} value={memo}>
                  NIT-{memo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>

        <Button
          onClick={handleGeneratePDF}
          disabled={selectedWorks.length === 0 || isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="animate-spin mr-2 w-4 h-4" />
          ) : (
            <FileText className="mr-2 w-4 h-4" />
          )}
          Generate ({selectedWorks.length})
        </Button>

      </div>

      {/* TABLE */}

      <Card className="rounded-3xl border shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      allSelected ? true : someSelected ? "indeterminate" : false
                    }
                    onCheckedChange={(checked) =>
                      toggleSelectAll(checked === true)
                    }
                  />
                </TableHead>

                <TableHead>Date</TableHead>
                <TableHead>Work Details</TableHead>
                <TableHead>NIT</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead className="text-right">Value</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {filteredWorks.length > 0 ? (
                filteredWorks.map((work) => (
                  <TableRow key={work.id}>

                    <TableCell>
                      <Checkbox
                        checked={selectedWorks.includes(work.id)}
                        onCheckedChange={(checked) =>
                          setSelectedWorks((prev) =>
                            checked
                              ? [...prev, work.id]
                              : prev.filter((id) => id !== work.id)
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {work.awardofcontractdetails?.workordeermemodate
                        ? formatDate(
                            work.awardofcontractdetails.workordeermemodate
                          )
                        : "---"}
                    </TableCell>

                    <TableCell className="max-w-[300px]">
                      {work.Bidagency?.WorksDetail?.ApprovedActionPlanDetails
                        ?.activityDescription || "No description"}
                    </TableCell>

                    <TableCell>

                      <ShowNitDetails
                        nitdetails={
                          work.Bidagency?.WorksDetail?.nitDetails?.memoNumber ??
                          ""
                        }
                        memoDate={
                          work.Bidagency?.WorksDetail?.nitDetails?.memoDate ||
                          new Date()
                        }
                        workslno={work.Bidagency?.WorksDetail?.workslno ?? ""}
                      />

                    </TableCell>

                    <TableCell>
                      {work.Bidagency?.agencydetails?.name || "Unassigned"}
                    </TableCell>

                    <TableCell className="text-right font-bold">
                      ₹
                      {work.Bidagency?.biddingAmount?.toLocaleString("en-IN") ||
                        "0"}
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <SearchX className="mx-auto mb-3 w-10 h-10 text-slate-400" />
                    No works found
                  </TableCell>
                </TableRow>
              )}

            </TableBody>

          </Table>

        </div>

      </Card>

    </div>
  );
}
