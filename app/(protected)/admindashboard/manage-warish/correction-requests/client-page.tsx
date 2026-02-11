"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import CorrectionRequestReview from "@/components/warishcorrection/correction-request-review";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import { StatsCard } from "./components/stats-card";
import type { CorrectionRequest } from "./types";

interface ClientPageProps {
  initialPendingRequests: CorrectionRequest[];
  initialApprovedRequests: CorrectionRequest[];
  initialRejectedRequests: CorrectionRequest[];
  initialStats: Record<string, number>;
}

export default function AdminCorrectionRequestsClientPage({
  initialPendingRequests,
  initialApprovedRequests,
  initialRejectedRequests,
  initialStats,
}: ClientPageProps) {
  const [allRequests, setAllRequests] = useState<CorrectionRequest[]>([
    ...initialPendingRequests,
    ...initialApprovedRequests,
    ...initialRejectedRequests,
  ]);
  
  const [stats, setStats] = useState(initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filtering states
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>("all");

  const router = useRouter();

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/admin/correction-requests");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      
      const data = await response.json();
      const newPending = data.pendingRequests || [];
      const newApproved = data.approvedRequests || [];
      const newRejected = data.rejectedRequests || [];
      
      setAllRequests([...newPending, ...newApproved, ...newRejected]);
      setStats(data.stats || {});
      
      router.refresh();
    } catch (error) {
      console.error("Failed to refresh data:", error);
      router.refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRequestReviewed = () => {
    refreshData();
  };

  // Filter logic
  const filteredRequests = useMemo(() => {
    return allRequests.filter((request) => {
      // Status Match
      if (statusFilter !== "all" && request.status !== statusFilter) return false;

      // Target Type Match
      if (targetTypeFilter !== "all" && request.targetType !== targetTypeFilter) return false;

      // Search Query Match
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          request.fieldToModify.toLowerCase().includes(query) ||
          request.requestedBy.toLowerCase().includes(query) ||
          request.currentValue?.toLowerCase().includes(query) ||
          request.proposedValue?.toLowerCase().includes(query) ||
          request.warishApplication?.acknowlegment.toLowerCase().includes(query)
        );
      }

      return true;
    }).sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime());
  }, [allRequests, statusFilter, targetTypeFilter, searchQuery]);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Correction Requests
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and manage all data correction requests
          </p>
        </div>

        <Button variant="outline" onClick={refreshData} disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards - Interactive */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div onClick={() => setStatusFilter("all")} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatsCard
            title="Total Requests"
            value={
              (stats.pending || 0) + (stats.approved || 0) + (stats.rejected || 0)
            }
            description="All-time requests"
            icon={<FileText className="h-[18px] w-[18px]" />}
          />
        </div>

        <div onClick={() => setStatusFilter("pending")} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatsCard
            title="Pending"
            value={stats.pending || 0}
            description="Awaiting review"
            icon={<Clock className="h-[18px] w-[18px]" />}
            iconBgClass="bg-yellow-100 dark:bg-yellow-900/30"
            valueColorClass="text-yellow-600 dark:text-yellow-400"
            borderColorClass={`border-l-4 border-yellow-500 ${statusFilter === 'pending' ? 'ring-2 ring-yellow-500 ring-offset-2' : ''}`}
          />
        </div>

        <div onClick={() => setStatusFilter("approved")} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatsCard
            title="Approved"
            value={stats.approved || 0}
            description="Approved changes"
            icon={<CheckCircle className="h-[18px] w-[18px]" />}
            iconBgClass="bg-green-100 dark:bg-green-900/30"
            valueColorClass="text-green-600 dark:text-green-400"
            borderColorClass={`border-l-4 border-green-500 ${statusFilter === 'approved' ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
          />
        </div>

        <div onClick={() => setStatusFilter("rejected")} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatsCard
            title="Rejected"
            value={stats.rejected || 0}
            description="Rejected requests"
            icon={<XCircle className="h-[18px] w-[18px]" />}
            iconBgClass="bg-red-100 dark:bg-red-900/30"
            valueColorClass="text-red-600 dark:text-red-400"
            borderColorClass={`border-l-4 border-red-500 ${statusFilter === 'rejected' ? 'ring-2 ring-red-500 ring-offset-2' : ''}`}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-gray-900 p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={targetTypeFilter} onValueChange={setTargetTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="detail">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="px-0 pt-0">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Request List</CardTitle>
                <CardDescription>
                  Showing {filteredRequests.length} results
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <CorrectionRequestReview
              requests={filteredRequests}
              onRequestReviewed={handleRequestReviewed}
              viewMode="table"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
