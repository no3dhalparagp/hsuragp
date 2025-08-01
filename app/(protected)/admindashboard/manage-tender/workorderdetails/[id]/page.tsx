import { ReactNode } from "react";
import { db } from "@/lib/db";

import FormSubmitButton from "@/components/FormSubmitButton";
import {
  SaveIcon,
  BuildingIcon,
  CurrencyIcon,
  CheckCircleIcon,
  TrophyIcon,
  FileTextIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShowWorkDetails } from "@/components/Work-details";
import { redirect } from "next/navigation";
import { addAoCdetails } from "../aocServerAction";

interface WorkOrderLayoutProps {
  params: { id: string };
}

interface WorksDetail {
  id: string;
  nitDetailsId: string | null;
  finalEstimateAmount: number | null;
  approvedActionPlanDetailsId: string | null;
  tenderStatus: string;
}

interface BidAgency {
  id: string;
  biddingAmount: number | null;
  agencydetails: {
    name: string;
  };
  WorksDetail: {
    nitDetails: any;
  };
}

export default async function WorkOrderBidding({
  params,
}: WorkOrderLayoutProps) {
  const [acceptbi, worksDetail] = await Promise.all([
    db.bidagency.findMany({
      where: { worksDetailId: params.id },
      select: {
        id: true,
        biddingAmount: true,
        agencydetails: true,
        WorksDetail: { include: { nitDetails: true } },
      },
    }) as Promise<BidAgency[]>,
    db.worksDetail.findUnique({
      where: { id: params.id },
    }) as Promise<WorksDetail | null>,
  ]);

  if (worksDetail?.tenderStatus === "AOC") {
    redirect("/admindashboard/manage-tender/workorderdetails");
  }

  const sortedBids = acceptbi
    .filter((bid) => bid.biddingAmount !== null)
    .sort((a, b) => (a.biddingAmount ?? 0) - (b.biddingAmount ?? 0));

  const getBidRank = (bidId: string) =>
    sortedBids.findIndex((bid) => bid.id === bidId) + 1;

  const getBadgeColor = (rank: number) => {
    const colors = [
      "bg-green-100 text-green-800 border-green-300",
      "bg-blue-100 text-blue-800 border-blue-300",
      "bg-yellow-100 text-yellow-800 border-yellow-300",
    ];
    return colors[rank - 1] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BuildingIcon className="w-6 h-6" />
            Work Order Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BuildingIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Tender Ref No
                  </Label>
                  <p className="text-lg font-semibold">
                    {worksDetail?.nitDetailsId || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CurrencyIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Estimate Amount
                  </Label>
                  <p className="text-lg font-semibold">
                    {worksDetail?.finalEstimateAmount?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    }) || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <CheckCircleIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Work Name
                  </Label>
                  <p className="text-lg font-semibold">
                    {worksDetail?.approvedActionPlanDetailsId || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />
          <BidInformation
            acceptbi={acceptbi}
            getBidRank={getBidRank}
            getBadgeColor={getBadgeColor}
            workId={params.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}

async function handleSubmit(formData: FormData) {
  "use server";
  const result = await addAoCdetails(formData);

  if (result?.error) {
    console.error("Error adding AoC details:", result.error);
  }
}

function BidInformation({
  acceptbi,
  getBidRank,
  getBadgeColor,
  workId,
}: {
  acceptbi: BidAgency[];
  getBidRank: (bidId: string) => number;
  getBadgeColor: (rank: number) => string;
  workId: string;
}) {
  if (acceptbi.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-8">
          <p className="text-xl text-muted-foreground">No valid bids found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <CurrencyIcon className="w-5 h-5" />
        Bid Proposals
      </h2>
      <form action={handleSubmit}>
        <input type="hidden" name="workId" value={workId} />
        <div className="space-y-4">
          {acceptbi.map((item) => (
            <BidItem
              key={item.id}
              item={item}
              getBidRank={getBidRank}
              getBadgeColor={getBadgeColor}
            />
          ))}
        </div>

        <Separator className="my-6" />

        <Card className="bg-muted/50">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FileTextIcon className="w-5 h-5" />
              Work Order Memo Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="mt-6">
          <FormSubmitButton className="w-full">
            <SaveIcon className="w-4 h-4 mr-2" />
            Finalize Work Order
          </FormSubmitButton>
        </div>
      </form>
    </div>
  );
}

function BidItem({
  item,
  getBidRank,
  getBadgeColor,
}: {
  item: BidAgency;
  getBidRank: (bidId: string) => number;
  getBadgeColor: (rank: number) => string;
}) {
  const rank = getBidRank(item.id);
  const isFirst = rank === 1;
  const badgeColor = getBadgeColor(rank);

  return (
    <Card
      className={`group relative overflow-hidden ${
        isFirst ? "border-2 border-green-500" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
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
              <span className="text-sm text-muted-foreground">
                Rank #{rank}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CurrencyIcon className="w-5 h-5 text-muted-foreground" />
              <span
                className={`font-semibold ${isFirst ? "text-green-600" : ""}`}
              >
                {item.biddingAmount?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
          </div>
        </div>

        {isFirst && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-bl-lg">
            Recommended Bid
          </div>
        )}
      </CardContent>
    </Card>
  );
}
