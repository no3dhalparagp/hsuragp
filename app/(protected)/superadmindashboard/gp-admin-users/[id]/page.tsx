"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGPAdminUserById } from "@/action/gp-admin-users";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Edit } from "lucide-react";

type GPAdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  mobileNumber: string | null;
  userStatus: "active" | "inactive";
  createdAt: string;
  assignedGP: {
    id: string;
    gpname: string;
    gpcode: string;
    gpaddress: string;
    status: string;
  } | null;
};

export default function GPAdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [adminUser, setAdminUser] = useState<GPAdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadAdminUser(params.id as string);
    }
  }, [params.id]);

  const loadAdminUser = async (id: string) => {
    setLoading(true);
    const result = await getGPAdminUserById(id);
    if (result.success && result.data) {
      setAdminUser(result.data as GPAdminUser);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to load GP admin user",
        variant: "destructive",
      });
      router.push("/dashboard/gp-admin-users");
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status.toUpperCase()}
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

  if (!adminUser) {
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
              <CardTitle className="text-2xl">
                {adminUser.name || "GP Admin User"}
              </CardTitle>
              <p className="text-gray-600 mt-2">GP Admin User Details</p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(adminUser.userStatus)}
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/dashboard/gp-admin-users/${adminUser.id}/edit`)
                }
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                Name
              </h3>
              <p className="text-lg">{adminUser.name || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                Email
              </h3>
              <p className="text-lg">{adminUser.email || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                Mobile Number
              </h3>
              <p className="text-lg">{adminUser.mobileNumber || "N/A"}</p>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                Status
              </h3>
              <div>{getStatusBadge(adminUser.userStatus)}</div>
            </div>

            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">
                Created At
              </h3>
              <p className="text-lg">
                {new Date(adminUser.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {adminUser.assignedGP && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Assigned Gram Panchayat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">
                    GP Name
                  </h4>
                  <p className="text-lg">{adminUser.assignedGP.gpname}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">
                    GP Code
                  </h4>
                  <p className="text-lg font-mono">
                    {adminUser.assignedGP.gpcode}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">
                    Address
                  </h4>
                  <p className="text-lg">{adminUser.assignedGP.gpaddress}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">
                    GP Status
                  </h4>
                  <Badge
                    className={
                      adminUser.assignedGP.status === "APPROVED" ||
                      adminUser.assignedGP.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {adminUser.assignedGP.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

