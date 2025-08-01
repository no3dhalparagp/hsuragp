// components/WorkStatusForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormSubmitButton from "@/components/FormSubmitButton";
import { workStatus } from "@prisma/client";
import { Button } from "./ui/button";

export default function WorkStatusForm({
  work,
  updateWorkStatus,
}: {
  work: any;
  updateWorkStatus: (
    formData: FormData
  ) => Promise<{ success: boolean; message: string }>;
}) {
  const [selectedStatus, setSelectedStatus] = useState<workStatus>(
    work.workStatus
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.set("workStatus", selectedStatus); // Make sure we're sending the correct status

    try {
      const result = await updateWorkStatus(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 items-end">
      <div className="flex gap-3 items-center">
        <input type="hidden" name="workId" value={work.id} />

        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as workStatus)}
        >
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yettostart">Yet to Start</SelectItem>
            <SelectItem value="workinprogress">Work in Progress</SelectItem>
            <SelectItem value="workcompleted">Work Completed</SelectItem>
            <SelectItem value="billpaid">Bill Paid</SelectItem>
          </SelectContent>
        </Select>

        {selectedStatus === "workinprogress" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Commencement Date:</label>
            <input
              type="date"
              name="workCommencementDate"
              className="form-input block w-full rounded-md border-gray-300"
              required
              max={new Date().toISOString().split("T")[0]}
              defaultValue={
                work.workCommencementDate
                  ? new Date(work.workCommencementDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
            />
          </div>
        )}

        {selectedStatus === "workcompleted" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Completion Date:</label>
            <input
              type="date"
              name="completionDate"
              className="border rounded-md p-2"
              required
              max={new Date().toISOString().split("T")[0]}
              defaultValue={
                work.completionDate
                  ? new Date(work.completionDate).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>
        )}
      </div>

      <Button>Update Status</Button>
    </form>
  );
}
