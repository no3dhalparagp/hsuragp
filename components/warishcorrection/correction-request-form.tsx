"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Loader2, Edit, Save, ArrowRight, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

/* ===============================
ENUMS
================================ */

const GenderEnum = ["male", "female", "other"] as const;

const MaritialStatusEnum = [
  "married",
  "unmarried",
  "divorced",
  "widowed",
] as const;

const LivingStatusEnum = ["alive", "dead"] as const;

/* ===============================
UTIL
================================ */

const formatLabel = (value: string) =>
  value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

/* ===============================
COMPONENT
================================ */

export default function CorrectionRequestForm({
  warishApplicationId,
  warishDetailId,
  targetType,
  availableFields,
  warishDetails = [],
  onRequestSubmitted,
  requesterName = "",
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDetailId, setSelectedDetailId] = useState(
    warishDetailId || ""
  );

  const [formData, setFormData] = useState({
    fieldToModify: "",
    proposedValue: "",
    reasonForModification: "",
    requestedBy: requesterName,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fieldOptionsMap: any = {
    gender: GenderEnum.map((g) => ({
      value: g,
      label: formatLabel(g),
    })),

    maritialStatus: MaritialStatusEnum.map((m) => ({
      value: m,
      label: formatLabel(m),
    })),

    livingStatus: LivingStatusEnum.map((l) => ({
      value: l,
      label: formatLabel(l),
    })),
  };

  const isSelectField = fieldOptionsMap[formData.fieldToModify];

  const selectedDetail = useMemo(
    () => warishDetails.find((d: any) => d.id === selectedDetailId),
    [warishDetails, selectedDetailId]
  );

  const currentValue = useMemo(() => {
    if (!formData.fieldToModify) return "";

    if (targetType === "detail" && selectedDetail) {
      return (selectedDetail as any)[formData.fieldToModify] || "";
    }

    const field = availableFields.find(
      (f: any) => f.value === formData.fieldToModify
    );

    return field?.currentValue || "";
  }, [formData.fieldToModify, selectedDetail]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fieldToModify)
      errors.fieldToModify = "Select field";

    if (!formData.proposedValue)
      errors.proposedValue = "Enter proposed value";

    if (!formData.reasonForModification)
      errors.reasonForModification = "Reason required";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        warishApplicationId,
        warishDetailId:
          targetType === "detail" ? selectedDetailId : undefined,
        ...formData,
        currentValue,
      };

      const res = await fetch("/api/warish-correction-requests", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast({
        title: "Success",
        description: "Correction request submitted",
      });

      setIsOpen(false);
      onRequestSubmitted();
    } catch {
      toast({
        title: "Error",
        description: "Submission failed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
  UI
  ============================== */

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Request Correction
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">

        {/* HEADER */}

        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Info className="w-5 h-5 text-blue-600" />
            Correction Request
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Submit correction request for incorrect information.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">

          {/* FIELD SELECT */}

          <Card className="p-4 space-y-3">
            <Label>Field to Modify</Label>

            <Select
              value={formData.fieldToModify}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  fieldToModify: value,
                  proposedValue: "",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>

              <SelectContent>
                {availableFields.map((field: any) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentValue && (
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">
                  Current Value
                </Badge>

                <span className="font-medium">
                  {formatLabel(currentValue)}
                </span>
              </div>
            )}
          </Card>

          {/* PROPOSED VALUE */}

          {formData.fieldToModify && (
            <Card className="p-4 space-y-3">

              <Label>Proposed Value</Label>

              {isSelectField ? (
                <Select
                  value={formData.proposedValue}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      proposedValue: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct value" />
                  </SelectTrigger>

                  <SelectContent>
                    {isSelectField.map((option: any) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={formData.proposedValue}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      proposedValue: e.target.value,
                    }))
                  }
                />
              )}

              {formErrors.proposedValue && (
                <p className="text-xs text-destructive">
                  {formErrors.proposedValue}
                </p>
              )}

              <div className="flex items-center text-xs text-muted-foreground gap-2">
                <ArrowRight className="w-3 h-3" />
                Provide the correct value
              </div>
            </Card>
          )}

          {/* REASON */}

          <Card className="p-4 space-y-3">
            <Label>Reason for Correction</Label>

            <Textarea
              rows={4}
              value={formData.reasonForModification}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reasonForModification: e.target.value,
                }))
              }
              placeholder="Explain why this correction is required..."
            />

            {formErrors.reasonForModification && (
              <p className="text-xs text-destructive">
                {formErrors.reasonForModification}
              </p>
            )}
          </Card>

          {/* ACTION */}

          <div className="flex justify-end gap-3 pt-2 border-t">

            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>

          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
