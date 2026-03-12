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
  Droplets,
  Waves,
  Filter,
  LifeBuoy,
  Plus,
} from "lucide-react";
import { waterSummarySchema } from "@/schema/village-validation";
import { useEffect } from "react";

type WaterSummaryFormValues = z.infer<typeof waterSummarySchema>;

interface WaterSummaryFormProps {
  onSubmit: (values: WaterSummaryFormValues) => Promise<void>;
  mouzas: any[];
  defaultValues?: Partial<WaterSummaryFormValues>;
  isSubmitting?: boolean;
  financialYear?: string;
  onFinancialYearChange?: (value: string) => void;
  onMouzaChange?: (value: string) => void;
  isEditing?: boolean;
}

export function WaterSummaryForm({
  onSubmit,
  mouzas,
  defaultValues,
  isSubmitting,
  financialYear,
  onFinancialYearChange,
  onMouzaChange,
  isEditing = false,
}: WaterSummaryFormProps) {
  const form = useForm<WaterSummaryFormValues>({
    resolver: zodResolver(waterSummarySchema),
    defaultValues: {
      financialYear: financialYear ?? "2024-25",
      mouzaId: "",
      tapWater: 0,
      handPump: 0,
      well: 0,
      pond: 0,
      other: 0,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-sky-50/20 rounded-2xl border border-sky-100 shadow-sm">
          <FormField
            control={form.control}
            name="financialYear"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-sky-500" />
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
                    <SelectTrigger className="h-12 bg-white border-sky-100 focus:ring-sky-500">
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
                  <MapPin className="h-4 w-4 text-sky-500" />
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
                    <SelectTrigger className="h-12 bg-white border-sky-100 focus:ring-sky-500">
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
            name="tapWater"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border border-gray-100 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-gray-700">
                    Tap Water
                  </FormLabel>
                  <Waves className="h-5 w-5 text-sky-400" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-12 text-xl font-bold bg-sky-50/30 border-none"
                  />
                </FormControl>
                <p className="text-xs text-gray-400">
                  Total households with tap connection
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="handPump"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border border-gray-100 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-gray-700">
                    Hand Pump
                  </FormLabel>
                  <Filter className="h-5 w-5 text-sky-400" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-12 text-xl font-bold bg-sky-50/30 border-none"
                  />
                </FormControl>
                <p className="text-xs text-gray-400">
                  Total households using hand pumps
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="well"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border border-gray-100 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-gray-700">
                    Open Well
                  </FormLabel>
                  <LifeBuoy className="h-5 w-5 text-sky-400" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-12 text-xl font-bold bg-sky-50/30 border-none"
                  />
                </FormControl>
                <p className="text-xs text-gray-400">
                  Total households using wells
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pond"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border border-gray-100 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-gray-700">
                    Pond / Natural
                  </FormLabel>
                  <Droplets className="h-5 w-5 text-sky-400" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-12 text-xl font-bold bg-sky-50/30 border-none"
                  />
                </FormControl>
                <p className="text-xs text-gray-400">
                  Households using ponds or rivers
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="other"
            render={({ field }) => (
              <FormItem className="p-6 bg-white rounded-xl border border-gray-100 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-gray-700">
                    Other Sources
                  </FormLabel>
                  <Plus className="h-5 w-5 text-sky-400" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-12 text-xl font-bold bg-sky-50/30 border-none"
                  />
                </FormControl>
                <p className="text-xs text-gray-400">
                  Other miscellaneous sources
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-md transition-all font-bold h-14 text-lg"
        >
          {isSubmitting ? "Saving..." : "Save Water Supply Record"}
        </Button>
      </form>
    </Form>
  );
}
