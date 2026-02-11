import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Calculator,
  Trash2,
  Edit,
  Save,
  X,
  Sparkles,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type EstimateItemFormValues } from "@/app/(protected)/admindashboard/work-manage/(estimate_bii)/estimate-preparation/schema";
import {
  EstimateItem,
  SubItem,
  Measurement,
  type GlobalDimensions,
  type DrainParams,
  DRAIN_PARAM_KEYS,
  DRAIN_PARAM_LABELS,
  type DrainParamKey,
} from "@/app/(protected)/admindashboard/work-manage/(estimate_bii)/estimate-preparation/types";

// Define the props interface
interface AddEstimateItemCardProps {
  form: UseFormReturn<EstimateItemFormValues>;
  addItem: (item: EstimateItem) => void;
  estimateExists: boolean;
  isEditing: boolean;
  setItems: (items: EstimateItem[]) => void;
  items: EstimateItem[];
  /** When true, used inside a dialog (compact header, optional cancel) */
  inDialog?: boolean;
  /** Override submit button label */
  submitLabel?: string;
  /** Road/Drain dimensions: pre-fill L,B,D for new items and after add */
  globalDimensions?: GlobalDimensions;
  /** Drain estimate params: link item L/B/D to these (like Excel) */
  drainParams?: DrainParams;
}

// Define FormSubItem type that matches the form's expected structure
// Extend SubItem type to ensure compatibility
type FormSubItem = Omit<SubItem, "id"> & {
  id?: string;
};

const defaultGlobalDimensions: GlobalDimensions = {
  length: "",
  breadth: "",
  depth: "",
};

export default function AddEstimateItemCard({
  form,
  addItem,
  estimateExists,
  isEditing,
  setItems,
  items,
  inDialog = false,
  submitLabel,
  globalDimensions = defaultGlobalDimensions,
  drainParams,
}: AddEstimateItemCardProps) {
  const [meas, setMeas] = useState({
    id: "",
    description: "",
    nos: "1",
    length: "",
    breadth: "",
    depth: "",
  });

  const [subItemForm, setSubItemForm] = useState({
    id: "",
    description: "",
    quantity: "",
    unit: "m",
    rate: "",
    nos: "1",
    length: "0",
    breadth: "0",
    depth: "0",
  });

  const [showSubItemsSection, setShowSubItemsSection] = useState(false);

  const [editingSubItemId, setEditingSubItemId] = useState<string | null>(null);
  const [editingMeasurementId, setEditingMeasurementId] = useState<
    string | null
  >(null);

  // Watch form values
  const values = form.watch();
  const isCumOrSqm =
    (values.unit || "").toLowerCase() === "cum" ||
    (values.unit || "").toLowerCase() === "sqm";
  const showDrainParamLinks = isCumOrSqm && drainParams && inDialog;
  const measurements = values.measurements || [];
  const subItems = values.subItems || [];
  const hasSubItems = subItems && subItems.length > 0;

  useEffect(() => {
    if (hasSubItems) {
      setShowSubItemsSection(true);
    }
  }, [hasSubItems]);

  const calculateMeasurementQty = (m: typeof meas, unit: string) => {
    const nos = Number(m.nos) || 0;
    const length = Number(m.length) || 0;
    const breadth = Number(m.breadth) || 0;
    const depth = Number(m.depth) || 0;

    let qty = 0;
    if (unit === "m") qty = nos * length;
    else if (unit === "sqm") qty = nos * length * breadth;
    else if (unit === "cum") qty = nos * length * breadth * depth;
    else if (unit === "no") qty = nos;

    return qty;
  };

  const addMeasurement = () => {
    if (!meas.description.trim()) {
      alert("Please enter a description for the measurement");
      return;
    }

    const qty = calculateMeasurementQty(meas, values.unit);

    if (editingMeasurementId) {
      // Update existing measurement
      const updatedMeasurements = measurements.map((m: any) =>
        m.id === editingMeasurementId
          ? {
              ...m,
              description: meas.description,
              nos: Number(meas.nos) || 0,
              length: Number(meas.length) || 0,
              breadth: Number(meas.breadth) || 0,
              depth: Number(meas.depth) || 0,
              quantity: qty,
            }
          : m,
      );

      const totalQty = updatedMeasurements.reduce(
        (sum: number, m: Measurement) => sum + m.quantity,
        0,
      );

      form.setValue("measurements", updatedMeasurements);
      form.setValue("quantity", totalQty.toFixed(3));

      setEditingMeasurementId(null);
    } else {
      // Add new measurement
      const newMeasurement: Measurement = {
        id: Math.random().toString(36).substr(2, 9),
        description: meas.description,
        nos: Number(meas.nos) || 0,
        length: Number(meas.length) || 0,
        breadth: Number(meas.breadth) || 0,
        depth: Number(meas.depth) || 0,
        quantity: qty,
      };

      const updatedMeasurements = [...measurements, newMeasurement];
      const totalQty = updatedMeasurements.reduce(
        (sum: number, m: any) => sum + (m.quantity || 0),
        0,
      );

      form.setValue("measurements", updatedMeasurements);
      form.setValue("quantity", totalQty.toFixed(3) as any);
    }

    setMeas({
      id: "",
      description: "",
      nos: "1",
      length: "",
      breadth: "",
      depth: "",
    });
  };

  const editMeasurement = (id: string) => {
    const measurement = measurements.find((m: Measurement) => m.id === id);
    if (measurement) {
      setMeas({
        id: measurement.id || "",
        description: measurement.description,
        nos: measurement.nos.toString(),
        length: measurement.length.toString(),
        breadth: measurement.breadth.toString(),
        depth: measurement.depth.toString(),
      });
      setEditingMeasurementId(id);
    }
  };

  const removeMeasurement = (id: string) => {
    const updatedMeasurements = measurements.filter(
      (m: Measurement) => m.id !== id,
    );
    const totalQty = updatedMeasurements.reduce(
      (sum: number, m: Measurement) => sum + m.quantity,
      0,
    );

    form.setValue("measurements", updatedMeasurements);
    form.setValue("quantity", totalQty.toFixed(3));

    if (editingMeasurementId === id) {
      setEditingMeasurementId(null);
      setMeas({
        id: "",
        description: "",
        nos: "1",
        length: "",
        breadth: "",
        depth: "",
      });
    }
  };

  const addSubItem = () => {
    const qty = Number(subItemForm.quantity) || 0;
    const rate = Number(subItemForm.rate) || 0;
    const nos = Number(subItemForm.nos) || 0;
    const length = Number(subItemForm.length) || 0;
    const breadth = Number(subItemForm.breadth) || 0;
    const depth = Number(subItemForm.depth) || 0;

    if (!subItemForm.description.trim()) {
      alert("Please enter a description for the sub-item");
      return;
    }

    if (qty <= 0) {
      alert("Please enter a valid quantity greater than 0");
      return;
    }

    if (rate <= 0) {
      alert("Please enter a valid rate greater than 0");
      return;
    }

    if (editingSubItemId) {
      // Update existing sub-item
      const updatedSubItems = subItems.map((item: FormSubItem) =>
        item.id === editingSubItemId
          ? {
              ...item,
              description: subItemForm.description,
              quantity: qty,
              unit: subItemForm.unit,
              rate: rate,
              amount: qty * rate,
              nos,
              length,
              breadth,
              depth,
            }
          : item,
      );

      form.setValue("subItems", updatedSubItems);
      setEditingSubItemId(null);
    } else {
      // Add new sub-item
      const newSubItem: FormSubItem = {
        id: Math.random().toString(36).substring(2, 9),
        description: subItemForm.description,
        quantity: qty,
        unit: subItemForm.unit,
        rate: rate,
        amount: qty * rate,
        nos,
        length,
        breadth,
        depth,
      };

      const updatedSubItems = [...subItems, newSubItem];
      form.setValue("subItems", updatedSubItems);
    }

    setSubItemForm({
      id: "",
      description: "",
      quantity: "",
      unit: "m",
      rate: "",
      nos: "1",
      length: "0",
      breadth: "0",
      depth: "0",
    });
  };

  const editSubItem = (id: string, idx: number) => {
    let item = id
      ? (subItems as FormSubItem[]).find((item: FormSubItem) => item.id === id)
      : (subItems as FormSubItem[])[idx];

    // If item exists but has no ID, assign one to ensure update works
    if (item && !item.id) {
      const newId = Math.random().toString(36).substr(2, 9);
      const updatedSubItems = [...(subItems as FormSubItem[])];
      updatedSubItems[idx] = { ...item, id: newId };

      form.setValue("subItems", updatedSubItems);

      item = updatedSubItems[idx];
    }

    if (item) {
      setSubItemForm({
        id: item.id || "",
        description: item.description || "",
        quantity: (item.quantity || 0).toString(),
        unit: item.unit || "m",
        rate: (item.rate || 0).toString(),
        nos: item.nos !== undefined ? item.nos.toString() : "1",
        length: (item.length !== undefined ? item.length : 0).toString(),
        breadth: (item.breadth !== undefined ? item.breadth : 0).toString(),
        depth: (item.depth !== undefined ? item.depth : 0).toString(),
      });
      setEditingSubItemId(item.id || null);
    }
  };

  const removeSubItem = (id: string, idx: number) => {
    let updatedSubItems;
    if (id) {
      updatedSubItems = (subItems as FormSubItem[]).filter(
        (item: FormSubItem) => item.id !== id,
      );
    } else {
      updatedSubItems = (subItems as FormSubItem[]).filter(
        (_: FormSubItem, index: number) => index !== idx,
      );
    }

    form.setValue("subItems", updatedSubItems);

    if (editingSubItemId === id) {
      setEditingSubItemId(null);
      setSubItemForm({
        id: "",
        description: "",
        quantity: "",
        unit: "m",
        rate: "",
        nos: "1",
        length: "0",
        breadth: "0",
        depth: "0",
      });
    }
  };

  const cancelEdit = () => {
    setEditingSubItemId(null);
    setEditingMeasurementId(null);
    setSubItemForm({
      id: "",
      description: "",
      quantity: "",
      unit: "m",
      rate: "",
      nos: "1",
      length: "0",
      breadth: "0",
      depth: "0",
    });
    setMeas({
      id: "",
      description: "",
      nos: "1",
      length: "",
      breadth: "",
      depth: "",
    });
  };

  const calculateQuantity = () => {
    // If we have measurements, use them
    if (measurements && measurements.length > 0) {
      return measurements
        .reduce((sum: number, m: Measurement) => sum + m.quantity, 0)
        .toFixed(3);
    }

    const nos = Number(values.nos) || 1;
    const length = Number(values.length) || 0;
    const breadth = Number(values.breadth) || 0;
    const depth = Number(values.depth) || 0;
    const ls = Number(values.nos) || 1;

    let calculatedQuantity = 0;

    switch (values.unit) {
      case "m":
        calculatedQuantity = nos * length;
        break;
      case "sqm":
        calculatedQuantity = nos * length * breadth;
        break;
      case "cum":
        calculatedQuantity = nos * length * breadth * depth;
        break;
      case "no":
        calculatedQuantity = nos;
        break;
      case "ls":
        calculatedQuantity = ls;
        break;
      default:
        return values.quantity;
    }

    return calculatedQuantity > 0 ? calculatedQuantity.toFixed(3) : "0";
  };

  // Auto-update quantity when dimensions change (only if no measurements)
  useEffect(() => {
    if (!measurements || measurements.length === 0) {
      if (
        values.unit === "m" ||
        values.unit === "sqm" ||
        values.unit === "cum" ||
        values.unit === "no"
      ) {
        const calculatedQty = calculateQuantity();
        if (calculatedQty !== values.quantity && calculatedQty !== "0") {
          form.setValue("quantity", calculatedQty);
        }
      }
    }
  }, [
    values.nos,
    values.length,
    values.breadth,
    values.depth,
    values.unit,
    measurements,
  ]);

  // When drain param keys or drainParams change, sync form L/B/D for quantity calc
  useEffect(() => {
    if (!drainParams || !showDrainParamLinks) return;
    const lk = values.lengthParamKey as DrainParamKey | undefined;
    const bk = values.breadthParamKey as DrainParamKey | undefined;
    const dk = values.depthParamKey as DrainParamKey | undefined;
    if (lk && lk in drainParams)
      form.setValue("length", String(Number(drainParams[lk]) || 0));
    if (bk && bk in drainParams)
      form.setValue("breadth", String(Number(drainParams[bk]) || 0));
    if (dk && dk in drainParams)
      form.setValue("depth", String(Number(drainParams[dk]) || 0));
  }, [
    drainParams,
    values.lengthParamKey,
    values.breadthParamKey,
    values.depthParamKey,
    showDrainParamLinks,
  ]);

  // Auto-update sub-item quantity
  useEffect(() => {
    const nos = Number(subItemForm.nos) || 0;
    const length = Number(subItemForm.length) || 0;
    const breadth = Number(subItemForm.breadth) || 0;
    const depth = Number(subItemForm.depth) || 0;

    let qty = 0;
    const unit = subItemForm.unit;

    if (unit === "m") qty = nos * length;
    else if (unit === "sqm") qty = nos * length * breadth;
    else if (unit === "cum") qty = nos * length * breadth * depth;
    else if (unit === "no") qty = nos;

    if (["m", "sqm", "cum", "no"].includes(unit)) {
      const calculated = qty.toFixed(3);
      // Avoid infinite loop by checking if value is different
      if (calculated !== subItemForm.quantity) {
        setSubItemForm((prev) => ({ ...prev, quantity: calculated }));
      }
    }
  }, [
    subItemForm.nos,
    subItemForm.length,
    subItemForm.breadth,
    subItemForm.depth,
    subItemForm.unit,
  ]);

  const handleAddItem = () => {
    let quantityToUse = Number(values.quantity);
    let amountToUse = quantityToUse * Number(values.rate);

    // If subItems exist, use their total amount
    if (subItems && subItems.length > 0) {
      amountToUse = (subItems as FormSubItem[]).reduce(
        (sum: number, item: FormSubItem) => sum + item.amount,
        0,
      );
      quantityToUse = 1; // Container item
    }

    // Validate
    if (!values.description?.trim()) {
      alert("Please enter description");
      return;
    }

    if (
      (!subItems || subItems.length === 0) &&
      (!quantityToUse || !Number(values.rate))
    ) {
      alert("Please enter quantity and rate, or add sub-items");
      return;
    }

    if (subItems && subItems.length > 0) {
      // Validate sub-items have valid amounts
      const invalidSubItems = (subItems as FormSubItem[]).filter(
        (item: FormSubItem) => item.amount <= 0,
      );
      if (invalidSubItems.length > 0) {
        alert("All sub-items must have a valid amount (quantity × rate)");
        return;
      }
    }

    // Convert FormSubItem[] to SubItem[] by ensuring all items have required id
    const subItemsForEstimate: SubItem[] = (subItems as FormSubItem[]).map(
      (item) => ({
        ...item,
        id: item.id || Math.random().toString(36).substr(2, 9), // Ensure id is not undefined
      }),
    );

    const toParamKey = (v: string | undefined): DrainParamKey | undefined =>
      v && v !== "none" && DRAIN_PARAM_KEYS.includes(v as DrainParamKey)
        ? (v as DrainParamKey)
        : undefined;
    const lKey = toParamKey(values.lengthParamKey);
    const bKey = toParamKey(values.breadthParamKey);
    const dKey = toParamKey(values.depthParamKey);
    const unitLower = (values.unit || "").toLowerCase();
    const depthForItem = unitLower === "sqm" ? 0 : Number(values.depth) || 0;
    const newItem: EstimateItem = {
      id: "",
      slNo: items.length + 1,
      schedulePageNo: values.schedulePageNo || "---",
      description: values.description,
      measurements: measurements || [],
      subItems: subItemsForEstimate,
      nos: Number(values.nos) || 1,
      length: Number(values.length) || 0,
      breadth: Number(values.breadth) || 0,
      depth: depthForItem,
      quantity: quantityToUse,
      unit: values.unit,
      rate: Number(values.rate) || 0,
      amount: amountToUse,
      ...(isCumOrSqm && (lKey || bKey || dKey)
        ? {
            lengthParamKey: lKey,
            breadthParamKey: bKey,
            depthParamKey: dKey,
          }
        : {}),
    };

    addItem(newItem);
    const L = drainParams?.lengthOfDrain ?? globalDimensions?.length ?? "0";
    const B = drainParams?.widthEarthCutting ?? globalDimensions?.breadth ?? "0";
    const D = drainParams?.avgDepthEarthCutting ?? globalDimensions?.depth ?? "0";
    form.reset({
      schedulePageNo: "",
      description: "",
      nos: "1",
      length: L,
      breadth: B,
      depth: D,
      quantity: "0",
      unit: "cum",
      rate: "0",
      measurements: [],
      subItems: [],
      lengthParamKey: "",
      breadthParamKey: "",
      depthParamKey: "",
    });

    // Reset edit states
    setEditingSubItemId(null);
    setEditingMeasurementId(null);
    setSubItemForm({
      id: "",
      description: "",
      quantity: "",
      unit: "m",
      rate: "",
      nos: "1",
      length: "0",
      breadth: "0",
      depth: "0",
    });
    setMeas({
      id: "",
      description: "",
      nos: "1",
      length: "",
      breadth: "",
      depth: "",
    });
  };

  const hasMeasurements = measurements && measurements.length > 0;
  const totalSubItemsAmount =
    (subItems as FormSubItem[])?.reduce(
      (sum: number, item: FormSubItem) => sum + item.amount,
      0,
    ) || 0;

  const buttonLabel = submitLabel ?? "Add Item to Estimate";

  return (
    <Card className={inDialog ? "border-0 shadow-none" : "border-0 shadow-lg"}>
      {!inDialog && (
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Estimate Item
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={inDialog ? "p-0 space-y-6" : "p-6 space-y-6"}>
        {/* Main Item Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormField
                control={form.control}
                name="schedulePageNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Page No.</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., P-49, P-50"
                        {...field}
                        className="border-slate-300"
                        disabled={estimateExists && !isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={estimateExists && !isEditing}
                    >
                      <FormControl>
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m">Meter (m)</SelectItem>
                        <SelectItem value="sqm">Square Meter (sqm)</SelectItem>
                        <SelectItem value="cum">Cubic Meter (cum)</SelectItem>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="MT">Metric Ton (MT)</SelectItem>
                        <SelectItem value="no">Number (no)</SelectItem>
                        <SelectItem value="LS">Lumpsum (LS)</SelectItem>
                        <SelectItem value="ha">Hectare (ha)</SelectItem>
                        <SelectItem value="l">Liter (l)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {showDrainParamLinks && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 space-y-3">
              <p className="text-sm font-medium text-slate-700">
                Link to drain parameters (change at top to auto-update this item)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="lengthParamKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Length from</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "none"}
                        disabled={estimateExists && !isEditing}
                      >
                        <FormControl>
                          <SelectTrigger className="border-slate-300 bg-white">
                            <SelectValue placeholder="Manual" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Manual</SelectItem>
                          {DRAIN_PARAM_KEYS.map((key) => (
                            <SelectItem key={key} value={key}>
                              {DRAIN_PARAM_LABELS[key]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="breadthParamKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Breadth from</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "none"}
                        disabled={estimateExists && !isEditing}
                      >
                        <FormControl>
                          <SelectTrigger className="border-slate-300 bg-white">
                            <SelectValue placeholder="Manual" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Manual</SelectItem>
                          {DRAIN_PARAM_KEYS.map((key) => (
                            <SelectItem key={key} value={key}>
                              {DRAIN_PARAM_LABELS[key]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="depthParamKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Depth from</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "none"}
                        disabled={estimateExists && !isEditing}
                      >
                        <FormControl>
                          <SelectTrigger className="border-slate-300 bg-white">
                            <SelectValue placeholder="Manual" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Manual</SelectItem>
                          {DRAIN_PARAM_KEYS.map((key) => (
                            <SelectItem key={key} value={key}>
                              {DRAIN_PARAM_LABELS[key]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Work</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of work item"
                      {...field}
                      className="border-slate-300 min-h-[80px] resize-none"
                      disabled={estimateExists && !isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Measurements Section - Hide if Sub Items exist */}
        {!showSubItemsSection && (
          <div className="border rounded-lg p-4 bg-slate-50 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">
                Measurements (for Quantity Calc)
              </h3>
              {editingMeasurementId && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-600 font-medium">
                    Editing Measurement
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEdit}
                    className="h-6 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" /> Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* List of added measurements */}
            {measurements && measurements.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Desc</TableHead>
                    <TableHead className="w-16">Nos</TableHead>
                    <TableHead className="w-20">L</TableHead>
                    <TableHead className="w-20">B</TableHead>
                    <TableHead className="w-20">D</TableHead>
                    <TableHead className="w-24 text-right">Qty</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {measurements.map((m: Measurement, idx: number) => (
                    <TableRow key={m.id || idx}>
                      <TableCell className="text-xs">
                        {m.description || "-"}
                      </TableCell>
                      <TableCell>{m.nos}</TableCell>
                      <TableCell>{m.length}</TableCell>
                      <TableCell>{m.breadth}</TableCell>
                      <TableCell>{m.depth}</TableCell>
                      <TableCell className="text-right">
                        {Number(m.quantity || 0).toFixed(3)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editMeasurement(m.id!)}
                            disabled={estimateExists && !isEditing}
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMeasurement(m.id!)}
                            disabled={estimateExists && !isEditing}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Add New Measurement Input */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
              <div className="md:col-span-2">
                <label className="text-xs font-medium">Sub-Description *</label>
                <Input
                  value={meas.description}
                  onChange={(e) =>
                    setMeas({ ...meas, description: e.target.value })
                  }
                  placeholder="e.g. In Foundation"
                  className="h-8 text-xs"
                  disabled={estimateExists && !isEditing}
                />
              </div>
              <div>
                <label className="text-xs font-medium">Nos</label>
                <Input
                  type="number"
                  value={meas.nos}
                  onChange={(e) => setMeas({ ...meas, nos: e.target.value })}
                  className="h-8 text-xs"
                  disabled={estimateExists && !isEditing}
                  min="1"
                />
              </div>
              <div>
                <label className="text-xs font-medium">L</label>
                <Input
                  type="number"
                  value={meas.length}
                  onChange={(e) => setMeas({ ...meas, length: e.target.value })}
                  className="h-8 text-xs"
                  disabled={estimateExists && !isEditing}
                  min="0"
                  step="any"
                />
              </div>
              <div>
                <label className="text-xs font-medium">B</label>
                <Input
                  type="number"
                  value={meas.breadth}
                  onChange={(e) =>
                    setMeas({ ...meas, breadth: e.target.value })
                  }
                  className="h-8 text-xs"
                  disabled={estimateExists && !isEditing}
                  min="0"
                  step="any"
                />
              </div>
              <div>
                <label className="text-xs font-medium">D</label>
                <Input
                  type="number"
                  value={meas.depth}
                  onChange={(e) => setMeas({ ...meas, depth: e.target.value })}
                  className="h-8 text-xs"
                  disabled={estimateExists && !isEditing}
                  min="0"
                  step="any"
                />
              </div>
              <div className="flex items-end pb-0.5">
                <Button
                  onClick={addMeasurement}
                  size="sm"
                  className="w-full h-8 text-xs"
                  disabled={estimateExists && !isEditing}
                >
                  {editingMeasurementId ? (
                    <Save className="h-3 w-3 mr-1" />
                  ) : (
                    <Plus className="h-3 w-3 mr-1" />
                  )}
                  {editingMeasurementId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Standard Calculation Fields - Only show if no measurements and no sub-items */}
        {!hasMeasurements && !showSubItemsSection && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <FormField
                control={form.control}
                name="nos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="border-slate-300"
                        disabled={estimateExists && !isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="border-slate-300"
                        disabled={estimateExists && !isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="breadth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breadth</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="border-slate-300"
                        disabled={estimateExists && !isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="depth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depth/Height</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="border-slate-300"
                        disabled={estimateExists && !isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-end pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const calculatedQty = calculateQuantity();
                  form.setValue("quantity", calculatedQty);
                }}
                className="w-full"
                disabled={estimateExists && !isEditing}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calc Qty
              </Button>
            </div>
          </div>
        )}

        {/* Sub-items Section */}
        {!showSubItemsSection && (
          <div className="flex justify-center py-2">
            <Button
              variant="outline"
              onClick={() => setShowSubItemsSection(true)}
              className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              disabled={estimateExists && !isEditing}
            >
              <Sparkles className="h-4 w-4" />
              Add Sub-items / Materials
            </Button>
          </div>
        )}

        {showSubItemsSection && (
          <div className="border rounded-lg p-4 bg-indigo-50/50 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Sub-items / Materials
              </h3>
              <div className="flex items-center gap-2">
                {editingSubItemId && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-600 font-medium">
                      Editing Sub-item
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEdit}
                      className="h-6 px-2 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" /> Cancel
                    </Button>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => {
                    if ((subItems as FormSubItem[]).length > 0) {
                      if (
                        confirm("This will remove all sub-items. Continue?")
                      ) {
                        form.setValue("subItems", []);
                        setShowSubItemsSection(false);
                      }
                    } else {
                      setShowSubItemsSection(false);
                    }
                  }}
                  disabled={estimateExists && !isEditing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {(subItems as FormSubItem[]) &&
              (subItems as FormSubItem[]).length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-20">Qty</TableHead>
                      <TableHead className="w-16">Unit</TableHead>
                      <TableHead className="w-24">Rate</TableHead>
                      <TableHead className="w-24 text-right">Amount</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(subItems as FormSubItem[]).map(
                      (item: FormSubItem, idx: number) => (
                        <TableRow key={item.id || idx}>
                          <TableCell className="text-xs">
                            {item.description}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.rate}</TableCell>
                          <TableCell className="text-right">
                            {(item.amount || 0).toFixed(3)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editSubItem(item.id || "", idx)}
                                disabled={estimateExists && !isEditing}
                              >
                                <Edit className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeSubItem(item.id || "", idx)
                                }
                                disabled={estimateExists && !isEditing}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                    <TableRow className="bg-slate-100 font-medium">
                      <TableCell colSpan={4} className="text-right">
                        Total Amount:
                      </TableCell>
                      <TableCell className="text-right">
                        {totalSubItemsAmount.toFixed(3)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}

            <div className="space-y-4">
              {/* Row 1: Description, Unit, Rate */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                <div className="md:col-span-6">
                  <label className="text-xs font-medium">Description *</label>
                  <Input
                    value={subItemForm.description}
                    onChange={(e) =>
                      setSubItemForm({
                        ...subItemForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Item name"
                    className="h-8 text-xs"
                    disabled={estimateExists && !isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium">Unit</label>
                  <Select
                    value={subItemForm.unit}
                    onValueChange={(value) =>
                      setSubItemForm({ ...subItemForm, unit: value })
                    }
                    disabled={estimateExists && !isEditing}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="sqm">sqm</SelectItem>
                      <SelectItem value="cum">cum</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="MT">MT</SelectItem>
                      <SelectItem value="no">no</SelectItem>
                      <SelectItem value="LS">LS</SelectItem>
                      <SelectItem value="ha">ha</SelectItem>
                      <SelectItem value="l">l</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium">Rate</label>
                  <Input
                    type="number"
                    value={subItemForm.rate}
                    onChange={(e) =>
                      setSubItemForm({ ...subItemForm, rate: e.target.value })
                    }
                    className="h-8 text-xs"
                    disabled={estimateExists && !isEditing}
                    min="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium">Amount</label>
                  <div className="h-8 flex items-center px-3 bg-slate-50 border rounded text-xs">
                    {(
                      (Number(subItemForm.quantity) || 0) *
                      (Number(subItemForm.rate) || 0)
                    ).toFixed(3)}
                  </div>
                </div>
              </div>

              {/* Row 2: Dimensions and Qty */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-end">
                <div>
                  <label className="text-xs font-medium">Nos</label>
                  <Input
                    type="number"
                    value={subItemForm.nos}
                    onChange={(e) =>
                      setSubItemForm({ ...subItemForm, nos: e.target.value })
                    }
                    className="h-8 text-xs"
                    disabled={estimateExists && !isEditing}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Length</label>
                  <Input
                    type="number"
                    value={subItemForm.length}
                    onChange={(e) =>
                      setSubItemForm({ ...subItemForm, length: e.target.value })
                    }
                    className="h-8 text-xs"
                    disabled={estimateExists && !isEditing}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Breadth</label>
                  <Input
                    type="number"
                    value={subItemForm.breadth}
                    onChange={(e) =>
                      setSubItemForm({
                        ...subItemForm,
                        breadth: e.target.value,
                      })
                    }
                    className="h-8 text-xs"
                    disabled={estimateExists && !isEditing}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Depth</label>
                  <Input
                    type="number"
                    value={subItemForm.depth}
                    onChange={(e) =>
                      setSubItemForm({ ...subItemForm, depth: e.target.value })
                    }
                    className="h-8 text-xs"
                    disabled={estimateExists && !isEditing}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Qty</label>
                  <Input
                    type="number"
                    value={subItemForm.quantity}
                    onChange={(e) =>
                      setSubItemForm({
                        ...subItemForm,
                        quantity: e.target.value,
                      })
                    }
                    className="h-8 text-xs font-bold bg-slate-50"
                    disabled={estimateExists && !isEditing}
                    min="0"
                  />
                </div>
                <div>
                  <Button
                    onClick={addSubItem}
                    className="w-full h-8"
                    disabled={estimateExists && !isEditing}
                  >
                    {editingSubItemId ? (
                      <Save className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span className="ml-2">
                      {editingSubItemId ? "Update" : "Add"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final Calculation Section */}
        <div className="p-4 bg-slate-100 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="border-slate-300 font-bold"
                        readOnly={hasMeasurements || hasSubItems}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="border-slate-300 font-bold"
                        disabled={(estimateExists && !isEditing) || hasSubItems}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Amount
              </label>
              <div className="h-10 px-3 py-2 bg-white border border-slate-300 rounded-md font-bold text-lg text-green-700">
                {hasSubItems
                  ? totalSubItemsAmount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })
                  : (
                      Number(values.quantity || 0) * Number(values.rate || 0)
                    ).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {inDialog && (
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={estimateExists && !isEditing}
              >
                Clear
              </Button>
            )}
            <Button
              onClick={handleAddItem}
              className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
              disabled={estimateExists && !isEditing}
            >
              <Plus className="h-4 w-4 mr-2" />
              {buttonLabel}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
