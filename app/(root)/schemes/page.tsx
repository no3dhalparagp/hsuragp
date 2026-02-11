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
  Home,
  Users,
  Briefcase,
  Heart,
  GraduationCap,
  Leaf,
  IndianRupee,
  FileText,
  CheckCircle,
} from "lucide-react";

export default function SchemesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Government Schemes
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Comprehensive welfare schemes designed to uplift and empower our
            community
          </p>
        </div>
      </section>

      {/* Scheme Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="housing" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
              <TabsTrigger value="housing">Housing</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
              <TabsTrigger value="social">Social Welfare</TabsTrigger>
            </TabsList>

            {/* Housing Schemes */}
            <TabsContent value="housing" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <Home className="mr-3 h-8 w-8 text-orange-600" />
                  Housing Schemes
                </h2>
                <p className="text-xl text-gray-600">
                  Affordable housing solutions for all income groups
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        Pradhan Mantri Awas Yojana (PMAY)
                      </CardTitle>
                      <Badge className="bg-orange-100 text-orange-800">
                        Central Scheme
                      </Badge>
                    </div>
                    <CardDescription>Housing for All - Rural</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          Financial Assistance:
                        </span>
                        <div className="font-semibold">₹1.20 - 2.50 Lakhs</div>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Beneficiaries (2024):
                        </span>
                        <div className="font-semibold">156 families</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Eligibility Criteria:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Family should not own a pucca house</li>
                        <li>• Annual income below ₹2 lakhs</li>
                        <li>
                          • No family member should be a government employee
                        </li>
                        <li>
                          • Should not have availed housing scheme benefits
                          before
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Required Documents:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Aadhaar Card and Voter ID</li>
                        <li>• Income Certificate</li>
                        <li>• Bank Account Details</li>
                        <li>• Land Documents</li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Apply Online</Button>
                      <Button variant="outline" className="flex-1">
                        Check Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        Bangla Awas Yojana
                      </CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">
                        State Scheme
                      </Badge>
                    </div>
                    <CardDescription>
                      West Bengal State Housing Scheme
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          Financial Assistance:
                        </span>
                        <div className="font-semibold">₹1.50 Lakhs</div>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Beneficiaries (2024):
                        </span>
                        <div className="font-semibold">89 families</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Key Features:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Additional support for SC/ST families</li>
                        <li>• Technical assistance for construction</li>
                        <li>• Quality monitoring and inspection</li>
                        <li>• Convergence with MGNREGA for labor</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Application Process:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Submit application at Panchayat office</li>
                        <li>• Verification by local officials</li>
                        <li>• Approval by District Collector</li>
                        <li>• Fund release in installments</li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Apply Now</Button>
                      <Button variant="outline" className="flex-1">
                        Download Form
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Employment Schemes */}
            <TabsContent value="employment" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <Briefcase className="mr-3 h-8 w-8 text-green-600" />
                  Employment Schemes
                </h2>
                <p className="text-xl text-gray-600">
                  Guaranteed employment and skill development programs
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">MGNREGA</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        Central Scheme
                      </Badge>
                    </div>
                    <CardDescription>
                      Mahatma Gandhi National Rural Employment Guarantee Act
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Daily Wage Rate:</span>
                        <div className="font-semibold">₹245 per day</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Active Job Cards:</span>
                        <div className="font-semibold">2,847</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Work Categories:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Water conservation and harvesting</li>
                        <li>• Rural road construction and maintenance</li>
                        <li>• Land development and soil conservation</li>
                        <li>• Plantation and horticulture development</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Current Statistics (2024-25):
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Person-days generated:{" "}
                          <span className="font-semibold">45,678</span>
                        </div>
                        <div>
                          Average days per household:{" "}
                          <span className="font-semibold">67</span>
                        </div>
                        <div>
                          Women participation:{" "}
                          <span className="font-semibold">58%</span>
                        </div>
                        <div>
                          Wages paid:{" "}
                          <span className="font-semibold">₹1.12 Cr</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Apply for Job Card</Button>
                      <Button variant="outline" className="flex-1">
                        Check Payments
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        Skill Development Program
                      </CardTitle>
                      <Badge className="bg-purple-100 text-purple-800">
                        State + Central
                      </Badge>
                    </div>
                    <CardDescription>
                      Pradhan Mantri Kaushal Vikas Yojana (PMKVY)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          Training Duration:
                        </span>
                        <div className="font-semibold">3-6 months</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Certified (2024):</span>
                        <div className="font-semibold">234 candidates</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Available Courses:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Computer literacy and data entry</li>
                        <li>• Tailoring and garment making</li>
                        <li>• Mobile phone repair</li>
                        <li>• Beauty and wellness</li>
                        <li>• Organic farming techniques</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Benefits:
                      </h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Free training with certification</li>
                        <li>• Stipend during training period</li>
                        <li>• Job placement assistance</li>
                        <li>• Tool kit for successful candidates</li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Enroll Now</Button>
                      <Button variant="outline" className="flex-1">
                        View Centers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Health Schemes */}
            <TabsContent value="health" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <Heart className="mr-3 h-8 w-8 text-red-600" />
                  Health Schemes
                </h2>
                <p className="text-xl text-gray-600">
                  Universal healthcare coverage and wellness programs
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Ayushman Bharat</CardTitle>
                      <Badge className="bg-red-100 text-red-800">
                        Central Scheme
                      </Badge>
                    </div>
                    <CardDescription>
                      Pradhan Mantri Jan Arogya Yojana (PM-JAY)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Coverage Amount:</span>
                        <div className="font-semibold">₹5 Lakhs per family</div>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Enrolled Families:
                        </span>
                        <div className="font-semibold">2,156</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Coverage Includes:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Hospitalization expenses</li>
                        <li>• Pre and post hospitalization care</li>
                        <li>• Day care procedures</li>
                        <li>• Emergency treatments</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">
                        Empaneled Hospitals:
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• District Hospital, Barasat</li>
                        <li>• Charnock Hospital, Kolkata</li>
                        <li>• Apollo Gleneagles, Kolkata</li>
                        <li>• Local Primary Health Centers</li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Get Golden Card</Button>
                      <Button variant="outline" className="flex-1">
                        Find Hospitals
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-pink-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Swasthya Sathi</CardTitle>
                      <Badge className="bg-pink-100 text-pink-800">
                        State Scheme
                      </Badge>
                    </div>
                    <CardDescription>
                      West Bengal Health Insurance Scheme
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Coverage Amount:</span>
                        <div className="font-semibold">₹5 Lakhs per family</div>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Enrolled Families:
                        </span>
                        <div className="font-semibold">1,987</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Additional Benefits:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Cashless treatment facility</li>
                        <li>• Coverage for pre-existing diseases</li>
                        <li>• Maternity and newborn care</li>
                        <li>• Mental health treatment</li>
                      </ul>
                    </div>

                    <div className="bg-pink-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-pink-800 mb-2">
                        Special Features:
                      </h4>
                      <ul className="text-sm text-pink-700 space-y-1">
                        <li>• No age limit for enrollment</li>
                        <li>• Coverage from day one</li>
                        <li>• Free health checkups</li>
                        <li>• Medicine distribution</li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Apply for Card</Button>
                      <Button variant="outline" className="flex-1">
                        Renewal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Education Schemes */}
            <TabsContent value="education" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <GraduationCap className="mr-3 h-8 w-8 text-blue-600" />
                  Education Schemes
                </h2>
                <p className="text-xl text-gray-600">
                  Educational support and scholarship programs
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        Mid Day Meal Scheme
                      </CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">
                        Central Scheme
                      </Badge>
                    </div>
                    <CardDescription>
                      Nutritious meals for school children
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          Daily Beneficiaries:
                        </span>
                        <div className="font-semibold">1,245 students</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Schools Covered:</span>
                        <div className="font-semibold">8 primary schools</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Nutritional Standards:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 450 calories and 12g protein (Primary)</li>
                        <li>• 700 calories and 20g protein (Upper Primary)</li>
                        <li>• Fortified rice and vegetables</li>
                        <li>• Weekly menu planning</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Quality Measures:
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Regular health checkups</li>
                        <li>• Kitchen garden program</li>
                        <li>• Parent-teacher monitoring</li>
                        <li>• Hygiene and safety protocols</li>
                      </ul>
                    </div>

                    <Button className="w-full">
                      View Menu & Quality Reports
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        Scholarship Programs
                      </CardTitle>
                      <Badge className="bg-indigo-100 text-indigo-800">
                        State + Central
                      </Badge>
                    </div>
                    <CardDescription>
                      Financial assistance for meritorious students
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          Scholarships Awarded:
                        </span>
                        <div className="font-semibold">189 students</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Amount:</span>
                        <div className="font-semibold">₹12.5 Lakhs</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Available Scholarships:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Pre-matric scholarship (SC/ST/OBC)</li>
                        <li>• Post-matric scholarship</li>
                        <li>• Merit-cum-means scholarship</li>
                        <li>• Minority community scholarships</li>
                      </ul>
                    </div>

                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-indigo-800 mb-2">
                        Eligibility Criteria:
                      </h4>
                      <ul className="text-sm text-indigo-700 space-y-1">
                        <li>• Minimum 60% marks in previous class</li>
                        <li>• Family income below specified limit</li>
                        <li>• Regular attendance (minimum 75%)</li>
                        <li>• Valid caste/income certificates</li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Apply Online</Button>
                      <Button variant="outline" className="flex-1">
                        Check Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Agriculture Schemes */}
            <TabsContent value="agriculture" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <Leaf className="mr-3 h-8 w-8 text-green-600" />
                  Agriculture Schemes
                </h2>
                <p className="text-xl text-gray-600">
                  Supporting farmers with modern techniques and financial aid
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">PM-KISAN</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        Central Scheme
                      </Badge>
                    </div>
                    <CardDescription>
                      Income support for small and marginal farmers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Annual Benefit:</span>
                        <div className="font-semibold">₹6,000 per farmer</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Enrolled Farmers:</span>
                        <div className="font-semibold">1,876</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Payment Schedule:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• ₹2,000 in April-July</li>
                        <li>• ₹2,000 in August-November</li>
                        <li>• ₹2,000 in December-March</li>
                        <li>• Direct bank transfer (DBT)</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        2024-25 Statistics:
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Total disbursed:{" "}
                          <span className="font-semibold">₹1.12 Cr</span>
                        </div>
                        <div>
                          Installments paid:{" "}
                          <span className="font-semibold">3/3</span>
                        </div>
                        <div>
                          Success rate:{" "}
                          <span className="font-semibold">98.5%</span>
                        </div>
                        <div>
                          Pending cases:{" "}
                          <span className="font-semibold">28</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Check Status</Button>
                      <Button variant="outline" className="flex-1">
                        Update Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Crop Insurance</CardTitle>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Central Scheme
                      </Badge>
                    </div>
                    <CardDescription>
                      Pradhan Mantri Fasal Bima Yojana (PMFBY)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Premium Rate:</span>
                        <div className="font-semibold">2% for Kharif crops</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Insured Farmers:</span>
                        <div className="font-semibold">1,234</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Coverage:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Natural calamities (drought, flood)</li>
                        <li>• Pest and disease attacks</li>
                        <li>• Post-harvest losses</li>
                        <li>• Prevented sowing/planting</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        Claim Settlement (2024):
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Claims received:{" "}
                          <span className="font-semibold">89</span>
                        </div>
                        <div>
                          Claims settled:{" "}
                          <span className="font-semibold">76</span>
                        </div>
                        <div>
                          Amount paid:{" "}
                          <span className="font-semibold">₹45.6 Lakhs</span>
                        </div>
                        <div>
                          Avg. settlement:{" "}
                          <span className="font-semibold">₹60,000</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Enroll Now</Button>
                      <Button variant="outline" className="flex-1">
                        File Claim
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Social Welfare Schemes */}
            <TabsContent value="social" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <Users className="mr-3 h-8 w-8 text-purple-600" />
                  Social Welfare Schemes
                </h2>
                <p className="text-xl text-gray-600">
                  Support for vulnerable sections and social security
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Old Age Pension</CardTitle>
                      <Badge className="bg-purple-100 text-purple-800">
                        State Scheme
                      </Badge>
                    </div>
                    <CardDescription>
                      Monthly pension for senior citizens
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Monthly Amount:</span>
                        <div className="font-semibold">₹1,000</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Beneficiaries:</span>
                        <div className="font-semibold">567</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Eligibility:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Age 60 years and above</li>
                        <li>• BPL family or income below ₹2 lakhs</li>
                        <li>• Resident of West Bengal</li>
                        <li>• Not receiving other pension</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Additional Benefits:
                      </h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Free health checkups</li>
                        <li>• Medicine subsidy</li>
                        <li>• Priority in government schemes</li>
                        <li>• Ration card benefits</li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Apply Now</Button>
                      <Button variant="outline" className="flex-1">
                        Check Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-pink-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Widow Pension</CardTitle>
                      <Badge className="bg-pink-100 text-pink-800">
                        State Scheme
                      </Badge>
                    </div>
                    <CardDescription>
                      Financial support for widowed women
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Monthly Amount:</span>
                        <div className="font-semibold">₹1,000</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Beneficiaries:</span>
                        <div className="font-semibold">234</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Eligibility:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Widowed women aged 18-59 years</li>
                        <li>• Annual family income below ₹2 lakhs</li>
                        <li>• Not remarried</li>
                        <li>• Resident of West Bengal for 10+ years</li>
                      </ul>
                    </div>

                    <div className="bg-pink-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-pink-800 mb-2">
                        Support Services:
                      </h4>
                      <ul className="text-sm text-pink-700 space-y-1">
                        <li>• Skill development training</li>
                        <li>• Legal aid assistance</li>
                        <li>• Counseling services</li>
                        <li>• Children&apos;s education support</li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">Apply Now</Button>
                      <Button variant="outline" className="flex-1">
                        Get Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How to Apply for Schemes
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  1. Check Eligibility
                </h3>
                <p className="text-gray-600 text-sm">
                  Review scheme criteria and ensure you meet all requirements
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  2. Gather Documents
                </h3>
                <p className="text-gray-600 text-sm">
                  Collect all required documents and certificates
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  3. Submit Application
                </h3>
                <p className="text-gray-600 text-sm">
                  Apply online or visit the Panchayat office
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  4. Receive Benefits
                </h3>
                <p className="text-gray-600 text-sm">
                  Get approval and start receiving scheme benefits
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Schemes */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Need Help with Scheme Applications?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our scheme coordinators are available to assist you with
            applications and queries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Visit Panchayat Office
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              Call Helpline: 1800-XXX-XXXX
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
