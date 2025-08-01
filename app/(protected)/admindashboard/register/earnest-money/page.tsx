import { db } from "@/lib/db";
import { formatDate } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";

const page = async () => {
  const emdList = await db.earnestMoneyRegister.findMany({
    include: {
      bidderName: {
        include: {
          WorksDetail: {
            include: {
              nitDetails: true,
              biddingAgencies: {
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
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Earnest Money Register</h1>
          <p className="text-gray-600 mt-1">
            Manage earnest money payments and statuses
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button asChild className="gap-2">
            <Link href="/admindashboard/register/earnest-money/new">
              <Plus className="h-4 w-4" />
              Add New
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="border border-gray-200">
          <CardHeader className="py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg">Filters</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Payment Status</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="forfeited">Forfeited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date Range</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <CardTitle>Earnest Money List</CardTitle>
              <p className="text-sm text-gray-600 mt-1 md:mt-0">
                Showing {emdList.length} records
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">NIT Number</TableHead>
                    <TableHead className="font-semibold text-gray-700">Agency Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">EMD Amount</TableHead>
                    <TableHead className="font-semibold text-gray-700">Payment Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Payment Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emdList.map((emd) => {
                    const agencyDetails =
                      emd.bidderName?.WorksDetail?.biddingAgencies[0]
                        ?.agencydetails;
                    const nitDetails = emd.bidderName?.WorksDetail?.nitDetails;

                    return (
                      <TableRow key={emd.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {nitDetails?.memoNumber || "N/A"}
                        </TableCell>
                        <TableCell>
                          {agencyDetails?.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          ₹{emd.earnestMoneyAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="capitalize"
                            variant={
                              emd.paymentstatus === "paid"
                                ? "success"
                                : emd.paymentstatus === "pending"
                                ? "warning"
                                : "destructive"
                            }
                          >
                            {emd.paymentstatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {emd.paymentDate
                            ? formatDate(emd.paymentDate)
                            : "Not Paid"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="link" size="sm" className="text-blue-600" asChild>
                            <Link
                              href={`/admindashboard/register/earnest-money/payment/${emd.id}`}
                            >
                              View Details
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
