"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { createProdhan } from "@/action/prodhan";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useTransition } from "react";

const formSchema = z.object({
  fname: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lname: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  middlename: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  status: z.enum(["active", "inactive"]).default("active"),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, {
    message: "Must be a valid 10-digit mobile number",
  }),
  joinDate: z.date({
    required_error: "Join date is required",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  villageName: z
    .string()
    .min(2, {
      message: "Village name must be at least 2 characters.",
    })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Village name must contain only letters and spaces",
    }),
  periodOfWork: z.string(),
  periodEndDate: z.date({
    required_error: "Period end date is required",
  }),
  activeprodhanImage: z.instanceof(File).optional(),
});

export function ProdhanForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fname: "",
      lname: "",
      middlename: "",
      gender: "male",
      mobileNumber: "",
      address: "",
      villageName: "",
      periodOfWork: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        await createProdhan(values);
        toast({
          title: "Success",
          description: "Prodhan details saved successfully",
        });
        form.reset();
      } catch (error) {
        console.error("Submission error:", error);
        toast({
          title: "Error",
          description: "Failed to save Prodhan details",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-2xl shadow-xl space-y-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent pb-4 border-b border-gray-200 dark:border-gray-700">
            Prodhan Registration Form
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name Group */}
            <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Personal Information
              </h3>
              <FormField
                control={form.control}
                name="fname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        className="focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="middlename"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Middle Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Michael"
                        {...field}
                        className="focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        className="focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Personal Info Group */}
            <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Contact Details
              </h3>
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        <SelectItem
                          value="male"
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Male
                        </SelectItem>
                        <SelectItem
                          value="female"
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Female
                        </SelectItem>
                        <SelectItem
                          value="other"
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Date of Birth
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal border-gray-300 dark:border-gray-600",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white dark:bg-gray-800"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Mobile Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="9876543210"
                        {...field}
                        className="focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Work Dates Group */}
            <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Work Information
              </h3>
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Join Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal border-gray-300 dark:border-gray-600",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white dark:bg-gray-800"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("2000-01-01")}
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Address and Image Group */}
            <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Location & Image
              </h3>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main Street"
                        {...field}
                        className="focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="villageName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Village Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Green Valley"
                        {...field}
                        className="focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 dark:border-gray-600"
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^A-Za-z\s]/g,
                            ""
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activeprodhanImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Profile Image (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        className="focus-visible:ring-2 focus-visible:ring-blue-500 border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
