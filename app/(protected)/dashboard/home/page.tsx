import { CheckCircle, FileText, XCircle } from "lucide-react";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default async function Dashboard() {
  const cuser = await currentUser();

  if (!cuser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  try {
    const statusGroups = await db.warishApplication.groupBy({
      where: { userId: cuser.id },
      by: ["warishApplicationStatus"],
      _count: { _all: true },
    });

    const statusCounts = {
      APPROVED: 0,
      SUBMITTED: 0,
      REJECTED: 0,
    };

    statusGroups.forEach(({ warishApplicationStatus, _count }) => {
      const status =
        warishApplicationStatus.toUpperCase() as keyof typeof statusCounts;

      if (status in statusCounts) {
        statusCounts[status] = _count._all;
      }
    });

    const totalApplications =
      statusCounts.APPROVED +
      statusCounts.SUBMITTED +
      statusCounts.REJECTED;

    const stats = [
      {
        title: "Approved Applications",
        value: statusCounts.APPROVED,
        icon: CheckCircle,
        color: "text-green-600",
        border: "border-green-500",
      },
      {
        title: "Submitted Applications",
        value: statusCounts.SUBMITTED,
        icon: FileText,
        color: "text-blue-600",
        border: "border-blue-500",
      },
      {
        title: "Rejected Applications",
        value: statusCounts.REJECTED,
        icon: XCircle,
        color: "text-red-600",
        border: "border-red-500",
      },
    ];

    return (
      <main className="flex flex-1 flex-col bg-gray-100 p-6">
        <div className="mx-auto w-full max-w-7xl space-y-6">

          {/* Header */}
          <Card className="border shadow-sm">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Warish Application Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {cuser.name || "User"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-600 text-white">
                    {cuser.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{cuser.name}</p>
                  <p className="text-sm text-gray-500">Citizen</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Total */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-700">
                {totalApplications}
              </p>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">

            {stats.map((stat, index) => (
              <Card
                key={index}
                className={`border-l-4 ${stat.border} shadow-sm`}
              >
                <CardContent className="flex items-center justify-between p-6">

                  <div>
                    <p className="text-sm text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">
                      {stat.value}
                    </p>
                  </div>

                  <stat.icon className={`h-8 w-8 ${stat.color}`} />

                </CardContent>
              </Card>
            ))}

          </div>

        </div>
      </main>
    );
  } catch (error) {
    console.error("Database error:", error);

    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-red-600">
          Error loading dashboard data. Please try again later.
        </p>
      </div>
    );
  }
}
