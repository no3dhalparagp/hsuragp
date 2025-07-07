"use client";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Hash,
  LayoutGrid,
  MapPin,
  Route, 
  Wallet,
  Landmark,
  PlusCircle,
  FileText
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { actionplanschema } from "@/schema/actionplan";
import { createschme } from "@/action/uploadwork";
import { cn } from "@/lib/utils";

export default function AddActionPlanForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof actionplanschema>>({
    resolver: zodResolver(actionplanschema),
    defaultValues: {
      financialYear: "",
      themeName: "",
      activityCode: 0,
      activityName: "",
      activityDescription: "",
      activityFor: "",
      sector: "",
      locationofAsset: "",
      estimatedCost: 0,
      totalduration: "",
      schemeName: "",
      generalFund: 0,
      scFund: 0,
      stFund: 0,
      
    },
  });

  async function onSubmit(values: z.infer<typeof actionplanschema>) {
    setIsLoading(true);
    try {
      await createschme(values);
      toast({
        title: "✅ Action Plan Added",
        description: "Your action plan has been successfully submitted.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "⚠️ Error",
        description: "Failed to add action plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        New Action Plan Form
      </h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Financial Section */}
          <div className="bg-muted/50 p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              Financial Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="financialYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Financial Year
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-lg border-2 focus:border-blue-500">
                          <SelectValue placeholder="Select financial year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="themeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                      Theme Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Development" 
                        {...field} 
                        className="rounded-lg border-2 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Scheme Name Field */}
            <FormField
              control={form.control}
              name="schemeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Scheme Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter scheme name" 
                      {...field} 
                      className="rounded-lg border-2 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Activity Section */}
          <div className="bg-muted/50 p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Route className="h-5 w-5 text-green-600" />
              Activity Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="activityCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      Activity Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1001"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="rounded-lg border-2 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-green-600" />
                      Activity Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Road Construction" 
                        {...field} 
                        className="rounded-lg border-2 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="activityDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the activity"
                      {...field}
                      className="rounded-lg border-2 focus:border-blue-500 min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="activityFor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Landmark className="h-4 w-4 text-muted-foreground" />
                      Activity For
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-lg border-2 focus:border-blue-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                      Sector
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-lg border-2 focus:border-blue-500">
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                        <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Location & Duration Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="locationofAsset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Location
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-lg border-2 focus:border-blue-500">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="City Center">City Center</SelectItem>
                      <SelectItem value="Suburb">Suburb</SelectItem>
                      <SelectItem value="Rural">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalduration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Duration
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-lg border-2 focus:border-blue-500">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="1 year">1 year</SelectItem>
                      <SelectItem value="2 years">2 years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Estimated Cost
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1000000"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="rounded-lg border-2 focus:border-blue-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Funding Section */}
          <div className="bg-muted/50 p-6 rounded-xl space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Wallet className="h-5 w-5 text-purple-600" />
              Funding Allocation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="generalFund"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>General Fund</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="500000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="rounded-lg border-2 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scFund"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SC Fund</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="250000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="rounded-lg border-2 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stFund"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ST Fund</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="250000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="rounded-lg border-2 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Publication Status */}
          
          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={isLoading}
              className={cn(
                "rounded-xl px-8 py-6 text-lg font-semibold",
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                "text-white shadow-lg hover:shadow-xl transition-all duration-300",
                "flex items-center gap-2"
              )}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5" />
                  Create Action Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
      }
