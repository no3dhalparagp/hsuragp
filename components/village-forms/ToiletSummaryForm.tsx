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
  Home,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";
import { toiletSummarySchema } from "@/schema/village-validation";
import { useEffect } from "react";

type ToiletSummaryFormValues = z.infer<typeof toiletSummarySchema>;

interface ToiletSummaryFormProps {
  onSubmit: (values: ToiletSummaryFormValues) => Promise<void>;
  mouzas: any[];
  defaultValues?: Partial<ToiletSummaryFormValues>;
  isSubmitting?: boolean;
  financialYear?: string;
  onFinancialYearChange?: (value: string) => void;
  onMouzaChange?: (value: string) => void;
  isEditing?: boolean;
}

export function ToiletSummaryForm({
  onSubmit,
  mouzas,
  defaultValues,
  isSubmitting,
  financialYear,
  onFinancialYearChange,
  onMouzaChange,
  isEditing = false,
}: ToiletSummaryFormProps) {
  const form = useForm<ToiletSummaryFormValues>({
    resolver: zodResolver(toiletSummarySchema),
    defaultValues: {
      financialYear: financialYear ?? "2024-25",
      mouzaId: "",
      totalHousehold: 0,
      toiletAvailable: 0,
      toiletNotAvailable: 0,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white rounded-2xl border border-rose-100 shadow-sm">
          <FormField
            control={form.control}
            name="financialYear"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-rose-500" />
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
                    <SelectTrigger className="h-12 border-rose-100 focus:ring-rose-500">
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
                  <MapPin className="h-4 w-4 text-rose-500" />
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
                    <SelectTrigger className="h-12 border-rose-100 focus:ring-rose-500">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="totalHousehold"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border-2 border-gray-100 space-y-4 hover:border-rose-200 transition-all group">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-rose-100 transition-colors">
                    <Home className="h-5 w-5 text-gray-600 group-hover:text-rose-600" />
                  </div>
                  <FormLabel className="font-bold text-gray-700">
                    Total Households
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-14 text-2xl font-bold border-none bg-gray-50 focus:bg-white transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toiletAvailable"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border-2 border-gray-100 space-y-4 hover:border-emerald-200 transition-all group">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <CheckCircle2 className="h-5 w-5 text-gray-600 group-hover:text-emerald-600" />
                  </div>
                  <FormLabel className="font-bold text-gray-700">
                    Toilet Available
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-14 text-2xl font-bold border-none bg-gray-50 focus:bg-white transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toiletNotAvailable"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border-2 border-gray-100 space-y-4 hover:border-amber-200 transition-all group">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-amber-100 transition-colors">
                    <XCircle className="h-5 w-5 text-gray-600 group-hover:text-amber-600" />
                  </div>
                  <FormLabel className="font-bold text-gray-700">
                    Toilet Not Available
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-14 text-2xl font-bold border-none bg-gray-50 focus:bg-white transition-all"
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
          className="w-full bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all font-bold h-14 text-lg"
        >
          {isSubmitting ? "Saving..." : "Save Sanitation Record"}
        </Button>
      </form>
    </Form>
  );
}
