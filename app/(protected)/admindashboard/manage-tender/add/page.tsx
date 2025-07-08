import BookNitForm from "@/components/form/BookNitForm";
import Link from "next/link";
import { Eye, Pencil, Copy, ChevronRight, PlusCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="space-y-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight bg-clip-text">
                Create New Tender
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Fill in the required details to publish a new tender notice
              </p>
            </div>
            <Button asChild className="gap-2 shadow-md">
              <Link href="/admindashboard/manage-tender/view">
                <Eye className="h-4 w-4" />
                View All Tenders
              </Link>
            </Button>
          </div>

          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto md:mx-0"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-8">
            <Card className="shadow-xl border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="flex items-center gap-3">
                  <PlusCircle className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      Tender Information
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Complete all required fields to create a new tender
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6 bg-white">
                <BookNitForm />
              </CardContent>
            </Card>
          </div>

          {/* Recent NITs Section */}
          <div className="lg:col-span-4">
            <Card className="shadow-xl border-0 rounded-xl overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Copy className="h-5 w-5" />
                  </div>
                  Recent Tender Notices
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Last 5 created tender notices
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 bg-gray-50">
                <div className="space-y-4">
                  {latestNits.map((nit) => (
                    <div
                      key={nit.id}
                      className="group relative bg-white rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md hover:border-blue-300"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              {nit.memoNumber}/DGP/{nit.memoDate.getFullYear()}
                              {!nit.isPublished && (
                                <Badge
                                  variant="secondary"
                                  className="text-orange-600 bg-orange-50"
                                >
                                  Draft
                                </Badge>
                              )}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Created {formatDate(nit.createdAt)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!nit.isPublished && (
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="rounded-full text-blue-600 hover:bg-blue-50"
                                title="Edit"
                              >
                                <Link
                                  href={`/admindashboard/manage-tender/add/${nit.id}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="rounded-full text-gray-600 hover:bg-gray-100"
                              title="View"
                            >
                              <Link
                                href={`/admindashboard/manage-tender/view/${nit.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <NITCopy nitdetails={nit} />
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {nit.WorksDetail.length} work items
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {nit.isPublished ? "Published" : "Unpublished"}
                          </Badge>
                        </div>
                      </div>

                      <div className="absolute bottom-3 right-3 transition-transform group-hover:-translate-y-1">
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                      </div>
                    </div>
                  ))}
                </div>

                {latestNits.length === 0 && (
                  <div className="text-center py-8">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900">
                      No recent tenders
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Create your first tender to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTender;
