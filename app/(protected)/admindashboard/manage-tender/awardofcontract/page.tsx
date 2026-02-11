// app/(protected)/admindashboard/manage-tender/awardofcontract/page.tsx
import { db } from "@/lib/db";
import AOCForm from "@/components/AOCForm";

export default async function CreateAOCPage() {
  const works = await db.worksDetail.findMany({
    where: {
      tenderStatus: "FinancialEvaluation",
      AOCDetails: {
        none: {}
      }
    },
    include: {
      nitDetails: true,
      ApprovedActionPlanDetails: true, // Lowercase 'a'
      AOCDetails: true,
      biddingAgencies: {
        include: {
          agencydetails: true
        }
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Acceptance of Contract (AOC)</h1>
        <p className="text-gray-600 mt-2">
          Create a new Acceptance of Contract record for financial evaluation
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <AOCForm works={works} />
      </div>
    </div>
  );
}
