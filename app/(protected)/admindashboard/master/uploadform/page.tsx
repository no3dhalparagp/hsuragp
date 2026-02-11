import { Suspense } from "react";
import UploadForm from "@/components/form/uploadForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { FormDownload } from "@/types/form";
import FormList from "./FormList";

async function getFormList(
  page: number = 1,
  pageSize: number = 10
): Promise<{ formlist: FormDownload[]; total: number }> {
  try {
    const formlist = await db.formDownload.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { id: "desc" },
    });
    const total = await db.formDownload.count();
    return { formlist, total };
  } catch (error) {
    console.error("Failed to fetch form list:", error);
    return { formlist: [], total: 0 };
  }
}

export default async function FormsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolved = await searchParams;
  const page = Number(resolved.page) || 1;
  const pageSize = 10;
  const { formlist, total } = await getFormList(page, pageSize);

  return (
    <div className="container mx-auto py-10">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle className="text-2xl font-bold">Upload New Form</CardTitle>
          <CardDescription className="text-sm">
            Please fill out the form below to upload a new document.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <UploadForm />
        </CardContent>
      </Card>

      <div className="mt-10">
        <Suspense fallback={<div>Loading forms...</div>}>
          <FormList
            initialForms={formlist}
            total={total}
            page={page}
            pageSize={pageSize}
          />
        </Suspense>
      </div>
    </div>
  );
}
