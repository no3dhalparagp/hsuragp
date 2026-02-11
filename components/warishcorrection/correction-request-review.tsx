"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ChevronRight,
  Info,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface CorrectionRequestReviewProps {
  requests: CorrectionRequest[];
  onRequestReviewed: () => void;
  viewMode?: "list" | "table";
}

export default function CorrectionRequestReview({
  requests,
  onRequestReviewed,
  viewMode = "list",
}: CorrectionRequestReviewProps) {
  const [reviewingRequest, setReviewingRequest] = useState<string | null>(null);
  const [reviewComments, setReviewComments] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<CorrectionRequest | null>(null);

  const handleReview = async (requestId: string, approve: boolean) => {
    if (!reviewComments.trim() && !approve) {
      toast({
        title: "Error",
        description: "Please provide comments when rejecting a request",
        variant: "destructive",
      });
      return;
    }

    setReviewingRequest(requestId);
    try {
      const response = await fetch(
        `/api/warish-correction-requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approve,
            reviewedBy: "Admin", // You might want to get this from user context
            reviewComments: reviewComments.trim() || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast({
        title: "Success",
        description: data.message,
      });

      setReviewComments("");
      setIsDialogOpen(false);
      onRequestReviewed();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to review request",
        variant: "destructive",
      });
    } finally {
      setReviewingRequest(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 border-yellow-200">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30 border-green-200">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30 border-red-200">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatFieldName = (fieldName: string) => {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "MMM dd, yyyy 'at' h:mm a");
  };

  const openReviewDialog = (request: CorrectionRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  if (requests.length === 0) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-900 border-0">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <Info className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              No correction requests
            </h3>
            <p className="text-gray-400 max-w-md">
              There are no correction requests to display at this time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Review Dialog Component
  const ReviewDialog = () => (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setSelectedRequest(null);
          setReviewComments("");
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Correction Request</DialogTitle>
          <div className="text-sm text-muted-foreground mt-1">
            ID: {selectedRequest?.id}
          </div>
        </DialogHeader>

        {selectedRequest && (
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium text-gray-700">
                  Field to Modify
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">
                    {formatFieldName(selectedRequest.fieldToModify)}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">
                    ({selectedRequest.targetType})
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Label className="font-medium text-gray-700">Status</Label>
                <div className="mt-1 flex justify-end">
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-medium text-gray-700">
                  Current Value
                </Label>
                <div className="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm break-words">
                  {selectedRequest.currentValue || (
                    <span className="text-gray-400 italic">Empty</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-gray-700">
                  Proposed Value
                </Label>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg text-sm break-words">
                  {selectedRequest.proposedValue}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-gray-700">
                Reason for Modification
              </Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm">
                {selectedRequest.reasonForModification}
              </div>
            </div>

            {selectedRequest.status !== "pending" && (
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-3 text-sm">
                  Review Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Reviewed By</span>
                    <span className="font-medium">
                      {selectedRequest.reviewedBy || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Date</span>
                    <span className="font-medium">
                      {selectedRequest.reviewedDate
                        ? formatDate(selectedRequest.reviewedDate)
                        : "N/A"}
                    </span>
                  </div>
                  {selectedRequest.reviewComments && (
                    <div className="col-span-2 mt-2">
                      <span className="text-gray-500 block">Comments</span>
                      <p className="mt-1 text-gray-700">
                        {selectedRequest.reviewComments}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedRequest.status === "pending" && (
              <div className="space-y-2">
                <Label
                  htmlFor="reviewComments"
                  className="font-medium text-gray-700"
                >
                  Review Comments
                </Label>
                <Textarea
                  id="reviewComments"
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Add your review comments here..."
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500">
                  Required when rejecting a request
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
          {selectedRequest?.status === "pending" && (
            <>
              <Button
                variant="destructive"
                onClick={() =>
                  selectedRequest && handleReview(selectedRequest.id, false)
                }
                disabled={reviewingRequest === selectedRequest?.id}
              >
                {reviewingRequest === selectedRequest?.id
                  ? "Rejecting..."
                  : "Reject"}
              </Button>
              <Button
                onClick={() =>
                  selectedRequest && handleReview(selectedRequest.id, true)
                }
                disabled={reviewingRequest === selectedRequest?.id}
                className="bg-green-600 hover:bg-green-700"
              >
                {reviewingRequest === selectedRequest?.id
                  ? "Approving..."
                  : "Approve"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Table View Implementation
  if (viewMode === "table") {
    return (
      <>
        <div className="rounded-md border bg-white dark:bg-gray-900">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Proposed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{formatFieldName(request.fieldToModify)}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {request.targetType}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{request.requestedBy}</span>
                      {request.warishApplication && (
                        <span className="text-xs text-muted-foreground">
                          App: {request.warishApplication.acknowlegment}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(request.requestedDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={request.currentValue}>
                    {request.currentValue || "-"}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate font-medium text-green-600" title={request.proposedValue}>
                    {request.proposedValue}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => openReviewDialog(request)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(request.id)}
                        >
                          Copy Request ID
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ReviewDialog />
      </>
    );
  }

  // List View Implementation (Default)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold">Correction Requests</h2>
          <p className="text-sm text-muted-foreground">
            {requests.length} request{requests.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="transition-all hover:shadow-md overflow-hidden border-l-4"
            style={{
              borderLeftColor:
                request.status === "pending"
                  ? "#eab308"
                  : request.status === "approved"
                  ? "#22c55e"
                  : "#ef4444",
            }}
          >
            <CardHeader className="pb-2 pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {formatFieldName(request.fieldToModify)}
                    <span className="text-xs font-normal text-muted-foreground capitalize px-2 py-0.5 bg-muted rounded-full">
                      {request.targetType}
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <UserIcon className="h-3 w-3" />
                    <span>{request.requestedBy}</span>
                    <span>•</span>
                    <span>{formatDate(request.requestedDate)}</span>
                  </div>
                </div>
                {getStatusBadge(request.status)}
              </div>
            </CardHeader>

            <CardContent className="pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="text-sm">
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                    Current
                  </span>
                  <div className="font-medium truncate">
                    {request.currentValue || "N/A"}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">
                    Proposed
                  </span>
                  <div className="font-medium text-green-700 truncate">
                    {request.proposedValue}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openReviewDialog(request)}
                  className="text-xs"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ReviewDialog />
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
