import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import LegalHeirrApplicationDetails from "@/components/LegalHeirrApplicationDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  FileText,
  Users,
  Clipboard,
  Calendar,
  Phone,
  User,
  MapPin,
  File,
} from "lucide-react";

import { WarishApplicationProps, WarishDetailProps } from "@/types";
import { formatDate } from "@/utils/utils";
import EnquiryReportForm from "@/components/form/WarishForm/EnquiryReportForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = (await db.warishApplication.findUnique({
    where: { id },
    include: {
      warishDetails: true,
    },
  })) as WarishApplicationProps | null;

  const warishdocument = await db.warishDocument.findMany({
    where: {
      warishId: id,
    },
  });

  if (!application) {
    notFound();
  }

  // Build the tree structure for warishDetails
  const warishDetailsMap = new Map<string, WarishDetailProps>();
  application.warishDetails.forEach((detail) => {
    warishDetailsMap.set(detail.id, { ...detail, children: [] });
  });

  const rootWarishDetails: WarishDetailProps[] = [];
  warishDetailsMap.forEach((detail) => {
    if (detail.parentId) {
      const parent = warishDetailsMap.get(detail.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(detail);
      }
    } else {
      rootWarishDetails.push(detail);
    }
  });

  return (
    <div className="container mx-auto py-8 space-y-8 px-4 sm:px-6 lg:px-8">
      <Card className="shadow-lg border-t-4 border-t-blue-500 rounded-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8" />
            Warish Application Details / ওয়ারিশ আবেদন বিবরণ
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-blue-700">
                <Calendar className="h-6 w-6" />
                1. Reporting Information / প্রতিবেদন তথ্য
              </h2>
              <p className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">
                  Reporting Date / প্রতিবেদন তারিখ:
                </span>
                {formatDate(application.reportingDate)}
              </p>
            </div>

            <Separator className="my-4" />

            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-blue-700">
                <User className="h-6 w-6" />
                2. Applicant Details / আবেদনকারীর বিবরণ
              </h2>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <span className="font-medium">
                    Applicant Name / আবেদনকারীর নাম:
                  </span>
                  {application.applicantName}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Mobile No / মোবাইল নম্বর:</span>
                  {application.applicantMobileNumber}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">
                    Relation with Deceased / মৃত ব্যক্তির সাথে সম্পর্ক:
                  </span>
                  {application.relationwithdeceased}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-blue-700">
                <Users className="h-6 w-6" />
                3. Deceased Details / মৃত ব্যক্তির বিবরণ
              </h2>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <span className="font-medium">
                    Name of Deceased / মৃত ব্যক্তির নাম:
                  </span>
                  {application.nameOfDeceased}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">
                    Date of Death / মৃত্যুর তারিখ:
                  </span>
                  {formatDate(application.dateOfDeath)}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Gender / লিঙ্গ:</span>
                  <Badge variant="secondary">{application.gender}</Badge>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">
                    Marital Status / বৈবাহিক অবস্থা:
                  </span>
                  <Badge variant="secondary">
                    {application.maritialStatus}
                  </Badge>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">
                    Father&apos;s Name / পিতার নাম:
                  </span>
                  {application.fatherName}
                </p>
                {application.spouseName && (
                  <p className="flex items-center gap-2">
                    <span className="font-medium">
                      Spouse&apos; Name / স্বামী/স্ত্রীর নাম:
                    </span>
                    {application.spouseName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-600">
                <MapPin className="h-5 w-5" />
                Address / ঠিকানা
              </h3>
              <div className="space-y-1 ml-6 text-gray-700">
                <p>
                  <span className="font-medium">Village / গ্রাম:</span>{" "}
                  {application.villageName}
                </p>
                <p>
                  <span className="font-medium">Post Office / ডাকঘর:</span>{" "}
                  {application.postOffice}
                </p>
                <p>
                  <span className="font-medium">Police Station / থানা:</span>{" "}
                  Hili
                </p>
                <p>
                  <span className="font-medium">District / জেলা:</span> Dakshin
                  Dinajpur
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <LegalHeirrApplicationDetails
              application={application}
              rootWarishDetails={rootWarishDetails}
            />

            <Separator className="my-4" />

            {/* // upload document */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-blue-700">
                <FileText className="h-6 w-6" />
                4. Upload Document / ডকুমেন্ট আপলোড
              </h2>
              {warishdocument.map((document) => (
                <div key={document.id}>
                  <p>{document.documentType}</p>

                  {/* // link to cloudinary url */}
                  {/* // show icon */}
                  <a href={document.cloudinaryUrl} target="_blank">
                    <File className="h-6 w-6" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-t-4 border-t-green-500 rounded-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Clipboard className="h-6 w-6" />
            Enquiry Report Form / তদন্ত প্রতিবেদন ফর্ম
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <EnquiryReportForm applicationId={application.id} />
        </CardContent>
      </Card>
    </div>
  );
}
