"use client";

import type React from "react";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Edit, Loader2, User, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CorrectionRequestFormProps {
  warishApplicationId?: string;
  warishDetailId?: string;
  targetType: "application" | "detail";
  availableFields: { value: string; label: string; currentValue?: string }[];
  warishDetails?: Array<{
    id: string;
    name: string;
    gender: string;
    relation: string;
    livingStatus: string;
    maritialStatus: string;
    hasbandName?: string | null;
  }>;
  onRequestSubmitted: () => void;
  requesterName?: string;
}

export default function CorrectionRequestForm({
  warishApplicationId,
  warishDetailId,
  targetType,
  availableFields,
  warishDetails = [],
  onRequestSubmitted,
  requesterName = "",
}: CorrectionRequestFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<string>(
    warishDetailId || (warishDetails.length > 0 ? warishDetails[0].id : "")
  );
  const [formData, setFormData] = useState({
    fieldToModify: "",
    proposedValue: "",
    reasonForModification: "",
    requestedBy: requesterName,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isInitialMount = useRef(true);

  // Reset form data only
  const resetForm = useCallback(() => {
    setFormData({
      fieldToModify: "",
      proposedValue: "",
      reasonForModification: "",
      requestedBy: requesterName,
    });
    setFormErrors({});
  }, [requesterName]);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen, resetForm]);

  // Initial setup for selectedDetailId
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (targetType === "detail") {
        if (warishDetailId) {
          setSelectedDetailId(warishDetailId);
        } else if (warishDetails.length > 0) {
          setSelectedDetailId(warishDetails[0].id);
        }
      }
    }
  }, [targetType, warishDetailId, warishDetails]);

  // Get selected detail info for detail corrections
  const selectedDetail = useMemo(
    () => warishDetails.find((d) => d.id === selectedDetailId),
    [warishDetails, selectedDetailId]
  );

  // Get current value based on selected field
  const currentValue = useMemo(() => {
    if (!formData.fieldToModify) return "";

    // For detail fields, get value from selectedDetail
    if (targetType === "detail" && selectedDetail) {
      switch (formData.fieldToModify) {
        case "name":
          return selectedDetail.name;
        case "gender":
          return selectedDetail.gender;
        case "relation":
          return selectedDetail.relation;
        case "livingStatus":
          return selectedDetail.livingStatus;
        case "maritialStatus":
          return selectedDetail.maritialStatus;
        case "hasbandName":
          return selectedDetail.hasbandName || "";
        default:
          return "";
      }
    }

    // For application fields, get value from availableFields
    const field = availableFields.find(
      (f) => f.value === formData.fieldToModify
    );
    return field?.currentValue || "";
  }, [formData.fieldToModify, availableFields, targetType, selectedDetail]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fieldToModify) {
      errors.fieldToModify = "Please select a field to modify";
    }

    if (!formData.proposedValue.trim()) {
      errors.proposedValue = "Proposed value is required";
    } else if (formData.proposedValue === currentValue) {
      errors.proposedValue =
        "Proposed value must be different from current value";
    }

    if (!formData.reasonForModification.trim()) {
      errors.reasonForModification = "Please provide a reason";
    } else if (formData.reasonForModification.trim().length < 10) {
      errors.reasonForModification = "Reason must be at least 10 characters";
    }

    if (!formData.requestedBy.trim()) {
      errors.requestedBy = "Please provide your name";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        warishApplicationId,
        warishDetailId: targetType === "detail" ? selectedDetailId : undefined,
        ...formData,
        currentValue,
      };

      const response = await fetch("/api/warish-correction-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit correction request");
      }

      toast({
        title: "Success",
        description: "Correction request submitted successfully",
      });

      setIsOpen(false);
      onRequestSubmitted();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit correction request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-1" />
          Request Correction
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-2xl"
        onInteractOutside={(e) => isSubmitting && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            <span>Request Correction</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-1 space-y-6">
          {/* Show family member selection for detail corrections */}
          {targetType === "detail" && warishDetails.length > 0 && (
            <div className="space-y-3">
              <Label className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Family Member</span>
                <span className="text-red-500">*</span>
              </Label>

              {warishDetails.length > 1 ? (
                <div className="flex gap-3 items-center">
                  <Select
                    value={selectedDetailId}
                    onValueChange={setSelectedDetailId}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Select family member" />
                    </SelectTrigger>
                    <SelectContent>
                      {warishDetails.map((detail) => (
                        <SelectItem key={detail.id} value={detail.id}>
                          {detail.name} ({detail.relation})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedDetail && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{selectedDetail.gender}</span>
                      <span>•</span>
                      <span>{selectedDetail.livingStatus}</span>
                      <span>•</span>
                      <span>{selectedDetail.maritialStatus}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div>
                    <div className="font-medium">
                      {selectedDetail?.name} ({selectedDetail?.relation})
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{selectedDetail?.gender}</span>
                      <span>•</span>
                      <span>{selectedDetail?.livingStatus}</span>
                      <span>•</span>
                      <span>{selectedDetail?.maritialStatus}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">Only Member</Badge>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="font-medium flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span>Field to Modify</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.fieldToModify}
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      fieldToModify: value,
                      proposedValue: "", // Reset proposed value when field changes
                    }));
                    setFormErrors((prev) => ({ ...prev, fieldToModify: "" }));
                  }}
                  disabled={isSubmitting || availableFields.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        availableFields.length === 0
                          ? "No fields available"
                          : "Select field to modify"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.fieldToModify && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formErrors.fieldToModify}</span>
                  </div>
                )}
                {availableFields.length === 0 && (
                  <div className="flex items-center gap-2 text-yellow-600 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>No fields available for modification</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Requested By</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.requestedBy}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      requestedBy: e.target.value,
                    }));
                    setFormErrors((prev) => ({ ...prev, requestedBy: "" }));
                  }}
                  placeholder="Your name"
                  disabled={isSubmitting}
                />
                {formErrors.requestedBy && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formErrors.requestedBy}</span>
                  </div>
                )}
              </div>
            </div>

            {formData.fieldToModify && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="font-medium flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    <span>Current Value</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      value={currentValue}
                      className="bg-muted"
                      readOnly
                      disabled={isSubmitting}
                    />
                    {currentValue && <Badge variant="secondary">Current</Badge>}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-medium flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    <span>Proposed Value</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.proposedValue}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        proposedValue: e.target.value,
                      }));
                      setFormErrors((prev) => ({ ...prev, proposedValue: "" }));
                    }}
                    placeholder="Enter the new value"
                    disabled={isSubmitting}
                  />
                  {formErrors.proposedValue && (
                    <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{formErrors.proposedValue}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label className="font-medium flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Reason for Modification</span>
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={formData.reasonForModification}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    reasonForModification: e.target.value,
                  }));
                  setFormErrors((prev) => ({
                    ...prev,
                    reasonForModification: "",
                  }));
                }}
                placeholder="Explain why this correction is needed"
                rows={3}
                disabled={isSubmitting}
                className="min-h-[120px]"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                {formErrors.reasonForModification ? (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{formErrors.reasonForModification}</span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Minimum 10 characters
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {formData.reasonForModification.length}/500
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className="px-6 bg-transparent"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting || availableFields.length === 0}
                  className="px-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
