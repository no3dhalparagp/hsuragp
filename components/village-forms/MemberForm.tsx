"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Calendar,
  Mail,
  Phone,
  CreditCard,
  BookOpen,
  Briefcase,
  MapPin,
} from "lucide-react";
import { memberSchema } from "@/schema/village-validation";
import { useEffect } from "react";

type MemberFormValues = z.infer<typeof memberSchema>;

interface MemberFormProps {
  onSubmit: (values: MemberFormValues) => Promise<void>;
  defaultValues?: Partial<MemberFormValues>;
  isSubmitting?: boolean;
  financialYear?: string;
  onFinancialYearChange?: (value: string) => void;
  isEditing?: boolean;
}

export function MemberForm({
  onSubmit,
  defaultValues,
  isSubmitting,
  financialYear,
  onFinancialYearChange,
  isEditing = false,
}: MemberFormProps) {
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      financialYear: financialYear ?? "2024-25",
      salutation: "",
      firstName: "",
      lastName: "",
      dob: "",
      gender: "",
      religion: "",
      aadhar: "",
      email: "",
      contactNo: "",
      eduQualification: "",
      profession: "",
      address: "",
      village: "",
      pin: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-purple-50/30 rounded-xl border border-purple-100">
          <FormField
            control={form.control}
            name="financialYear"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span>Financial Year</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onFinancialYearChange?.(value);
                  }}
                  defaultValue={field.value}
                  disabled={isEditing}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white w-[200px]">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="2023-24">2023-24</SelectItem>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2025-26">2025-26</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-bold text-gray-700 border-b pb-2">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salutation"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Salutation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Religion</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-bold text-gray-700 border-b pb-2">
              Identification & Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="aadhar"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center space-x-2 text-gray-700 font-medium">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span>Aadhar Number</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" maxLength={12} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center space-x-2 text-gray-700 font-medium">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>Email Address</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNo"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center space-x-2 text-gray-700 font-medium">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>Contact Number</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eduQualification"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center space-x-2 text-gray-700 font-medium">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span>Education</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem className="space-y-2 lg:col-span-2">
                    <FormLabel className="flex items-center space-x-2 text-gray-700 font-medium">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span>Profession</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <h3 className="font-bold text-gray-700 border-b pb-2">
              Address Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="space-y-2 md:col-span-2">
                    <FormLabel className="text-gray-700 font-medium">
                      Full Address
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="village"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-700 font-medium">
                      Village
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center space-x-2 text-gray-700 font-medium">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>PIN Code</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" maxLength={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-12 h-12 shadow-lg transition-all"
        >
          {isSubmitting ? "Registering..." : "Complete Registration"}
        </Button>
      </form>
    </Form>
  );
}
