import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BuildingIcon, CheckCircleIcon, CurrencyIcon, CheckIcon } from "lucide-react";

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
      className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
        rank <= 3 ? "border bg-white" : "bg-muted/50"
      } ${
        isSelected ? "ring-2 ring-primary" : "hover:bg-gray-50 cursor-pointer"
      }`}
    >
      <Checkbox
        id={`bid-${item.id}`}
        value={item.id}
        name="acceptbidderId"
        defaultChecked={isSelected}
      />
      <Label htmlFor={`bid-${item.id}`} className="flex-grow">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <BuildingIcon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{item.agencydetails.name}</span>
            </div>
            
            {rank <= 3 && (
              <Badge className={`${badgeColor} rounded-sm`}>
                {rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"}
              </Badge>
            )}
            
            {isSelected && (
              <Badge variant="default" className="bg-blue-100 text-blue-800 rounded-sm">
                <CheckIcon className="w-4 h-4 mr-1" />
                Selected
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2 bg-muted px-3 py-1.5 rounded-full">
            <CurrencyIcon className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold">
              {item.biddingAmount?.toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </Label>
    </div>
  );
}
