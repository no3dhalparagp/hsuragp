"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getMouzaList, updateMouza } from "@/action/villagemanage";
import { Pencil, Save, X, Calendar } from "lucide-react";

type Mouza = { id: string; name: string; jlno: string };

export default function Page() {
  const [financialYear, setFinancialYear] = useState("2024-25");
  const [mouzas, setMouzas] = useState<Mouza[]>([]);
  const [editing, setEditing] = useState<
    Record<string, { name: string; jlno: string }>
  >({});

  const loadData = useCallback(async () => {
    const data = await getMouzaList(financialYear);
    setMouzas(data);
  }, [financialYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const startEdit = (id: string, name: string, jlno: string) => {
    setEditing((prev) => ({ ...prev, [id]: { name, jlno } }));
  };

  const cancelEdit = (id: string) => {
    setEditing((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const saveEdit = async (id: string) => {
    const data = editing[id];
    if (!data) return;
    const form = new FormData();
    form.append("id", id);
    form.append("name", data.name);
    form.append("jlno", data.jlno);
    const res = await updateMouza(form);
    if (res.success) {
      toast.success(res.message);
      await loadData();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-blue-600" />
        <Select value={financialYear} onValueChange={setFinancialYear}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023-24">2023-24</SelectItem>
            <SelectItem value="2024-25">2024-25</SelectItem>
            <SelectItem value="2025-26">2025-26</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Mouza Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>J.L. No.</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mouzas.map((m) => {
                const isEditing = !!editing[m.id];
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      {isEditing ? (
                        <div className="space-y-1">
                          <Label className="text-xs">Name</Label>
                          <Input
                            value={editing[m.id].name}
                            onChange={(e) =>
                              setEditing((prev) => ({
                                ...prev,
                                [m.id]: { ...prev[m.id], name: e.target.value },
                              }))
                            }
                          />
                        </div>
                      ) : (
                        <span className="font-medium">{m.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <div className="space-y-1">
                          <Label className="text-xs">J.L. No.</Label>
                          <Input
                            value={editing[m.id].jlno}
                            onChange={(e) =>
                              setEditing((prev) => ({
                                ...prev,
                                [m.id]: { ...prev[m.id], jlno: e.target.value },
                              }))
                            }
                          />
                        </div>
                      ) : (
                        <span>{m.jlno}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelEdit(m.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => saveEdit(m.id)}>
                            <Save className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(m.id, m.name, m.jlno)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {mouzas.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-6 text-gray-400"
                  >
                    No records
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
