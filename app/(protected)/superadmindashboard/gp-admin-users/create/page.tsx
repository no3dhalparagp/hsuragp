"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { createGPAdminUser, getApprovedGPAccounts } from "@/action/gp-admin-users";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

type GPAccount = {
  id: string;
  gpname: string;
  gpcode: string;
  gpaddress: string;
};

export default function CreateGPAdminUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [gpAccounts, setGpAccounts] = useState<GPAccount[]>([]);
  const [loadingGPs, setLoadingGPs] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    gpId: "",
  });

  useEffect(() => {
    loadGPAccounts();
  }, []);

  const loadGPAccounts = async () => {
    setLoadingGPs(true);
    const result = await getApprovedGPAccounts();
    if (result.success && result.data) {
      setGpAccounts(result.data as GPAccount[]);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to load GP accounts",
        variant: "destructive",
      });
    }
    setLoadingGPs(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGPChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gpId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createGPAdminUser(formData);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "GP admin user created successfully",
      });
      router.push("/dashboard/gp-admin-users");
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create GP admin user",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
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
          <CardTitle>Create GP Admin User</CardTitle>
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
                  disabled={loadingGPs}
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
                {loadingGPs && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Loading GP accounts...
                  </p>
                )}
                {!loadingGPs && gpAccounts.length === 0 && (
                  <p className="text-sm text-destructive mt-1">
                    No approved GP accounts available. Please approve a GP account first.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Admin Name"
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
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 8 characters
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
                  placeholder="+91 1234567890"
                />
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
              <Button type="submit" disabled={loading || loadingGPs || gpAccounts.length === 0}>
                {loading ? "Creating..." : "Create GP Admin User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

