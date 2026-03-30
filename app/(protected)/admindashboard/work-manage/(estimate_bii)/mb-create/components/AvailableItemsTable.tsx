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
import {
  Plus,
  ChevronDown,
  ChevronRightIcon,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { MBFormData, MeasurableItem } from "./types";

interface AvailableItemsTableProps {
  availableEstimateItems: any[];
  groupedItems: any[];
  expandedGroups: Set<string>;
  toggleGroup: (groupId: string) => void;
  addAllSubItems: (parentItem: MeasurableItem) => void;
  openAddDialog: (estimateItem: MeasurableItem) => void;
  formData: MBFormData;
  setActiveTab: (tab: string) => void;
}

const truncateText = (text: string, maxLength: number = 700) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const AvailableItemsTable: React.FC<AvailableItemsTableProps> = ({
  availableEstimateItems,
  groupedItems,
  expandedGroups,
  toggleGroup,
  addAllSubItems,
  openAddDialog,
  formData,
  setActiveTab,
}) => {
  if (availableEstimateItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="border border-green-100 bg-gradient-to-b from-green-50/30 to-white shadow-sm rounded-xl">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center justify-center space-y-5">
              <div className="p-4 bg-green-100/80 rounded-full shadow-sm">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-slate-800">
                  All Items Measured
                </h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                  Great job! All estimate items have been added to the
                  measurement book. You can now save or print the measurement
                  book.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveTab("measured")}
                className="mt-6 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all"
              >
                View Measured Items
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-800">Available Estimate Items</CardTitle>
        <CardDescription className="text-slate-500">
          Select items to add measurements. Items will move to measured section
          after adding.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="w-20 font-semibold text-slate-600">SL No</TableHead>
                <TableHead className="font-semibold text-slate-600">Description</TableHead>
                <TableHead className="w-24 text-right font-semibold text-slate-600">
                  Qty
                </TableHead>
                <TableHead className="w-20 font-semibold text-slate-600">Unit</TableHead>
                <TableHead className="w-28 text-right font-semibold text-slate-600">
                  Rate
                </TableHead>
                <TableHead className="w-32 text-right font-semibold text-slate-600">
                  Amount
                </TableHead>
                <TableHead className="w-32 font-semibold text-slate-600 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedItems.map((group: any) => {
                if (group.isHeader) {
                  const isExpanded = expandedGroups.has(group.id);

                  return (
                    <React.Fragment key={group.id}>
                      {/* Parent Header Row */}
                      <TableRow className="bg-blue-50/30 border-t border-slate-200 transition-colors">
                        <TableCell className="font-bold text-blue-700">
                          {group.slNo}
                        </TableCell>
                        <TableCell
                          colSpan={5}
                          className="font-semibold text-slate-700 pb-2 border-b border-transparent"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleGroup(group.id)}
                                className="h-7 w-7 p-0 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-md transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRightIcon className="h-4 w-4" />
                                )}
                              </Button>
                              <span className="line-clamp-2" title={group.description}>
                                {truncateText(group.description)}
                              </span>
                              <Badge
                                variant="secondary"
                                className="ml-2 text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-blue-700 hover:bg-blue-200/80 border-transparent shadow-none"
                              >
                                {group.availableSubItems.length} subitems
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const truncatedGroup = {
                                ...group,
                                description: truncateText(group.description),
                                availableSubItems: group.availableSubItems?.map((sub: any) => ({
                                  ...sub,
                                  description: truncateText(sub.description)
                                }))
                              };
                              addAllSubItems(truncatedGroup);
                            }}
                            disabled={
                              !formData.mbNumber ||
                              !formData.mbPageNumber ||
                              !formData.measuredBy
                            }
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 transition-all font-medium"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Add All
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Subitems (Collapsible) */}
                      {isExpanded &&
                        group.availableSubItems.map((subItem: any) => (
                          <TableRow
                            key={subItem.id}
                            className="hover:bg-slate-50 group border-b border-slate-100 transition-colors"
                          >
                            <TableCell className="pl-12 text-slate-400 font-medium">
                              {subItem.displaySlNo}
                            </TableCell>
                            <TableCell className="pl-10 text-slate-600 text-sm">
                              <div className="flex items-start gap-2">
                                <span className="text-slate-400 font-medium min-w-fit">
                                  ({subItem.displaySlNo?.split("(")[1]}
                                </span>
                                <span className="line-clamp-2 group-hover:text-slate-800 transition-colors" title={subItem.description}>
                                  {truncateText(subItem.description)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium text-slate-700">
                              {(subItem.quantity ?? 0).toFixed(3)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-slate-100 text-slate-600 border-slate-200"
                              >
                                {subItem.unit ?? "-"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-slate-500">
                              ₹{(subItem.rate ?? 0).toFixed(3)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-slate-700">
                              ₹{(subItem.amount ?? 0).toFixed(3)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openAddDialog({
                                    ...subItem,
                                    description: truncateText(subItem.description),
                                    isSubItem: true,
                                    parentId: group.id,
                                    displaySlNo: subItem.displaySlNo,
                                  })
                                }
                                disabled={
                                  !formData.mbNumber ||
                                  !formData.mbPageNumber ||
                                  !formData.measuredBy
                                }
                                className="w-full bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-sm transition-all"
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  );
                } else {
                  // Regular item without subitems
                  return (
                    <TableRow key={group.id} className="hover:bg-slate-50 transition-colors group">
                      <TableCell className="font-medium text-slate-700">
                        {group.slNo}
                      </TableCell>
                      <TableCell className="line-clamp-2 text-slate-600 group-hover:text-slate-800 transition-colors" title={group.description}>
                        {truncateText(group.description)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-700">
                        {(group.quantity ?? 0).toFixed(3)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                          {group.unit ?? "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-slate-500">
                        ₹{(group.rate ?? 0).toFixed(3)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        ₹{(group.amount ?? 0).toFixed(3)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAddDialog({
                            ...group,
                            description: truncateText(group.description)
                          })}
                          disabled={
                            !formData.mbNumber ||
                            !formData.mbPageNumber ||
                            !formData.measuredBy
                          }
                          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 transition-all font-medium"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
