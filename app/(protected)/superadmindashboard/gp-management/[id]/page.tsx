"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGPAccountById } from "@/action/gp-management";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

type GPAccount = {
  id: string;
  gpname: string;
  gpcode: string;
  gpaddress: string;
  nameinprodhan: string;
  blockname: string;
  gpshortname: string;
  gpnameinshort: string;
  gpmail: string | null;
  gptannumber: string | null;
  contactNumber: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdByUser: { name: string | null; email: string | null } | null;
  approvedByUser: { name: string | null; email: string | null } | null;
};

export default function GPAccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [gpAccount, setGpAccount] = useState<GPAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadGPAccount(params.id as string);
    }
  }, [params.id]);

  const loadGPAccount = async (id: string) => {
    setLoading(true);
    const result = await getGPAccountById(id);
    if (result.success && result.data) {
      setGpAccount(result.data as GPAccount);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to load GP account",
        variant: "destructive",
      });
      router.push("/dashboard/gp-management");
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      ACTIVE: "bg-blue-100 text-blue-800",
      REJECTED: "bg-red-100 text-red-800",
      SUSPENDED: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (!gpAccount) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{gpAccount.gpname}</CardTitle>
              <p className="text-gray-600 mt-2">GP Code: {gpAccount.gpcode}</p>
            </div>
            {getStatusBadge(gpAccount.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                GP Name
              </h3>
              <p className="text-lg">{gpAccount.gpname}</p>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                Name in Prodhan
              </h3>
              <p className="text-lg">{gpAccount.nameinprodhan}</p>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                GP Code
              </h3>
              <p className="text-lg font-mono">{gpAccount.gpcode}</p>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                Block Name
              </h3>
              <p className="text-lg">{gpAccount.blockname}</p>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                GP Short Name
              </h3>
              <p className="text-lg">{gpAccount.gpshortname}</p>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                GP Name (Short)
              </h3>
              <p className="text-lg">{gpAccount.gpnameinshort}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                Address
              </h3>
              <p className="text-lg">{gpAccount.gpaddress}</p>
            </div>

            {gpAccount.gpmail && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">
                  Email
                </h3>
                <p className="text-lg">{gpAccount.gpmail}</p>
              </div>
            )}

            {gpAccount.contactNumber && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">
                  Contact Number
                </h3>
                <p className="text-lg">{gpAccount.contactNumber}</p>
              </div>
            )}

            {gpAccount.gptannumber && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">
                  TAN Number
                </h3>
                <p className="text-lg">{gpAccount.gptannumber}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-6 space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-2">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Created At:</span>
                  <p className="font-medium">
                    {new Date(gpAccount.createdAt).toLocaleString()}
                  </p>
                </div>
                {gpAccount.createdByUser && (
                  <div>
                    <span className="text-gray-600">Created By:</span>
                    <p className="font-medium">
                      {gpAccount.createdByUser.name || gpAccount.createdByUser.email}
                    </p>
                  </div>
                )}
                {gpAccount.approvedAt && (
                  <div>
                    <span className="text-gray-600">Approved At:</span>
                    <p className="font-medium">
                      {new Date(gpAccount.approvedAt).toLocaleString()}
                    </p>
                  </div>
                )}
                {gpAccount.approvedByUser && (
                  <div>
                    <span className="text-gray-600">Approved By:</span>
                    <p className="font-medium">
                      {gpAccount.approvedByUser.name || gpAccount.approvedByUser.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {gpAccount.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-red-800 mb-1">
                  Rejection Reason
                </h3>
                <p className="text-red-700">{gpAccount.rejectionReason}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

