"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

// Types
interface Village {
  id: string;
  name: string;
  jlNo?: string;
}

interface EducationData {
  id?: string;
  villageId: string;
  year: number;
  ssk: number;
  anganwadi: number;
  primarySchool: number;
  highSchool: number;
  madrasah: number;
  juniorHigh: number;
  higherSecondary: number;
  college: number;
}

export default function EducationPage() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [educationList, setEducationList] = useState<EducationData[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<EducationData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EducationData>({
    defaultValues: {
      villageId: "",
      year: new Date().getFullYear(),
      ssk: 0,
      anganwadi: 0,
      primarySchool: 0,
      highSchool: 0,
      madrasah: 0,
      juniorHigh: 0,
      higherSecondary: 0,
      college: 0,
    },
  });

  // Fetch villages
  useEffect(() => {
    fetch("/api/villages")
      .then((res) => res.json())
      .then((data) => setVillages(Array.isArray(data) ? data : []));
  }, []);

  // Fetch education data for selected village
  useEffect(() => {
    if (selectedVillage) {
      setLoading(true);
      fetch(`/api/manage-villages/education?villageId=${selectedVillage}`)
        .then((res) => res.json())
        .then((data) => setEducationList(data))
        .finally(() => setLoading(false));
    } else {
      setEducationList([]);
    }
  }, [selectedVillage]);

  // Open dialog for add
  const handleAdd = () => {
    reset({
      villageId: selectedVillage,
      year: selectedYear,
      ssk: 0,
      anganwadi: 0,
      primarySchool: 0,
      highSchool: 0,
      madrasah: 0,
      juniorHigh: 0,
      higherSecondary: 0,
      college: 0,
    });
    setEditData(null);
    setOpen(true);
  };

  // Open dialog for edit
  const handleEdit = (data: EducationData) => {
    reset(data);
    setEditData(data);
    setOpen(true);
  };

  // Submit form
  const onSubmit = async (data: EducationData) => {
    setLoading(true);
    const method = editData ? "PUT" : "POST";
    const url = editData
      ? `/api/manage-villages/education/${editData.id}`
      : "/api/manage-villages/education";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast({
        title: editData ? "Updated successfully" : "Added successfully",
      });
      setOpen(false);
      // Refresh list
      fetch(`/api/manage-villages/education?villageId=${selectedVillage}`)
        .then((res) => res.json())
        .then((data) => setEducationList(data));
    } else {
      toast({
        title: "Failed to save data",
      });
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Village Education Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <select
            className="border rounded px-2 py-1"
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
          >
            <option value="">Select Village</option>
            {villages.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from(
              { length: 10 },
              (_, i) => new Date().getFullYear() - i
            ).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <Button onClick={handleAdd} disabled={!selectedVillage}>
            Add Education Data
          </Button>
        </div>
        {/* Table of education data */}
        <div className="overflow-x-auto">
          <table className="w-full border text-xs">
            <thead>
              <tr>
                <th className="border px-2 py-1">Year</th>
                <th className="border px-2 py-1">SSK</th>
                <th className="border px-2 py-1">Anganwadi</th>
                <th className="border px-2 py-1">Primary School</th>
                <th className="border px-2 py-1">High School</th>
                <th className="border px-2 py-1">Madrasah</th>
                <th className="border px-2 py-1">Junior High</th>
                <th className="border px-2 py-1">Higher Secondary</th>
                <th className="border px-2 py-1">College</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : educationList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center">
                    No data found
                  </td>
                </tr>
              ) : (
                educationList.map((row) => (
                  <tr key={row.id}>
                    <td className="border px-2 py-1">{row.year}</td>
                    <td className="border px-2 py-1">{row.ssk}</td>
                    <td className="border px-2 py-1">{row.anganwadi}</td>
                    <td className="border px-2 py-1">{row.primarySchool}</td>
                    <td className="border px-2 py-1">{row.highSchool}</td>
                    <td className="border px-2 py-1">{row.madrasah}</td>
                    <td className="border px-2 py-1">{row.juniorHigh}</td>
                    <td className="border px-2 py-1">{row.higherSecondary}</td>
                    <td className="border px-2 py-1">{row.college}</td>
                    <td className="border px-2 py-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(row)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Dialog for add/edit */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editData ? "Edit" : "Add"} Education Data
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs">Year</label>
                  <Input
                    type="number"
                    {...register("year", { required: true })}
                    min={2000}
                    max={2100}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs">SSK</label>
                  <Input
                    type="number"
                    {...register("ssk", { required: true, min: 0 })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs">Anganwadi</label>
                  <Input
                    type="number"
                    {...register("anganwadi", { required: true, min: 0 })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs">Primary School</label>
                  <Input
                    type="number"
                    {...register("primarySchool", { required: true, min: 0 })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs">High School</label>
                  <Input
                    type="number"
                    {...register("highSchool", { required: true, min: 0 })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs">Madrasah</label>
                  <Input
                    type="number"
                    {...register("madrasah", { required: true, min: 0 })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs">Junior High</label>
                  <Input
                    type="number"
                    {...register("juniorHigh", { required: true, min: 0 })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs">Higher Secondary</label>
                  <Input
                    type="number"
                    {...register("higherSecondary", { required: true, min: 0 })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs">College</label>
                  <Input
                    type="number"
                    {...register("college", { required: true, min: 0 })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {editData ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
