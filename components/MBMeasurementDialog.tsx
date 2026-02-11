"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ruler, X, Plus, Trash2 } from "lucide-react";

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
  subItemIndex?: number;
}

interface EstimateItem {
  id: string;
  description: string;
  unit: string;
  rate: number;
  isSubItem?: boolean;
  slNo?: number;
  schedulePageNo?: string;
  quantity?: number;
  amount?: number;
  nos?: number;
  length?: number;
  breadth?: number;
  depth?: number;
  measurements?: Measurement[];
  subItems?: any[];
  parentId?: string;
  displaySlNo?: string;
  isHeader?: boolean;
  subItemIndex?: number;
}

interface MBMeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimateItem: EstimateItem | null;
  onSave: (
    measurements: Measurement[],
    totalQuantity: number,
    metadata?: any,
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
  const [measurements, setMeasurements] =
    useState<Measurement[]>(initialMeasurements);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [mainItemCounter, setMainItemCounter] = useState(1);

  // Sync measurements and metadata when opening for EDIT (has existing data)
  React.useEffect(() => {
    if (open && initialMeasurements.length > 0) {
      const normalized = initialMeasurements.map((m, i) => ({
        id: (m as any).id || `m-${i}-${Date.now()}`,
        description: (m as any).description ?? "",
        nos: Number((m as any).nos) || 0,
        length: Number((m as any).length) || 0,
        breadth: Number((m as any).breadth) || 0,
        depth: Number((m as any).depth) || 0,
        quantity: Number((m as any).quantity) || 0,
        estimateItemId: (m as any).estimateItemId,
        isSubItem: (m as any).isSubItem,
        subItemIndex: (m as any).subItemIndex,
      }));
      setMeasurements(normalized);
      setMetadata(initialMetadata);
      
      // Calculate main item counter for new items
      const mainItems = normalized.filter(m => !m.isSubItem);
      setMainItemCounter(mainItems.length > 0 ? mainItems.length : 1);
    } else if (open && initialMetadata) {
      setMetadata(initialMetadata);
      setMainItemCounter(1);
    }
  }, [open, initialMeasurements, initialMetadata]);

  // Helper: get default measurement from estimate item (pre-fill with estimate values)
  const getDefaultMeasurementFromEstimate = (item: any, isSub: boolean) => {
    const qty = Number(item.quantity) || 0;
    const nos = Number(item.nos) ?? 1;
    const len = Number(item.length) ?? 0;
    const br = Number(item.breadth) ?? 0;
    const dep = Number(item.depth) ?? 0;
    const unit = (item.unit || "").toLowerCase();
    // For "no"/"nos" unit: put quantity in No column
    const isNoUnit = unit === "no" || unit === "nos" || unit === "each";
    if (isSub) {
      return {
        nos: isNoUnit ? qty : 1,
        length: Number(item.length) || 0,
        breadth: Number(item.breadth) || 0,
        depth: Number(item.depth) || 0,
        quantity: qty,
      };
    }
    // Main item: use estimate dimensions; if no dimensions, use quantity in nos for "no" unit
    const hasDims = len > 0 || br > 0 || dep > 0;
    const calcQty = (nos || 1) * (len || 1) * (br || 1) * (dep || 1);
    return {
      nos: isNoUnit && !hasDims ? (qty || 1) : (nos || 1),
      length: len,
      breadth: br,
      depth: dep,
      quantity: hasDims ? calcQty : qty || 0,
    };
  };

  // Auto-add subitems when dialog opens for ADD (no existing measurements)
  React.useEffect(() => {
    if (open && estimateItem && initialMeasurements.length === 0) {
      // If opening dialog with a main item that has subitems, auto-add them
      if (estimateItem.subItems && estimateItem.subItems.length > 0) {
        const subitemMeasurements: Measurement[] = estimateItem.subItems.map(
          (subitem: any, index: number) => {
            const def = getDefaultMeasurementFromEstimate(subitem, true);
            return {
              id: `${Date.now()}-${subitem.id || index}`,
              description: subitem.description,
              nos: def.nos,
              length: def.length,
              breadth: def.breadth,
              depth: def.depth,
              quantity: def.quantity,
              estimateItemId: estimateItem.id,
              isSubItem: true,
              subItemIndex: index + 1,
            };
          },
        );
        setMeasurements([
          {
            id: Date.now().toString(),
            description: estimateItem.description,
            nos: 1,
            length: 0,
            breadth: 0,
            depth: 0,
            quantity: 0,
            estimateItemId: estimateItem.id,
            isSubItem: false,
            subItemIndex: 1,
          },
          ...subitemMeasurements,
        ]);
        setMainItemCounter(1);
      } else {
        // If no subitems, add a single row with estimate values as default
        const def = getDefaultMeasurementFromEstimate(estimateItem, false);
        setMeasurements([
          {
            id: Date.now().toString(),
            description: estimateItem.description,
            nos: def.nos,
            length: def.length,
            breadth: def.breadth,
            depth: def.depth,
            quantity: def.quantity,
            estimateItemId: estimateItem.id,
            isSubItem: false,
            subItemIndex: 1,
          },
        ]);
        setMainItemCounter(1);
      }
    }
  }, [open, estimateItem, initialMeasurements.length]);

  // Helper to get display serial number for a measurement
  const getDisplaySlNo = (index: number, measurement: Measurement) => {
    if (measurement.isSubItem) {
      // Find parent main item index
      let parentIndex = -1;
      for (let i = index - 1; i >= 0; i--) {
        if (!measurements[i].isSubItem) {
          parentIndex = i;
          break;
        }
      }
      
      if (parentIndex !== -1) {
        const mainItemNumber = measurements[parentIndex].subItemIndex || (parentIndex + 1);
        const subItemNumber = measurement.subItemIndex || 1;
        return `${mainItemNumber}.${subItemNumber}`;
      }
      return measurement.subItemIndex?.toString() || "1";
    }
    return measurement.subItemIndex?.toString() || (index + 1).toString();
  };

  const handleAddMeasurement = () => {
    const newMainItemCounter = mainItemCounter + 1;
    setMainItemCounter(newMainItemCounter);
    
    setMeasurements([
      ...measurements,
      {
        id: Date.now().toString(),
        description: estimateItem?.description || "",
        nos: 0,
        length: 0,
        breadth: 0,
        depth: 0,
        quantity: 0,
        estimateItemId: estimateItem?.id,
        isSubItem: false,
        subItemIndex: newMainItemCounter,
      },
    ]);
  };

  const handleAddSubMeasurement = (parentIndex: number) => {
    const parentMeasurement = measurements[parentIndex];
    if (!parentMeasurement) return;

    // Count existing subitems for this parent
    const existingSubItems = measurements.filter((m, idx) => 
      idx > parentIndex && m.isSubItem && 
      // Find until next main item
      (() => {
        for (let i = parentIndex + 1; i < idx; i++) {
          if (!measurements[i].isSubItem) return false;
        }
        return true;
      })()
    );

    const newSubItemNumber = existingSubItems.length + 1;
    
    // Insert the new subitem right after the parent
    const insertIndex = parentIndex + 1 + existingSubItems.length;
    
    const newMeasurement: Measurement = {
      id: `${Date.now()}-sub`,
      description: `Sub-item ${newSubItemNumber}`,
      nos: 0,
      length: 0,
      breadth: 0,
      depth: 0,
      quantity: 0,
      estimateItemId: parentMeasurement.estimateItemId,
      isSubItem: true,
      subItemIndex: newSubItemNumber,
    };

    const newMeasurements = [...measurements];
    newMeasurements.splice(insertIndex, 0, newMeasurement);
    setMeasurements(newMeasurements);
  };

  const handleRemoveMeasurement = (id: string) => {
    setMeasurements(measurements.filter((m) => m.id !== id));
    
    // Recalculate main item counter if we removed a main item
    const remainingMainItems = measurements.filter(m => 
      m.id !== id && !m.isSubItem
    ).length;
    setMainItemCounter(remainingMainItems > 0 ? remainingMainItems : 1);
  };

  const handleMeasurementChange = (
    id: string,
    field: keyof Measurement,
    value: number | string,
  ) => {
    setMeasurements(
      measurements.map((m) => {
        if (m.id === id) {
          // Convert string values to numbers
          let numValue =
            typeof value === "string" ? parseFloat(value) || 0 : value;
          const updated = { ...m, [field]: numValue };

          // Auto-calculate quantity whenever any dimension field changes
          if (
            field === "nos" ||
            field === "length" ||
            field === "breadth" ||
            field === "depth"
          ) {
            // Treat 0/blank as 1 for multiplication to handle missing dimensions
            // e.g. Area = L * B (D is 0/blank, treated as 1)
            // e.g. Run = L (No, B, D are 0/blank, treated as 1)
            const nos = updated.nos || 1;
            const length = updated.length || 1;
            const breadth = updated.breadth || 1;
            const depth = updated.depth || 1;

            // If all fields are empty/zero, quantity is 0
            if (
              !updated.nos &&
              !updated.length &&
              !updated.breadth &&
              !updated.depth
            ) {
              updated.quantity = 0;
            } else {
              updated.quantity = nos * length * breadth * depth;
            }
          }
          return updated;
        }
        return m;
      }),
    );
  };

  const calculateTotalQuantity = () => {
    return measurements.reduce((sum, m) => sum + m.quantity, 0);
  };

  const handleSave = () => {
    const totalQuantity = calculateTotalQuantity();
    onSave(measurements, totalQuantity, metadata);
  };

  if (!estimateItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Add Measurements for {estimateItem.description}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Top Section: MB Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50/50 border rounded-lg">
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                MB Number
              </Label>
              <Input
                value={metadata.mbNumber}
                onChange={(e) =>
                  setMetadata({ ...metadata, mbNumber: e.target.value })
                }
                className="bg-white h-9"
                placeholder="Ex. 42"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Page Number
              </Label>
              <Input
                value={metadata.mbPageNumber}
                onChange={(e) =>
                  setMetadata({ ...metadata, mbPageNumber: e.target.value })
                }
                className="bg-white h-9"
                placeholder="Ex. 12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Measurement Date
              </Label>
              <Input
                type="date"
                value={metadata.measuredDate}
                onChange={(e) =>
                  setMetadata({ ...metadata, measuredDate: e.target.value })
                }
                className="bg-white h-9"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Measured By
              </Label>
              <Input
                value={metadata.measuredBy}
                onChange={(e) =>
                  setMetadata({ ...metadata, measuredBy: e.target.value })
                }
                className="bg-white h-9"
                placeholder="Officer Name"
              />
            </div>
          </div>

          {/* Measurements Table Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <Ruler className="h-4 w-4 text-blue-600" />
                Measurement Details
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddMeasurement}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Main Item
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-3 text-center font-semibold text-gray-600 w-[8%]">
                      Sl. No.
                    </th>
                    <th className="p-3 text-left font-semibold text-gray-600 w-[35%]">
                      Particulars
                    </th>
                    <th className="p-3 text-center font-semibold text-gray-600 w-[7%]">
                      No
                    </th>
                    <th className="p-3 text-center font-semibold text-gray-600 w-[10%]">
                      L (m)
                    </th>
                    <th className="p-3 text-center font-semibold text-gray-600 w-[10%]">
                      B (m)
                    </th>
                    <th className="p-3 text-center font-semibold text-gray-600 w-[10%]">
                      D (m)
                    </th>
                    <th className="p-3 text-right font-semibold text-gray-600 w-[10%]">
                      Contents
                    </th>
                    <th className="p-3 text-center font-semibold text-gray-600 w-[10%]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((measurement, index) => {
                    const displaySlNo = getDisplaySlNo(index, measurement);
                    
                    return (
                      <tr
                        key={measurement.id}
                        className={`border-b last:border-0 hover:bg-gray-50/50 transition-colors ${measurement.isSubItem ? "bg-blue-50/30" : "bg-white"}`}
                      >
                        <td className="p-2 text-center font-medium text-gray-700">
                          <div className={`flex items-center justify-center ${measurement.isSubItem ? "text-sm" : "font-semibold"}`}>
                            {displaySlNo}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {measurement.isSubItem && (
                              <span className="text-gray-400 text-xs">↳</span>
                            )}
                            <Input
                              value={measurement.description}
                              onChange={(e) =>
                                handleMeasurementChange(
                                  measurement.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className={`border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white ${measurement.isSubItem ? "text-sm text-gray-700" : "font-medium text-gray-900"} flex-1`}
                              placeholder="Enter Description"
                            />
                            {!measurement.isSubItem && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddSubMeasurement(index)}
                                className="h-7 w-7 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full shrink-0"
                                title="Add sub-item"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={measurement.nos || ""}
                            onChange={(e) =>
                              handleMeasurementChange(
                                measurement.id,
                                "nos",
                                e.target.value,
                              )
                            }
                            placeholder="-"
                            className="text-center h-8 border-gray-200"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={measurement.length || ""}
                            onChange={(e) =>
                              handleMeasurementChange(
                                measurement.id,
                                "length",
                                e.target.value,
                              )
                            }
                            placeholder="-"
                            className="text-center h-8 border-gray-200"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={measurement.breadth || ""}
                            onChange={(e) =>
                              handleMeasurementChange(
                                measurement.id,
                                "breadth",
                                e.target.value,
                              )
                            }
                            placeholder="-"
                            className="text-center h-8 border-gray-200"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={measurement.depth || ""}
                            onChange={(e) =>
                              handleMeasurementChange(
                                measurement.id,
                                "depth",
                                e.target.value,
                              )
                            }
                            placeholder="-"
                            className="text-center h-8 border-gray-200"
                          />
                        </td>
                        <td className="p-2 text-right font-semibold text-gray-700">
                          {measurement.quantity.toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveMeasurement(measurement.id)
                            }
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <div className="text-sm text-gray-500">Total Quantity</div>
                <div className="text-xl font-bold">
                  {calculateTotalQuantity().toFixed(2)} {estimateItem.unit}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Amount</div>
                <div className="text-xl font-bold text-green-600">
                  ₹{(calculateTotalQuantity() * estimateItem.rate).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Measurements</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
