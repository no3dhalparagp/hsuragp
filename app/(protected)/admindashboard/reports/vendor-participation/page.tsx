import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVendorParticipationReport } from "@/action/reports-actions";
import {
  getCurrentFinancialYear,
  getFinancialYearDateRange,
} from "@/utils/financialYear";
import { FinancialYearSelector } from "../_components/financial-year-selector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default async function VendorParticipationReportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolved = await searchParams;
  const financialYear =
    (resolved?.financialYear as string) || getCurrentFinancialYear();
  const { financialYearStart, financialYearEnd } =
    getFinancialYearDateRange(financialYear);

  // Note: getVendorParticipationReport does not currently support date filtering.
  const vendorResult = await getVendorParticipationReport();
  const vendorData = vendorResult.success ? vendorResult.data : null;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Admin: Vendor Participation Report
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Monitor vendor participation, performance, and contract awards.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 space-y-8">
          <div className="flex justify-end mb-4">
            <FinancialYearSelector />
          </div>
          {/* Summary Statistics */}
          {vendorData?.summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-700">
                    {vendorData.summary.totalVendors}
                  </div>
                  <div className="text-sm text-blue-600">Total Vendors</div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {vendorData.summary.activeVendors}
                  </div>
                  <div className="text-sm text-green-600">Active Vendors</div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-700">
                    {vendorData.summary.qualifiedVendors}
                  </div>
                  <div className="text-sm text-purple-600">
                    Qualified Vendors
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-700">
                    {vendorData.summary.participationRate}%
                  </div>
                  <div className="text-sm text-orange-600">
                    Participation Rate
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Vendor Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Vendor Performance Overview</span>
                <span className="text-sm text-gray-500">
                  {vendorData?.vendorPerformance?.length || 0} vendors
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!vendorResult.success ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">
                    Error: {vendorResult.error}
                  </p>
                  <p className="text-gray-500">
                    Unable to load vendor participation data. Please try again
                    later.
                  </p>
                </div>
              ) : !vendorData?.vendorPerformance ||
                vendorData.vendorPerformance.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No vendor data found. Vendor information will appear here
                    once vendors are registered.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="font-semibold text-gray-700">
                          Vendor Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">
                          Total Bids
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">
                          Contracts Won
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">
                          Earnest Money
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">
                          Qualification Status
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">
                          Contact Info
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendorData.vendorPerformance.map((vendor, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {vendor.vendorName}
                          </TableCell>
                          <TableCell className="text-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="link"
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  {vendor.totalBids}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold">
                                    Bid Details - {vendor.vendorName}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                  <p className="text-gray-600 mb-4">
                                    Total bids submitted: {vendor.totalBids}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Detailed bid information will be displayed
                                    here.
                                  </p>
                                </div>
                                <DialogFooter className="mt-4">
                                  <Button variant="outline">Close</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell className="text-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="link"
                                  className="text-green-600 hover:text-green-800"
                                >
                                  {vendor.totalContracts}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold">
                                    Contract Details - {vendor.vendorName}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                  <p className="text-gray-600 mb-4">
                                    Total contracts awarded:{" "}
                                    {vendor.totalContracts}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Detailed contract information will be
                                    displayed here.
                                  </p>
                                </div>
                                <DialogFooter className="mt-4">
                                  <Button variant="outline">Close</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-medium">
                              ₹{vendor.totalEarnestMoney.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                vendor.isQualified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {vendor.isQualified
                                ? "Qualified"
                                : "Not Qualified"}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="text-sm">
                              <div>
                                {vendor.contactInfo.mobile || "No mobile"}
                              </div>
                              <div className="text-gray-500">
                                {vendor.contactInfo.email || "No email"}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {vendorResult.success &&
                vendorData?.vendorPerformance &&
                vendorData.vendorPerformance.length > 0 && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      Showing {vendorData.vendorPerformance.length} vendors
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Participation Trends */}
          {vendorData?.participationTrends &&
            Object.keys(vendorData.participationTrends).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Participation Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(vendorData.participationTrends).map(
                      ([bidCount, vendorCount]) => (
                        <div
                          key={bidCount}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="text-2xl font-bold text-blue-700">
                            {vendorCount}
                          </div>
                          <div className="text-sm text-gray-600">
                            Vendors with {bidCount} bid
                            {parseInt(bidCount) > 1 ? "s" : ""}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </section>
    </div>
  );
}
