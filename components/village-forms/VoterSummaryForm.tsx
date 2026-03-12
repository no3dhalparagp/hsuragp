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
import { voterSummarySchema } from "@/schema/village-validation";
import { useEffect } from "react";

type VoterSummaryFormValues = z.infer<typeof voterSummarySchema>;

interface VoterSummaryFormProps {
  onSubmit: (values: VoterSummaryFormValues) => Promise<void>;
  mouzas: any[];
  defaultValues?: Partial<VoterSummaryFormValues>;
  isSubmitting?: boolean;
  financialYear?: string;
  onFinancialYearChange?: (value: string) => void;
  onMouzaChange?: (value: string) => void;
  isEditing?: boolean;
}

export function VoterSummaryForm({
  onSubmit,
  mouzas,
  defaultValues,
  isSubmitting,
  financialYear,
  onFinancialYearChange,
  onMouzaChange,
  isEditing = false,
}: VoterSummaryFormProps) {
  const form = useForm<VoterSummaryFormValues>({
    resolver: zodResolver(voterSummarySchema),
    defaultValues: {
      financialYear: financialYear ?? "2024-25",
      mouzaId: "",
      totalMaleVoter: 0,
      totalFemaleVoter: 0,
      scMaleVoter: 0,
      scFemaleVoter: 0,
      stMaleVoter: 0,
      stFemaleVoter: 0,
      obcMaleVoter: 0,
      obcFemaleVoter: 0,
      genMaleVoter: 0,
      genFemaleVoter: 0,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50/30 rounded-xl border border-blue-100">
          <FormField
            control={form.control}
            name="financialYear"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
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
                  <MapPin className="h-4 w-4 text-blue-600" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-6 lg:col-span-3">
            <div className="flex items-center space-x-2 border-b pb-2">
              <Users className="h-5 w-5 text-gray-400" />
              <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wider">
                Overall Totals
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="totalMaleVoter"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-semibold">
                      Total Male Voters
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-white border-blue-200 focus:ring-blue-500 h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalFemaleVoter"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-semibold">
                      Total Female Voters
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-white border-blue-200 focus:ring-blue-500 h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {[
            {
              label: "SC Voters",
              male: "scMaleVoter",
              female: "scFemaleVoter",
            },
            {
              label: "ST Voters",
              male: "stMaleVoter",
              female: "stFemaleVoter",
            },
            {
              label: "OBC Voters",
              male: "obcMaleVoter",
              female: "obcFemaleVoter",
            },
            {
              label: "General Voters",
              male: "genMaleVoter",
              female: "genFemaleVoter",
            },
          ].map((cat) => (
            <div
              key={cat.label}
              className="space-y-6 p-4 bg-gray-50 rounded-lg border"
            >
              <h3 className="font-bold text-gray-600 border-b pb-2 text-xs uppercase">
                {cat.label}
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name={cat.male as any}
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
                  name={cat.female as any}
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
          ))}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all font-bold"
        >
          {isSubmitting ? "Saving..." : "Save Voter Records"}
        </Button>
      </form>
    </Form>
  );
}
