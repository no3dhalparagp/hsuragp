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
import { Calendar, MapPin, Users } from "lucide-react";
import { populationSummarySchema } from "@/schema/village-validation";
import { useEffect } from "react";

type PopulationSummaryFormValues = z.infer<typeof populationSummarySchema>;

interface PopulationSummaryFormProps {
  onSubmit: (values: PopulationSummaryFormValues) => Promise<void>;
  mouzas: any[];
  defaultValues?: Partial<PopulationSummaryFormValues>;
  isSubmitting?: boolean;
  financialYear?: string;
  onFinancialYearChange?: (value: string) => void;
  onMouzaChange?: (value: string) => void;
  isEditing?: boolean;
}

export function PopulationSummaryForm({
  onSubmit,
  mouzas,
  defaultValues,
  isSubmitting,
  financialYear,
  onFinancialYearChange,
  onMouzaChange,
  isEditing = false,
}: PopulationSummaryFormProps) {
  const form = useForm<PopulationSummaryFormValues>({
    resolver: zodResolver(populationSummarySchema),
    defaultValues: {
      financialYear: financialYear ?? "2024-25",
      mouzaId: "",
      totalMale: 0,
      totalFemale: 0,
      scMale: 0,
      scFemale: 0,
      stMale: 0,
      stFemale: 0,
      obcMale: 0,
      obcFemale: 0,
      genMale: 0,
      genFemale: 0,
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-6 lg:col-span-3">
            <div className="flex items-center space-x-2 border-b pb-2">
              <Users className="h-5 w-5 text-gray-400" />
              <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest">
                Aggregate Totals
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="totalMale"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-bold">
                      Total Male Population
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="h-12 text-xl font-bold bg-gray-50/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalFemale"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-bold">
                      Total Female Population
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="h-12 text-xl font-bold bg-gray-50/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {[
            { label: "SC Population", male: "scMale", female: "scFemale" },
            { label: "ST Population", male: "stMale", female: "stFemale" },
            { label: "OBC Population", male: "obcMale", female: "obcFemale" },
            {
              label: "General Population",
              male: "genMale",
              female: "genFemale",
            },
          ].map((cat) => (
            <div
              key={cat.label}
              className="space-y-4 p-5 bg-white rounded-xl border-2 border-gray-50 shadow-sm"
            >
              <h4 className="font-bold text-indigo-600 text-sm border-b pb-2">
                {cat.label}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={cat.male as any}
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs">Male</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="bg-gray-50/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={cat.female as any}
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs">Female</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="bg-gray-50/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
        >
          {isSubmitting ? "Saving..." : "Save Summary Records"}
        </Button>
      </form>
    </Form>
  );
}
