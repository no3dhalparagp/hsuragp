import { Suspense } from "react";
import { db } from "@/lib/db";
import EnhancedCorrectionSearch from "@/components/warishcorrection/enhanced-correction-search";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

      <EnhancedCorrectionSearch initialRequests={[]} initialApp={null} />

      {recentRequests.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Recent Requests</h2>
          <div className="grid gap-4">
            {recentRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {request.fieldToModify
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Application: {request.warishApplication?.acknowlegment}{" "}
                        ({request.warishApplication?.applicantName})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Requested by: {request.requestedBy} •{" "}
                        {new Date(request.requestedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
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
