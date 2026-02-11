"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Save, FileText, Printer, Calculator, Loader2, Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WorkSearchAndSelect from "@/components/WorkSearchAndSelect";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { generateBillAbstractPDF } from "@/lib/pdf-generators/bill-abstract-pdf";

interface MBEntry {
  id: string;
  estimateItemId: string;
  subItemId?: string;
  mbNumber: string;
  mbPageNumber: string;
  workItemDescription: string;
  unit: string;
  quantityExecuted: number;
  rate: number;
  amount: number;
  measuredDate: string;
  measuredBy: string;
}

interface BillAbstractEntry {
  id?: string;
  mbEntryId: string;
  estimateItemId?: string;
  subItemId?: string;
  mbNumber: string;
  mbPageNumber: string;
  workItemDescription: string;
  unit: string;
  quantityExecuted: number;
  rate: number;
  amount: number;
  remarks?: string;
}

interface EstimateItem {
  id: string;
  slNo: number;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  subItems?: EstimateItem[];
}

interface DisplayItem {
  isHeader: boolean;
  slNo: string;
  description: string;
  mbNumber: string;
  mbPageNumber: string;
  quantity: number | string;
  unit: string;
  rate: number | string;
  amount: number | string;
  entryIndex?: number;
  originalEntry?: BillAbstractEntry;
  isSubItem?: boolean;
}

export default function BillAbstractClientPage() {
  const [works, setWorks] = useState<any[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<string>("");
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([]);
  const [mbEntries, setMbEntries] = useState<MBEntry[]>([]);
  const [billEntries, setBillEntries] = useState<BillAbstractEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [existingAbstractId, setExistingAbstractId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    billType: "1st & Final Bill",
    period: "",
    contractualPercentage: "0.150",
    cgstPercentage: "9.00",
    sgstPercentage: "9.00",
    labourCessPercentage: "1.00",
  });

  const getWorkLabel = (work: any) => {
    const title =
      work?.ApprovedActionPlanDetails?.activityDescription ||
      `Work ${work?.workslno || ""}`.trim();
    const code = work?.ApprovedActionPlanDetails?.activityCode;
    return code ? `${title} (Code: ${code})` : title;
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  useEffect(() => {
    if (selectedWorkId) {
      fetchEstimateItems(selectedWorkId);
      fetchMBEntries(selectedWorkId);
      fetchBillAbstract(selectedWorkId);
    } else {
      setEstimateItems([]);
      setMbEntries([]);
      setBillEntries([]);
    }
  }, [selectedWorkId]);

  const fetchWorks = async () => {
    try {
      const response = await fetch("/api/works");
      const data = await response.json();
      setWorks(data);
    } catch (error) {
      console.error("Error fetching works:", error);
    }
  };

  const fetchEstimateItems = async (workId: string) => {
    try {
      const response = await fetch(`/api/work-estimate-items?workId=${workId}`);
      if (response.ok) {
        const data = await response.json();
        const items = data.items || data || [];
        const validItems = items.filter((i: any) => !(i.description === "Contingency" && i.slNo === 9999));
        setEstimateItems(validItems.sort((a: any, b: any) => a.slNo - b.slNo));
      }
    } catch (error) {
      console.error("Error fetching estimate items:", error);
    }
  };

  const fetchMBEntries = async (workId: string) => {
    try {
      const response = await fetch(
        `/api/work-measurement-books?workId=${workId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setMbEntries(data);
      }
    } catch (error) {
      console.error("Error fetching MB entries:", error);
    }
  };

  const fetchBillAbstract = async (workId: string) => {
    try {
      const response = await fetch(`/api/work-bill-abstracts?workId=${workId}`);
      if (response.ok) {
        const data = await response.json();

        const selectedWork = works.find(w => w.id === workId);
        let calculatedPercentage = "0.150";

        if (selectedWork) {
          const estimateAmount = selectedWork.finalEstimateAmount || 0;
          const award = selectedWork.AwardofContract;
          const workOrder = award?.workorderdetails?.[0];
          const bidAgency = workOrder?.Bidagency;
          const bidAmount = bidAgency?.biddingAmount || 0;

          if (estimateAmount > 0 && bidAmount > 0) {
            const diff = estimateAmount - bidAmount;
            const percent = (diff / estimateAmount) * 100;
            calculatedPercentage = (Math.round(percent * 100) / 100).toFixed(2);
          }
        }

        if (data && data.length > 0) {
          const abstract = data[0];
          setBillEntries(abstract.entries || []);
          setExistingAbstractId(abstract.id);

          setFormData({
            billType: abstract.billType || "1st & Final Bill",
            period: abstract.period || "",
            contractualPercentage: abstract.contractualPercentage?.toString() || calculatedPercentage,
            cgstPercentage: "9.00",
            sgstPercentage: "9.00",
            labourCessPercentage: "1.00",
          });
        } else {
          setBillEntries([]);
          setExistingAbstractId(null);
          setFormData(prev => ({
            ...prev,
            contractualPercentage: calculatedPercentage,
            period: ""
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching bill abstract:", error);
    }
  };

  const generateBillFromMB = () => {
    const entries: BillAbstractEntry[] = mbEntries.map((mb) => ({
      mbEntryId: mb.id,
      estimateItemId: mb.estimateItemId,
      subItemId: mb.subItemId,
      mbNumber: mb.mbNumber,
      mbPageNumber: mb.mbPageNumber,
      workItemDescription: mb.workItemDescription,
      unit: mb.unit,
      quantityExecuted: Number(mb.quantityExecuted) || 0,
      rate: Number(mb.rate) || 0,
      amount: Number(mb.amount) || 0,
    }));

    setBillEntries(entries);
  };

  const isSubItem = (description: string) => {
    const trimmed = description.trim().toLowerCase();
    return /^(?:[a-z]\)|\([a-z]\)|[ivx]+\)|\([ivx]+\))/.test(trimmed);
  };

  const updateEntryMbRef = (
    index: number,
    field: "mbNumber" | "mbPageNumber",
    value: string,
  ) => {
    setBillEntries((prev) =>
      prev.map((entry, i) =>
        i === index
          ? {
              ...entry,
              [field]: value,
            }
          : entry,
      ),
    );
  };

  const getDisplayItems = (): DisplayItem[] => {
    if (!billEntries.length) return [];

    const displayItems: DisplayItem[] = [];
    const entryGroups = new Map<string, BillAbstractEntry[]>();
    const standaloneEntries: { entry: BillAbstractEntry; index: number }[] = [];

    billEntries.forEach((entry, index) => {
      if (entry.estimateItemId) {
        const existing = entryGroups.get(entry.estimateItemId) || [];
        entryGroups.set(entry.estimateItemId, [...existing, entry]);
      } else {
        standaloneEntries.push({ entry, index });
      }
    });

    estimateItems.forEach((estItem) => {
      const group = entryGroups.get(estItem.id);
      
      if (group && group.length > 0) {
        if (estItem.subItems && estItem.subItems.length > 0) {
          const groupTotalAmount = group.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
          
          displayItems.push({
            isHeader: true,
            slNo: estItem.slNo.toString(),
            description: estItem.description,
            mbNumber: "",
            mbPageNumber: "",
            quantity: "", 
            unit: "",
            rate: "",
            amount: groupTotalAmount,
          });

          estItem.subItems.forEach((sub, subIdx) => {
            const subEntry = group.find(e => e.subItemId === sub.id || e.workItemDescription === sub.description);
            
            if (subEntry) {
              const originalIndex = billEntries.findIndex(e => e === subEntry);
              displayItems.push({
                isHeader: false,
                slNo: `${String.fromCharCode(97 + subIdx)})`,
                description: subEntry.workItemDescription,
                mbNumber: subEntry.mbNumber,
                mbPageNumber: subEntry.mbPageNumber,
                quantity: subEntry.quantityExecuted,
                unit: subEntry.unit,
                rate: subEntry.rate,
                amount: subEntry.amount,
                entryIndex: originalIndex,
                originalEntry: subEntry,
                isSubItem: true
              });
            }
          });
        } else {
          group.forEach(entry => {
             const originalIndex = billEntries.findIndex(e => e === entry);
             displayItems.push({
                isHeader: false,
                slNo: estItem.slNo.toString(),
                description: entry.workItemDescription,
                mbNumber: entry.mbNumber,
                mbPageNumber: entry.mbPageNumber,
                quantity: entry.quantityExecuted,
                unit: entry.unit,
                rate: entry.rate,
                amount: entry.amount,
                entryIndex: originalIndex,
                originalEntry: entry
             });
          });
        }
      }
    });

    if (estimateItems.length === 0 && billEntries.length > 0) {
        return billEntries.map((entry, idx) => ({
             isHeader: false,
             slNo: (idx + 1).toString(),
             description: entry.workItemDescription,
             mbNumber: entry.mbNumber,
             mbPageNumber: entry.mbPageNumber,
             quantity: entry.quantityExecuted,
             unit: entry.unit,
             rate: entry.rate,
             amount: entry.amount,
             entryIndex: idx,
             originalEntry: entry
        }));
    }
    
    const specificIdsProcessed = new Set<string>();
    displayItems.forEach(d => {
        if(d.originalEntry && d.originalEntry.mbEntryId) specificIdsProcessed.add(d.originalEntry.mbEntryId);
    });

    billEntries.forEach((entry, idx) => {
        if (!specificIdsProcessed.has(entry.mbEntryId)) {
             displayItems.push({
                isHeader: false,
                slNo: "?",
                description: entry.workItemDescription,
                mbNumber: entry.mbNumber,
                mbPageNumber: entry.mbPageNumber,
                quantity: entry.quantityExecuted,
                unit: entry.unit,
                rate: entry.rate,
                amount: entry.amount,
                entryIndex: idx,
                originalEntry: entry
             });
        }
    });

    return displayItems;
  };

  const displayItems = getDisplayItems();

  const calculateItemwiseTotal = () => {
    return billEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  };

  const calculateContractualDeduction = () => {
    const total = calculateItemwiseTotal();
    const percentage = parseFloat(formData.contractualPercentage) || 0;
    return (total * percentage) / 100;
  };

  const calculateActualValue = () => {
    return calculateItemwiseTotal() - calculateContractualDeduction();
  };

  const handleGeneratePDF = async () => {
    if (billEntries.length === 0) {
      toast.error("No bill entries to print");
      return;
    }

    setGeneratingPDF(true);
    try {
      const work = works.find((w) => w.id === selectedWorkId);
      const workName =
        work?.ApprovedActionPlanDetails?.activityDescription ||
        `Work ${work?.workslno}`;
      const location = work?.ApprovedActionPlanDetails?.locationofAsset || "";

      const itemwiseTotal = calculateItemwiseTotal();
      const contractualDeduction = calculateContractualDeduction();
      const actualValue = calculateActualValue();
      const sayAmount = Math.round(actualValue);

      const cgstPercent = parseFloat(formData.cgstPercentage) || 0;
      const sgstPercent = parseFloat(formData.sgstPercentage) || 0;
      const lwcPercent = parseFloat(formData.labourCessPercentage) || 0;

      const cgstAmount = Math.round((sayAmount * cgstPercent) / 100);
      const sgstAmount = Math.round((sayAmount * sgstPercent) / 100);
      const subTotal = sayAmount + cgstAmount + sgstAmount;

      const lwcAmount = Math.round((subTotal * lwcPercent) / 100);
      const grossBillAmount = subTotal + lwcAmount;

      // Get all MB numbers and pages
      const allMbNumbers = displayItems.map((e) => e.mbNumber).filter(Boolean);
      const allMbPages = displayItems.map((e) => e.mbPageNumber).filter(Boolean);

      // Extract unique MB numbers
      const uniqueMbNumbers = Array.from(new Set(allMbNumbers));

      // For pages: Always use "1 to last page" format
      // Find the maximum page number
      const pageNumbers = allMbPages
        .map(p => parseInt(p, 10))
        .filter(p => !isNaN(p) && p > 0);

      let mbPages = "";
      if (pageNumbers.length > 0) {
        const lastPage = Math.max(...pageNumbers);
        if (lastPage === 1) {
          mbPages = "1";
        } else {
          mbPages = `1 to ${lastPage}`; // Always "1 to last page" format
        }
      } else {
        // If no valid page numbers found, use default
        mbPages = "1";
      }

      // For MB numbers
      let mbNumber = "";
      if (uniqueMbNumbers.length === 1) {
        mbNumber = uniqueMbNumbers[0];
      } else if (uniqueMbNumbers.length > 1) {
        // If multiple MBs, use the first one
        mbNumber = uniqueMbNumbers[0];
      }

      const pdfData = {
        billType: formData.billType,
        projectName: workName,
        projectLocation: location,
        entries: displayItems.map((entry) => ({
          workItemDescription: entry.description || "",
          mbNumber: entry.mbNumber,
          mbPageNumber: entry.mbPageNumber,
          quantityExecuted: Number(entry.quantity) || 0,
          unit: entry.unit || "",
          rate: Number(entry.rate) || 0,
          amount: Number(entry.amount) || 0,
          remarks: entry.originalEntry?.remarks || "",
          isHeader: entry.isHeader,
          isSubItem: entry.isSubItem,
          slNo: entry.slNo,
        })),
        itemwiseTotal,
        contractualPercent: formData.contractualPercentage,
        contractualDeduction,
        actualValue,
        sayAmount,
        cgstPercent: formData.cgstPercentage,
        cgstAmount,
        sgstPercent: formData.sgstPercentage,
        sgstAmount,
        lwcPercent: formData.labourCessPercentage,
        lwcAmount,
        subTotal,
        grossBillAmount,
        mbNumber: mbNumber,
        mbPages: mbPages, // Now always "1 to lastPage" format
      };

      const pdfBytes = await generateBillAbstractPDF(pdfData);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Bill_Abstract_${workName.substring(0, 20).replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleSave = async () => {
    if (!selectedWorkId) {
      toast.error("Please select a work");
      return;
    }

    if (billEntries.length === 0) {
      toast.error("Please generate bill entries from MB");
      return;
    }

    setLoading(true);
    try {
      const itemwiseTotal = calculateItemwiseTotal();
      const contractualDeduction = calculateContractualDeduction();
      const actualValue = calculateActualValue();
      const sayAmount = Math.round(actualValue);

      const cgstPercent = parseFloat(formData.cgstPercentage) || 0;
      const sgstPercent = parseFloat(formData.sgstPercentage) || 0;
      const lwcPercent = parseFloat(formData.labourCessPercentage) || 0;

      const cgstAmount = Math.round((sayAmount * cgstPercent) / 100);
      const sgstAmount = Math.round((sayAmount * sgstPercent) / 100);
      const subTotal = sayAmount + cgstAmount + sgstAmount;

      const lwcAmount = Math.round((subTotal * lwcPercent) / 100);
      const grossBillAmount = subTotal + lwcAmount;

      const payload = {
        billType: formData.billType,
        period: formData.period,
        contractualPercentage: parseFloat(formData.contractualPercentage),
        itemwiseTotal,
        contractualDeduction,
        actualValue,
        grossBillAmount,
        entries: billEntries,
      };

      const isUpdate = !!existingAbstractId;
      const response = await fetch("/api/work-bill-abstracts", {
        method: isUpdate ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isUpdate ? { id: existingAbstractId, ...payload } : { workId: selectedWorkId, ...payload }
        ),
      });

      if (response.ok) {
        toast.success(isUpdate ? "Bill Abstract updated successfully" : "Bill Abstract saved successfully");
        fetchBillAbstract(selectedWorkId);
      } else {
        toast.error(isUpdate ? "Failed to update Bill Abstract" : "Failed to save Bill Abstract");
      }
    } catch (error) {
      console.error("Error saving Bill Abstract:", error);
      toast.error("Error saving Bill Abstract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wb-bg container mx-auto px-4 py-8 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-wb-primary">
            Bill Abstract
          </h1>
          <p className="text-gray-600 mt-2">
            Generate and manage bill abstracts
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={generateBillFromMB}
            disabled={!selectedWorkId || mbEntries.length === 0}
            className="gap-2 border-wb-border hover:bg-wb-primary/5 hover:border-wb-primary transition-colors"
          >
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Generate from MB</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleGeneratePDF}
            disabled={billEntries.length === 0 || generatingPDF}
            className="gap-2 border-wb-border hover:bg-wb-success/10 hover:border-wb-success transition-colors"
          >
            {generatingPDF ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Printer className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Print PDF</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || billEntries.length === 0}
            className="gap-2 bg-wb-primary hover:bg-wb-primary/90 shadow-md hover:shadow-lg transition-all text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : existingAbstractId ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{existingAbstractId ? "Update Abstract" : "Save Abstract"}</span>
          </Button>
        </div>
      </div>

      <Card className="border-t-4 border-t-wb-primary bg-white border border-wb-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-wb-primary">Work Details & Configuration</CardTitle>
          <CardDescription>
            Select a work and configure bill parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="work" className="font-semibold">
                Select Work
              </Label>
              <WorkSearchAndSelect
                works={works}
                selectedWorkId={selectedWorkId}
                onSelect={setSelectedWorkId}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="billType" className="font-semibold">
                  Bill Type
                </Label>
                <Select
                  value={formData.billType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, billType: value })
                  }
                >
                  <SelectTrigger id="billType">
                    <SelectValue placeholder="Select Bill Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st & Final Bill">
                      1st & Final Bill
                    </SelectItem>
                    <SelectItem value="1st RA Bill">1st RA Bill</SelectItem>
                    <SelectItem value="2nd RA Bill">2nd RA Bill</SelectItem>
                    <SelectItem value="Final Bill">Final Bill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="period" className="font-semibold">
                  Bill Period
                </Label>
                <Input
                  id="period"
                  placeholder="e.g. Jan 2024 - Feb 2024"
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({ ...formData, period: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractualPercentage" className="font-semibold">
                  Contractual Percentage
                </Label>
                <div className="relative">
                  <Input
                    id="contractualPercentage"
                    type="number"
                    step="0.01"
                    className="pr-8"
                    value={formData.contractualPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contractualPercentage: e.target.value,
                      })
                    }
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card className="h-full bg-white border border-wb-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-wb-primary">Bill Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-lg border border-wb-border m-4 overflow-hidden">
              <Table>
                <TableHeader className="bg-wb-primary/5">
                  <TableRow>
                    <TableHead className="w-[50px]">Sl No</TableHead>
                    <TableHead className="w-[40%]">Items</TableHead>
                    <TableHead className="w-[120px]">MB No. & Page No.</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="w-[80px]">Unit</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-10 text-muted-foreground"
                      >
                        {selectedWorkId
                          ? "No entries generated yet. Click 'Generate from MB'."
                          : "Select a work to begin."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayItems.map((item, dIndex) => {
                       if (item.isHeader) {
                           return (
                               <TableRow key={`header-${dIndex}`} className="bg-wb-primary/10 hover:bg-wb-primary/15 font-semibold border-b-2 border-wb-primary/20">
                                   <TableCell className="font-bold text-center align-middle">{item.slNo}</TableCell>
                                   <TableCell colSpan={5} className="align-middle text-wb-primary">
                                       {item.description}
                                   </TableCell>
                                   <TableCell className="text-right font-mono font-bold align-middle">
                                       {typeof item.amount === 'number' ? item.amount.toFixed(2) : item.amount}
                                   </TableCell>
                               </TableRow>
                           );
                       } else {
                           return (
                               <TableRow key={`item-${dIndex}`} className="hover:bg-muted/5">
                                 <TableCell className="font-medium text-center align-top">
                                   {item.slNo}
                                 </TableCell>
                                 <TableCell className="max-w-[300px]">
                                   <span className={`font-medium text-sm text-foreground/90 whitespace-pre-wrap block ${item.isSubItem ? "pl-12" : ""}`}>
                                     {item.description}
                                   </span>
                                 </TableCell>
                                 <TableCell className="align-top">
                                   <div className="flex flex-col gap-1.5">
                                     <div className="flex items-center gap-1">
                                       <span className="text-[10px] text-muted-foreground w-6">MB:</span>
                                       <Input
                                         className="h-6 text-xs font-mono"
                                         placeholder="MB No"
                                         value={item.mbNumber}
                                         onChange={(e) =>
                                           item.entryIndex !== undefined && updateEntryMbRef(
                                             item.entryIndex,
                                             "mbNumber",
                                             e.target.value,
                                           )
                                         }
                                       />
                                     </div>
                                     <div className="flex items-center gap-1">
                                       <span className="text-[10px] text-muted-foreground w-6">Pg:</span>
                                       <Input
                                         className="h-6 text-xs font-mono"
                                         placeholder="Page"
                                         value={item.mbPageNumber}
                                         onChange={(e) =>
                                            item.entryIndex !== undefined && updateEntryMbRef(
                                             item.entryIndex,
                                             "mbPageNumber",
                                             e.target.value,
                                           )
                                         }
                                       />
                                     </div>
                                   </div>
                                 </TableCell>
                                 <TableCell className="text-right font-mono text-sm align-top">
                                   {typeof item.quantity === 'number' ? item.quantity.toFixed(3) : item.quantity}
                                 </TableCell>
                                 <TableCell className="text-muted-foreground text-sm align-top">
                                   {item.unit}
                                 </TableCell>
                                 <TableCell className="text-right font-mono text-sm align-top">
                                   {typeof item.rate === 'number' ? item.rate.toFixed(2) : item.rate}
                                 </TableCell>
                                 <TableCell className="text-right font-mono font-medium text-sm align-top">
                                   {typeof item.amount === 'number' ? item.amount.toFixed(2) : item.amount}
                                 </TableCell>
                               </TableRow>
                           );
                       }
                    })
                  )}
                  {billEntries.length > 0 && (
                    <TableRow className="bg-wb-primary/5 font-medium">
                      <TableCell colSpan={6} className="text-right pr-4 py-3">Itemwise Total =</TableCell>
                      <TableCell className="text-right font-mono py-3">{calculateItemwiseTotal().toFixed(2)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white w-full max-w-3xl ml-auto border border-wb-border shadow-sm">
          <CardContent className="p-6 space-y-2">
            {(() => {
              const itemwiseTotal = calculateItemwiseTotal();

              const contractualPercentage = parseFloat(formData.contractualPercentage) || 0;
              const contractualDeduction = (itemwiseTotal * contractualPercentage) / 100;

              const actualValue = itemwiseTotal - contractualDeduction;
              const sayAmount = Math.round(actualValue);

              const cgstPercent = parseFloat(formData.cgstPercentage) || 0;
              const sgstPercent = parseFloat(formData.sgstPercentage) || 0;

              const cgstAmount = Math.round((sayAmount * cgstPercent) / 100);
              const sgstAmount = Math.round((sayAmount * sgstPercent) / 100);

              const subTotal = sayAmount + cgstAmount + sgstAmount;

              const lwcPercent = 1.0;
              const lwcAmount = Math.round((subTotal * lwcPercent) / 100);

              const grossBillAmount = subTotal + lwcAmount;

              return (
                <>
                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Less contractual percentage @</span>
                      <div className="relative w-20">
                        <Input
                          type="number"
                          step="0.01"
                          className="h-7 text-right pr-6"
                          value={formData.contractualPercentage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contractualPercentage: e.target.value,
                            })
                          }
                        />
                        <span className="absolute right-2 top-1.5 text-xs text-muted-foreground">%</span>
                      </div>
                    </div>
                    <span className="font-mono text-sm">{contractualDeduction.toFixed(2)}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between items-center py-1 font-semibold">
                    <span>Actual Value of Work done</span>
                    <span className="font-mono">{actualValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-muted-foreground text-right w-full pr-4">SAY</span>
                    <span className="font-mono font-bold">{sayAmount.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />

                  <div className="text-sm font-semibold underline mb-1">Add:-</div>

                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Add CGST @</span>
                      <div className="relative w-20">
                        <Input
                          type="number"
                          step="0.01"
                          className="h-7 text-right pr-6"
                          value={formData.cgstPercentage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cgstPercentage: e.target.value,
                            })
                          }
                        />
                        <span className="absolute right-2 top-1.5 text-xs text-muted-foreground">%</span>
                      </div>
                    </div>
                    <span className="font-mono text-sm">{cgstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Add SGST @</span>
                      <div className="relative w-20">
                        <Input
                          type="number"
                          step="0.01"
                          className="h-7 text-right pr-6"
                          value={formData.sgstPercentage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sgstPercentage: e.target.value,
                            })
                          }
                        />
                        <span className="absolute right-2 top-1.5 text-xs text-muted-foreground">%</span>
                      </div>
                    </div>
                    <span className="font-mono text-sm">{sgstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t mt-1 pt-2">
                    <span className="text-sm font-medium text-right w-full pr-4">Sub Total=</span>
                    <span className="font-mono font-semibold">{subTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Add L.W.Cess @</span>
                      <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">1.00%</span>
                    </div>
                    <span className="font-mono text-sm">{lwcAmount.toFixed(2)}</span>
                  </div>

                  <Separator className="my-2 bg-wb-primary/20" />

                  <div className="flex justify-between items-center py-2 bg-wb-primary/10 px-4 -mx-4 rounded-md">
                    <span className="font-bold text-lg text-wb-primary">GROSS BILL AMOUNT=</span>
                    <span className="font-mono text-xl font-bold tracking-tight text-wb-primary">{grossBillAmount.toFixed(0)}</span>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
