import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Building2, 
  Settings, 
  Shield, 
  Activity,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";

export default async function SuperAdminDashboard() {
  const user = await currentUser();
  
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  try {
    // Get statistics
    const [
      totalUsers,
      totalGPAccounts,
      pendingGPAccounts,
      approvedGPAccounts,
      totalAdmins,
      totalStaff
    ] = await Promise.all([
      db.user.count(),
      db.gPProfile.count(),
      db.gPProfile.count({ where: { status: "PENDING" } }),
      db.gPProfile.count({ where: { status: "APPROVED" } }),
      db.user.count({ where: { role: "admin" } }),
      db.user.count({ where: { role: "staff" } }),
    ]);

    const stats = [
      {
        title: "Total Users",
        value: totalUsers,
        icon: Users,
        color: "bg-blue-500",
        description: "All system users",
      },
      {
        title: "GP Accounts",
        value: totalGPAccounts,
        icon: Building2,
        color: "bg-green-500",
        description: "Total Gram Panchayat accounts",
      },
      {
        title: "Pending Approvals",
        value: pendingGPAccounts,
        icon: Clock,
        color: "bg-yellow-500",
        description: "GP accounts awaiting approval",
      },
      {
        title: "Approved GPs",
        value: approvedGPAccounts,
        icon: CheckCircle2,
        color: "bg-emerald-500",
        description: "Active GP accounts",
      },
      {
        title: "Admins",
        value: totalAdmins,
        icon: Shield,
        color: "bg-purple-500",
        description: "Administrator accounts",
      },
      {
        title: "Staff",
        value: totalStaff,
        icon: Activity,
        color: "bg-orange-500",
        description: "Staff accounts",
      },
    ];

    return (
      <main className="flex flex-1 flex-col p-8">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          {/* Header Section */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h1 className="bg-gradient-to-r from-primary to-foreground/80 bg-clip-text text-3xl font-bold text-transparent">
                Super Admin Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                System overview and management
              </p>
            </div>

            <Card className="px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    {user.name?.charAt(0).toUpperCase() || "SA"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name || "Super Admin"}</p>
                  <p className="text-sm text-muted-foreground">
                    Super Administrator
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="group relative transition-all hover:shadow-lg"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.color} text-white`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <a
                  href="/dashboard/gp-management"
                  className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Manage GP Accounts</p>
                    <p className="text-sm text-muted-foreground">
                      Create and approve GP accounts
                    </p>
                  </div>
                </a>
                <a
                  href="/dashboard/gp-management/create"
                  className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <Settings className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Create GP Account</p>
                    <p className="text-sm text-muted-foreground">
                      Add a new Gram Panchayat
                    </p>
                  </div>
                </a>
                <a
                  href="/dashboard/apiKeyGenerator"
                  className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <Shield className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">API Management</p>
                    <p className="text-sm text-muted-foreground">
                      Generate API keys
                    </p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
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

