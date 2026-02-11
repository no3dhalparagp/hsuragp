"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { estimateItemSchema, type EstimateItemFormValues } from "./schema";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Plus,
  ChevronDown,
  FileText,
  Sparkles,
  Building,
  MapPin,
  User,
  Ruler,
  RefreshCw,
  Route,
  Droplets,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import WorkSelectionCard from "@/components/WorkSelectionCard";
import ProjectInfoCard from "@/components/ProjectInfoCard";
import ItemsTable from "@/components/ItemsTable";
import AddEditItemDialog from "./AddEditItemDialog";
import AbstractEstimateCard from "@/components/AbstractEstimateCard";
import ActionButtons from "@/components/ActionButtons";
import ExistingEstimateAlert from "@/components/ExistingEstimateAlert";
import EstimateLibraryDialog from "@/components/EstimateLibraryDialog";
import SaveTemplateDialog from "@/components/SaveTemplateDialog";
import LoadTemplateDialog from "@/components/LoadTemplateDialog";
import PrintPreview from "@/components/PrintPreview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  EstimateItem,
  type EstimateType,
  type DrainParams as DrainParamsType,
  type DrainParamKey,
  DEFAULT_DRAIN_PARAMS,
  DRAIN_PARAM_KEYS,
  DRAIN_PARAM_LABELS,
  DRAIN_CALCULATED_KEYS,
} from "./types";
import { saveEstimate as saveEstimateApi } from "./api";
import { computeDerivedDrainParams } from "./drainCalculations";

// Hooks
import { useEstimateWorks } from "./hooks/useEstimateWorks";
import { useEstimateCalculations } from "./hooks/useEstimateCalculations";
import { useEstimatePDF } from "./hooks/useEstimatePDF";

/** Compute quantity from unit and dimensions (for road/drain: set L,B,D once, apply to all). */
function getQuantityFromDimensions(
  unit: string,
  nos: number,
  L: number,
  B: number,
  D: number
): number {
  const u = (unit || "m").toLowerCase();
  if (u === "m" || u === "rm") return nos * L;
  if (u === "sqm") return nos * L * B;
  if (u === "cum") return nos * L * B * D;
  if (u === "no" || u === "nos") return nos;
  return nos * L * B * D; // default volume-like
}

function getDrainParamValue(dp: DrainParamsType, key: DrainParamKey): number {
  const v = dp[key];
  return typeof v === "string" ? Number(v) || 0 : 0;
}

function resolveItemLBD(
  item: EstimateItem,
  dp: DrainParamsType
): { L: number; B: number; D: number } {
  const L = item.lengthParamKey
    ? getDrainParamValue(dp, item.lengthParamKey) || item.length
    : item.length;
  const B = item.breadthParamKey
    ? getDrainParamValue(dp, item.breadthParamKey) || item.breadth
    : item.breadth;
  const D = item.depthParamKey
    ? getDrainParamValue(dp, item.depthParamKey) || item.depth
    : item.depth;
  return { L, B, D };
}

export default function EstimatePreparationClientPage() {
  // State
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [contingency, setContingency] = useState<number>(0);
  const [estimateType, setEstimateType] = useState<EstimateType>("road");
  const [globalDimensions, setGlobalDimensions] = useState({
    length: "",
    breadth: "",
    depth: "",
  });
  const [drainParams, setDrainParams] = useState<DrainParamsType>(() => ({
    ...DEFAULT_DRAIN_PARAMS,
  }));
  const [isEditing, setIsEditing] = useState(false);
  const [libraryDialogOpen, setLibraryDialogOpen] = useState(false);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [loadTemplateOpen, setLoadTemplateOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Custom Hooks
  const {
    works,
    loadingWorks,
    selectedWorkId,
    setSelectedWorkId,
    workSelected,
    projectInfo,
    setProjectInfo,
    handleWorkSelection,
    existingEstimate,
    estimateExists,
    setEstimateExists,
    loadExistingEstimate,
    initialLoad,
  } = useEstimateWorks();

  // When switching to drain, sync calculated params from current inputs
  useEffect(() => {
    if (estimateType === "drain") {
      setDrainParams((prev) => ({ ...prev, ...computeDerivedDrainParams(prev) }));
    }
  }, [estimateType]);

  // When drain params change, recalc cum/sqm items linked to params (drain mode only)
  useEffect(() => {
    if (estimateType !== "drain") return;
    setItems((prev) =>
      prev.map((item) => {
        const hasParam =
          item.lengthParamKey || item.breadthParamKey || item.depthParamKey;
        const u = (item.unit || "").toLowerCase();
        if (!hasParam || (u !== "cum" && u !== "sqm")) return item;
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const { L, B, D } = resolveItemLBD(item, drainParams);
        const depthForItem = u === "sqm" ? 0 : D;
        if (hasSubItems) {
          return { ...item, length: L, breadth: B, depth: depthForItem };
        }
        const nos = item.nos || 1;
        const newQty = getQuantityFromDimensions(item.unit, nos, L, B, depthForItem);
        const amount = newQty * (item.rate || 0);
        return {
          ...item,
          length: L,
          breadth: B,
          depth: depthForItem,
          quantity: newQty,
          amount,
        };
      })
    );
  }, [estimateType, drainParams]);

  const calculations = useEstimateCalculations(items, contingency);
  const { itemTotal, gst, costExclLWC, lwc, costInclLWC, finalCost } =
    calculations;

  const { generatePDF, loadingPDF, setPdfMode, pdfMode } = useEstimatePDF({
    works,
    selectedWorkId,
    projectInfo,
    items,
    itemTotal,
    gst,
    costExclLWC,
    lwc,
    costInclLWC,
    contingency,
    finalCost,
  });

  const form = useForm<EstimateItemFormValues>({
    resolver: zodResolver(estimateItemSchema),
    defaultValues: {
      schedulePageNo: "",
      description: "",
      nos: "1",
      length: "0",
      breadth: "0",
      depth: "0",
      quantity: "0",
      unit: "m",
      rate: "0",
      measurements: [],
      subItems: [],
      lengthParamKey: "",
      breadthParamKey: "",
      depthParamKey: "",
    },
  });

  /* ============ ACTIONS ============ */

  const resetForm = () => {
    setIsEditing(false);
    setEditIndex(null);
    setAddEditDialogOpen(false);
    setItems([]);
    setEstimateType("road");
    setGlobalDimensions({ length: "", breadth: "", depth: "" });
    setProjectInfo({
      projectName: "",
      projectCode: "",
      location: "",
      preparedBy: "",
      date: new Date().toISOString().split("T")[0],
    });
    setContingency(0);
    form.reset({
      schedulePageNo: "",
      description: "",
      nos: "1",
      length: "0",
      breadth: "0",
      depth: "0",
      quantity: "0",
      unit: "m",
      rate: "0",
      measurements: [],
      subItems: [],
      lengthParamKey: "",
      breadthParamKey: "",
      depthParamKey: "",
    });
  };

  const handleAddLibraryItems = (newItems: any[]) => {
    const itemsToAdd = newItems.map((item, index) => ({
      ...item,
      slNo: items.length + index + 1,
    }));
    setItems([...items, ...itemsToAdd]);
  };

  const handleLoadTemplateItems = (newItems: any[]) => {
    const itemsToAdd = newItems.map((item, index) => ({
      ...item,
      quantity: item.defaultQty || item.quantity || 0,
      slNo: items.length + index + 1,
    }));
    setItems([...items, ...itemsToAdd]);
  };

  const handleEditItem = (index: number) => {
    const itemToEdit = items[index];
    form.reset({
      schedulePageNo: itemToEdit.schedulePageNo,
      description: itemToEdit.description,
      nos: itemToEdit.nos.toString(),
      length: itemToEdit.length.toString(),
      breadth: itemToEdit.breadth.toString(),
      depth: itemToEdit.depth.toString(),
      quantity: itemToEdit.quantity.toString(),
      unit: itemToEdit.unit,
      rate: itemToEdit.rate.toString(),
      measurements: itemToEdit.measurements || [],
      subItems: itemToEdit.subItems || [],
      lengthParamKey: itemToEdit.lengthParamKey ?? "",
      breadthParamKey: itemToEdit.breadthParamKey ?? "",
      depthParamKey: itemToEdit.depthParamKey ?? "",
    });
    setEditIndex(index);
    setAddEditDialogOpen(true);
  };

  const handleSaveAddEditItem = (newItem: EstimateItem) => {
    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = { ...newItem, slNo: editIndex + 1 };
      setItems(updated);
      setEditIndex(null);
    } else {
      setItems([...items, { ...newItem, slNo: items.length + 1 }]);
    }
    setAddEditDialogOpen(false);
    const isDrain = estimateType === "drain";
    form.reset({
      schedulePageNo: "",
      description: "",
      nos: "1",
      length: isDrain ? drainParams.lengthOfDrain || "0" : globalDimensions.length || "0",
      breadth: isDrain ? drainParams.widthEarthCutting || "0" : globalDimensions.breadth || "0",
      depth: isDrain ? drainParams.avgDepthEarthCutting || "0" : globalDimensions.depth || "0",
      quantity: "0",
      unit: isDrain ? "cum" : "m",
      rate: "0",
      measurements: [],
      subItems: [],
      lengthParamKey: "",
      breadthParamKey: "",
      depthParamKey: "",
    });
  };

  const openAddItemDialog = () => {
    setEditIndex(null);
    const isDrain = estimateType === "drain";
    const L = isDrain
      ? drainParams.lengthOfDrain || "0"
      : globalDimensions.length || "0";
    const B = isDrain
      ? drainParams.widthEarthCutting || "0"
      : globalDimensions.breadth || "0";
    const D = isDrain
      ? drainParams.avgDepthEarthCutting || "0"
      : globalDimensions.depth || "0";
    form.reset({
      schedulePageNo: "",
      description: "",
      nos: "1",
      length: L,
      breadth: B,
      depth: D,
      quantity: "0",
      unit: isDrain ? "cum" : "m",
      rate: "0",
      measurements: [],
      subItems: [],
      lengthParamKey: "",
      breadthParamKey: "",
      depthParamKey: "",
    });
    setAddEditDialogOpen(true);
  };

  const handleDrainParamChange = (key: DrainParamKey, value: string) => {
    setDrainParams((prev) => {
      const next = { ...prev, [key]: value };
      return { ...next, ...computeDerivedDrainParams(next) };
    });
  };

  const applyGlobalDimensionsToAllItems = () => {
    if (items.length === 0) {
      alert("Add items first, then apply dimensions.");
      return;
    }
    const isDrain = estimateType === "drain";
    const L = isDrain
      ? getDrainParamValue(drainParams, "lengthOfDrain") || Number(globalDimensions.length) || 0
      : Number(globalDimensions.length) || 0;
    const B = isDrain
      ? getDrainParamValue(drainParams, "widthEarthCutting") || Number(globalDimensions.breadth) || 0
      : Number(globalDimensions.breadth) || 0;
    const D = isDrain
      ? getDrainParamValue(drainParams, "avgDepthEarthCutting") || Number(globalDimensions.depth) || 0
      : Number(globalDimensions.depth) || 0;
    const u = (unit: string) => (unit || "").toLowerCase();
    setItems((prev) =>
      prev.map((item) => {
        if (isDrain && (item.lengthParamKey || item.breadthParamKey || item.depthParamKey))
          return item;
        const unit = u(item.unit);
        if (unit !== "cum" && unit !== "sqm") return item;
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const depthForItem = unit === "sqm" ? 0 : D;
        if (hasSubItems) {
          return { ...item, length: L, breadth: B, depth: depthForItem };
        }
        const nos = item.nos || 1;
        const newQty = getQuantityFromDimensions(item.unit, nos, L, B, depthForItem);
        const amount = newQty * (item.rate || 0);
        return {
          ...item,
          length: L,
          breadth: B,
          depth: depthForItem,
          quantity: newQty,
          amount,
        };
      })
    );
  };

  const saveEstimate = async () => {
    if (!selectedWorkId) {
      alert("Please select a work first");
      return;
    }

    if (items.length === 0) {
      alert("Add items before saving");
      return;
    }

    if (estimateExists && !isEditing) {
      alert(
        "An estimate already exists for this work. Please edit the existing estimate or delete it first.",
      );
      return;
    }

    try {
      await saveEstimateApi(selectedWorkId, items, projectInfo, contingency);

      const message = isEditing
        ? "Estimate updated successfully"
        : "Estimate saved successfully";
      alert(message);
      resetForm();
      setEstimateExists(true);
      setIsEditing(false);
      // Refetch the estimate for this work
      loadExistingEstimate(selectedWorkId);
    } catch (error) {
      console.error(error);
      alert(
        `Error saving estimate: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  const handlePrint = () => {
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-wb-bg p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER WITH STATS */}
        <div className="bg-wb-primary rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Sparkles className="h-8 w-8" />
                Estimate Preparation
              </h1>
              <p className="text-white/90 mt-2">
                Create and manage detailed cost estimates for your projects
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-32">
                <div className="text-2xl font-bold">{items.length}</div>
                <div className="text-sm text-white/80">Items</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-32">
                <div className="text-2xl font-bold">
                  ₹{finalCost.toLocaleString()}
                </div>
                <div className="text-sm text-white/80">Total Cost</div>
              </div>
            </div>
          </div>
        </div>

        {/* EXISTING ESTIMATE ALERT */}
        <ExistingEstimateAlert
          estimateExists={estimateExists}
          initialLoad={initialLoad}
          selectedWorkId={selectedWorkId}
          isEditing={isEditing}
          existingEstimate={existingEstimate}
          setIsEditing={setIsEditing}
          setItems={setItems}
          setProjectInfo={setProjectInfo}
          setContingency={setContingency}
          resetForm={resetForm}
          fetchExistingEstimate={loadExistingEstimate}
          setShowPreview={setShowPreview}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* MAIN FORM SECTION */}
          <div className="lg:col-span-3 space-y-8">
            {estimateExists && !isEditing && selectedWorkId && (
              <Alert className="border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 ml-2">
                  Form is in view-only mode. Click Edit Estimate above to make
                  changes.
                </AlertDescription>
              </Alert>
            )}

            {/* WORK SELECTION */}
            <Card className="p-6 shadow-sm border border-wb-border bg-white hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-wb-primary/10 rounded-lg">
                  <Building className="h-5 w-5 text-wb-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Select Work
                  </h2>
                  <p className="text-sm text-slate-500">
                    Choose a project to create estimate
                  </p>
                </div>
              </div>
              <WorkSelectionCard
                works={works}
                selectedWorkId={selectedWorkId}
                loadingWorks={loadingWorks}
                workSelected={workSelected}
                projectInfo={projectInfo}
                handleWorkSelection={handleWorkSelection}
                isEditing={isEditing}
                estimateExists={estimateExists}
              />
            </Card>

            {/* PROJECT INFORMATION */}
            {workSelected && (
              <Card className="p-6 shadow-sm border border-wb-border bg-white hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-wb-success/20 rounded-lg">
                    <FileText className="h-5 w-5 text-wb-success" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      Project Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Basic project information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Project Name
                    </label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-wb-border">
                      {projectInfo.projectName || "Not selected"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-wb-border">
                      {projectInfo.location || "Not specified"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Prepared By
                    </label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-wb-border">
                      {projectInfo.preparedBy}
                    </div>
                  </div>
                </div>

                <ProjectInfoCard
                  projectInfo={projectInfo}
                  setProjectInfo={setProjectInfo}
                  workSelected={workSelected}
                />
              </Card>
            )}

            {/* ESTIMATE TYPE: Road or Drain */}
            {workSelected && (!estimateExists || isEditing) && (
              <Card className="p-6 shadow-sm border border-slate-200 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Ruler className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      Estimate Type
                    </h2>
                    <p className="text-sm text-slate-500">
                      Choose Road for length/breadth/depth only, or Drain for full drain parameters (like Excel).
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={estimateType === "road" ? "default" : "outline"}
                    className={`gap-2 flex-1 h-12 ${
                      estimateType === "road"
                        ? "bg-slate-700 hover:bg-slate-800 text-white"
                        : "border-slate-300 hover:bg-slate-50"
                    }`}
                    onClick={() => setEstimateType("road")}
                  >
                    <Route className="h-5 w-5" />
                    Road
                  </Button>
                  <Button
                    type="button"
                    variant={estimateType === "drain" ? "default" : "outline"}
                    className={`gap-2 flex-1 h-12 ${
                      estimateType === "drain"
                        ? "bg-teal-600 hover:bg-teal-700 text-white"
                        : "border-slate-300 hover:bg-slate-50"
                    }`}
                    onClick={() => setEstimateType("drain")}
                  >
                    <Droplets className="h-5 w-5" />
                    Drain
                  </Button>
                </div>
              </Card>
            )}

            {/* ROAD DIMENSIONS - Only when Road selected */}
            {workSelected && (!estimateExists || isEditing) && estimateType === "road" && (
              <Card className="p-6 shadow-sm border border-slate-200 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Route className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      Road Dimensions
                    </h2>
                    <p className="text-sm text-slate-500">
                      Set length, breadth & depth once. <strong>cum</strong> = Length × Breadth × Depth; <strong>sqm</strong> = Length × Breadth. New items and &quot;Apply to All&quot; use these.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Length (m)</label>
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      placeholder="0"
                      value={globalDimensions.length}
                      onChange={(e) =>
                        setGlobalDimensions((prev) => ({ ...prev, length: e.target.value }))
                      }
                      className="bg-white border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Breadth (m)</label>
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      placeholder="0"
                      value={globalDimensions.breadth}
                      onChange={(e) =>
                        setGlobalDimensions((prev) => ({ ...prev, breadth: e.target.value }))
                      }
                      className="bg-white border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Depth (m)</label>
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      placeholder="0"
                      value={globalDimensions.depth}
                      onChange={(e) =>
                        setGlobalDimensions((prev) => ({ ...prev, depth: e.target.value }))
                      }
                      className="bg-white border-slate-300"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={applyGlobalDimensionsToAllItems}
                    disabled={items.length === 0}
                    className="gap-2 bg-slate-600 hover:bg-slate-700 text-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Apply to All (cum/sqm)
                  </Button>
                </div>
              </Card>
            )}

            {/* DRAIN ESTIMATE PARAMETERS - Only when Drain selected */}
            {workSelected && (!estimateExists || isEditing) && estimateType === "drain" && (
              <Card className="p-6 shadow-sm border border-teal-200/80 bg-gradient-to-r from-teal-50/80 to-cyan-50/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Droplets className="h-5 w-5 text-teal-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      Drain Estimate Parameters
                    </h2>
                    <p className="text-sm text-slate-500">
                      Bed slope 1:300 V:H. D/S depth, Width of Earth Cutting and average depths are calculated from inputs.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DRAIN_PARAM_KEYS.map((key) => {
                    const isCalculated = DRAIN_CALCULATED_KEYS.includes(key);
                    return (
                      <div key={key} className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          {DRAIN_PARAM_LABELS[key]}
                          {isCalculated && (
                            <span className="text-xs font-normal text-slate-400">(Calculated)</span>
                          )}
                        </label>
                        <Input
                          type="number"
                          min={0}
                          step="any"
                          placeholder="0"
                          value={drainParams[key]}
                          readOnly={isCalculated}
                          onChange={(e) =>
                            isCalculated
                              ? undefined
                              : handleDrainParamChange(key, e.target.value)
                          }
                          className={`bg-white border-slate-300 ${isCalculated ? "bg-slate-50 cursor-default" : ""}`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    onClick={applyGlobalDimensionsToAllItems}
                    disabled={items.length === 0}
                    className="gap-2 bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Apply to All (cum/sqm)
                  </Button>
                  <span className="text-xs text-slate-500">
                    Applies to cum/sqm items not linked to params. When adding items, choose &quot;Length from&quot; / &quot;Breadth from&quot; / &quot;Depth from&quot; to link to params above.
                  </span>
                </div>
              </Card>
            )}

            {/* ESTIMATE ITEMS SECTION */}
            {workSelected && (!estimateExists || isEditing) && (
              <Card className="overflow-hidden rounded-2xl shadow-sm border border-slate-200/80 bg-white hover:shadow-md transition-shadow duration-300">
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                          Estimate Items
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                          Add and manage items in your estimate
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                          <Plus className="h-4 w-4" />
                          Add Items
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem
                          onSelect={() => setLibraryDialogOpen(true)}
                          className="cursor-pointer hover:bg-emerald-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <Sparkles className="h-4 w-4 text-emerald-700" />
                            </div>
                            <div>
                              <div className="font-medium">From Library</div>
                              <div className="text-xs text-slate-500">
                                Bulk add from template
                              </div>
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => setLoadTemplateOpen(true)}
                          className="cursor-pointer hover:bg-emerald-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-100 rounded-lg">
                              <FileText className="h-4 w-4 text-teal-700" />
                            </div>
                            <div>
                              <div className="font-medium">Load Template</div>
                              <div className="text-xs text-slate-500">
                                Use saved template
                              </div>
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={openAddItemDialog}
                          className="cursor-pointer hover:bg-emerald-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                              <Plus className="h-4 w-4 text-slate-700" />
                            </div>
                            <div>
                              <div className="font-medium">Manual Entry</div>
                              <div className="text-xs text-slate-500">
                                Add items one by one
                              </div>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="px-6 pt-5 pb-1 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    Items List
                    <Badge variant="secondary" className="rounded-full bg-emerald-100 text-emerald-800 font-medium">
                      {items.length}
                    </Badge>
                  </h3>
                </div>
                <div className="px-6 pb-6">
                  {items.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <ItemsTable
                        items={items}
                        deleteItem={(index) => {
                          setItems(
                            items
                              .filter((_, i) => i !== index)
                              .map((item, i) => ({ ...item, slNo: i + 1 })),
                          );
                        }}
                        editItem={handleEditItem}
                        moveItem={(index, direction) => {
                          const newItems = [...items];
                          if (direction === "up" && index > 0) {
                            [newItems[index - 1], newItems[index]] = [
                              newItems[index],
                              newItems[index - 1],
                            ];
                          } else if (
                            direction === "down" &&
                            index < items.length - 1
                          ) {
                            [newItems[index], newItems[index + 1]] = [
                              newItems[index + 1],
                              newItems[index],
                            ];
                          }
                          const renumberedItems = newItems.map((item, i) => ({
                            ...item,
                            slNo: i + 1,
                          }));
                          setItems(renumberedItems);
                        }}
                        estimateExists={estimateExists}
                        isEditing={isEditing}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-14 px-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                        <Plus className="h-7 w-7 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-1">
                        No items yet
                      </h3>
                      <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                        Add items from the library, load a template, or enter one manually.
                      </p>
                      <Button
                        onClick={openAddItemDialog}
                        className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Plus className="h-4 w-4" />
                        Add First Item
                      </Button>
                    </div>
                  )}
                </div>

                <AddEditItemDialog
                  open={addEditDialogOpen}
                  onOpenChange={setAddEditDialogOpen}
                  form={form}
                  isEditMode={editIndex !== null}
                  onSave={handleSaveAddEditItem}
                  estimateExists={estimateExists}
                  isEditing={isEditing}
                  items={items}
                  setItems={setItems}
                  globalDimensions={globalDimensions}
                  drainParams={estimateType === "drain" ? drainParams : undefined}
                  estimateType={estimateType}
                />

                <EstimateLibraryDialog
                  open={libraryDialogOpen}
                  onOpenChange={setLibraryDialogOpen}
                  onAddItems={handleAddLibraryItems}
                />
                <SaveTemplateDialog
                  open={saveTemplateOpen}
                  onOpenChange={setSaveTemplateOpen}
                  items={items}
                />
                <LoadTemplateDialog
                  open={loadTemplateOpen}
                  onOpenChange={setLoadTemplateOpen}
                  onSelectTemplate={handleLoadTemplateItems}
                />
              </Card>
            )}

          </div>

          {/* SIDEBAR - CALCULATIONS & ACTIONS */}
          <div className="space-y-8">
            {/* ABSTRACT ESTIMATE */}
            <Card className="p-6 shadow-sm border border-wb-border bg-white sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-wb-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-wb-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Cost Summary
                  </h2>
                  <p className="text-sm text-slate-500">
                    Total estimate calculations
                  </p>
                </div>
              </div>
              <AbstractEstimateCard
                items={items}
                contingency={contingency}
                setContingency={setContingency}
                estimateExists={estimateExists}
                isEditing={isEditing}
                itemTotal={itemTotal}
                gst={gst}
                costExclLWC={costExclLWC}
                lwc={lwc}
                costInclLWC={costInclLWC}
                finalCost={finalCost}
              />
            </Card>

            {/* ACTION BUTTONS */}
            <Card className="p-6 shadow-sm border border-wb-border bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-wb-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-wb-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Actions
                  </h2>
                  <p className="text-sm text-slate-500">
                    Manage and export estimate
                  </p>
                </div>
              </div>
              <ActionButtons
                loading={loadingPDF}
                onSave={saveEstimate}
                onGeneratePDF={generatePDF}
                onGenerateAbstractPDF={() => generatePDF("abstract")}
                pdfMode={pdfMode}
                setPdfMode={setPdfMode}
                items={items}
                selectedWorkId={selectedWorkId}
                showPreview={showPreview}
                setShowPreview={setShowPreview}
                handlePrint={handlePrint}
                isEditing={isEditing}
                onSaveTemplate={() => setSaveTemplateOpen(true)}
              />
            </Card>
          </div>

          {/* VIEW MODE ITEMS TABLE - Full width row for better visibility */}
          {workSelected &&
            estimateExists &&
            !isEditing &&
            items.length > 0 && (
              <div className="w-full min-w-0 lg:col-span-4">
                <Card className="p-6 shadow-sm border border-wb-border bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">
                        Estimate Items
                      </h2>
                      <p className="text-sm text-slate-500">View-only mode</p>
                    </div>
                    <Badge variant="outline" className="text-slate-600">
                      {items.length} items
                    </Badge>
                  </div>
                  <div className="w-full overflow-x-auto rounded-lg border border-wb-border">
                    <ItemsTable
                      items={items}
                      deleteItem={() => {}}
                      editItem={() => {}}
                      estimateExists={estimateExists}
                      isEditing={isEditing}
                    />
                  </div>
                </Card>
              </div>
            )}
        </div>
        <PrintPreview
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          projectInfo={projectInfo}
          items={items}
          contingency={contingency}
          itemTotal={itemTotal}
          gst={gst}
          costExclLWC={costExclLWC}
          lwc={lwc}
          costInclLWC={costInclLWC}
          finalCost={finalCost}
        />
      </div>
    </div>
  );
}
