import { CheckCircle, FileText, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

    const stats = [
      {
        title: "Approved",
        value: statusCounts.APPROVED,
        icon: CheckCircle,
        color: "bg-green-500",
        progressColor: "bg-green-400",
      },
      {
        title: "Applied",
        value: statusCounts.SUBMITTED,
        icon: FileText,
        color: "bg-blue-500",
        progressColor: "bg-blue-400",
      },
      {
        title: "Rejected",
        value: statusCounts.REJECTED,
        icon: XCircle,
        color: "bg-red-500",
        progressColor: "bg-red-400",
      },
    ];

    const totalApplications = stats.reduce((acc, curr) => acc + curr.value, 0);

    return (
      <main className="flex flex-1 flex-col p-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header Section */}
          <div className="flex flex-col justify-between gap-4 pb-8 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h1 className="bg-gradient-to-r from-primary to-foreground/80 bg-clip-text text-3xl font-bold text-transparent">
                Welcome back, {cuser.name || "User"}!
              </h1>
              <p className="text-lg text-muted-foreground">
                Application status overview
              </p>
            </div>

            <Card className="px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-primary to-blue-600 text-white">
                    {cuser.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{cuser.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">
                    Account Holder
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="group relative transition-all hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="mt-2 text-4xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`rounded-lg p-2 ${stat.color} text-white`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total applications
                      </span>
                      <span>{totalApplications}</span>
                    </div>
                    <Progress
                      value={
                        (stat.value / Math.max(1, totalApplications)) * 100
                      }
                      className={`h-2 ${stat.progressColor}`}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Activity Section - Add your content here */}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Database error:", error);
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-destructive">
          Error loading dashboard data. Please try again later.
        </p>
      </div>
    );
  }
}
