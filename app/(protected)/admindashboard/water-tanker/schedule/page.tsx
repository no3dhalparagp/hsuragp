// app/bookings/page.tsx
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Truck } from "lucide-react";
import { BookingStatusManager } from "./BookingStatusManager";
import { BookingStatus, ServiceType } from "@prisma/client";
import { Receipt } from "@/components/receipt";
import { Separator } from "@/components/ui/separator";

const statusFilters = [
  { value: "ALL", label: "All" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export default async function BookingsPage() {
  const cUser = await currentUser();
  const isAdmin = cUser?.role === "admin";

  const bookings = await db.booking.findMany({
    orderBy: { bookingDate: "desc" },
    select: {
      id: true,
      serviceType: true,
      bookingDate: true,
      status: true,
      amount: true,
      address: true,
      phone: true,
      receiptNumber: true,
      name: true,
      user: { select: { name: true, role: true, id: true } },
    },
  });

  if (!bookings.length) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-muted p-3 rounded-full">
                <Truck className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">No Bookings Found</h2>
                <p className="text-muted-foreground">
                  Create a new booking to get started
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            All Bookings
          </CardTitle>

          <BookingsTabs bookings={bookings} isAdmin={isAdmin} />
        </CardHeader>
      </Card>
    </div>
  );
}

// Client-side component for handling tab state
function BookingsTabs({
  bookings,
  isAdmin,
}: {
  bookings: {
    id: string;
    serviceType: ServiceType;
    bookingDate: Date;
    status: BookingStatus;
    amount: number;
    name: string;
    address: string;
    phone: string;
    receiptNumber: string | null;
    user: { name: string | null; id: string };
  }[];
  isAdmin: boolean;
}) {
  return (
    <Tabs defaultValue="ALL" className="w-full">
      <TabsList className="w-full overflow-x-auto p-1 bg-muted/50">
        {statusFilters
          .filter((filter) => isAdmin || filter.value !== "COMPLETED")
          .map((filter) => (
            <TabsTrigger
              key={filter.value}
              value={filter.value}
              className="data-[state=active]:bg-background"
            >
              {filter.label}
            </TabsTrigger>
          ))}
      </TabsList>

      {statusFilters.map((filter) => (
        <TabsContent key={filter.value} value={filter.value}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Service
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter((booking) =>
                      filter.value === "ALL"
                        ? true
                        : booking.status === filter.value
                    )
                    .map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">
                                {booking.user?.name || "Unknown User"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {booking.phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {format(new Date(booking.bookingDate), "PPP")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(booking.bookingDate), "p")}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="capitalize">
                            {booking.serviceType
                              .toLowerCase()
                              .replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              booking.status === "CONFIRMED"
                                ? "default"
                                : booking.status === "COMPLETED"
                                ? "success"
                                : booking.status === "CANCELLED"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {booking.status.toLowerCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="font-medium">₹{booking.amount}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.receiptNumber || "No receipt"}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <BookingStatusManager
                              bookingId={booking.id}
                              currentStatus={booking.status}
                              isAdmin={isAdmin}
                              userId={booking.user.id}
                            />
                            <Separator orientation="vertical" className="h-6" />
                            <Receipt
                              booking={{
                                id: booking.id,
                                name: booking.user.name || "Unknown User",
                                serviceType: booking.serviceType,
                                bookingDate: booking.bookingDate,
                                amount: booking.amount,
                                status:
                                  booking.status === "COMPLETED"
                                    ? "CONFIRMED"
                                    : booking.status === "CANCELLED"
                                    ? "REJECTED"
                                    : booking.status,
                                address: booking.address,
                                phone: booking.phone,
                                user: booking.user,
                              }}
                              receiptNumber={
                                booking.receiptNumber ||
                                `RCP-${booking.id.slice(-6)}`
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </TabsContent>
      ))}
    </Tabs>
  );
}
