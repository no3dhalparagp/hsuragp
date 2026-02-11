"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGPAccount } from "@/action/gp-management";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

export default function CreateGPAccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gpname: "",
    gpaddress: "",
    nameinprodhan: "",
    gpcode: "",
    gpnameinshort: "",
    blockname: "",
    gpshortname: "",
    gpmail: "",
    gptannumber: "",
    contactNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createGPAccount(formData);

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "GP account created successfully",
      });
      router.push("/dashboard/gp-management");
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create GP account",
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
          <CardTitle>Create New GP Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gpname">GP Name *</Label>
                <Input
                  id="gpname"
                  name="gpname"
                  value={formData.gpname}
                  onChange={handleChange}
                  required
                  placeholder="e.g., NO 4 HARSURA GRAM PANCHAYAT"
                />
              </div>

              <div>
                <Label htmlFor="gpcode">GP Code *</Label>
                <Input
                  id="gpcode"
                  name="gpcode"
                  value={formData.gpcode}
                  onChange={handleChange}
                  required
                  placeholder="e.g., HRGP"
                  className="uppercase"
                />
              </div>

              <div>
                <Label htmlFor="nameinprodhan">Name in Prodhan *</Label>
                <Input
                  id="nameinprodhan"
                  name="nameinprodhan"
                  value={formData.nameinprodhan}
                  onChange={handleChange}
                  required
                  placeholder="e.g., No 4 Harsura Gram Panchayat"
                />
              </div>

              <div>
                <Label htmlFor="blockname">Block Name *</Label>
                <Input
                  id="blockname"
                  name="blockname"
                  value={formData.blockname}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Tapan Dev."
                />
              </div>

              <div>
                <Label htmlFor="gpnameinshort">GP Name (Short) *</Label>
                <Input
                  id="gpnameinshort"
                  name="gpnameinshort"
                  value={formData.gpnameinshort}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Harsura"
                />
              </div>

              <div>
                <Label htmlFor="gpshortname">GP Short Name *</Label>
                <Input
                  id="gpshortname"
                  name="gpshortname"
                  value={formData.gpshortname}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Harsura"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="gpaddress">GP Address *</Label>
                <Input
                  id="gpaddress"
                  name="gpaddress"
                  value={formData.gpaddress}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Vill-Suhari, PO-Rampur, PS-Tapan"
                />
              </div>

              <div>
                <Label htmlFor="gpmail">Email</Label>
                <Input
                  id="gpmail"
                  name="gpmail"
                  type="email"
                  value={formData.gpmail}
                  onChange={handleChange}
                  placeholder="gp@example.com"
                />
              </div>

              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <Label htmlFor="gptannumber">TAN Number</Label>
                <Input
                  id="gptannumber"
                  name="gptannumber"
                  value={formData.gptannumber}
                  onChange={handleChange}
                  placeholder="TAN number"
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
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create GP Account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

