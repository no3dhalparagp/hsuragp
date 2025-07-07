import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { db } from "@/lib/db";
import { FileText } from "lucide-react";
import { FinancialYearFilter } from "@/components/FinancialYearFilter";
import { getFinancialYearDateRange } from "@/utils/financialYear";

interface WorkOrderPageProps {
  searchParams: { financialYear?: string; search?: string };
}

const WorkOrderPage = async ({ searchParams }: WorkOrderPageProps) => {
  const { financialYear } = searchParams;

  let whereClause: any = {
    Bidagency: {
      WorksDetail: {
        nitDetails: {
          isSupply: false,
        },
      },
    },
  };

  // Add financial year filter if provided
  if (financialYear) {
    const { financialYearStart, financialYearEnd } = getFinancialYearDateRange(financialYear);
    whereClause.Bidagency = {
      ...whereClause.Bidagency,
      WorksDetail: {
        ...whereClause.Bidagency.WorksDetail,
        nitDetails: {
          ...whereClause.Bidagency.WorksDetail.nitDetails,
          memoDate: {
            gte: financialYearStart,
            lte: financialYearEnd,
          },
        },
      },
    };
  }

  const data = await db.workorderdetails.findMany({
    where: whereClause,
    include: {
      awardofcontractdetails: true,
      Bidagency: {
        include: {
          agencydetails: true,
          WorksDetail: {
            include: {
              ApprovedActionPlanDetails: true,
              nitDetails: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900">Work Orders</h1>
        </div>
        <FinancialYearFilter />
      </div>

      <div className="rounded-lg border bg-card">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default WorkOrderPage;
