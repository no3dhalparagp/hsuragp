import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InfoIcon } from "lucide-react";
import { updateWorkStatus } from "@/action/updateWorkStatus";
import { formatDate } from "@/utils/utils";
import { ShowNitDetails } from "@/components/ShowNitDetails";
import WorkStatusForm from "@/components/WorkStatusForm"; // New component

const WorkStatusChangePage = async () => {
  const workList = await db.worksDetail.findMany({
    where: {
      workStatus: {
        not: "billpaid",
      },
      tenderStatus: {
        not: "Cancelled",
      },
    },
    include: {
      nitDetails: true,
      ApprovedActionPlanDetails: true,
    },
  });

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Work Status Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Update and track work status through NIT numbers
          </p>
        </div>
        <Badge variant="secondary" className="px-4 py-2 text-base">
          Total Works: {workList.length}
        </Badge>
      </div>

      {workList.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <div className="flex flex-col items-center justify-center gap-4">
            <InfoIcon className="h-16 w-16 text-gray-400/80" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                No works found
              </h3>
              <p className="text-sm text-gray-500">
                All works have been completed or cancelled
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Card className="rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/80">
                <TableRow>
                  <TableHead className="w-[60px] text-gray-600 font-semibold">
                    SL No
                  </TableHead>
                  <TableHead className="text-gray-600 font-semibold">
                    NIT No
                  </TableHead>
                  <TableHead className="text-gray-600 font-semibold">
                    Work Name
                  </TableHead>
                  <TableHead className="text-gray-600 font-semibold">
                    Commencement Date
                  </TableHead>
                  <TableHead className="text-gray-600 font-semibold">
                    Completion Date
                  </TableHead>
                  <TableHead className="text-gray-600 font-semibold">
                    Work Status
                  </TableHead>
                  <TableHead className="text-right text-gray-600 font-semibold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workList.map((work, index) => (
                  <TableRow
                    key={work.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-600">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      <ShowNitDetails
                        nitdetails={work.nitDetails.memoNumber}
                        memoDate={work.nitDetails.memoDate}
                        workslno={work.workslno}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {work.ApprovedActionPlanDetails.activityDescription}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {work.workCommencementDate
                        ? formatDate(work.workCommencementDate)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {work.completionDate
                        ? formatDate(work.completionDate)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`px-3 py-1.5 ${getStatusColor(
                          work.workStatus
                        )}`}
                      >
                        {formatStatusLabel(work.workStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {work.workStatus !== "workcompleted" &&
                      work.workStatus !== "billpaid" ? (
                        <WorkStatusForm
                          work={work}
                          updateWorkStatus={updateWorkStatus}
                        />
                      ) : (
                        <Badge variant="secondary" className="ml-auto">
                          Completed
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

// Status styling functions
function getStatusColor(status: string) {
  switch (status) {
    case "yettostart":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "workinprogress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "workcompleted":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "billpaid":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

function formatStatusLabel(status: string) {
  return status
    .split(/(?=[A-Z])/)
    .join(" ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default WorkStatusChangePage;
