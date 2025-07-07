import { notFound } from "next/navigation";
import NitEditForm from "@/components/form/nit-edit-form";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EditNitPageProps {
  params: { id: string };
}

async function getNitById(id: string) {
  const nit = await db.nitDetails.findUnique({
    where: { id },
  });
  return nit;
}

export default async function EditNitPage({ params }: EditNitPageProps) {
  const nit = await getNitById(params.id);
  if (!nit) return notFound();

  // Map DB fields to NitEditForm expected props
  const initialData = {
    id: String(nit.id),
    tendermemonumber: String(nit.memoNumber || ""),
    tendermemodate: nit.memoDate ? nit.memoDate.toString() : "",
    tender_pulishing_Date: nit.publishingDate
      ? nit.publishingDate.toString()
      : "",
    tender_document_Download_from: nit.documentDownloadFrom
      ? nit.documentDownloadFrom.toString()
      : "",
    tender_start_time_from: nit.startTime ? nit.startTime.toString() : "",
    tender_end_date_time_from: nit.endTime ? nit.endTime.toString() : "",
    tender_techinical_bid_opening_date: nit.technicalBidOpeningDate
      ? nit.technicalBidOpeningDate.toString()
      : "",
    tender_financial_bid_opening_date: nit.financialBidOpeningDate
      ? nit.financialBidOpeningDate.toString()
      : "",
    tender_place_opening_bids: String(nit.placeOfOpeningBids || ""),
    tender_vilidity_bids: String(nit.bidValidity || ""),
    supplynit: Boolean(nit.isSupply),
  };

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <div className="mb-4">
        <Link href="/admindashboard/manage-tender/edit">
          <Button variant="outline">Back to NIT List</Button>
        </Link>
      </div>
      <NitEditForm initialData={initialData} />
    </div>
  );
}
