 import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Button } from "@/components/ui/button";
 import { listLinkageApplications, issueLinkageCertificate } from "@/action/linkage-actions";
 import { LinkageApplicationStatus } from "@prisma/client";
 
 export default async function IssuePage() {
   const res = await listLinkageApplications({ status: LinkageApplicationStatus.OWNERSHIP_VERIFIED });
   const apps = (res.success && Array.isArray(res.data)) ? (res.data as any[]) : [];
 
   return (
     <div className="p-6 space-y-4">
       <Card>
         <CardHeader>
           <CardTitle>Certificate Issuance</CardTitle>
         </CardHeader>
         <CardContent className="space-y-3">
           {apps.length === 0 && <div>No applications ready for issuance</div>}
           {apps.map((app) => (
             <form
               key={app.id}
               className="grid grid-cols-1 md:grid-cols-4 gap-3 border rounded p-3 items-end"
               action={async (formData) => {
                 "use server";
                 const certificateNo = String(formData.get("certificateNo") || "");
                 const signedBy = String(formData.get("signedBy") || "");
                 const signedDesignation = String(formData.get("signedDesignation") || "");
                 await issueLinkageCertificate({
                   applicationId: app.id,
                   certificateNo,
                   signedBy,
                   signedDesignation,
                 });
               }}
             >
               <div className="md:col-span-1">
                 <div className="font-medium">{app.applicationNo}</div>
                 <div className="text-sm text-muted-foreground">{app.applicantName}</div>
               </div>
               <div>
                 <Label htmlFor={`certificateNo-${app.id}`}>Certificate No</Label>
                 <Input id={`certificateNo-${app.id}`} name="certificateNo" />
               </div>
               <div>
                 <Label htmlFor={`signedBy-${app.id}`}>Signed By</Label>
                 <Input id={`signedBy-${app.id}`} name="signedBy" />
               </div>
               <div>
                 <Label htmlFor={`signedDesignation-${app.id}`}>Designation</Label>
                 <Input id={`signedDesignation-${app.id}`} name="signedDesignation" />
               </div>
               <div className="md:col-span-4">
                 <Button type="submit">Issue Certificate</Button>
               </div>
             </form>
           ))}
         </CardContent>
       </Card>
     </div>
   );
 }
 
