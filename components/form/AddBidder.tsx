"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AgencyDetails } from "@prisma/client";
import { ChevronDown, Check, Search } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { addBiderDetails, getAgencyDetails } from "@/action/bookNitNuber";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const agencyColors = [
  "bg-red-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-indigo-100",
  "bg-teal-100",
];

export const biderdetailsValidationSchema = z.object({
  bidderdetails: z
    .array(z.string())
    .min(1, "Please select at least one bidder"),
});

type FormValues = z.infer<typeof biderdetailsValidationSchema>;

interface AddBidderTechnicalDetailsProps {
  workid: string;
}

export default function AddBidderTechnicalDetails({
  workid,
}: AddBidderTechnicalDetailsProps) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<FormValues>({
    defaultValues: {
      bidderdetails: [],
    },
    resolver: zodResolver(biderdetailsValidationSchema),
  });

  const {
    data: agencyList,
    error,
    isLoading,
  } = useQuery<AgencyDetails[], Error>({
    queryKey: ["getAgencyDetails"],
    queryFn: async () => {
      const result = await getAgencyDetails();
      return result || [];
    },
  });

  // Filter agencies based on search term
  const filteredAgencies = useMemo(() => {
    if (!agencyList) return [];
    return agencyList.filter(
      (agency) =>
        agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agencyList, searchTerm]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const result = await addBiderDetails(values, workid);
        if (result?.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: result?.success || "Bidders added successfully",
          });
          form.reset();
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error("Submission error:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    },
    [form, workid, toast]
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">
        Error loading agencies: {error.message}
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Add Bidder Details
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="bidderdetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Bidders</FormLabel>
                <FormControl>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between text-left font-normal"
                        data-testid="bidder-select-trigger"
                      >
                        <span>
                          {field.value.length > 0
                            ? `${field.value.length} bidder${
                                field.value.length > 1 ? "s" : ""
                              } selected`
                            : "Select bidders"}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="text-xl mb-4">
                          Select Bidders
                        </DialogTitle>
                      </DialogHeader>

                      {/* Search input */}
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search bidders..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          data-testid="bidder-search-input"
                        />
                      </div>

                      <ScrollArea className="h-[300px] pr-4 rounded-md border">
                        <div className="space-y-2">
                          {filteredAgencies.length > 0 ? (
                            filteredAgencies.map((agency, index) => (
                              <div
                                key={agency.id}
                                className={cn(
                                  "flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-accent",
                                  agencyColors[index % agencyColors.length]
                                )}
                              >
                                <Checkbox
                                  id={agency.id}
                                  checked={field.value.includes(agency.id)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, agency.id]
                                      : field.value.filter(
                                          (id) => id !== agency.id
                                        );
                                    field.onChange(newValue);
                                  }}
                                  className="h-4 w-4"
                                />
                                <label
                                  htmlFor={agency.id}
                                  className="text-sm font-medium leading-none flex-grow cursor-pointer"
                                >
                                  <div className="font-medium">
                                    {agency.name}
                                    {agency.agencyType == "FARM" && (
                                      <span className="text-xs text-muted-foreground">
                                        ({agency.proprietorName})
                                      </span>
                                    )}
                                  </div>
                                  {agency.email && (
                                    <div className="text-xs text-muted-foreground truncate">
                                      {agency.email}
                                    </div>
                                  )}
                                </label>
                                {field.value.includes(agency.id) && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              No matching bidders found
                            </div>
                          )}
                        </div>
                      </ScrollArea>

                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {field.value.length} selected
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={() => setIsModalOpen(false)}>
                            Apply
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </FormControl>
                <FormDescription>
                  Select one or more bidders from the list
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Processing..."
              : "Add Selected Bidders"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
