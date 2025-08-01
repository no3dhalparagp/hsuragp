
import React from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { db } from "@/lib/db";
import { FileText, Search } from "lucide-react";
import { FinancialYearFilter } from "@/components/FinancialYearFilter";
import { getFinancialYearDateRange } from "@/utils/financialYear";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WorkOrderPageProps {
  searchParams: { financialYear?: string; search?: string };
}

const WorkOrderPage = async ({ searchParams }: WorkOrderPageProps) => {
  const { financialYear, search } = searchParams;

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

  // Add search filter if provided
  if (search) {
    whereClause.OR = [
      {
        Bidagency: {
          WorksDetail: {
            nitDetails: {
              memoNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      },
      {
        awardofcontractdetails: {
          workodermenonumber: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        Bidagency: {
          agencydetails: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    ];
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
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
              <p className="text-sm text-muted-foreground">
                Manage and track all work orders in one place
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 rounded-lg border border-input w-full md:w-64"
                defaultValue={search}
              />
            </div>
            <FinancialYearFilter />
          </div>
        </div>

        <Card className="rounded-xl shadow-sm border">
          <CardHeader className="py-4 px-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <CardTitle className="text-lg">All Work Orders</CardTitle>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <Badge variant="outline" className="px-3 py-1 bg-muted/50">
                  Total: {data.length}
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  {financialYear || "All Years"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable 
              columns={columns} 
              data={data} 
        
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkOrderPage;
