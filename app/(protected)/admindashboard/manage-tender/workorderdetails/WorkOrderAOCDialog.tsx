"use client";

import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  SaveIcon,
  BuildingIcon,
  CurrencyIcon,
  CheckCircleIcon,
  TrophyIcon,
  FileTextIcon,
  CheckIcon
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod schema for form validation
const formSchema = z.object({
  acceptbidderId: z.string({
    required_error: "You must select a bidder",
  }),
  memono: z.string().min(1, "Memo number is required"),
  memodate: z.string().min(1, "Memo date is required"),
});

interface WorkOrderAOCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workId: string | null;
}

export default function WorkOrderAOCDialog({
  open,
  onOpenChange,
  workId,
}: WorkOrderAOCDialogProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !workId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/workorder-aoc?workId=${workId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [open, workId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-screen-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <CheckCircleIcon className="w-6 h-6" />
            Process Acceptance of Contract (AOC)
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : data ? (
          <AOCForm {...data} workId={workId!} onOpenChange={onOpenChange} />
        ) : (
          <div className="p-8 text-center">No data</div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AOCForm({ worksDetail, acceptbi, workId, onOpenChange }: any) {
  const sortedBids = acceptbi
    .filter((bid: any) => bid.biddingAmount !== null)
    .sort((a: any, b: any) => (a.biddingAmount ?? 0) - (b.biddingAmount ?? 0));
  const getBidRank = (bidId: string) =>
    sortedBids.findIndex((bid: any) => bid.id === bidId) + 1;
  const getBadgeColor = (rank: number) => {
    const colors = [
      "bg-green-100 text-green-800 border-green-300",
      "bg-blue-100 text-blue-800 border-blue-300",
      "bg-yellow-100 text-yellow-800 border-yellow-300",
    ];
    return colors[rank - 1] || "bg-gray-100 text-gray-800 border-gray-300";
  };
  const router = useRouter();
  const { toast } = useToast();

  // Initialize react-hook-form with Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acceptbidderId: "",
      memono: "",
      memodate: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("workId", workId);
    formData.append("acceptbidderId", values.acceptbidderId);
    formData.append("memono", values.memono);
    formData.append("memodate", values.memodate);

    const result = await addAoCdetails(formData);
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
      router.refresh();
      if (typeof onOpenChange === "function") onOpenChange(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <input type="hidden" name="workId" value={workId} />
        
        {/* Work Details Card */}
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
                <span className="font-medium">NIT No.:</span>{" "}
                {worksDetail?.nitDetails?.memoNumber || "-"}
                /DGP/
                {worksDetail?.nitDetails?.memoDate
                  ? new Date(worksDetail.nitDetails.memoDate).getFullYear()
                  : ""}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                <span className="font-medium">Work Sl. No.:</span>{" "}
                {worksDetail?.workslno || "-"}
              </Badge>
            </div>
            
            <div className="mb-4">
              <Label className="text-base text-muted-foreground">
                Work Name
              </Label>
              <p className="text-xl font-bold mt-1">
                {worksDetail?.ApprovedActionPlanDetails.activityDescription || "N/A"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Activity Code</Label>
                <p className="font-medium">
                  {worksDetail?.ApprovedActionPlanDetails.activityCode || "-"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Estimated Cost</Label>
                <p className="font-medium text-green-700">
                  ₹
                  {worksDetail?.ApprovedActionPlanDetails.estimatedCost?.toLocaleString() ||
                    "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Separator />
        
        {/* Bids Section Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-amber-600" />
            Received Bids
          </h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {acceptbi.length} bids submitted
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
                  {acceptbi.map((item: any) => (
                    <BidItem
                      key={item.id}
                      item={item}
                      getBidRank={getBidRank}
                      getBadgeColor={getBadgeColor}
                      isSelected={field.value === item.id}
                      onSelect={() => field.onChange(item.id)}
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
        <Card className="bg-blue-50/30 border-2 border-blue-200">
          <CardHead className="bg-blue-100/50 p-4 border-b border-blue-200">
            <CardTit className="flex items-center gap-2 text-blue-800">
              <FileTextIcon className="w-5 h-5" />
              Work Order Memo Details
            </CardTit>
          </CardHead>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Memo Number Field */}
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
              
              {/* Memo Date Field */}
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
            disabled={form.formState.isSubmitting}
          >
            <SaveIcon className="w-5 h-5 mr-2" /> 
            {form.formState.isSubmitting ? "Processing..." : "Finalize Work Order"}
          </FormSubmitButton>
        </div>
      </form>
    </Form>
  );
}

interface BidItemProps {
  item: any;
  getBidRank: (bidId: string) => number;
  getBadgeColor: (rank: number) => string;
  isSelected: boolean;
  onSelect: () => void;
}

function BidItem({ 
  item, 
  getBidRank, 
  getBadgeColor, 
  isSelected,
  onSelect 
}: BidItemProps) {
  const rank = getBidRank(item.id);
  const isFirst = rank === 1;
  const badgeColor = getBadgeColor(rank);
  
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
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isSelected
              ? "bg-blue-100 text-blue-800"
              : isFirst 
                ? "bg-green-100 text-green-800" 
                : rank === 2 
                  ? "bg-blue-100 text-blue-800" 
                  : rank === 3 
                    ? "bg-yellow-100 text-yellow-800" 
                    : "bg-gray-100 text-gray-800"
          }`}>
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
            <span
              className={`font-semibold text-lg ${
                isSelected ? "text-blue-700" :
                isFirst ? "text-green-700" : "text-gray-800"
              }`}
            >
              {item.biddingAmount?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </span>
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
}
