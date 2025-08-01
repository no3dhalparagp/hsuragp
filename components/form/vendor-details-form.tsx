
"use client";

import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  User, 
  FileText, 
  MapPin,
  Store,
  User2,
  
} from "lucide-react";
import { vendorSchema } from "@/schema/venderschema";
import { vendorSchemaAction } from "@/action/uploadwork";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const submitVendorDetails = async (values: z.infer<typeof vendorSchema>) => {
  await vendorSchemaAction(values);
  // Replace this mock implementation with actual API call
  return Math.random() > 0.5
    ? { success: "Vendor details submitted successfully!" }
    : { error: "An error occurred while submitting the form." };
};

export default function VendorRegistrationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
      mobileNumber: "",
      email: "",
      pan: "",
      tin: "",
      gst: "",
      postalAddress: "",
      agencyType: "INDIVIDUAL",
      proprietorName: "",
    },
  });

  const agencyType = form.watch("agencyType");

  async function onSubmit(values: z.infer<typeof vendorSchema>) {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      try {
        const result = await submitVendorDetails(values);
        if (result?.error) setError(result.error);
        if (result?.success) {
          setSuccess(result.success);
          form.reset();
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-center">
          Vendor Registration
        </CardTitle>
        <p className="text-center text-gray-500 mt-2">
          Please fill in all required fields to complete your registration.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 p-2 rounded-lg">
                      <User className="h-5 w-5" />
                    </span>
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Primary contact details for the vendor
                  </p>
                </div>
                
                {/* Agency Type Field */}
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="agencyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 flex items-center gap-1">
                          Agency Type <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300 h-12">
                              <SelectValue placeholder="Select agency type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="INDIVIDUAL">
                              <div className="flex items-center gap-2">
                                <User2 className="h-4 w-4 text-blue-600" />
                                <span>Individual</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="FARM">
                              <div className="flex items-center gap-2">
                                
                                <span>Farm</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 flex items-center gap-1">
                          {agencyType === "FARM" ? "Farm Name" : "Full Name"} 
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={agencyType === "FARM" ? "Green Acres Farm" : "John Doe"}
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500 border-gray-300 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Proprietor Name - Conditionally shown for farms */}
                  {agencyType === "FARM" && (
                    <FormField
                      control={form.control}
                      name="proprietorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 flex items-center gap-1">
                            Proprietor Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Proprietor's Full Name"
                              {...field}
                              className="focus:ring-2 focus:ring-blue-500 border-gray-300 h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 flex items-center gap-1">
                          Mobile <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+91 98765 43210"
                            {...field}
                            className="border-gray-300 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-700 flex items-center gap-1">
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            {...field}
                            className="border-gray-300 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Tax Information Section */}
              <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 p-2 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </span>
                    Tax Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Official tax identification details
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="pan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 flex items-center gap-1">
                          PAN <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ABCDE1234F"
                            {...field}
                            className="border-gray-300 h-12 font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">TIN</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456789"
                            {...field}
                            className="border-gray-300 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gst"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">GSTIN</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="22ABCDE1234F1Z5"
                            {...field}
                            className="border-gray-300 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 p-2 rounded-lg">
                      <MapPin className="h-5 w-5" />
                    </span>
                    Postal Address
                  </h3>
                </div>
                <FormField
                  control={form.control}
                  name="postalAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 flex items-center gap-1">
                        Complete Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Floor #, Building Name, Street, City, State, PIN"
                          className="min-h-[120px] resize-y border-gray-300 focus:ring-2 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold h-14 rounded-xl shadow-lg transition-all transform hover:scale-[1.01]"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Submitting Registration...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Complete Registration</span>
                  </div>
                )}
              </Button>

              {(error || success) && (
                <Alert className={`w-full border-l-4 ${error ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'} rounded-lg`}>
                  <div className="flex items-center gap-3">
                    {error ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    <AlertDescription className={error ? 'text-red-700' : 'text-green-700'}>
                      {error || success}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
