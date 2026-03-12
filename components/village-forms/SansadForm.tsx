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
import { Calendar, Users } from "lucide-react";
import { sansadSchema } from "@/schema/village-validation";
import { useEffect } from "react";

type SansadFormValues = z.infer<typeof sansadSchema>;

interface SansadFormProps {
  onSubmit: (values: SansadFormValues) => Promise<void>;
  defaultValues?: Partial<SansadFormValues>;
  isSubmitting?: boolean;
  financialYear?: string;
  onFinancialYearChange?: (value: string) => void;
  isEditing?: boolean;
}

export function SansadForm({
  onSubmit,
  defaultValues,
  isSubmitting,
  financialYear,
  onFinancialYearChange,
  isEditing = false,
}: SansadFormProps) {
  const form = useForm<SansadFormValues>({
    resolver: zodResolver(sansadSchema),
    defaultValues: {
      financialYear: financialYear ?? "2024-25",
      sansadname: "",
      sansadnumber: "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="financialYear"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
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
                  <SelectTrigger className="bg-white">
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
          name="sansadname"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Sansad Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Sansad I"
                  className="bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sansadnumber"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Sansad Number
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., 01"
                  className="bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
        >
          {isSubmitting ? "Adding..." : "Add Sansad Record"}
        </Button>
      </form>
    </Form>
  );
}
