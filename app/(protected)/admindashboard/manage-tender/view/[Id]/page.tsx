import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function NITDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const nit = await db.nitDetails.findUnique({
    where: { id },
    include: {
      WorksDetail: {
        include: {
          ApprovedActionPlanDetails: true,
        },
      },
    },
  });

  if (!nit) {
    notFound();
  }

  const formatDateTime = (date: Date) => {
    const d = new Date(date);
    return `${formatDate(d)} ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-2xl font-bold flex items-center justify-between">
            <span>NIT Details: {nit.memoNumber}</span>
            <div className="flex space-x-2">
              <Badge variant={nit.isPublished ? "default" : "secondary"}>
                {nit.isPublished ? "Published" : "Draft"}
              </Badge>
              <Badge variant={nit.isSupply ? "default" : "outline"}>
                {nit.isSupply ? "Supply" : "Works"}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
              <p>
                <span className="font-medium">Memo Number:</span>{" "}
                {nit.memoNumber}
              </p>
              <p>
                <span className="font-medium">Memo Date:</span>{" "}
                {formatDate(nit.memoDate)}
              </p>
              <p>
                <span className="font-medium">Publishing Date:</span>{" "}
                {formatDate(nit.publishingDate)}
              </p>
              <p>
                <span className="font-medium">Bid Validity:</span>{" "}
                {nit.bidValidity} days
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Document Download</h3>
              <p>
                <span className="font-medium">From:</span>{" "}
                {formatDateTime(nit.documentDownloadFrom)}
              </p>
              <p>
                <span className="font-medium">Start Time:</span>{" "}
                {new Date(nit.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <span className="font-medium">End Time:</span>{" "}
                {new Date(nit.endTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Bid Opening</h3>
              <p>
                <span className="font-medium">Technical Bid:</span>{" "}
                {formatDateTime(nit.technicalBidOpeningDate)}
              </p>
              {nit.financialBidOpeningDate && (
                <p>
                  <span className="font-medium">Financial Bid:</span>{" "}
                  {formatDateTime(nit.financialBidOpeningDate)}
                </p>
              )}
              <p>
                <span className="font-medium">Place of Opening:</span>{" "}
                {nit.placeOfOpeningBids}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WorksDetail Section */}
      {nit.WorksDetail && nit.WorksDetail.length > 0 && (
        <div className="mt-10">
          {/* Summary of totals */}
          {(() => {
            const totalEstimate = nit.WorksDetail.reduce(
              (sum, work) => sum + (work.finalEstimateAmount || 0),
              0
            );
            const totalParticipation = nit.WorksDetail.reduce(
              (sum, work) => sum + (work.participationFee || 0),
              0
            );
            return (
              <div className="mb-6 flex flex-col md:flex-row gap-4 md:gap-10">
                <div className="text-lg font-semibold">
                  Total Estimate Value:{" "}
                  <span className="font-bold text-blue-700">
                    ₹{totalEstimate.toLocaleString()}
                  </span>
                </div>
                <div className="text-lg font-semibold">
                  Total Participation Charge:{" "}
                  <span className="font-bold text-green-700">
                    ₹{totalParticipation.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })()}
          <h2 className="text-xl font-bold mb-4">Work Details</h2>
          <div className="space-y-4">
            {nit.WorksDetail.map((work, idx) => (
              <Card key={work.id} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Badge
                      variant="secondary"
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      {idx + 1}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="font-medium min-w-[180px]">
                          Activity Code:{" "}
                          {work.ApprovedActionPlanDetails?.activityCode}
                        </span>
                        <span>
                          Estimate Cost: ₹
                          {work.finalEstimateAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {work.ApprovedActionPlanDetails?.activityName}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Theme:{" "}
                      </span>
                      {work.ApprovedActionPlanDetails?.themeName}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Financial Year:{" "}
                      </span>
                      {work.ApprovedActionPlanDetails?.financialYear}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Tender Form Fee:{" "}
                      </span>
                      ₹{work.participationFee?.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Estimated Cost:{" "}
                      </span>
                      ₹{work.finalEstimateAmount?.toLocaleString()}
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Description:{" "}
                    </span>
                    {work.ApprovedActionPlanDetails?.activityDescription}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Status:{" "}
                    </span>
                    <Badge
                      variant={
                        work.ApprovedActionPlanDetails?.isPublish
                          ? "default"
                          : "destructive"
                      }
                    >
                      {work.ApprovedActionPlanDetails?.isPublish
                        ? "Published"
                        : "Not Published"}
                    </Badge>
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
