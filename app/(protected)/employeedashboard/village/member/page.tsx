"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  addMember,
  getMemberList,
  updateMember,
  deleteMember,
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
import { UserPlus, Plus, List, Pencil, Save, X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberForm } from "@/components/village-forms/MemberForm";

export default function MemberPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [financialYear, setFinancialYear] = useState("2024-25");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);

  const loadData = useCallback(async () => {
    const data = await getMemberList(financialYear);
    setMembers(data);
  }, [financialYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    const result = await addMember(formData);
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
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    formData.append("id", editingMember.id);

    const result = await updateMember(formData);
    setIsSubmitting(false);
    if (result.success) {
      toast.success(result.message);
      loadData();
      setIsEditDialogOpen(false);
      setEditingMember(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleEditClick = (member: any) => {
    setEditingMember(member);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    const form = new FormData();
    form.append("id", id);
    const res = await deleteMember(form);
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
        <div className="p-2 bg-purple-600 rounded-lg">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Member Management
          </h1>
          <p className="text-gray-500">
            Register and manage Gram Panchayat members and personnel
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-xl">
                  Add New Member Registration
                </CardTitle>
              </div>
              <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                FY {financialYear}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <MemberForm
              onSubmit={onSubmit}
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
                <List className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-xl">Existing Members</CardTitle>
              </div>
              <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                FY {financialYear}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-bold text-gray-700 pl-6">
                    First Name
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Last Name
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Contact
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Aadhar
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 text-right pr-6">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => {
                  return (
                    <TableRow
                      key={m.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="text-gray-900 pl-6">
                        {m.firstName}
                      </TableCell>
                      <TableCell className="text-gray-900">
                        {m.lastName}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {m.contactNo}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {m.aadhar}
                      </TableCell>
                      <TableCell className="text-right pr-6 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(m)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(m.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {members.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-12 text-gray-400 italic"
                    >
                      No members found for the selected financial year.
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
            <DialogTitle>Edit Member Registration</DialogTitle>
          </DialogHeader>
          <MemberForm
            onSubmit={onUpdate}
            isSubmitting={isSubmitting}
            defaultValues={editingMember}
            financialYear={financialYear}
            onFinancialYearChange={setFinancialYear}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
