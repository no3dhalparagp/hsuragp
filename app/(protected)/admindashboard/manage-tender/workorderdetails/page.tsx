
import { db } from "@/lib/db";
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
import { Badge } from "@/components/ui/badge";
import { FileTextIcon, AlertCircleIcon } from "lucide-react";

export default async function FinancialWorkDetails() {
  const financialWorkDetails = await db.worksDetail.findMany({
    where: {
      tenderStatus: "FinancialEvaluation",
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
            Financial Evaluation Works
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Works pending acceptance of contract (AOC)
          </p>
        </div>
        <Badge variant="secondary" className="px-4 py-2 text-base">
          Total Works: {financialWorkDetails.length}
        </Badge>
      </div>

      {financialWorkDetails.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <div className="flex flex-col items-center justify-center gap-4">
            <AlertCircleIcon className="h-16 w-16 text-gray-400/80" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                No works in financial evaluation
              </h3>
              <p className="text-sm text-gray-500">
                All works have completed processing or none have reached this stage
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border shadow-sm overflow-hidden">
          <Table className="border-collapse">
            <TableHeader className="bg-gray-50/80 hover:bg-gray-50">
              <TableRow>
                <TableHead className="w-[60px] text-gray-600 font-semibold">
                  #
                </TableHead>
                <TableHead className="min-w-[200px] text-gray-600 font-semibold">
                  NIT Details
                </TableHead>
                <TableHead className="text-gray-600 font-semibold">Status</TableHead>
                <TableHead className="text-gray-600 font-semibold">Activity</TableHead>
                <TableHead className="text-gray-600 font-semibold">Code</TableHead>
                <TableHead className="text-right text-gray-600 font-semibold">
                  Estimated Cost
                </TableHead>
                <TableHead className="text-right text-gray-600 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialWorkDetails.map((item, i) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-600">{i + 1}</TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-900">
                        NIT No. {item.nitDetails.memoNumber}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Work No. {item.workslno}</span>
                        <span className="text-gray-300">•</span>
                        <span>{item.nitDetails.memoDate.getFullYear()}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      Financial Evaluation
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="max-w-[300px]">
                    <p className="truncate text-gray-600">
                      {item.ApprovedActionPlanDetails.activityDescription}
                    </p>
                  </TableCell>
                  
                  <TableCell className="text-gray-600">
                    #{item.ApprovedActionPlanDetails.activityCode}
                  </TableCell>
                  
                  <TableCell className="text-right font-medium text-gray-900">
                    ₹{item.ApprovedActionPlanDetails.estimatedCost.toLocaleString()}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <Link
                      href={`/admindashboard/manage-tender/workorderdetails/${item.id}`}
                      passHref
                    >
                      <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                        <FileTextIcon className="h-4 w-4" />
                        Process AOC
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
