"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, XCircle, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InspectionItem {
  id: string;
  applicationId: string;
  siteAddress: string;
  scheduledDate: string;
  inspectorName: string;
  status: "SCHEDULED" | "COMPLETED" | "REJECTED";
}

export default function SiteInspectionPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<InspectionItem[]>([]);
  const [selected, setSelected] = useState<InspectionItem | null>(null);
  const [report, setReport] = useState("");

  useEffect(() => {
    setItems([
      { id: "i1", applicationId: "1", siteAddress: "Beltala, JL-12, Plot-56", scheduledDate: "2025-10-21", inspectorName: "S. Ghosh", status: "SCHEDULED" },
      { id: "i2", applicationId: "2", siteAddress: "Madhyamgram, JL-45, Plot-12", scheduledDate: "2025-10-22", inspectorName: "R. Dey", status: "SCHEDULED" },
    ]);
  }, []);

  const completeInspection = (approve: boolean) => {
    if (!selected) return;
    toast({
      title: approve ? "Inspection Completed" : "Inspection Rejected",
      description: approve ? "Findings recorded and sent for approval." : "Inspection rejected with remarks.",
    });
    setReport("");
    setSelected(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Inspection</CardTitle>
          <CardDescription>Schedule and record field inspection details.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {items.map((it)=> (
            <Card key={it.id} className={`cursor-pointer ${selected?.id===it.id?"border-blue-500 bg-blue-50":"hover:bg-gray-50"}`} onClick={()=>setSelected(it)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4"/> {it.siteAddress}</CardTitle>
                <CardDescription className="flex items-center gap-2"><Calendar className="h-4 w-4"/> {it.scheduledDate} • {it.inspectorName}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selected ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label>Application ID</Label>
                      <p>{selected.applicationId}</p>
                    </div>
                    <div>
                      <Label>Scheduled Date</Label>
                      <p>{selected.scheduledDate}</p>
                    </div>
                    <div>
                      <Label>Inspector</Label>
                      <p>{selected.inspectorName}</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="report">Findings & Recommendations</Label>
                    <Textarea id="report" rows={5} value={report} onChange={(e)=>setReport(e.target.value)} placeholder="Describe observations, setbacks, access, surrounding land use, etc." />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={()=>completeInspection(true)}><CheckCircle className="h-4 w-4 mr-2"/> Complete</Button>
                    <Button variant="destructive" onClick={()=>completeInspection(false)}><XCircle className="h-4 w-4 mr-2"/> Reject</Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-600">Select a scheduled inspection.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
