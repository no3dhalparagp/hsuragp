import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import PrintWarishForm from "@/components/PrintTemplet/printWarishForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatDate } from "@/utils/utils";

const WarishApplicationsPage = async () => {
  const cuser = await currentUser();
  if (!cuser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Please log in to view your applications.
        </p>
      </div>
    );
  }

  const warishApplications = await db.warishApplication.findMany({
    where: { userId: cuser.id },
    include: {
      warishDetails: { include: { children: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const transformedApplications = warishApplications.map((application) => ({
    ...application,
    warishDetails: application.warishDetails.map((detail) => ({
      ...detail,
      children: detail.children || [],
    })),
  }));

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Warish Applications
        </h1>
        <p className="text-lg text-gray-600">
          {transformedApplications.length === 0
            ? "No submitted applications"
            : `Showing ${transformedApplications.length} application${
                transformedApplications.length > 1 ? "s" : ""
              }`}
        </p>
      </div>

      {transformedApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-xl font-medium text-gray-500">
            No applications found
          </p>
          <p className="mt-2 text-gray-500">
            Get started by submitting a new warish application
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border shadow-sm">
          <Table className="min-w-[1000px]">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[160px]">Ack. Number</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Deceased</TableHead>
                <TableHead>Death Date</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transformedApplications.map((application) => (
                <TableRow
                  key={application.id}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <TableCell className="font-medium text-gray-900">
                    {application.acknowlegment}
                  </TableCell>
                  <TableCell>{application.applicantName}</TableCell>
                  <TableCell>{application.nameOfDeceased}</TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(application.dateOfDeath)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(application.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        application.warishApplicationStatus === "approved"
                          ? "success"
                          : application.warishApplicationStatus === "rejected"
                          ? "destructive"
                          : "default"
                      }
                      className="capitalize"
                    >
                      {application.warishApplicationStatus.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {application.warishApplicationStatus === "submitted" && (
                      <PrintWarishForm warishform={application} />
                    )}
                    {application.warishApplicationStatus === "approved" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                            >
                              Collect Certificate
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Please visit your GP office to collect the
                              certificate
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Office hours: 10:00 AM - 5:00 PM
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {application.warishApplicationStatus === "rejected" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              View Reason
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {application.adminNoteRemark ||
                                "Incomplete or invalid documentation"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Please contact GP office for more details
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default WarishApplicationsPage;
