"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  addMouzaname,
  getMouzaList,
  updateMouza,
  deleteMouza,
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
import { MapPin, Plus, List, Pencil, Save, X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MouzaForm } from "@/components/village-forms/MouzaForm";

export default function MouzaPage() {
  const [mouzas, setMouzas] = useState<any[]>([]);
  const [financialYear, setFinancialYear] = useState("2024-25");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMouza, setEditingMouza] = useState<any | null>(null);

  const loadMouzas = useCallback(async () => {
    const data = await getMouzaList(financialYear);
    setMouzas(data);
  }, [financialYear]);

  useEffect(() => {
    loadMouzas();
  }, [loadMouzas]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    const result = await addMouzaname(formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      loadMouzas();
    } else {
      toast.error(result.message);
    }
  };

  const onUpdate = async (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    formData.append("id", editingMouza.id);

    const result = await updateMouza(formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      loadMouzas();
      setIsEditDialogOpen(false);
      setEditingMouza(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleEditClick = (mouza: any) => {
    setEditingMouza(mouza);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Mouza?")) return;
    const form = new FormData();
    form.append("id", id);
    const res = await deleteMouza(form);
    if (res.success) {
      toast.success(res.message);
      loadMouzas();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 space-y-6">
      <div className="flex items-center space-x-4 mb-2">
        <div className="p-2 bg-blue-600 rounded-lg">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Mouza Management
          </h1>
          <p className="text-gray-500">
            Manage village administrative boundaries and J.L. numbers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-sm border-gray-200 h-fit">
          <CardHeader className="border-b bg-white/50">
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl">Add New Mouza</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <MouzaForm
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              defaultValues={{ financialYear }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm border-gray-200">
          <CardHeader className="border-b bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <List className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-xl">Existing Mouzas</CardTitle>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                FY {financialYear}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-bold text-gray-700 pl-6">
                    Mouza Name
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    J.L. No.
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Total Households
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 text-right pr-6">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mouzas.map((mouza) => {
                  return (
                    <TableRow
                      key={mouza.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900 pl-6 w-1/4">
                        {mouza.name}
                      </TableCell>
                      <TableCell className="text-gray-600 w-1/4">
                        {mouza.jlno}
                      </TableCell>
                      <TableCell className="text-gray-600 w-1/4">
                        {mouza.totalHouseholds || 0}
                      </TableCell>
                      <TableCell className="text-right pr-6 w-1/4 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(mouza)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(mouza.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {mouzas.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-12 text-gray-400 italic"
                    >
                      No mouzas found for the selected financial year.
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
            <DialogTitle>Edit Mouza</DialogTitle>
          </DialogHeader>
          <MouzaForm
            onSubmit={onUpdate}
            isSubmitting={isSubmitting}
            defaultValues={editingMouza}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
