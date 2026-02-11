import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Pencil, Trash2, Upload } from "lucide-react";
import { getApprovedActionPlans } from "@/lib/actionplan";
import { ApprovedActionPlanDetails } from "@prisma/client";
import { DataTable } from "@/components/data-table";
import { actionplancolumns } from "@/components/table-col-ref/actionplan-col-ref";

async function ActionPlansContent() {
  const actionPlans = await getApprovedActionPlans();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:items-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Approved Action Plans
          </span>
        </h1>
        <div className="flex gap-2">
          <Button
            asChild
            className="rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href="/admindashboard/work-manage/add" className="gap-2">
              <PlusCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Add New Plan</span>
            </Link>
          </Button>
          <Button
            asChild
            className="rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href="/admindashboard/work-manage/upload" className="gap-2">
              <Upload className="h-5 w-5" />
              <span className="hidden sm:inline">Upload Excel</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 shadow-lg">
        <DataTable data={actionPlans} columns={actionplancolumns} />
      </div>
    </div>
  );
}

export default function ActionPlansPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Suspense
        fallback={
          <div className="text-center text-gray-500 mt-8 animate-pulse">
            Loading approved action plans...
          </div>
        }
      >
        <ActionPlansContent />
      </Suspense>
    </div>
  );
}
