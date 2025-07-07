import { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import WorkDetailsList from "./WorkDetailsList";
import AddWorkDetaisForm from "@/components/form/AddWorkDetaisForm";

interface PageProps {
  params: { tenderId: string };
}

async function fetchWorkDetails(tenderId: string) {
  const workDetails = await db.nitDetails.findUnique({
    where: { id: tenderId },
    include: {
      WorksDetail: {
        include: {
          ApprovedActionPlanDetails: true,
        },
      },
    },
  });

  if (!workDetails) {
    notFound();
  }

  return workDetails;
}

export default async function Page({ params }: PageProps) {
  const workDetails = await fetchWorkDetails(params.tenderId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 ">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-8">
            Work Details Management
          </h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <section
              aria-labelledby="add-work-details-heading"
              className="bg-gray-50 rounded-lg p-6 lg:w-1/2"
            >
              <AddWorkDetaisForm tenderId={params.tenderId} />
            </section>

            <section
              aria-labelledby="work-details-list-heading"
              className="bg-gray-50 rounded-lg p-6 lg:w-1/2"
            >
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-pulse text-gray-600">
                      Loading work details...
                    </div>
                  </div>
                }
              >
                <WorkDetailsList workDetails={workDetails} />
              </Suspense>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
