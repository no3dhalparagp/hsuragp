"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Users,
  Building2,
  Heart,
  Droplets,
  MapPin,
  Home,
  Edit,
  Plus,
  Search,
  GraduationCap,
  Calendar,
  TrendingUp,
  Shield,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getVillages, getVillageById } from "@/action/village-actions";
import Link from "next/link";

interface Village {
  id: string;
  jlNo: string;
  name: string;
  state: string;
  district: string;
  block: string;
  gramPanchayatName: string;
  pincode?: string;
  households: number;
  yearlyData: any[];
  educationalInstitutionData: any[];
  villageInfrastructure: any[];
  healthData: any[];
  sanitationData: any[];
  waterSupplyData: any[];
  economicData: any[];
}

export default function VillageDashboard() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentVillageData, setCurrentVillageData] = useState<Village | null>(
    null
  );

  // Load villages on component mount
  useEffect(() => {
    loadVillages();
  }, []);

  // Load selected village data when village changes
  useEffect(() => {
    if (selectedVillage) {
      loadVillageData(selectedVillage);
    }
  }, [selectedVillage]);

  const loadVillages = async () => {
    setLoading(true);
    try {
      const result = await getVillages();
      if (result.success) {
        setVillages(
          (result.data ?? []).map(
            (v) =>
              ({
                ...v,
                pincode: v.pincode ?? undefined,
                healthData: [],
                sanitationData: [],
                waterSupplyData: [],
                economicData: [],
              } as Village)
          )
        );
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load villages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVillageData = async (villageId: string) => {
    try {
      const result = await getVillageById(villageId);
      if (result.success) {
        const data = result.data
          ? {
              ...result.data,
              pincode: result.data.pincode ?? undefined,
              healthData: result.data.healthData ?? [],
              sanitationData: result.data.sanitationData ?? [],
              waterSupplyData: result.data.waterSupplyData ?? [],
              economicData: result.data.economicData ?? [],
            }
          : null;
        setCurrentVillageData(data);
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load village data",
        variant: "destructive",
      });
    }
  };

  // Get filtered villages based on search term
  const getFilteredVillages = () => {
    if (!searchTerm) return villages;

    return villages.filter(
      (village) =>
        village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.jlNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleVillageChange = (villageId: string) => {
    setSelectedVillage(villageId);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(Number.parseInt(year));
  };

  // Get current year data for selected village
  const getCurrentYearData = () => {
    if (!currentVillageData) return null;

    const yearlyData = currentVillageData.yearlyData.find(
      (data) => data.year === selectedYear
    );
    const educationalData = currentVillageData.educationalInstitutionData.find(
      (data) => data.year === selectedYear
    );
    const infrastructureData = currentVillageData.villageInfrastructure.find(
      (data) => data.year === selectedYear
    );
    const healthData = currentVillageData.healthData.find(
      (data) => data.year === selectedYear
    );
    const sanitationData = currentVillageData.sanitationData.find(
      (data) => data.year === selectedYear
    );
    const waterSupplyData = currentVillageData.waterSupplyData.find(
      (data) => data.year === selectedYear
    );
    const economicData = currentVillageData.economicData.find(
      (data) => data.year === selectedYear
    );

    return {
      yearlyData,
      educationalData,
      infrastructureData,
      healthData,
      sanitationData,
      waterSupplyData,
      economicData,
    };
  };

  const currentYearData = getCurrentYearData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading villages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Village Management System
              </h1>
              <Badge className="bg-green-100 text-green-800">
                Gram Panchayat Portal
              </Badge>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search villages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Village Dropdown */}
              <Select
                value={selectedVillage}
                onValueChange={handleVillageChange}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a village" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredVillages().map((village) => (
                    <SelectItem key={village.id} value={village.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{village.name}</span>
                        <span className="text-xs text-gray-500">
                          {village.jlNo} • {village.district}, {village.state}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Selector */}
              <Select
                value={selectedYear.toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>

              <Link href="/villages/create">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Village
                </Button>
              </Link>

              {currentVillageData && (
                <Link href={`/villages/${currentVillageData.id}/edit`}>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    size="default"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Data
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentVillageData && currentYearData ? (
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Village Info Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{currentVillageData.name}</span>
                    <Badge variant="outline">
                      JL: {currentVillageData.jlNo}
                    </Badge>
                    <Badge variant="secondary">Year: {selectedYear}</Badge>
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {currentVillageData.district}, {currentVillageData.state} •
                    PIN: {currentVillageData.pincode}
                  </p>
                  <p className="text-sm text-gray-500">
                    Block: {currentVillageData.block} • GP:{" "}
                    {currentVillageData.gramPanchayatName}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Data for {selectedYear}</span>
                  </div>
                  {currentYearData.yearlyData?.verified && (
                    <Badge className="mt-1 bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <div>Total Households: {currentVillageData.households}</div>
                  <div>
                    Population:{" "}
                    {currentYearData.yearlyData?.totalPopulation?.toLocaleString() ||
                      "N/A"}{" "}
                    • Literacy Rate:{" "}
                    {currentYearData.yearlyData
                      ? Math.round(
                          (currentYearData.yearlyData.totalLiterate /
                            currentYearData.yearlyData.totalPopulation) *
                            100
                        )
                      : 0}
                    %
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/villages/${currentVillageData.id}/edit`}>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Village Data
                    </Button>
                  </Link>
                  <Link href={`/villages/${currentVillageData.id}/reports`}>
                    <Button variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Population
                </CardTitle>
                <Users className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentYearData.yearlyData?.totalPopulation?.toLocaleString() ||
                    "N/A"}
                </div>
                <p className="text-xs text-gray-600">
                  Male: {currentYearData.yearlyData?.malePopulation || 0} |
                  Female: {currentYearData.yearlyData?.femalePopulation || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Households
                </CardTitle>
                <Home className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentVillageData.households}
                </div>
                <p className="text-xs text-gray-600">
                  Average:{" "}
                  {currentYearData.yearlyData
                    ? (
                        currentYearData.yearlyData.totalPopulation /
                        currentVillageData.households
                      ).toFixed(1)
                    : 0}{" "}
                  per household
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Literacy Rate
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentYearData.yearlyData
                    ? Math.round(
                        (currentYearData.yearlyData.totalLiterate /
                          currentYearData.yearlyData.totalPopulation) *
                          100
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-gray-600">
                  Total Literate:{" "}
                  {currentYearData.yearlyData?.totalLiterate || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Educational Institutions
                </CardTitle>
                <Building2 className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(currentYearData.educationalData?.primarySchool || 0) +
                    (currentYearData.educationalData?.highSchool || 0) +
                    (currentYearData.educationalData?.higherSecondary || 0)}
                </div>
                <p className="text-xs text-gray-600">Schools & Institutions</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Data Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Educational Institutions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <span>Educational Institutions ({selectedYear})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span>Shishu Shiksha Kendra (SSK)</span>
                    <span className="font-bold text-blue-600">
                      {currentYearData.educationalData?.ssk || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>Anganwadi</span>
                    <span className="font-bold text-green-600">
                      {currentYearData.educationalData?.anganwadi || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span>Primary Schools</span>
                    <span className="font-bold text-purple-600">
                      {currentYearData.educationalData?.primarySchool || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span>High Schools</span>
                    <span className="font-bold text-orange-600">
                      {currentYearData.educationalData?.highSchool || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span>Infrastructure ({selectedYear})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span>Health Centres</span>
                    <span className="font-bold text-red-600">
                      {currentYearData.infrastructureData?.healthCentre || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                    <span>Sub Centres</span>
                    <span className="font-bold text-pink-600">
                      {currentYearData.infrastructureData?.subCentre || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                    <span>ICDS Centres</span>
                    <span className="font-bold text-cyan-600">
                      {currentYearData.infrastructureData?.icdsCentre || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span>Bank Branches</span>
                    <span className="font-bold text-yellow-600">
                      {currentYearData.infrastructureData?.bankBranch || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health & Sanitation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span>Health Data ({selectedYear})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span>Birth Rate</span>
                    <span className="font-bold text-red-600">
                      {currentYearData.healthData?.birthRate || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span>Immunization Coverage</span>
                    <span className="font-bold text-blue-600">
                      {currentYearData.healthData?.immunizationCoverage || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>Institutional Deliveries</span>
                    <span className="font-bold text-green-600">
                      {currentYearData.healthData?.institutionalDeliveries || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-cyan-600" />
                  <span>Water & Sanitation ({selectedYear})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                    <span>Piped Water Connections</span>
                    <span className="font-bold text-cyan-600">
                      {currentYearData.waterSupplyData?.pipedWaterConnections ||
                        0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span>Households with Toilets</span>
                    <span className="font-bold text-blue-600">
                      {currentYearData.sanitationData?.householdsWithToilets ||
                        0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>Open Defecation Free</span>
                    <span className="font-bold text-green-600">
                      {currentYearData.sanitationData?.openDefecationFree
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demographics */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Demographics Overview ({selectedYear})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentYearData.yearlyData?.malePopulation || 0}
                  </div>
                  <div className="text-sm text-blue-700">Male Population</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {currentYearData.yearlyData
                      ? (
                          (currentYearData.yearlyData.malePopulation /
                            currentYearData.yearlyData.totalPopulation) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">
                    {currentYearData.yearlyData?.femalePopulation || 0}
                  </div>
                  <div className="text-sm text-pink-700">Female Population</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {currentYearData.yearlyData
                      ? (
                          (currentYearData.yearlyData.femalePopulation /
                            currentYearData.yearlyData.totalPopulation) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {currentYearData.yearlyData?.scPopulation || 0}
                  </div>
                  <div className="text-sm text-yellow-700">SC Population</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {currentYearData.yearlyData
                      ? (
                          (currentYearData.yearlyData.scPopulation /
                            currentYearData.yearlyData.totalPopulation) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {currentYearData.yearlyData?.childPopulation || 0}
                  </div>
                  <div className="text-sm text-green-700">Child Population</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {currentYearData.yearlyData
                      ? (
                          (currentYearData.yearlyData.childPopulation /
                            currentYearData.yearlyData.totalPopulation) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Village Selected
            </h2>
            <p className="text-gray-600 mb-6">
              Please select a village from the dropdown above to view its
              information, or create a new village.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/villages/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Village
                </Button>
              </Link>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Available Villages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {villages.map((village) => (
                  <Card
                    key={village.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleVillageChange(village.id)}
                  >
                    <CardContent className="p-4">
                      <div className="font-semibold">{village.name}</div>
                      <div className="text-sm text-gray-600">
                        {village.jlNo}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {village.district}, {village.state}
                      </div>
                      <div className="text-xs text-gray-500">
                        {village.households} households
                      </div>
                      <div className="text-xs text-gray-500">
                        Population:{" "}
                        {village.yearlyData
                          .find((data) => data.year === selectedYear)
                          ?.totalPopulation?.toLocaleString() || "N/A"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
