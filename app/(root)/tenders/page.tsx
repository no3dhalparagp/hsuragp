import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Clock, CheckCircle, Search } from "lucide-react"

export default function TendersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Tenders & Procurement</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Transparent procurement processes ensuring fair competition and value for money
          </p>
        </div>
      </section>

      {/* Tender Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24</div>
              <div className="text-gray-600">Active Tenders</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">156</div>
              <div className="text-gray-600">Completed (2024)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">₹2.1Cr</div>
              <div className="text-gray-600">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600">Transparency Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input placeholder="Search tenders by title, category, or tender number..." />
              </div>
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="active">Active Tenders</TabsTrigger>
              <TabsTrigger value="awarded">Awarded Contracts</TabsTrigger>
              <TabsTrigger value="completed">Completed Works</TabsTrigger>
              <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            </TabsList>

            {/* Active Tenders */}
            <TabsContent value="active" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Active Tenders</h2>
                <p className="text-xl text-gray-600">Current tender opportunities open for bidding</p>
              </div>

              <div className="space-y-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Construction of Community Hall</CardTitle>
                        <CardDescription>Tender No: DGP/2025/001 | Category: Civil Works</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <Clock className="mr-1 h-3 w-3" />
                        Open
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Estimated Cost:</span>
                        <div className="font-semibold text-lg">₹45,00,000</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">EMD Amount:</span>
                        <div className="font-semibold">₹90,000</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Submission Deadline:</span>
                        <div className="font-semibold">Feb 15, 2025</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Opening Date:</span>
                        <div className="font-semibold">Feb 16, 2025</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Work Description:</h4>
                        <p className="text-sm text-gray-600">
                          Construction of multi-purpose community hall with capacity of 200 persons including stage,
                          seating arrangement, sound system, and basic amenities. Work includes civil construction,
                          electrical fittings, and interior finishing.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Eligibility Criteria:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Registered contractor with Class-II license or above</li>
                          <li>• Minimum 3 years experience in similar works</li>
                          <li>• Annual turnover of ₹50 lakhs in last 3 years</li>
                          <li>• Valid PAN, GST registration, and labor license</li>
                        </ul>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download Tender
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Supply of Solar Street Lights</CardTitle>
                        <CardDescription>Tender No: DGP/2025/002 | Category: Electrical Works</CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        <Clock className="mr-1 h-3 w-3" />
                        Open
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Estimated Cost:</span>
                        <div className="font-semibold text-lg">₹8,50,000</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">EMD Amount:</span>
                        <div className="font-semibold">₹17,000</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Submission Deadline:</span>
                        <div className="font-semibold">Feb 20, 2025</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Opening Date:</span>
                        <div className="font-semibold">Feb 21, 2025</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Work Description:</h4>
                        <p className="text-sm text-gray-600">
                          Supply and installation of 50 nos. solar LED street lights (20W) with poles, batteries, and
                          complete accessories. Includes 3 years maintenance warranty and training for local staff.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download Tender
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Technical Specs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Road Repair and Maintenance</CardTitle>
                        <CardDescription>Tender No: DGP/2025/003 | Category: Road Works</CardDescription>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">
                        <Clock className="mr-1 h-3 w-3" />
                        Open
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Estimated Cost:</span>
                        <div className="font-semibold text-lg">₹15,00,000</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">EMD Amount:</span>
                        <div className="font-semibold">₹30,000</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Submission Deadline:</span>
                        <div className="font-semibold">Feb 25, 2025</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Opening Date:</span>
                        <div className="font-semibold">Feb 26, 2025</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Work Description:</h4>
                        <p className="text-sm text-gray-600">
                          Repair and maintenance of village roads including pothole filling, side drain cleaning, and
                          surface treatment for 5 km stretch covering Dhalpara to Madhyapara route.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download Tender
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Site Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Awarded Contracts */}
            <TabsContent value="awarded" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Awarded Contracts</h2>
                <p className="text-xl text-gray-600">Recently awarded contracts and ongoing works</p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Water Supply Pipeline Extension</CardTitle>
                        <CardDescription>Contract No: DGP/2024/045 | Awarded: Dec 15, 2024</CardDescription>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">
                        <Clock className="mr-1 h-3 w-3" />
                        In Progress
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Contract Value:</span>
                        <div className="font-semibold text-lg">₹32,50,000</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Contractor:</span>
                        <div className="font-semibold">ABC Construction Ltd.</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Start Date:</span>
                        <div className="font-semibold">Jan 5, 2025</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Completion:</span>
                        <div className="font-semibold">Aug 5, 2025</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Work Progress:</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                          </div>
                          <span className="text-sm font-semibold">35%</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Pipeline laying completed for 3.5 km out of 10 km total length. On schedule as per timeline.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          View Contract
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Progress Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">School Building Renovation</CardTitle>
                        <CardDescription>Contract No: DGP/2024/042 | Awarded: Nov 20, 2024</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Contract Value:</span>
                        <div className="font-semibold text-lg">₹18,75,000</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Contractor:</span>
                        <div className="font-semibold">XYZ Builders</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Completed:</span>
                        <div className="font-semibold">Jan 10, 2025</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Quality Rating:</span>
                        <div className="font-semibold">Excellent</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Work Completed:</h4>
                        <p className="text-sm text-gray-600">
                          Complete renovation of 2 primary schools including new classrooms, toilets, library, and
                          playground. Work completed 5 days ahead of schedule with excellent quality.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Completion Certificate
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Final Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Completed Works */}
            <TabsContent value="completed" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Completed Works</h2>
                <p className="text-xl text-gray-600">Successfully completed projects and their outcomes</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 p-3 text-left">Project Name</th>
                      <th className="border border-gray-200 p-3 text-left">Contractor</th>
                      <th className="border border-gray-200 p-3 text-right">Contract Value</th>
                      <th className="border border-gray-200 p-3 text-left">Completion Date</th>
                      <th className="border border-gray-200 p-3 text-left">Quality</th>
                      <th className="border border-gray-200 p-3 text-left">Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-3">Solar Street Light Installation</td>
                      <td className="border border-gray-200 p-3">Green Energy Solutions</td>
                      <td className="border border-gray-200 p-3 text-right">₹12,50,000</td>
                      <td className="border border-gray-200 p-3">Dec 20, 2024</td>
                      <td className="border border-gray-200 p-3">
                        <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3">Waste Management System</td>
                      <td className="border border-gray-200 p-3">Clean India Services</td>
                      <td className="border border-gray-200 p-3 text-right">₹8,75,000</td>
                      <td className="border border-gray-200 p-3">Nov 15, 2024</td>
                      <td className="border border-gray-200 p-3">
                        <Badge className="bg-green-100 text-green-800">Good</Badge>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3">Community Center Construction</td>
                      <td className="border border-gray-200 p-3">Modern Builders</td>
                      <td className="border border-gray-200 p-3 text-right">₹35,00,000</td>
                      <td className="border border-gray-200 p-3">Oct 30, 2024</td>
                      <td className="border border-gray-200 p-3">
                        <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3">Road Concrete Work</td>
                      <td className="border border-gray-200 p-3">Highway Construction Co.</td>
                      <td className="border border-gray-200 p-3 text-right">₹22,00,000</td>
                      <td className="border border-gray-200 p-3">Sep 25, 2024</td>
                      <td className="border border-gray-200 p-3">
                        <Badge className="bg-yellow-100 text-yellow-800">Satisfactory</Badge>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3">Water Tank Construction</td>
                      <td className="border border-gray-200 p-3">Aqua Infrastructure</td>
                      <td className="border border-gray-200 p-3 text-right">₹15,60,000</td>
                      <td className="border border-gray-200 p-3">Aug 18, 2024</td>
                      <td className="border border-gray-200 p-3">
                        <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                      </td>
                      <td className="border border-gray-200 p-3">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Guidelines */}
            <TabsContent value="guidelines" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tender Guidelines</h2>
                <p className="text-xl text-gray-600">Rules, procedures, and guidelines for tender participation</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Eligibility Criteria</CardTitle>
                    <CardDescription>General requirements for tender participation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-600">For Civil Works:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Valid contractor license (Class-I/II/III as applicable)</li>
                        <li>• Minimum 3 years experience in similar works</li>
                        <li>• Annual turnover as specified in tender</li>
                        <li>• Valid PAN, GST, and labor license</li>
                        <li>• No blacklisting in last 3 years</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-600">For Supply Works:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Authorized dealer/manufacturer certificate</li>
                        <li>• Quality certification (ISI/BIS as applicable)</li>
                        <li>• Minimum 2 years experience in supply</li>
                        <li>• Valid trade license and GST registration</li>
                        <li>• After-sales service capability</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Submission Process</CardTitle>
                    <CardDescription>Step-by-step tender submission procedure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-blue-600">
                          1
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm">Download Tender Documents</h5>
                          <p className="text-xs text-gray-600">Download from website or collect from office</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-blue-600">
                          2
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm">Prepare Documents</h5>
                          <p className="text-xs text-gray-600">Technical and financial proposals as per format</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-blue-600">
                          3
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm">Submit EMD</h5>
                          <p className="text-xs text-gray-600">Earnest Money Deposit via DD/Bank Guarantee</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-blue-600">
                          4
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm">Submit Sealed Bids</h5>
                          <p className="text-xs text-gray-600">Before deadline at designated office</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-blue-600">
                          5
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm">Attend Opening</h5>
                          <p className="text-xs text-gray-600">Public opening of technical bids</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Required Documents</CardTitle>
                    <CardDescription>Standard documents required for all tenders</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-purple-600">Mandatory Documents:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Tender application in prescribed format</li>
                        <li>• Copy of contractor/trade license</li>
                        <li>• PAN card and GST registration certificate</li>
                        <li>• Income tax returns for last 3 years</li>
                        <li>• Bank solvency certificate</li>
                        <li>• Experience certificates</li>
                        <li>• Earnest Money Deposit</li>
                        <li>• Non-blacklisting affidavit</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Incomplete applications or missing documents will lead to rejection
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Criteria</CardTitle>
                    <CardDescription>How tenders are evaluated and awarded</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-orange-600">Technical Evaluation (70%):</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Experience and past performance (25%)</li>
                        <li>• Technical capability and resources (20%)</li>
                        <li>• Quality of proposal and methodology (15%)</li>
                        <li>• Timeline and project management (10%)</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-600">Financial Evaluation (30%):</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Quoted price competitiveness (20%)</li>
                        <li>• Value for money proposition (10%)</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Selection:</strong> Lowest technically qualified bidder (L1) principle followed
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Important Guidelines</CardTitle>
                  <CardDescription>Key rules and regulations for tender process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">Prohibited Practices:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Collusion between bidders</li>
                        <li>• Submission of false information</li>
                        <li>• Bribery or corrupt practices</li>
                        <li>• Late submission of bids</li>
                        <li>• Unauthorized modifications to tender documents</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Best Practices:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Submit bids well before deadline</li>
                        <li>• Ensure all documents are properly signed</li>
                        <li>• Follow prescribed format strictly</li>
                        <li>• Attend pre-bid meetings if conducted</li>
                        <li>• Maintain transparency in all dealings</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Tender Queries & Support</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Need help with tender process or have questions? Contact our procurement team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Call: +91 98765 43210
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-purple-600"
            >
              Email: tenders@dhalparagp.in
            </Button>
          </div>
          <p className="text-purple-200 text-sm mt-4">Office Hours: Monday to Friday, 10:00 AM to 5:00 PM</p>
        </div>
      </section>
    </div>
  )
}
