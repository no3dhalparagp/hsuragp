"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Search, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ApplicationSummary {
  id: string;
  applicantName: string;
  khatianNo: string;
  plotNo: string;
  mouza: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
}

export default function DocumentVerificationPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [selected, setSelected] = useState<ApplicationSummary | null>(null);
  const [remarks, setRemarks] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Replace with server call
    setApplications([
      { id: "1", applicantName: "Rahul Das", khatianNo: "1234", plotNo: "56", mouza: "Beltala", status: "PENDING" },
      { id: "2", applicantName: "Anita Roy", khatianNo: "9876", plotNo: "12", mouza: "Madhyamgram", status: "PENDING" },
    ]);
  }, []);

  const filtered = applications.filter((a) =>
    [a.applicantName, a.khatianNo, a.plotNo, a.mouza].some((f) => f.toLowerCase().includes(search.toLowerCase()))
  );

  const takeAction = (action: "verify" | "reject") => {
    if (!selected) return;
    toast({
      title: action === "verify" ? "Documents Verified" : "Application Rejected",
      description: action === "verify" ? "Application moved to Site Inspection." : "Remarks recorded and applicant notified.",
    });
    setRemarks("");
    setSelected(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Verification</CardTitle>
          <CardDescription>Verify uploaded records and validate ownership/land details.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by applicant, khatian, plot or mouza" value={search} onChange={(e)=>setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((app)=> (
              <Card key={app.id} className={`cursor-pointer ${selected?.id===app.id?"border-blue-500 bg-blue-50":"hover:bg-gray-50"}`} onClick={()=>setSelected(app)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{app.applicantName}</CardTitle>
                  <CardDescription>
                    Khatian: {app.khatianNo} • Plot: {app.plotNo}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge>{app.mouza}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Verification Panel
          </CardTitle>
          <CardDescription>Select an application to proceed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Applicant</Label>
                  <p className="text-sm">{selected.applicantName}</p>
                </div>
                <div>
                  <Label>Khatian / Plot</Label>
                  <p className="text-sm">{selected.khatianNo} / {selected.plotNo}</p>
                </div>
                <div>
                  <Label>Mouza</Label>
                  <p className="text-sm">{selected.mouza}</p>
                </div>
              </div>
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea id="remarks" rows={3} value={remarks} onChange={(e)=>setRemarks(e.target.value)} placeholder="Add verification remarks..." />
              </div>
              <div className="flex gap-3">
                <Button onClick={()=>takeAction("verify")}> <CheckCircle className="h-4 w-4 mr-2"/> Verify</Button>
                <Button variant="destructive" onClick={()=>takeAction("reject")}> <XCircle className="h-4 w-4 mr-2"/> Reject</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No application selected.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
