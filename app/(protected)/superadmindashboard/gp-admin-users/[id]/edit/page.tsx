"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getGPAdminUserById,
  updateGPAdminUser,
  getApprovedGPAccounts,
} from "@/action/gp-admin-users";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

type GPAccount = {
  id: string;
  gpname: string;
  gpcode: string;
  gpaddress: string;
};

export default function EditGPAdminUserPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [gpAccounts, setGpAccounts] = useState<GPAccount[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    gpId: "",
    userStatus: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (params.id) {
      loadData();
    }
  }, [params.id]);

  const loadData = async () => {
    setLoadingUser(true);
    const [userResult, gpResult] = await Promise.all([
      getGPAdminUserById(params.id as string),
      getApprovedGPAccounts(),
    ]);

    if (userResult.success && userResult.data) {
      const user = userResult.data;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // Don't pre-fill password
        mobileNumber: user.mobileNumber || "",
        gpId: user.assignedGPId || "",
        userStatus: user.userStatus,
      });
    } else {
      toast({
        title: "Error",
        description: userResult.error || "Failed to load user",
        variant: "destructive",
      });
      router.push("/dashboard/gp-admin-users");
    }

    if (gpResult.success && gpResult.data) {
      setGpAccounts(gpResult.data as GPAccount[]);
    }

    setLoadingUser(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGPChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gpId: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, userStatus: value as "active" | "inactive" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updateData: any = {
      userId: params.id as string,
      name: formData.name,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      gpId: formData.gpId,
      userStatus: formData.userStatus,
    };

    // Only include password if it's provided
    if (formData.password) {
      updateData.password = formData.password;
    }

    const result = await updateGPAdminUser(updateData);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "GP admin user updated successfully",
      });
      router.push(`/dashboard/gp-admin-users/${params.id}`);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update GP admin user",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  if (loadingUser) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit GP Admin User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="gpId">Assign to GP *</Label>
                <Select
                  value={formData.gpId}
                  onValueChange={handleGPChange}
                  required
                >
                  <SelectTrigger id="gpId">
                    <SelectValue placeholder="Select a Gram Panchayat" />
                  </SelectTrigger>
                  <SelectContent>
                    {gpAccounts.map((gp) => (
                      <SelectItem key={gp.id} value={gp.id}>
                        {gp.gpname} ({gp.gpcode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">New Password (Leave blank to keep current)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  placeholder="Minimum 8 characters"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only fill if you want to change the password
                </p>
              </div>

              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="userStatus">Status *</Label>
                <Select
                  value={formData.userStatus}
                  onValueChange={handleStatusChange}
                  required
                >
                  <SelectTrigger id="userStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update GP Admin User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

