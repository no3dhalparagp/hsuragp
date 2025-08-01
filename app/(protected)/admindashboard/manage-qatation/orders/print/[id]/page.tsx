import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, PrinterIcon as Print } from "lucide-react";
import { PrintButton } from "../PrintButton";

interface PageProps {
  params: { id: string };
}

export default async function PrintOrderPage({ params }: PageProps) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      agencyDetails: true,
      items: true,
      quotation: true,
    },
  });

  if (!order) {
    return (
      <div className="min-h-screen bg-muted/40 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <Button asChild>
              <Link href="/admindashboard/manage-qatation/orders">
                Back to Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Helper to safely access supplier fields (Bidder model)
  const supplier = order.agencyDetails || {};

  // Helper to safely access gram panchayat fields

  return (
    <div className="min-h-screen bg-white">
      {/* Print Controls - Hidden in print */}
      <div className="print:hidden bg-muted/40 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <PrintButton />
          </div>
        </div>
      </div>

      {/* Printable Area */}
      <div className="print-area">
        <div className="container mx-auto px-8 py-8">
          <Card className="shadow-none border-none">
            <CardContent className="p-0">
              {/* Header */}
              <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">GP</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      No 3 Dhalpara Grm Panchayat
                    </h1>
                    <p className="text-gray-600 text-sm">
                      Vill Kismatdapat, Po Trimohini, Hili, Dakshin Dinajpur,
                      West Bengal, 733126
                    </p>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-blue-700 mb-2">
                  WORK ORDER
                </h2>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-left">
                    <p className="text-gray-700">
                      <span className="font-semibold">Work Order No:</span>{" "}
                      {order.orderNo}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Date:</span>{" "}
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-700">
                      <span className="font-semibold">Quotation Ref:</span>{" "}
                      {order.quotation.nitNo}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Completion Date:</span>{" "}
                      10/03/2025
                    </p>
                  </div>
                </div>
              </div>
              {/* Supplier Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-3 text-blue-600">
                    CONTRACTOR DETAILS:
                  </h3>
                  <div className="border border-gray-300 p-4 rounded">
                    <p className="font-semibold text-lg">{supplier.name}</p>

                    <p className="text-sm mt-2">{supplier.contactDetails}</p>
                    <div className="mt-2 text-xs">
                      <p>GST No: {supplier.gst}</p>
                      <p>PAN No: {supplier.pan}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3 text-green-600">
                    SITE ADDRESS:
                  </h3>
                  <div className="border border-gray-300 p-4 rounded">
                    <p className="font-semibold">Mulahat</p>
                  </div>
                </div>
              </div>
              {/* Work Description */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 text-purple-600">
                  WORK DESCRIPTION:
                </h3>
                <div className="border border-gray-300 p-4 rounded bg-gray-50">
                  <p className="font-semibold text-lg">
                    {order.quotation.workName}
                  </p>
                  <p className="text-sm mt-2">{order.quotation.description}</p>
                </div>
              </div>
              {/* Order Items Table */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-3 text-red-600">
                  WORK DETAILS:
                </h3>
                <table className="w-full border-collapse border border-gray-400">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 p-2 text-left w-12">
                        S.No.
                      </th>
                      <th className="border border-gray-400 p-2 text-left">
                        Item Description & Specifications
                      </th>
                      <th className="border border-gray-400 p-2 text-center w-20">
                        Qty
                      </th>
                      <th className="border border-gray-400 p-2 text-center w-16">
                        Unit
                      </th>
                      <th className="border border-gray-400 p-2 text-right w-24">
                        Rate (₹)
                      </th>
                      <th className="border border-gray-400 p-2 text-right w-28">
                        Amount (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="border border-gray-400 p-2 text-center">
                          {idx + 1}
                        </td>
                        <td className="border border-gray-400 p-2">
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {item.specifications}
                          </div>
                        </td>
                        <td className="border border-gray-400 p-2 text-center">
                          {item.quantity}
                        </td>
                        <td className="border border-gray-400 p-2 text-center">
                          Work
                        </td>
                        <td className="border border-gray-400 p-2 text-right">
                          {Number(item.rate).toLocaleString()}
                        </td>
                        <td className="border border-gray-400 p-2 text-right font-semibold">
                          {Number(item.amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-yellow-50">
                      <td
                        colSpan={5}
                        className="border border-gray-400 p-2 text-right font-bold"
                      >
                        TOTAL ORDER AMOUNT:
                      </td>
                      <td className="border border-gray-400 p-2 text-right font-bold text-lg">
                        ₹ {Number(order.orderAmount).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-green-50">
                      <td
                        colSpan={5}
                        className="border border-gray-400 p-2 text-right text-sm"
                      >
                        Estimated Amount: ₹{" "}
                        {Number(
                          order.quotation.estimatedAmount
                        ).toLocaleString()}
                      </td>
                      <td className="border border-gray-400 p-2 text-right text-sm font-semibold text-green-600">
                        Savings: ₹ {Number(order.savings).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Terms and Conditions */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-3 text-orange-600">
                  TERMS AND CONDITIONS:
                </h3>
                <div className="border border-gray-300 p-4 rounded">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      <strong>Payment Terms:</strong> {order.paymentTerms}
                    </li>
                    <li>
                      <strong>Completion:</strong> All works must be completed
                      at the specified site within the agreed timeline. .
                    </li>
                    <li>
                      <strong>Quality:</strong> All works must conform to the
                      specifications mentioned in the quotation and this order.
                    </li>
                    <li>
                      <strong>Installation:</strong> Contractor is responsible
                      for proper installation and commissioning where
                      applicable.
                    </li>
                    <li>
                      <strong>Warranty:</strong> Minimum warranty period as per
                      quotation terms from the date of completion/installation.
                    </li>
                    <li>
                      <strong>Penalties:</strong> Delay in completion may
                      attract penalty as per government norms.
                    </li>
                    <li>
                      <strong>Acceptance:</strong> All works are subject to
                      inspection and acceptance by the purchaser.
                    </li>
                    <li>
                      <strong>Taxes:</strong> All applicable taxes, duties, and
                      charges are included in the quoted rates.
                    </li>
                  </ol>
                  {order.specialInstructions && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="font-semibold text-sm">
                        Special Instructions:
                      </p>
                      <p className="text-sm">{order.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Footer with Signatures */}
              <div className="mt-12 pt-8 border-t-2 border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm mb-8">For {supplier.name}:</p>
                    <div className="border-t border-gray-400 pt-2 w-48">
                      <p className="text-sm font-semibold">
                        Authorized Signatory
                      </p>
                      <p className="text-xs">Name & Designation</p>
                      <p className="text-xs">Date: ___________</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="border-t border-gray-400 pt-2 w-48 ml-auto">
                      <p className="text-sm font-semibold">
                        signature of Prodhan
                      </p>
                      <p className="text-xs">No 3 Dhalpara Grm Panchayat</p>
                      <p className="text-xs">
                        Date:{" "}
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
