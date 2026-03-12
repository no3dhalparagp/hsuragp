"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler, Plus, Trash2 } from "lucide-react";

interface Measurement {
  id: string;
  description: string;
  nos: number;
  length: number;
  breadth: number;
  depth: number;
  quantity: number;
  estimateItemId?: string;
  isSubItem?: boolean;
}

interface EstimateItem {
  id: string;
  description: string;
  unit: string;
  rate: number;
  subItems?: any[];
}

interface MBMeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimateItem: EstimateItem | null;
  onSave: (
    measurements: Measurement[],
    totalQuantity: number,
    metadata: any,
  ) => void;
  initialMeasurements: Measurement[];
  initialMetadata: {
    mbNumber: string;
    mbPageNumber: string;
    measuredDate: string;
    measuredBy: string;
    checkedBy?: string;
  };
}

export default function MBMeasurementDialog({
  open,
  onOpenChange,
  estimateItem,
  onSave,
  initialMeasurements,
  initialMetadata,
}: MBMeasurementDialogProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [metadata, setMetadata] = useState(initialMetadata);

  /* ------------------------ INITIAL LOAD ------------------------ */

  useEffect(() => {
    if (!open || !estimateItem) return;

    if (initialMeasurements.length > 0) {
      setMeasurements(initialMeasurements);
    } else {
      const mainRow: Measurement = {
        id: crypto.randomUUID(),
        description: estimateItem.description,
        nos: 0,
        length: 0,
        breadth: 0,
        depth: 0,
        quantity: 0,
        estimateItemId: estimateItem.id,
        isSubItem: false,
      };

      if (estimateItem.subItems?.length) {
        const subRows = estimateItem.subItems.map((sub) => ({
          id: crypto.randomUUID(),
          description: sub.description,
          nos: 0,
          length: 0,
          breadth: 0,
          depth: 0,
          quantity: 0,
          estimateItemId: estimateItem.id,
          isSubItem: true,
        }));
        setMeasurements([mainRow, ...subRows]);
      } else {
        setMeasurements([mainRow]);
      }
    }

    setMetadata(initialMetadata);
  }, [open]);

  /* ------------------------ SERIAL NUMBER ------------------------ */

  const getDisplaySlNo = (index: number) => {
    let mainCounter = 0;
    let subCounter = 0;

    for (let i = 0; i <= index; i++) {
      if (!measurements[i].isSubItem) {
        mainCounter++;
        subCounter = 0;
      } else {
        subCounter++;
      }
    }

    return subCounter > 0
      ? `${mainCounter}.${subCounter}`
      : `${mainCounter}`;
  };

  /* ------------------------ ADD MAIN ITEM ------------------------ */

  const handleAddMain = () => {
    setMeasurements((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: estimateItem?.description || "",
        nos: 0,
        length: 0,
        breadth: 0,
        depth: 0,
        quantity: 0,
        estimateItemId: estimateItem?.id,
        isSubItem: false,
      },
    ]);
  };

  /* ------------------------ ADD SUB ITEM ------------------------ */

  const handleAddSub = (parentIndex: number) => {
    let insertIndex = parentIndex + 1;

    while (
      insertIndex < measurements.length &&
      measurements[insertIndex].isSubItem
    ) {
      insertIndex++;
    }

    const newSub: Measurement = {
      id: crypto.randomUUID(),
      description: "Sub-item",
      nos: 0,
      length: 0,
      breadth: 0,
      depth: 0,
      quantity: 0,
      estimateItemId: estimateItem?.id,
      isSubItem: true,
    };

    const updated = [...measurements];
    updated.splice(insertIndex, 0, newSub);
    setMeasurements(updated);
  };

  /* ------------------------ DELETE LOGIC ------------------------ */

  const handleRemove = (id: string) => {
    const index = measurements.findIndex((m) => m.id === id);
    if (index === -1) return;

    const target = measurements[index];

    if (!target.isSubItem) {
      let deleteUntil = index + 1;
      while (
        deleteUntil < measurements.length &&
        measurements[deleteUntil].isSubItem
      ) {
        deleteUntil++;
      }

      setMeasurements([
        ...measurements.slice(0, index),
        ...measurements.slice(deleteUntil),
      ]);
    } else {
      setMeasurements(measurements.filter((m) => m.id !== id));
    }
  };

  /* ------------------------ UPDATE FIELD ------------------------ */

  const handleChange = (
    id: string,
    field: keyof Measurement,
    value: number | string,
  ) => {
    setMeasurements((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;

        if (field === "description") {
          return { ...m, description: String(value) };
        }

        const numValue =
          typeof value === "string" ? parseFloat(value) || 0 : value;

        const updated = { ...m, [field]: numValue };

        const nos = updated.nos ?? 0;
        const length = updated.length ?? 0;
        const breadth = updated.breadth ?? 0;
        const depth = updated.depth ?? 0;

        const hasValue =
          nos > 0 || length > 0 || breadth > 0 || depth > 0;

        if (!hasValue) {
          updated.quantity = 0;
        } else {
          const safeNos = nos || 1;
          const safeLength = length || 1;
          const safeBreadth = breadth || 1;
          const safeDepth = depth || 1;

          updated.quantity =
            safeNos * safeLength * safeBreadth * safeDepth;
        }

        return updated;
      }),
    );
  };

  /* ------------------------ TOTAL ------------------------ */

  const totalQuantity = useMemo(() => {
    return measurements.reduce((sum, m) => sum + m.quantity, 0);
  }, [measurements]);

  const totalAmount = totalQuantity * (estimateItem?.rate || 0);

  /* ------------------------ SAVE ------------------------ */

  const handleSave = () => {
    if (!metadata.mbNumber.trim()) {
      alert("MB Number is required");
      return;
    }

    if (!metadata.measuredBy.trim()) {
      alert("Measured By is required");
      return;
    }

    if (totalQuantity <= 0) {
      alert("Total quantity cannot be zero");
      return;
    }

    onSave(measurements, totalQuantity, metadata);
  };

  if (!estimateItem) return null;

  /* ======================== UI ======================== */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Add Measurements – {estimateItem.description}
          </DialogTitle>
        </DialogHeader>

        {/* MB DETAILS */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
          <div>
            <Label>MB Number</Label>
            <Input
              value={metadata.mbNumber}
              onChange={(e) =>
                setMetadata({ ...metadata, mbNumber: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Page No</Label>
            <Input
              value={metadata.mbPageNumber}
              onChange={(e) =>
                setMetadata({
                  ...metadata,
                  mbPageNumber: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={metadata.measuredDate}
              onChange={(e) =>
                setMetadata({
                  ...metadata,
                  measuredDate: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Measured By</Label>
            <Input
              value={metadata.measuredBy}
              onChange={(e) =>
                setMetadata({
                  ...metadata,
                  measuredBy: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-6 border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 w-[8%]">Sl</th>
                <th className="p-2 w-[30%] text-left">Particulars</th>
                <th className="p-2">No</th>
                <th className="p-2">L</th>
                <th className="p-2">B</th>
                <th className="p-2">D</th>
                <th className="p-2 text-right">Qty</th>
                <th className="p-2 w-[10%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m, index) => (
                <tr
                  key={m.id}
                  className={m.isSubItem ? "bg-blue-50/40" : ""}
                >
                  <td className="text-center">
                    {getDisplaySlNo(index)}
                  </td>
                  <td className="flex items-center gap-2 p-2">
                    {m.isSubItem && <span>↳</span>}
                    <Input
                      value={m.description}
                      onChange={(e) =>
                        handleChange(
                          m.id,
                          "description",
                          e.target.value,
                        )
                      }
                    />
                    {!m.isSubItem && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddSub(index)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </td>

                  {["nos", "length", "breadth", "depth"].map(
                    (field) => (
                      <td key={field} className="p-1">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={
                            (m as any)[field] || ""
                          }
                          onChange={(e) =>
                            handleChange(
                              m.id,
                              field as any,
                              e.target.value,
                            )
                          }
                        />
                      </td>
                    ),
                  )}

                  <td className="text-right font-semibold pr-2">
                    {m.quantity.toFixed(2)}
                  </td>

                  <td className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(m.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <div>
            <div className="text-sm text-gray-500">
              Total Quantity
            </div>
            <div className="text-xl font-bold">
              {totalQuantity.toFixed(2)} {estimateItem.unit}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Amount</div>
            <div className="text-xl font-bold text-green-600">
              ₹{totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Measurements
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
