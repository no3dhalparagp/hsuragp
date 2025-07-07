import FinancialBidDetails from "@/components/form/Bidaddform";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShowWorkDetails } from "@/components/Work-details";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getWorkDetails(workid: string) {
  const work = await db.worksDetail.findUnique({
    where: { id: workid },
    include: {
      ApprovedActionPlanDetails: true,
      nitDetails: true,
      biddingAgencies: {
        where: {
          technicalEvelution: {
            qualify: true,
          },
        },
        include: {
          agencydetails: true,
          technicalEvelution: {
            include: {
              credencial: true,
              validityofdocument: true,
            },
          },
        },
      },
      AwardofContract: true,
    },
  });

  if (!work) notFound();

  return work;
}

function LoadingSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function FinancialBidPage({
  params,
}: {
  params: { workid: string };
}) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Financial Bid Details
      </h1>
      <ShowWorkDetails worksDetailId={params.workid} />
      <Suspense fallback={<LoadingSkeleton />}>
        <WorkDetails workid={params.workid} />
      </Suspense>
    </div>
  );
}

async function WorkDetails({ workid }: { workid: string }) {
  const work = await getWorkDetails(workid);

  return <FinancialBidDetails work={work} />;
}
