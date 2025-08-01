import { DataTable } from "@/components/data-table";
import React from "react";
import { columns } from "./columns";
import { db } from "@/lib/db";

const page = async () => {
  const data = await db.worksDetail.findMany({
    include: {
      nitDetails: true,
      ApprovedActionPlanDetails: true,
      biddingAgencies: {
        orderBy: {
          biddingAmount: "asc",
        },
        include: {
          agencydetails: true,
        },
      },
    },
  });
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default page;
