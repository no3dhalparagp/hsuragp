import React from "react";
import { Badge } from "./ui/badge";
import { formatDate } from "@/utils/utils";

interface ShowNitDetailsProps {
  nitdetails: number | string;
  memoDate: Date;
  workslno: number | string;
}

export const ShowNitDetails = ({
  nitdetails,
  memoDate,
  workslno,
}: ShowNitDetailsProps) => {
  return (
    <div className="flex items-center  gap-1">
      <div>
        <p className="font-semibold text-primary">
          {nitdetails}/DGP/{memoDate.getFullYear()}
        </p>
        <p>Date: {formatDate(memoDate)}</p>
      </div>
      <Badge variant="outline" className="mt-1">
        Work No {workslno}
      </Badge>
    </div>
  );
};

export const showWorkOrder = () => {
  return <div>work order</div>;
};
