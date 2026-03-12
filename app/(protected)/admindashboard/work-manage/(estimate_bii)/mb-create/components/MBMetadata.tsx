import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Hash,
  BookOpen,
  Calendar,
  User,
  CheckCircle,
  Save,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MBFormData } from "./types";

interface MBMetadataProps {
  formData: MBFormData;
  setFormData: React.Dispatch<React.SetStateAction<MBFormData>>;
  selectedWorkId: string;
  onConfirm: () => void;
  isConfirmed: boolean;
}

export const MBMetadata: React.FC<MBMetadataProps> = ({
  formData,
  setFormData,
  selectedWorkId,
  onConfirm,
  isConfirmed,
}) => {
  return (
    <AnimatePresence>
      {selectedWorkId && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={`border-wb-border shadow-sm hover:shadow-md transition-shadow bg-white ${isConfirmed ? "border-l-4 border-l-wb-success" : ""}`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${isConfirmed ? "bg-wb-success/20" : "bg-wb-primary/10"}`}
                >
                  {isConfirmed ? (
                    <CheckCircle className="h-5 w-5 text-wb-success" />
                  ) : (
                    <Hash className="h-5 w-5 text-wb-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <span>MB Details</span>
                  <CardDescription className="mt-1">
                    {isConfirmed
                      ? "Details saved. You can now add measurements."
                      : "Configure measurement book parameters to proceed"}
                  </CardDescription>
                </div>
                {isConfirmed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onConfirm}
                    className="text-wb-primary hover:text-wb-primary hover:bg-wb-primary/10"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Hash className="h-3 w-3" />
                      MB Number
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.mbNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mbNumber: e.target.value,
                        })
                      }
                      placeholder="MB-001"
                      className="bg-white focus:border-wb-primary transition-colors"
                      disabled={isConfirmed}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="h-3 w-3" />
                      Page Number
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.mbPageNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mbPageNumber: e.target.value,
                        })
                      }
                      placeholder="P-01"
                      className="bg-white focus:border-wb-primary transition-colors"
                      disabled={isConfirmed}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Measurement Date
                  </Label>
                  <Input
                    type="date"
                    value={formData.measuredDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        measuredDate: e.target.value,
                      })
                    }
                    className="bg-white focus:border-wb-primary transition-colors"
                    disabled={isConfirmed}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Measured By
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.measuredBy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        measuredBy: e.target.value,
                      })
                    }
                    placeholder="Enter name"
                    className="bg-white focus:border-wb-primary transition-colors"
                    disabled={isConfirmed}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Checked By
                  </Label>
                  <Input
                    value={formData.checkedBy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        checkedBy: e.target.value,
                      })
                    }
                    placeholder="Enter name"
                    className="bg-white focus:border-wb-primary transition-colors"
                    disabled={isConfirmed}
                  />
                </div>

                {!isConfirmed && (
                  <Button
                    className="w-full mt-4 bg-wb-primary hover:bg-wb-primary/90 text-white"
                    onClick={onConfirm}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save & Continue
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
