"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Loader2, Truck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createBooking } from "@/action/bookings";
import { ServiceType } from "@prisma/client";
import { getServiceFee } from "@/action/service-fee";
import { useRouter, useSearchParams } from "next/navigation";
import { getAvailableSlots } from "@/action/availability";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  selectedServices: z
    .array(z.enum(["WATER_TANKER", "DUSTBIN_VAN"]))
    .min(1, "Please select at least one service"),
  name: z
    .string()
    .min(1, "Name is required")
    .trim()
    .refine((val) => val.length > 0, "Name cannot be empty"),
  address: z
    .string()
    .min(1, "Address is required")
    .trim()
    .refine((val) => val.length > 0, "Address cannot be empty"),
  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^[0-9]{10}$/, "Phone number must contain only digits"),
  bookingDate: z.date({
    required_error: "Booking date is required",
    invalid_type_error: "Please select a valid date",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function TankerBookingForm() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedServices: [],
      name: "",
      address: "",
      phone: "",
      bookingDate: undefined,
    },
  });

  const selectedServices = form.watch("selectedServices");
  const bookingDate = form.watch("bookingDate");

  // Set initial booking date from URL
  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      try {
        const parsedDate = new Date(dateParam);
        if (!isNaN(parsedDate.getTime()) && parsedDate >= new Date(new Date().setHours(0, 0, 0, 0))) {
          form.setValue("bookingDate", parsedDate);
        }
      } catch (error) {
        console.error("Invalid date parameter:", error);
      }
    }
  }, [searchParams, form]);

  // Fetch service fees for both services
  const { data: waterTankerFee } = useQuery({
    queryKey: ["serviceFee", "WATER_TANKER"],
    queryFn: () => getServiceFee("WATER_TANKER"),
    refetchOnWindowFocus: false,
  });

  const { data: dustbinVanFee } = useQuery({
    queryKey: ["serviceFee", "DUSTBIN_VAN"],
    queryFn: () => getServiceFee("DUSTBIN_VAN"),
    refetchOnWindowFocus: false,
  });

  // Fetch available slots for selected services
  const { data: waterTankerSlots, isFetching: isFetchingWaterTanker } = useQuery({
    queryKey: ["availableSlots", "WATER_TANKER", bookingDate?.toISOString()],
    queryFn: () => {
      if (!bookingDate) return { success: false, data: 0 };
      return getAvailableSlots("WATER_TANKER", bookingDate);
    },
    refetchOnWindowFocus: false,
    enabled: !!bookingDate && selectedServices.includes("WATER_TANKER"),
  });

  const { data: dustbinVanSlots, isFetching: isFetchingDustbinVan } = useQuery({
    queryKey: ["availableSlots", "DUSTBIN_VAN", bookingDate?.toISOString()],
    queryFn: () => {
      if (!bookingDate) return { success: false, data: 0 };
      return getAvailableSlots("DUSTBIN_VAN", bookingDate);
    },
    refetchOnWindowFocus: false,
    enabled: !!bookingDate && selectedServices.includes("DUSTBIN_VAN"),
  });

  // Calculate total amount
  const totalAmount = useMemo(() => {
    let total = 0;
    if (selectedServices.includes("WATER_TANKER") && waterTankerFee?.success && waterTankerFee.data?.amount) {
      total += waterTankerFee.data.amount;
    }
    if (selectedServices.includes("DUSTBIN_VAN") && dustbinVanFee?.success && dustbinVanFee.data?.amount) {
      total += dustbinVanFee.data.amount;
    }
    return total;
  }, [selectedServices, waterTankerFee, dustbinVanFee]);

  // Check if slots are available for all selected services
  const allSlotsAvailable = useMemo(() => {
    if (!bookingDate || selectedServices.length === 0) return false;
    
    const waterTankerAvailable = !selectedServices.includes("WATER_TANKER") || 
      (waterTankerSlots?.data && waterTankerSlots.data > 0);
    const dustbinVanAvailable = !selectedServices.includes("DUSTBIN_VAN") || 
      (dustbinVanSlots?.data && dustbinVanSlots.data > 0);
    
    return waterTankerAvailable && dustbinVanAvailable;
  }, [bookingDate, selectedServices, waterTankerSlots, dustbinVanSlots]);

  const isFetchingSlots = isFetchingWaterTanker || isFetchingDustbinVan;

  // Booking mutation - creates bookings for all selected services
  const bookingMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const bookings = [];
      const trimmedName = values.name.trim();
      const trimmedAddress = values.address.trim();
      const trimmedPhone = values.phone.trim();

      for (const serviceType of values.selectedServices) {
        let amount = 0;
        if (serviceType === "WATER_TANKER" && waterTankerFee?.success && waterTankerFee.data?.amount) {
          amount = waterTankerFee.data.amount;
        } else if (serviceType === "DUSTBIN_VAN" && dustbinVanFee?.success && dustbinVanFee.data?.amount) {
          amount = dustbinVanFee.data.amount;
        }

        const result = await createBooking({
          serviceType,
          name: trimmedName,
          address: trimmedAddress,
          phone: trimmedPhone,
          bookingDate: values.bookingDate,
          amount,
        });

        if (!result.success) {
          throw new Error(result.error || `Failed to book ${serviceType}`);
        }

        bookings.push(result);
      }

      return { success: true, bookings };
    },
    onSuccess: (result, values) => {
      const serviceNames = values.selectedServices
        .map((s) => s.toLowerCase().replace("_", " "))
        .join(" and ");
      
      toast({
        title: "Booking successful!",
        description: `Your ${serviceNames} service${values.selectedServices.length > 1 ? "s have" : " has"} been booked for ${format(
          values.bookingDate,
          "PPP"
        )}`,
      });
      
      form.reset({
        selectedServices: [],
        name: "",
        address: "",
        phone: "",
        bookingDate: undefined,
      });
      
      router.refresh();
      
    },
    onError: (error) => {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });

  // Form submit handler
  const onSubmit = (values: FormValues) => {
    // Validate and trim all string fields before submission
    const trimmedValues = {
      ...values,
      name: values.name.trim(),
      address: values.address.trim(),
      phone: values.phone.trim(),
    };

    // Additional validation
    if (!trimmedValues.name || trimmedValues.name.length === 0) {
      toast({
        title: "Validation Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    if (trimmedValues.selectedServices.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one service",
        variant: "destructive",
      });
      return;
    }

    if (!trimmedValues.bookingDate) {
      toast({
        title: "Validation Error",
        description: "Please select a booking date",
        variant: "destructive",
      });
      return;
    }

    bookingMutation.mutate(trimmedValues);
  };

  const isPending = bookingMutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Service Booking
        </CardTitle>
        <CardDescription>
          Book water tanker and/or dustbin van service in one click
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Service Selection */}
            <FormField
              control={form.control}
              name="selectedServices"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Select Services</FormLabel>
                    <FormDescription>
                      You can select one or both services
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="selectedServices"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("WATER_TANKER")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, "WATER_TANKER"])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== "WATER_TANKER"
                                        )
                                      );
                                }}
                                disabled={isPending}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none flex-1">
                              <FormLabel className="flex items-center gap-2 cursor-pointer">
                                <Truck className="h-4 w-4 text-blue-600" />
                                Water Tanker
                              </FormLabel>
                              <FormDescription>
                                {waterTankerFee?.success && waterTankerFee.data?.amount ? (
                                  <span className="font-semibold text-primary">
                                    ₹{waterTankerFee.data.amount}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">Loading fee...</span>
                                )}
                              </FormDescription>
                              {bookingDate && selectedServices.includes("WATER_TANKER") && (
                                <div className={cn(
                                  "text-xs font-medium mt-1",
                                  waterTankerSlots?.data && waterTankerSlots.data > 0
                                    ? "text-green-600"
                                    : "text-destructive"
                                )}>
                                  {isFetchingWaterTanker ? (
                                    <span className="flex items-center gap-1">
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      Checking...
                                    </span>
                                  ) : waterTankerSlots?.data && waterTankerSlots.data > 0 ? (
                                    `${waterTankerSlots.data} slot${waterTankerSlots.data > 1 ? "s" : ""} available`
                                  ) : (
                                    "No slots available"
                                  )}
                                </div>
                              )}
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="selectedServices"
                      render={({ field }) => {
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes("DUSTBIN_VAN")}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, "DUSTBIN_VAN"])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== "DUSTBIN_VAN"
                                        )
                                      );
                                }}
                                disabled={isPending}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none flex-1">
                              <FormLabel className="flex items-center gap-2 cursor-pointer">
                                <Trash2 className="h-4 w-4 text-green-600" />
                                Dustbin Van
                              </FormLabel>
                              <FormDescription>
                                {dustbinVanFee?.success && dustbinVanFee.data?.amount ? (
                                  <span className="font-semibold text-primary">
                                    ₹{dustbinVanFee.data.amount}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">Loading fee...</span>
                                )}
                              </FormDescription>
                              {bookingDate && selectedServices.includes("DUSTBIN_VAN") && (
                                <div className={cn(
                                  "text-xs font-medium mt-1",
                                  dustbinVanSlots?.data && dustbinVanSlots.data > 0
                                    ? "text-green-600"
                                    : "text-destructive"
                                )}>
                                  {isFetchingDustbinVan ? (
                                    <span className="flex items-center gap-1">
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      Checking...
                                    </span>
                                  ) : dustbinVanSlots?.data && dustbinVanSlots.data > 0 ? (
                                    `${dustbinVanSlots.data} slot${dustbinVanSlots.data > 1 ? "s" : ""} available`
                                  ) : (
                                    "No slots available"
                                  )}
                                </div>
                              )}
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total Amount Display */}
            {selectedServices.length > 0 && totalAmount > 0 && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
                </div>
                {selectedServices.length > 1 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {selectedServices.map((service, index) => {
                      const fee = service === "WATER_TANKER" 
                        ? waterTankerFee?.data?.amount 
                        : dustbinVanFee?.data?.amount;
                      return fee ? (
                        <div key={service} className="flex justify-between">
                          <span>{service.replace("_", " ")}:</span>
                          <span>₹{fee}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter customer full name"
                        disabled={isPending}
                        onChange={(e) => {
                          const value = e.target.value.trimStart();
                          field.onChange(value);
                        }}
                        onBlur={(e) => {
                          const value = e.target.value.trim();
                          field.onChange(value);
                          form.setValue("name", value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        pattern="[0-9]{10}"
                        placeholder="Enter 10-digit number"
                        disabled={isPending}
                        maxLength={10}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Address</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter complete delivery address"
                      rows={3}
                      disabled={isPending}
                      onChange={(e) => {
                        const value = e.target.value.trimStart();
                        field.onChange(value);
                      }}
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        field.onChange(value);
                        form.setValue("address", value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <FormLabel>Booking Date</FormLabel>
                    {isFetchingSlots && (
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Checking availability...
                      </span>
                    )}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isPending || isFetchingSlots}
                          type="button"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date);
                          }
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={
                isPending || 
                !bookingDate || 
                selectedServices.length === 0 ||
                !allSlotsAvailable ||
                isFetchingSlots
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : selectedServices.length === 0 ? (
                "Please Select at Least One Service"
              ) : !allSlotsAvailable ? (
                "No Slots Available for Selected Services"
              ) : (
                `Book ${selectedServices.length > 1 ? "Services" : "Service"} (₹${totalAmount.toLocaleString()})`
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
