"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  addSansad,
  getSansadList,
  updateSansad,
  deleteSansad,
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
import { Users, Plus, List, Pencil, Save, X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SansadForm } from "@/components/village-forms/SansadForm";

export default function SansadPage() {
  const [sansads, setSansads] = useState<any[]>([]);
  const [financialYear, setFinancialYear] = useState("2024-25");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSansad, setEditingSansad] = useState<any | null>(null);

  const loadSansads = useCallback(async () => {
    const data = await getSansadList(financialYear);
    setSansads(data);
  }, [financialYear]);

  useEffect(() => {
    loadSansads();
  }, [loadSansads]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    const result = await addSansad(formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      loadSansads();
    } else {
      toast.error(result.message);
    }
  };

  const onUpdate = async (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    formData.append("id", editingSansad.id);

    const result = await updateSansad(formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      loadSansads();
      setIsEditDialogOpen(false);
      setEditingSansad(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleEditClick = (sansad: any) => {
    setEditingSansad(sansad);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Sansad?")) return;
    const form = new FormData();
    form.append("id", id);
    const res = await deleteSansad(form);
    if (res.success) {
      toast.success(res.message);
      loadSansads();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-6">
      <div className="flex items-center space-x-4 mb-2">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Sansad Management
          </h1>
          <p className="text-gray-500">
            Manage Sansad constituencies and their numbers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-sm border-gray-200 h-fit">
          <CardHeader className="border-b bg-white/50">
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-xl">Add New Sansad</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <SansadForm
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              defaultValues={{ financialYear }}
              financialYear={financialYear}
              onFinancialYearChange={setFinancialYear}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm border-gray-200">
          <CardHeader className="border-b bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <List className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-xl">Existing Sansads</CardTitle>
              </div>
              <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                FY {financialYear}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-bold text-gray-700 pl-6">
                    Sansad Name
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Sansad Number
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 text-right pr-6">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sansads.map((sansad) => {
                  return (
                    <TableRow
                      key={sansad.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900 pl-6 w-1/3">
                        {sansad.sansadname}
                      </TableCell>
                      <TableCell className="text-gray-600 w-1/3">
                        {sansad.sansadnumber}
                      </TableCell>
                      <TableCell className="text-right pr-6 w-1/3 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(sansad)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(sansad.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {sansads.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-12 text-gray-400 italic"
                    >
                      No sansads found for the selected financial year.
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
            <DialogTitle>Edit Sansad</DialogTitle>
          </DialogHeader>
          <SansadForm
            onSubmit={onUpdate}
            isSubmitting={isSubmitting}
            defaultValues={editingSansad}
            financialYear={financialYear}
            onFinancialYearChange={setFinancialYear}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
