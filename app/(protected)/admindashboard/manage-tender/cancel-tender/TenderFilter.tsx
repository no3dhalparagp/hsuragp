"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TenderStatus } from "@prisma/client";

interface TenderFilterProps {
  statusOptions: TenderStatus[];
}

export function TenderFilter({ statusOptions }: TenderFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedStatus = searchParams.get("status") || "all";

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <Label htmlFor="status-filter" className="text-sm font-medium">
        Filter by Status:
      </Label>
      <Select value={selectedStatus} onValueChange={handleStatusChange}>
        <SelectTrigger id="status-filter" className="w-[200px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

