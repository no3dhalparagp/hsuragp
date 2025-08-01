"use client";

import Link from "next/link";
import { Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { useTransition, useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface WorkDetailsListProps {
  workDetails: {
    id: string;
    WorksDetail: Array<{
      id: string;
      finalEstimateAmount: number;
      participationFee: number;
      earnestMoneyFee: number;
      tenderStatus: string;
      ApprovedActionPlanDetails: {
        id: string;
        financialYear: string;
        themeName: string;
        activityCode: number;
        activityName: string;
        activityDescription: string;
        activityFor: string;
        sector: string;
        isPublish: boolean;
        estimatedCost: number;
      };
    }>;
  };
}

const WorkDetailItem = memo(
  ({
    item,
    index,
    onEdit,
    onDelete,
    isPending,
  }: {
    item: WorkDetailsListProps["workDetails"]["WorksDetail"][0];
    index: number;
    onEdit: (
      item: WorkDetailsListProps["workDetails"]["WorksDetail"][0]
    ) => void;
    onDelete: (id: string) => void;
    isPending: boolean;
  }) => {
    return (
      <AccordionItem value={item.id} className="border rounded-lg mb-4">
        <AccordionTrigger className="hover:no-underline px-4 hover:bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-4 w-full">
            <Badge
              variant="secondary"
              className="w-8 h-8 rounded-full flex items-center justify-center"
            >
              {index + 1}
            </Badge>
            <div className="flex-1 text-left">
              <div className="flex flex-wrap gap-2 items-center">
                <p className="font-medium min-w-[180px]">
                  Activity Code: {item.ApprovedActionPlanDetails.activityCode}
                </p>
                <p>
                  Estimate Cost: ₹{item.finalEstimateAmount.toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {item.ApprovedActionPlanDetails.activityName}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 bg-gray-50 rounded-b-lg">
          <div className="pl-12 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                label="Theme"
                value={item.ApprovedActionPlanDetails.themeName}
              />
              <DetailItem
                label="Financial Year"
                value={item.ApprovedActionPlanDetails.financialYear}
              />
              <DetailItem
                label="Tender Form Fee"
                value={`₹${item.participationFee.toLocaleString()}`}
              />
              <DetailItem
                label="Estimated Cost"
                value={`₹${item.finalEstimateAmount.toLocaleString()}`}
              />
            </div>
            <DetailItem
              label="Description"
              value={item.ApprovedActionPlanDetails.activityDescription}
              fullWidth
            />
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <Badge
                variant={
                  item.ApprovedActionPlanDetails.isPublish
                    ? "default"
                    : "destructive"
                }
              >
                {item.ApprovedActionPlanDetails.isPublish
                  ? "Published"
                  : "Not Published"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(item)}
              disabled={isPending}
            >
              Update
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(item.id)}
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }
);
WorkDetailItem.displayName = "WorkDetailItem";

const DetailItem = ({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string | number;
  fullWidth?: boolean;
}) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className={typeof value === "string" ? "text-gray-700" : "font-medium"}>
      {value}
    </p>
  </div>
);

function WorkDetailsList({ workDetails }: WorkDetailsListProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [editWork, setEditWork] = useState<
    null | (typeof workDetails.WorksDetail)[0]
  >(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFields, setEditFields] = useState({
    finalEstimateAmount: "",
    participationFee: "",
  });

  const router = useRouter();
  const allWorkPublished = workDetails.WorksDetail.every(
    (work) => work.ApprovedActionPlanDetails.isPublish
  );

  // Calculate total estimated amount
  const totalEstimatedAmount = workDetails.WorksDetail.reduce(
    (sum, item) => sum + item.finalEstimateAmount,
    0
  );

  const handleDeleteAll = useCallback(async () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/works/delete-by-nit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nitId: workDetails.id }),
        });
        const data = await res.json();

        if (res.ok) {
          toast({
            title: "All works deleted",
            description: `${data.count} works were deleted.`,
          });
          router.refresh();
        } else {
          throw new Error(data.error || "Failed to delete works");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  }, [workDetails.id, toast, router]);

  const handleDelete = useCallback(
    async (id: string) => {
      startTransition(async () => {
        try {
          const res = await fetch(`/api/works/${id}`, { method: "DELETE" });
          const data = await res.json();

          if (res.ok) {
            toast({
              title: "Work deleted",
              description: `Work was deleted successfully.`,
            });
            router.refresh();
          } else {
            throw new Error(data.error || "Failed to delete work");
          }
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      });
    },
    [toast, router]
  );

  const handleEdit = useCallback(
    (item: (typeof workDetails.WorksDetail)[0]) => {
      setEditWork(item);
      setEditFields({
        finalEstimateAmount: item.finalEstimateAmount.toString(),
        participationFee: item.participationFee.toString(),
      });
      setShowEditModal(true);
    },
    [setEditWork, setEditFields, setShowEditModal, workDetails]
  );

  const handleEditSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editWork) return;

      startTransition(async () => {
        try {
          const res = await fetch(`/api/works/${editWork.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              finalEstimateAmount: Number(editFields.finalEstimateAmount),
              participationFee: Number(editFields.participationFee),
            }),
          });
          const data = await res.json();

          if (res.ok) {
            toast({
              title: "Work updated",
              description: `Work details updated successfully.`,
            });
            setShowEditModal(false);
            setEditWork(null);
            router.refresh();
          } else {
            throw new Error(data.error || "Failed to update work");
          }
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      });
    },
    [editWork, editFields, toast, router]
  );

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditWork(null);
  }, [setShowEditModal, setEditWork]);

  if (workDetails.WorksDetail.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-500">No work details found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="py-6">
        {/* Total Estimated Amount Display */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-800">
              Total Estimated Amount
            </h3>
            <p className="text-2xl font-bold text-blue-900">
              ₹{totalEstimatedAmount.toLocaleString()}
            </p>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            Based on {workDetails.WorksDetail.length} work items
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {workDetails.WorksDetail.map((item, index) => (
            <WorkDetailItem
              key={item.id}
              item={item}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isPending={isPending}
            />
          ))}
        </Accordion>
      </CardContent>

      {allWorkPublished && (
        <CardFooter className="flex justify-end p-4 border-t">
          <Button
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isPending ? "Deleting..." : "Delete All"}
          </Button>
        </CardFooter>
      )}

      <EditWorkModal
        open={showEditModal}
        onClose={closeEditModal}
        editFields={editFields}
        setEditFields={setEditFields}
        onSubmit={handleEditSubmit}
        isPending={isPending}
      />
    </Card>
  );
}

const EditWorkModal = memo(
  ({
    open,
    onClose,
    editFields,
    setEditFields,
    onSubmit,
    isPending,
  }: {
    open: boolean;
    onClose: () => void;
    editFields: { finalEstimateAmount: string; participationFee: string };
    setEditFields: React.Dispatch<
      React.SetStateAction<{
        finalEstimateAmount: string;
        participationFee: string;
      }>
    >;
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
  }) => (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Work Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Estimate Amount (₹)
            </label>
            <Input
              name="finalEstimateAmount"
              type="number"
              value={editFields.finalEstimateAmount}
              onChange={(e) =>
                setEditFields((prev) => ({
                  ...prev,
                  finalEstimateAmount: e.target.value,
                }))
              }
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Participation Fee (₹)
            </label>
            <Input
              name="participationFee"
              type="number"
              value={editFields.participationFee}
              onChange={(e) =>
                setEditFields((prev) => ({
                  ...prev,
                  participationFee: e.target.value,
                }))
              }
              required
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
);
EditWorkModal.displayName = "EditWorkModal";

export default memo(WorkDetailsList);
