"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FileText, CheckCircle, Clock } from "lucide-react";

export default function LandConversionApplicationPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    applicantName: "",
    applicantPhone: "",
    applicantEmail: "",
    address: "",
    khatianNo: "",
    plotNo: "",
    mouza: "",
    jlNo: "",
    policeStation: "",
    block: "",
    district: "",
    state: "",
    landAreaDec: "",
    presentLandUse: "",
    proposedLandUse: "",
  });

  const handleSubmit = async (action: "draft" | "submit") => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast({
        title: action === "draft" ? "Draft saved" : "Application submitted",
        description: action === "draft" ? "Your draft has been saved." : "Your land conversion application has been submitted.",
      });
      if (action === "submit") {
        setForm({
          applicantName: "",
          applicantPhone: "",
          applicantEmail: "",
          address: "",
          khatianNo: "",
          plotNo: "",
          mouza: "",
          jlNo: "",
          policeStation: "",
          block: "",
          district: "",
          state: "",
          landAreaDec: "",
          presentLandUse: "",
          proposedLandUse: "",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Land Conversion NOC - New Application
          </CardTitle>
          <CardDescription>Fill in applicant and land details to apply for conversion NOC.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applicant Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="applicantName">Full Name *</Label>
              <Input id="applicantName" value={form.applicantName} onChange={(e)=>setForm((p)=>({...p, applicantName: e.target.value}))} />
            </div>
            <div>
              <Label htmlFor="applicantPhone">Phone *</Label>
              <Input id="applicantPhone" value={form.applicantPhone} onChange={(e)=>setForm((p)=>({...p, applicantPhone: e.target.value}))} />
            </div>
            <div>
              <Label htmlFor="applicantEmail">Email</Label>
              <Input id="applicantEmail" type="email" value={form.applicantEmail} onChange={(e)=>setForm((p)=>({...p, applicantEmail: e.target.value}))} />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea id="address" rows={3} value={form.address} onChange={(e)=>setForm((p)=>({...p, address: e.target.value}))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Land Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="khatianNo">Khatian No *</Label>
              <Input id="khatianNo" value={form.khatianNo} onChange={(e)=>setForm((p)=>({...p, khatianNo: e.target.value}))} />
            </div>
            <div>
              <Label htmlFor="plotNo">Plot No *</Label>
              <Input id="plotNo" value={form.plotNo} onChange={(e)=>setForm((p)=>({...p, plotNo: e.target.value}))} />
            </div>
            <div>
              <Label htmlFor="mouza">Mouza *</Label>
              <Input id="mouza" value={form.mouza} onChange={(e)=>setForm((p)=>({...p, mouza: e.target.value}))} />
            </div>
            <div>
              <Label htmlFor="jlNo">JL No *</Label>
              <Input id="jlNo" value={form.jlNo} onChange={(e)=>setForm((p)=>({...p, jlNo: e.target.value}))} />
            </div>
            <div>
              <Label htmlFor="policeStation">Police Station *</Label>
              <Input id="policeStation" value={form.policeStation} onChange={(e)=>setForm((p)=>({...p, policeStation: e.target.value}))} />
            </div>
            <div>
              <Label htmlFor="block">Block *</Label>
              <Input id="block" value={form.block} onChange={(e)=>setForm((p)=>({...p, block: e.target.value}))} />
            </div>
            <div>
              <Label htmlFor="district">District *</Label>
              <Input id="district" value={form.district} onChange={(e)=>setForm((p)=>({...p, district: e.target.value}))} />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input id="state" value={form.state} onChange={(e)=>setForm((p)=>({...p, state: e.target.value}))} />
            </div>
            <div>
              <Label htmlFor="landAreaDec">Land Area (Decimal) *</Label>
              <Input id="landAreaDec" value={form.landAreaDec} onChange={(e)=>setForm((p)=>({...p, landAreaDec: e.target.value}))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Present Land Use *</Label>
              <Select value={form.presentLandUse} onValueChange={(v)=>setForm((p)=>({...p, presentLandUse: v}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select present land use" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Proposed Land Use *</Label>
              <Select value={form.proposedLandUse} onValueChange={(v)=>setForm((p)=>({...p, proposedLandUse: v}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select proposed land use" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="institutional">Institutional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={()=>handleSubmit("draft")} disabled={isSubmitting} className="flex-1">
              <FileText className="h-4 w-4 mr-2" /> Save as Draft
            </Button>
            <Button onClick={()=>handleSubmit("submit")} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />} Submit Application
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
