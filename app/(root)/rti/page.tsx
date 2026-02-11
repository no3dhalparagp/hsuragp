import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Clock,
  IndianRupee,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function RTIPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Right to Information (RTI)
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Empowering citizens with transparent access to government
            information and public records
          </p>
        </div>
      </section>

      {/* RTI Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">89</div>
              <div className="text-gray-600">RTI Applications (2024)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">82</div>
              <div className="text-gray-600">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">12</div>
              <div className="text-gray-600">Average Days</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">92%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="apply">Apply RTI</TabsTrigger>
              <TabsTrigger value="proactive">Proactive Disclosure</TabsTrigger>
              <TabsTrigger value="officers">RTI Officers</TabsTrigger>
              <TabsTrigger value="status">Track Status</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  About RTI Act 2005
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  The Right to Information Act empowers every citizen to seek
                  information from public authorities
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-600" />
                      What is RTI?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">
                      The Right to Information (RTI) Act 2005 is a landmark
                      legislation that provides citizens the right to access
                      information held by public authorities. It promotes
                      transparency and accountability in government functioning.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Key Objectives:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Promote transparency in government operations</li>
                        <li>
                          • Enable citizen participation in democratic process
                        </li>
                        <li>• Reduce corruption through accountability</li>
                        <li>• Ensure efficient delivery of public services</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-green-600" />
                      Who Can Apply?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">
                      Any citizen of India can file an RTI application to seek
                      information from public authorities. No specific reason or
                      justification is required for seeking information.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Eligibility:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Any Indian citizen</li>
                        <li>• No age restriction</li>
                        <li>• No educational qualification required</li>
                        <li>
                          • Can be filed by representative with authorization
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <IndianRupee className="mr-2 h-5 w-5 text-purple-600" />
                      Fees Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Application Fee:</span>
                        <span className="font-semibold">₹10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Additional Information (per page):</span>
                        <span className="font-semibold">₹2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Inspection of Records (per hour):</span>
                        <span className="font-semibold">₹5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Certified Copies (per page):</span>
                        <span className="font-semibold">₹2</span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Note:</strong> BPL cardholders are exempted from
                        paying fees
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-orange-600" />
                      Time Limits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Normal Cases:</span>
                        <span className="font-semibold">30 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Life & Liberty Cases:</span>
                        <span className="font-semibold">48 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Third Party Information:</span>
                        <span className="font-semibold">40 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>First Appeal:</span>
                        <span className="font-semibold">30 days</span>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <strong>Penalty:</strong> ₹250 per day for delay beyond
                        prescribed time limit
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Information That Can Be Sought</CardTitle>
                  <CardDescription>
                    Types of information available under RTI Act
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">
                        Available Information:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Budget and expenditure details</li>
                        <li>• Development project information</li>
                        <li>• Tender and contract documents</li>
                        <li>• Meeting minutes and resolutions</li>
                        <li>• Beneficiary lists of schemes</li>
                        <li>• Staff details and organizational structure</li>
                        <li>• Audit reports and financial statements</li>
                        <li>• Policy documents and guidelines</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-red-600">
                        Exempted Information:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Information affecting national security</li>
                        <li>• Personal information of individuals</li>
                        <li>• Information received in confidence</li>
                        <li>• Cabinet papers and deliberations</li>
                        <li>• Information that may harm investigation</li>
                        <li>• Trade secrets and commercial confidence</li>
                        <li>• Information prohibited by court</li>
                        <li>
                          • Information affecting relations with foreign states
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Apply RTI */}
            <TabsContent value="apply" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Submit RTI Application
                </h2>
                <p className="text-xl text-gray-600">
                  File your RTI application online or download the form
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>RTI Application Form</CardTitle>
                    <CardDescription>
                      Fill out the form below to submit your RTI application
                      online
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="applicant-name">Full Name *</Label>
                        <Input
                          id="applicant-name"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="father-name">
                          Father&apos;s/Husband&apos;s Name
                        </Label>
                        <Input
                          id="father-name"
                          placeholder="Enter father's/husband's name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Complete Address *</Label>
                        <Textarea
                          id="address"
                          placeholder="Enter your complete address"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact">Contact Details *</Label>
                        <Input
                          id="contact"
                          placeholder="Phone number and email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="information-sought">
                        Information Sought *
                      </Label>
                      <Textarea
                        id="information-sought"
                        placeholder="Clearly specify the information you are seeking. Be specific about documents, time period, etc."
                        rows={5}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="period">Time Period</Label>
                        <Input
                          id="period"
                          placeholder="e.g., April 2023 to March 2024"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferred-format">
                          Preferred Format
                        </Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hard-copy">Hard Copy</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="inspection">
                              Inspection
                            </SelectItem>
                            <SelectItem value="certified-copy">
                              Certified Copy
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bpl-status">BPL Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select BPL status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">
                            Yes (Fee Exempted)
                          </SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Important Guidelines:
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Be specific about the information you seek</li>
                        <li>• Mention the time period clearly</li>
                        <li>
                          • Attach BPL certificate if claiming fee exemption
                        </li>
                        <li>• Keep a copy of your application for reference</li>
                        <li>
                          • You will receive an acknowledgment with application
                          number
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-4">
                      <Button className="flex-1">Submit Application</Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download Form
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Proactive Disclosure */}
            <TabsContent value="proactive" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Proactive Disclosure
                </h2>
                <p className="text-xl text-gray-600">
                  Information made available proactively under Section 4 of RTI
                  Act
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Organizational Structure
                    </CardTitle>
                    <CardDescription>
                      Details of organization and functions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Organizational chart</li>
                      <li>• Functions and duties</li>
                      <li>• Powers and responsibilities</li>
                      <li>• Staff directory</li>
                    </ul>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Budget & Expenditure
                    </CardTitle>
                    <CardDescription>
                      Financial information and budget details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Annual budget allocation</li>
                      <li>• Expenditure statements</li>
                      <li>• Audit reports</li>
                      <li>• Financial guidelines</li>
                    </ul>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Policies & Guidelines
                    </CardTitle>
                    <CardDescription>
                      Rules, regulations and policy documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Government orders</li>
                      <li>• Policy circulars</li>
                      <li>• Implementation guidelines</li>
                      <li>• Standard operating procedures</li>
                    </ul>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Tenders & Contracts
                    </CardTitle>
                    <CardDescription>
                      Procurement and contract information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Tender notices</li>
                      <li>• Contract awards</li>
                      <li>• Vendor details</li>
                      <li>• Work completion reports</li>
                    </ul>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Scheme Information
                    </CardTitle>
                    <CardDescription>
                      Welfare schemes and beneficiary details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Scheme guidelines</li>
                      <li>• Beneficiary lists</li>
                      <li>• Selection criteria</li>
                      <li>• Implementation status</li>
                    </ul>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Meeting Records</CardTitle>
                    <CardDescription>
                      Minutes and resolutions of meetings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Gram Sabha minutes</li>
                      <li>• Committee meeting records</li>
                      <li>• Resolutions passed</li>
                      <li>• Action taken reports</li>
                    </ul>
                    <Button size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* RTI Officers */}
            <TabsContent value="officers" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  RTI Officers
                </h2>
                <p className="text-xl text-gray-600">
                  Contact details of designated RTI officers
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-blue-600" />
                      Public Information Officer (PIO)
                    </CardTitle>
                    <CardDescription>
                      Primary contact for RTI applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Sri Amit Chakraborty</h4>
                        <p className="text-sm text-gray-600">
                          Secretary, Dhalpara Gram Panchayat
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Office:</span>
                          <span>Panchayat Office, Dhalpara</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span>+91 98765 43210</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span>pio@dhalparagp.in</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Office Hours:</span>
                          <span>10 AM - 5 PM (Mon-Fri)</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Responsibilities:
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Receive and process RTI applications</li>
                        <li>• Provide information within stipulated time</li>
                        <li>
                          • Transfer applications to concerned departments
                        </li>
                        <li>• Maintain RTI application records</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-green-600" />
                      First Appellate Authority
                    </CardTitle>
                    <CardDescription>
                      For appeals against PIO decisions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Smt. Rashida Begum</h4>
                        <p className="text-sm text-gray-600">
                          Prodhan, Dhalpara Gram Panchayat
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Office:</span>
                          <span>Panchayat Office, Dhalpara</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span>+91 98765 43211</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span>prodhan@dhalparagp.in</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Office Hours:</span>
                          <span>11 AM - 4 PM (Mon-Sat)</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Appeal Process:
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• File appeal within 30 days of PIO response</li>
                        <li>• Include copy of original application</li>
                        <li>• State reasons for dissatisfaction</li>
                        <li>• Decision within 30 days of appeal</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>State Information Commission</CardTitle>
                  <CardDescription>
                    Second appeal authority for RTI matters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">
                        West Bengal Information Commission
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Address:</span>
                          <p>Bidhan Bhavan, Salt Lake, Kolkata - 700091</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <p>033-2357-3345</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <p>wbic@wb.gov.in</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Website:</span>
                          <p>www.wbic.gov.in</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">
                        Second Appeal Guidelines:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• File within 90 days of first appeal decision</li>
                        <li>• Include all relevant documents</li>
                        <li>• Pay prescribed fees (₹25)</li>
                        <li>• Commission has power to impose penalties</li>
                        <li>• Final authority for RTI matters</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Track Status */}
            <TabsContent value="status" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Track RTI Application Status
                </h2>
                <p className="text-xl text-gray-600">
                  Check the current status of your RTI application
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="rti-number">
                          RTI Application Number
                        </Label>
                        <Input
                          id="rti-number"
                          placeholder="Enter your RTI application number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="applicant-mobile">
                          Registered Mobile Number
                        </Label>
                        <Input
                          id="applicant-mobile"
                          placeholder="Enter registered mobile number"
                        />
                      </div>
                      <Button className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        Check Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Recent RTI Applications Status
                </h3>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            RTI/2025/001
                          </CardTitle>
                          <CardDescription>
                            Budget allocation details for 2024-25
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Applied Date:</span>
                          <div className="font-semibold">January 5, 2025</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Response Date:</span>
                          <div className="font-semibold">January 18, 2025</div>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Processing Time:
                          </span>
                          <div className="font-semibold">13 days</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Information provided via email. Budget documents sent as
                        requested.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            RTI/2025/002
                          </CardTitle>
                          <CardDescription>
                            Tender details for road construction project
                          </CardDescription>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">
                          <Clock className="mr-1 h-3 w-3" />
                          In Progress
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Applied Date:</span>
                          <div className="font-semibold">January 15, 2025</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Due Date:</span>
                          <div className="font-semibold">February 14, 2025</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Days Remaining:</span>
                          <div className="font-semibold">20 days</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Application under review. Information being compiled
                        from multiple departments.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            RTI/2025/003
                          </CardTitle>
                          <CardDescription>
                            MGNREGA work allocation and payment details
                          </CardDescription>
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Applied Date:</span>
                          <div className="font-semibold">January 20, 2025</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Due Date:</span>
                          <div className="font-semibold">February 19, 2025</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Days Remaining:</span>
                          <div className="font-semibold">25 days</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Application received and acknowledged. Processing will
                        begin shortly.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help with RTI?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our RTI officers are available to assist you with applications and
            queries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Call PIO: +91 98765 43210
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              Email: pio@dhalparagp.in
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
