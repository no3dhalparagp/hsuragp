import { db } from "@/lib/db";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { FileText } from "lucide-react";
import { FinancialYearFilter } from "@/components/FinancialYearFilter";
import { getFinancialYearDateRange } from "@/utils/financialYear";

interface PaymentCertificatePageProps {
  searchParams: { financialYear?: string; search?: string };
}

async function getPaymentDetails(financialYear?: string) {
  let whereClause: any = {
    paymentDetails: { some: {} },
  };

  // Add financial year filter if provided
  if (financialYear) {
    const { financialYearStart, financialYearEnd } =
      getFinancialYearDateRange(financialYear);
    whereClause.nitDetails = {
      memoDate: {
        gte: financialYearStart,
        lte: financialYearEnd,
      },
    };
  }

  return await db.worksDetail.findMany({
    where: whereClause,
    include: {
      nitDetails: true,
      biddingAgencies: true,
      paymentDetails: {
        include: {
          lessIncomeTax: true,
          lessLabourWelfareCess: true,
          lessTdsCgst: true,
          lessTdsSgst: true,
          securityDeposit: true,
        },
      },
      ApprovedActionPlanDetails: true,
      AwardofContract: {
        include: {
          workorderdetails: {
            include: {
              Bidagency: {
                include: {
                  agencydetails: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      nitDetails: {
        memoNumber: "asc",
      },
    },
  });
}

export default async function PaymentCertificatePage({
  searchParams,
}: PaymentCertificatePageProps) {
  const { financialYear } = searchParams;
  const paymentdetails = await getPaymentDetails(financialYear);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold text-primary">
          Payment Certificate Management
        </h1>
        <FinancialYearFilter />
      </div>
      <Card className="shadow-lg border-t-4 border-primary">
        <CardHeader className="bg-gradient-to-r from-primary to-primary-dark">
          <CardTitle className="text-2xl font-semibold text-white flex items-center">
            <FileText className="mr-2" />
            Payment Certificates - Filtered by Financial Year
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={paymentdetails} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
