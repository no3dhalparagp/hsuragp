import { Suspense } from "react";
import { db } from "@/lib/db";
import { NitDetail } from "@/types/nitDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";



export default async function PastTenders() {
  const today = new Date();
  const tenders =  await db.nitDetails.findMany({
    where: {
        endTime: {
          lt: today,
        },
        publishhardcopy: {
          not: null,
        },
      },
      orderBy: {
        endTime: "desc",
      },
      select: {
        id: true,
        memoNumber: true,
        publishingDate: true,
        endTime: true,
        publishhardcopy: true,
      },
    });

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
          Past Tenders
        </h2>
        <p className="mt-1 text-gray-500">
          List of previously published tender notices
        </p>
      </div>

   
        <DataTable columns={columns} data={tenders} />
     
    </div>
  );
}
