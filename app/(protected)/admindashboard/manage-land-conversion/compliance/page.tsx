"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ComplianceItem {
  id: string;
  applicationNo: string;
  applicantName: string;
  condition: string;
  status: "DUE" | "COMPLIED" | "VIOLATION";
}

export default function ComplianceCheckPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<ComplianceItem[]>([]);
  const [selected, setSelected] = useState<ComplianceItem | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    setItems([
      { id: "c1", applicationNo: "LC-2025-0001", applicantName: "Rahul Das", condition: "Maintain 3m setback from road", status: "DUE" },
      { id: "c2", applicationNo: "LC-2025-0002", applicantName: "Anita Roy", condition: "Rainwater harvesting provision", status: "DUE" },
    ]);
  }, []);

  const markStatus = (status: "COMPLIED" | "VIOLATION") => {
    if (!selected) return;
    toast({
      title: status === "COMPLIED" ? "Compliance Recorded" : "Violation Flagged",
      description: status === "COMPLIED" ? "Condition marked as complied." : "Violation recorded and escalated.",
    });
    setNote("");
    setSelected(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Check</CardTitle>
          <CardDescription>Track and enforce NOC conditions after issuance.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {items.map((item)=> (
            <Card key={item.id} className={`cursor-pointer ${selected?.id===item.id?"border-blue-500 bg-blue-50":"hover:bg-gray-50"}`} onClick={()=>setSelected(item)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{item.applicationNo}</CardTitle>
                <CardDescription>{item.applicantName}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={item.status === "VIOLATION" ? "destructive" : "default"}>{item.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selected ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Condition</Label>
                      <p>{selected.condition}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className="w-fit">{selected.status}</Badge>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="note">Observation/Note</Label>
                    <Textarea id="note" rows={4} value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Enter observation details..." />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={()=>markStatus("COMPLIED")}><CheckCircle className="h-4 w-4 mr-2"/> Mark Complied</Button>
                    <Button variant="destructive" onClick={()=>markStatus("VIOLATION")}><AlertTriangle className="h-4 w-4 mr-2"/> Flag Violation</Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-600">Select an item from the list.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
