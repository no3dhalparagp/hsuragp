import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatDate } from "@/utils/utils";
import { db } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkOrderActions } from "@/components/work-order-actions";
import { WorkOrderStatus } from "@/components/work-order-status";
import { StatusAlert } from "@/components/status-alert";
import { Badge } from "@/components/ui/badge";
import { ShowNitDetails } from "@/components/ShowNitDetails";

export default async function AwardOfContractPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const allWorkOrders = await db.workorderdetails.findMany({
    where: {
      Bidagency: {
        WorksDetail: {
          workStatus: {
            in: ["workorder", "yettostart"], // Corrected syntax
          },
        },
      },
    },
    include: {
      awardofcontractdetails: true,
      Bidagency: {
        include: {
          WorksDetail: {
            include: {
              nitDetails: true,
            },
          },
          agencydetails: true,
        },
      },
    },
  });

  const notDelivered = allWorkOrders.filter(
    (order) => !order.awardofcontractdetails.isdelivery
  );
  const delivered = allWorkOrders.filter(
    (order) => order.awardofcontractdetails?.isdelivery
  );

  const successMessage = searchParams.success;
  const errorMessage = searchParams.error;

  const renderTableRow = (
    order: (typeof allWorkOrders)[0],
    index: number,
    isDelivered: boolean
  ) => (
    <TableRow key={order.id} className="hover:bg-gray-50 group">
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell className="font-medium text-blue-600">
        <ShowNitDetails
          nitdetails={order.Bidagency?.WorksDetail?.nitDetails.memoNumber || 0}
          memoDate={
            order.Bidagency?.WorksDetail?.nitDetails.memoDate || new Date()
          }
          workslno={order.Bidagency?.WorksDetail?.workslno || 0}
        />
      </TableCell>
      <TableCell className="font-medium text-blue-600">
        {order.awardofcontractdetails?.workodermenonumber}/DGP/
        {order.awardofcontractdetails?.workordeermemodate.getFullYear()}
      </TableCell>
      <TableCell>
        {formatDate(order.awardofcontractdetails?.workordeermemodate)}
      </TableCell>
      <TableCell>
        {order.awardofcontractdetails.deliveryDate
          ? formatDate(order.awardofcontractdetails.deliveryDate)
          : "-"}
      </TableCell>
      <TableCell className="max-w-[200px] truncate">
        {order.Bidagency?.agencydetails?.name}
      </TableCell>
      <TableCell>
        <WorkOrderStatus isDelivered={isDelivered} />
      </TableCell>
      <TableCell>
        <WorkOrderActions workOrderId={order.id} isDelivered={isDelivered} />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Contract Awards Management
        </h1>
        <p className="text-gray-600">
          Manage work orders and track delivery status
        </p>
      </div>

      {successMessage && (
        <StatusAlert
          type="success"
          message={decodeURIComponent(successMessage as string)}
        />
      )}
      {errorMessage && (
        <StatusAlert
          type="error"
          message={decodeURIComponent(errorMessage as string)}
        />
      )}

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Work Orders
            </CardTitle>
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search work orders..."
                className="pl-10 h-11 rounded-lg focus-visible:ring-2 bg-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="notdelivered">
            <TabsList className="w-full rounded-none border-b bg-gray-50">
              <TabsTrigger
                value="notdelivered"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-6 py-4"
              >
                Pending Delivery
                <Badge variant="secondary" className="ml-2 px-2 py-0.5">
                  {notDelivered.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="delivered"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-6 py-4"
              >
                Completed Deliveries
                <Badge variant="secondary" className="ml-2 px-2 py-0.5">
                  {delivered.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notdelivered" className="m-0">
              <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      {[
                        "Sl No",
                        "Nit No",
                        "Work Order No",
                        "Date",
                        "Received Date",
                        "Agency",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <TableHead
                          key={header}
                          className="py-4 font-semibold text-gray-700"
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notDelivered.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-6 text-gray-500"
                        >
                          No pending work orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      notDelivered.map((order, i) =>
                        renderTableRow(order, i, false)
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="delivered" className="m-0">
              <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      {[
                        "Sl No",
                        "Nit No",
                        "Work Order No",
                        "Date",
                        "Received Date",
                        "Agency",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <TableHead
                          key={header}
                          className="py-4 font-semibold text-gray-700"
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {delivered.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-6 text-gray-500"
                        >
                          No completed deliveries found
                        </TableCell>
                      </TableRow>
                    ) : (
                      delivered.map((order, i) =>
                        renderTableRow(order, i, true)
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
