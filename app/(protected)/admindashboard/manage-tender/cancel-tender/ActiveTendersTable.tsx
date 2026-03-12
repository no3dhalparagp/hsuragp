"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, AlertCircle, CheckCircle2, Clock, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TenderStatus } from "@prisma/client";
import { ShowNitDetails } from "@/components/ShowNitDetails";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusVariants: Record<
  TenderStatus,
  "destructive" | "success" | "warning" | "default"
> = {
  Cancelled: "destructive",
  published: "success",
  ToBeOpened: "warning",
  publish: "success",
  TechnicalBidOpening: "warning",
  TechnicalEvaluation: "warning",
  FinancialBidOpening: "warning",
  FinancialEvaluation: "warning",
  Retender: "warning",
  AOC: "default",
};

interface Tender {
  id: string;
  workslno: number | string;
  tenderStatus: TenderStatus;
  nitDetails: {
    memoNumber: number | string;
    memoDate: Date;
  };
  ApprovedActionPlanDetails: {
    activityDescription: string;
  };
}

interface ActiveTendersTableProps {
  tenders: Tender[];
  updateTenderStatus: (formData: FormData) => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

export function ActiveTendersTable({
  tenders,
  updateTenderStatus,
}: ActiveTendersTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingUpdate, setPendingUpdate] = useState<{
    id: string;
    status: TenderStatus;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter tenders based on search and status
  const filteredTenders = useMemo(() => {
    let filtered = tenders;

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tender) =>
          tender.nitDetails.memoNumber.toString().toLowerCase().includes(search) ||
          tender.ApprovedActionPlanDetails.activityDescription
            .toLowerCase()
            .includes(search) ||
          tender.workslno.toString().toLowerCase().includes(search)
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((tender) => tender.tenderStatus === selectedStatus);
    }

    return filtered;
  }, [tenders, searchTerm, selectedStatus]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTenders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTenders = filteredTenders.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  const handleStatusChange = (id: string, newStatus: TenderStatus, currentStatus: TenderStatus) => {
    if (newStatus === currentStatus) return;
    setPendingUpdate({ id, status: newStatus });
  };

  const confirmStatusUpdate = async () => {
    if (!pendingUpdate) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("id", pendingUpdate.id);
    formData.append("status", pendingUpdate.status);

    try {
      await updateTenderStatus(formData);
      setPendingUpdate(null);
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tenders.forEach((tender) => {
      counts[tender.tenderStatus] = (counts[tender.tenderStatus] || 0) + 1;
    });
    return counts;
  }, [tenders]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-slate-50 rounded-lg border">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by NIT, work description, or work number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="status-filter" className="text-sm font-medium whitespace-nowrap">
            Status:
          </Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger id="status-filter" className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.keys(statusVariants).map((status) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={statusVariants[status as TenderStatus]}
                      className="text-xs"
                    >
                      {status}
                    </Badge>
                    {statusCounts[status] && (
                      <span className="text-xs text-muted-foreground">
                        ({statusCounts[status]})
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">
            {filteredTenders.length > 0 ? startIndex + 1 : 0}
          </span> to{" "}
          <span className="font-semibold text-foreground">{Math.min(endIndex, filteredTenders.length)}</span> of{" "}
          <span className="font-semibold text-foreground">{filteredTenders.length}</span> results
          {filteredTenders.length !== tenders.length && (
            <span className="text-muted-foreground"> (of {tenders.length} total)</span>
          )}
        </p>
        {(searchTerm || selectedStatus !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedStatus("all");
            }}
            className="text-xs"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead className="min-w-[200px]">NIT Details</TableHead>
              <TableHead className="min-w-[280px]">Work Description</TableHead>
              <TableHead className="w-40">Status</TableHead>
              <TableHead className="text-right min-w-[320px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTenders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText className="h-12 w-12 opacity-50" />
                    <p className="font-medium">No tenders found</p>
                    <p className="text-sm">
                      {searchTerm || selectedStatus !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "No active tenders available"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
                ) : (
                  paginatedTenders.map((item, i) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="text-center font-medium text-slate-600">
                        {startIndex + i + 1}
                      </TableCell>
                  <TableCell className="font-medium">
                    <ShowNitDetails
                      nitdetails={item.nitDetails.memoNumber}
                      memoDate={item.nitDetails.memoDate}
                      workslno={item.workslno}
                    />
                  </TableCell>
                  <TableCell className="max-w-[280px]">
                    <p className="truncate" title={item.ApprovedActionPlanDetails.activityDescription}>
                      {item.ApprovedActionPlanDetails.activityDescription}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[item.tenderStatus]} className="font-medium">
                      {item.tenderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center justify-end">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Label className="hidden sm:inline-block text-sm text-muted-foreground whitespace-nowrap">
                          Update:
                        </Label>
                        <Select
                          value={item.tenderStatus}
                          onValueChange={(value) =>
                            handleStatusChange(item.id, value as TenderStatus, item.tenderStatus)
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(statusVariants).map((status) => (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={statusVariants[status as TenderStatus]}
                                    className="text-xs"
                                  >
                                    {status}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50 rounded-b-lg">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!pendingUpdate}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setPendingUpdate(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Confirm Status Update
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2">
              Are you sure you want to change the tender status to{" "}
              <Badge 
                variant={pendingUpdate ? statusVariants[pendingUpdate.status] : "default"}
                className="mx-1"
              >
                {pendingUpdate?.status}
              </Badge>
              ?
              <br />
              <span className="text-xs text-muted-foreground mt-2 block">
                This action will update the tender status and may trigger notifications.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusUpdate}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin inline" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 inline" />
                  Confirm Update
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

