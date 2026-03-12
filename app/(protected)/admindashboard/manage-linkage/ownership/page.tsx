 import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { listLinkageApplications, verifyOwnership } from "@/action/linkage-actions";
 import { LinkageApplicationStatus } from "@prisma/client";
 
 export default async function OwnershipPage() {
   const res = await listLinkageApplications({ status: LinkageApplicationStatus.OWNERSHIP_PENDING });
   const apps = (res.success && Array.isArray(res.data)) ? (res.data as any[]) : [];
 
   return (
     <div className="p-6 space-y-4">
       <Card>
         <CardHeader>
           <CardTitle>Ownership Verification</CardTitle>
         </CardHeader>
         <CardContent className="space-y-3">
           {apps.length === 0 && <div>No applications pending ownership verification</div>}
           {apps.map((app) => (
             <form
               key={app.id}
               className="flex items-center justify-between border rounded p-3"
               action={async () => {
                 "use server";
                 await verifyOwnership({
                   applicationId: app.id,
                   officerName: "Officer",
                   confirmed: true,
                 });
               }}
             >
               <div>
                 <div className="font-medium">{app.applicationNo}</div>
                 <div className="text-sm text-muted-foreground">{app.applicantName}</div>
               </div>
               <div className="flex gap-2">
                 <Button type="submit">Verify</Button>
                 <Button
                   type="submit"
                   formAction={async () => {
                     "use server";
                     await verifyOwnership({
                       applicationId: app.id,
                       officerName: "Officer",
                       confirmed: false,
                     });
                   }}
                   variant="destructive"
                 >
                   Reject
                 </Button>
               </div>
             </form>
           ))}
         </CardContent>
       </Card>
     </div>
   );
 }
 
