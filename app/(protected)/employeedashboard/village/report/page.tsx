"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  getMouzaList,
  getVillageOverview,
  getSansadList,
  getVillageDetails,
} from "@/action/villagemanage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Calendar,
  MapPin,
  Search,
  Download,
  LayoutDashboard,
  BarChart3,
  Users2,
} from "lucide-react";

type OverviewItem = {
  id: string;
  name: string;
  jlno: string;
  householdCount: number;
  totalPopulation: number;
};

type Sansad = {
  id: string;
  financialYear: string;
};

export default function VillageReportPage() {
  const [financialYear, setFinancialYear] = useState("2024-25");
  const [mouzas, setMouzas] = useState<any[]>([]);
  const [overview, setOverview] = useState<OverviewItem[]>([]);
  const [sansads, setSansads] = useState<Sansad[]>([]);
  const [selectedMouzaDetails, setSelectedMouzaDetails] = useState<any | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const loadData = useCallback(async () => {
    const [mouzaData, overviewRes, sansadData] = await Promise.all([
      getMouzaList(financialYear),
      getVillageOverview(financialYear),
      getSansadList(financialYear),
    ]);

    setMouzas(mouzaData);
    if (overviewRes.success) {
      setOverview(overviewRes.data);
    } else {
      setOverview([]);
    }
    setSansads(sansadData || []);
  }, [financialYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerateBlankForm = () => {
    const formHtml = `
      <html>
        <head>
          <title>Data Collection Form</title>
          <style>
            body { font-family: sans-serif; margin: 2rem; }
            h1 { text-align: center; margin-bottom: 2rem; }
            .form-section { margin-bottom: 2rem; border: 1px solid #ccc; padding: 1rem; border-radius: 8px; }
            .form-section h2 { margin-top: 0; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
            .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
            .form-field { display: flex; flex-direction: column; }
            .form-field label { font-weight: bold; margin-bottom: 0.5rem; }
            .form-field input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
            @media print {
              body { margin: 1rem; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Gram Panchayat Data Collection Form</h1>
          <div class="form-section">
            <h2>Mouza Details</h2>
            <div class="form-grid">
              <div class="form-field"><label>Mouza Name:</label><input type="text" /></div>
              <div class="form-field"><label>J.L. No.:</label><input type="text" /></div>
              <div class="form-field"><label>Total Households:</label><input type="number" /></div>
            </div>
          </div>
          <div class="form-section">
            <h2>Population Details</h2>
            <div class="form-grid">
              <div class="form-field"><label>Male:</label><input type="number" /></div>
              <div class="form-field"><label>Female:</label><input type="number" /></div>
              <div class="form-field"><label>ST:</label><input type="number" /></div>
              <div class="form-field"><label>SC:</label><input type="number" /></div>
              <div class="form-field"><label>OBC:</label><input type="number" /></div>
              <div class="form-field"><label>Hindu:</label><input type="number" /></div>
              <div class="form-field"><label>Muslim:</label><input type="number" /></div>
            </div>
          </div>
          <div class="form-section">
            <h2>Voter Summary</h2>
            <div class="form-grid">
              <div class="form-field"><label>Total Male Voter:</label><input type="number" /></div>
              <div class="form-field"><label>Total Female Voter:</label><input type="number" /></div>
              <div class="form-field"><label>SC Male Voter:</label><input type="number" /></div>
              <div class="form-field"><label>SC Female Voter:</label><input type="number" /></div>
              <div class="form-field"><label>ST Male Voter:</label><input type="number" /></div>
              <div class="form-field"><label>ST Female Voter:</label><input type="number" /></div>
            </div>
          </div>
          <button class="no-print" onclick="window.print()">Print</button>
        </body>
      </html>
    `;
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(formHtml);
      newWindow.document.close();
    }
  };

  const handleViewDetails = async (mouzaId: string) => {
    setIsLoadingDetails(true);
    setIsDetailsOpen(true);
    const res = await getVillageDetails(mouzaId, financialYear);
    if (res.success) {
      setSelectedMouzaDetails(res.data);
    }
    setIsLoadingDetails(false);
  };

  const totalMouzas = overview.length;
  const totalHouseholds = overview.reduce(
    (sum, item) => sum + (item.householdCount || 0),
    0,
  );
  const totalPopulation = overview.reduce(
    (sum, item) => sum + (item.totalPopulation || 0),
    0,
  );
  const surveyCompletion =
    totalMouzas > 0
      ? Math.round(
          (overview.filter((item) => item.householdCount > 0).length /
            totalMouzas) *
            100,
        )
      : 0;
  const totalSansads = sansads.filter(
    (s) => s.financialYear === financialYear,
  ).length;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-600 rounded-xl shadow-blue-200 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Village Summary Report
            </h1>
            <p className="text-gray-500">
              Comprehensive overview of Gram Panchayat demographics and
              infrastructure
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white p-2 rounded-xl border shadow-sm">
          <Calendar className="h-5 w-5 text-blue-500 ml-2" />
          <Select value={financialYear} onValueChange={setFinancialYear}>
            <SelectTrigger className="w-[160px] border-none focus:ring-0 shadow-none font-semibold">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023-24">FY 2023-24</SelectItem>
              <SelectItem value="2024-25">FY 2024-25</SelectItem>
              <SelectItem value="2025-26">FY 2025-26</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                Live
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-gray-500 text-sm font-medium">
                Total Mouzas
              </h3>
              <p className="text-3xl font-black text-gray-900">{totalMouzas}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <Users2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-gray-500 text-sm font-medium">
                Recorded Households
              </h3>
              <p className="text-3xl font-black text-gray-900">
                {totalHouseholds.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                <BarChart3 className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-gray-500 text-sm font-medium">
                Survey Completion
              </h3>
              <p className="text-3xl font-black text-gray-900">
                {surveyCompletion}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-all group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <LayoutDashboard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-gray-500 text-sm font-medium">
                Total Sansads
              </h3>
              <p className="text-3xl font-black text-gray-900">
                {totalSansads}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
        <CardHeader className="border-b bg-gray-50/50 flex flex-row items-center justify-between py-4 px-6">
          <div className="flex items-center space-x-3">
            <Search className="h-5 w-5 text-gray-400" />
            <CardTitle className="text-lg font-bold text-gray-800">
              Mouza-wise Detailed Status
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center space-x-2 border-gray-200 hover:bg-gray-100"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center space-x-2 border-gray-200 hover:bg-gray-100"
            onClick={handleGenerateBlankForm}
          >
            <Download className="h-4 w-4" />
            <span>Generate Blank Form</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow>
                <TableHead className="font-bold text-gray-700 pl-8 h-12">
                  Mouza Name
                </TableHead>
                <TableHead className="font-bold text-gray-700 h-12">
                  J.L. Number
                </TableHead>
                <TableHead className="font-bold text-gray-700 h-12">
                  Verification Status
                </TableHead>
                <TableHead className="font-bold text-gray-700 h-12 text-right pr-8">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mouzas.map((mouza) => (
                <TableRow
                  key={mouza.id}
                  className="hover:bg-gray-50/80 transition-colors border-b last:border-0"
                >
                  <TableCell className="font-semibold text-gray-900 pl-8 py-4">
                    {mouza.name}
                  </TableCell>
                  <TableCell className="text-gray-600 py-4">
                    {mouza.jlno}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                        Active & Verified
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold"
                      onClick={() => handleViewDetails(mouza.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {mouzas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-24">
                    <div className="flex flex-col items-center space-y-3 opacity-30">
                      <FileText className="h-16 w-16" />
                      <p className="text-lg font-medium">
                        No report data found for FY {financialYear}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              <span>
                Detailed Report:{" "}
                {selectedMouzaDetails?.mouza?.name || "Loading..."}
              </span>
            </DialogTitle>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 animate-pulse font-medium">
                Fetching detailed data...
              </p>
            </div>
          ) : selectedMouzaDetails ? (
            <div className="space-y-8 py-4">
              {/* Overview Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-none">
                  <CardContent className="p-4">
                    <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-1">
                      J.L. Number
                    </p>
                    <p className="text-2xl font-black text-blue-900">
                      {selectedMouzaDetails.mouza.jlno}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-none">
                  <CardContent className="p-4">
                    <p className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-1">
                      Households
                    </p>
                    <p className="text-2xl font-black text-emerald-900">
                      {selectedMouzaDetails.households}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-none">
                  <CardContent className="p-4">
                    <p className="text-purple-600 text-sm font-bold uppercase tracking-wider mb-1">
                      Financial Year
                    </p>
                    <p className="text-2xl font-black text-purple-900">
                      {financialYear}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Population Card */}
                <Card className="border-gray-100 shadow-sm">
                  <CardHeader className="bg-gray-50/50 border-b py-3 px-4">
                    <CardTitle className="text-base font-bold flex items-center space-x-2">
                      <Users2 className="h-4 w-4 text-blue-600" />
                      <span>Population Demographics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {selectedMouzaDetails.population ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="text-gray-600">
                            Total Population
                          </span>
                          <span className="font-bold">
                            {selectedMouzaDetails.population.male +
                              selectedMouzaDetails.population.female}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50/50 p-2 rounded">
                            <p className="text-xs text-blue-600 font-bold uppercase">
                              Male
                            </p>
                            <p className="text-lg font-bold">
                              {selectedMouzaDetails.population.male}
                            </p>
                          </div>
                          <div className="bg-pink-50/50 p-2 rounded">
                            <p className="text-xs text-pink-600 font-bold uppercase">
                              Female
                            </p>
                            <p className="text-lg font-bold">
                              {selectedMouzaDetails.population.female}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Scheduled Caste (SC)
                            </span>
                            <span className="font-medium">
                              {selectedMouzaDetails.population.sc}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Scheduled Tribe (ST)
                            </span>
                            <span className="font-medium">
                              {selectedMouzaDetails.population.st}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">OBC</span>
                            <span className="font-medium">
                              {selectedMouzaDetails.population.obc}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic py-4 text-center">
                        No population data available
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Voter Card */}
                <Card className="border-gray-100 shadow-sm">
                  <CardHeader className="bg-gray-50/50 border-b py-3 px-4">
                    <CardTitle className="text-base font-bold flex items-center space-x-2">
                      <Search className="h-4 w-4 text-emerald-600" />
                      <span>Electoral Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {selectedMouzaDetails.voter ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="text-gray-600">Total Voters</span>
                          <span className="font-bold">
                            {selectedMouzaDetails.voter.totalMaleVoter +
                              selectedMouzaDetails.voter.totalFemaleVoter}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-emerald-50/50 p-2 rounded">
                            <p className="text-xs text-emerald-600 font-bold uppercase">
                              Male
                            </p>
                            <p className="text-lg font-bold">
                              {selectedMouzaDetails.voter.totalMaleVoter}
                            </p>
                          </div>
                          <div className="bg-orange-50/50 p-2 rounded">
                            <p className="text-xs text-orange-600 font-bold uppercase">
                              Female
                            </p>
                            <p className="text-lg font-bold">
                              {selectedMouzaDetails.voter.totalFemaleVoter}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">SC Voters</span>
                            <span className="font-medium">
                              {selectedMouzaDetails.voter.scMaleVoter +
                                selectedMouzaDetails.voter.scFemaleVoter}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">ST Voters</span>
                            <span className="font-medium">
                              {selectedMouzaDetails.voter.stMaleVoter +
                                selectedMouzaDetails.voter.stFemaleVoter}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic py-4 text-center">
                        No voter data available
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Infrastructure Card (Water & Toilet) */}
                <Card className="border-gray-100 shadow-sm">
                  <CardHeader className="bg-gray-50/50 border-b py-3 px-4">
                    <CardTitle className="text-base font-bold flex items-center space-x-2">
                      <LayoutDashboard className="h-4 w-4 text-amber-600" />
                      <span>Infrastructure & Sanitation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-6">
                    {/* Water */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Water Sources
                      </h4>
                      {selectedMouzaDetails.water ? (
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div className="flex justify-between pr-4">
                            <span className="text-gray-500">Tap Water</span>
                            <span className="font-medium">
                              {selectedMouzaDetails.water.tapWater}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Hand Pump</span>
                            <span className="font-medium">
                              {selectedMouzaDetails.water.handPump}
                            </span>
                          </div>
                          <div className="flex justify-between pr-4">
                            <span className="text-gray-500">Well</span>
                            <span className="font-medium">
                              {selectedMouzaDetails.water.well}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Pond</span>
                            <span className="font-medium">
                              {selectedMouzaDetails.water.pond}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          No water data
                        </p>
                      )}
                    </div>

                    {/* Toilet */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        Sanitation Status
                      </h4>
                      {selectedMouzaDetails.toilet ? (
                        <div className="space-y-2">
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                            <div
                              className="bg-emerald-500 h-full"
                              style={{
                                width: `${(selectedMouzaDetails.toilet.toiletAvailable / selectedMouzaDetails.toilet.totalHousehold) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <div className="h-2 w-2 rounded-full bg-emerald-500" />
                              <span className="text-gray-500">
                                Available:{" "}
                                {selectedMouzaDetails.toilet.toiletAvailable}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="h-2 w-2 rounded-full bg-gray-300" />
                              <span className="text-gray-500">
                                Not Available:{" "}
                                {selectedMouzaDetails.toilet.toiletNotAvailable}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          No sanitation data
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Education Card */}
                <Card className="border-gray-100 shadow-sm">
                  <CardHeader className="bg-gray-50/50 border-b py-3 px-4">
                    <CardTitle className="text-base font-bold flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <span>Education Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {selectedMouzaDetails.education ? (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-gray-600">Illiterate</span>
                          <span className="font-bold text-rose-600">
                            {selectedMouzaDetails.education.illiterate}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-gray-600">Primary</span>
                          <span className="font-bold">
                            {selectedMouzaDetails.education.primary}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-gray-600">Secondary</span>
                          <span className="font-bold">
                            {selectedMouzaDetails.education.secondary}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-gray-600">
                            Higher Secondary
                          </span>
                          <span className="font-bold">
                            {selectedMouzaDetails.education.higher}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-gray-600">
                            Graduate & Above
                          </span>
                          <span className="font-bold text-emerald-600">
                            {selectedMouzaDetails.education.graduate}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic py-4 text-center">
                        No education data available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              Failed to load details. Please try again.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
