import { db } from "@/lib/db";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/utils";
import { ShowWarishDetails } from "@/components/ShowWarishDetails";

async function getLatestWarishApplications() {
  try {
    const applications = await db.warishApplication.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        warishDetails: {
          take: 3,
        },
      },
    });
    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

export default async function AdminDashboard() {
  const applications = await getLatestWarishApplications();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Latest Warish Applications</h1>

      <div className="rounded-lg border shadow-sm bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3">Acknowledgement No</TableHead>
              <TableHead className="px-4 py-3">Applicant</TableHead>
              <TableHead className="px-4 py-3">Deceased</TableHead>
              <TableHead className="px-4 py-3">Legal Heirs (Top 3)</TableHead>
              <TableHead className="px-4 py-3">Status & Timeline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id} className="hover:bg-gray-50">
                <TableCell className="px-4 py-3 font-medium">
                  {app.acknowlegment}
                  <div className="text-sm text-muted-foreground mt-1">
                    Ref: {app.warishRefNo || "N/A"}
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3">
                  <div className="space-y-1">
                    <p className="font-semibold">{app.applicantName}</p>
                    <div className="text-sm text-muted-foreground">
                      <p>Mob: {app.applicantMobileNumber}</p>
                      <p>{app.villageName}</p>
                      <p>{app.postOffice}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3">
                  <div className="space-y-1">
                    <p className="font-semibold">{app.nameOfDeceased}</p>
                    <div className="text-sm text-muted-foreground">
                      <p>DOD: {formatDate(app.dateOfDeath)}</p>
                      <p>Relation: {app.relationwithdeceased}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3">
                  <div className="space-y-1.5">
                    <ShowWarishDetails warishapplicationid={app.id} />
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase ${
                          app.warishApplicationStatus === "approved"
                            ? "bg-green-100 text-green-800"
                            : app.warishApplicationStatus === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.warishApplicationStatus}
                      </span>
                    </div>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>Submitted: {formatDate(app.createdAt)}</p>
                      {app.renewdate && (
                        <p>Renewed: {formatDate(app.renewdate)}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
