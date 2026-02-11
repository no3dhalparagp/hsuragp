"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import {
  Loader2,
  Building,
  AlertCircle,
  CheckCircle2,
  Percent,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import type { AddFinancialDetailsType } from "@/types";
import { addFinancialDetails } from "@/action/bookNitNuber";
import { FaRupeeSign } from "react-icons/fa";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { gpcode } from "@/constants/gpinfor";
const bidSchema = z.object({
  bids: z.array(
    z.object({
      agencyId: z.string(),
      lessPercentage: z
        .string()
        .refine(
          (val) =>
            !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
          {
            message: "Must be between 0-100",
          }
        ),
      bidAmount: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: "Must be positive",
        }),
    })
  ),
});

type BidFormValues = z.infer<typeof bidSchema>;

interface BidFormDialogProps {
  work: AddFinancialDetailsType;
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function BidFormDialog({
  work,
  trigger,
  onSuccess,
}: BidFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionData, setSubmissionData] = useState<BidFormValues | null>(
    null
  );

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      bids: work.biddingAgencies.map((agency) => {
        const hasPrevious = agency.biddingAmount != null;
        const previousBidAmount = hasPrevious
          ? Number(agency.biddingAmount)
          : undefined;
        const previousDiscount = hasPrevious
          ? (
              ((work.finalEstimateAmount - Number(previousBidAmount)) /
                work.finalEstimateAmount) *
              100
            ).toFixed(2)
          : "";

        return {
          agencyId: agency.id,
          lessPercentage: previousDiscount || "",
          bidAmount: hasPrevious ? String(previousBidAmount?.toFixed(2)) : "",
        };
      }),
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        bids: work.biddingAgencies.map((agency) => {
          const hasPrevious = agency.biddingAmount != null;
          const previousBidAmount = hasPrevious
            ? Number(agency.biddingAmount)
            : undefined;
          const previousDiscount = hasPrevious
            ? (
                ((work.finalEstimateAmount - Number(previousBidAmount)) /
                  work.finalEstimateAmount) *
                100
              ).toFixed(2)
            : "";

          return {
            agencyId: agency.id,
            lessPercentage: previousDiscount || "",
            bidAmount: hasPrevious ? String(previousBidAmount?.toFixed(2)) : "",
          };
        }),
      });
      setSubmissionData(null);
      setError("");
      setSuccess("");
    }
  }, [open, work, form]);

  const onSubmit = async (data: BidFormValues) => {
    setSubmissionData(data);
    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    if (!submissionData) return;

    setError(undefined);
    setSuccess(undefined);
    setShowConfirmation(false);

    startTransition(() => {
      Promise.all(
        submissionData.bids.map((bid) =>
          addFinancialDetails(bid.agencyId, bid.bidAmount, work.id)
        )
      ).then((results) => {
        const errors = results.filter((r) => r?.error).map((r) => r?.error);
        if (errors.length) {
          setError(errors.join(". "));
        } else {
          // Check if all bids were completed in this submission
          const allCompleted = results.every(
            (r) => r?.allBidsCompleted !== false
          );

          if (allCompleted) {
            setSuccess(
              "All bids submitted successfully and tender status updated to Financial Evaluation"
            );
          } else {
            setSuccess(
              "Bids submitted successfully - complete remaining bids to update tender status"
            );
          }

          setTimeout(() => {
            setOpen(false);
            onSuccess?.();
            setSuccess("");
            setError("");
          }, 3000);
        }
      });
    });
  };

  const calculateBidAmount = (index: number, lessPercentage: string) => {
    const percentage = Number.parseFloat(lessPercentage);
    if (!isNaN(percentage)) {
      const bidAmount = work.finalEstimateAmount * (1 - percentage / 100);
      form.setValue(`bids.${index}.bidAmount`, bidAmount.toFixed(2));
    }
  };

  // FIXED: Calculate lowest bid using current form data and proper agency lookup
  const calculateLowestBid = () => {
    const currentBids = form.getValues().bids;
    const validBids = currentBids.filter(
      (bid) =>
        !isNaN(Number.parseFloat(bid.bidAmount)) &&
        Number.parseFloat(bid.bidAmount) > 0
    );

    if (validBids.length === 0) return null;

    const lowestBid = validBids.reduce((lowest, current) => {
      return Number.parseFloat(current.bidAmount) <
        Number.parseFloat(lowest.bidAmount)
        ? current
        : lowest;
    });

    // FIX: Properly find the agency using agencyId from the bid
    const lowestBidAgency = work.biddingAgencies.find(
      (agency) => agency.id === lowestBid.agencyId
    );

    if (!lowestBidAgency) {
      console.warn("Agency not found for bid:", lowestBid.agencyId);
      return null;
    }

    return {
      agencyName: lowestBidAgency.agencydetails?.name || "Unknown Agency",
      amount: Number.parseFloat(lowestBid.bidAmount),
      percentage: (
        (Number.parseFloat(lowestBid.bidAmount) / work.finalEstimateAmount -
          1) *
        -100
      ).toFixed(2),
    };
  };

  const calculateBidCompletion = () => {
    const completedBids = form
      .getValues()
      .bids.filter(
        (bid) =>
          !isNaN(Number.parseFloat(bid.bidAmount)) &&
          Number.parseFloat(bid.bidAmount) > 0
      ).length;
    return (completedBids / work.biddingAgencies.length) * 100;
  };

  // FIXED: Always calculate lowest bid from current form data
  const lowestBid = calculateLowestBid();
  const allBidsEntered = !work.biddingAgencies.some(
    (bit) => bit.biddingAmount == null
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <Building className="mr-2 h-6 w-6" />
              Financial Bid Details
            </DialogTitle>
            <DialogDescription>
              {work.ApprovedActionPlanDetails.activityDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Submission Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Memo Number</p>
                  <p className="font-semibold">
                    {work.nitDetails.memoNumber}/${gpcode}/2024
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Estimate Value
                  </p>
                  <p className="font-semibold">
                    ₹{work.finalEstimateAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Agencies</p>
                  <p className="font-semibold">
                    {work.biddingAgencies.length} Participating
                  </p>
                </div>
              </div>
            </div>

            {allBidsEntered ? (
              <div className="text-center py-8 space-y-4 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                <div>
                  <h3 className="text-xl font-bold text-green-800">
                    All Bids Submitted
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Financial bids have been successfully recorded for all
                    participating agencies. Tender status has been updated to
                    Financial Evaluation.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Bid Completion</h3>
                    <span className="text-sm font-medium text-primary">
                      {Math.round(calculateBidCompletion())}%
                    </span>
                  </div>
                  <Progress value={calculateBidCompletion()} className="h-2" />
                </div>

                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="rounded-lg border shadow-sm overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-semibold">
                            Agency
                          </TableHead>
                          <TableHead className="font-semibold">
                            Discount %
                          </TableHead>
                          <TableHead className="font-semibold">
                            Bid Amount
                          </TableHead>
                          <TableHead className="font-semibold">
                            Savings
                          </TableHead>
                          <TableHead className="font-semibold text-center">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {work.biddingAgencies.map((agency, index) => {
                          const bidAmount = Number.parseFloat(
                            form.watch(`bids.${index}.bidAmount`)
                          );
                          const lessValue =
                            work.finalEstimateAmount -
                            (isNaN(bidAmount) ? 0 : bidAmount);
                          const isBidValid = !isNaN(bidAmount) && bidAmount > 0;
                          const isLowest =
                            lowestBid &&
                            lowestBid.agencyName === agency.agencydetails.name;

                          return (
                            <TableRow
                              key={agency.id}
                              className={isLowest ? "bg-blue-50" : ""}
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-2">
                                  <Building className="h-4 w-4 text-indigo-600" />
                                  <span className="text-sm">
                                    {agency.agencydetails.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="relative">
                                  <Percent className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                  <Input
                                    type="text"
                                    placeholder="0.00"
                                    {...form.register(
                                      `bids.${index}.lessPercentage`
                                    )}
                                    onChange={(e) => {
                                      form.setValue(
                                        `bids.${index}.lessPercentage`,
                                        e.target.value
                                      );
                                      calculateBidAmount(index, e.target.value);
                                    }}
                                    className="pl-8 h-9"
                                  />
                                </div>
                                {agency.biddingAmount != null && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Previous discount:{" "}
                                    {(
                                      ((work.finalEstimateAmount -
                                        Number(agency.biddingAmount)) /
                                        work.finalEstimateAmount) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </p>
                                )}
                                {form.formState.errors.bids?.[index]
                                  ?.lessPercentage && (
                                  <p className="text-xs text-destructive mt-1">
                                    {
                                      form.formState.errors.bids[index]
                                        ?.lessPercentage?.message
                                    }
                                  </p>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="relative">
                                  <FaRupeeSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    type="text"
                                    placeholder="0.00"
                                    className="pl-7 h-9"
                                    {...form.register(
                                      `bids.${index}.bidAmount`
                                    )}
                                  />
                                </div>
                                {agency.biddingAmount != null && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Previous: ₹
                                    {Number(
                                      agency.biddingAmount
                                    ).toLocaleString("en-IN")}
                                  </p>
                                )}
                                {form.formState.errors.bids?.[index]
                                  ?.bidAmount && (
                                  <p className="text-xs text-destructive mt-1">
                                    {
                                      form.formState.errors.bids[index]
                                        ?.bidAmount?.message
                                    }
                                  </p>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {lessValue > 0 ? (
                                    <ArrowDown className="h-4 w-4 text-green-600 mr-1" />
                                  ) : (
                                    <ArrowUp className="h-4 w-4 text-red-600 mr-1" />
                                  )}
                                  <span
                                    className={`font-medium text-sm ${
                                      lessValue > 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    ₹
                                    {Math.abs(lessValue).toLocaleString(
                                      "en-IN"
                                    )}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      {isBidValid ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                                      ) : (
                                        <AlertCircle className="h-4 w-4 text-amber-500 mx-auto" />
                                      )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {isBidValid ? "Valid bid" : "Pending bid"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {lowestBid && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Current Lowest Bidder:
                      </h4>
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Building className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <p className="font-bold text-blue-800">
                            {lowestBid.agencyName}
                          </p>
                          <p className="text-blue-700 text-sm">
                            ₹{lowestBid.amount.toLocaleString("en-IN")}
                            <span className="ml-2 bg-blue-200 px-2 py-1 rounded-full text-xs">
                              {lowestBid.percentage}% discount
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isPending ||
                        form
                          .getValues()
                          .bids.some(
                            (bid) =>
                              isNaN(Number.parseFloat(bid.bidAmount)) ||
                              Number.parseFloat(bid.bidAmount) <= 0
                          )
                      }
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Bids...
                        </>
                      ) : (
                        "Submit All Bids"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Confirm Bid Submission
            </DialogTitle>
            <DialogDescription className="pt-4">
              You are about to submit financial bids for all agencies. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">
                Lowest Bidder:
              </h4>
              {lowestBid ? (
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Building className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-bold">{lowestBid.agencyName}</p>
                    <p className="flex items-center">
                      <FaRupeeSign className="mr-1 text-green-600" />
                      <span className="font-semibold text-green-700">
                        {lowestBid.amount.toLocaleString("en-IN")}
                      </span>
                      <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {lowestBid.percentage}% below estimate
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No valid bids to determine lowest bidder
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isPending}
            >
              Review Again
            </Button>
            <Button
              onClick={confirmSubmission}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Confirm Submission"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
