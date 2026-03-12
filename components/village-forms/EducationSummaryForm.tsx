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
  MapPin,
  BookOpen,
  School,
  Library,
  Award,
  GraduationCap,
  Plus,
} from "lucide-react";
import { educationSummarySchema } from "@/schema/village-validation";
import { useEffect } from "react";

type EducationSummaryFormValues = z.infer<typeof educationSummarySchema>;

interface EducationSummaryFormProps {
  onSubmit: (values: EducationSummaryFormValues) => Promise<void>;
  mouzas: any[];
  defaultValues?: Partial<EducationSummaryFormValues>;
  isSubmitting?: boolean;
  financialYear?: string;
  onFinancialYearChange?: (value: string) => void;
  onMouzaChange?: (value: string) => void;
  isEditing?: boolean;
}

export function EducationSummaryForm({
  onSubmit,
  mouzas,
  defaultValues,
  isSubmitting,
  financialYear,
  onFinancialYearChange,
  onMouzaChange,
  isEditing = false,
}: EducationSummaryFormProps) {
  const form = useForm<EducationSummaryFormValues>({
    resolver: zodResolver(educationSummarySchema),
    defaultValues: {
      financialYear: financialYear ?? "2024-25",
      mouzaId: "",
      illiterate: 0,
      primary: 0,
      secondary: 0,
      higher: 0,
      graduate: 0,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-indigo-50/20 rounded-2xl border border-indigo-100 shadow-sm">
          <FormField
            control={form.control}
            name="financialYear"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-indigo-500" />
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
                    <SelectTrigger className="h-12 bg-white border-indigo-100 focus:ring-indigo-500">
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

          <FormField
            control={form.control}
            name="mouzaId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  <span>Mouza Selection</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onMouzaChange?.(value);
                  }}
                  value={field.value}
                  disabled={isEditing}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 bg-white border-indigo-100 focus:ring-indigo-500">
                      <SelectValue placeholder="Select Mouza" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mouzas.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="illiterate"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border border-gray-100 space-y-4 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-gray-700">
                    Illiterate
                  </FormLabel>
                  <BookOpen className="h-5 w-5 text-gray-300 group-hover:text-red-400 transition-colors" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-12 text-xl font-bold bg-gray-50/50 border-none focus:bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primary"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border border-gray-100 space-y-4 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-gray-700">
                    Primary Level
                  </FormLabel>
                  <School className="h-5 w-5 text-gray-300 group-hover:text-amber-400 transition-colors" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-12 text-xl font-bold bg-gray-50/50 border-none focus:bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondary"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border border-gray-100 space-y-4 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-gray-700">
                    Secondary Level
                  </FormLabel>
                  <Library className="h-5 w-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-12 text-xl font-bold bg-gray-50/50 border-none focus:bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="higher"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border border-gray-100 space-y-4 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-gray-700">
                    Higher Secondary
                  </FormLabel>
                  <Award className="h-5 w-5 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-12 text-xl font-bold bg-gray-50/50 border-none focus:bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="graduate"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border border-gray-100 space-y-4 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-gray-700">
                    Graduate & Above
                  </FormLabel>
                  <GraduationCap className="h-5 w-5 text-gray-300 group-hover:text-emerald-400 transition-colors" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-12 text-xl font-bold bg-gray-50/50 border-none focus:bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all font-bold h-14 text-lg"
        >
          {isSubmitting ? "Saving..." : "Save Educational Record"}
        </Button>
      </form>
    </Form>
  );
}
