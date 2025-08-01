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
} from "lucide-react";
import FormSubmitButton from "@/components/FormSubmitButton";
import { useRouter } from "next/navigation";
import { addAoCdetails } from "./aocServerAction";
import { useToast } from "@/components/ui/use-toast";

// Import the server action

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
      <DialogContent className="w-full max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>Process AOC</DialogTitle>
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

  // Add this handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await addAoCdetails(formData);
    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Work order finalized!" });
      router.refresh();
      if (typeof onOpenChange === "function") onOpenChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="workId" value={workId} />
      <div className="space-y-8">
        {/* Work Details Card */}
        <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="bg-purple-200 p-4 rounded-full self-center shadow">
              <CheckCircleIcon className="w-8 h-8 text-purple-700" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-4 mb-2 text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  <span className="font-medium text-gray-700">NIT No.:</span>{" "}
                  {worksDetail?.nitDetails?.memoNumber || "-"}
                  /DGP/
                  {worksDetail?.nitDetails?.memoDate
                    ? new Date(worksDetail.nitDetails.memoDate).getFullYear()
                    : ""}
                </span>
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  <span className="font-medium text-gray-700">
                    Work Sl. No.:
                  </span>{" "}
                  {worksDetail?.workslno || "-"}
                </span>
              </div>
              <Label className="text-base text-muted-foreground">
                Work Name
              </Label>
              <p className="text-xl font-bold mb-1">
                {worksDetail?.ApprovedActionPlanDetails.activityDescription ||
                  "N/A"}
              </p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <span className="font-medium text-gray-700">Code:</span>
                  <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-800 font-mono">
                    {worksDetail?.ApprovedActionPlanDetails.activityCode || "-"}
                  </span>
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <span className="font-medium text-gray-700">
                    Estimated Cost:
                  </span>
                  <span className="bg-green-200 px-2 py-0.5 rounded text-green-800 font-semibold">
                    ₹
                    {worksDetail?.ApprovedActionPlanDetails.estimatedCost?.toLocaleString() ||
                      "-"}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Separator />
        {/* Bids List */}
        <div className="grid gap-4">
          {acceptbi.map((item: any) => (
            <BidItem
              key={item.id}
              item={item}
              getBidRank={getBidRank}
              getBadgeColor={getBadgeColor}
            />
          ))}
        </div>
        <Separator className="my-8" />
        {/* Memo Details */}
        <Card className="bg-muted/60 border-2 border-dashed border-primary/30">
          <CardContent className="p-8 space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FileTextIcon className="w-5 h-5" /> Work Order Memo Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="memono" className="text-sm font-medium">
                  Memo Number
                </Label>
                <Input
                  id="memono"
                  name="memono"
                  placeholder="Enter memo number"
                  className="bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memodate" className="text-sm font-medium">
                  Memo Date
                </Label>
                <Input
                  id="memodate"
                  name="memodate"
                  type="date"
                  className="bg-background"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8">
          <FormSubmitButton className="w-full bg-primary text-white hover:bg-primary/90 text-lg py-3 rounded-lg shadow">
            <SaveIcon className="w-5 h-5 mr-2" /> Finalize Work Order
          </FormSubmitButton>
        </div>
      </div>
    </form>
  );
}

function BidItem({ item, getBidRank, getBadgeColor }: any) {
  const rank = getBidRank(item.id);
  const isFirst = rank === 1;
  const badgeColor = getBadgeColor(rank);
  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-200 ${
        isFirst
          ? "border-2 border-green-500 bg-green-50 shadow-lg scale-[1.01]"
          : "border border-gray-200"
      }`}
    >
      <CardContent className="p-5 flex flex-col md:flex-row items-center gap-4">
        <Checkbox
          id={`bid-${item.id}`}
          value={item.id}
          name="acceptbidderId"
          className="h-5 w-5"
        />
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <BuildingIcon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{item.agencydetails.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {rank <= 3 && (
              <Badge className={`${badgeColor} gap-1.5`}>
                {isFirst ? (
                  <TrophyIcon className="w-4 h-4" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4" />
                )}
                {rank === 1
                  ? "Lowest"
                  : rank === 2
                  ? "2nd Lowest"
                  : "3rd Lowest"}
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">Rank #{rank}</span>
          </div>
          <div className="flex items-center gap-2">
            <CurrencyIcon className="w-5 h-5 text-muted-foreground" />
            <span
              className={`font-semibold text-lg ${
                isFirst ? "text-green-700" : ""
              }`}
            >
              {item.biddingAmount?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
        {isFirst && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg shadow">
            Recommended Bid
          </div>
        )}
      </CardContent>
    </Card>
  );
}
