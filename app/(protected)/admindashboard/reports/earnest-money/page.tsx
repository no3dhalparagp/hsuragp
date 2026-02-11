import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEarnestMoneyReport } from "@/action/reports-actions";
import { formatDistanceToNow } from "date-fns";
import {
  getCurrentFinancialYear,
  getFinancialYearDateRange,
} from "@/utils/financialYear";
import { FinancialYearSelector } from "../_components/financial-year-selector";

export default async function EarnestMoneyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolved = await searchParams;
  const financialYear =
    (resolved?.financialYear as string) || getCurrentFinancialYear();
  const { financialYearStart, financialYearEnd } =
    getFinancialYearDateRange(financialYear);

  // Note: getEarnestMoneyReport does not currently support date filtering.
  const earnestMoneyResult = await getEarnestMoneyReport();
  const earnestMoneyData = earnestMoneyResult.success
    ? earnestMoneyResult.data
    : null;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Admin: Earnest Money Report
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Track earnest money collection, payments, and status across all
            vendors.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 space-y-8">
          <div className="flex justify-end mb-4">
            <FinancialYearSelector />
          </div>
          {/* Summary Statistics */}
          {earnestMoneyData?.summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-700">
                    ₹{earnestMoneyData.summary.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600">Total Amount</div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-700">
                    ₹{earnestMoneyData.summary.paidAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Paid Amount</div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-700">
                    ₹{earnestMoneyData.summary.pendingAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-orange-600">Pending Amount</div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-700">
                    ₹{earnestMoneyData.summary.refundedAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-600">Refunded Amount</div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-700">
                    ₹{earnestMoneyData.summary.forfeitedAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-red-600">Forfeited Amount</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Status Breakdown */}
          {earnestMoneyData?.statusBreakdown && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Paid</span>
                      <span className="text-2xl font-bold text-green-700">
                        {earnestMoneyData.statusBreakdown.paid}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Pending</span>
                      <span className="text-2xl font-bold text-orange-700">
                        {earnestMoneyData.statusBreakdown.pending}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Refunded</span>
                      <span className="text-2xl font-bold text-purple-700">
                        {earnestMoneyData.statusBreakdown.refunded}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">Forfeited</span>
                      <span className="text-2xl font-bold text-red-700">
                        {earnestMoneyData.statusBreakdown.forfeited}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Collection Rate</span>
                      <span className="text-2xl font-bold text-blue-700">
                        {earnestMoneyData.summary.totalAmount > 0
                          ? Math.round(
                              (earnestMoneyData.summary.paidAmount /
                                earnestMoneyData.summary.totalAmount) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Pending Rate</span>
                      <span className="text-2xl font-bold text-green-700">
                        {earnestMoneyData.summary.totalAmount > 0
                          ? Math.round(
                              (earnestMoneyData.summary.pendingAmount /
                                earnestMoneyData.summary.totalAmount) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium">Refund Rate</span>
                      <span className="text-2xl font-bold text-yellow-700">
                        {earnestMoneyData.summary.totalAmount > 0
                          ? Math.round(
                              (earnestMoneyData.summary.refundedAmount /
                                earnestMoneyData.summary.totalAmount) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Earnest Money Records Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Earnest Money Records</span>
                <span className="text-sm text-gray-500">
                  {earnestMoneyData?.earnestMoneyRecords?.length || 0} records
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!earnestMoneyResult.success ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">
                    Error: {earnestMoneyResult.error}
                  </p>
                  <p className="text-gray-500">
                    Unable to load earnest money data. Please try again later.
                  </p>
                </div>
              ) : !earnestMoneyData?.earnestMoneyRecords ||
                earnestMoneyData.earnestMoneyRecords.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No earnest money records found. Records will appear here
                    once vendors submit earnest money.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 border text-left">
                          Vendor Name
                        </th>
                        <th className="px-4 py-3 border text-left">Amount</th>
                        <th className="px-4 py-3 border text-left">Status</th>
                        <th className="px-4 py-3 border text-left">
                          Payment Method
                        </th>
                        <th className="px-4 py-3 border text-left">
                          Payment Date
                        </th>
                        <th className="px-4 py-3 border text-left">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnestMoneyData.earnestMoneyRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border">
                            <div>
                              <div className="font-medium">
                                {record.bidderName.agencydetails.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {record.bidderName.agencydetails.mobileNumber ||
                                  "No contact"}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 border">
                            <div className="font-medium">
                              ₹{record.earnestMoneyAmount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-3 border">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                record.paymentstatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : record.paymentstatus === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : record.paymentstatus === "refunded"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {record.paymentstatus.charAt(0).toUpperCase() +
                                record.paymentstatus.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 border">
                            <div className="text-sm">
                              {record.paymentMethod || "Not specified"}
                              {record.chequeNumber && (
                                <div className="text-xs text-gray-500">
                                  Cheque: {record.chequeNumber}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 border text-sm">
                            {record.paymentDate
                              ? new Date(
                                  record.paymentDate
                                ).toLocaleDateString()
                              : "Not paid yet"}
                          </td>
                          <td className="px-4 py-3 border text-sm text-gray-600">
                            <div>
                              <div>
                                {formatDistanceToNow(
                                  new Date(record.createdAt),
                                  { addSuffix: true }
                                )}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(
                                  record.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {earnestMoneyResult.success &&
                earnestMoneyData?.earnestMoneyRecords &&
                earnestMoneyData.earnestMoneyRecords.length > 0 && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      Showing {earnestMoneyData.earnestMoneyRecords.length}{" "}
                      earnest money records
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
