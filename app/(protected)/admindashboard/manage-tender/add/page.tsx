import BookNitForm from "@/components/form/BookNitForm";
import Link from "next/link";
import { Eye, Pencil, Copy, ChevronRight } from "lucide-react"; // Add Pencil import
import { db } from "@/lib/db";
import { formatDate } from "@/utils/utils";
import { NITCopy } from "@/components/PrintTemplet/PrintNIt-copy";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto  space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Create New Tender
          </h1>
          <p className="text-gray-600 text-lg">
            Fill in the required details to publish a new tender
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <Card className="shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Tender Information
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Please provide complete and accurate details
                  </p>
                </div>
                <BookNitForm />
              </CardContent>
            </Card>
          </div>

          {/* Recent NITs Section */}
          <div className="lg:col-span-5">
            <Card className="shadow-lg h-full">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-semibold">
                  Recent NITs
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Last 5 created tender notices
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {latestNits.map((nit) => (
                    <div
                      key={nit.id}
                      className="group hover:bg-gray-50 rounded-lg p-4 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {nit.memoNumber}/DGP/{nit.memoDate.getFullYear()}
                            </span>
                            {!nit.isPublished && (
                              <span className="inline-block px-2 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded-full">
                                Draft
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Created {formatDate(nit.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!nit.isPublished && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              <Link
                                href={`/admindashboard/manage-tender/add/${nit.id}`}
                                title="Edit"
                                className="flex items-center gap-2 px-3 py-2"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  Edit
                                </span>
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          >
                            <Link
                              href={`/admindashboard/manage-tender/view/${nit.id}`}
                              title="View"
                              className="flex items-center gap-2 px-3 py-2"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="text-sm font-medium">View</span>
                            </Link>
                          </Button>
                          <div className="pl-2">
                            <NITCopy nitdetails={nit} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t pt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/admindashboard/manage-tender/view">
                      View All Tenders
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTender;
