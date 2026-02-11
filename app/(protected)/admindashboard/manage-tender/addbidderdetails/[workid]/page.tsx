import { sentforTechnicalevelution } from "@/action/bookNitNuber";
import { BidderDetails } from "@/components/bidder-details";
import AddBidderTechnicalDetails from "@/components/form/AddBidder";
import AddBidder from "@/components/form/AddBidder";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { ShowWorkDetails } from "@/components/Work-details";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    workid: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { workid } = await params;
  const workdetails = await db.worksDetail.findUnique({
    where: {
      id: workid,
      tenderStatus: {
        in: ["published", "TechnicalBidOpening"],
      },
    },
    include: {
      nitDetails: true,
      ApprovedActionPlanDetails: true,
      biddingAgencies: {
        include: {
          agencydetails: true,
        },
      },
    },
  });

  if (!workdetails) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <ShowWorkDetails worksDetailId={workdetails.id} />

      <AddBidder workid={workdetails.id} />

      <BidderDetails workdetails={workdetails} workid={workdetails.id} />

      <div className="flex justify-center space-x-4">
        <Link href="/admindashboard/manage-tender/addbidderdetails">
          <Button variant="outline">Back to Work Page</Button>
        </Link>

        {workdetails.tenderStatus === "TechnicalBidOpening" &&
          workdetails.biddingAgencies.length >= 3 && (
            <form action={sentforTechnicalevelution}>
              <input type="hidden" name="workid" value={workdetails.id} />
              <SubmitButton
                className="bg-sky-400 hover:bg-sky-500 text-white"
              >
                Send For Technical Evaluation
              </SubmitButton>
            </form>
          )}
      </div>
    </div>
  );
}
