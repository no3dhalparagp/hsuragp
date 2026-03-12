import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { db } from "@/lib/db";
 
 function PrintButton({ onClick }: { onClick: () => void }) {
   "use client";
   return (
     <Button onClick={onClick}>
       Print
     </Button>
   );
 }
 
 export default async function LinkagePrintPage() {
  const certs = await db.linkageCertificate.findMany({
    orderBy: { createdAt: "desc" },
    include: { beneficiaries: true },
  });

  const buildTree = (items: any[]) => {
    const map = new Map<string, any>();
    const roots: any[] = [];
    for (const m of items) {
      map.set(m.id, { ...m, children: [] });
    }
    for (const m of items) {
      const current = map.get(m.id);
      if (m.parentId) {
        const parent = map.get(m.parentId);
        if (parent && current) parent.children.push(current);
      } else {
        roots.push(current);
      }
    }
    return roots;
  };
 
   return (
     <div className="p-6 space-y-4">
       <Card>
         <CardHeader>
           <CardTitle>Print Linkage Certificates</CardTitle>
         </CardHeader>
         <CardContent className="space-y-3">
           {certs.length === 0 && <div>No certificates available</div>}
           {certs.map((cert) => (
             <div key={cert.id} className="flex items-center justify-between border rounded p-3">
               <div>
                 <div className="font-medium">{cert.certificateNo}</div>
                 <div className="text-sm text-muted-foreground">
                   {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : ""}
                 </div>
                {cert.beneficiaries && cert.beneficiaries.length > 0 && (
                  <div className="mt-2">
                    {buildTree(cert.beneficiaries).map((root: any) => (
                      <div key={root.id} className="mb-2">
                        <div className="font-medium">{root.name} <span className="text-sm text-muted-foreground">({root.relation})</span></div>
                        {root.children && root.children.length > 0 && (
                          <div className="ml-4">
                            {root.children.map((child: any) => (
                              <div key={child.id}>
                                <div>{child.name} <span className="text-sm text-muted-foreground">({child.relation})</span></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
               </div>
               <div className="flex gap-2">
                 {cert.pdfUrl ? (
                   <a href={cert.pdfUrl} target="_blank" rel="noreferrer">
                     <Button variant="outline">Open PDF</Button>
                   </a>
                 ) : (
                   <PrintButton onClick={() => window.print()} />
                 )}
               </div>
             </div>
           ))}
         </CardContent>
       </Card>
     </div>
   );
 }
 
