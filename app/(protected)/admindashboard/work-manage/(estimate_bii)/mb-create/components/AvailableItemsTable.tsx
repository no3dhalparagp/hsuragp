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
        <Card className="border-wb-border bg-white">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-wb-success/20 rounded-full">
                <CheckCircle className="h-12 w-12 text-wb-success" />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-gray-800">
                  All Items Measured
                </h3>
                <p className="text-gray-500 mt-1 max-w-md mx-auto">
                  Great job! All estimate items have been added to the
                  measurement book. You can now save or print the measurement
                  book.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveTab("measured")}
                className="mt-4"
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
    <Card className="bg-white border border-wb-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Available Estimate Items</CardTitle>
        <CardDescription>
          Select items to add measurements. Items will move to measured section
          after adding.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-wb-primary/5">
                <TableHead className="w-20 font-semibold">SL No</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="w-24 text-right font-semibold">
                  Qty
                </TableHead>
                <TableHead className="w-20 font-semibold">Unit</TableHead>
                <TableHead className="w-28 text-right font-semibold">
                  Rate
                </TableHead>
                <TableHead className="w-32 text-right font-semibold">
                  Amount
                </TableHead>
                <TableHead className="w-32 font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedItems.map((group: any) => {
                if (group.isHeader) {
                  const isExpanded = expandedGroups.has(group.id);

                  return (
                    <React.Fragment key={group.id}>
                      {/* Parent Header Row */}
                      <TableRow className="bg-wb-primary/5 border-t-2 border-wb-primary/20">
                        <TableCell className="font-bold text-wb-primary">
                          {group.slNo}
                        </TableCell>
                        <TableCell
                          colSpan={5}
                          className="font-bold text-wb-primary border-b-2 border-wb-primary/20 pb-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleGroup(group.id)}
                                className="h-6 w-6 p-0"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRightIcon className="h-4 w-4" />
                                )}
                              </Button>
                              <span className="line-clamp-2">
                                {group.description}
                              </span>
                              <Badge
                                variant="outline"
                                className="ml-2 text-xs bg-wb-primary/10 text-wb-primary border-wb-primary/30"
                              >
                                {group.availableSubItems.length} subitems
                                available
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addAllSubItems(group)}
                            disabled={
                              !formData.mbNumber ||
                              !formData.mbPageNumber ||
                              !formData.measuredBy
                            }
                            className="w-full bg-wb-primary/10 hover:bg-wb-primary/20 text-wb-primary border-wb-primary/30 hover:border-wb-primary"
                          >
                            <Plus className="h-3 w-3 mr-2" />
                            Add All
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Subitems (Collapsible) */}
                      {isExpanded &&
                        group.availableSubItems.map((subItem: any) => (
                          <TableRow
                            key={subItem.id}
                            className="bg-gray-50/50 hover:bg-gray-50"
                          >
                            <TableCell className="pl-12 text-gray-500">
                              {subItem.displaySlNo}
                            </TableCell>
                            <TableCell className="pl-10 text-gray-700 text-sm">
                              <div className="flex items-start gap-2">
                                <span className="text-gray-500 font-medium min-w-fit">
                                  ({subItem.displaySlNo?.split("(")[1]}
                                </span>
                                <span className="line-clamp-2">
                                  {subItem.description}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {(subItem.quantity ?? 0).toFixed(3)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-100 text-gray-700"
                              >
                                {subItem.unit ?? "-"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-gray-600">
                              ₹{(subItem.rate ?? 0).toFixed(3)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-gray-800">
                              ₹{(subItem.amount ?? 0).toFixed(3)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openAddDialog({
                                    ...subItem,
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
                                className="w-full bg-wb-bg hover:bg-wb-primary/5 text-gray-700 border-wb-border hover:border-wb-primary/50"
                              >
                                <Plus className="h-3 w-3 mr-2" />
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
                    <TableRow key={group.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {group.slNo}
                      </TableCell>
                      <TableCell className="line-clamp-2">
                        {group.description}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(group.quantity ?? 0).toFixed(3)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {group.unit ?? "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{(group.rate ?? 0).toFixed(3)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        ₹{(group.amount ?? 0).toFixed(3)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAddDialog(group)}
                          disabled={
                            !formData.mbNumber ||
                            !formData.mbPageNumber ||
                            !formData.measuredBy
                          }
                          className="w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200 hover:border-blue-300"
                        >
                          <Plus className="h-3 w-3 mr-2" />
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
