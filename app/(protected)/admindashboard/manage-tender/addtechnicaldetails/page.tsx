
import { FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatDateTime } from "@/utils/utils";
import { ShowNitDetails } from "@/components/ShowNitDetails";

const TechnicalEvaluationPage = async () => {
  const nitdetails = await db.nitDetails.findMany({
    include: {
      WorksDetail: {
        where: {
          tenderStatus: "TechnicalEvaluation",
        },
        include: {
          ApprovedActionPlanDetails: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <Card className="mb-8 shadow-sm border-0 bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-3xl font-bold text-primary text-center">
              Technical Evaluation
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Manage and review technical evaluations for ongoing tenders
            </p>
          </CardHeader>
        </Card>

        {/* Table Card */}
        <Card className="shadow-sm border-0 bg-white/50 backdrop-blur-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-100/50">
                <TableRow>
                  <TableHead className="w-[60px] text-center font-semibold text-gray-700">
                    Sl No
                  </TableHead>
                  <TableHead className="w-[150px] font-semibold text-gray-700">
                    NIT Number
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Work Description
                  </TableHead>
                  <TableHead className="w-[150px] font-semibold text-gray-700">
                    Memo Date
                  </TableHead>
                  <TableHead className="w-[200px] text-right font-semibold text-gray-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nitdetails.flatMap((nit, nitIndex) =>
                  nit.WorksDetail.map((work, workIndex) => (
                    <TableRow
                      key={`${nit.id}-${work.id}`}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="font-medium text-center text-gray-600">
                        {nitIndex * nit.WorksDetail.length + workIndex + 1}
                      </TableCell>
                      <TableCell className="font-medium whitespace-normal">
                        <ShowNitDetails
                          nitdetails={nit.memoNumber}
                          memoDate={nit.memoDate}
                          workslno={work.workslno}
                        />
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-800">
                            {work.ApprovedActionPlanDetails
                              ?.activityDescription ||
                              "No description available"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <Badge
                          variant="outline"
                          className="text-primary font-medium bg-primary/10 border-primary/20"
                        >
                          {formatDateTime(nit.memoDate).dateOnly}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-normal">
                        <Link
                          href={`/admindashboard/manage-tender/addtechnicaldetails/${work.id}`}
                        >
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 whitespace-nowrap shadow-sm transition-all"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Add Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {nitdetails.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-96 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <AlertCircle className="h-16 w-16 text-muted-foreground/40" />
                        <div className="space-y-1">
                          <h2 className="text-xl font-semibold text-gray-900">
                            No NITs for Technical Evaluation
                          </h2>
                          <p className="text-sm text-muted-foreground max-w-md">
                            There are currently no NITs ready for technical
                            evaluation. New submissions will appear here once
                            they reach this stage.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicalEvaluationPage;
