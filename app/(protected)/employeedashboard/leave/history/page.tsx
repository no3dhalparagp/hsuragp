import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";

const LeaveHistoryPage = async () => {
  const user = await currentUser();

  if (!user?.id) {
    return (
      <div className="rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
        User not found or not logged in.
      </div>
    );
  }

  const leaves = await db.leave.findMany({
    where: { userId: user.id },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Leave History</h1>
        <p className="mt-1 text-sm text-gray-600">
          Showing your leave applications from the live Prisma database.
        </p>
      </div>

      {leaves.length === 0 ? (
        <div className="rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-800">
          No leave records found for your account yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">From</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">To</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                    {format(leave.startDate, "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                    {format(leave.endDate, "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        leave.status === "approved"
                          ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                          : leave.status === "pending"
                          ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200"
                          : leave.status === "rejected"
                          ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                          : "bg-gray-50 text-gray-700 ring-1 ring-gray-200"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                    {leave.leaveType ?? "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{leave.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveHistoryPage;

