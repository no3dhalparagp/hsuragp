"use client";

import { useRouter } from "next/navigation";
import CorrectionRequestReview from "./correction-request-review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

interface RecentRequestsListProps {
  requests: any[];
}

export default function RecentRequestsList({ requests }: RecentRequestsListProps) {
  const router = useRouter();

  const handleRequestReviewed = () => {
    router.refresh();
  };

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-2xl font-semibold tracking-tight">Recent Requests</h2>
      </div>
      
      <Card className="border-0 shadow-none bg-transparent p-0">
        <CardContent className="p-0">
          <CorrectionRequestReview
            requests={requests}
            onRequestReviewed={handleRequestReviewed}
            viewMode="list"
          />
        </CardContent>
      </Card>
    </div>
  );
}
