import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserIcon, Trash2Icon, StoreIcon, User2Icon } from "lucide-react"
import { deleteBidder } from "@/action/bookNitNuber"
import { cn } from "@/lib/utils"

// Mock AgencyType enum since we don't have Prisma setup
type AgencyType = "FARM" | "INDIVIDUAL"

interface Agency {
  id: string
  agencydetails: {
    name: string
    agencyType: AgencyType
    proprietorName: string | null
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
  "bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400",
  "bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400",
  "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400",
  "bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400",
  "bg-gradient-to-r from-purple-50 to-violet-50 border-l-4 border-purple-400",
  "bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-pink-400",
  "bg-gradient-to-r from-indigo-50 to-sky-50 border-l-4 border-indigo-400",
  "bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-400",
]

const agencyTypeIcons = {
  FARM: <StoreIcon className="w-4 h-4 text-green-600" />,
  INDIVIDUAL: <User2Icon className="w-4 h-4 text-blue-600" />,
}

const agencyTypeLabels = {
  FARM: "Farm",
  INDIVIDUAL: "Individual",
}

export function BidderDetails({ workdetails, workid }: BidderDetailsProps) {
  return (
    <Card className="w-full mb-4 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-indigo-500 p-1.5 rounded-md">
              <UserIcon className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-semibold text-gray-800">Bidding Agencies</span>
          </CardTitle>

          {workdetails?.biddingAgencies.length ? (
            <div className="flex gap-2">
              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                {workdetails.biddingAgencies.filter((a) => a.agencydetails.agencyType === "FARM").length} Farms
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {workdetails.biddingAgencies.filter((a) => a.agencydetails.agencyType === "INDIVIDUAL").length}{" "}
                Individuals
              </span>
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {workdetails ? (
          workdetails.biddingAgencies.length > 0 ? (
            /* Reduced height and compact table-like layout */
            <ScrollArea className="h-[250px] w-full">
              <div className="p-2">
                {workdetails.biddingAgencies.map((agency, i) => (
                  <div
                    key={agency.id}
                    className={cn(
                      "rounded-lg p-3 mb-2 transition-all duration-200 hover:shadow-sm",
                      agencyColors[i % agencyColors.length],
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white shadow-sm font-semibold text-sm text-gray-700 flex-shrink-0">
                          {i + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800 truncate">{agency.agencydetails.name}</span>
                            {agencyTypeIcons[agency.agencydetails.agencyType]}
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/70 text-gray-600 flex-shrink-0">
                              {agencyTypeLabels[agency.agencydetails.agencyType]}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            {agency.agencydetails.agencyType === "FARM" && (
                              <span>
                                <span className="font-medium">Proprietor:</span>{" "}
                                {agency.agencydetails.proprietorName || "N/A"}
                              </span>
                            )}
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">ID: {agency.id}</span>
                          </div>
                        </div>
                      </div>

                      <form action={deleteBidder}>
                        <input type="hidden" name="agencyId" value={agency.id} />
                        <input type="hidden" name="workId" value={workid} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors rounded-full h-8 w-8 p-0 flex-shrink-0"
                          aria-label={`Remove ${agency.agencydetails.name}`}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            /* Compact empty state */
            <div className="flex flex-col items-center justify-center h-[200px] text-center p-6">
              <div className="bg-gray-100 p-3 rounded-full mb-3">
                <UserIcon className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-1">No Bidding Agencies</p>
              <p className="text-gray-500 text-sm max-w-md">Currently there are no agencies registered for bidding.</p>
            </div>
          )
        ) : (
          /* Compact error state */
          <div className="flex flex-col items-center justify-center h-[200px] text-center p-6">
            <div className="bg-gray-100 p-3 rounded-full mb-3">
              <UserIcon className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-1">Work Details Missing</p>
            <p className="text-gray-500 text-sm max-w-md">Could not find work details. Please check the work ID.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
