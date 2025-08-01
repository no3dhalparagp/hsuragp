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
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { villagenameOption } from "@/constants";

export default function GrievancePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Grievance Portal
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your voice matters - Submit complaints and track resolutions
            transparently
          </p>
        </div>
      </section>

      {/* Grievance Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">156</div>
              <div className="text-gray-600">Total Grievances (2024)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">142</div>
              <div className="text-gray-600">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">8</div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">6</div>
              <div className="text-gray-600">Average Days to Resolve</div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Grievance Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Submit a Grievance
              </h2>
              <p className="text-xl text-gray-600">
                Report issues, complaints, or suggestions for better governance
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                  Grievance Submission Form
                </CardTitle>
                <CardDescription>
                  Please provide detailed information about your grievance for
                  faster resolution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" placeholder="Enter your phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village">Village/Area *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your village" />
                      </SelectTrigger>
                      <SelectContent>
                        {villagenameOption.map((village) => (
                          <SelectItem key={village.value} value={village.value}>
                            {village.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Grievance Category *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grievance category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water-supply">Water Supply</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="roads">
                        Roads & Infrastructure
                      </SelectItem>
                      <SelectItem value="waste-management">
                        Waste Management
                      </SelectItem>
                      <SelectItem value="healthcare">
                        Healthcare Services
                      </SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="welfare-schemes">
                        Welfare Schemes
                      </SelectItem>
                      <SelectItem value="corruption">
                        Corruption/Misconduct
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief subject of your grievance"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed description of your grievance including location, dates, and any relevant information"
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Important Information:
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• All fields marked with * are mandatory</li>
                    <li>
                      • You will receive a unique grievance ID for tracking
                    </li>
                    <li>
                      • SMS/Email updates will be sent on your registered
                      contact
                    </li>
                    <li>
                      • Anonymous complaints are also accepted but tracking may
                      be limited
                    </li>
                    <li>
                      • False or malicious complaints may lead to legal action
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1">Submit Grievance</Button>
                  <Button variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Track Grievance */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Track Your Grievance
              </h2>
              <p className="text-xl text-gray-600">
                Enter your grievance ID to check the current status
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="grievance-id">Grievance ID</Label>
                    <Input
                      id="grievance-id"
                      placeholder="Enter your grievance ID (e.g., GRV2025001)"
                    />
                  </div>
                  <Button className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Track Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Grievances */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Recent Grievance Updates
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Water Supply Disruption - Madhyapara
                    </CardTitle>
                    <CardDescription>
                      Grievance ID: GRV2025012 | Submitted: Jan 20, 2025
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Resolved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm">
                    <strong>Issue:</strong> Water supply has been disrupted for
                    3 days in Madhyapara village affecting 45 households.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Resolution:</strong> Pipeline repair completed on
                    Jan 22, 2025. Water supply restored to all affected
                    households. Preventive maintenance scheduled monthly to
                    avoid future disruptions.
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-1 h-4 w-4" />
                    Resolved in 2 days
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Street Light Not Working - Dhalpara Main Road
                    </CardTitle>
                    <CardDescription>
                      Grievance ID: GRV2025011 | Submitted: Jan 18, 2025
                    </CardDescription>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    <Clock className="mr-1 h-3 w-3" />
                    In Progress
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm">
                    <strong>Issue:</strong> 5 street lights on Dhalpara main
                    road are not working, causing safety concerns for evening
                    commuters.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Current Status:</strong> Electrical team has
                    inspected the issue. Replacement LED bulbs ordered. Work
                    scheduled for Jan 25, 2025.
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-1 h-4 w-4" />
                    Expected resolution: Jan 25, 2025
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Delay in PMAY Application Processing
                    </CardTitle>
                    <CardDescription>
                      Grievance ID: GRV2025010 | Submitted: Jan 15, 2025
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Resolved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm">
                    <strong>Issue:</strong> PMAY application submitted 6 months
                    ago but no response received. Applicant seeking status
                    update.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Resolution:</strong> Application was pending due to
                    incomplete documentation. Missing income certificate
                    requirement communicated to applicant. Application now
                    processed and approved.
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-1 h-4 w-4" />
                    Resolved in 3 days
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Waste Collection Not Regular - Uttar Para
                    </CardTitle>
                    <CardDescription>
                      Grievance ID: GRV2025009 | Submitted: Jan 12, 2025
                    </CardDescription>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Under Review
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm">
                    <strong>Issue:</strong> Waste collection vehicle not
                    visiting Uttar Para regularly. Garbage accumulating on
                    streets.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Current Status:</strong> Waste management contractor
                    contacted. Route optimization being discussed. Temporary
                    additional collection arranged.
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-1 h-4 w-4" />
                    Under review since 8 days
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Grievance Process */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Grievance Resolution Process
          </h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Submit</h3>
                <p className="text-gray-600 text-sm">
                  Submit your grievance online or visit the office. Receive
                  unique tracking ID.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Review</h3>
                <p className="text-gray-600 text-sm">
                  Grievance reviewed within 24 hours. Assigned to relevant
                  department for action.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Action</h3>
                <p className="text-gray-600 text-sm">
                  Concerned department takes necessary action. Regular updates
                  sent to complainant.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Resolution</h3>
                <p className="text-gray-600 text-sm">
                  Issue resolved and status updated. Feedback collected for
                  service improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Alternative Ways to Submit Grievances
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Can&apos;t access online portal? Use these alternative methods to
            submit your grievance
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-red-100">Call our grievance helpline</p>
              <p className="font-semibold">+91 98765 43210</p>
              <p className="text-sm text-red-200">Mon-Fri: 9 AM - 5 PM</p>
            </div>
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-red-100">Send detailed grievance via email</p>
              <p className="font-semibold">grievance@dhalparagp.in</p>
              <p className="text-sm text-red-200">Response within 24 hours</p>
            </div>
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">In Person</h3>
              <p className="text-red-100">Visit our office directly</p>
              <p className="font-semibold">Panchayat Office</p>
              <p className="text-sm text-red-200">Mon-Sat: 10 AM - 4 PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
