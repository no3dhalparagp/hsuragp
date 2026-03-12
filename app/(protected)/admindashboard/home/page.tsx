import { db } from "@/lib/db";
import { AdUnit } from "@/components/adsense-provider";
import { unstable_cache } from "next/cache";
import { 
  FileText, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileCheck,
  Building2,
  Receipt,
  Award,
  ClipboardList,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

// Cache the dashboard stats for 30 seconds to improve performance and reduce database load
const getDashboardStats = unstable_cache(
  async () => {
  // Execute all queries in parallel for maximum performance
  const [
    // Warish Application counts
    totalWarish,
    approvedWarish,
    rejectedWarish,
    processWarish,
    pendingWarish,
    totalverify,
    verifypending,
    // Works statistics
    totalWorks,
    completedWorks,
    inProgressWorks,
    approvedWorks,
    workOrders,
    agreements,
    // NIT and Tender statistics
    totalNITs,
    publishedNITs,
    aocNITs,
    retenderNITs,
    cancelledNITs,
    // Agency and Payment statistics
    totalAgencies,
    totalBids,
    totalPayments,
    // Booking statistics
    totalBookings,
    completedBookings,
    pendingBookings,
  ] = await Promise.all([
    // Warish Application counts
    db.warishApplication.count(),
    db.warishApplication.count({
      where: { warishApplicationStatus: "approved" },
    }),
    db.warishApplication.count({
      where: { warishApplicationStatus: "rejected" },
    }),
    db.warishApplication.count({
      where: { warishApplicationStatus: "process" },
    }),
    db.warishApplication.count({
      where: { warishApplicationStatus: "pending" },
    }),
    db.warishApplication.count({
      where: { warishdocumentverified: true },
    }),
    db.warishApplication.count({
      where: { warishdocumentverified: false },
    }),
    // Works statistics
    db.worksDetail.count(),
    db.worksDetail.count({
      where: { workStatus: "workcompleted" },
    }),
    db.worksDetail.count({
      where: { workStatus: "workinprogress" },
    }),
    db.worksDetail.count({
      where: { workStatus: "approved" },
    }),
    db.workorderdetails.count(),
    db.aggrementModel.count(),
    // NIT and Tender statistics
    db.nitDetails.count(),
    db.worksDetail.count({
      where: { tenderStatus: "published" },
    }),
    db.worksDetail.count({
      where: { tenderStatus: "AOC" },
    }),
    db.worksDetail.count({
      where: { tenderStatus: "Retender" },
    }),
    db.worksDetail.count({
      where: { tenderStatus: "Cancelled" },
    }),
    // Agency and Payment statistics
    db.agencyDetails.count(),
    db.bidagency.count(),
    db.paymentDetails.count(),
    // Booking statistics
    db.booking.count(),
    db.booking.count({
      where: { status: "COMPLETED" },
    }),
    db.booking.count({
      where: { status: "PENDING" },
    }),
  ]);

  return {
    totalWarish,
    approvedWarish,
    rejectedWarish,
    processWarish,
    pendingWarish,
    totalverify,
    verifypending,
    totalWorks,
    completedWorks,
    inProgressWorks,
    approvedWorks,
    workOrders,
    agreements,
    totalNITs,
    publishedNITs,
    aocNITs,
    retenderNITs,
    cancelledNITs,
    totalAgencies,
    totalBids,
    totalPayments,
    totalBookings,
    completedBookings,
    pendingBookings,
  };
  },
  ["dashboard-stats"], // Cache key
  {
    revalidate: 30, // Revalidate every 30 seconds
    tags: ["dashboard-stats"], // Cache tags for manual revalidation
  }
);

export default async function AdminDashboard() {
  // Fetch all stats in parallel with caching
  const stats = await getDashboardStats();
  
  // Destructure for easier access
  const {
    totalWarish,
    approvedWarish,
    rejectedWarish,
    pendingWarish,
    totalverify,
    verifypending,
    totalWorks,
    completedWorks,
    inProgressWorks,
    approvedWorks,
    workOrders,
    agreements,
    totalNITs,
    publishedNITs,
    aocNITs,
    retenderNITs,
    cancelledNITs,
    totalAgencies,
    totalBids,
    totalPayments,
    totalBookings,
    completedBookings,
    pendingBookings,
  } = stats;

  const statsCards = [
    // Warish Applications Section
    {
      title: "Total Warish Applications",
      value: totalWarish,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admindashboard/manage-warish",
    },
    {
      title: "Approved Warish",
      value: approvedWarish,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admindashboard/manage-warish",
    },
    {
      title: "Rejected Warish",
      value: rejectedWarish,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      link: "/admindashboard/manage-warish",
    },
    {
      title: "Pending Warish",
      value: pendingWarish,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      link: "/admindashboard/manage-warish",
    },
    {
      title: "Verified Documents",
      value: totalverify,
      icon: FileCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admindashboard/manage-warish",
    },
    {
      title: "Unverified Documents",
      value: verifypending,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      link: "/admindashboard/manage-warish",
    },
    // Works Section
    {
      title: "Total Works",
      value: totalWorks,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admindashboard/manage-tender",
    },
    {
      title: "Completed Works",
      value: completedWorks,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admindashboard/manage-tender",
    },
    {
      title: "Works In Progress",
      value: inProgressWorks,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admindashboard/manage-tender",
    },
    {
      title: "Approved Works",
      value: approvedWorks,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admindashboard/manage-tender",
    },
    {
      title: "Work Orders",
      value: workOrders,
      icon: ClipboardList,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/admindashboard/generate/work-order",
    },
    {
      title: "Agreements",
      value: agreements,
      icon: Award,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      link: "/admindashboard/generate/agrement",
    },
    // NIT & Tender Section
    {
      title: "Total NITs",
      value: totalNITs,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admindashboard/manage-tender",
    },
    {
      title: "Published Works",
      value: publishedNITs,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admindashboard/manage-tender",
    },
    {
      title: "AOC Works",
      value: aocNITs,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admindashboard/manage-tender",
    },
    {
      title: "Retender Works",
      value: retenderNITs,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      link: "/admindashboard/manage-tender",
    },
    {
      title: "Cancelled Works",
      value: cancelledNITs,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      link: "/admindashboard/manage-tender",
    },
    // Agency & Payment Section
    {
      title: "Total Agencies",
      value: totalAgencies,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admindashboard/manage-tender",
    },
    {
      title: "Total Bids",
      value: totalBids,
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/admindashboard/manage-tender",
    },
    {
      title: "Total Payments",
      value: totalPayments,
      icon: Receipt,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admindashboard/fundstatus",
    },
    
    // Booking Section
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: ClipboardList,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admindashboard",
    },
    {
      title: "Completed Bookings",
      value: completedBookings,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/admindashboard",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      link: "/admindashboard",
    },
  ];

  return (
    <div className="flex flex-col py-8 px-4 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Comprehensive statistics and quick access to key sections</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              href={stat.link}
              className="rounded-lg border shadow-sm bg-white p-5 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-xs text-gray-500 group-hover:text-gray-700">
                    View →
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600 mb-1 line-clamp-1">
                  {stat.title}
                </span>
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value.toLocaleString()}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Ad Unit */}
      <div className="mt-6">
        <AdUnit
          slot="8324866123"
          format="auto"
          responsive={true}
        />
      </div>
    </div>
  );
}
