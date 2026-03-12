"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  addPopulation,
  getPopulationList,
  updatePopulation,
  deletePopulation,
  getMouzaList,
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
import { Users, Info, List, Pencil, Save, X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PopulationForm } from "@/components/village-forms/PopulationForm";

export default function PopulationPage() {
  const [mouzas, setMouzas] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [financialYear, setFinancialYear] = useState("2024-25");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  const loadData = useCallback(async () => {
    const [mouzaData, populationData] = await Promise.all([
      getMouzaList(financialYear),
      getPopulationList(financialYear),
    ]);
    setMouzas(mouzaData);
    setRecords(populationData);
  }, [financialYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    const result = await addPopulation(formData);
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
    formData.append("id", editingRecord.id);

    const result = await updatePopulation(formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      loadData();
      setIsEditDialogOpen(false);
      setEditingRecord(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleEditClick = (record: any) => {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    const form = new FormData();
    form.append("id", id);
    const res = await deletePopulation(form);
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
        <div className="p-2 bg-emerald-600 rounded-lg">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Population Entry
          </h1>
          <p className="text-gray-500">
            Record detailed demographic and religious data per Mouza
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-xl">
                  Enter Population Details
                </CardTitle>
              </div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                FY {financialYear}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <PopulationForm
              onSubmit={onSubmit}
              mouzas={mouzas}
              isSubmitting={isSubmitting}
              defaultValues={{ financialYear }}
              financialYear={financialYear}
              onFinancialYearChange={setFinancialYear}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <List className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-xl">Existing Records</CardTitle>
              </div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
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
                    Male
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Female
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">ST</TableHead>
                  <TableHead className="font-bold text-gray-700">SC</TableHead>
                  <TableHead className="font-bold text-gray-700">OBC</TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Hindu
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Muslim
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 text-right pr-6">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => {
                  return (
                    <TableRow
                      key={r.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900 pl-6">
                        {r.mouza?.name}
                      </TableCell>
                      <TableCell className="text-gray-600">{r.male}</TableCell>
                      <TableCell className="text-gray-600">
                        {r.female}
                      </TableCell>
                      <TableCell className="text-gray-600">{r.st}</TableCell>
                      <TableCell className="text-gray-600">{r.sc}</TableCell>
                      <TableCell className="text-gray-600">{r.obc}</TableCell>
                      <TableCell className="text-gray-600">{r.hindu}</TableCell>
                      <TableCell className="text-gray-600">
                        {r.muslim}
                      </TableCell>
                      <TableCell className="text-right pr-6 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(r)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(r.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {records.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Population Details</DialogTitle>
          </DialogHeader>
          <PopulationForm
            onSubmit={onUpdate}
            mouzas={mouzas}
            isSubmitting={isSubmitting}
            defaultValues={editingRecord}
            financialYear={financialYear}
            onFinancialYearChange={setFinancialYear}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
