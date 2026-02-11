"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CorrectionRequestReview from "./correction-request-review";
import CorrectionRequestForm from "./correction-request-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Loader2, 
  Search, 
  User, 
  FileText, 
  Users, 
  Calendar, 
  MapPin, 
  Phone,
  History,
  PenTool,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/utils/utils";
import { Separator } from "@/components/ui/separator";

// Component Props
interface EnhancedCorrectionSearchProps {
  initialRequests: any[];
  initialApp: any;
}

export default function EnhancedCorrectionSearch({
  initialRequests,
  initialApp,
}: EnhancedCorrectionSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [app, setApp] = useState(initialApp);
  const [requests, setRequests] = useState(initialRequests);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any[]>([]);

  // Initialize with props
  useEffect(() => {
    if (initialApp) {
      setApp(initialApp);
      setDetails(initialApp.details || []);
    }
    if (initialRequests) {
      setRequests(initialRequests);
    }
  }, [initialApp, initialRequests]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setRequests([]);
    setApp(null);
    setDetails([]);

    try {
      const res = await fetch(`/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchQuery }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch application");
      }

      const foundApp = data?.app || data;
      if (!foundApp?.id) {
        throw new Error("No application found for this query");
      }

      // Navigate to the dedicated correction page
      router.push(`/employeedashboard/warish/apply-correction/${foundApp.id}`);
      
      // Fallback local state update
      setApp(foundApp);
      setDetails(foundApp.details || []);
      await fetchRequests(foundApp.id);
    } catch (err: any) {
      setError(err.message || "An error occurred while searching");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRequests(warishApplicationId: string) {
    try {
      const reqRes = await fetch(
        `/api/warish-correction-requests?warishApplicationId=${warishApplicationId}`
      );

      if (!reqRes.ok) {
        throw new Error("Failed to fetch correction requests");
      }

      const reqData = await reqRes.json();
      setRequests(reqData.requests || []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  }

  const handleRequestReviewed = () => {
    if (app) {
      fetchRequests(app.id);
    }
  };

  const handleRequestSubmitted = () => {
    if (app) {
      fetchRequests(app.id);
    }
  };

  // Define available fields for correction
  const applicationFields = [
    { value: "applicantName", label: "Applicant Name", currentValue: app?.applicantName, icon: User },
    { value: "applicantMobileNumber", label: "Mobile Number", currentValue: app?.applicantMobileNumber, icon: Phone },
    { value: "relationwithdeceased", label: "Relation with Deceased", currentValue: app?.relationwithdeceased, icon: Users },
    { value: "nameOfDeceased", label: "Name of Deceased", currentValue: app?.nameOfDeceased, icon: User },
    { value: "fatherName", label: "Father Name", currentValue: app?.fatherName, icon: User },
    { value: "spouseName", label: "Spouse Name", currentValue: app?.spouseName, icon: User },
    { value: "villageName", label: "Village Name", currentValue: app?.villageName, icon: MapPin },
    { value: "postOffice", label: "Post Office", currentValue: app?.postOffice, icon: MapPin },
  ];

  // Detail fields for each heir
  const detailFields = (detail: any) => [
    { value: "name", label: "Heir Name", currentValue: detail?.name, icon: User },
    { value: "gender", label: "Gender", currentValue: detail?.gender, icon: Users },
    { value: "relation", label: "Relation", currentValue: detail?.relation, icon: Users },
    { value: "livingStatus", label: "Living Status", currentValue: detail?.livingStatus, icon: User },
    { value: "maritialStatus", label: "Marital Status", currentValue: detail?.maritialStatus, icon: Users },
    { value: "hasbandName", label: "Husband Name", currentValue: detail?.hasbandName || "", icon: User },
  ];

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 w-full">
          <Card className="shadow-md border-primary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Find Application
              </CardTitle>
              <CardDescription>
                Search by acknowledgment number, reference number, or applicant name
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter ACK No, Ref No, or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || !searchQuery.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </form>
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick App Summary if loaded */}
        {app && (
          <Card className="w-full md:w-80 shadow-sm bg-muted/30">
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Current Application
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-4 space-y-3">
              <div>
                <span className="text-xs text-muted-foreground block">Applicant</span>
                <span className="font-medium text-sm">{app.applicantName}</span>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-muted-foreground block">Status</span>
                <Badge variant={
                  app.status === "approved" ? "default" : // approved default is usually primary showing completed
                  app.status === "rejected" ? "destructive" : "secondary"
                } className="mt-1">
                  {app.status || "Pending"}
                </Badge>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Submission</span>
                <span className="text-sm">{formatDate(app.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {app && (
        <Tabs defaultValue="apply" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mb-6">
            <TabsTrigger value="apply" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Apply Correction
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Request History
              {requests.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 min-w-[1.25rem]">
                  {requests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apply" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Application Info Column */}
              <div className="md:col-span-1 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Application Details
                </h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {applicationFields.map((field) => (
                      <div key={field.value} className="group">
                        <Label className="text-xs text-muted-foreground">{field.label}</Label>
                        <div className="font-medium text-sm truncate" title={field.currentValue}>
                          {field.currentValue || "N/A"}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Edit Area */}
              <div className="md:col-span-2">
                <Tabs defaultValue="app-fields" className="w-full">
                  <TabsList className="w-full justify-start mb-4 bg-transparent p-0 border-b rounded-none h-auto">
                    <TabsTrigger 
                      value="app-fields"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
                    >
                      Correction for Application
                    </TabsTrigger>
                    <TabsTrigger 
                      value="warish-details"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
                    >
                      Correction for Heirs (Warish)
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="app-fields" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Modify Application Information</CardTitle>
                        <CardDescription>
                          Select a field to request a correction. Admin approval required.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CorrectionRequestForm
                          warishApplicationId={app.id}
                          targetType="application"
                          availableFields={applicationFields}
                          onRequestSubmitted={handleRequestSubmitted}
                          requesterName={app.applicantName || ""}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="warish-details" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Modify Warish Details</CardTitle>
                        <CardDescription>
                          Select a heir below to request corrections for their information.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {details.length > 0 ? (
                          <div className="space-y-4">
                            {details.map((detail, index) => (
                              <div key={detail.id || index} className="border rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      {detail.name}
                                    </h4>
                                    <div className="text-xs text-muted-foreground mt-1 flex gap-2">
                                      <span className="capitalize">{detail.relation}</span>
                                      <span>•</span>
                                      <span className="capitalize">{detail.gender}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="w-full lg:w-auto">
                                    <CorrectionRequestForm
                                      warishApplicationId={app.id}
                                      warishDetailId={detail.id}
                                      targetType="detail"
                                      availableFields={detailFields(detail)}
                                      onRequestSubmitted={handleRequestSubmitted}
                                      requesterName={app.applicantName || ""}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No warish details found for this application.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Request History</CardTitle>
                <CardDescription>
                  Track the status of your correction requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CorrectionRequestReview
                  requests={requests}
                  onRequestReviewed={handleRequestReviewed}
                  viewMode="list" 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
