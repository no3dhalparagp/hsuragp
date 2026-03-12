"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  addPopulationSummary,
  getPopulationSummaryList,
  updatePopulationSummary,
  deletePopulationSummary,
  getMouzaList,
  getPopulationSummary,
} from "@/action/villagemanage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Plus, List, Pencil, Save, X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PopulationSummaryForm } from "@/components/village-forms/PopulationSummaryForm";

export default function PopulationSummaryPage() {
  const [mouzas, setMouzas] = useState<any[]>([]);
  const [summaries, setSummaries] = useState<any[]>([]);
  const [financialYear, setFinancialYear] = useState("2024-25");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSummary, setEditingSummary] = useState<any | null>(null);

  const [previousYearData, setPreviousYearData] = useState<any | null>(null);

  const loadData = useCallback(async () => {
    const [mouzaData, summaryData] = await Promise.all([
      getMouzaList(financialYear),
      getPopulationSummaryList(financialYear),
    ]);
    setMouzas(mouzaData);
    setSummaries(summaryData);
  }, [financialYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMouzaChange = async (mouzaId: string) => {
    if (!mouzaId) {
      setPreviousYearData(null);
      return;
    }
    const prevYear = `${parseInt(financialYear.split("-")[0]) - 1}-${parseInt(financialYear.split("-")[1]) - 1}`;
    const data = await getPopulationSummary(mouzaId, prevYear);
    setPreviousYearData(data);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    const result = await addPopulationSummary(formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.message);
    }
  };

  const onUpdate = async (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    formData.append("id", editingSummary.id);
    const result = await updatePopulationSummary(formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      loadData();
      setIsEditDialogOpen(false);
      setEditingSummary(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleEditClick = (summary: any) => {
    setEditingSummary(summary);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    const form = new FormData();
    form.append("id", id);
    const res = await deletePopulationSummary(form);
    if (res.success) {
      toast.success(res.message);
      loadData();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-6">
      <div className="flex items-center space-x-4 mb-2">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-indigo-200 shadow-lg">
          <PieChart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Population Summary
          </h1>
          <p className="text-gray-500">
            Consolidated demographic breakdown per Mouza
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="shadow-md border-indigo-100 overflow-hidden">
          <CardHeader className="border-b bg-indigo-50/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-xl text-indigo-900">
                  Summary Data Entry
                </CardTitle>
              </div>
              <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                FY {financialYear}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <PopulationSummaryForm
              onSubmit={onSubmit}
              mouzas={mouzas}
              isSubmitting={isSubmitting}
              defaultValues={{ financialYear, ...previousYearData }}
              financialYear={financialYear}
              onFinancialYearChange={setFinancialYear}
              onMouzaChange={handleMouzaChange}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <List className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-xl">Existing Records</CardTitle>
              </div>
              <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                FY {financialYear}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-bold text-gray-700 pl-6">
                    Mouza
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Total Male
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Total Female
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    SC Male
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    SC Female
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    ST Male
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    ST Female
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    OBC Male
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    OBC Female
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 text-right pr-6">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaries.map((s) => {
                  return (
                    <TableRow
                      key={s.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900 pl-6">
                        {s.mouza?.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {s.totalMale}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {s.totalFemale}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {s.scMale}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {s.scFemale}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {s.stMale}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {s.stFemale}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {s.obcMale}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {s.obcFemale}
                      </TableCell>
                      <TableCell className="text-right pr-6 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(s)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(s.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {summaries.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-12 text-gray-400 italic"
                    >
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Population Summary</DialogTitle>
          </DialogHeader>
          <PopulationSummaryForm
            onSubmit={onUpdate}
            mouzas={mouzas}
            isSubmitting={isSubmitting}
            defaultValues={editingSummary}
            financialYear={financialYear}
            onFinancialYearChange={setFinancialYear}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
