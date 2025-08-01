
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { CheckCircle, XCircle, Clock, Eye, ChevronRight, Info } from "lucide-react";
import { format } from "date-fns";

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
}

export default function CorrectionRequestReview({
  requests,
  onRequestReviewed,
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
          <Badge className="bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30">
            <XCircle className="w-4 h-4 mr-1" />
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Correction Requests</h2>
          <p className="text-sm text-muted-foreground">
            {requests.length} request{requests.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Click on a request to review
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {requests.map((request) => (
          <Card 
            key={request.id} 
            className="transition-all hover:shadow-md overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Status indicator bar */}
              <div className={`
                w-1.5 min-h-full 
                ${request.status === "pending" ? "bg-yellow-500" : 
                  request.status === "approved" ? "bg-green-500" : "bg-red-500"}
              `}></div>
              
              <div className="flex-1">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {formatFieldName(request.fieldToModify)} 
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-base font-normal text-gray-500">
                          {request.targetType}
                        </span>
                      </CardTitle>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="font-medium">Requested by:</span>
                          <span className="ml-1">{request.requestedBy}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="text-sm text-gray-500">
                          {formatDate(request.requestedDate)}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500 mb-2 block">
                        Current Value
                      </Label>
                      <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm">
                        {request.currentValue || "N/A"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 mb-2 block">
                        Proposed Value
                      </Label>
                      <div className="mt-1 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg text-sm">
                        {request.proposedValue}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500 mb-2 block">
                      Reason for Modification
                    </Label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm">
                      {request.reasonForModification}
                    </div>
                  </div>

                  {request.status !== "pending" && (
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium text-gray-700 mb-3">Review Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500 mb-2 block">
                            Reviewed By
                          </Label>
                          <p className="text-sm">
                            {request.reviewedBy || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500 mb-2 block">
                            Reviewed Date
                          </Label>
                          <p className="text-sm">
                            {request.reviewedDate
                              ? formatDate(request.reviewedDate)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      {request.reviewComments && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium text-gray-500 mb-2 block">
                            Review Comments
                          </Label>
                          <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm">
                            {request.reviewComments}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {request.status === "pending" && (
                    <div className="flex gap-2 pt-4 border-t">
                      <Dialog
                        open={isDialogOpen && selectedRequest?.id === request.id}
                        onOpenChange={(open) => {
                          setIsDialogOpen(open);
                          if (!open) {
                            setSelectedRequest(null);
                            setReviewComments("");
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review Request
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Correction Request</DialogTitle>
                            <div className="text-sm text-muted-foreground mt-1">
                              ID: {request.id}
                            </div>
                          </DialogHeader>

                          <div className="space-y-6 py-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-medium text-gray-700">Field to Modify</Label>
                                <p className="text-sm mt-1 text-gray-600">
                                  {formatFieldName(request.fieldToModify)}
                                </p>
                              </div>
                              <div>
                                <Label className="font-medium text-gray-700">Target Type</Label>
                                <p className="text-sm mt-1 text-gray-600 capitalize">
                                  {request.targetType}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-medium text-gray-700">Current Value</Label>
                                <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm">
                                  {request.currentValue || "N/A"}
                                </div>
                              </div>
                              <div>
                                <Label className="font-medium text-gray-700">Proposed Value</Label>
                                <div className="mt-1 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg text-sm">
                                  {request.proposedValue}
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="font-medium text-gray-700">
                                Reason for Modification
                              </Label>
                              <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm">
                                {request.reasonForModification}
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="reviewComments" className="font-medium text-gray-700">
                                Review Comments
                              </Label>
                              <Textarea
                                id="reviewComments"
                                value={reviewComments}
                                onChange={(e) => setReviewComments(e.target.value)}
                                placeholder="Add your review comments here..."
                                className="mt-1"
                                rows={4}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Required when rejecting a request
                              </p>
                            </div>
                          </div>

                          <DialogFooter className="gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleReview(request.id, false)}
                              disabled={reviewingRequest === request.id}
                            >
                              {reviewingRequest === request.id
                                ? "Rejecting..."
                                : "Reject Request"}
                            </Button>
                            <Button
                              onClick={() => handleReview(request.id, true)}
                              disabled={reviewingRequest === request.id}
                            >
                              {reviewingRequest === request.id
                                ? "Approving..."
                                : "Approve & Apply"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
