"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Edit, Loader2, PlusCircle, XCircle } from "lucide-react";

const yearlyPopulationSchema = z
  .object({
    villageId: z.string().min(1, { message: "Village is required." }),
    year: z.coerce
      .number()
      .int()
      .min(2000, "Year must be 2000 or later.")
      .max(new Date().getFullYear() + 1, "Year cannot be in the future."),
    malePopulation: z.coerce.number().int().min(0, "Cannot be negative"),
    femalePopulation: z.coerce.number().int().min(0, "Cannot be negative"),
    maleLiterate: z.coerce.number().int().min(0, "Cannot be negative"),
    femaleLiterate: z.coerce.number().int().min(0, "Cannot be negative"),
    scPopulation: z.coerce.number().int().min(0, "Cannot be negative"),
    stPopulation: z.coerce.number().int().min(0, "Cannot be negative"),
    childPopulation: z.coerce.number().int().min(0, "Cannot be negative"),
  })
  .refine((data) => data.maleLiterate <= data.malePopulation, {
    message: "Literate males cannot exceed male population.",
    path: ["maleLiterate"],
  })
  .refine((data) => data.femaleLiterate <= data.femalePopulation, {
    message: "Literate females cannot exceed female population.",
    path: ["femaleLiterate"],
  })
  .refine(
    (data) =>
      data.childPopulation <= data.malePopulation + data.femalePopulation,
    {
      message: "Child population cannot exceed total population.",
      path: ["childPopulation"],
    }
  );

type YearlyPopulationSchema = z.infer<typeof yearlyPopulationSchema>;
type Village = { id: string; name: string };

const PopulationForm = ({
  villages,
  editingData,
  onFinished,
}: {
  villages: Village[];
  editingData: any | null;
  onFinished: () => void;
}) => {
  const [isSubmitting, startSubmitting] = useTransition();

  const form = useForm<YearlyPopulationSchema>({
    resolver: zodResolver(yearlyPopulationSchema),
    defaultValues: editingData
      ? {
          villageId: editingData.villageId,
          year: editingData.year,
          malePopulation: editingData.malePopulation,
          femalePopulation: editingData.femalePopulation,
          maleLiterate: editingData.maleLiterate,
          femaleLiterate: editingData.femaleLiterate,
          scPopulation: editingData.scPopulation,
          stPopulation: editingData.stPopulation,
          childPopulation: editingData.childPopulation,
        }
      : {
          villageId: "",
          year: new Date().getFullYear(),
          malePopulation: 0,
          femalePopulation: 0,
          maleLiterate: 0,
          femaleLiterate: 0,
          scPopulation: 0,
          stPopulation: 0,
          childPopulation: 0,
        },
  });

  async function onSubmit(values: YearlyPopulationSchema) {
    startSubmitting(async () => {
      try {
        const totalPopulation = values.malePopulation + values.femalePopulation;
        const totalLiterate = values.maleLiterate + values.femaleLiterate;
        const illiteratePopulation = totalPopulation - totalLiterate;

        const payload = {
          ...values,
          totalPopulation,
          totalLiterate,
          illiteratePopulation,
        };

        const response = await fetch("/api/villages/yearly-population", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Server responded with an error.");

        toast({
          title: "Success",
          description: `Population data for ${values.year} has been saved.`,
        });
        onFinished();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Operation Failed",
          description: "Could not save population data. Please try again.",
        });
      }
    });
  }

  const fieldGroups = [
    {
      label: "Total Population",
      fields: [
        { name: "malePopulation", label: "Males" },
        { name: "femalePopulation", label: "Females" },
      ],
    },
    {
      label: "Literacy",
      fields: [
        { name: "maleLiterate", label: "Literate Males" },
        { name: "femaleLiterate", label: "Literate Females" },
      ],
    },
    {
      label: "Demographics",
      fields: [
        { name: "scPopulation", label: "SC Population" },
        { name: "stPopulation", label: "ST Population" },
        { name: "childPopulation", label: "Child (0-6 yrs)" },
      ],
    },
  ] as const;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="villageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Village</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!!editingData || isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a village" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {villages.map((village) => (
                      <SelectItem key={village.id} value={village.id}>
                        {village.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter year"
                    {...field}
                    disabled={!!editingData || isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {fieldGroups.map((group) => (
          <div key={group.label}>
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">
              {group.label}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border p-4 rounded-md">
              {group.fields.map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        ))}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editingData ? "Update Data" : "Save New Data"}
        </Button>
      </form>
    </Form>
  );
};

export default function PopulationPage() {
  const [isVerifying, startVerifying] = useTransition();
  const [loading, setLoading] = useState(true);

  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );

  const [villages, setVillages] = useState<Village[]>([]);
  const [populationData, setPopulationData] = useState<any[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      // Assuming /api/villages can fetch all villages without a year query
      const [yearsRes, villagesRes] = await Promise.all([
        fetch("/api/villages/years"),
        fetch("/api/villages"),
      ]);

      const yearsJson = await yearsRes.json();
      const previousYear = new Date().getFullYear();

      if (yearsJson.success && yearsJson.data.length > 0) {
        const sortedYears: number[] = yearsJson.data.sort(
          (a: number, b: number) => b - a
        );
        setAvailableYears(sortedYears);
        // Default to the previous year if it exists, otherwise default to the most recent year.
        setSelectedYear(
          sortedYears.includes(previousYear) ? previousYear : sortedYears[0]
        );
      } else {
        // Fallback if no data exists in the DB
        setAvailableYears([previousYear]);
        setSelectedYear(previousYear);
      }

      const villagesJson = await villagesRes.json();
      if (villagesJson.success) {
        setVillages(villagesJson.data);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to fetch initial data" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchPopulationForYear = async (year: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/villages?year=${year}`);
      const { data } = await res.json();
      setPopulationData(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Failed to fetch data for ${year}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedYear && villages.length > 0) {
      fetchPopulationForYear(selectedYear);
    }
  }, [selectedYear, villages]);

  const handleVerify = (id: string) => {
    startVerifying(async () => {
      try {
        await fetch("/api/villages/yearly-population", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (selectedYear) {
          fetchPopulationForYear(selectedYear);
        }
        toast({
          title: "Success",
          description: "Data verified successfully.",
        });
      } catch (error) {
        toast({ variant: "destructive", title: "Verification failed." });
      }
    });
  };

  const handleEdit = (village: any) => {
    setEditingData({ ...village.yearlyData[0], villageName: village.name });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingData(null);
    setIsDialogOpen(true);
  };

  const onFormSubmit = () => {
    setIsDialogOpen(false);
    const yearToRefresh = editingData?.year || new Date().getFullYear();

    if (!availableYears.includes(yearToRefresh)) {
      const newYears = [...availableYears, yearToRefresh].sort((a, b) => b - a);
      setAvailableYears(newYears);
    }

    setSelectedYear(yearToRefresh); // Triggers re-fetch
    setEditingData(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Village Population Management</CardTitle>
            <CardDescription>
              View, add, or update population data for each year.
            </CardDescription>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {availableYears.length > 0 && (
              <Select
                value={selectedYear?.toString()}
                onValueChange={(val) => setSelectedYear(Number(val))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add/Update Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Village Name</TableHead>
                  <TableHead className="text-right">Total Population</TableHead>
                  <TableHead className="text-right">Male</TableHead>
                  <TableHead className="text-right">Female</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {populationData.length > 0 ? (
                  populationData.map((village) => {
                    const data = village.yearlyData?.[0];
                    return (
                      <TableRow key={village.id}>
                        <TableCell className="font-medium">
                          {village.name}
                        </TableCell>
                        {data ? (
                          <>
                            <TableCell className="text-right">
                              {data.totalPopulation}
                            </TableCell>
                            <TableCell className="text-right">
                              {data.malePopulation}
                            </TableCell>
                            <TableCell className="text-right">
                              {data.femalePopulation}
                            </TableCell>
                            <TableCell className="text-center">
                              {data.verified ? (
                                <Badge variant="success">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="warning">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Not Verified
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {!data.verified && (
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(village)}
                                    disabled={isVerifying}
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Update
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleVerify(data.id)}
                                    disabled={isVerifying}
                                  >
                                    {isVerifying && (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Verify
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </>
                        ) : (
                          <TableCell
                            colSpan={5}
                            className="text-center text-muted-foreground"
                          >
                            No data for {selectedYear}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No population data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingData ? "Update" : "Add New"} Population Data
            </DialogTitle>
            <DialogDescription>
              {editingData
                ? `Editing data for ${editingData.villageName} for the year ${editingData.year}.`
                : `Fill in the details to add new population data.`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-4">
            <PopulationForm
              villages={villages}
              editingData={editingData}
              onFinished={onFormSubmit}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Add these custom variants to your badge component if they don't exist
// In components/ui/badge.tsx -> badgeVariants
/*
    success:
        "border-transparent bg-green-500 text-primary-foreground shadow hover:bg-green-500/80",
    warning:
        "border-transparent bg-yellow-500 text-primary-foreground shadow hover:bg-yellow-500/80",
*/
