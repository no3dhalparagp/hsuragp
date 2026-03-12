"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, TrendingUpIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon, MapPinIcon, CameraIcon, FileTextIcon } from 'lucide-react';
import { toast } from "@/components/ui/use-toast"
interface WorkProject {
  id: string;
  name: string;
  location: string;
  contractor: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  spentAmount: number;
  physicalProgress: number;
  financialProgress: number;
  status: 'ongoing' | 'completed' | 'delayed' | 'suspended';
  lastUpdated: string;
  engineerInCharge: string;
  estimateType: 'road' | 'building' | 'solar-pump' | 'water-chiller' | 'civil-work';
  activityCode: string;
  projectDimensions: {
    length?: number;
    width?: number;
    depth?: number;
    capacity?: number;
    unit?: string;
  };
  sanctionedAmount: number;
  workItems: number;
}

interface ProgressUpdate {
  id: string;
  projectId: string;
  date: string;
  physicalProgress: number;
  financialProgress: number;
  workDescription: string;
  photos: string[];
  issues: string;
  nextMilestone: string;
  updatedBy: string;
}

interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  targetDate: string;
  actualDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  percentage: number;
}

export default function WorkProgressMonitoringPage() {
  const [projects, setProjects] = useState<WorkProject[]>([
    {
      id: 'PROJ-001',
      name: 'Construction of Paka Drain with slab from Basanta Main Road',
      location: 'Village Rampur, Block A - Chakraborti Sansad',
      contractor: 'ABC Construction Ltd.',
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      totalCost: 331737,
      sanctionedAmount: 350000,
      spentAmount: 250000,
      physicalProgress: 45,
      financialProgress: 50,
      status: 'ongoing',
      lastUpdated: '2024-10-01',
      engineerInCharge: 'Er. Rajesh Kumar',
      estimateType: 'road',
      activityCode: '70330612',
      projectDimensions: {
        length: 100.0,
        width: 0.3,
        depth: 0.4,
        unit: 'M'
      },
      workItems: 10
    },
    {
      id: 'PROJ-002',
      name: 'School Building Construction - Primary School',
      location: 'Gram Panchayat Office Complex',
      contractor: 'XYZ Builders',
      startDate: '2024-02-01',
      endDate: '2024-08-01',
      totalCost: 8000000,
      sanctionedAmount: 8500000,
      spentAmount: 6400000,
      physicalProgress: 80,
      financialProgress: 80,
      status: 'ongoing',
      lastUpdated: '2024-09-28',
      engineerInCharge: 'Er. Priya Sharma',
      estimateType: 'building',
      activityCode: '45200001',
      projectDimensions: {
        length: 25.0,
        width: 15.0,
        depth: 3.5,
        unit: 'M'
      },
      workItems: 25
    },
    {
      id: 'PROJ-003',
      name: 'Solar Pump Installation - Water Supply',
      location: 'Multiple Villages - Zone A',
      contractor: 'Green Energy Solutions',
      startDate: '2024-03-01',
      endDate: '2024-07-01',
      totalCost: 485000,
      sanctionedAmount: 500000,
      spentAmount: 350000,
      physicalProgress: 65,
      financialProgress: 70,
      status: 'ongoing',
      lastUpdated: '2024-09-25',
      engineerInCharge: 'Er. Amit Singh',
      estimateType: 'solar-pump',
      activityCode: '27110001',
      projectDimensions: {
        capacity: 5,
        unit: 'HP'
      },
      workItems: 12
    },
    {
      id: 'PROJ-004',
      name: 'Water Chiller System - Community Center',
      location: 'Community Center, Main Block',
      contractor: 'Cool Tech Systems',
      startDate: '2024-04-01',
      endDate: '2024-08-01',
      totalCost: 750000,
      sanctionedAmount: 800000,
      spentAmount: 200000,
      physicalProgress: 25,
      financialProgress: 27,
      status: 'ongoing',
      lastUpdated: '2024-09-30',
      engineerInCharge: 'Er. Meera Patel',
      estimateType: 'water-chiller',
      activityCode: '28250001',
      projectDimensions: {
        capacity: 15,
        unit: 'TR'
      },
      workItems: 8
    },
    {
      id: 'PROJ-005',
      name: 'Bridge Construction over Seasonal Stream',
      location: 'Between Village A and B',
      contractor: 'Infrastructure Builders',
      startDate: '2024-05-01',
      endDate: '2024-12-01',
      totalCost: 1250000,
      sanctionedAmount: 1300000,
      spentAmount: 150000,
      physicalProgress: 15,
      financialProgress: 12,
      status: 'delayed',
      lastUpdated: '2024-09-20',
      engineerInCharge: 'Er. Suresh Yadav',
      estimateType: 'civil-work',
      activityCode: '42110001',
      projectDimensions: {
        length: 20.0,
        width: 3.0,
        depth: 1.5,
        unit: 'M'
      },
      workItems: 18
    }
  ]);

  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [newUpdate, setNewUpdate] = useState<Partial<ProgressUpdate>>({
    physicalProgress: 0,
    financialProgress: 0,
    workDescription: '',
    issues: '',
    nextMilestone: ''
  });
  
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    // Initialize with sample data
    const sampleUpdates: ProgressUpdate[] = [
      {
        id: 'UPD-001',
        projectId: 'PROJ-001',
        date: '2024-10-01',
        physicalProgress: 45,
        financialProgress: 50,
        workDescription: 'Completed foundation work for 2km stretch',
        photos: [],
        issues: 'Delay due to monsoon',
        nextMilestone: 'Complete base course laying',
        updatedBy: 'Er. Rajesh Kumar'
      }
    ];

    const sampleMilestones: Milestone[] = [
      {
        id: 'MIL-001',
        projectId: 'PROJ-001',
        title: 'Foundation Work',
        description: 'Complete foundation for entire road stretch',
        targetDate: '2024-03-15',
        actualDate: '2024-03-20',
        status: 'completed',
        percentage: 100
      },
      {
        id: 'MIL-002',
        projectId: 'PROJ-001',
        title: 'Base Course',
        description: 'Lay base course material',
        targetDate: '2024-04-30',
        status: 'in-progress',
        percentage: 60
      }
    ];

    setProgressUpdates(sampleUpdates);
    setMilestones(sampleMilestones);
  }, []);

  const addProgressUpdate = () => {
    if (!selectedProject || !newUpdate.workDescription) {
     
      return;
    }

    const update: ProgressUpdate = {
      id: `UPD-${Date.now()}`,
      projectId: selectedProject,
      date: new Date().toISOString().split('T')[0],
      physicalProgress: newUpdate.physicalProgress || 0,
      financialProgress: newUpdate.financialProgress || 0,
      workDescription: newUpdate.workDescription || '',
      photos: [],
      issues: newUpdate.issues || '',
      nextMilestone: newUpdate.nextMilestone || '',
      updatedBy: 'Current User' // In real app, get from session
    };

    setProgressUpdates(prev => [update, ...prev]);

    // Update project progress
    setProjects(prev => prev.map(project => 
      project.id === selectedProject 
        ? { 
            ...project, 
            physicalProgress: update.physicalProgress,
            financialProgress: update.financialProgress,
            lastUpdated: update.date
          }
        : project
    ));

    // Reset form
    setNewUpdate({
      physicalProgress: 0,
      financialProgress: 0,
      workDescription: '',
      issues: '',
      nextMilestone: ''
    });

   
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

  const calculateDelayDays = (endDate: string) => {
    const today = new Date();
    const targetDate = new Date(endDate);
    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const projectUpdates = progressUpdates.filter(u => u.projectId === selectedProject);
  const projectMilestones = milestones.filter(m => m.projectId === selectedProject);
  
  const filteredProjects = projects.filter(project => {
    if (filterType === 'all') return true;
    return project.estimateType === filterType;
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Progress Monitoring</h1>
          <p className="text-gray-600 mt-2">Track and monitor development work progress</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <TrendingUpIcon className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="project-details">Project Details</TabsTrigger>
          <TabsTrigger value="progress-updates">Progress Updates</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Filter Controls */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Label>Filter by Project Type:</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="All Project Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Project Types</SelectItem>
                    <SelectItem value="road">🛣️ Road Construction</SelectItem>
                    <SelectItem value="building">🏢 Building Construction</SelectItem>
                    <SelectItem value="solar-pump">☀️ Solar Pump</SelectItem>
                    <SelectItem value="water-chiller">❄️ Water Chiller</SelectItem>
                    <SelectItem value="civil-work">🏗️ Civil Work</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-600">
                  Showing {filteredProjects.length} of {projects.length} projects
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUpIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold">{filteredProjects.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ongoing</p>
                    <p className="text-2xl font-bold">{filteredProjects.filter(p => p.status === 'ongoing').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangleIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delayed</p>
                    <p className="text-2xl font-bold">{filteredProjects.filter(p => p.status === 'delayed').length}</p>
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
                    <p className="text-2xl font-bold">
                      {filteredProjects.length > 0 ? Math.round(filteredProjects.reduce((acc, p) => acc + p.physicalProgress, 0) / filteredProjects.length) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUpIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-lg font-bold">₹{filteredProjects.reduce((acc, p) => acc + p.totalCost, 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <Badge className={getProjectTypeColor(project.estimateType)}>
                            {getProjectTypeIcon(project.estimateType)} {project.estimateType.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            {project.location}
                          </span>
                          <span>Contractor: {project.contractor}</span>
                          <span>Activity: {project.activityCode}</span>
                        </div>
                        {/* Project Dimensions */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          {project.projectDimensions.length && (
                            <span>L: {project.projectDimensions.length}m</span>
                          )}
                          {project.projectDimensions.width && (
                            <span>W: {project.projectDimensions.width}m</span>
                          )}
                          {project.projectDimensions.depth && (
                            <span>D: {project.projectDimensions.depth}m</span>
                          )}
                          {project.projectDimensions.capacity && (
                            <span>Capacity: {project.projectDimensions.capacity} {project.projectDimensions.unit}</span>
                          )}
                          <span>Items: {project.workItems}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1 capitalize">{project.status}</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-gray-600">Estimated Cost:</span>
                        <span className="ml-2 font-semibold">₹{project.totalCost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sanctioned:</span>
                        <span className="ml-2 font-semibold">₹{project.sanctionedAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Spent:</span>
                        <span className="ml-2 font-semibold">₹{project.spentAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Budget Utilization:</span>
                        <span className={`ml-2 font-semibold ${project.totalCost > project.sanctionedAmount ? 'text-red-600' : 'text-green-600'}`}>
                          {((project.totalCost / project.sanctionedAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-gray-600">Engineer:</span>
                        <span className="ml-2">{project.engineerInCharge}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="ml-2">{new Date(project.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {project.status === 'delayed' && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        ⚠️ Project delayed by {calculateDelayDays(project.endDate)} days
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="project-details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Select Project</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {selectedProjectData && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{selectedProjectData.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Project Type and Basic Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={getProjectTypeColor(selectedProjectData.estimateType)}>
                        {getProjectTypeIcon(selectedProjectData.estimateType)} {selectedProjectData.estimateType.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-600">Activity Code: {selectedProjectData.activityCode}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Location</Label>
                        <p className="font-medium">{selectedProjectData.location}</p>
                      </div>
                      <div>
                        <Label>Contractor</Label>
                        <p className="font-medium">{selectedProjectData.contractor}</p>
                      </div>
                      <div>
                        <Label>Engineer In Charge</Label>
                        <p className="font-medium">{selectedProjectData.engineerInCharge}</p>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Badge className={getStatusColor(selectedProjectData.status)}>
                          {selectedProjectData.status}
                        </Badge>
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <p className="font-medium">{new Date(selectedProjectData.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <p className="font-medium">{new Date(selectedProjectData.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Dimensions */}
                  {Object.keys(selectedProjectData.projectDimensions).length > 0 && (
                    <div>
                      <Label className="text-lg font-semibold">Project Specifications</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        {selectedProjectData.projectDimensions.length && (
                          <div>
                            <Label>Length</Label>
                            <p className="font-medium">{selectedProjectData.projectDimensions.length} m</p>
                          </div>
                        )}
                        {selectedProjectData.projectDimensions.width && (
                          <div>
                            <Label>Width</Label>
                            <p className="font-medium">{selectedProjectData.projectDimensions.width} m</p>
                          </div>
                        )}
                        {selectedProjectData.projectDimensions.depth && (
                          <div>
                            <Label>Depth</Label>
                            <p className="font-medium">{selectedProjectData.projectDimensions.depth} m</p>
                          </div>
                        )}
                        {selectedProjectData.projectDimensions.capacity && (
                          <div>
                            <Label>Capacity</Label>
                            <p className="font-medium">{selectedProjectData.projectDimensions.capacity} {selectedProjectData.projectDimensions.unit}</p>
                          </div>
                        )}
                        <div>
                          <Label>Work Items</Label>
                          <p className="font-medium">{selectedProjectData.workItems} items</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Physical Progress</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={selectedProjectData.physicalProgress} className="flex-1" />
                        <span className="text-sm font-medium">{selectedProjectData.physicalProgress}%</span>
                      </div>
                    </div>
                    <div>
                      <Label>Financial Progress</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={selectedProjectData.financialProgress} className="flex-1" />
                        <span className="text-sm font-medium">{selectedProjectData.financialProgress}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Estimated Cost</Label>
                      <p className="text-lg font-semibold">₹{selectedProjectData.totalCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Sanctioned Amount</Label>
                      <p className="text-lg font-semibold">₹{selectedProjectData.sanctionedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Amount Spent</Label>
                      <p className="text-lg font-semibold">₹{selectedProjectData.spentAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Budget Analysis */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Budget Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>Budget Utilization:</span>
                        <span className={`font-medium ${selectedProjectData.totalCost > selectedProjectData.sanctionedAmount ? 'text-red-600' : 'text-green-600'}`}>
                          {((selectedProjectData.totalCost / selectedProjectData.sanctionedAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Remaining Budget:</span>
                        <span className={`font-medium ${selectedProjectData.sanctionedAmount - selectedProjectData.spentAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{(selectedProjectData.sanctionedAmount - selectedProjectData.spentAmount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost Variance:</span>
                        <span className={`font-medium ${selectedProjectData.totalCost > selectedProjectData.sanctionedAmount ? 'text-red-600' : 'text-green-600'}`}>
                          {selectedProjectData.totalCost > selectedProjectData.sanctionedAmount ? '+' : ''}₹{(selectedProjectData.totalCost - selectedProjectData.sanctionedAmount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expense Rate:</span>
                        <span className="font-medium">
                          {((selectedProjectData.spentAmount / selectedProjectData.sanctionedAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    {selectedProjectData.totalCost > selectedProjectData.sanctionedAmount && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        ⚠️ Budget exceeded by ₹{(selectedProjectData.totalCost - selectedProjectData.sanctionedAmount).toLocaleString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress-updates">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Progress Update</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Physical Progress (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newUpdate.physicalProgress || ''}
                      onChange={(e) => setNewUpdate(prev => ({ ...prev, physicalProgress: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label>Financial Progress (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newUpdate.financialProgress || ''}
                      onChange={(e) => setNewUpdate(prev => ({ ...prev, financialProgress: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Work Description</Label>
                  <Textarea
                    value={newUpdate.workDescription || ''}
                    onChange={(e) => setNewUpdate(prev => ({ ...prev, workDescription: e.target.value }))}
                    placeholder="Describe the work completed..."
                  />
                </div>

                <div>
                  <Label>Issues/Challenges</Label>
                  <Textarea
                    value={newUpdate.issues || ''}
                    onChange={(e) => setNewUpdate(prev => ({ ...prev, issues: e.target.value }))}
                    placeholder="Any issues or challenges faced..."
                  />
                </div>

                <div>
                  <Label>Next Milestone</Label>
                  <Input
                    value={newUpdate.nextMilestone || ''}
                    onChange={(e) => setNewUpdate(prev => ({ ...prev, nextMilestone: e.target.value }))}
                    placeholder="Next milestone to achieve..."
                  />
                </div>

                <Button onClick={addProgressUpdate} className="w-full">
                  <FileTextIcon className="w-4 h-4 mr-2" />
                  Add Update
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectUpdates.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No updates available. Select a project and add updates.</p>
                  ) : (
                    projectUpdates.map((update) => (
                      <div key={update.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{update.workDescription}</p>
                            <p className="text-sm text-gray-600">Updated by: {update.updatedBy}</p>
                          </div>
                          <Badge variant="outline">{new Date(update.date).toLocaleDateString()}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div className="text-sm">
                            <span className="text-gray-600">Physical:</span>
                            <span className="ml-2 font-medium">{update.physicalProgress}%</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Financial:</span>
                            <span className="ml-2 font-medium">{update.financialProgress}%</span>
                          </div>
                        </div>

                        {update.issues && (
                          <div className="text-sm">
                            <span className="text-gray-600">Issues:</span>
                            <p className="text-red-600 mt-1">{update.issues}</p>
                          </div>
                        )}

                        {update.nextMilestone && (
                          <div className="text-sm mt-2">
                            <span className="text-gray-600">Next Milestone:</span>
                            <p className="text-blue-600 mt-1">{update.nextMilestone}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProject && projectMilestones.length > 0 ? (
                <div className="space-y-4">
                  {projectMilestones.map((milestone) => (
                    <div key={milestone.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{milestone.title}</h4>
                          <p className="text-gray-600 text-sm">{milestone.description}</p>
                        </div>
                        <Badge className={getStatusColor(milestone.status)}>
                          {milestone.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <Label className="text-sm">Target Date</Label>
                          <p className="font-medium">{new Date(milestone.targetDate).toLocaleDateString()}</p>
                        </div>
                        {milestone.actualDate && (
                          <div>
                            <Label className="text-sm">Actual Date</Label>
                            <p className="font-medium">{new Date(milestone.actualDate).toLocaleDateString()}</p>
                          </div>
                        )}
                        <div>
                          <Label className="text-sm">Progress</Label>
                          <div className="flex items-center gap-2">
                            <Progress value={milestone.percentage} className="flex-1" />
                            <span className="text-sm font-medium">{milestone.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a project to view milestones or no milestones available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}



