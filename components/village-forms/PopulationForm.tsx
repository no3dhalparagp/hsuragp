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
import { populationSchema } from "@/schema/village-validation";
import { useEffect } from "react";

type PopulationFormValues = z.infer<typeof populationSchema>;

interface PopulationFormProps {
  onSubmit: (values: PopulationFormValues) => Promise<void>;
  mouzas: any[];
  defaultValues?: Partial<PopulationFormValues>;
  isSubmitting?: boolean;
  financialYear?: string;
  onFinancialYearChange?: (value: string) => void;
  isEditing?: boolean;
}

export function PopulationForm({
  onSubmit,
  mouzas,
  defaultValues,
  isSubmitting,
  financialYear,
  onFinancialYearChange,
  isEditing = false,
}: PopulationFormProps) {
  const form = useForm<PopulationFormValues>({
    resolver: zodResolver(populationSchema),
    defaultValues: {
      financialYear: financialYear ?? "2024-25",
      mouzaId: "",
      male: 0,
      female: 0,
      st: 0,
      sc: 0,
      obc: 0,
      other: 0,
      hindu: 0,
      muslim: 0,
      christian: 0,
      otherReligion: 0,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100">
          <FormField
            control={form.control}
            name="financialYear"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
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
            name="mouzaId"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span>Mouza Selection</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isEditing}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 border-b pb-2">Gender</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="male"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Male</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="female"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Female</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 border-b pb-2">
              Caste Category
            </h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="sc"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>SC</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="st"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>ST</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="obc"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>OBC</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="other"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>General / Other</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-bold text-gray-700 border-b pb-2">
              Religious Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hindu"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Hindu</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="muslim"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Muslim</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="christian"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Christian</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherReligion"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Other Religion</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white" />
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
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
        >
          {isSubmitting ? "Saving..." : "Save Population Records"}
        </Button>
      </form>
    </Form>
  );
}
