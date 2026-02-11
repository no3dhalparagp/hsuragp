import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee, PieChart, BarChart3, FileText } from "lucide-react";
import { getExpenditureReport } from "@/action/reports-actions";
import { formatDistanceToNow } from "date-fns";
import {
  getCurrentFinancialYear,
  getFinancialYearDateRange,
} from "@/utils/financialYear";
import { FinancialYearSelector } from "../_components/financial-year-selector";
import { gpcode } from "@/constants/gpinfor";
export default async function AdminExpenditureReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolved = await searchParams;
  const financialYear =
    (resolved?.financialYear as string) || getCurrentFinancialYear();
  const { financialYearStart, financialYearEnd } =
    getFinancialYearDateRange(financialYear);

  const expenditureResult = await getExpenditureReport(
    financialYearStart,
    financialYearEnd
  );
  const expenditureData = expenditureResult.success
    ? expenditureResult.data
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Admin Expenditure Report Header */}
      <section className="bg-gradient-to-r from-red-700 to-yellow-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Admin: Expenditure Report
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Internal review of financial outflows and expenditure tracking for
            the fiscal year
          </p>
        </div>
      </section>

      {/* Expenditure Overview */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-end mb-4">
            <FinancialYearSelector />
          </div>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Expenditure Overview
            </h2>
            <p className="text-lg text-gray-600">
              Total Expenditure: ₹
              {expenditureData?.summary?.totalExpenditure?.toLocaleString() ||
                "0"}
            </p>
          </div>

          {expenditureData?.summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 mb-1">
                  ₹
                  {(expenditureData.summary.totalExpenditure / 100000).toFixed(
                    1
                  )}
                  L
                </div>
                <div className="text-gray-700">Total Expenditure</div>
                <div className="text-xs text-gray-500">100% of total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  ₹
                  {(expenditureData.summary.totalIncomeTax / 100000).toFixed(1)}
                  L
                </div>
                <div className="text-gray-700">Income Tax</div>
                <div className="text-xs text-gray-500">
                  {expenditureData.summary.totalExpenditure > 0
                    ? Math.round(
                        (expenditureData.summary.totalIncomeTax /
                          expenditureData.summary.totalExpenditure) *
                          100
                      )
                    : 0}
                  % of total
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700 mb-1">
                  ₹
                  {(
                    expenditureData.summary.totalLabourWelfareCess / 100000
                  ).toFixed(1)}
                  L
                </div>
                <div className="text-gray-700">Labour Welfare Cess</div>
                <div className="text-xs text-gray-500">
                  {expenditureData.summary.totalExpenditure > 0
                    ? Math.round(
                        (expenditureData.summary.totalLabourWelfareCess /
                          expenditureData.summary.totalExpenditure) *
                          100
                      )
                    : 0}
                  % of total
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-700 mb-1">
                  ₹
                  {(expenditureData.summary.netExpenditure / 100000).toFixed(1)}
                  L
                </div>
                <div className="text-gray-700">Net Expenditure</div>
                <div className="text-xs text-gray-500">After deductions</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tabs for Admin Expenditure Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="deductions">Deductions</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="details">Payment Details</TabsTrigger>
            </TabsList>

            {/* Summary */}
            <TabsContent value="summary" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Expenditure Summary
                </h2>
                <p className="text-lg text-gray-600">
                  Breakdown of expenditure for internal review
                </p>
              </div>

              {expenditureData?.summary ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PieChart className="mr-2 h-5 w-5 text-green-700" />
                        Total Expenditure - ₹
                        {expenditureData.summary.totalExpenditure.toLocaleString()}
                      </CardTitle>
                      <CardDescription>
                        Gross bill amount before deductions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Gross Amount</span>
                          <span className="font-semibold">
                            ₹
                            {expenditureData.summary.totalExpenditure.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5 text-blue-700" />
                        Net Expenditure - ₹
                        {expenditureData.summary.netExpenditure.toLocaleString()}
                      </CardTitle>
                      <CardDescription>After all deductions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Net Amount</span>
                          <span className="font-semibold">
                            ₹
                            {expenditureData.summary.netExpenditure.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={
                            expenditureData.summary.totalExpenditure > 0
                              ? (expenditureData.summary.netExpenditure /
                                  expenditureData.summary.totalExpenditure) *
                                100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-purple-700" />
                        Security Deposit - ₹
                        {expenditureData.summary.totalSecurityDeposit.toLocaleString()}
                      </CardTitle>
                      <CardDescription>
                        Total security deposits collected
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Security Amount</span>
                          <span className="font-semibold">
                            ₹
                            {expenditureData.summary.totalSecurityDeposit.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={
                            expenditureData.summary.totalExpenditure > 0
                              ? (expenditureData.summary.totalSecurityDeposit /
                                  expenditureData.summary.totalExpenditure) *
                                100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <IndianRupee className="mr-2 h-5 w-5 text-orange-700" />
                        Total Deductions - ₹
                        {(
                          expenditureData.summary.totalExpenditure -
                          expenditureData.summary.netExpenditure
                        ).toLocaleString()}
                      </CardTitle>
                      <CardDescription>
                        All tax and cess deductions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Deductions</span>
                          <span className="font-semibold">
                            ₹
                            {(
                              expenditureData.summary.totalExpenditure -
                              expenditureData.summary.netExpenditure
                            ).toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={
                            expenditureData.summary.totalExpenditure > 0
                              ? ((expenditureData.summary.totalExpenditure -
                                  expenditureData.summary.netExpenditure) /
                                  expenditureData.summary.totalExpenditure) *
                                100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No expenditure data available</p>
                </div>
              )}
            </TabsContent>

            {/* Deductions */}
            <TabsContent value="deductions" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Deductions Breakdown
                </h2>
                <p className="text-lg text-gray-600">
                  Detailed breakdown of all deductions
                </p>
              </div>

              {expenditureData?.summary ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tax Deductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium">Income Tax</span>
                          <span className="text-2xl font-bold text-blue-700">
                            ₹
                            {expenditureData.summary.totalIncomeTax.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="font-medium">TDS CGST</span>
                          <span className="text-2xl font-bold text-green-700">
                            ₹
                            {expenditureData.summary.totalTdsCgst.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="font-medium">TDS SGST</span>
                          <span className="text-2xl font-bold text-purple-700">
                            ₹
                            {expenditureData.summary.totalTdsSgst.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Other Deductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                          <span className="font-medium">
                            Labour Welfare Cess
                          </span>
                          <span className="text-2xl font-bold text-orange-700">
                            ₹
                            {expenditureData.summary.totalLabourWelfareCess.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                          <span className="font-medium">Security Deposit</span>
                          <span className="text-2xl font-bold text-indigo-700">
                            ₹
                            {expenditureData.summary.totalSecurityDeposit.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                          <span className="font-medium">Total Deductions</span>
                          <span className="text-2xl font-bold text-teal-700">
                            ₹
                            {(
                              expenditureData.summary.totalExpenditure -
                              expenditureData.summary.netExpenditure
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No deductions data available</p>
                </div>
              )}
            </TabsContent>

            {/* Monthly */}
            <TabsContent value="monthly" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Monthly Expenditure Trends
                </h2>
                <p className="text-lg text-gray-600">
                  Monthly breakdown of expenditure
                </p>
              </div>

              {expenditureData?.monthlyData &&
              expenditureData.monthlyData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {expenditureData.monthlyData.map((month, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{month.month}</CardTitle>
                        <CardDescription>
                          {month.count} payments
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Total Amount</span>
                            <span className="font-semibold">
                              ₹{month.total.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={
                              expenditureData.summary.totalExpenditure > 0
                                ? (month.total /
                                    expenditureData.summary.totalExpenditure) *
                                  100
                                : 0
                            }
                            className="h-2"
                          />
                          <div className="text-xs text-gray-500">
                            Average: ₹
                            {(month.total / month.count).toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No monthly data available</p>
                </div>
              )}
            </TabsContent>

            {/* Payment Details */}
            <TabsContent value="details" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Payment Details
                </h2>
                <p className="text-lg text-gray-600">
                  Detailed view of all payment transactions
                </p>
              </div>

              {expenditureData?.paymentDetails &&
              expenditureData.paymentDetails.length > 0 ? (
                <div className="space-y-6">
                  {expenditureData.paymentDetails.map((payment, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Payment #{index + 1}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(
                              payment.billPaymentDate
                            ).toLocaleDateString()}
                          </span>
                        </CardTitle>
                        <CardDescription>
                          {payment.WorksDetail?.ApprovedActionPlanDetails
                            ?.activityName || "Work Details"}
                          {/* nitdetails */}
                          <p>Nit Details</p>
                          {payment.WorksDetail?.nitDetails.memoNumber || 0}/$
                          {gpcode}/
                          {payment.WorksDetail?.nitDetails.memoDate.getFullYear()}{" "}
                          sl no {payment.WorksDetail?.workslno}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-700">
                              ₹ {payment.grossBillAmount.toLocaleString()}
                            </div>
                            <div className="text-sm text-blue-600">
                              Gross Amount
                            </div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-700">
                              ₹ {payment.netAmt.toLocaleString()}
                            </div>
                            <div className="text-sm text-green-600">
                              Net Amount
                            </div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-700">
                              {payment.billType}
                            </div>
                            <div className="text-sm text-purple-600">
                              Bill Type
                            </div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-lg font-bold text-orange-700">
                              {payment.eGramVoucher}
                            </div>
                            <div className="text-sm text-orange-600">
                              eGram Voucher
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                          <div>
                            <strong>GPMS Voucher:</strong>{" "}
                            {payment.gpmsVoucherNumber}
                          </div>
                          <div>
                            <strong>MB Ref No:</strong> {payment.mbrefno}
                          </div>
                          {payment.isfinalbill && (
                            <div className="text-green-600 font-medium">
                              Final Bill
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No payment details available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
