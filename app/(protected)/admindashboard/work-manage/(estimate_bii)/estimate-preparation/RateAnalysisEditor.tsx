import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";
import { RateAnalysis, RateComponent, TransportBand, RateComponentCategory } from "./types";

interface RateAnalysisEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: RateAnalysis;
  onSave: (value: RateAnalysis) => void;
  unit: string;
}

const emptyComponent = (category: RateComponentCategory): RateComponent => ({
  id: crypto.randomUUID(),
  description: "",
  unit: "",
  quantity: 0,
  rate: 0,
  amount: 0,
  category,
});

const emptyBand = (): TransportBand => ({
  id: crypto.randomUUID(),
  fromKm: 0,
  toKm: 0,
  quantity: 0,
  ratePerUnitPerKm: 0,
  amount: 0,
});

export default function RateAnalysisEditor({
  open,
  onOpenChange,
  initialValue,
  onSave,
  unit,
}: RateAnalysisEditorProps) {
  const [model, setModel] = useState<RateAnalysis>(() => ({
    id: "",
    scheduleRef: "",
    components: [],
    transportBands: [],
    baseRatePerUnit: 0,
    consolidatedRate: 0,
  }));

  useEffect(() => {
    if (open) {
      setModel(
        initialValue ?? {
          id: crypto.randomUUID(),
          scheduleRef: "",
          components: [],
          transportBands: [],
          baseRatePerUnit: 0,
          consolidatedRate: 0,
        }
      );
    }
  }, [open, initialValue]);

  const recalc = (next: RateAnalysis): RateAnalysis => {
    const componentsTotal = next.components.reduce((sum, c) => sum + (c.amount || 0), 0);
    const bandsTotal = (next.transportBands ?? []).reduce(
      (sum, b) => sum + (b.amount || 0),
      0
    );
    const base = componentsTotal + bandsTotal;
    const consolidatedRate = unit ? base : 0;
    return {
      ...next,
      baseRatePerUnit: base,
      consolidatedRate,
    };
  };

  const updateComponent = (id: string, field: keyof RateComponent, value: string) => {
    setModel((prev) => {
      const components = prev.components.map((c) =>
        c.id === id
          ? recalcComponent({
              ...c,
              [field]:
                field === "description" || field === "unit" || field === "category" || field === "scheduleRef"
                  ? value
                  : Number(value) || 0,
            })
          : c
      );
      return recalc({ ...prev, components });
    });
  };

  const recalcComponent = (c: RateComponent): RateComponent => ({
    ...c,
    amount: (c.quantity || 0) * (c.rate || 0),
  });

  const updateBand = (id: string, field: keyof TransportBand, value: string) => {
    setModel((prev) => {
      const bands = (prev.transportBands ?? []).map((b) =>
        b.id === id
          ? recalcBand({
              ...b,
              [field]:
                field === "description" ? value : Number(value) || 0,
            })
          : b
      );
      return recalc({ ...prev, transportBands: bands });
    });
  };

  const recalcBand = (b: TransportBand): TransportBand => {
    const distance = Math.max(0, (b.toKm || 0) - (b.fromKm || 0));
    return {
      ...b,
      amount: (b.quantity || 0) * distance * (b.ratePerUnitPerKm || 0),
    };
  };

  const addComponentRow = (category: RateComponentCategory) => {
    setModel((prev) => recalc({ ...prev, components: [...prev.components, emptyComponent(category)] }));
  };

  const removeComponentRow = (id: string) => {
    setModel((prev) => recalc({ ...prev, components: prev.components.filter((c) => c.id !== id) }));
  };

  const addBandRow = () => {
    setModel((prev) =>
      recalc({
        ...prev,
        transportBands: [...(prev.transportBands ?? []), emptyBand()],
      })
    );
  };

  const removeBandRow = (id: string) => {
    setModel((prev) =>
      recalc({
        ...prev,
        transportBands: (prev.transportBands ?? []).filter((b) => b.id !== id),
      })
    );
  };

  const handleSave = () => {
    const next = recalc(model);
    onSave(next);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Rate Analysis</DialogTitle>
          <DialogDescription>
            Configure material, labour, and carriage components. Consolidated rate will flow to the item rate.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Schedule Reference (Page &amp; Item)
                </label>
                <Input
                  value={model.scheduleRef ?? ""}
                  onChange={(e) =>
                    setModel((prev) => ({
                      ...prev,
                      scheduleRef: e.target.value,
                    }))
                  }
                  placeholder="e.g., Page-240, Item No-3.16"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Base Rate / {unit || "unit"}
                  </label>
                  <Input value={model.baseRatePerUnit.toFixed(3)} readOnly />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Consolidated Rate / {unit || "unit"}
                  </label>
                  <Input value={model.consolidatedRate.toFixed(3)} readOnly />
                </div>
              </div>
            </div>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Components</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => addComponentRow("material")}>
                    <Plus className="h-3 w-3 mr-1" />
                    Material
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addComponentRow("labour")}>
                    <Plus className="h-3 w-3 mr-1" />
                    Labour
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addComponentRow("other")}>
                    <Plus className="h-3 w-3 mr-1" />
                    Other
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-2 py-2 text-left font-semibold w-20">Category</th>
                      <th className="px-2 py-2 text-left font-semibold">Description</th>
                      <th className="px-2 py-2 text-left font-semibold w-28">Unit</th>
                      <th className="px-2 py-2 text-right font-semibold w-24">Qty</th>
                      <th className="px-2 py-2 text-right font-semibold w-28">Rate</th>
                      <th className="px-2 py-2 text-right font-semibold w-28">Amount</th>
                      <th className="px-2 py-2 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {model.components.map((c) => (
                      <tr key={c.id} className="border-t">
                        <td className="px-2 py-1 capitalize text-slate-600">{c.category}</td>
                        <td className="px-2 py-1">
                          <Input
                            value={c.description}
                            onChange={(e) => updateComponent(c.id, "description", e.target.value)}
                            className="h-7 text-xs"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <Input
                            value={c.unit}
                            onChange={(e) => updateComponent(c.id, "unit", e.target.value)}
                            className="h-7 text-xs"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <Input
                            type="number"
                            value={c.quantity}
                            onChange={(e) => updateComponent(c.id, "quantity", e.target.value)}
                            className="h-7 text-xs text-right"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <Input
                            type="number"
                            value={c.rate}
                            onChange={(e) => updateComponent(c.id, "rate", e.target.value)}
                            className="h-7 text-xs text-right"
                          />
                        </td>
                        <td className="px-2 py-1 text-right font-medium">
                          {c.amount.toFixed(3)}
                        </td>
                        <td className="px-1 py-1 text-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-600 hover:text-red-700"
                            onClick={() => removeComponentRow(c.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {model.components.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-3 py-3 text-center text-slate-400">
                          No components added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Carriage / Transport (by distance)</h3>
                <Button size="sm" variant="outline" onClick={addBandRow}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Band
                </Button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-2 py-2 text-left font-semibold w-24">From (km)</th>
                      <th className="px-2 py-2 text-left font-semibold w-24">To (km)</th>
                      <th className="px-2 py-2 text-right font-semibold w-24">Qty (m³)</th>
                      <th className="px-2 py-2 text-right font-semibold w-32">Rate / unit / km</th>
                      <th className="px-2 py-2 text-right font-semibold w-32">Amount</th>
                      <th className="px-2 py-2 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {(model.transportBands ?? []).map((b) => (
                      <tr key={b.id} className="border-t">
                        <td className="px-2 py-1">
                          <Input
                            type="number"
                            value={b.fromKm}
                            onChange={(e) => updateBand(b.id, "fromKm", e.target.value)}
                            className="h-7 text-xs"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <Input
                            type="number"
                            value={b.toKm}
                            onChange={(e) => updateBand(b.id, "toKm", e.target.value)}
                            className="h-7 text-xs"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <Input
                            type="number"
                            value={b.quantity}
                            onChange={(e) => updateBand(b.id, "quantity", e.target.value)}
                            className="h-7 text-xs text-right"
                          />
                        </td>
                        <td className="px-2 py-1">
                          <Input
                            type="number"
                            value={b.ratePerUnitPerKm}
                            onChange={(e) => updateBand(b.id, "ratePerUnitPerKm", e.target.value)}
                            className="h-7 text-xs text-right"
                          />
                        </td>
                        <td className="px-2 py-1 text-right font-medium">
                          {b.amount.toFixed(3)}
                        </td>
                        <td className="px-1 py-1 text-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-600 hover:text-red-700"
                            onClick={() => removeBandRow(b.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {(model.transportBands ?? []).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-3 py-3 text-center text-slate-400">
                          No transport bands defined.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Apply Rate</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

