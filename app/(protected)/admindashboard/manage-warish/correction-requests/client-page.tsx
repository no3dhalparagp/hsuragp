"use client";

import { useState } from "react";
import CorrectionRequestReview from "@/components/warishcorrection/correction-request-review";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface CorrectionRequest {
  id: string;
  fieldToModify: string;
  currentValue: string;
  proposedValue: string;
  reasonForModification: string;
  requestedBy: string;
  requestedDate: Date;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string | null;
  reviewedDate?: Date | null;
  reviewComments?: string | null;
  targetType: "application" | "detail";
  warishApplicationId?: string | null;
  warishDetailId?: string | null;
  warishApplication?: {
    id: string;
    acknowlegment: string;
    applicantName: string;
  } | null;
}

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
  const [pendingRequests, setPendingRequests] = useState(
    initialPendingRequests
  );
  const [approvedRequests, setApprovedRequests] = useState(
    initialApprovedRequests
  );
  const [rejectedRequests, setRejectedRequests] = useState(
    initialRejectedRequests
  );
  const [stats, setStats] = useState(initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // Fetch updated data
      const response = await fetch("/api/admin/correction-requests");
      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data.pendingRequests);
        setApprovedRequests(data.approvedRequests);
        setRejectedRequests(data.rejectedRequests);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to refresh data:", error);
      // Fallback to page reload
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRequestReviewed = () => {
    refreshData();
  };

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
        
        <Button 
          variant="outline"
          onClick={refreshData}
          disabled={isRefreshing}
        >
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Total Requests Card */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.pending || 0) +
                (stats.approved || 0) +
                (stats.rejected || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All-time requests
            </p>
          </CardContent>
        </Card>

        {/* Pending Requests Card */}
        <Card className="transition-all hover:shadow-md border-l-4 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pending || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        {/* Approved Requests Card */}
        <Card className="transition-all hover:shadow-md border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.approved || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Approved changes
            </p>
          </CardContent>
        </Card>

        {/* Rejected Requests Card */}
        <Card className="transition-all hover:shadow-md border-l-4 border-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.rejected || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Rejected requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card className="overflow-hidden">
        <Tabs defaultValue="pending">
          <div className="border-b">
            <TabsList className="w-full rounded-none bg-transparent p-0">
              <TabsTrigger 
                value="pending" 
                className="relative rounded-none data-[state=active]:shadow-none py-6 px-6"
              >
                <div className="flex items-center gap-2">
                  Pending
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    {pendingRequests.length}
                  </Badge>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="approved" 
                className="relative rounded-none data-[state=active]:shadow-none py-6 px-6"
              >
                <div className="flex items-center gap-2">
                  Approved
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">
                    {approvedRequests.length}
                  </Badge>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="rejected" 
                className="relative rounded-none data-[state=active]:shadow-none py-6 px-6"
              >
                <div className="flex items-center gap-2">
                  Rejected
                  <Badge className="bg-red-500 hover:bg-red-600 text-white">
                    {rejectedRequests.length}
                  </Badge>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Pending Requests Tab */}
          <TabsContent value="pending" className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Pending Review</h2>
              <p className="text-muted-foreground text-sm">
                {pendingRequests.length} requests requiring your attention
              </p>
            </div>
            <CorrectionRequestReview
              requests={pendingRequests}
              onRequestReviewed={handleRequestReviewed}
            />
          </TabsContent>
          
          {/* Approved Requests Tab */}
          <TabsContent value="approved" className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Approved Requests</h2>
              <p className="text-muted-foreground text-sm">
                {approvedRequests.length} approved corrections
              </p>
            </div>
            <CorrectionRequestReview
              requests={approvedRequests}
              onRequestReviewed={handleRequestReviewed}
            />
          </TabsContent>
          
          {/* Rejected Requests Tab */}
          <TabsContent value="rejected" className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Rejected Requests</h2>
              <p className="text-muted-foreground text-sm">
                {rejectedRequests.length} rejected correction requests
              </p>
            </div>
            <CorrectionRequestReview
              requests={rejectedRequests}
              onRequestReviewed={handleRequestReviewed}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
