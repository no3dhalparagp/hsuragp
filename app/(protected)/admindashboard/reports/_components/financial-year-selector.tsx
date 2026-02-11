"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  generateFinancialYears,
  getCurrentFinancialYear,
} from "@/utils/financialYear";

export function FinancialYearSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const financialYears = generateFinancialYears();
  const currentFinancialYear =
    searchParams.get("financialYear") || getCurrentFinancialYear();

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("financialYear", year);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="financial-year" className="text-sm font-medium">
        Financial Year
      </label>
      <Select value={currentFinancialYear} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[180px]" id="financial-year">
          <SelectValue placeholder="Select a year" />
        </SelectTrigger>
        <SelectContent>
          {financialYears.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
