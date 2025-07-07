"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Loader2, Truck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createBooking } from "@/action/bookings";
import { ServiceType } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { getServiceFee } from "@/action/service-fee";
import { formatDate } from "@/utils/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface BookingFormData {
  serviceType: ServiceType;
  name: string;
  address: string;
  phone: string;
  bookingDate: Date | undefined;
  amount: number;
}

export default function TankerBookingForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: "WATER_TANKER",
    name: "",
    address: "",
    phone: "",
    bookingDate: undefined,
    amount: 0,
  });
  const [isPending, startTransition] = useTransition();
  const [disabledDates, setDisabledDates] = useState<DateRange[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  // Set initial booking date from URL query parameter
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      try {
        const parsedDate = new Date(dateParam);
        if (!isNaN(parsedDate.getTime())) {
          setFormData(prev => ({ ...prev, bookingDate: parsedDate }));
        }
      } catch (error) {
        console.error("Invalid date parameter:", error);
      }
    }
  }, [searchParams]);

  // Fetch initial service fee
  useEffect(() => {
    const fetchInitialFee = async () => {
      try {
        const { success, data } = await getServiceFee(formData.serviceType);
        if (success && data?.amount) {
          setFormData(prev => ({ ...prev, amount: data.amount }));
        }
      } catch (error) {
        console.error("Error fetching initial service fee:", error);
      }
    };

    fetchInitialFee();
  }, []);

  const handleServiceTypeChange = async (value: ServiceType) => {
    setFormData(prev => ({
      ...prev,
      serviceType: value,
      amount: 0,
    }));

    try {
      const { success, data } = await getServiceFee(value);
      if (success && data?.amount) {
        setFormData(prev => ({ ...prev, amount: data.amount }));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch service fee",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bookingDate) {
      toast({
        title: "Error",
        description: "Please select a booking date",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await createBooking({
          ...formData,
          bookingDate: formData.bookingDate!,
        });

        if (result.success) {
          toast({
            title: "Booking successful!",
            description: `Your ${formData.serviceType
              .toLowerCase()
              .replace("_", " ")} has been booked for ${format(
              formData.bookingDate!,
              "PPP"
            )}`,
          });
          router.refresh();
        } else {
          toast({
            title: "Booking failed",
            description: result.error || "Please try again later",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Booking failed",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Tanker Booking
        </CardTitle>
        <CardDescription>
          Schedule your water tanker or dustbin van service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={formData.serviceType}
                onValueChange={handleServiceTypeChange}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WATER_TANKER">Water Tanker</SelectItem>
                  <SelectItem value="DUSTBIN_VAN">Dustbin Van</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-lg font-semibold">
                Service Fee (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount: Number(e.target.value) || 0,
                  }))
                }
                required
                disabled={true}
                className="text-xl font-bold text-primary bg-primary/5 border-primary/20 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your full name"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Enter 10-digit number"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Enter your complete address"
              rows={3}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Booking Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.bookingDate && "text-muted-foreground"
                  )}
                  disabled={isPending}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.bookingDate ? (
                    formatDate(formData.bookingDate)
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.bookingDate}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, bookingDate: date }))
                  }
                  disabled={(date) =>
                    date < new Date() ||
                    date < new Date("1900-01-01") ||
                    disabledDates.some(
                      (range) => date >= range.from! && date <= range.to!
                    )
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !formData.bookingDate}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Processing..." : "Book Service"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
