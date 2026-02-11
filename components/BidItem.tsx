import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BuildingIcon, CurrencyIcon, CheckIcon } from "lucide-react";

interface BidAgency {
  id: string;
  biddingAmount: number | null;
  agencydetails: {
    name: string;
  };
}

export function BidItem({
  item,
  getBidRank,
  getBadgeColor,
  isSelected,
}: {
  item: BidAgency;
  getBidRank: (bidId: string) => number;
  getBadgeColor: (rank: number) => string;
  isSelected: boolean;
}) {
  const rank = getBidRank(item.id);
  const badgeColor = getBadgeColor(rank);

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
        isSelected
          ? "ring-2 ring-primary bg-blue-50/30"
          : "hover:bg-muted/40 cursor-pointer bg-white"
      }`}
    >
      <Checkbox
        id={`bid-${item.id}`}
        value={item.id}
        name="acceptbidderId"
        defaultChecked={isSelected}
      />
      <Label
        htmlFor={`bid-${item.id}`}
        className="flex flex-1 items-center justify-between"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <BuildingIcon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{item.agencydetails.name}</span>
          </div>
          
          <div className="flex gap-2">
            {rank <= 3 && (
              <Badge className={`${badgeColor} rounded-sm px-2 py-1`}>
                {rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"}
              </Badge>
            )}
            
            {isSelected && (
              <Badge className="bg-blue-100 text-blue-800 rounded-sm px-2 py-1">
                <CheckIcon className="w-4 h-4 mr-1" />
                Selected
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
          <CurrencyIcon className="w-5 h-5 text-muted-foreground" />
          <span className="font-semibold">
            {item.biddingAmount?.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }) || "N/A"}
          </span>
        </div>
      </Label>
    </div>
  );
}
