import { db } from "@/lib/db";
import { Edit, Trash2, PlusCircle, List, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
type AgencyDetails = {
  name: string;
  mobileNumber: string | null;
  email: string | null;
  pan: string | null;
  tin: string | null;
  gst: string | null;
  contactDetails: string;
};

export default async function VendorViewPage() {
  const agencyDetail = await db.agencyDetails.findMany({});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 mb-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Users className="h-10 w-10 text-white/90" />
              Vendor Management
            </h1>
            <p className="text-lg text-white/90">
              Streamline your agency partnerships with advanced management tools
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Agencies</h2>
              <p className="text-sm text-gray-600 mt-1">
                {agencyDetail.length} registered partners
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button asChild className="gap-2 shadow-sm">
                <Link href="/admindashboard/manage-vendor/add">
                  <PlusCircle className="h-5 w-5" />
                  <span>New Agency</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="gap-2 border-gray-300 shadow-sm"
              >
                <Link href="/manage-vendor/view-agencies">
                  <List className="h-5 w-5" />
                  <span>All Agencies</span>
                </Link>
              </Button>
            </div>
          </div>

          {agencyDetail.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-xl">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No agencies found
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">
                Get started by adding your first agency partner
              </p>
              <Button className="mt-6 gap-2" asChild>
                <Link href="/manage-vendor/add-agency">
                  <PlusCircle className="h-4 w-4" />
                  Add Agency
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <DataTable columns={columns} data={agencyDetail} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
