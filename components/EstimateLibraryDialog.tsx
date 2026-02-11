"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  // Dialog state management
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  // Data state
  const [types, setTypes] = useState<EstimateType[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [rates, setRates] = useState<ScheduleRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();
  // New Item Form State
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
    } catch (error) {
      console.error("Error fetching types:", error);
      toast({
        title: "Error",
        description: "Failed to load estimate types",
        variant: "destructive",
      });
    }
  }, [selectedType]);

  // Fetch schedule rates with debouncing
  const fetchRates = useCallback(async () => {
    if (!selectedType) {
      setRates([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        estimateTypeId: selectedType,
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      const res = await fetch(
        `/api/development-works/schedule-rates?${params.toString()}`,
      );

      if (res.ok) {
        const data = await res.json();
        setRates(data);
      } else {
        throw new Error("Failed to fetch rates");
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
      toast({
        title: "Error",
        description: "Failed to load schedule rates",
        variant: "destructive",
      });
      setRates([]);
    } finally {
      setLoading(false);
    }
  }, [selectedType, search, categoryFilter]);

  // Initialize data when dialog opens
  useEffect(() => {
    if (open) {
      fetchTypes();
    }
  }, [open, fetchTypes]);

  // Fetch rates when dependencies change (with debounce for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRates();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchRates]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(rates.map((rate) => rate.category).filter(Boolean));
    return Array.from(cats);
  }, [rates]);

  // Toggle item selection
  const toggleSelection = useCallback((rateId: string) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(rateId)) {
        newSelected.delete(rateId);
      } else {
        newSelected.add(rateId);
      }
      return newSelected;
    });
  }, []);

  // Select/Deselect all
  const toggleSelectAll = useCallback(() => {
    if (selectedItems.size === rates.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(rates.map((rate) => rate.id)));
    }
  }, [rates]);

  // Add selected items to estimate
  const handleAddSelected = useCallback(() => {
    const itemsToAdd = rates
      .filter((rate) => selectedItems.has(rate.id))
      .map((rate) => ({
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
      }));

    onAddItems(itemsToAdd);
    toast({
      title: "Items Added",
      description: `${itemsToAdd.length} item(s) added to estimate`,
    });
    setOpen(false);
    setSelectedItems(new Set());
  }, [rates, selectedItems, onAddItems, setOpen]);

  // Add single item
  const handleAddSingle = useCallback(
    (rate: ScheduleRate) => {
      const itemToAdd = {
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
      };

      onAddItems([itemToAdd]);
      toast({
        title: "Item Added",
        description: `${rate.code} added to estimate`,
      });
    },
    [onAddItems],
  );

  // Validate new item form
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof NewItemFormData, string>> = {};

    if (!newItem.code.trim()) {
      errors.code = "Code is required";
    }

    if (!newItem.description.trim()) {
      errors.description = "Description is required";
    }

    if (
      !newItem.rate ||
      isNaN(parseFloat(newItem.rate)) ||
      parseFloat(newItem.rate) < 0
    ) {
      errors.rate = "Valid rate is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create new item
  const handleCreateItem = async () => {
    if (!validateForm() || !selectedType) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly",
        variant: "destructive",
      });
      return;
    }

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
        toast({
          title: "Success",
          description: "Item added to library",
        });

        // Reset form
        setNewItem({
          code: "",
          description: "",
          unit: "m",
          rate: "",
          category: "General",
        });
        setFormErrors({});
        setActiveTab("library");

        // Refresh rates
        fetchRates();
      } else {
        const error = await res.json();
        throw new Error(error.error || "Failed to create item");
      }
    } catch (error) {
      console.error("Error creating item:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create item",
        variant: "destructive",
      });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
  };

  // Reset dialog state when closed
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedItems(new Set());
      setSearch("");
      setCategoryFilter("all");
      setActiveTab("library");
      setFormErrors({});
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Select from Library
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="shrink-0 px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Estimate Item Library
          </DialogTitle>
          <DialogDescription>
            Browse and select items from your library or create new ones
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Sidebar - Categories */}
          <div className="w-64 flex-shrink-0 border-r p-4 flex flex-col min-h-0">
            <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
              ESTIMATE TYPES
            </h3>
            <ScrollArea className="h-[min(400px,50vh)]">
              <div className="space-y-1">
                {types.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm px-3 py-2 h-auto"
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex flex-col items-start">
                      <span>{type.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {type.code}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "library" | "create")}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="shrink-0 px-6 pt-4">
                <TabsList className="grid w-64 grid-cols-2">
                  <TabsTrigger value="library">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Library
                  </TabsTrigger>
                  <TabsTrigger value="create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Library Tab */}
              <TabsContent
                value="library"
                className="flex-1 flex flex-col min-h-0 p-6 pt-4 space-y-4 data-[state=active]:flex"
              >
                {/* Search and Filters */}
                <div className="shrink-0 flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by code, description, or category..."
                      className="pl-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(search || categoryFilter !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Results Info */}
                <div className="shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Showing {rates.length} items
                      {search && ` for "${search}"`}
                      {categoryFilter !== "all" && ` in ${categoryFilter}`}
                      {rates.length > 5 && (
                        <span className="ml-1.5 text-muted-foreground/80">
                          — scroll to view all
                        </span>
                      )}
                    </span>
                    {loading && (
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    )}
                  </div>

                  {rates.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={toggleSelectAll}>
                      {selectedItems.size === rates.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  )}
                </div>

                {/* Items Table - scrollable so all items are visible */}
                <ScrollArea className="h-[55vh] min-h-[280px] border rounded-lg bg-muted/20">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              rates.length > 0 &&
                              selectedItems.size === rates.length
                            }
                            onCheckedChange={toggleSelectAll}
                            aria-label="Select all"
                          />
                        </TableHead>
                        <TableHead className="w-32">Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-24">Unit</TableHead>
                        <TableHead className="w-32 text-right">
                          Rate (₹)
                        </TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Loading items...
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : rates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <Search className="h-12 w-12 text-muted-foreground opacity-50" />
                              <p className="text-muted-foreground">
                                No items found
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Try adjusting your search or filters
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        rates.map((rate) => (
                          <TableRow
                            key={rate.id}
                            className={cn(
                              selectedItems.has(rate.id) && "bg-muted/50",
                              "hover:bg-muted/30",
                            )}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.has(rate.id)}
                                onCheckedChange={() => toggleSelection(rate.id)}
                                aria-label={`Select ${rate.code}`}
                              />
                            </TableCell>
                            <TableCell className="font-mono font-medium">
                              <Badge variant="outline" className="font-mono">
                                {rate.code}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{rate.description}</span>
                                {rate.category && (
                                  <span className="text-xs text-muted-foreground">
                                    {rate.category}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="font-normal"
                              >
                                {rate.unit}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ₹{rate.rate.toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAddSingle(rate)}
                                  title="Add single item"
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                {rate.subItems && rate.subItems.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {rate.subItems.length} sub
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>

              {/* Create New Tab */}
              <TabsContent value="create" className="flex-1 p-6 pt-4">
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Create New Library Item
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Add a new item to the selected estimate type
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="code">Schedule Page No (Code) *</Label>
                        <Input
                          id="code"
                          value={newItem.code}
                          onChange={(e) =>
                            setNewItem({ ...newItem, code: e.target.value })
                          }
                          placeholder="e.g., P-12/A"
                          className={cn(
                            formErrors.code && "border-destructive",
                          )}
                        />
                        {formErrors.code && (
                          <p className="text-sm text-destructive">
                            {formErrors.code}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit *</Label>
                        <Select
                          value={newItem.unit}
                          onValueChange={(val) =>
                            setNewItem({ ...newItem, unit: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {UNIT_OPTIONS.map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description *</Label>
                        <Input
                          id="description"
                          value={newItem.description}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              description: e.target.value,
                            })
                          }
                          placeholder="Detailed description of the item..."
                          className={cn(
                            formErrors.description && "border-destructive",
                          )}
                        />
                        {formErrors.description && (
                          <p className="text-sm text-destructive">
                            {formErrors.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rate">Rate (₹) *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">
                            ₹
                          </span>
                          <Input
                            id="rate"
                            type="number"
                            step="0.01"
                            value={newItem.rate}
                            onChange={(e) =>
                              setNewItem({ ...newItem, rate: e.target.value })
                            }
                            placeholder="0.00"
                            className={cn(
                              "pl-8",
                              formErrors.rate && "border-destructive",
                            )}
                          />
                        </div>
                        {formErrors.rate && (
                          <p className="text-sm text-destructive">
                            {formErrors.rate}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newItem.category}
                          onChange={(e) =>
                            setNewItem({ ...newItem, category: e.target.value })
                          }
                          placeholder="e.g., Earthwork, Masonry, etc."
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveTab("library");
                          setFormErrors({});
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateItem}
                        disabled={!selectedType}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add to Library
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Footer Actions */}
            {activeTab === "library" && (
              <div className="border-t p-4 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">
                      {selectedItems.size} item
                      {selectedItems.size !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddSelected}
                      disabled={selectedItems.size === 0}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Selected ({selectedItems.size})
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
