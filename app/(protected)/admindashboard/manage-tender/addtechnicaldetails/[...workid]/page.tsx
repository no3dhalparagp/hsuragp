// app/admindashboard/manage-tender/addtechnicaldetails/[workid]/page.tsx
import Link from "next/link";
import { db } from "@/lib/db";
import { Plus, ChevronLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddTechnicalDetailsDialog from "@/components/AddTechnicalDetailsDialog";
import { sentforfinanicalbidadd } from "@/action/bookNitNuber";
import { ShowWorkDetails } from "@/components/Work-details";
import { TechnicalDetailsDialog } from "@/components/TechnicalDetailsDialog";
import { SubmitButton } from "@/components/submit-button";
import AddTechnicalDetailsButton from "./AddTechnicalDetailsButton";

const Page = async ({ params }: { params: Promise<{ workid: string[] }> }) => {
  const { workid: workidArr } = await params;
  const [workid] = workidArr || [];

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
  });

  const workDetail = technical[0]?.WorksDetail;
  const qualifiedCount = technical.filter(
    (item) => item.technicalEvelution?.qualify
  ).length;
  const allEvaluationsSubmitted = technical.every(
    (item) => item.technicalEvelutiondocumentId !== null
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
                let statusText = "Pending";
                let statusClass = "text-gray-500";
                let statusIcon = null;
                let rowClass = ""; // New: background class for rows

                if (item.technicalEvelution) {
                  statusText = item.technicalEvelution.qualify
                    ? "Qualified"
                    : "Disqualified";
                  statusClass = item.technicalEvelution.qualify
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium";
                  statusIcon = item.technicalEvelution.qualify ? (
                    <CheckCircle className="inline h-4 w-4 mr-1" />
                  ) : (
                    <XCircle className="inline h-4 w-4 mr-1" />
                  );

                  // Set row background based on qualification
                  rowClass = item.technicalEvelution.qualify
                    ? "bg-green-50 hover:bg-green-100"
                    : "bg-red-50 hover:bg-red-100";
                } else {
                  rowClass = "hover:bg-muted/50"; // Default hover for pending
                }

                return (
                  <TableRow key={item.id} className={rowClass}>
                    <TableCell className="font-medium text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.agencydetails.name}
                        {item.agencydetails.agencyType == "FARM" && (
                          <span className="text-sm font-bold text-red-500">
                            ({item.agencydetails.proprietorName})
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`text-center ${statusClass}`}>
                      {statusIcon}
                      {statusText}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.technicalEvelutiondocumentId ? (
                        <TechnicalDetailsDialog
                          bidderId={item.id}
                          bidderName={item.agencydetails.name}
                          bidderType={item.agencydetails.agencyType}
                          bidderProprietorName={
                            item.agencydetails.proprietorName
                          }
                        />
                      ) : (
                        <AddTechnicalDetailsButton agencyId={item.id} />
                      )}
                    </TableCell>
                  </TableRow>
                );
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

          {showFinancialButtons ? (
            <div className="flex gap-3">
              <form action={sentforfinanicalbidadd}>
                <input type="hidden" name="workid" value={workDetail?.id} />
                <SubmitButton className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Proceed to Financial Bid
                </SubmitButton>
              </form>
            </div>
          ) : allEvaluationsSubmitted ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md px-4 py-2 text-yellow-700">
              <p className="font-medium">
                {qualifiedCount === 0
                  ? "No qualified bidders"
                  : `Only ${qualifiedCount} qualified bidder${
                      qualifiedCount === 1 ? "" : "s"
                    } (minimum 3 required)`}
              </p>
            </div>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
