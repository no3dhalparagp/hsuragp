import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserIcon, Trash2Icon } from "lucide-react"
import { deleteBidder } from "@/action/bookNitNuber"

interface Agency {
  id: string
  agencydetails: {
    name: string
  }
}

interface WorkDetails {
  biddingAgencies: Agency[]
}

interface BidderDetailsProps {
  workdetails: WorkDetails | null
  workid: string
}

const agencyColors = [
  "bg-red-100 text-red-800",
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
  "bg-teal-100 text-teal-800",
]

export function BidderDetails({ workdetails, workid }: BidderDetailsProps) {
  return (
    <Card className="w-full mb-6 shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-2xl font-bold text-gray-800">Bidder Details</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {workdetails ? (
          workdetails.biddingAgencies.length > 0 ? (
            <ScrollArea className="h-[400px] w-full">
              {workdetails.biddingAgencies.map((agency, i) => (
                <div
                  key={agency.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${agencyColors[i % agencyColors.length]}`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">{agency.agencydetails.name}</span>
                      <span className="text-sm text-gray-500">Agency ID: {agency.id}</span>
                    </div>
                  </div>
                  <form action={deleteBidder}>
                    <input type="hidden" name="agencyId" value={agency.id} />
                    <input type="hidden" name="workId" value={workid} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-100 transition-colors duration-150 ease-in-out"
                      aria-label={`Delete ${agency.agencydetails.name}`}
                    >
                      <Trash2Icon className="h-5 w-5 mr-2" />
                      Remove
                    </Button>
                  </form>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-center">
              <UserIcon className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-lg font-medium text-gray-600">No bidding agencies found.</p>
              <p className="text-sm text-gray-500">Add some bidders to get started.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <UserIcon className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-lg font-medium text-gray-600">No work details found.</p>
            <p className="text-sm text-gray-500">Please check the work ID and try again.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

