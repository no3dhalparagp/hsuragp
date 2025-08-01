import { db } from "@/lib/db";

export default async function AdminDashboard() {
  // Get counts for each status
  const [total, approved, rejected, process, pending] = await Promise.all([
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
  ]);

  const [totalverify, verifypending] = await Promise.all([
    db.warishApplication.count({
      where: {
        warishdocumentverified: true,
      },
    }),

    db.warishApplication.count({
      where: {
        warishdocumentverified: false,
      },
    }),
  ]);

  return (
    <div className="flex flex-col items-center py-8 px-2 min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-5xl">
        <div className="rounded-lg border shadow-sm bg-white p-6 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-600 mb-2">
            Total
          </span>
          <span className="text-3xl font-bold text-blue-700">{total}</span>
        </div>
        <div className="rounded-lg border shadow-sm bg-white p-6 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-600 mb-2">
            Approved
          </span>
          <span className="text-3xl font-bold text-green-600">{approved}</span>
        </div>
        <div className="rounded-lg border shadow-sm bg-white p-6 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-600 mb-2">
            Rejected
          </span>
          <span className="text-3xl font-bold text-red-600">{rejected}</span>
        </div>
        <div className="rounded-lg border shadow-sm bg-white p-6 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-600 mb-2">
            Process
          </span>
          <span className="text-3xl font-bold text-yellow-600">{process}</span>
        </div>
        <div className="rounded-lg border shadow-sm bg-white p-6 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-600 mb-2">
            Pending
          </span>
          <span className="text-3xl font-bold text-orange-500">{pending}</span>
        </div>
        <div className="rounded-lg border shadow-sm bg-white p-6 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-600 mb-2">
            Verify
          </span>
          <span className="text-3xl font-bold text-orange-500">
            {totalverify}
          </span>
        </div>
        <div className="rounded-lg border shadow-sm bg-white p-6 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-600 mb-2">
            Unverify
          </span>
          <span className="text-3xl font-bold text-orange-500">
            {verifypending}
          </span>
        </div>
      </div>
    </div>
  );
}
