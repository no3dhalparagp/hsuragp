"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, CheckCircle, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface IssueItem {
  id: string;
  applicationNo: string;
  applicantName: string;
  status: "APPROVED" | "ISSUED";
}

export default function IssueNOCPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<IssueItem[]>([]);
  const [selected, setSelected] = useState<IssueItem | null>(null);
  const [memoNumber, setMemoNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");

  useEffect(() => {
    setItems([
      { id: "n1", applicationNo: "LC-2025-0001", applicantName: "Rahul Das", status: "APPROVED" },
      { id: "n2", applicationNo: "LC-2025-0002", applicantName: "Anita Roy", status: "APPROVED" },
    ]);
  }, []);

  const issueNoc = () => {
    if (!selected || !memoNumber || !issueDate) return;
    toast({ title: "NOC Issued", description: `NOC issued for ${selected.applicationNo}` });
    setMemoNumber("");
    setIssueDate("");
    setSelected(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> NOC Issuance</CardTitle>
          <CardDescription>Generate and issue conversion NOC.</CardDescription>
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
                <Badge>{item.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Issue NOC</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selected ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="memoNumber">Memo Number *</Label>
                      <Input id="memoNumber" value={memoNumber} onChange={(e)=>setMemoNumber(e.target.value)} placeholder="e.g., 123/LC/2025" />
                    </div>
                    <div>
                      <Label htmlFor="issueDate">Issue Date *</Label>
                      <Input id="issueDate" type="date" value={issueDate} onChange={(e)=>setIssueDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={issueNoc}><CheckCircle className="h-4 w-4 mr-2"/> Issue NOC</Button>
                    <Button variant="outline"><Download className="h-4 w-4 mr-2"/> Preview</Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-600">Select an approved application to issue NOC.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
