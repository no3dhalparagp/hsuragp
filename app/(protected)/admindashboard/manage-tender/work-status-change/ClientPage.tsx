"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { InfoIcon, Search } from "lucide-react";
import { formatDate } from "@/utils/utils";
import { ShowNitDetails } from "@/components/ShowNitDetails";
import WorkStatusForm from "@/components/WorkStatusForm";
import { updateWorkStatus } from "@/action/updateWorkStatus";

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "tenderPublish", label: "Tender Publish" },
  { value: "workorder", label: "Work Order" },
  { value: "yettostart", label: "Yet to Start" },
  { value: "workinprogress", label: "Work in Progress" },
  { value: "workcompleted", label: "Work Completed" },
  { value: "billgenerated", label: "Bill Generated" },
  { value: "billpaid", label: "Bill Paid" },
];

const PAGE_SIZE = 10;

export type WorkItem = {
  id: string;
  workStatus: string;
  workCommencementDate: Date | null;
  completionDate: Date | null;
  workslno: number;
  nitDetails: {
    memoNumber: number | string;
    memoDate: Date;
  };
  ApprovedActionPlanDetails: {
    activityDescription: string;
  };
};

interface ClientPageProps {
  workList: WorkItem[];
}

export default function ClientPage({ workList }: ClientPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredWorks = useMemo(() => {
    let filtered = workList;

    if (activeTab !== "all") {
      filtered = filtered.filter((w) => w.workStatus === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (w) =>
          String(w.nitDetails?.memoNumber ?? "").toLowerCase().includes(q) ||
          String(w.workslno ?? "").includes(q) ||
          (w.ApprovedActionPlanDetails?.activityDescription ?? "")
            .toLowerCase()
            .includes(q)
      );
    }

    return filtered;
  }, [workList, activeTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredWorks.length / PAGE_SIZE));
  const paginatedWorks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredWorks.slice(start, start + PAGE_SIZE);
  }, [filteredWorks, currentPage]);

  const handleStatusUpdate = async () => {
    router.refresh();
  };

  const canUpdateStatus = (status: string) =>
    status !== "workcompleted" && status !== "billpaid";

  if (workList.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Work Status Management
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Update and track work status through NIT numbers
            </p>
          </div>
        </div>
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <div className="flex flex-col items-center justify-center gap-4">
            <InfoIcon className="h-16 w-16 text-gray-400/80" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                No works found
              </h3>
              <p className="text-sm text-gray-500">
                All works have been completed or cancelled
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Work Status Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Update and track work status through NIT numbers
          </p>
        </div>
        <Badge variant="secondary" className="px-4 py-2 text-base">
          Total Works: {workList.length}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by NIT, work no, or work name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            setCurrentPage(1);
          }}
          className="w-full"
        >
          <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-muted/80">
            {STATUS_TABS.map((tab) => {
              const count =
                tab.value === "all"
                  ? workList.length
                  : workList.filter((w) => w.workStatus === tab.value).length;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  {tab.label}
                  <Badge
                    variant={activeTab === tab.value ? "default" : "secondary"}
                    className="ml-1.5 h-5 min-w-5 px-1 text-xs"
                  >
                    {count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {filteredWorks.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl">
                <InfoIcon className="h-12 w-12 text-gray-400/80 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No works match your filter</p>
              </div>
            ) : (
              <>
                <Card className="rounded-xl shadow-sm">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50/80">
                        <TableRow>
                          <TableHead className="w-[60px] text-gray-600 font-semibold">
                            SL No
                          </TableHead>
                          <TableHead className="text-gray-600 font-semibold">
                            NIT No
                          </TableHead>
                          <TableHead className="text-gray-600 font-semibold">
                            Work Name
                          </TableHead>
                          <TableHead className="text-gray-600 font-semibold">
                            Commencement Date
                          </TableHead>
                          <TableHead className="text-gray-600 font-semibold">
                            Completion Date
                          </TableHead>
                          <TableHead className="text-gray-600 font-semibold">
                            Work Status
                          </TableHead>
                          <TableHead className="text-right text-gray-600 font-semibold">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedWorks.map((work, index) => (
                          <TableRow
                            key={work.id}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <TableCell className="font-medium text-gray-600">
                              {(currentPage - 1) * PAGE_SIZE + index + 1}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                              <ShowNitDetails
                                nitdetails={work.nitDetails.memoNumber}
                                memoDate={work.nitDetails.memoDate}
                                workslno={work.workslno}
                              />
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                              {work.ApprovedActionPlanDetails.activityDescription}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {work.workCommencementDate
                                ? formatDate(work.workCommencementDate)
                                : "-"}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {work.completionDate
                                ? formatDate(work.completionDate)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`px-3 py-1.5 ${getStatusColor(
                                  work.workStatus
                                )}`}
                              >
                                {formatStatusLabel(work.workStatus)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {canUpdateStatus(work.workStatus) ? (
                                <WorkStatusForm
                                  work={work}
                                  updateWorkStatus={updateWorkStatus}
                                  onSuccess={handleStatusUpdate}
                                />
                              ) : (
                                <Badge variant="secondary" className="ml-auto">
                                  Completed
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-2 py-4">
                    <p className="text-sm text-muted-foreground">
                      Showing{" "}
                      {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                      {Math.min(
                        currentPage * PAGE_SIZE,
                        filteredWorks.length
                      )}{" "}
                      of {filteredWorks.length} works
                    </p>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage((p) => p - 1);
                            }}
                            className={
                              currentPage <= 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                        {(() => {
                          const pages: (number | "ellipsis")[] = [];
                          if (totalPages <= 7) {
                            for (let i = 1; i <= totalPages; i++) pages.push(i);
                          } else {
                            const set = new Set<number>();
                            set.add(1);
                            set.add(totalPages);
                            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                              if (i >= 1 && i <= totalPages) set.add(i);
                            }
                            const sorted = Array.from(set).sort((a, b) => a - b);
                            for (let i = 0; i < sorted.length; i++) {
                              if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) pages.push("ellipsis");
                              pages.push(sorted[i]!);
                            }
                          }
                          return pages.map((p, i) =>
                            p === "ellipsis" ? (
                              <PaginationItem key={`ellipsis-${i}`}>
                                <span className="flex h-9 w-9 items-center justify-center">…</span>
                              </PaginationItem>
                            ) : (
                              <PaginationItem key={p}>
                                <PaginationLink
                                  href="#"
                                  isActive={currentPage === p}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(p);
                                  }}
                                  className="cursor-pointer"
                                >
                                  {p}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          );
                        })()}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages)
                                setCurrentPage((p) => p + 1);
                            }}
                            className={
                              currentPage >= totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    case "tenderPublish":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
    case "workorder":
      return "bg-cyan-100 text-cyan-800 hover:bg-cyan-200";
    case "yettostart":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "workinprogress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "workcompleted":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "billgenerated":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "billpaid":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

function formatStatusLabel(status: string) {
  return status
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
