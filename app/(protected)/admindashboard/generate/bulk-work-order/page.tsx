import { db } from "@/lib/db";
import { WorkList } from "./WorkList";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { FinancialYearFilter } from "@/components/FinancialYearFilter";
import { getFinancialYearDateRange } from "@/utils/financialYear";
import { fetchWorkDataForBulkWorkOrder } from "@/action/fetchWorkDataForBulkWorkOrder";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Workorderdetails } from "@/types/tender-manage";

// Add metadata for better SEO and page information
export const metadata: Metadata = {
  title: "Generate Work Order Certificates",
  description: "Generate work order certificates for completed works",
};

interface WorkOrderCertificatePageProps {
  searchParams: Promise<{ financialYear?: string; search?: string }>;
}

async function getWorkOrderDetails(
  financialYear?: string
): Promise<Workorderdetails[]> {
  try {
    let whereClause: any = {};
    if (financialYear) {
      const { financialYearStart, financialYearEnd } =
        getFinancialYearDateRange(financialYear);
      whereClause.awardofcontractdetails = {
        workordeermemodate: {
          gte: financialYearStart,
          lte: financialYearEnd,
        },
      };
    }
    return await db.workorderdetails.findMany({
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
      orderBy: {
        awardofcontractdetails: {
          workordeermemodate: "asc",
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch work order details:", error);
    throw new Error(
      "Failed to load work order details. Please try again later."
    );
  }
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-lg font-medium">Loading works...</span>
      </div>
    </div>
  );
}

export default async function WorkOrderCertificatePage({
  searchParams,
}: WorkOrderCertificatePageProps) {
  const resolved = await searchParams;
  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">
            Generate Work Order Certificates
          </h1>
          <p className="text-muted-foreground">
            Select works and generate work order certificates for finished
            projects
          </p>
        </div>
        <FinancialYearFilter />
      </div>

      <Suspense fallback={<LoadingState />}>
        {/* If using a custom error boundary component */}
        <ErrorBoundary
          fallback={
            <div>Failed to load work details. Please try again later.</div>
          }
        >
          <WorkListWrapper searchParams={resolved} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

// Separate async component to handle data fetching
async function WorkListWrapper({
  searchParams,
}: {
  searchParams: { financialYear?: string; search?: string };
}) {
  try {
    const { financialYear } = searchParams;
    const workOrderDetails = await getWorkOrderDetails(financialYear);
    return <WorkList works={workOrderDetails} />;
  } catch (error) {
    return (
      <div className="text-red-500">
        Failed to load work details. Please try again later.
      </div>
    );
  }
}
