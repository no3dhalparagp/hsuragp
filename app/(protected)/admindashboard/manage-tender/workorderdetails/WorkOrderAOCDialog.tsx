"use client";

import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader as CardHead,
  CardTitle as CardTit,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SaveIcon,
  BuildingIcon,
  CurrencyIcon,
  CheckCircleIcon,
  TrophyIcon,
  FileTextIcon,
  CheckIcon,
  EditIcon,
} from "lucide-react";
import FormSubmitButton from "@/components/FormSubmitButton";
import { useRouter } from "next/navigation";
import { addAoCdetails } from "./aocServerAction";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { gpcode } from "@/constants/gpinfor";
// Types
interface AgencyDetails {
  name: string;
}

interface Bid {
  id: string;
  biddingAmount: number | null;
  agencydetails: AgencyDetails;
}

interface WorkDetails {
  nitDetails?: {
    memoNumber: string;
    memoDate: string;
  };
  workslno?: string;
  ApprovedActionPlanDetails?: {
    activityDescription: string;
    activityCode: string;
    estimatedCost: number;
  };
}

interface AOCFormProps {
  worksDetail: WorkDetails;
  acceptbi: Bid[];
  workId: string;
  onOpenChange: (open: boolean) => void;
}

interface WorkOrderAOCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workId: string | null;
}

interface BidItemProps {
  item: Bid;
  rank: number;
  isSelected: boolean;
  onSelect: () => void;
  isEditing: boolean;
  editAmount: string;
  onEditAmountChange: (amount: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

// Constants
const BADGE_COLORS = [
  "bg-green-100 text-green-800 border-green-300",
  "bg-blue-100 text-blue-800 border-blue-300",
  "bg-yellow-100 text-yellow-800 border-yellow-300",
] as const;

// Query keys
const QUERY_KEYS = {
  workOrderAOC: (workId: string) => ["workOrderAOC", workId],
  financialBids: (workId: string) => ["financialBids", workId],
} as const;

// API functions
const fetchWorkOrderAOC = async (workId: string) => {
  const response = await fetch(`/api/workorder-aoc?workId=${workId}`);
  if (!response.ok) throw new Error("Failed to load data");
  return response.json();
};

const editFinancialBid = async ({
  bidId,
  newAmount,
  workId,
}: {
  bidId: string;
  newAmount: number;
  workId: string;
}) => {
  const response = await fetch("/api/edit-financial-bid", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bidId, newAmount, workId }),
  });
  if (!response.ok) throw new Error("Failed to update bid");
  return response.json();
};

// Zod schema for form validation
const formSchema = z.object({
  acceptbidderId: z.string({
    required_error: "You must select a bidder",
  }),
  memono: z.string().min(1, "Memo number is required"),
  memodate: z.string().min(1, "Memo date is required"),
});

export default function WorkOrderAOCDialog({
  open,
  onOpenChange,
  workId,
}: WorkOrderAOCDialogProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: workId ? QUERY_KEYS.workOrderAOC(workId) : ["workOrderAOC"],
    queryFn: () => (workId ? fetchWorkOrderAOC(workId) : Promise.resolve(null)),
    enabled: open && !!workId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const renderContent = useCallback(() => {
    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (error)
      return (
        <div className="p-8 text-center text-red-500">Failed to load data</div>
      );
    if (data)
      return <AOCForm {...data} workId={workId!} onOpenChange={onOpenChange} />;
    return <div className="p-8 text-center">No data</div>;
  }, [isLoading, error, data, workId, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-screen-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <CheckCircleIcon className="w-6 h-6" />
            Process Acceptance of Contract (AOC)
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

function AOCForm({
  worksDetail,
  acceptbi,
  workId,
  onOpenChange,
}: AOCFormProps) {
  const [editingBidId, setEditingBidId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");

  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query for bids data with optimistic updates
  const { data: bids = acceptbi } = useQuery({
    queryKey: QUERY_KEYS.financialBids(workId),
    queryFn: () => Promise.resolve(acceptbi),
    enabled: false, // We already have the initial data from parent
    initialData: acceptbi,
  });

  // Mutation for editing bid amount
  const editBidMutation = useMutation({
    mutationFn: editFinancialBid,
    onMutate: async ({ bidId, newAmount }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.financialBids(workId),
      });

      // Snapshot the previous value
      const previousBids = queryClient.getQueryData(
        QUERY_KEYS.financialBids(workId)
      );

      // Optimistically update to the new value
      queryClient.setQueryData(QUERY_KEYS.financialBids(workId), (old: Bid[]) =>
        old.map((bid: Bid) =>
          bid.id === bidId ? { ...bid, biddingAmount: newAmount } : bid
        )
      );

      setEditingBidId(null);
      setEditAmount("");

      return { previousBids };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousBids) {
        queryClient.setQueryData(
          QUERY_KEYS.financialBids(workId),
          context.previousBids
        );
      }
      toast({
        title: "Error",
        description: "Failed to update bid amount",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bid amount updated successfully",
        className: "bg-green-100 text-green-800 border-green-300",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're in sync with server
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.financialBids(workId),
      });
    },
  });

  // Memoized sorted bids and lowest bidder
  const { sortedBids, lowestBidderId } = useMemo(() => {
    const filteredBids = bids.filter((bid) => bid.biddingAmount !== null);
    const sorted = filteredBids.sort(
      (a, b) => (a.biddingAmount ?? 0) - (b.biddingAmount ?? 0)
    );
    const lowestId = sorted.length > 0 ? sorted[0].id : "";

    return { sortedBids: sorted, lowestBidderId: lowestId };
  }, [bids]);

  // Initialize react-hook-form with Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acceptbidderId: lowestBidderId,
      memono: "",
      memodate: "",
    },
  });

  // Update form value when sortedBids changes
  useEffect(() => {
    if (lowestBidderId) {
      form.setValue("acceptbidderId", lowestBidderId);
    }
  }, [lowestBidderId, form]);

  // Handle bid amount editing
  const handleEditBid = useCallback((bidId: string, currentAmount: number) => {
    setEditingBidId(bidId);
    setEditAmount(currentAmount.toString());
  }, []);

  const handleSaveEdit = useCallback(
    (bidId: string) => {
      const newAmount = parseFloat(editAmount);
      if (isNaN(newAmount) || newAmount <= 0) {
        toast({
          title: "Error",
          description: "Please enter a valid amount",
          variant: "destructive",
        });
        return;
      }

      editBidMutation.mutate({ bidId, newAmount, workId });
    },
    [editAmount, workId, editBidMutation, toast]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingBidId(null);
    setEditAmount("");
  }, []);

  // Mutation for form submission
  const submitFormMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      formData.append("workId", workId);
      formData.append("acceptbidderId", values.acceptbidderId);
      formData.append("memono", values.memono);
      formData.append("memodate", values.memodate);

      return await addAoCdetails(formData);
    },
    onSuccess: (result) => {
      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Work order finalized!",
          className: "bg-green-100 text-green-800 border-green-300",
        });

        // Invalidate relevant queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["workOrders"] });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.workOrderAOC(workId),
        });

        router.refresh();
        onOpenChange?.(false);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit form",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    submitFormMutation.mutate(values);
  };

  const getBidRank = useCallback(
    (bidId: string) => sortedBids.findIndex((bid) => bid.id === bidId) + 1,
    [sortedBids]
  );

  const getBadgeColor = useCallback(
    (rank: number) =>
      BADGE_COLORS[rank - 1] || "bg-gray-100 text-gray-800 border-gray-300",
    []
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <input type="hidden" name="workId" value={workId} />

        {/* Work Details Card */}
        <WorkDetailsCard worksDetail={worksDetail} />

        <Separator />

        {/* Bids Section Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-amber-600" />
            Received Bids
          </h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {bids.length} bids submitted
          </Badge>
        </div>

        {/* Bid Selection with FormField */}
        <FormField
          control={form.control}
          name="acceptbidderId"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormControl>
                <div className="grid gap-4">
                  {bids.map((item) => (
                    <BidItem
                      key={item.id}
                      item={item}
                      rank={getBidRank(item.id)}
                      isSelected={field.value === item.id}
                      onSelect={() => field.onChange(item.id)}
                      isEditing={editingBidId === item.id}
                      editAmount={editAmount}
                      onEditAmountChange={setEditAmount}
                      onEdit={() =>
                        handleEditBid(item.id, item.biddingAmount || 0)
                      }
                      onSave={() => handleSaveEdit(item.id)}
                      onCancel={handleCancelEdit}
                      getBadgeColor={getBadgeColor}
                      isSaving={
                        editBidMutation.isPending && editingBidId === item.id
                      }
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Separator className="my-6" />

        {/* Memo Details */}
        <MemoDetailsCard form={form} />

        <FormActions
          form={form}
          onOpenChange={onOpenChange}
          isSubmitting={submitFormMutation.isPending}
        />
      </form>
    </Form>
  );
}

// Extracted Work Details Card Component
function WorkDetailsCard({ worksDetail }: { worksDetail: WorkDetails }) {
  const nitMemoNumber = worksDetail?.nitDetails?.memoNumber || "-";
  const nitMemoYear = worksDetail?.nitDetails?.memoDate
    ? new Date(worksDetail.nitDetails.memoDate).getFullYear()
    : "";

  return (
    <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
      <CardHead className="bg-primary/10 p-4 border-b border-primary/20">
        <CardTit className="flex items-center gap-2 text-primary">
          <BuildingIcon className="w-5 h-5" />
          Work Details
        </CardTit>
      </CardHead>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <span className="font-medium">NIT No.:</span> {nitMemoNumber}/$
            {gpcode}/{nitMemoYear}
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <span className="font-medium">Work Sl. No.:</span>{" "}
            {worksDetail?.workslno || "-"}
          </Badge>
        </div>

        <div className="mb-4">
          <Label className="text-base text-muted-foreground">Work Name</Label>
          <p className="text-xl font-bold mt-1">
            {worksDetail?.ApprovedActionPlanDetails?.activityDescription ||
              "N/A"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Activity Code</Label>
            <p className="font-medium">
              {worksDetail?.ApprovedActionPlanDetails?.activityCode || "-"}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Estimated Cost</Label>
            <p className="font-medium text-green-700">
              ₹
              {worksDetail?.ApprovedActionPlanDetails?.estimatedCost?.toLocaleString() ||
                "-"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Extracted Memo Details Card Component
function MemoDetailsCard({ form }: { form: any }) {
  return (
    <Card className="bg-blue-50/30 border-2 border-blue-200">
      <CardHead className="bg-blue-100/50 p-4 border-b border-blue-200">
        <CardTit className="flex items-center gap-2 text-blue-800">
          <FileTextIcon className="w-5 h-5" />
          Work Order Memo Details
        </CardTit>
      </CardHead>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="memono"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Memo Number *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter memo number"
                    className="bg-white border-gray-300"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memodate"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Memo Date *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    className="bg-white border-gray-300"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Extracted Form Actions Component
function FormActions({
  form,
  onOpenChange,
  isSubmitting,
}: {
  form: any;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="mt-8 flex justify-end gap-4">
      <DialogClose asChild>
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </DialogClose>
      <FormSubmitButton
        className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-2 rounded-lg shadow-md transition-all flex items-center"
        disabled={isSubmitting}
      >
        <SaveIcon className="w-5 h-5 mr-2" />
        {isSubmitting ? "Processing..." : "Finalize Work Order"}
      </FormSubmitButton>
    </div>
  );
}

// Optimized BidItem component with memo
const BidItem = memo(function BidItem({
  item,
  rank,
  isSelected,
  onSelect,
  isEditing,
  editAmount,
  onEditAmountChange,
  onEdit,
  onSave,
  onCancel,
  getBadgeColor,
  isSaving = false,
}: BidItemProps & {
  getBadgeColor: (rank: number) => string;
  isSaving?: boolean;
}) {
  const isFirst = rank === 1;
  const badgeColor = getBadgeColor(rank);

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave();
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel();
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 border-l-4 cursor-pointer ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-300"
          : isFirst
          ? "border-green-500 bg-green-50 hover:bg-green-100"
          : "border-gray-300 bg-white hover:bg-gray-50"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-5 flex items-center gap-5">
        <div className="flex items-center gap-4">
          {/* Rank Indicator */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              isSelected
                ? "bg-blue-100 text-blue-800"
                : isFirst
                ? "bg-green-100 text-green-800"
                : rank === 2
                ? "bg-blue-100 text-blue-800"
                : rank === 3
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <span className="font-bold">{rank}</span>
          </div>

          <div className="flex items-center gap-3">
            <BuildingIcon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{item.agencydetails.name}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            {rank <= 3 && (
              <Badge className={`${badgeColor} gap-1.5 rounded-md`}>
                {isFirst ? (
                  <TrophyIcon className="w-4 h-4" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4" />
                )}
                {rank === 1
                  ? "Lowest Bid"
                  : rank === 2
                  ? "2nd Lowest"
                  : "3rd Lowest"}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 bg-muted/40 px-4 py-2 rounded-lg">
            <CurrencyIcon className="w-5 h-5 text-muted-foreground" />
            {isEditing ? (
              <div
                className="flex items-center gap-2"
                onClick={handleInputClick}
              >
                <Input
                  type="number"
                  value={editAmount}
                  onChange={(e) => onEditAmountChange(e.target.value)}
                  className="px-2 py-1 border rounded text-right w-32 font-semibold text-lg"
                  placeholder="Enter amount"
                  disabled={isSaving}
                />
                <Button
                  size="sm"
                  onClick={handleSaveClick}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelClick}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold text-lg ${
                    isSelected
                      ? "text-blue-700"
                      : isFirst
                      ? "text-green-700"
                      : "text-gray-800"
                  }`}
                >
                  {item.biddingAmount?.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleEditClick}
                  className="text-orange-600 border-orange-300 hover:bg-orange-50 ml-2"
                >
                  <EditIcon className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center w-6 h-6">
          {isSelected && (
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </CardContent>

      {isFirst && !isSelected && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg shadow">
          Recommended Bid
        </div>
      )}
    </Card>
  );
});
