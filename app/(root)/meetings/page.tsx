import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  FileText,
  Download,
  Clock,
  MapPin,
  CheckCircle,
} from "lucide-react";

export default function MeetingsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Gram Sabha Meetings
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Transparent governance through regular community meetings and public
            participation
          </p>
        </div>
      </section>

      {/* Meeting Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-gray-600">Meetings This Year</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600">Average Attendance</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                2,847
              </div>
              <div className="text-gray-600">Registered Voters</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">45</div>
              <div className="text-gray-600">Resolutions Passed</div>
            </div>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
              <TabsTrigger value="minutes">Meeting Minutes</TabsTrigger>
              <TabsTrigger value="resolutions">Resolutions</TabsTrigger>
            </TabsList>

            {/* Upcoming Meetings */}
            <TabsContent value="upcoming" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Upcoming Meetings
                </h2>
                <p className="text-xl text-gray-600">
                  Stay informed about scheduled Gram Sabha meetings
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        Monthly Gram Sabha Meeting
                      </CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">
                        <Calendar className="mr-1 h-3 w-3" />
                        Scheduled
                      </Badge>
                    </div>
                    <CardDescription>
                      Regular monthly meeting for community discussions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <div className="font-semibold">February 15, 2025</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-green-600" />
                        <div>
                          <span className="text-gray-600">Time:</span>
                          <div className="font-semibold">10:00 AM</div>
                        </div>
                      </div>
                      <div className="flex items-center col-span-2">
                        <MapPin className="mr-2 h-4 w-4 text-red-600" />
                        <div>
                          <span className="text-gray-600">Venue:</span>
                          <div className="font-semibold">
                            Panchayat Community Hall
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Agenda Items:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Review of ongoing development projects</li>
                        <li>• Budget allocation for FY 2025-26</li>
                        <li>• Discussion on water supply enhancement</li>
                        <li>• MGNREGA work planning</li>
                        <li>• Community feedback and suggestions</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Important Notes:
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>
                          • All adult residents are invited to participate
                        </li>
                        <li>• Bring valid ID proof for attendance</li>
                        <li>• Refreshments will be provided</li>
                        <li>
                          • Meeting will be conducted in Bengali and Hindi
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download Agenda
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Set Reminder
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        Special Meeting - Budget Review
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        <Calendar className="mr-1 h-3 w-3" />
                        Scheduled
                      </Badge>
                    </div>
                    <CardDescription>
                      Special session for annual budget discussion
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <div className="font-semibold">March 5, 2025</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-green-600" />
                        <div>
                          <span className="text-gray-600">Time:</span>
                          <div className="font-semibold">2:00 PM</div>
                        </div>
                      </div>
                      <div className="flex items-center col-span-2">
                        <MapPin className="mr-2 h-4 w-4 text-red-600" />
                        <div>
                          <span className="text-gray-600">Venue:</span>
                          <div className="font-semibold">
                            Panchayat Office Conference Room
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Focus Areas:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Annual budget presentation</li>
                        <li>• Revenue and expenditure analysis</li>
                        <li>• Priority project identification</li>
                        <li>• Fund allocation strategies</li>
                        <li>• Public audit and transparency measures</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Special Invitees:
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Block Development Officer</li>
                        <li>• District Collector representative</li>
                        <li>• Local MLAs and MPs</li>
                        <li>• Civil society organizations</li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download Notice
                      </Button>
                      <Button variant="outline" className="flex-1">
                        RSVP
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Meeting Minutes */}
            <TabsContent value="minutes" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Meeting Minutes
                </h2>
                <p className="text-xl text-gray-600">
                  Official records of past Gram Sabha meetings
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          January 2025 - Monthly Meeting
                        </CardTitle>
                        <CardDescription>
                          Meeting held on January 15, 2025
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Attendance:</span>
                        <div className="font-semibold">234 members (82%)</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <div className="font-semibold">2 hours 30 minutes</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Resolutions:</span>
                        <div className="font-semibold">4 passed</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Key Discussions:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>
                            • Water supply project progress review - 65%
                            completion reported
                          </li>
                          <li>• MGNREGA work allocation for winter season</li>
                          <li>• School infrastructure improvement proposals</li>
                          <li>• Waste management system implementation</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Decisions Made:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Approved ₹15 lakhs for road repair work</li>
                          <li>• Sanctioned new hand pumps for 3 villages</li>
                          <li>
                            • Established committee for festival organization
                          </li>
                          <li>• Approved solar street light installation</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Action Items:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>
                            • Secretary to coordinate with PWD for road work
                          </li>
                          <li>• Health committee to organize medical camp</li>
                          <li>
                            • Education committee to meet with school principals
                          </li>
                          <li>• Follow-up on pending PMAY applications</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Full Minutes
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Attendance
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          December 2024 - Year-End Review
                        </CardTitle>
                        <CardDescription>
                          Meeting held on December 20, 2024
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Attendance:</span>
                        <div className="font-semibold">267 members (94%)</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <div className="font-semibold">3 hours 15 minutes</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Resolutions:</span>
                        <div className="font-semibold">6 passed</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Annual Review Highlights:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>
                            • 32 development projects completed successfully
                          </li>
                          <li>
                            • ₹2.5 crores budget utilization (96% efficiency)
                          </li>
                          <li>• 156 families benefited from housing schemes</li>
                          <li>• 100% coverage achieved for waste management</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          Community Achievements:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Open defecation free status maintained</li>
                          <li>
                            • Digital literacy program trained 200+ residents
                          </li>
                          <li>
                            • Women&apos;s self-help groups generated ₹8 lakhs
                            income
                          </li>
                          <li>• Youth employment increased by 25%</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">2025 Planning:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Sports complex construction to begin</li>
                          <li>• Renewable energy initiative launch</li>
                          <li>• Healthcare center expansion project</li>
                          <li>• Digital governance implementation</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Annual Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Achievements
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          November 2024 - Development Focus
                        </CardTitle>
                        <CardDescription>
                          Meeting held on November 18, 2024
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Attendance:</span>
                        <div className="font-semibold">198 members (70%)</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <div className="font-semibold">2 hours 45 minutes</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Resolutions:</span>
                        <div className="font-semibold">3 passed</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">
                          Infrastructure Updates:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Village road network 40% completed</li>
                          <li>• Solar street lighting installation finished</li>
                          <li>• Primary school modernization 75% done</li>
                          <li>• Community health center expansion started</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">
                          Scheme Implementation:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>
                            • PM-KISAN payments disbursed to 1,876 farmers
                          </li>
                          <li>• 89 new Ayushman Bharat cards issued</li>
                          <li>• MGNREGA provided 45,678 person-days of work</li>
                          <li>
                            • 234 students received skill development training
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Minutes
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Progress Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Resolutions */}
            <TabsContent value="resolutions" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Resolutions Passed
                </h2>
                <p className="text-xl text-gray-600">
                  Official decisions and resolutions from Gram Sabha meetings
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Resolution No. 2025/01
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        Approved
                      </Badge>
                    </div>
                    <CardDescription>
                      Passed on January 15, 2025
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Subject:</h4>
                        <p className="text-gray-700">
                          Approval for Solar Street Light Installation Project
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Details:</h4>
                        <p className="text-gray-700 text-sm">
                          The Gram Sabha resolves to approve the installation of
                          50 additional solar LED street lights in remote areas
                          of villages Dhalpara, Madhyapara, and Uttar Para at an
                          estimated cost of ₹8,50,000. The project will be
                          funded through the State Rural Development Fund and is
                          expected to be completed within 4 months.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">
                            Budget Approved:
                          </span>
                          <div className="font-semibold">₹8,50,000</div>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Implementation Timeline:
                          </span>
                          <div className="font-semibold">4 months</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Voting Results:</h4>
                        <div className="text-sm text-gray-700">
                          In Favor: 198 | Against: 12 | Abstained: 24 | Total:
                          234
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Resolution No. 2025/02
                      </CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">
                        Approved
                      </Badge>
                    </div>
                    <CardDescription>
                      Passed on January 15, 2025
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Subject:</h4>
                        <p className="text-gray-700">
                          Formation of Women&apos;s Safety Committee
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Details:</h4>
                        <p className="text-gray-700 text-sm">
                          The Gram Sabha resolves to establish a Women&apos;s
                          Safety Committee comprising 7 members including 5
                          women representatives from different villages, 1
                          police representative, and 1 social worker. The
                          committee will work on women&apos;s safety issues,
                          awareness programs, and coordinate with law
                          enforcement agencies.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">
                            Committee Members:
                          </span>
                          <div className="font-semibold">
                            7 (5 Women + 2 Others)
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Term Duration:</span>
                          <div className="font-semibold">2 years</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Voting Results:</h4>
                        <div className="text-sm text-gray-700">
                          In Favor: 221 | Against: 3 | Abstained: 10 | Total:
                          234
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Resolution No. 2024/45
                      </CardTitle>
                      <Badge className="bg-purple-100 text-purple-800">
                        Approved
                      </Badge>
                    </div>
                    <CardDescription>
                      Passed on December 20, 2024
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Subject:</h4>
                        <p className="text-gray-700">
                          Annual Budget Approval for FY 2025-26
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Details:</h4>
                        <p className="text-gray-700 text-sm">
                          The Gram Sabha approves the annual budget of ₹2.75
                          crores for the financial year 2025-26. The budget
                          allocation includes ₹1.2 crores for infrastructure
                          development, ₹80 lakhs for social welfare schemes, ₹45
                          lakhs for administrative expenses, and ₹30 lakhs for
                          emergency and contingency funds.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Budget:</span>
                          <div className="font-semibold">₹2.75 Crores</div>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Development Allocation:
                          </span>
                          <div className="font-semibold">₹1.2 Crores (44%)</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Voting Results:</h4>
                        <div className="text-sm text-gray-700">
                          In Favor: 251 | Against: 8 | Abstained: 8 | Total: 267
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Resolution No. 2024/44
                      </CardTitle>
                      <Badge className="bg-orange-100 text-orange-800">
                        Approved
                      </Badge>
                    </div>
                    <CardDescription>
                      Passed on December 20, 2024
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Subject:</h4>
                        <p className="text-gray-700">
                          Land Acquisition for Community Sports Complex
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Details:</h4>
                        <p className="text-gray-700 text-sm">
                          The Gram Sabha approves the acquisition of 5 acres of
                          land from willing sellers for the construction of an
                          integrated sports complex. The land will be purchased
                          at market rate with proper legal documentation. The
                          sports complex will include football ground, cricket
                          pitch, indoor games facility, and gymnasium.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Land Area:</span>
                          <div className="font-semibold">5 Acres</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Estimated Cost:</span>
                          <div className="font-semibold">₹25 Lakhs</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Voting Results:</h4>
                        <div className="text-sm text-gray-700">
                          In Favor: 234 | Against: 18 | Abstained: 15 | Total:
                          267
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Meeting Guidelines */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Meeting Guidelines
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                    Participation Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• All adult residents (18+ years) can participate</li>
                    <li>• Bring valid ID proof for attendance verification</li>
                    <li>• Maintain decorum and respect during discussions</li>
                    <li>• Raise hand to speak and wait for permission</li>
                    <li>• No mobile phones during active sessions</li>
                    <li>• Questions and suggestions are welcome</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-green-600" />
                    Meeting Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Regular meetings: 3rd Sunday of every month</li>
                    <li>• Time: 10:00 AM to 1:00 PM</li>
                    <li>• Special meetings: As per requirement</li>
                    <li>• Advance notice: Minimum 7 days</li>
                    <li>• Quorum: 10% of total registered voters</li>
                    <li>• Minutes published within 48 hours</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Meetings */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Have Questions About Meetings?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact our office for meeting schedules, agenda items, or to submit
            topics for discussion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Call Office: +91 98765 43210
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              Email: meetings@dhalparagp.in
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
