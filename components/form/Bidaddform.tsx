"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  FileText,
  Building,
  AlertCircle,
  CheckCircle2,
  Percent,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import type { workdetailfinanicalProps } from "@/types";
import { addFinancialDetails } from "@/action/aoc";
import { FaRupeeSign } from "react-icons/fa";
import { useRouter } from "next/navigation";
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

export default function FinancialBidDetails({
  work,
}: {
  work: workdetailfinanicalProps;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [localWork, setLocalWork] = useState(work);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionData, setSubmissionData] = useState<BidFormValues | null>(
    null
  );

  useEffect(() => {
    setLocalWork(work);
  }, [work]);

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      bids: localWork.biddingAgencies.map((agency) => {
        const hasPrevious = agency.biddingAmount != null;
        const previousBidAmount = hasPrevious
          ? Number(agency.biddingAmount)
          : undefined;
        const previousDiscount = hasPrevious
          ? (
              ((localWork.finalEstimateAmount - Number(previousBidAmount)) /
                localWork.finalEstimateAmount) *
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
          addFinancialDetails(bid.agencyId, bid.bidAmount, localWork.id)
        )
      ).then((results) => {
        const errors = results.filter((r) => r?.error).map((r) => r?.error);
        if (errors.length) {
          setError(errors.join(". "));
        } else {
          setLocalWork((prev) => ({
            ...prev,
            biddingAgencies: prev.biddingAgencies.map((agency) => {
              const submittedBid = submissionData.bids.find(
                (bid) => bid.agencyId === agency.id
              );
              if (submittedBid) {
                return {
                  ...agency,
                  biddingAmount: Number(submittedBid.bidAmount),
                };
              }
              return agency;
            }),
          }));
          setSuccess("All bids submitted successfully");
          router.push("/admindashboard/manage-tender/addfinanicaldetails");
        }
      });
    });
  };

  const calculateBidAmount = (index: number, lessPercentage: string) => {
    const percentage = Number.parseFloat(lessPercentage);
    if (!isNaN(percentage)) {
      const bidAmount = localWork.finalEstimateAmount * (1 - percentage / 100);
      form.setValue(`bids.${index}.bidAmount`, bidAmount.toFixed(2));
    }
  };

  const allBidsEntered = !localWork.biddingAgencies.some(
    (bit) => bit.biddingAmount == null
  );

  const calculateLowestBid = () => {
    const bids = submissionData?.bids || form.getValues().bids;
    const validBids = bids.filter(
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

    const lowestBidAgency = localWork.biddingAgencies.find(
      (agency) => agency.id === lowestBid.agencyId
    );
    return {
      agencyName: lowestBidAgency?.agencydetails.name || "Unknown",
      amount: Number.parseFloat(lowestBid.bidAmount),
      percentage: (
        (Number.parseFloat(lowestBid.bidAmount) /
          localWork.finalEstimateAmount -
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
    return (completedBids / localWork.biddingAgencies.length) * 100;
  };

  const lowestBid = calculateLowestBid();

  if (!localWork) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Work Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              The requested work details could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-3 sm:px-6 lg:px-8 max-w-6xl">
      <div className="mb-4 space-y-3">
        {error && (
          <Alert variant="destructive" className="animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Submission Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="default" className="animate-fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>

      <Card className="w-full shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 sm:p-6">
          <div className="flex flex-col space-y-1">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center">
              <FileText className="mr-2 h-6 w-6 sm:h-8 sm:w-8" />
              Financial Bid Details
            </CardTitle>
            <CardDescription className="text-blue-100/90 text-base sm:text-lg">
              {localWork.ApprovedActionPlanDetails.activityDescription}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4 sm:pt-6">
          <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <FileText className="mr-2 h-4 w-4" /> Memo Number
                </p>
                <p className="font-semibold text-lg text-foreground">
                  {localWork.nitDetails.memoNumber}/${gpcode}/2024
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <FaRupeeSign className="mr-2 h-4 w-4" /> Estimate Value
                </p>
                <p className="font-semibold text-lg text-foreground">
                  ₹{localWork.finalEstimateAmount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Building className="mr-2 h-4 w-4" /> Agencies
                </p>
                <p className="font-semibold text-lg text-foreground">
                  {localWork.biddingAgencies.length} Participating
                </p>
              </div>
            </div>
          </div>

          {allBidsEntered ? (
            <div className="text-center py-8 sm:py-10 space-y-4 sm:space-y-6 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle2 className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-green-800">
                  All Bids Submitted
                </h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto text-sm sm:text-base">
                  Financial bids have been successfully recorded for all
                  participating agencies.
                </p>
              </div>
              <Button
                onClick={() =>
                  router.push(
                    "/admindashboard/manage-tender/addfinanicaldetails"
                  )
                }
                className="mt-2 sm:mt-4 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                Return to Dashboard
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 sm:mb-6">
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                  <h3 className="font-medium text-foreground text-sm sm:text-base">
                    Bid Completion
                  </h3>
                  <span className="text-sm font-medium text-primary">
                    {Math.round(calculateBidCompletion())}%
                  </span>
                </div>
                <Progress
                  value={calculateBidCompletion()}
                  className="h-2 sm:h-3"
                />
              </div>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="rounded-lg border shadow-sm overflow-x-auto">
                  <Table className="min-w-[700px] sm:min-w-full">
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[150px] sm:w-[30%] font-semibold text-gray-700">
                          Agency
                        </TableHead>
                        <TableHead className="w-[100px] sm:w-[20%] font-semibold text-gray-700">
                          Discount %
                        </TableHead>
                        <TableHead className="w-[120px] sm:w-[20%] font-semibold text-gray-700">
                          Bid Amount
                        </TableHead>
                        <TableHead className="w-[100px] sm:w-[20%] font-semibold text-gray-700">
                          Savings
                        </TableHead>
                        <TableHead className="w-[60px] sm:w-[10%] font-semibold text-gray-700 text-center">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {localWork.biddingAgencies.map((agency, index) => {
                        const bidAmount = Number.parseFloat(
                          form.watch(`bids.${index}.bidAmount`)
                        );
                        const lessValue =
                          localWork.finalEstimateAmount -
                          (isNaN(bidAmount) ? 0 : bidAmount);
                        const isBidValid = !isNaN(bidAmount) && bidAmount > 0;
                        const isLowest =
                          lowestBid &&
                          lowestBid.agencyName === agency.agencydetails.name;

                        return (
                          <TableRow
                            key={agency.id}
                            className={
                              isLowest
                                ? "bg-blue-50 hover:bg-blue-100"
                                : "hover:bg-muted/10"
                            }
                          >
                            <TableCell className="font-medium py-2 sm:py-4">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <Building className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                                <span className="text-sm sm:text-base line-clamp-1">
                                  {agency.agencydetails.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-2 sm:py-4">
                              <div className="relative">
                                <Percent className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
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
                                  className="pl-7 h-9 sm:h-10 text-sm"
                                />
                              </div>
                              {agency.biddingAmount != null && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Previous discount:{" "}
                                  {(
                                    ((localWork.finalEstimateAmount -
                                      Number(agency.biddingAmount)) /
                                      localWork.finalEstimateAmount) *
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
                            <TableCell className="py-2 sm:py-4">
                              <div className="relative">
                                <FaRupeeSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  type="text"
                                  placeholder="0.00"
                                  className="pl-6 h-9 sm:h-10 text-sm"
                                  {...form.register(`bids.${index}.bidAmount`)}
                                />
                              </div>
                              {agency.biddingAmount != null && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Previous: ₹
                                  {Number(agency.biddingAmount).toLocaleString(
                                    "en-IN"
                                  )}
                                </p>
                              )}
                              {form.formState.errors.bids?.[index]
                                ?.bidAmount && (
                                <p className="text-xs text-destructive mt-1">
                                  {
                                    form.formState.errors.bids[index]?.bidAmount
                                      ?.message
                                  }
                                </p>
                              )}
                            </TableCell>
                            <TableCell className="py-2 sm:py-4">
                              <div className="flex items-center">
                                {lessValue > 0 ? (
                                  <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-1" />
                                ) : (
                                  <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 mr-1" />
                                )}
                                <span
                                  className={`font-medium text-sm sm:text-base ${
                                    lessValue > 0
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  ₹{Math.abs(lessValue).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-2 sm:py-4 text-center">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    {isBidValid ? (
                                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mx-auto" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mx-auto" />
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

                <div className="space-y-4">
                  {lowestBid && (
                    <Card className="border-blue-200 bg-blue-50 p-3">
                      <CardContent className="p-0 flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-blue-800 text-sm sm:text-base">
                            Current Lowest Bidder
                          </h4>
                          <p className="text-blue-700 text-xs sm:text-sm truncate">
                            <span className="font-semibold">
                              {lowestBid.agencyName}
                            </span>
                            <span className="block sm:inline">
                              {" "}
                              ₹{lowestBid.amount.toLocaleString("en-IN")}
                              <span className="ml-1 bg-blue-200 px-1.5 py-0.5 rounded-full text-xs">
                                {lowestBid.percentage}% discount
                              </span>
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="lg"
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
                      className="w-full sm:w-auto shadow-md text-sm sm:text-base"
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
                  </div>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="w-[95%] max-w-md rounded-lg sm:rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Confirm Bid Submission
            </DialogTitle>
            <DialogDescription className="pt-3 sm:pt-4 text-sm sm:text-base">
              You are about to submit financial bids for all agencies. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 sm:py-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                Lowest Bidder:
              </h4>
              {lowestBid ? (
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-2 sm:mr-3">
                    <Building className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm sm:text-lg truncate">
                      {lowestBid.agencyName}
                    </p>
                    <p className="flex items-center flex-wrap gap-1">
                      <FaRupeeSign className="mr-1 text-green-600 text-sm sm:text-base" />
                      <span className="font-semibold text-green-700 text-sm sm:text-lg">
                        {lowestBid.amount.toLocaleString("en-IN")}
                      </span>
                      <span className="ml-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm">
                        {lowestBid.percentage}% below estimate
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm sm:text-base">
                  No valid bids to determine lowest bidder
                </p>
              )}
            </div>

            <div className="mt-3 sm:mt-4 bg-amber-50 rounded-lg p-3 border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2 text-sm sm:text-base">
                Important:
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-amber-700 text-xs sm:text-sm">
                <li className="flex items-start">
                  <span className="inline-block mr-1">•</span>
                  <span>Verify all bid amounts before submission</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block mr-1">•</span>
                  <span>This action will finalize the financial bids</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block mr-1">•</span>
                  <span>Changes cannot be made after submission</span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Review Again
            </Button>
            <Button
              onClick={confirmSubmission}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
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
    </div>
  );
}
