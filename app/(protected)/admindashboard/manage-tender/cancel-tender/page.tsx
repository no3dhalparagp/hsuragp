import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TenderStatus } from "@prisma/client";
import { updatenitstatus } from "@/action/bookNitNuber";
import { ShowNitDetails } from "@/components/ShowNitDetails";
const statusVariants: Record<
  TenderStatus,
  "destructive" | "success" | "warning" | "default"
> = {
  Cancelled: "destructive",
  published: "success",
  ToBeOpened: "warning",
  publish: "success",
  TechnicalBidOpening: "warning",
  TechnicalEvaluation: "warning",
  FinancialBidOpening: "warning",
  FinancialEvaluation: "warning",
  Retender: "warning",
  AOC: "default",
};
async function updateTenderStatus(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const status = formData.get("status") as TenderStatus;

  if (!id || !status) return;

  const updateData: any = { tenderStatus: status };

  if (status === "Cancelled") {
    await updatenitstatus(id, status);
  }

  await db.worksDetail.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admindashboard/manage-tender/cancel-tender");
}

const CancelTenderPage = async () => {
  const canceltenders = await db.worksDetail.findMany({
    where: {
      tenderStatus: {
        notIn: ["Cancelled", "AOC"],
      },
    },
    include: {
      nitDetails: true,
      ApprovedActionPlanDetails: true,
    },
  });

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-2xl font-bold text-slate-800">
            🚧 Active Tender Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-b-lg">
            <Table className="min-w-[800px]">
              <TableCaption className="text-sm text-muted-foreground bg-slate-50 py-2">
                {canceltenders.length} active tenders found
              </TableCaption>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="min-w-[180px]">NIT Details</TableHead>
                  <TableHead className="min-w-[240px]">
                    Work Description
                  </TableHead>
                  <TableHead className="w-40">Status</TableHead>
                  <TableHead className="text-right w-96">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {canceltenders.map((item, i) => (
                  <TableRow key={item.id} className="hover:bg-slate-50 group">
                    <TableCell className="text-center font-medium text-slate-600">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      <ShowNitDetails
                        nitdetails={item.nitDetails.memoNumber}
                        memoDate={item.nitDetails.memoDate}
                        workslno={item.workslno}
                      />
                    </TableCell>
                    <TableCell className="">
                      {item.ApprovedActionPlanDetails.activityDescription}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[item.tenderStatus]}>
                        {item.tenderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <form
                        action={updateTenderStatus}
                        className="flex flex-col md:flex-row gap-2 items-end md:items-center"
                      >
                        <input type="hidden" name="id" value={item.id} />
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Label className="hidden md:inline-block text-sm">
                            Update Status:
                          </Label>
                          <Select
                            name="status"
                            defaultValue={item.tenderStatus}
                          >
                            <SelectTrigger className="w-full md:w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(statusVariants).map((status) => (
                                <SelectItem key={status} value={status}>
                                  <Badge
                                    variant={
                                      statusVariants[status as TenderStatus]
                                    }
                                  >
                                    {status}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="submit"
                          variant="default"
                          size="sm"
                          className="w-full md:w-auto"
                        >
                          Apply Change
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CancelTenderPage;
