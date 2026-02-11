"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUpIcon, FileTextIcon, CalculatorIcon, BarChart3Icon, PieChartIcon, BookOpenIcon, IndianRupeeIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

interface ProjectSummary {
  id: string;
  name: string;
  location: string;
  estimateType: 'road' | 'building' | 'solar-pump' | 'water-chiller' | 'civil-work';
  estimatedCost: number;
  sanctionedAmount: number;
  spentAmount: number;
  physicalProgress: number;
  financialProgress: number;
  status: 'ongoing' | 'completed' | 'delayed' | 'suspended';
  measurements: number;
  bills: number;
  contractor: string;
  engineer: string;
}

export default function DevelopmentWorksPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [approvedPlans, setApprovedPlans] = useState<any>(null);
  React.useEffect(() => {
    const controller = new AbortController();
    fetch('/api/approved-action-plans?pageSize=10', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setApprovedPlans(data))
      .catch(() => setApprovedPlans({ items: [], totalCount: 0 }));
    return () => controller.abort();
  }, []);

  // Mock data combining all three modules
  const projects: ProjectSummary[] = [
    {
      id: 'PROJ-001',
      name: 'Construction of Paka Drain with slab from Basanta Main Road',
      location: 'Village Rampur, Block A',
      estimateType: 'road',
      estimatedCost: 331737,
      sanctionedAmount: 350000,
      spentAmount: 250000,
      physicalProgress: 75,
      financialProgress: 71,
      status: 'ongoing',
      measurements: 8,
      bills: 3,
      contractor: 'ABC Construction Ltd.',
      engineer: 'Er. Rajesh Kumar'
    },
    {
      id: 'PROJ-002',
      name: 'School Building Construction - Primary School',
      location: 'Gram Panchayat Office Complex',
      estimateType: 'building',
      estimatedCost: 8000000,
      sanctionedAmount: 8500000,
      spentAmount: 6400000,
      physicalProgress: 80,
      financialProgress: 75,
      status: 'ongoing',
      measurements: 25,
      bills: 5,
      contractor: 'XYZ Builders',
      engineer: 'Er. Priya Sharma'
    },
    {
      id: 'PROJ-003',
      name: 'Solar Pump Installation - Water Supply',
      location: 'Multiple Villages - Zone A',
      estimateType: 'solar-pump',
      estimatedCost: 485000,
      sanctionedAmount: 500000,
      spentAmount: 450000,
      physicalProgress: 95,
      financialProgress: 90,
      status: 'ongoing',
      measurements: 12,
      bills: 4,
      contractor: 'Green Energy Solutions',
      engineer: 'Er. Amit Singh'
    },
    {
      id: 'PROJ-004',
      name: 'Water Chiller System - Community Center',
      location: 'Community Center, Main Block',
      estimateType: 'water-chiller',
      estimatedCost: 750000,
      sanctionedAmount: 800000,
      spentAmount: 200000,
      physicalProgress: 25,
      financialProgress: 25,
      status: 'ongoing',
      measurements: 5,
      bills: 1,
      contractor: 'Cool Tech Systems',
      engineer: 'Er. Meera Patel'
    },
    {
      id: 'PROJ-005',
      name: 'Bridge Construction over Seasonal Stream',
      location: 'Between Village A and B',
      estimateType: 'civil-work',
      estimatedCost: 1250000,
      sanctionedAmount: 1300000,
      spentAmount: 150000,
      physicalProgress: 15,
      financialProgress: 12,
      status: 'delayed',
      measurements: 8,
      bills: 1,
      contractor: 'Infrastructure Builders',
      engineer: 'Er. Suresh Yadav'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesType = filterType === 'all' || project.estimateType === filterType;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'road': return '🛣️';
      case 'building': return '🏢';
      case 'solar-pump': return '☀️';
      case 'water-chiller': return '❄️';
      case 'civil-work': return '🏗️';
      default: return '📋';
    }
  };

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'road': return 'bg-yellow-100 text-yellow-800';
      case 'building': return 'bg-blue-100 text-blue-800';
      case 'solar-pump': return 'bg-green-100 text-green-800';
      case 'water-chiller': return 'bg-cyan-100 text-cyan-800';
      case 'civil-work': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing': return <ClockIcon className="w-4 h-4" />;
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'delayed': return <AlertTriangleIcon className="w-4 h-4" />;
      case 'suspended': return <AlertTriangleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  // Calculate totals
  const totalEstimated = filteredProjects.reduce((sum, p) => sum + p.estimatedCost, 0);
  const totalSanctioned = filteredProjects.reduce((sum, p) => sum + p.sanctionedAmount, 0);
  const totalSpent = filteredProjects.reduce((sum, p) => sum + p.spentAmount, 0);
  const avgProgress = filteredProjects.length > 0 ? 
    filteredProjects.reduce((sum, p) => sum + p.physicalProgress, 0) / filteredProjects.length : 0;

  // Project type distribution
  const typeDistribution = projects.reduce((acc, project) => {
    acc[project.estimateType] = (acc[project.estimateType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Development Works Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive project management and monitoring</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admindashboard/development-works/work-estimate-dpr">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <CalculatorIcon className="w-4 h-4 mr-2" />
              Work Estimate & DPR
            </Button>
          </Link>
          <Link href="/admindashboard/development-works/progress-monitoring">
            <Button variant="outline">
              <TrendingUpIcon className="w-4 h-4 mr-2" />
              Progress Monitoring
            </Button>
          </Link>
          <Link href="/admindashboard/development-works/measurement-book">
            <Button variant="outline">
              <BookOpenIcon className="w-4 h-4 mr-2" />
              Measurement Book
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="approved-plans">Approved Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileTextIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold">{projects.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <IndianRupeeIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-xl font-bold">₹{totalEstimated.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUpIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Progress</p>
                    <p className="text-2xl font-bold">{Math.round(avgProgress)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangleIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delayed</p>
                    <p className="text-2xl font-bold">{projects.filter(p => p.status === 'delayed').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Link href="/admindashboard/development-works/work-estimate-dpr">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <CalculatorIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Work Estimate & DPR</h3>
                      <p className="text-gray-600 text-sm">Create estimates with PWD rates</p>
                      <div className="flex items-center text-blue-600 text-sm mt-2">
                        <span>Access Module</span>
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admindashboard/development-works/progress-monitoring">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUpIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Progress Monitoring</h3>
                      <p className="text-gray-600 text-sm">Track project progress & milestones</p>
                      <div className="flex items-center text-green-600 text-sm mt-2">
                        <span>Access Module</span>
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admindashboard/development-works/measurement-book">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <BookOpenIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Measurement Book</h3>
                      <p className="text-gray-600 text-sm">Record measurements & bill abstracts</p>
                      <div className="flex items-center text-purple-600 text-sm mt-2">
                        <span>Access Module</span>
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getProjectTypeColor(project.estimateType)}>
                          {getProjectTypeIcon(project.estimateType)} {project.estimateType.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1 capitalize">{project.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.location}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Physical Progress</span>
                          <span>{project.physicalProgress}%</span>
                        </div>
                        <Progress value={project.physicalProgress} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Financial Progress</span>
                          <span>{project.financialProgress}%</span>
                        </div>
                        <Progress value={project.financialProgress} className="h-2" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <span>₹{project.spentAmount.toLocaleString()} / ₹{project.sanctionedAmount.toLocaleString()}</span>
                      <span className="text-gray-600">{project.engineer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium">Project Type:</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48 mt-1">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="road">🛣️ Road</SelectItem>
                      <SelectItem value="building">🏢 Building</SelectItem>
                      <SelectItem value="solar-pump">☀️ Solar Pump</SelectItem>
                      <SelectItem value="water-chiller">❄️ Water Chiller</SelectItem>
                      <SelectItem value="civil-work">🏗️ Civil Work</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status:</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48 mt-1">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {filteredProjects.length} of {projects.length} projects
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge className={getProjectTypeColor(project.estimateType)}>
                        {getProjectTypeIcon(project.estimateType)} {project.estimateType.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1 capitalize">{project.status}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{project.location}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Physical Progress</span>
                        <span>{project.physicalProgress}%</span>
                      </div>
                      <Progress value={project.physicalProgress} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Financial Progress</span>
                        <span>{project.financialProgress}%</span>
                      </div>
                      <Progress value={project.financialProgress} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-gray-600">Estimated:</span>
                      <p className="font-semibold">₹{project.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Spent:</span>
                      <p className="font-semibold">₹{project.spentAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Measurements:</span>
                      <p className="font-semibold">{project.measurements}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Bills:</span>
                      <p className="font-semibold">{project.bills}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="text-sm text-gray-600">{project.contractor}</span>
                    <span className="text-sm text-gray-600">{project.engineer}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3Icon className="w-5 h-5" />
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Total Estimated</span>
                    <span className="font-bold text-blue-800">₹{totalEstimated.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Total Sanctioned</span>
                    <span className="font-bold text-green-800">₹{totalSanctioned.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700">Total Spent</span>
                    <span className="font-bold text-purple-800">₹{totalSpent.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-700">Budget Utilization</span>
                    <span className="font-bold text-orange-800">
                      {((totalSpent / totalSanctioned) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Project Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(typeDistribution).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getProjectTypeColor(type)}>
                          {getProjectTypeIcon(type)} {type.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / projects.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress Analytics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Progress Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {Math.round(projects.reduce((sum, p) => sum + p.physicalProgress, 0) / projects.length)}%
                    </div>
                    <p className="text-gray-600">Average Physical Progress</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {Math.round(projects.reduce((sum, p) => sum + p.financialProgress, 0) / projects.length)}%
                    </div>
                    <p className="text-gray-600">Average Financial Progress</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {projects.reduce((sum, p) => sum + p.measurements, 0)}
                    </div>
                    <p className="text-gray-600">Total Measurements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                    <FileTextIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Project Status Report</h3>
                  <p className="text-gray-600 text-sm mb-4">Comprehensive project progress report</p>
                  <Button className="w-full">Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                    <IndianRupeeIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Financial Report</h3>
                  <p className="text-gray-600 text-sm mb-4">Budget utilization and expenditure analysis</p>
                  <Button className="w-full">Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                    <BookOpenIcon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Measurement Report</h3>
                  <p className="text-gray-600 text-sm mb-4">Detailed measurement book summary</p>
                  <Button className="w-full">Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-orange-100 rounded-lg w-fit mx-auto mb-4">
                    <BarChart3Icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Performance Analytics</h3>
                  <p className="text-gray-600 text-sm mb-4">Project performance metrics and trends</p>
                  <Button className="w-full">Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto mb-4">
                    <AlertTriangleIcon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Issues & Delays</h3>
                  <p className="text-gray-600 text-sm mb-4">Project delays and issue tracking</p>
                  <Button className="w-full">Generate Report</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-cyan-100 rounded-lg w-fit mx-auto mb-4">
                    <TrendingUpIcon className="w-8 h-8 text-cyan-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Executive Summary</h3>
                  <p className="text-gray-600 text-sm mb-4">High-level project portfolio overview</p>
                  <Button className="w-full">Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="approved-plans">
          <Card>
            <CardHeader>
              <CardTitle>Approved Action Plan Works</CardTitle>
            </CardHeader>
            <CardContent>
              {!approvedPlans ? (
                <div className="text-center py-6 text-gray-500">Loading...</div>
              ) : approvedPlans.items?.length === 0 ? (
                <div className="text-center py-6 text-gray-500">No approved plans found.</div>
              ) : (
                <div className="space-y-4">
                  {approvedPlans.items.map((plan: any) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{plan.activityDescription}</h3>
                          <p className="text-sm text-gray-600">{plan.locationofAsset}</p>
                          <div className="mt-2 text-sm text-gray-600 flex gap-4">
                            <span>FY: {plan.financialYear}</span>
                            {plan.activityCode && <span>Activity: {plan.activityCode}</span>}
                            {typeof plan.estimatedCost !== 'undefined' && (
                              <span>Estimate: ₹{Number(plan.estimatedCost || 0).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Link
                            href={{
                              pathname: '/admindashboard/development-works/work-estimate-dpr',
                              query: {
                                tab: 'project-details',
                                name: plan.activityDescription,
                                location: plan.locationofAsset,
                                activityCode: plan.activityCode || '',
                                sanctionedAmount: plan.estimatedCost || '',
                              },
                            }}
                          >
                            <Button className="bg-blue-600 hover:bg-blue-700">Make Estimate</Button>
                          </Link>
                          <Link
                            href={{
                              pathname: '/admindashboard/development-works/work-estimate-dpr',
                              query: {
                                tab: 'dpr-summary',
                                name: plan.activityDescription,
                                location: plan.locationofAsset,
                                activityCode: plan.activityCode || '',
                                sanctionedAmount: plan.estimatedCost || '',
                              },
                            }}
                          >
                            <Button variant="outline">Abstract Details</Button>
                          </Link>
                          <Link
                            href={{
                              pathname: '/admindashboard/development-works/measurement-book',
                              query: {
                                id: plan.id,
                              },
                            }}
                          >
                            <Button variant="outline">Measurement Book</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
