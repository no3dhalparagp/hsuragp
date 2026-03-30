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
  ChevronRight,
  ChevronLeft,
  Check,
  ListChecks,
  Calculator,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import WorkSelectionCard from "@/components/WorkSelectionCard";
import ProjectInfoCard from "@/components/ProjectInfoCard";
import EstimateTable from "./EstimateTable";
import RateAnalysisEditor from "./RateAnalysisEditor";
import { RateAnalysis } from "./types";
import EstimateDrawingSection from "./EstimateDrawingSection";
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
import { calcQty } from "@/lib/construction-utils";

// Hooks
import { useEstimateWorks } from "./hooks/useEstimateWorks";
import { useEstimateCalculations } from "./hooks/useEstimateCalculations";
import { useEstimatePDF } from "./hooks/useEstimatePDF";

// ─── Step definitions ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Select Work", icon: Building },
  { id: 2, label: "Project Details", icon: FileText },
  { id: 3, label: "Dimensions", icon: Ruler },
  { id: 4, label: "Add Items", icon: ListChecks },
  { id: 5, label: "Summary & Save", icon: Calculator },
] as const;

// ─── Step indicator component ──────────────────────────────────────────────────
function StepIndicator({
  currentStep,
  completedUpTo,
  onStepClick,
}: {
  currentStep: number;
  completedUpTo: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="flex items-center min-w-max mx-auto justify-center px-2 py-1">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isDone = completedUpTo >= step.id && !isActive;
          const isClickable = step.id <= completedUpTo + 1;

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`flex flex-col items-center gap-1.5 group transition-all duration-200 ${
                  isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? "border-wb-primary bg-wb-primary text-white shadow-lg shadow-wb-primary/30 scale-110"
                      : isDone
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 bg-white text-slate-400 group-hover:border-wb-primary/50"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={`text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-wb-primary"
                      : isDone
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {/* connector */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-12 md:w-20 mx-1 md:mx-2 rounded-full transition-all duration-500 ${
                    completedUpTo >= step.id ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════════
export default function EstimatePreparationClientPage() {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedUpTo, setCompletedUpTo] = useState(0);

  // Core state
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
  const [rateAnalysisOpen, setRateAnalysisOpen] = useState(false);
  const [rateAnalysisIndex, setRateAnalysisIndex] = useState<number | null>(null);
  const [rateAnalyses, setRateAnalyses] = useState<Record<number, RateAnalysis>>({});
  const [estimateDrawing, setEstimateDrawing] = useState<string>("");

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

  // Keep completedUpTo in sync with wizard progress
  useEffect(() => {
    if (workSelected && completedUpTo < 1) setCompletedUpTo(1);
  }, [completedUpTo, workSelected]);

  // When switching to drain, sync drain params
  useEffect(() => {
    if (estimateType === "drain") {
      setDrainParams((prev) => ({ ...prev, ...computeDerivedDrainParams(prev) }));
    }
  }, [estimateType]);

  // When drain params change, recalculate linked items
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
        const newQty = calcQty(item.unit, nos, L, B, depthForItem);
        const amount = newQty * (item.rate || 0);
        return { ...item, length: L, breadth: B, depth: depthForItem, quantity: newQty, amount };
      })
    );
  }, [estimateType, drainParams]);

  useEffect(() => {
    setEstimateDrawing(projectInfo?.drawingData || "");
  }, [projectInfo?.drawingData]);

  const calculations = useEstimateCalculations(items, contingency);
  const { itemTotal, gst, costExclLWC, lwc, costInclLWC, finalCost, taxBreakups } = calculations;

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

  /* ─── Navigation helpers ─────────────────────────────────────────────────── */
  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = () => {
    const next = currentStep + 1;
    if (next > completedUpTo + 1) setCompletedUpTo(currentStep);
    else if (currentStep > completedUpTo) setCompletedUpTo(currentStep);
    goToStep(next);
  };

  const goPrev = () => goToStep(currentStep - 1);

  const advanceToStep = (step: number) => {
    setCompletedUpTo((prev) => Math.max(prev, step - 1));
    goToStep(step);
  };

  /* ─── Actions ────────────────────────────────────────────────────────────── */
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
      drawingData: "",
    });
    setEstimateDrawing("");
    setContingency(0);
    setCurrentStep(1);
    setCompletedUpTo(0);
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

  const handleAddLibraryItems = (newItems: EstimateItem[]) => {
    const itemsToAdd = newItems.map((item, index) => ({
      ...item,
      slNo: items.length + index + 1,
    }));
    setItems([...items, ...itemsToAdd]);
  };

  const handleLoadTemplateItems = (newItems: EstimateItem[]) => {
    const itemsToAdd = newItems.map((item, index) => ({
      ...item,
      quantity: item.quantity || 0,
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
  };

  const openAddItemDialog = () => {
    setEditIndex(null);
    const isDrain = estimateType === "drain";
    const L = isDrain ? drainParams.lengthOfDrain || "0" : globalDimensions.length || "0";
    const B = isDrain ? drainParams.widthEarthCutting || "0" : globalDimensions.breadth || "0";
    const D = isDrain ? drainParams.avgDepthEarthCutting || "0" : globalDimensions.depth || "0";
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
        const newQty = calcQty(item.unit, nos, L, B, depthForItem);
        const amount = newQty * (item.rate || 0);
        return { ...item, length: L, breadth: B, depth: depthForItem, quantity: newQty, amount };
      })
    );
  };

  const recalculateAllItems = () => {
    setItems((prev) =>
      prev.map((item) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        if (hasSubItems) {
          const newAmount = (item.subItems || []).reduce((sum, sub) => sum + (sub.amount || 0), 0);
          return { ...item, amount: newAmount, quantity: 1 };
        }
        const newQty = calcQty(item.unit, item.nos, item.length, item.breadth, item.depth);
        const newAmount = newQty * (item.rate || 0);
        return { ...item, quantity: newQty, amount: newAmount };
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
      alert("An estimate already exists for this work. Please edit the existing estimate or delete it first.");
      return;
    }
    try {
      await saveEstimateApi(
        selectedWorkId,
        items.map((item, idx) => ({
          ...item,
          rateAnalysis: rateAnalyses[idx],
        })),
        { ...projectInfo, drawingData: estimateDrawing },
        contingency,
        taxBreakups
      );
      const message = isEditing ? "Estimate updated successfully" : "Estimate saved successfully";
      alert(message);
      resetForm();
      setEstimateExists(true);
      setIsEditing(false);
      loadExistingEstimate(selectedWorkId);
    } catch (error) {
      console.error(error);
      alert(`Error saving estimate: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handlePrint = () => setShowPreview(true);

  /* ─── Derived ────────────────────────────────────────────────────────────── */
  const canAdvanceStep1 = workSelected;
  const canAdvanceStep2 = true; // project info always allowed to continue
  const canAdvanceStep3 = true;
  const canAdvanceStep4 = items.length > 0;
  const isViewOnly = estimateExists && !isEditing;

  /* ═══════════════════════════════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-wb-bg pb-16">
      {/* ── FIXED TOP HEADER ────────────────────────────────────────────────── */}
      <div className="bg-wb-primary sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                Estimate Preparation
              </h1>
              <p className="text-white/75 text-sm mt-0.5">
                Step-by-step cost estimation wizard
              </p>
            </div>
            {/* Quick stats */}
            <div className="flex gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-white">{items.length}</div>
                <div className="text-xs text-white/70">Items</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-white">
                  ₹{finalCost.toLocaleString()}
                </div>
                <div className="text-xs text-white/70">Total Cost</div>
              </div>
            </div>
          </div>

          {/* ── STEP INDICATOR ── */}
          <div className="bg-white/10 rounded-2xl px-4 py-3">
            <StepIndicator
              currentStep={currentStep}
              completedUpTo={completedUpTo}
              onStepClick={goToStep}
            />
          </div>
        </div>
      </div>

      {/* ── CONTENT AREA ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">

        {/* Alerts always visible */}
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

        {isViewOnly && selectedWorkId && (
          <Alert className="border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 ml-2">
              View-only mode — click <strong>Edit Estimate</strong> above to make changes.
            </AlertDescription>
          </Alert>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 1: SELECT WORK
            ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <StepHeader
              step={1}
              icon={<Building className="h-5 w-5 text-wb-primary" />}
              title="Select Work"
              description="Choose the work / project you are preparing an estimate for"
            />

            <Card className="p-6 shadow-sm border border-wb-border bg-white">
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

            <StepNav
              step={1}
              totalSteps={STEPS.length}
              canNext={!!canAdvanceStep1}
              onNext={() => {
                setCompletedUpTo((p) => Math.max(p, 1));
                goNext();
              }}
              nextLabel="Continue to Project Details"
            />
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 2: PROJECT DETAILS
            ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <StepHeader
              step={2}
              icon={<FileText className="h-5 w-5 text-emerald-600" />}
              title="Project Details"
              description="Review and fill in project information for this estimate"
            />

            <Card className="p-6 shadow-sm border border-wb-border bg-white">
              {/* Auto-filled info display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <InfoField icon={<Building className="h-4 w-4" />} label="Project Name" value={projectInfo.projectName || "Not selected"} />
                <InfoField icon={<MapPin className="h-4 w-4" />} label="Location" value={projectInfo.location || "Not specified"} />
                <InfoField icon={<User className="h-4 w-4" />} label="Prepared By" value={projectInfo.preparedBy || "—"} />
              </div>
              <ProjectInfoCard
                projectInfo={projectInfo}
                setProjectInfo={setProjectInfo}
                workSelected={workSelected}
              />
            </Card>

            <StepNav
              step={2}
              totalSteps={STEPS.length}
              canNext={canAdvanceStep2}
              onPrev={goPrev}
              onNext={() => {
                setCompletedUpTo((p) => Math.max(p, 2));
                goNext();
              }}
              nextLabel="Continue to Dimensions"
            />
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 3: ESTIMATE TYPE & DIMENSIONS
            ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <StepHeader
              step={3}
              icon={<Ruler className="h-5 w-5 text-slate-600" />}
              title="Estimate Type & Dimensions"
              description="Choose Road or Drain and configure the master dimensions"
            />

            {/* Type selection */}
            {(!estimateExists || isEditing) && (
              <Card className="p-6 shadow-sm border border-slate-200 bg-white">
                <h3 className="text-base font-semibold text-slate-700 mb-4">Estimate Type</h3>
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

            {/* Road dimensions */}
            {(!estimateExists || isEditing) && estimateType === "road" && (
              <Card className="p-6 shadow-sm border border-slate-200 bg-white">
                <h3 className="text-base font-semibold text-slate-700 mb-1">Road Dimensions</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Set length, breadth &amp; depth once.{" "}
                  <strong>cum</strong> = L × B × D; <strong>sqm</strong> = L × B.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Length (m)</label>
                    <Input
                      type="number" min={0} step="any" placeholder="0"
                      value={globalDimensions.length}
                      onChange={(e) => setGlobalDimensions((p) => ({ ...p, length: e.target.value }))}
                      className="bg-white border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Breadth (m)</label>
                    <Input
                      type="number" min={0} step="any" placeholder="0"
                      value={globalDimensions.breadth}
                      onChange={(e) => setGlobalDimensions((p) => ({ ...p, breadth: e.target.value }))}
                      className="bg-white border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Depth (m)</label>
                    <Input
                      type="number" min={0} step="any" placeholder="0"
                      value={globalDimensions.depth}
                      onChange={(e) => setGlobalDimensions((p) => ({ ...p, depth: e.target.value }))}
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
                    Apply to All
                  </Button>
                </div>
              </Card>
            )}

            {/* Drain params */}
            {(!estimateExists || isEditing) && estimateType === "drain" && (
              <Card className="p-6 shadow-sm border border-teal-200/80 bg-gradient-to-r from-teal-50/80 to-cyan-50/80">
                <h3 className="text-base font-semibold text-slate-700 mb-1">Drain Estimate Parameters</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Bed slope 1:300 V:H. D/S depth, Width of Earth Cutting and average depths calculated from inputs.
                </p>
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
                          type="number" min={0} step="any" placeholder="0"
                          value={drainParams[key]}
                          readOnly={isCalculated}
                          onChange={(e) =>
                            isCalculated ? undefined : handleDrainParamChange(key, e.target.value)
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
                  <Button
                    type="button"
                    onClick={recalculateAllItems}
                    disabled={items.length === 0}
                    variant="outline"
                    className="gap-2 border-slate-300 hover:bg-slate-50"
                  >
                    <Calculator className="h-4 w-4" />
                    Recalculate All
                  </Button>
                  <span className="text-xs text-slate-500">
                    Apply: only for cum/sqm. Recalculate: for all items.
                  </span>
                </div>
              </Card>
            )}

            <Card className="p-6 shadow-sm border border-slate-200 bg-white">
              <h3 className="text-base font-semibold text-slate-700 mb-1">Estimate Drawing / Sketch</h3>
              <p className="text-sm text-slate-500 mb-4">
                Draw cross-section, alignment, or site sketch for this estimate.
              </p>
              <EstimateDrawingSection
                value={estimateDrawing}
                onChange={setEstimateDrawing}
                disabled={estimateExists && !isEditing}
              />
            </Card>

            <StepNav
              step={3}
              totalSteps={STEPS.length}
              canNext={canAdvanceStep3}
              onPrev={goPrev}
              onNext={() => {
                setCompletedUpTo((p) => Math.max(p, 3));
                goNext();
              }}
              nextLabel="Continue to Add Items"
            />
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 4: ADD & MANAGE ITEMS
            ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <StepHeader
              step={4}
              icon={<ListChecks className="h-5 w-5 text-emerald-600" />}
              title="Add & Manage Items"
              description="Add estimate items from the library, a template, or manually"
            />

            <Card className="overflow-hidden rounded-2xl shadow-sm border border-slate-200/80 bg-white">
              {/* Card header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Estimate Items</h2>
                      <p className="text-sm text-slate-500 mt-0.5">Add and manage items in your estimate</p>
                    </div>
                  </div>

                  {(!estimateExists || isEditing) && (
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
                              <div className="text-xs text-slate-500">Bulk add from template</div>
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
                              <div className="text-xs text-slate-500">Use saved template</div>
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
                              <div className="text-xs text-slate-500">Add items one by one</div>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              {/* Items count */}
              <div className="px-6 pt-5 pb-1 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  Items List
                  <Badge variant="secondary" className="rounded-full bg-emerald-100 text-emerald-800 font-medium">
                    {items.length}
                  </Badge>
                </h3>
              </div>

              {/* Table or empty state */}
              <div className="px-6 pb-6">
                {items.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <EstimateTable
                      items={items}
                      estimateExists={estimateExists}
                      isEditing={isEditing}
                      onDeleteItem={(index) => {
                        setItems(
                          items
                            .filter((_, i) => i !== index)
                            .map((item, i) => ({ ...item, slNo: i + 1 }))
                        );
                      }}
                      onEditItem={handleEditItem}
                      onMoveItem={(index, direction) => {
                        const newItems = [...items];
                        if (direction === "up" && index > 0) {
                          [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
                        } else if (direction === "down" && index < items.length - 1) {
                          [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
                        }
                        setItems(newItems.map((item, i) => ({ ...item, slNo: i + 1 })));
                      }}
                      onOpenRateAnalysis={(index) => {
                        setRateAnalysisIndex(index);
                        setRateAnalysisOpen(true);
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-14 px-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                      <Plus className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">No items yet</h3>
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

              {/* Dialogs */}
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

            <StepNav
              step={4}
              totalSteps={STEPS.length}
              canNext={items.length > 0}
              onPrev={goPrev}
              onNext={() => {
                setCompletedUpTo((p) => Math.max(p, 4));
                goNext();
              }}
              nextLabel="Continue to Summary & Save"
              nextDisabledHint="Add at least one item to continue"
            />
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STEP 5: SUMMARY & SAVE
            ════════════════════════════════════════════════════════════════════ */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <StepHeader
              step={5}
              icon={<Calculator className="h-5 w-5 text-blue-600" />}
              title="Summary & Save"
              description="Review cost summary and save or export your estimate"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cost summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 shadow-sm border border-wb-border bg-white sticky top-[160px]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-wb-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-wb-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Cost Summary</h2>
                      <p className="text-sm text-slate-500">Total estimate calculations</p>
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
              </div>

              {/* Actions + items view */}
              <div className="lg:col-span-2 space-y-6">
                {/* Action buttons */}
                <Card className="p-6 shadow-sm border border-wb-border bg-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-wb-primary/10 rounded-lg">
                      <Sparkles className="h-5 w-5 text-wb-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Actions</h2>
                      <p className="text-sm text-slate-500">Manage and export estimate</p>
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

                {/* Items view (read-only) */}
                {items.length > 0 && (
                  <Card className="p-6 shadow-sm border border-wb-border bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-slate-800">Items Overview</h2>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-slate-600">
                          {items.length} items
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => goToStep(4)}
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs gap-1"
                        >
                          Edit Items
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="w-full overflow-x-auto rounded-lg border border-wb-border">
                      <EstimateTable
                        items={items}
                        estimateExists={true}
                        isEditing={false}
                        onDeleteItem={() => {}}
                        onEditItem={() => {}}
                        onMoveItem={() => {}}
                      />
                    </div>
                  </Card>
                )}

                {/* Tender vs Estimate comparison */}
                {(() => {
                  const tenderAmt: number =
                    works.find((w) => w.id === selectedWorkId)?.finalEstimateAmount ?? 0;
                  if (!tenderAmt || items.length === 0) return null;
                  const diff = finalCost - tenderAmt;
                  const isAbove = diff > 0;
                  const absDiff = Math.abs(diff);
                  const pct = Math.min(100, Math.round((finalCost / tenderAmt) * 100));

                  return (
                    <div
                      className={`rounded-2xl border-2 p-6 shadow-md ${
                        isAbove
                          ? "border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50"
                          : "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl ${isAbove ? "bg-orange-100" : "bg-green-100"}`}>
                            <span className={`text-2xl font-bold ${isAbove ? "text-orange-600" : "text-green-600"}`}>
                              {isAbove ? "▲" : "▼"}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-800">Tender vs Prepared Estimate</h3>
                            <p className="text-sm text-slate-500">Comparison against the tendered amount</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-6 items-center">
                          <div className="text-center">
                            <p className="text-xs text-slate-500 mb-0.5">Tender Amount</p>
                            <p className="text-xl font-bold text-slate-700">₹{tenderAmt.toLocaleString()}</p>
                          </div>
                          <div
                            className={`text-center px-4 py-2 rounded-xl border-2 ${
                              isAbove
                                ? "border-orange-300 bg-orange-100"
                                : "border-green-300 bg-green-100"
                            }`}
                          >
                            <p className="text-xs font-semibold text-slate-500 mb-0.5">
                              {isAbove ? "Above Tender By" : "Less Than Tender By"}
                            </p>
                            <p className={`text-xl font-bold ${isAbove ? "text-orange-700" : "text-green-700"}`}>
                              ₹{absDiff.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500 mb-0.5">Your Estimate</p>
                            <p className="text-xl font-bold text-blue-700">₹{finalCost.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>₹0</span>
                          <span className={`font-semibold ${isAbove ? "text-orange-600" : "text-green-600"}`}>
                            Your estimate is {pct}% of tender amount
                          </span>
                          <span>₹{tenderAmt.toLocaleString()}</span>
                        </div>
                        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isAbove ? "bg-orange-400" : "bg-green-400"
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Back button only in step 5 */}
            <StepNav
              step={5}
              totalSteps={STEPS.length}
              canNext={false}
              onPrev={goPrev}
            />
          </div>
        )}

      </div>

      {/* Print Preview */}
      <PrintPreview
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        projectInfo={{ ...projectInfo, drawingData: estimateDrawing }}
        items={items}
        contingency={contingency}
        itemTotal={itemTotal}
        gst={gst}
        costExclLWC={costExclLWC}
        lwc={lwc}
        costInclLWC={costInclLWC}
        finalCost={finalCost}
      />

      {/* Rate Analysis Editor */}
      <RateAnalysisEditor
        open={rateAnalysisOpen}
        onOpenChange={setRateAnalysisOpen}
        initialValue={
          rateAnalysisIndex !== null ? rateAnalyses[rateAnalysisIndex] : undefined
        }
        unit={
          rateAnalysisIndex !== null ? items[rateAnalysisIndex]?.unit || "unit" : "unit"
        }
        onSave={(value) => {
          if (rateAnalysisIndex === null) return;
          const idx = rateAnalysisIndex;
          setRateAnalyses((prev) => ({ ...prev, [idx]: value }));
          setItems((prev) => {
            const next = [...prev];
            const item = next[idx];
            const newRate = value.consolidatedRate || value.baseRatePerUnit || item.rate;
            const amount = (item.quantity || 0) * newRate;
            next[idx] = { ...item, rate: newRate, amount };
            return next;
          });
        }}
      />
    </div>
  );
}

/* ─── Reusable sub-components ─────────────────────────────────────────────── */

function StepHeader({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
          Step {step} of {STEPS.length}
        </div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-sm">
        {value}
      </div>
    </div>
  );
}

function StepNav({
  step,
  totalSteps,
  canNext,
  onPrev,
  onNext,
  nextLabel,
  nextDisabledHint,
}: {
  step: number;
  totalSteps: number;
  canNext: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabledHint?: string;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      <div>
        {step > 1 && onPrev && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className="gap-2 border-slate-300 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        {!canNext && nextDisabledHint && (
          <span className="text-xs text-slate-400 hidden sm:inline">{nextDisabledHint}</span>
        )}
        {step < totalSteps && onNext && (
          <Button
            type="button"
            onClick={canNext ? onNext : undefined}
            disabled={!canNext}
            className="gap-2 bg-wb-primary hover:bg-wb-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {nextLabel || "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
