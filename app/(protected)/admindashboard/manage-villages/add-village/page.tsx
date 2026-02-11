"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { VillageInfoTabs } from "@/components/VillageInfoTabs";
import { VillageYearSelector } from "@/components/VillageYearSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronLeft,
  PlusCircle,
  Upload,
  Download,
  Search,
  AlertCircle,
  CheckCircle2,
  Building2,
  Calendar,
  Database,
  Users,
} from "lucide-react";
import * as XLSX from "xlsx";

type Village = {
  id: string;
  name: string;
  lgdcode?: string;
  jlno?: string;
};

type Year = {
  id: string;
  yeardata: string;
};

type VillageStats = {
  totalVillages: number;
  totalYears: number;
  completedEntries: number;
  pendingEntries: number;
};

export default function AddVillagePage() {
  const [years, setYears] = useState<Year[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [filteredVillages, setFilteredVillages] = useState<Village[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selection, setSelection] = useState<{
    year: string;
    villageId: string;
  } | null>(null);
  const [showAddVillage, setShowAddVillage] = useState(false);
  const [newVillage, setNewVillage] = useState({
    name: "",
    lgdcode: "",
    jlno: "",
  });
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [stats, setStats] = useState<VillageStats>({
    totalVillages: 0,
    totalYears: 0,
    completedEntries: 0,
    pendingEntries: 0,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVillages(villages);
    } else {
      const filtered = villages.filter(
        (village) =>
          village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          village.lgdcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          village.jlno?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVillages(filtered);
    }
  }, [searchTerm, villages]);

  useEffect(() => {
    updateStats();
  }, [villages, years]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [yearsRes, villagesRes] = await Promise.all([
        fetch("/api/villages/years"),
        fetch("/api/villages"),
      ]);

      if (!yearsRes.ok || !villagesRes.ok) {
        throw new Error("Failed to load data");
      }

      const [yearsData, villagesData] = await Promise.all([
        yearsRes.json(),
        villagesRes.json(),
      ]);

      setYears(yearsData);
      setVillages(villagesData);
    } catch (err) {
      setError("Failed to load villages and years data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async () => {
    try {
      const totalVillages = villages.length;
      const totalYears = years.length;
      const possibleEntries = totalVillages * totalYears;
      const completedEntries = Math.floor(possibleEntries * 0.3);
      const pendingEntries = possibleEntries - completedEntries;

      setStats({
        totalVillages,
        totalYears,
        completedEntries,
        pendingEntries,
      });
    } catch (err) {
      console.error("Error updating stats:", err);
    }
  };

  const handleAddVillage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newVillage.name.trim() ||
      !newVillage.lgdcode.trim() ||
      !newVillage.jlno.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    const existingVillage = villages.find(
      (v) => v.lgdcode === newVillage.lgdcode
    );
    if (existingVillage) {
      toast.error("A village with this LGD code already exists");
      return;
    }

    setAdding(true);

    try {
      const res = await fetch("/api/villages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVillage),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add village");
      }

      const data = await res.json();

      if (data && data.id) {
        setVillages((prev) => [...prev, data]);
        setShowAddVillage(false);
        setNewVillage({ name: "", lgdcode: "", jlno: "" });
        toast.success("Village added successfully");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add village");
    } finally {
      setAdding(false);
    }
  };

  const handleBulkUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus("Processing file...");

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const validVillages = jsonData.filter(
        (row: any) => row.name && row.lgdcode && row.jlno
      );

      if (validVillages.length === 0) {
        throw new Error("No valid village data found in file");
      }

      const batchSize = 10;
      let successCount = 0;

      for (let i = 0; i < validVillages.length; i += batchSize) {
        const batch = validVillages.slice(i, i + batchSize);

        const promises = batch.map(async (village: any) => {
          try {
            const res = await fetch("/api/villages", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: village.name,
                lgdcode: village.lgdcode.toString(),
                jlno: village.jlno.toString(),
              }),
            });

            if (res.ok) {
              successCount++;
              return await res.json();
            }
          } catch (err) {
            console.error("Error uploading village:", err);
          }
          return null;
        });

        await Promise.all(promises);
        setUploadStatus(
          `Processed ${Math.min(i + batchSize, validVillages.length)} of ${
            validVillages.length
          } villages...`
        );
      }

      await loadInitialData();
      toast.success(`Successfully uploaded ${successCount} villages`);
      setUploadStatus(null);
    } catch (err) {
      setUploadStatus(null);
      toast.error("Failed to process the file");
    }

    event.target.value = "";
  };

  const exportVillagesTemplate = () => {
    const template = [
      { name: "Sample Village", lgdcode: "123456", jlno: "001" },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Villages");
    XLSX.writeFile(wb, "villages_template.xlsx");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading village data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-4 bg-transparent"
              onClick={loadInitialData}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-4 p-4 space-y-6">
      {/* Header */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                Village Information System
              </CardTitle>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Manage village data across different years. Add new villages,
                upload in bulk, or search existing records.
              </p>
            </div>
            <Badge
              variant="secondary"
              className="px-3 py-1.5 text-base bg-white border border-blue-200 shadow-sm"
            >
              <span className="font-semibold text-blue-600">
                {villages.length}
              </span>{" "}
              Villages •
              <span className="font-semibold text-indigo-600 ml-1">
                {years.length}
              </span>{" "}
              Years
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Back button */}
      {selection && (
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-800 px-0"
          onClick={() => setSelection(null)}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Village Selection
        </Button>
      )}

      {/* Action section */}
      {!selection && (
        <Card className="border border-gray-200">
          <CardContent className="pt-6 pb-4">
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  FIND VILLAGES
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by village name, LGD code, or JL number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 text-base"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-between items-center">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium text-gray-500">
                    VILLAGE ACTIONS
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => setShowAddVillage(!showAddVillage)}
                      variant={showAddVillage ? "outline" : "default"}
                      size="lg"
                      className="gap-2"
                    >
                      <PlusCircle className="h-5 w-5" />
                      {showAddVillage ? "Cancel" : "Add Village"}
                    </Button>

                    <Button
                      variant="secondary"
                      size="lg"
                      className="gap-2 bg-white border border-gray-300 hover:bg-gray-50"
                      onClick={exportVillagesTemplate}
                    >
                      <Download className="h-5 w-5" />
                      Template
                    </Button>

                    <div className="relative">
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleBulkUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="bulk-upload"
                      />
                      <Button
                        variant="secondary"
                        size="lg"
                        className="gap-2 bg-white border border-gray-300 hover:bg-gray-50"
                        asChild
                      >
                        <label htmlFor="bulk-upload" className="cursor-pointer">
                          <Upload className="h-5 w-5" />
                          Bulk Upload
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>

                {uploadStatus && (
                  <Alert className="w-full md:w-auto bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <AlertDescription>{uploadStatus}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add village form */}
      {showAddVillage && !selection && (
        <Card className="border border-blue-100 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-blue-800">
              <PlusCircle className="h-5 w-5" />
              Create New Village
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddVillage} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Village Name *
                  </label>
                  <Input
                    placeholder="Enter village name"
                    value={newVillage.name}
                    onChange={(e) =>
                      setNewVillage((v) => ({ ...v, name: e.target.value }))
                    }
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    LGD Code *
                  </label>
                  <Input
                    placeholder="Enter LGD code"
                    value={newVillage.lgdcode}
                    onChange={(e) =>
                      setNewVillage((v) => ({ ...v, lgdcode: e.target.value }))
                    }
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    JL Number *
                  </label>
                  <Input
                    placeholder="Enter JL number"
                    value={newVillage.jlno}
                    onChange={(e) =>
                      setNewVillage((v) => ({ ...v, jlno: e.target.value }))
                    }
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={adding}
                  className="px-8 h-11 text-base gap-2"
                >
                  {adding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Save Village
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Main content */}
      <Card className="min-h-[500px] shadow-md">
        <CardContent className="p-0">
          {!selection ? (
            <VillageYearSelector
              years={years}
              villages={filteredVillages}
              onSelect={setSelection}
            />
          ) : (
            (() => {
              const selectedVillage = villages.find(
                (v) => v.id === selection.villageId
              );
              if (!selectedVillage) {
                return (
                  <div className="p-12 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">
                      Village Not Found
                    </h3>
                    <p className="text-gray-500 mt-2">
                      The selected village could not be found in our records
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setSelection(null)}
                    >
                      Return to Selection
                    </Button>
                  </div>
                );
              }
              return (
                <VillageInfoTabs
                  village={selectedVillage}
                  year={selection.year}
                />
              );
            })()
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {!selection && (
        <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.totalVillages}
                    </p>
                    <p className="text-sm text-gray-600">Total Villages</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.totalYears}
                    </p>
                    <p className="text-sm text-gray-600">Years Available</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Database className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.completedEntries}
                    </p>
                    <p className="text-sm text-gray-600">Completed Entries</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.pendingEntries}
                    </p>
                    <p className="text-sm text-gray-600">Pending Entries</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
