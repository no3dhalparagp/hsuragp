import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IndianRupee, TrendingUp, TrendingDown, Download, PieChart, BarChart3, FileText } from "lucide-react"

export default function BudgetPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Budget & Finance</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Transparent financial management and budget allocation for community development
          </p>
        </div>
      </section>

      {/* Budget Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Budget Overview 2024-25</h2>
            <p className="text-xl text-gray-600">Total Budget: ₹2.75 Crores</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">₹1.2Cr</div>
              <div className="text-gray-600">Infrastructure Development</div>
              <div className="text-sm text-gray-500">44% of total budget</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">₹80L</div>
              <div className="text-gray-600">Social Welfare</div>
              <div className="text-sm text-gray-500">29% of total budget</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">₹45L</div>
              <div className="text-gray-600">Administration</div>
              <div className="text-sm text-gray-500">16% of total budget</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">₹30L</div>
              <div className="text-gray-600">Emergency Fund</div>
              <div className="text-sm text-gray-500">11% of total budget</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
              <TabsTrigger value="current">Current Budget</TabsTrigger>
              <TabsTrigger value="expenditure">Expenditure</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="projects">Project Wise</TabsTrigger>
              <TabsTrigger value="audit">Audit Reports</TabsTrigger>
            </TabsList>

            {/* Current Budget */}
            <TabsContent value="current" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Budget Allocation 2024-25</h2>
                <p className="text-xl text-gray-600">Detailed breakdown of budget allocation across sectors</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="mr-2 h-5 w-5 text-green-600" />
                      Infrastructure Development - ₹1.2 Crores
                    </CardTitle>
                    <CardDescription>44% of total budget allocated for infrastructure projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Road Construction & Maintenance</span>
                        <span className="font-semibold">₹45 Lakhs</span>
                      </div>
                      <Progress value={37.5} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Water Supply Enhancement</span>
                        <span className="font-semibold">₹35 Lakhs</span>
                      </div>
                      <Progress value={29.2} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">School Infrastructure</span>
                        <span className="font-semibold">₹25 Lakhs</span>
                      </div>
                      <Progress value={20.8} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Healthcare Facilities</span>
                        <span className="font-semibold">₹15 Lakhs</span>
                      </div>
                      <Progress value={12.5} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                      Social Welfare - ₹80 Lakhs
                    </CardTitle>
                    <CardDescription>29% of total budget for welfare schemes and programs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">MGNREGA Implementation</span>
                        <span className="font-semibold">₹30 Lakhs</span>
                      </div>
                      <Progress value={37.5} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Housing Schemes Support</span>
                        <span className="font-semibold">₹20 Lakhs</span>
                      </div>
                      <Progress value={25} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Education & Scholarships</span>
                        <span className="font-semibold">₹15 Lakhs</span>
                      </div>
                      <Progress value={18.75} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Healthcare Programs</span>
                        <span className="font-semibold">₹15 Lakhs</span>
                      </div>
                      <Progress value={18.75} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-purple-600" />
                      Administration - ₹45 Lakhs
                    </CardTitle>
                    <CardDescription>16% of total budget for administrative expenses</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Staff Salaries & Benefits</span>
                        <span className="font-semibold">₹25 Lakhs</span>
                      </div>
                      <Progress value={55.6} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Office Operations</span>
                        <span className="font-semibold">₹10 Lakhs</span>
                      </div>
                      <Progress value={22.2} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Technology & Equipment</span>
                        <span className="font-semibold">₹6 Lakhs</span>
                      </div>
                      <Progress value={13.3} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Training & Development</span>
                        <span className="font-semibold">₹4 Lakhs</span>
                      </div>
                      <Progress value={8.9} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <IndianRupee className="mr-2 h-5 w-5 text-orange-600" />
                      Emergency & Contingency - ₹30 Lakhs
                    </CardTitle>
                    <CardDescription>11% of total budget reserved for emergencies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Natural Disaster Response</span>
                        <span className="font-semibold">₹15 Lakhs</span>
                      </div>
                      <Progress value={50} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Emergency Repairs</span>
                        <span className="font-semibold">₹8 Lakhs</span>
                      </div>
                      <Progress value={26.7} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm">Contingency Reserve</span>
                        <span className="font-semibold">₹7 Lakhs</span>
                      </div>
                      <Progress value={23.3} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Documents</CardTitle>
                  <CardDescription>Download official budget documents and financial statements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <Download className="h-6 w-6 mb-2" />
                      <span className="font-semibold">Annual Budget 2024-25</span>
                      <span className="text-xs text-gray-500">PDF - 2.5 MB</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <Download className="h-6 w-6 mb-2" />
                      <span className="font-semibold">Budget Summary</span>
                      <span className="text-xs text-gray-500">PDF - 1.2 MB</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <Download className="h-6 w-6 mb-2" />
                      <span className="font-semibold">Financial Guidelines</span>
                      <span className="text-xs text-gray-500">PDF - 800 KB</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Expenditure */}
            <TabsContent value="expenditure" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Expenditure Analysis</h2>
                <p className="text-xl text-gray-600">Monthly and quarterly expenditure tracking</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Quarterly Expenditure (Q3 2024-25)</CardTitle>
                    <CardDescription>October - December 2024</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Infrastructure Projects</span>
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">₹28 Lakhs</span>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <Progress value={65} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span>Social Welfare</span>
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">₹18 Lakhs</span>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <Progress value={45} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span>Administration</span>
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">₹12 Lakhs</span>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      <Progress value={30} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span>Emergency Fund Used</span>
                        <div className="flex items-center">
                          <span className="font-semibold mr-2">₹3 Lakhs</span>
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                        </div>
                      </div>
                      <Progress value={8} className="h-2" />
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Total Q3 Expenditure:</strong> ₹61 Lakhs (22% of annual budget)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Year-to-Date Expenditure</CardTitle>
                    <CardDescription>April 2024 - December 2024</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Total Spent</span>
                        <span className="font-semibold text-lg">₹1.85 Crores</span>
                      </div>
                      <Progress value={67} className="h-3" />
                      <p className="text-sm text-gray-600">67% of annual budget utilized</p>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">₹90L</div>
                          <div className="text-sm text-gray-600">Remaining Budget</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">4</div>
                          <div className="text-sm text-gray-600">Months Left</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Expenditure Breakdown</CardTitle>
                  <CardDescription>Detailed month-wise expenditure for current financial year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Month</th>
                          <th className="text-right p-2">Infrastructure</th>
                          <th className="text-right p-2">Social Welfare</th>
                          <th className="text-right p-2">Administration</th>
                          <th className="text-right p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">April 2024</td>
                          <td className="text-right p-2">₹8.5L</td>
                          <td className="text-right p-2">₹6.2L</td>
                          <td className="text-right p-2">₹4.1L</td>
                          <td className="text-right p-2 font-semibold">₹18.8L</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">May 2024</td>
                          <td className="text-right p-2">₹12.3L</td>
                          <td className="text-right p-2">₹7.8L</td>
                          <td className="text-right p-2">₹3.9L</td>
                          <td className="text-right p-2 font-semibold">₹24.0L</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">June 2024</td>
                          <td className="text-right p-2">₹15.6L</td>
                          <td className="text-right p-2">₹9.1L</td>
                          <td className="text-right p-2">₹4.2L</td>
                          <td className="text-right p-2 font-semibold">₹28.9L</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">July 2024</td>
                          <td className="text-right p-2">₹11.2L</td>
                          <td className="text-right p-2">₹8.5L</td>
                          <td className="text-right p-2">₹3.8L</td>
                          <td className="text-right p-2 font-semibold">₹23.5L</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">August 2024</td>
                          <td className="text-right p-2">₹9.8L</td>
                          <td className="text-right p-2">₹7.3L</td>
                          <td className="text-right p-2">₹4.0L</td>
                          <td className="text-right p-2 font-semibold">₹21.1L</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">September 2024</td>
                          <td className="text-right p-2">₹13.7L</td>
                          <td className="text-right p-2">₹8.9L</td>
                          <td className="text-right p-2">₹4.3L</td>
                          <td className="text-right p-2 font-semibold">₹26.9L</td>
                        </tr>
                        <tr className="bg-gray-50 font-semibold">
                          <td className="p-2">Total (Apr-Sep)</td>
                          <td className="text-right p-2">₹71.1L</td>
                          <td className="text-right p-2">₹47.8L</td>
                          <td className="text-right p-2">₹24.3L</td>
                          <td className="text-right p-2">₹143.2L</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Revenue */}
            <TabsContent value="revenue" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Revenue Sources</h2>
                <p className="text-xl text-gray-600">Income streams and fund allocation for 2024-25</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Sources of income for current financial year</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Central Government Grants</span>
                        <span className="font-semibold">₹1.45 Cr (53%)</span>
                      </div>
                      <Progress value={53} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span>State Government Funds</span>
                        <span className="font-semibold">₹85 L (31%)</span>
                      </div>
                      <Progress value={31} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span>Local Revenue (Taxes)</span>
                        <span className="font-semibold">₹35 L (13%)</span>
                      </div>
                      <Progress value={13} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span>Other Sources</span>
                        <span className="font-semibold">₹10 L (3%)</span>
                      </div>
                      <Progress value={3} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Local Revenue Collection</CardTitle>
                    <CardDescription>Property tax and other local income</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Property Tax</span>
                        <span className="font-semibold">₹22 L (63%)</span>
                      </div>
                      <Progress value={63} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span>Trade License Fees</span>
                        <span className="font-semibold">₹8 L (23%)</span>
                      </div>
                      <Progress value={23} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span>Water & Sanitation Charges</span>
                        <span className="font-semibold">₹3 L (8%)</span>
                      </div>
                      <Progress value={8} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span>Other Fees</span>
                        <span className="font-semibold">₹2 L (6%)</span>
                      </div>
                      <Progress value={6} className="h-2" />
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Collection Efficiency:</strong> 87% of assessed revenue collected
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Grant-wise Fund Allocation</CardTitle>
                  <CardDescription>Detailed breakdown of central and state government grants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-600">Central Government Grants:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>15th Finance Commission Grant:</span>
                          <span className="font-semibold">₹65 L</span>
                        </div>
                        <div className="flex justify-between">
                          <span>MGNREGA Allocation:</span>
                          <span className="font-semibold">₹45 L</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Swachh Bharat Mission:</span>
                          <span className="font-semibold">₹20 L</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PM Awas Yojana Support:</span>
                          <span className="font-semibold">₹15 L</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">State Government Grants:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>State Finance Commission:</span>
                          <span className="font-semibold">₹35 L</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rural Development Fund:</span>
                          <span className="font-semibold">₹25 L</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Education & Health Grant:</span>
                          <span className="font-semibold">₹15 L</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Special Development Fund:</span>
                          <span className="font-semibold">₹10 L</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Wise */}
            <TabsContent value="projects" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Project-wise Budget Allocation</h2>
                <p className="text-xl text-gray-600">Detailed budget breakdown for major development projects</p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Water Supply Enhancement Project</CardTitle>
                    <CardDescription>Comprehensive water supply system for 8 villages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Budget Allocation</h4>
                        <div className="text-2xl font-bold text-blue-600">₹50 Lakhs</div>
                        <p className="text-sm text-gray-600">Total project cost</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Spent Till Date</h4>
                        <div className="text-2xl font-bold text-green-600">₹32.5 Lakhs</div>
                        <p className="text-sm text-gray-600">65% utilized</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Remaining</h4>
                        <div className="text-2xl font-bold text-orange-600">₹17.5 Lakhs</div>
                        <p className="text-sm text-gray-600">35% pending</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={65} className="h-3" />
                      <p className="text-sm text-gray-600 mt-2">Expected completion: August 2025</p>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-semibold mb-2">Expenditure Breakdown:</h5>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Pipeline & Materials: ₹20 L</li>
                          <li>• Labor & Installation: ₹8 L</li>
                          <li>• Water Treatment Plants: ₹4.5 L</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2">Funding Sources:</h5>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Central Grant: ₹30 L (60%)</li>
                          <li>• State Fund: ₹15 L (30%)</li>
                          <li>• Local Contribution: ₹5 L (10%)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Village Road Network Improvement</CardTitle>
                    <CardDescription>Concrete road construction connecting remote villages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Budget Allocation</h4>
                        <div className="text-2xl font-bold text-blue-600">₹35 Lakhs</div>
                        <p className="text-sm text-gray-600">Total project cost</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Spent Till Date</h4>
                        <div className="text-2xl font-bold text-green-600">₹14 Lakhs</div>
                        <p className="text-sm text-gray-600">40% utilized</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Remaining</h4>
                        <div className="text-2xl font-bold text-orange-600">₹21 Lakhs</div>
                        <p className="text-sm text-gray-600">60% pending</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={40} className="h-3" />
                      <p className="text-sm text-gray-600 mt-2">Expected completion: October 2025</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Primary School Modernization</CardTitle>
                    <CardDescription>Infrastructure upgrade for 3 primary schools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Budget Allocation</h4>
                        <div className="text-2xl font-bold text-blue-600">₹25 Lakhs</div>
                        <p className="text-sm text-gray-600">Total project cost</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Spent Till Date</h4>
                        <div className="text-2xl font-bold text-green-600">₹18.75 Lakhs</div>
                        <p className="text-sm text-gray-600">75% utilized</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Remaining</h4>
                        <div className="text-2xl font-bold text-orange-600">₹6.25 Lakhs</div>
                        <p className="text-sm text-gray-600">25% pending</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={75} className="h-3" />
                      <p className="text-sm text-gray-600 mt-2">Expected completion: June 2025</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Audit Reports */}
            <TabsContent value="audit" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Audit Reports</h2>
                <p className="text-xl text-gray-600">Independent audit findings and compliance reports</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Audit Report (2023-24)</CardTitle>
                    <CardDescription>Annual audit conducted by State Audit Department</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">A+</div>
                        <div className="text-sm text-gray-600">Overall Rating</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">96%</div>
                        <div className="text-sm text-gray-600">Compliance Score</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-600">Key Findings:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Excellent financial management practices</li>
                        <li>• Proper documentation and record keeping</li>
                        <li>• Transparent procurement processes</li>
                        <li>• Effective utilization of allocated funds</li>
                        <li>• Strong internal control systems</li>
                      </ul>
                    </div>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Full Report
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Internal Audit Summary</CardTitle>
                    <CardDescription>Quarterly internal audit findings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Q1 2024-25</span>
                        <Badge className="bg-green-100 text-green-800">Clean</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Q2 2024-25</span>
                        <Badge className="bg-green-100 text-green-800">Clean</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Q3 2024-25</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Minor Issues</Badge>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Q3 Observations:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Delay in updating asset register</li>
                        <li>• Minor documentation gaps in procurement</li>
                        <li>• Recommended monthly reconciliation</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Corrective Actions:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Asset register updated monthly</li>
                        <li>• Enhanced documentation process</li>
                        <li>• Monthly financial reconciliation implemented</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Audit History</CardTitle>
                  <CardDescription>Previous audit reports and compliance records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Year</th>
                          <th className="text-left p-2">Audit Type</th>
                          <th className="text-left p-2">Rating</th>
                          <th className="text-left p-2">Compliance %</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Report</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">2023-24</td>
                          <td className="p-2">Annual External</td>
                          <td className="p-2">A+</td>
                          <td className="p-2">96%</td>
                          <td className="p-2">
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          </td>
                          <td className="p-2">
                            <Button size="sm" variant="outline">
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">2022-23</td>
                          <td className="p-2">Annual External</td>
                          <td className="p-2">A</td>
                          <td className="p-2">92%</td>
                          <td className="p-2">
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          </td>
                          <td className="p-2">
                            <Button size="sm" variant="outline">
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">2021-22</td>
                          <td className="p-2">Annual External</td>
                          <td className="p-2">B+</td>
                          <td className="p-2">88%</td>
                          <td className="p-2">
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          </td>
                          <td className="p-2">
                            <Button size="sm" variant="outline">
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">2020-21</td>
                          <td className="p-2">Annual External</td>
                          <td className="p-2">B</td>
                          <td className="p-2">85%</td>
                          <td className="p-2">
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          </td>
                          <td className="p-2">
                            <Button size="sm" variant="outline">
                              Download
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Improvement Trend:</strong> Consistent improvement in audit ratings over the past 4 years,
                      demonstrating enhanced financial management and governance practices.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Financial Transparency */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Financial Transparency</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We are committed to maintaining complete transparency in our financial operations and budget utilization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Download className="mr-2 h-5 w-5" />
              Download Annual Budget
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              <FileText className="mr-2 h-5 w-5" />
              View Expenditure Reports
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
