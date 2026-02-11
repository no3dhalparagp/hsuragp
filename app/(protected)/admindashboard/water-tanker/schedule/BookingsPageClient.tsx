"use client";

import { useState, useMemo } from "react";
import { format, startOfDay, endOfDay, addDays, isAfter, isBefore } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Truck, Download, FileSpreadsheet, CalendarDays, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { BookingStatusManager } from "./BookingStatusManager";
import { BookingStatus, ServiceType } from "@prisma/client";
import { Receipt } from "@/components/receipt";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";
import { toast } from "@/components/ui/use-toast";

const statusFilters = [
  { value: "ALL", label: "All" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

interface Booking {
  id: string;
  serviceType: ServiceType;
  bookingDate: Date;
  status: BookingStatus;
  amount: number;
  address: string;
  phone: string;
  receiptNumber: string | null;
  name: string;
  user: { name: string | null; role: string | null; id: string };
}

interface BookingsPageClientProps {
  bookings: Booking[];
  isAdmin: boolean;
}

export default function BookingsPageClient({ bookings, isAdmin }: BookingsPageClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter bookings based on status, date range, and search
  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    // Filter by status
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((booking) => booking.status === selectedStatus);
    }

    // Filter by date range
    if (dateRange?.from) {
      const fromDate = startOfDay(dateRange.from);
      filtered = filtered.filter((booking) => {
        const bookingDate = startOfDay(new Date(booking.bookingDate));
        return !isBefore(bookingDate, fromDate);
      });
    }
    if (dateRange?.to) {
      const toDate = endOfDay(dateRange.to);
      filtered = filtered.filter((booking) => {
        const bookingDate = startOfDay(new Date(booking.bookingDate));
        return !isAfter(bookingDate, toDate);
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.user?.name?.toLowerCase().includes(query) ||
          booking.phone.includes(query) ||
          booking.address.toLowerCase().includes(query) ||
          booking.receiptNumber?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [bookings, selectedStatus, dateRange, searchQuery]);

  // Get upcoming deliveries (next 7 days)
  const upcomingDeliveries = useMemo(() => {
    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);
    return bookings.filter((booking) => {
      const bookingDate = startOfDay(new Date(booking.bookingDate));
      return (
        (booking.status === "CONFIRMED" || booking.status === "PENDING") &&
        !isBefore(bookingDate, today) &&
        !isAfter(bookingDate, nextWeek)
      );
    });
  }, [bookings]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredBookings.length;
    const confirmed = filteredBookings.filter((b) => b.status === "CONFIRMED").length;
    const pending = filteredBookings.filter((b) => b.status === "PENDING").length;
    const completed = filteredBookings.filter((b) => b.status === "COMPLETED").length;
    const totalAmount = filteredBookings
      .filter((b) => b.status === "COMPLETED" || b.status === "CONFIRMED")
      .reduce((sum, b) => sum + b.amount, 0);

    return { total, confirmed, pending, completed, totalAmount };
  }, [filteredBookings]);

  // Export to Excel
  const exportToExcel = () => {
    try {
      const data = filteredBookings.map((booking) => ({
        "Receipt Number": booking.receiptNumber || "N/A",
        "Customer Name":  booking.name || "N/A",
        "Phone": booking.phone,
        "Address": booking.address,
        "Service Type": booking.serviceType.replace("_", " "),
        "Booking Date": format(new Date(booking.bookingDate), "yyyy-MM-dd"),
        "Booking Time": format(new Date(booking.bookingDate), "HH:mm"),
        "Status": booking.status,
        "Amount (₹)": booking.amount,
        "Payment Status": booking.status === "COMPLETED" ? "Paid" : "Pending",
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Bookings Report");

      // Auto-size columns
      const colWidths = [
        { wch: 15 }, // Receipt Number
        { wch: 20 }, // Customer Name
        { wch: 15 }, // Phone
        { wch: 30 }, // Address
        { wch: 15 }, // Service Type
        { wch: 12 }, // Booking Date
        { wch: 12 }, // Booking Time
        { wch: 12 }, // Status
        { wch: 12 }, // Amount
        { wch: 15 }, // Payment Status
      ];
      ws["!cols"] = colWidths;

      const fileName = `Water_Tanker_Report_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast({
        title: "Export Successful",
        description: `Report exported as ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Export upcoming deliveries
  const exportUpcomingDeliveries = () => {
    try {
      const data = upcomingDeliveries.map((booking) => ({
        "Receipt Number": booking.receiptNumber || "N/A",
        "Customer Name":  booking.name || "N/A",
        "Phone": booking.phone,
        "Address": booking.address,
        "Service Type": booking.serviceType.replace("_", " "),
        "Delivery Date": format(new Date(booking.bookingDate), "yyyy-MM-dd"),
        "Delivery Time": format(new Date(booking.bookingDate), "HH:mm"),
        "Status": booking.status,
        "Amount (₹)": booking.amount,
        "Days Until Delivery": Math.ceil(
          (new Date(booking.bookingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        ),
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Upcoming Deliveries");

      const colWidths = [
        { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 30 },
        { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
        { wch: 12 }, { wch: 18 },
      ];
      ws["!cols"] = colWidths;

      const fileName = `Upcoming_Deliveries_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast({
        title: "Export Successful",
        description: `Upcoming deliveries exported as ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export upcoming deliveries. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Ready for delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Delivered successfully</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From completed bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deliveries Card */}
      {upcomingDeliveries.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  Upcoming Deliveries (Next 7 Days)
                </CardTitle>
                <CardDescription>
                  {upcomingDeliveries.length} delivery{upcomingDeliveries.length !== 1 ? "ies" : ""} scheduled
                </CardDescription>
              </div>
              <Button onClick={exportUpcomingDeliveries} variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingDeliveries
                .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
                .slice(0, 5)
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{ booking.name || "Unknown User"}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.bookingDate), "PPP")} at{" "}
                          {format(new Date(booking.bookingDate), "p")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{booking.serviceType.replace("_", " ")}</Badge>
                      <span className="font-medium">₹{booking.amount}</span>
                    </div>
                  </div>
                ))}
              {upcomingDeliveries.length > 5 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  +{upcomingDeliveries.length - 5} more deliveries
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Bookings Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                All Bookings
              </CardTitle>
              <CardDescription className="mt-1">
                Manage and track all water tanker bookings
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={exportToExcel} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, phone, address, or receipt number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[280px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {dateRange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDateRange(undefined)}
              >
                Clear
              </Button>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
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

            <TabsContent value={selectedStatus} className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Customer
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Date & Time
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
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No bookings found matching your criteria
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <Calendar className="h-5 w-5 text-primary" />
                              </div>
                              <div className="space-y-1">
                                <p className="font-medium">
                                  { booking.name || "Unknown User"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.phone}
                                </p>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {booking.address}
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
                              {booking.serviceType.toLowerCase().replace("_", " ")}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={
                                booking.status === "CONFIRMED"
                                  ? "default"
                                  : booking.status === "COMPLETED"
                                  ? "default"
                                  : booking.status === "CANCELLED"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={
                                booking.status === "COMPLETED"
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : ""
                              }
                            >
                              {booking.status.toLowerCase()}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <p className="font-medium">₹{booking.amount}</p>
                              {booking.receiptNumber && (
                                <p className="text-xs text-muted-foreground">
                                  {booking.receiptNumber}
                                </p>
                              )}
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
                                  name:  booking.name || "Unknown User",
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
                                  booking.receiptNumber || `RCP-${booking.id.slice(-6)}`
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

