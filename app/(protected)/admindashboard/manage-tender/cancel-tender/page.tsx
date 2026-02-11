import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TenderStatus } from "@prisma/client";
import { updatenitstatus } from "@/action/bookNitNuber";
import { ShowNitDetails } from "@/components/ShowNitDetails";
import { ActiveTendersTable } from "./ActiveTendersTable";
import { CancelledTendersPagination } from "./CancelledTendersPagination";
import { FileX, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
const statusVariants: Record<
  TenderStatus,
  "destructive" | "success" | "warning" | "default"
> = {
  Cancelled: "destructive",
  published: "success",
  ToBeOpened: "warning",
  publish: "success",
  TechnicalBidOpening: "warning",
  TechnicalEvaluation: "warning",
  FinancialBidOpening: "warning",
  FinancialEvaluation: "warning",
  Retender: "warning",
  AOC: "default",
};
async function updateTenderStatus(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const status = formData.get("status") as TenderStatus;

  if (!id || !status) return;

  const updateData: any = { tenderStatus: status };

  if (status === "Cancelled") {
    await updatenitstatus(id, status);
  }

  await db.worksDetail.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admindashboard/manage-tender/cancel-tender");
}

const ITEMS_PER_PAGE = 10;

interface CancelTenderPageProps {
  searchParams: Promise<{ status?: string; cancelledPage?: string }>;
}

const CancelTenderPage = async ({ searchParams }: CancelTenderPageProps) => {
  const { status, cancelledPage } = await searchParams;
  const cancelledCurrentPage = Number(cancelledPage) || 1;
  const cancelledSkip = (cancelledCurrentPage - 1) * ITEMS_PER_PAGE;
  
  // Get status options for filter (exclude Cancelled and AOC from active tenders filter)
  const activeStatusOptions: TenderStatus[] = (Object.keys(
    statusVariants
  ) as TenderStatus[]).filter(
    (s) => s !== "Cancelled" && s !== "AOC"
  );

  // Build where clause for active tenders
  // Always exclude Cancelled and AOC from active tenders
  const activeWhereClause: any = {
      tenderStatus: {
        notIn: ["Cancelled", "AOC"],
      },
  };

  // Apply status filter if provided
  if (status && status !== "all") {
    activeWhereClause.tenderStatus = status;
  }

  // Fetch active tenders
  const activeTenders = await db.worksDetail.findMany({
    where: activeWhereClause,
    include: {
      nitDetails: true,
      ApprovedActionPlanDetails: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch cancelled tenders with pagination
  const [cancelledTenders, cancelledTotal] = await Promise.all([
    db.worksDetail.findMany({
      where: {
        tenderStatus: "Cancelled",
      },
      include: {
        nitDetails: true,
        ApprovedActionPlanDetails: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: cancelledSkip,
      take: ITEMS_PER_PAGE,
    }),
    db.worksDetail.count({
      where: {
        tenderStatus: "Cancelled",
      },
    }),
  ]);

  const cancelledTotalPages = Math.ceil(cancelledTotal / ITEMS_PER_PAGE);

  // Calculate statistics
  const stats = {
    total: activeTenders.length,
    cancelled: cancelledTenders.length,
    byStatus: activeTenders.reduce((acc, tender) => {
      acc[tender.tenderStatus] = (acc[tender.tenderStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tenders</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cancelled Tenders</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.cancelled}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <FileX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {(stats.byStatus["published"] || 0) + (stats.byStatus["publish"] || 0)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Tenders Section */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  Active Tender Management
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and update tender statuses
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ActiveTendersTable
            tenders={activeTenders}
            updateTenderStatus={updateTenderStatus}
          />
        </CardContent>
      </Card>

      {/* Cancelled Tenders Section */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500 flex items-center justify-center">
              <FileX className="h-5 w-5 text-white" />
            </div>
            <div>
          <CardTitle className="text-2xl font-bold text-slate-800">
                Cancelled Tenders
          </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                View all cancelled tender records
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-b-lg">
            <Table>
              <TableCaption className="text-sm text-muted-foreground bg-slate-50 py-3">
                {cancelledTenders.length} cancelled tender{cancelledTenders.length !== 1 ? "s" : ""} found
              </TableCaption>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="min-w-[200px]">NIT Details</TableHead>
                  <TableHead className="min-w-[280px]">Work Description</TableHead>
                  <TableHead className="w-40">Status</TableHead>
                  <TableHead className="min-w-[200px]">Cancelled Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cancelledTenders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <AlertCircle className="h-12 w-12 opacity-50" />
                        <p className="font-medium">No cancelled tenders</p>
                        <p className="text-sm">All tenders are currently active</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  cancelledTenders.map((item, i) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors opacity-90"
                    >
                    <TableCell className="text-center font-medium text-slate-600">
                      {cancelledSkip + i + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      <ShowNitDetails
                        nitdetails={item.nitDetails.memoNumber}
                        memoDate={item.nitDetails.memoDate}
                        workslno={item.workslno}
                      />
                    </TableCell>
                      <TableCell className="max-w-[280px]">
                        <p className="truncate" title={item.ApprovedActionPlanDetails.activityDescription}>
                      {item.ApprovedActionPlanDetails.activityDescription}
                        </p>
                    </TableCell>
                    <TableCell>
                        <Badge variant={statusVariants[item.tenderStatus]} className="font-medium">
                        {item.tenderStatus}
                      </Badge>
                    </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <CancelledTendersPagination
            currentPage={cancelledCurrentPage}
            totalPages={cancelledTotalPages}
            totalItems={cancelledTotal}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CancelTenderPage;
