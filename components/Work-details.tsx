import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  FileTextIcon,
  HashIcon,
  BriefcaseIcon,
  Building2,
  FileCheck,
  Clock,
} from "lucide-react";
import { db } from "@/lib/db";

export const ShowWorkDetails = async ({
  worksDetailId,
}: {
  worksDetailId: string;
}) => {
  const workdetails = await db.worksDetail.findUnique({
    where: { id: worksDetailId },
    include: {
      ApprovedActionPlanDetails: { select: { activityDescription: true } },
      nitDetails: true,
    },
  });

  if (!workdetails) {
    return (
      <Card className="w-full mx-auto">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <FileCheck className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Work details not found</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);

  return (
    <Card className="w-full  mx-auto border shadow-sm">
      <CardHeader className="bg-blue-800 p-3 rounded-t">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-white flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            <span>Work Details</span>
          </CardTitle>
          <div className="p-1 bg-white/20 rounded">
            <FileCheck className="h-4 w-4 text-white" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-3">
        {/* NIT Details */}
        <div className="flex items-start gap-2">
          <div className="p-1.5 bg-blue-100 rounded mt-0.5">
            <FileTextIcon className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">NIT Number</p>
            <p className="text-sm font-medium">
              {workdetails.nitDetails.memoNumber}/DGP/
              {workdetails.nitDetails.memoDate.getFullYear()}
            </p>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <CalendarIcon className="h-3 w-3" />
              {formatDate(workdetails.nitDetails.memoDate)}
            </div>
          </div>
        </div>

        {/* Work Serial */}
        <div className="flex items-start gap-2">
          <div className="p-1.5 bg-green-100 rounded mt-0.5">
            <HashIcon className="h-3.5 w-3.5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Work Serial</p>
            <p className="text-sm font-medium">{workdetails.workslno}</p>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Clock className="h-3 w-3" />
              Status: {workdetails.tenderStatus}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="pt-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-purple-100 rounded">
              <BriefcaseIcon className="h-3.5 w-3.5 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500">Description</p>
          </div>
          <p className="text-xs bg-gray-50 rounded p-2 border border-gray-100">
            {workdetails.ApprovedActionPlanDetails.activityDescription ||
              "No description available"}
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center pt-1">
          <Badge
            variant="outline"
            className={`text-xs px-2 py-0.5 ${
              workdetails.tenderStatus === "AOC"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-orange-50 text-orange-700 border-orange-200"
            }`}
          >
            Status: {workdetails.tenderStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
