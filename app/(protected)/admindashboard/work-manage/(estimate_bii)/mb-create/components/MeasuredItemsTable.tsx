import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trash2, FileText, Ruler } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MBEntry, EstimateItem } from "./types";

interface MeasuredItemsTableProps {
  mbEntries: MBEntry[];
  sortedMbEntries: MBEntry[];
  estimateItems: EstimateItem[];
  openEditDialog: (entry: MBEntry) => void;
  handleDeleteEntry: (entry: MBEntry) => void;
  recentlyAddedId: string | null;
}

export const MeasuredItemsTable: React.FC<MeasuredItemsTableProps> = ({
  mbEntries,
  sortedMbEntries,
  estimateItems,
  openEditDialog,
  handleDeleteEntry,
  recentlyAddedId,
}) => {
  if (mbEntries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="border-dashed border-2 border-wb-border bg-white">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <Ruler className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-gray-600">
                  No Measurements Yet
                </h3>
                <p className="text-gray-500 mt-1 max-w-md mx-auto">
                  Go to the &quot;Available Items&quot; tab to start adding measurements
                  to your book.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="bg-white border border-wb-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recorded Measurements</CardTitle>
        <CardDescription>
          Items that have been measured and added to the measurement book
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-wb-primary/5">
                <TableHead className="w-16 font-semibold">SL No</TableHead>
                <TableHead className="w-32 font-semibold">MB Details</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="w-28 text-right font-semibold">
                  Qty Exec
                </TableHead>
                <TableHead className="w-24 font-semibold">Unit</TableHead>
                <TableHead className="w-28 text-right font-semibold">
                  Amount
                </TableHead>
                <TableHead className="w-24 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {(() => {
                  let lastParentId: string | null = null; // Track by Parent ID, not estimateItemId from entry
                  return sortedMbEntries.map((entry, index) => {
                    // 1. Robust Parent Finding
                    const parentItem = estimateItems.find(
                      (item) => item.id === entry.estimateItemId
                    ) || estimateItems.find(
                      (item) => item.subItems?.some(s => s.description === entry.workItemDescription)
                    );

                    // 2. Robust SubItem Check
                    const checkIsSubItem = (e: any, pItem: any) => {
                      if (e.subItemId) return true;
                      if (!pItem || !Array.isArray((pItem as any).subItems)) return false;
                      return (pItem as any).subItems.some(
                        (sub: any) =>
                          typeof sub?.description === "string" &&
                          sub.description.trim() === e.workItemDescription.trim(),
                      );
                    };

                    const isSubItem = checkIsSubItem(entry, parentItem);
                    
                    // 3. Robust Grouping Logic
                    // Use parentItem.id for grouping if available, fallback to estimateItemId
                    const currentGroupId = parentItem?.id || entry.estimateItemId;
                    const isNewGroup = currentGroupId !== lastParentId;
                    
                    // Update lastParentId for next iteration
                    if (isNewGroup && currentGroupId) {
                      lastParentId = currentGroupId;
                    }

                    // Determine SL No
                    let displaySlNo = parentItem?.slNo?.toString() || "";
                    if (isSubItem && parentItem?.subItems) {
                      const subIdx = parentItem.subItems.findIndex(
                        (sub) =>
                          sub.id === entry.subItemId ||
                          sub.description === entry.workItemDescription,
                      );
                      if (subIdx !== -1) {
                        displaySlNo = `${parentItem.slNo}(${String.fromCharCode(
                          97 + subIdx,
                        )})`;
                      }
                    }

                    const rows = [];

                    // Add Group Header if it's a new group and is a subitem
                    if (isNewGroup && isSubItem && parentItem) {
                      rows.push(
                        <TableRow 
                          key={`group-${parentItem.id}-${index}`} 
                          className="bg-wb-primary/5 hover:bg-wb-primary/10"
                        >
                          <TableCell className="font-bold text-gray-800 border-r align-top">
                            {parentItem.slNo}
                          </TableCell>
                          <TableCell colSpan={6} className="font-bold text-gray-800">
                            {parentItem.description}
                          </TableCell>
                        </TableRow>
                      );
                    }

                    rows.push(
                      <motion.tr
                        key={entry.id || `temp-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          backgroundColor:
                            recentlyAddedId === entry.estimateItemId
                              ? "#ecfdf5"
                              : "transparent",
                        }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="group hover:bg-gray-50"
                      >
                        <TableCell className="font-medium text-gray-600">
                          {displaySlNo}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant="outline"
                              className="w-fit bg-wb-primary/10 text-wb-primary border-wb-primary/30 text-[10px]"
                            >
                              MB: {entry.mbNumber}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Pg: {entry.mbPageNumber}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[300px]">
                            <p className={`line-clamp-2 font-medium text-gray-800 ${isSubItem ? "pl-4" : ""}`}>
                              {entry.workItemDescription}
                            </p>
                            <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${isSubItem ? "pl-4" : ""}`}>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {new Date(
                                  entry.measuredDate,
                                ).toLocaleDateString()}
                              </span>
                              <span>•</span>
                              <span>By: {entry.measuredBy}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {entry.quantityExecuted.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {entry.unit}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-wb-success">
                          ₹{entry.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(entry)}
                              className="h-8 w-8 p-0 text-wb-primary hover:text-wb-primary hover:bg-wb-primary/10"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEntry(entry)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );

                    return rows;
                  });
                })()}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
