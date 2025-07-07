import UploadTender from "@/components/form/UploadTender";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Upload Tender - NIT ID: ${params.id}`,
    description: "Upload a new tender document for the specified NIT.",
  };
}

async function getTenderDetails(id: string) {
  // This is a placeholder function. Replace with actual database query.
  const tender = await db.nitDetails.findUnique({ where: { id } });
  if (!tender) notFound();
  return tender;
}

export default async function UploadTenderPage({
  params,
}: {
  params: { id: string };
}) {
  const tender = await getTenderDetails(params.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/admindashboard/manage-tender/upload"
        className="flex items-center text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to NIT List
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload NIT Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">NIT Memo Number</p>
              <p className="font-semibold text-primary text-lg">
                {tender.memoNumber}/DGP/{tender.memoDate.getFullYear()}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">NIT Date</p>
              <p className="font-medium">{formatDate(tender.memoDate)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">NIT ID</p>
              <p className="font-mono text-sm">{tender.id}</p>
            </div>
          </div>

          <div className="pt-4">
            <UploadTender nitId={tender.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
