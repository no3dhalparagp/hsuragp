import { Suspense } from "react"
import Link from "next/link"
import { db } from "@/lib/db"
import { Plus, ChevronLeft, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AddTechnicalDetails from "@/components/form/AddTechnicalDetails"
import { sentforfinanicalbidadd } from "@/action/bookNitNuber"
import { ShowWorkDetails } from "@/components/Work-details"
import { TechnicalDetailsDialog } from "@/components/TechnicalDetailsDialog"
import { SubmitButton } from "@/components/submit-button";

const Page = async ({ params }: { params: { workid: string[] } }) => {
  const [workid, biderid] = params.workid || []

  const technical = await db.bidagency.findMany({
    where: { worksDetailId: workid },
    include: {
      agencydetails: true,
      technicalEvelution: true,
      WorksDetail: {
        include: {
          biddingAgencies: {
            include: {
              technicalEvelution: true,
            },
          },
          nitDetails: true,
        },
      },
    },
  })

  const workDetail = technical[0]?.WorksDetail

  const bidderdetails = biderid
    ? await db.bidagency.findUnique({
        where: { id: biderid },
        include: {
          agencydetails: true,
          technicalEvelution: true,
          WorksDetail: {
            include: { nitDetails: true },
          },
        },
      })
    : null

  // Calculate number of qualified bidders
  const qualifiedCount = technical.filter(
    item => item.technicalEvelution?.qualify === true
  ).length;

  // Check if all evaluations are submitted and at least 3 qualified
  const allEvaluationsSubmitted = technical.every(
    item => item.technicalEvelutiondocumentId !== null
  );
  
  const showFinancialButtons = allEvaluationsSubmitted && qualifiedCount >= 3;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Work Details Card */}
      <Card className="shadow-sm">
        <CardHeader className="bg-secondary/50 py-3 px-6">
          <CardTitle className="text-lg">Work Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ShowWorkDetails worksDetailId={workid} />
        </CardContent>
      </Card>

      {/* Bidders List Card */}
      {!biderid && (
        <Card className="shadow-sm">
          <CardHeader className="bg-secondary/50 py-3 px-6">
            <CardTitle className="text-lg">Bidders List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-16 text-center">Sl No</TableHead>
                  <TableHead>Bidder Name</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {technical.map((item, index) => {
                  let statusText = 'Pending';
                  let statusClass = 'text-gray-500';
                  let statusIcon = null;
                  
                  if (item.technicalEvelution) {
                    statusText = item.technicalEvelution.qualify 
                      ? 'Qualified' 
                      : 'Disqualified';
                    statusClass = item.technicalEvelution.qualify 
                      ? 'text-green-600 font-medium' 
                      : 'text-red-600 font-medium';
                    statusIcon = item.technicalEvelution.qualify 
                      ? <CheckCircle className="inline h-4 w-4 mr-1" /> 
                      : null;
                  }

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-center">{index + 1}</TableCell>
                      <TableCell>{item.agencydetails.name}</TableCell>
                      <TableCell className={`text-center ${statusClass}`}>
                        {statusIcon}
                        {statusText}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.technicalEvelutiondocumentId ? (
                          <TechnicalDetailsDialog 
                            bidderId={item.id} 
                            bidderName={item.agencydetails.name} 
                          />
                        ) : (
                          <Button variant="default" size="sm" asChild>
                            <Link
                              href={`/admindashboard/manage-tender/addtechnicaldetails/${workid}/${item.id}`}
                              className="flex items-center"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Details
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4 bg-muted/30">
            <Button variant="ghost" asChild>
              <Link href="/admindashboard/manage-tender/addtechnicaldetails/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Tenders
              </Link>
            </Button>
            
            {/* Show buttons only when all evaluations submitted and min 3 qualified */}
            {showFinancialButtons && (
              <div className="flex gap-3">
                <form action={sentforfinanicalbidadd}>
                  <input type="hidden" name="workid" value={workDetail?.id} />
                  <SubmitButton className="bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Proceed to Financial Bid
                  </SubmitButton>
                </form>
          
              </div>
            )}

            {/* Show warning if not enough qualified bidders */}
            {allEvaluationsSubmitted && !showFinancialButtons && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2 text-yellow-700">
                <p className="font-medium flex items-center">
    
                  {qualifiedCount === 0 
                    ? "No qualified bidders" 
                    : `Only ${qualifiedCount} qualified bidder${qualifiedCount === 1 ? '' : 's'} (minimum 3 required)`}
                </p>
              </div>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Bidder Details Card */}
      {bidderdetails && (
        <Suspense
          fallback={
            <Card className="w-full h-64 flex items-center justify-center shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
          }
        >
          <Card className="shadow-sm">
            <CardHeader className="bg-accent/50 py-3 px-6">
              <CardTitle className="text-lg">{bidderdetails.agencydetails.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {bidderdetails.technicalEvelutiondocumentId ? (
                <div className="space-y-4">
                  <div className={`flex items-center gap-2 p-4 rounded-md ${
                    bidderdetails.technicalEvelution?.qualify
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}>
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      {bidderdetails.technicalEvelution?.qualify
                        ? "Technically Qualified"
                        : "Technically Disqualified"}
                    </span>
                  </div>
                  <TechnicalDetailsDialog 
                    bidderId={biderid} 
                    bidderName={bidderdetails.agencydetails.name} 
                  />
                </div>
              ) : (
                <AddTechnicalDetails agencyid={biderid} />
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 p-4">
              <Button variant="ghost" asChild>
                <Link href={`/admindashboard/manage-tender/addtechnicaldetails/${workid}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Bidders
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </Suspense>
      )}
    </div>
  )
}

export default Page
