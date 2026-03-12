"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Check, Loader2, X, Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface EstimateType {
  id: string;
  name: string;
  code: string;
}

interface ScheduleRate {
  id: string;
  code: string;
  description: string;
  unit: string;
  rate: number;
  category: string;
  subItems?: any[];
}

interface EstimateLibraryDialogProps {
  onAddItems: (items: any[]) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

interface NewItemFormData {
  code: string;
  description: string;
  unit: string;
  rate: string;
  category: string;
}

const UNIT_OPTIONS = [
  { value: "m", label: "Meter (m)" },
  { value: "sqm", label: "Square Meter (sqm)" },
  { value: "cum", label: "Cubic Meter (cum)" },
  { value: "no", label: "Number (no)" },
  { value: "each", label: "Each" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "l", label: "Liter (l)" },
  { value: "hr", label: "Hour (hr)" },
  { value: "day", label: "Day" },
];

export default function EstimateLibraryDialog({
  onAddItems,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: EstimateLibraryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const [types, setTypes] = useState<EstimateType[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [rates, setRates] = useState<ScheduleRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [activeTab, setActiveTab] = useState<"library" | "create">("library");

  const [newItem, setNewItem] = useState<NewItemFormData>({
    code: "",
    description: "",
    unit: "m",
    rate: "",
    category: "General",
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof NewItemFormData, string>>
  >({});

  const { toast } = useToast();

  // Fetch estimate types
  const fetchTypes = useCallback(async () => {
    try {
      const res = await fetch("/api/development-works/estimate-types");
      if (res.ok) {
        const data = await res.json();
        const typesData = Array.isArray(data) ? data : [];
        setTypes(typesData);
        if (typesData.length > 0 && !selectedType) {
          setSelectedType(typesData[0].id);
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load estimate types",
        variant: "destructive",
      });
    }
  }, [selectedType, toast]);

  const fetchRates = useCallback(async () => {
    if (!selectedType) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        estimateTypeId: selectedType,
      });

      if (search.trim()) params.append("search", search.trim());
      if (categoryFilter !== "all")
        params.append("category", categoryFilter);

      const res = await fetch(
        `/api/development-works/schedule-rates?${params.toString()}`
      );

      if (res.ok) {
        const data = await res.json();
        setRates(data);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load schedule rates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedType, search, categoryFilter, toast]);

  useEffect(() => {
    if (open) fetchTypes();
  }, [open, fetchTypes]);

  useEffect(() => {
    const timer = setTimeout(fetchRates, 300);
    return () => clearTimeout(timer);
  }, [fetchRates]);

  const categories = useMemo(() => {
    const cats = new Set(rates.map((r) => r.category).filter(Boolean));
    return Array.from(cats);
  }, [rates]);

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) => {
      const set = new Set(prev);
      set.has(id) ? set.delete(id) : set.add(id);
      return set;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === rates.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(rates.map((r) => r.id)));
    }
  };

  const handleAddSelected = () => {
    const items = rates
      .filter((r) => selectedItems.has(r.id))
      .map((r) => ({
        schedulePageNo: r.code,
        description: r.description,
        unit: r.unit,
        rate: r.rate,
        quantity: 0,
        amount: 0,
        measurements: [],
        subItems: r.subItems || [],
        nos: 1,
        length: 0,
        breadth: 0,
        depth: 0,
      }));

    onAddItems(items);
    toast({
      title: "Items Added",
      description: `${items.length} item(s) added`,
    });
    setOpen(false);
    setSelectedItems(new Set());
  };

  const handleAddSingle = (rate: ScheduleRate) => {
    onAddItems([
      {
        schedulePageNo: rate.code,
        description: rate.description,
        unit: rate.unit,
        rate: rate.rate,
        quantity: 0,
        amount: 0,
        measurements: [],
        subItems: rate.subItems || [],
        nos: 1,
        length: 0,
        breadth: 0,
        depth: 0,
      },
    ]);

    toast({
      title: "Item Added",
      description: `${rate.code} added`,
    });
  };

  const validateForm = () => {
    const errors: any = {};
    if (!newItem.code.trim()) errors.code = "Required";
    if (!newItem.description.trim()) errors.description = "Required";
    if (!newItem.rate || parseFloat(newItem.rate) < 0)
      errors.rate = "Invalid rate";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateItem = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch("/api/development-works/schedule-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estimateTypeId: selectedType,
          ...newItem,
          rate: parseFloat(newItem.rate),
        }),
      });

      if (res.ok) {
        toast({ title: "Success", description: "Item created" });
        setActiveTab("library");
        setNewItem({
          code: "",
          description: "",
          unit: "m",
          rate: "",
          category: "General",
        });
        fetchRates();
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Select from Library
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="max-w-7xl h-[92vh] p-0 overflow-hidden rounded-2xl">
        <div className="flex h-full">

          {/* Sidebar */}
          <div className="w-72 border-r bg-muted/30 p-5 flex flex-col">
            <h3 className="text-xs font-semibold mb-4 text-muted-foreground">
              ESTIMATE TYPES
            </h3>
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {types.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition",
                      selectedType === type.id
                        ? "bg-primary/10 border border-primary/40"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="font-medium text-sm">{type.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {type.code}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main */}
          <div className="flex-1 flex flex-col">

            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">
                Estimate Item Library
              </h2>
              <p className="text-sm text-muted-foreground">
                Browse & select schedule items
              </p>
            </div>

            {/* Search */}
            <div className="px-6 py-4 flex gap-3 border-b">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="pl-9"
                />
              </div>

              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Filter category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="flex-1 px-6 py-4 overflow-hidden">
              <ScrollArea className="h-full border rounded-xl">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Checkbox
                          checked={
                            rates.length > 0 &&
                            selectedItems.size === rates.length
                          }
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">
                        Rate (₹)
                      </TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      rates.map((rate) => (
                        <TableRow key={rate.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.has(rate.id)}
                              onCheckedChange={() =>
                                toggleSelection(rate.id)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {rate.code}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {rate.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {rate.unit}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{rate.rate.toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                handleAddSingle(rate)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-between items-center bg-muted/20">
              <span className="text-sm text-muted-foreground">
                {selectedItems.size} selected
              </span>
              <Button
                disabled={selectedItems.size === 0}
                onClick={handleAddSelected}
              >
                Add Selected ({selectedItems.size})
              </Button>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
