import BookNitForm from "@/components/form/BookNitForm";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import RecentTendersTable from "@/components/manage-tender/RecentTendersTable";

const CreateTender = async () => {
  const latestNits = await db.nitDetails.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      WorksDetail: {
        include: {
          ApprovedActionPlanDetails: true,
        },
      },
    },
  });

  
 

  return (
    <div className="min-h-screen bg-gray-50 p-2">
     
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-7">
            <Card className="shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Tender Information</h2>
                  <p className="text-sm text-gray-500">
                    Please provide complete and accurate details
                  </p>
                </div>
                <BookNitForm />
              </CardContent>
            </Card>
          </div>

          {/* Recent Tenders 
          <div className="lg:col-span-5">
            <RecentTendersTable nits={latestNits} />
          </div>
          */}
        </div>
      
    </div>
  );
};

export default CreateTender;
