import { Suspense } from "react";
import { db } from "@/lib/db";
import EnhancedCorrectionSearch from "@/components/warishcorrection/enhanced-correction-search";
import RecentRequestsList from "@/components/warishcorrection/recent-requests-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

async function CorrectionRequestsContent() {
  // Get recent requests for initial display
  const recentRequests = await db.warishModificationRequest.findMany({
    take: 10,
    orderBy: { requestedDate: "desc" },
    include: {
      warishApplication: {
        select: {
          id: true,
          acknowlegment: true,
          applicantName: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Correction Requests
        </h1>
        <p className="text-muted-foreground mt-2">
          Search for Warish applications and manage correction requests
        </p>
      </div>

      <div className="space-y-12">
        <EnhancedCorrectionSearch initialRequests={[]} initialApp={null} />

        {recentRequests.length > 0 && (
          <RecentRequestsList requests={recentRequests} />
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32 mb-4" />
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-1" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function CorrectionRequestsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CorrectionRequestsContent />
    </Suspense>
  );
}
