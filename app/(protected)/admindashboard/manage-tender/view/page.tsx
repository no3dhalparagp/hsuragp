import React from "react";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NITListWithYearFilter from "./NITListWithYearFilter";
import { deleteNitAction } from "@/action/bookNitNuber";

// Directly import the client component; Server Components can render Client Components

async function getNITs() {
  try {
    return await db.nitDetails.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        WorksDetail: {
          include: { ApprovedActionPlanDetails: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch NITs:", error);
    return [];
  }
}

export default async function DemoPage() {
  const existnit = await getNITs();

  // Handler for deleting NIT (passed to client component)
  // This is a no-op here, but you can implement server actions if needed
  const handleDeleteNit = async (id: string) => {
    "use server";
    await deleteNitAction(id);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full shadow-sm border-0">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                Manage NITs
              </CardTitle>
              <p className="text-sm text-gray-500">
                Create and manage tender notices efficiently
              </p>
            </div>
            <Link href="/admindashboard/manage-tender/create" passHref>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                New NIT
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <NITListWithYearFilter
            nits={existnit}
            onDeleteNit={handleDeleteNit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
