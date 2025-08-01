import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BidAgency {
  id: string;
  biddingAmount: number | null;
  agencydetails: {
    name: string;
  };
}

export function MemoInformation({
  selectedBidderId,
  acceptbi,
}: {
  selectedBidderId: string | null;
  acceptbi: BidAgency[];
}) {
  const selectedBidder = acceptbi.find((bid) => bid.id === selectedBidderId);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Memo Information</h3>
      {selectedBidder ? (
        <div className="p-4 bg-green-100 text-green-800 rounded-md">
          <p className="font-semibold">
            Selected Bidder: {selectedBidder.agencydetails.name}
          </p>
          <p>
            Bid Amount:{" "}
            {selectedBidder.biddingAmount?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground">
          No bidder selected. Please select a bidder and submit the form.
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="memono">Workorder Memo No</Label>
          <Input
            id="memono"
            name="memono"
            placeholder="Enter Workorder Memo No"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="memodate">Memo Date</Label>
          <Input id="memodate" name="memodate" type="date" required />
        </div>
      </div>
    </div>
  );
}
