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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Earnest Money Register</h1>
        <Button asChild>
          <Link href="/admindashboard/register/earnest-money/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input placeholder="Search by NIT or Agency..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Status</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
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
                <label className="text-sm font-medium">Date Range</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
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

        <Card>
          <CardHeader>
            <CardTitle>Earnest Money List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIT Number</TableHead>
                    <TableHead>Agency Name</TableHead>
                    <TableHead>EMD Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emdList.map((emd) => {
                    const agencyDetails =
                      emd.bidderName?.WorksDetail?.biddingAgencies[0]
                        ?.agencydetails;
                    const nitDetails = emd.bidderName?.WorksDetail?.nitDetails;

                    return (
                      <TableRow key={emd.id}>
                        <TableCell>{nitDetails?.memoNumber}</TableCell>
                        <TableCell>{agencyDetails?.name}</TableCell>
                        <TableCell>₹{emd.earnestMoneyAmount}</TableCell>
                        <TableCell>
                          <Badge
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
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/admindashboard/register/earnest-money/payment/${emd.id}`}
                            >
                              Payment Details
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
