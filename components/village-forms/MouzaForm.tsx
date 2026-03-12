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
import { Calendar, MapPin } from "lucide-react";
import { mouzaSchema } from "@/schema/village-validation";
import { useEffect } from "react";

type MouzaFormValues = z.infer<typeof mouzaSchema>;

interface MouzaFormProps {
  onSubmit: (values: MouzaFormValues) => Promise<void>;
  defaultValues?: Partial<MouzaFormValues>;
  isSubmitting?: boolean;
  isEditing?: boolean;
}

export function MouzaForm({
  onSubmit,
  defaultValues,
  isSubmitting,
  isEditing = false,
}: MouzaFormProps) {
  const form = useForm<MouzaFormValues>({
    resolver: zodResolver(mouzaSchema),
    defaultValues: {
      financialYear: "2024-25",
      name: "",
      jlno: "",
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
                onValueChange={field.onChange}
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
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Mouza Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Chandanagar"
                  className="bg-white focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jlno"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                J.L. No.
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., 45"
                  className="bg-white focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalHouseholds"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-gray-700">
                Total Households
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="e.g., 250"
                  className="bg-white focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
        >
          {isSubmitting ? "Adding..." : "Add Mouza Record"}
        </Button>
      </form>
    </Form>
  );
}
