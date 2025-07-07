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
    where: {
      id: worksDetailId,
    },
    include: {
      ApprovedActionPlanDetails: {
        select: {
          activityDescription: true,
        },
      },
      nitDetails: true,
    },
  });

  if (!workdetails) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-lg border-0">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <FileCheck className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg text-gray-500">Work details not found</p>
            <p className="text-sm text-gray-400 mt-2">
              Please check the work ID and try again
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-t-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-200" />
              <span>Work Details</span>
            </CardTitle>
            <p className="text-blue-200/90 mt-1 font-medium">Comprehensive work overview</p>
          </div>
          <div className="p-3 bg-white/20 rounded-lg shadow-sm">
            <FileCheck className="h-7 w-7 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* NIT and Work Number Section */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="border-l-4 border-blue-500 bg-white p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-700">NIT Details</h3>
            </div>
            <div className="space-y-1.5">
              <p className="text-xl font-semibold text-gray-900">
                {workdetails.nitDetails.memoNumber}/DGP/
                {workdetails.nitDetails.memoDate.getFullYear()}
              </p>
              <div className="flex items-center gap-2 text-gray-500">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <p className="text-sm">
                  {formatDate(workdetails.nitDetails.memoDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-green-500 bg-white p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <HashIcon className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-700">Work Serial</h3>
            </div>
            <div className="space-y-1.5">
              <p className="text-xl font-semibold text-gray-900">
                {workdetails.workslno}
              </p>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4 text-gray-400" />
                <p className="text-sm">Status: {workdetails.tenderStatus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Work Description Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BriefcaseIcon className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-700">Description</h3>
          </div>
          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              {workdetails.ApprovedActionPlanDetails.activityDescription ||
                "No description available"}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-end">
          <Badge
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              workdetails.tenderStatus === "AOC"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-orange-100 text-orange-800 hover:bg-orange-100"
            }`}
          >
            {workdetails.tenderStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
