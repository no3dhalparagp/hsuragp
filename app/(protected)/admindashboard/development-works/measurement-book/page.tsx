"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon, PrinterIcon, PlusIcon, EditIcon, FileTextIcon, CalculatorIcon, BookOpenIcon, IndianRupeeIcon } from 'lucide-react';
import { toast } from "@/components/ui/use-toast"
interface MeasurementEntry {
  id: string;
  projectId: string;
  workItemDescription: string;
  unit: string;
  rate: number;
  measuredDate: string;
  measuredBy: string;
  verifiedBy: string;
  length?: number;
  breadth?: number;
  height?: number;
  quantity: number;
  amount: number;
  remarks: string;
  status: 'draft' | 'verified' | 'approved';
}

interface BillAbstract {
  id: string;
  projectId: string;
  billNumber: string;
  billDate: string;
  period: string;
  totalWorkDone: number;
  previousBillAmount: number;
  currentBillAmount: number;
  cumulativeAmount: number;
  deductions: {
    securityDeposit: number;
    workContractTax: number;
    incomeTax: number;
    labourCess: number;
    other: number;
  };
  netPayable: number;
  status: 'draft' | 'submitted' | 'approved' | 'paid';
  createdBy: string;
  approvedBy?: string;
}

interface Project {
  id: string;
  name: string;
  location: string;
  contractor: string;
  agreementAmount: number;
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

export default function MeasurementBookPage() {
  const searchParams = useSearchParams();
  const [projects] = useState<Project[]>([
    {
      id: 'PROJ-001',
      name: 'Construction of Paka Drain with slab from Basanta Main Road',
      location: 'Village Rampur, Block A - Chakraborti Sansad',
      contractor: 'ABC Construction Ltd.',
      agreementAmount: 331737,
      sanctionedAmount: 350000,
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
      agreementAmount: 8000000,
      sanctionedAmount: 8500000,
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
      agreementAmount: 485000,
      sanctionedAmount: 500000,
      engineerInCharge: 'Er. Amit Singh',
      estimateType: 'solar-pump',
      activityCode: '27110001',
      projectDimensions: {
        capacity: 5,
        unit: 'HP'
      },
      workItems: 12
    }
  ]);

  const [measurements, setMeasurements] = useState<MeasurementEntry[]>([]);
  const [billAbstracts, setBillAbstracts] = useState<BillAbstract[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [isCreatingBill, setIsCreatingBill] = useState(false);

  const [newMeasurement, setNewMeasurement] = useState<Partial<MeasurementEntry>>({
    workItemDescription: '',
    unit: '',
    rate: 0,
    length: 0,
    breadth: 0,
    height: 0,
    quantity: 0,
    remarks: '',
    measuredDate: new Date().toISOString().split('T')[0]
  });

  const [newBill, setNewBill] = useState<Partial<BillAbstract>>({
    billNumber: '',
    period: '',
    previousBillAmount: 0,
    deductions: {
      securityDeposit: 0,
      workContractTax: 0,
      incomeTax: 0,
      labourCess: 0,
      other: 0
    }
  });

  useEffect(() => {
    // Initialize with sample data
    const sampleMeasurements: MeasurementEntry[] = [
      {
        id: 'MEAS-001',
        projectId: 'PROJ-001',
        workItemDescription: 'Earth work in excavation of foundation of structures as per drawing and technical specification',
        unit: 'M³',
        rate: 119.27,
        measuredDate: '2024-09-15',
        measuredBy: 'Er. Rajesh Kumar',
        verifiedBy: 'Er. Senior Engineer',
        length: 100.0,
        breadth: 0.3,
        height: 0.4,
        quantity: 12.0,
        amount: 1431.24,
        remarks: 'Excavation for drain foundation completed as per drawing',
        status: 'verified'
      },
      {
        id: 'MEAS-002',
        projectId: 'PROJ-001',
        workItemDescription: 'Sand filing in foundation trenches and at the back of abutments, wing-walls etc.',
        unit: 'M³',
        rate: 487.41,
        measuredDate: '2024-09-20',
        measuredBy: 'Er. Rajesh Kumar',
        verifiedBy: '',
        length: 100.0,
        breadth: 0.3,
        height: 0.15,
        quantity: 4.5,
        amount: 2193.35,
        remarks: 'Sand filing in foundation trenches',
        status: 'draft'
      },
      {
        id: 'MEAS-003',
        projectId: 'PROJ-001',
        workItemDescription: 'Providing and laying Design Mix concrete for plain reinforced concrete work',
        unit: 'M³',
        rate: 5668.27,
        measuredDate: '2024-09-25',
        measuredBy: 'Er. Rajesh Kumar',
        verifiedBy: '',
        length: 100.0,
        breadth: 0.3,
        height: 0.075,
        quantity: 2.25,
        amount: 12753.61,
        remarks: 'RCC work for drain slab',
        status: 'draft'
      },
      {
        id: 'MEAS-004',
        projectId: 'PROJ-002',
        workItemDescription: 'Excavation for foundation in ordinary soil',
        unit: 'Cum',
        rate: 145.50,
        measuredDate: '2024-09-10',
        measuredBy: 'Er. Priya Sharma',
        verifiedBy: 'Er. Senior Engineer',
        length: 25.0,
        breadth: 15.0,
        height: 1.5,
        quantity: 562.5,
        amount: 81843.75,
        remarks: 'Foundation excavation for school building',
        status: 'verified'
      },
      {
        id: 'MEAS-005',
        projectId: 'PROJ-003',
        workItemDescription: 'Solar Panel 320W Monocrystalline Installation',
        unit: 'Nos',
        rate: 12000.00,
        measuredDate: '2024-09-12',
        measuredBy: 'Er. Amit Singh',
        verifiedBy: '',
        quantity: 16,
        amount: 192000.00,
        remarks: 'Solar panels installed and tested',
        status: 'draft'
      }
    ];

    const sampleBills: BillAbstract[] = [
      {
        id: 'BILL-001',
        projectId: 'PROJ-001',
        billNumber: 'RB-001/2024',
        billDate: '2024-09-30',
        period: 'Sep 2024',
        totalWorkDone: 25,
        previousBillAmount: 0,
        currentBillAmount: 1250000,
        cumulativeAmount: 1250000,
        deductions: {
          securityDeposit: 62500,
          workContractTax: 12500,
          incomeTax: 12500,
          labourCess: 1250,
          other: 0
        },
        netPayable: 1161250,
        status: 'submitted',
        createdBy: 'Er. Rajesh Kumar'
      }
    ];

    setMeasurements(sampleMeasurements);
    setBillAbstracts(sampleBills);
  }, []);

  // Auto-select project from query params
  useEffect(() => {
    if (!searchParams) return;
    const projectId = searchParams.get('projectId') || searchParams.get('id');
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [searchParams]);

  const calculateQuantity = () => {
    const { length = 0, breadth = 0, height = 0, unit } = newMeasurement;
    let quantity = 0;

    if (unit === 'Cum') {
      quantity = length * breadth * height;
    } else if (unit === 'Sqm') {
      quantity = length * breadth;
    } else if (unit === 'Rmt') {
      quantity = length;
    } else {
      quantity = newMeasurement.quantity || 0;
    }

    const amount = quantity * (newMeasurement.rate || 0);

    setNewMeasurement(prev => ({
      ...prev,
      quantity,
      amount
    }));
  };

  useEffect(() => {
    calculateQuantity();
  }, [newMeasurement.length, newMeasurement.breadth, newMeasurement.height, newMeasurement.rate, newMeasurement.unit]);

  const addMeasurement = () => {
    if (!selectedProject || !newMeasurement.workItemDescription) {
      
      return;
    }

    const measurement: MeasurementEntry = {
      id: `MEAS-${Date.now()}`,
      projectId: selectedProject,
      workItemDescription: newMeasurement.workItemDescription || '',
      unit: newMeasurement.unit || '',
      rate: newMeasurement.rate || 0,
      measuredDate: newMeasurement.measuredDate || '',
      measuredBy: 'Current User',
      verifiedBy: '',
      length: newMeasurement.length,
      breadth: newMeasurement.breadth,
      height: newMeasurement.height,
      quantity: newMeasurement.quantity || 0,
      amount: newMeasurement.amount || 0,
      remarks: newMeasurement.remarks || '',
      status: 'draft'
    };

    setMeasurements(prev => [measurement, ...prev]);
    setNewMeasurement({
      workItemDescription: '',
      unit: '',
      rate: 0,
      length: 0,
      breadth: 0,
      height: 0,
      quantity: 0,
      remarks: '',
      measuredDate: new Date().toISOString().split('T')[0]
    });
    setIsAddingMeasurement(false);
    
  };

  const createBillAbstract = () => {
    if (!selectedProject || !newBill.billNumber) {
    
      return;
    }

    const projectMeasurements = measurements.filter(m => 
      m.projectId === selectedProject && m.status === 'verified'
    );

    const currentBillAmount = projectMeasurements.reduce((sum, m) => sum + m.amount, 0);
    const totalDeductions = Object.values(newBill.deductions || {}).reduce((sum, val) => sum + val, 0);
    const netPayable = currentBillAmount - totalDeductions;

    const bill: BillAbstract = {
      id: `BILL-${Date.now()}`,
      projectId: selectedProject,
      billNumber: newBill.billNumber || '',
      billDate: new Date().toISOString().split('T')[0],
      period: newBill.period || '',
      totalWorkDone: 0, // Calculate based on project progress
      previousBillAmount: newBill.previousBillAmount || 0,
      currentBillAmount,
      cumulativeAmount: (newBill.previousBillAmount || 0) + currentBillAmount,
      deductions: newBill.deductions || {
        securityDeposit: 0,
        workContractTax: 0,
        incomeTax: 0,
        labourCess: 0,
        other: 0
      },
      netPayable,
      status: 'draft',
      createdBy: 'Current User'
    };

    setBillAbstracts(prev => [bill, ...prev]);
    setNewBill({
      billNumber: '',
      period: '',
      previousBillAmount: 0,
      deductions: {
        securityDeposit: 0,
        workContractTax: 0,
        incomeTax: 0,
        labourCess: 0,
        other: 0
      }
    });
    setIsCreatingBill(false);
    
  };

  const verifyMeasurement = (measurementId: string) => {
    setMeasurements(prev => prev.map(m =>
      m.id === measurementId ? { ...m, status: 'verified', verifiedBy: 'Current User' } : m
    ));
  
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-purple-100 text-purple-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const projectMeasurements = measurements.filter(m => m.projectId === selectedProject);
  const projectBills = billAbstracts.filter(b => b.projectId === selectedProject);

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
          <h1 className="text-3xl font-bold text-gray-900">Measurement Book & Bill Abstract</h1>
          <p className="text-gray-600 mt-2">Record measurements and generate bill abstracts</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print MB
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Measurements</p>
                <p className="text-2xl font-bold">{measurements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold">{measurements.filter(m => m.status === 'verified').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <IndianRupeeIcon className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Bills Created</p>
                <p className="text-2xl font-bold">{billAbstracts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CalculatorIcon className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-lg font-bold">₹{measurements.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
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
                        <div className="flex items-center gap-2">
                          <span>{getProjectTypeIcon(project.estimateType)}</span>
                          <span>{project.name}</span>
                          <span className="text-sm text-gray-500">- {project.contractor}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedProjectData && (
        <Tabs defaultValue="measurements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="measurements">Measurement Entries</TabsTrigger>
            <TabsTrigger value="bill-abstract">Bill Abstract</TabsTrigger>
            <TabsTrigger value="project-summary">Project Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="measurements">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Measurement Book Entries</CardTitle>
                <Dialog open={isAddingMeasurement} onOpenChange={setIsAddingMeasurement}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Measurement Entry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Work Item Description</Label>
                        <Textarea
                          value={newMeasurement.workItemDescription || ''}
                          onChange={(e) => setNewMeasurement(prev => ({ ...prev, workItemDescription: e.target.value }))}
                          placeholder="Describe the work item..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Unit</Label>
                          <Select 
                            value={newMeasurement.unit || ''} 
                            onValueChange={(value) => setNewMeasurement(prev => ({ ...prev, unit: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cum">Cum</SelectItem>
                              <SelectItem value="Sqm">Sqm</SelectItem>
                              <SelectItem value="Rmt">Rmt</SelectItem>
                              <SelectItem value="Nos">Nos</SelectItem>
                              <SelectItem value="Kg">Kg</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Rate (₹)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newMeasurement.rate || ''}
                            onChange={(e) => setNewMeasurement(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Length (m)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newMeasurement.length || ''}
                            onChange={(e) => setNewMeasurement(prev => ({ ...prev, length: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                        <div>
                          <Label>Breadth (m)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newMeasurement.breadth || ''}
                            onChange={(e) => setNewMeasurement(prev => ({ ...prev, breadth: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                        <div>
                          <Label>Height (m)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newMeasurement.height || ''}
                            onChange={(e) => setNewMeasurement(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Calculated Quantity</Label>
                          <Input value={newMeasurement.quantity?.toFixed(2) || '0'} disabled />
                        </div>
                        <div>
                          <Label>Amount (₹)</Label>
                          <Input value={newMeasurement.amount?.toFixed(2) || '0'} disabled />
                        </div>
                      </div>

                      <div>
                        <Label>Remarks</Label>
                        <Textarea
                          value={newMeasurement.remarks || ''}
                          onChange={(e) => setNewMeasurement(prev => ({ ...prev, remarks: e.target.value }))}
                          placeholder="Any remarks or notes..."
                        />
                      </div>

                      <Button onClick={addMeasurement} className="w-full">
                        Add Measurement Entry
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {projectMeasurements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No measurement entries found. Add entries using the button above.</p>
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Work Description</TableHead>
                          <TableHead>Dimensions</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectMeasurements.map((measurement) => (
                          <TableRow key={measurement.id}>
                            <TableCell>{new Date(measurement.measuredDate).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-xs">
                              <div>
                                <p className="font-medium">{measurement.workItemDescription}</p>
                                <p className="text-sm text-gray-600">By: {measurement.measuredBy}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {measurement.unit === 'Cum' && (
                                <span className="text-sm">
                                  {measurement.length} × {measurement.breadth} × {measurement.height}
                                </span>
                              )}
                              {measurement.unit === 'Sqm' && (
                                <span className="text-sm">
                                  {measurement.length} × {measurement.breadth}
                                </span>
                              )}
                              {measurement.unit === 'Rmt' && (
                                <span className="text-sm">{measurement.length}m</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {measurement.quantity.toFixed(2)} {measurement.unit}
                            </TableCell>
                            <TableCell>₹{measurement.rate.toLocaleString()}</TableCell>
                            <TableCell className="font-semibold">₹{measurement.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(measurement.status)}>
                                {measurement.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {measurement.status === 'draft' && (
                                <Button
                                  size="sm"
                                  onClick={() => verifyMeasurement(measurement.id)}
                                >
                                  Verify
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bill-abstract">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Bill Abstract</CardTitle>
                <Dialog open={isCreatingBill} onOpenChange={setIsCreatingBill}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Create Bill
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create Bill Abstract</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Bill Number</Label>
                        <Input
                          value={newBill.billNumber || ''}
                          onChange={(e) => setNewBill(prev => ({ ...prev, billNumber: e.target.value }))}
                          placeholder="e.g., RB-002/2024"
                        />
                      </div>

                      <div>
                        <Label>Period</Label>
                        <Input
                          value={newBill.period || ''}
                          onChange={(e) => setNewBill(prev => ({ ...prev, period: e.target.value }))}
                          placeholder="e.g., Oct 2024"
                        />
                      </div>

                      <div>
                        <Label>Previous Bill Amount (₹)</Label>
                        <Input
                          type="number"
                          value={newBill.previousBillAmount || ''}
                          onChange={(e) => setNewBill(prev => ({ ...prev, previousBillAmount: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Deductions</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Input
                              type="number"
                              placeholder="Security Deposit"
                              value={newBill.deductions?.securityDeposit || ''}
                              onChange={(e) => setNewBill(prev => ({
                                ...prev,
                                deductions: { ...prev.deductions!, securityDeposit: parseFloat(e.target.value) || 0 }
                              }))}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Work Contract Tax"
                              value={newBill.deductions?.workContractTax || ''}
                              onChange={(e) => setNewBill(prev => ({
                                ...prev,
                                deductions: { ...prev.deductions!, workContractTax: parseFloat(e.target.value) || 0 }
                              }))}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Income Tax"
                              value={newBill.deductions?.incomeTax || ''}
                              onChange={(e) => setNewBill(prev => ({
                                ...prev,
                                deductions: { ...prev.deductions!, incomeTax: parseFloat(e.target.value) || 0 }
                              }))}
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Labour Cess"
                              value={newBill.deductions?.labourCess || ''}
                              onChange={(e) => setNewBill(prev => ({
                                ...prev,
                                deductions: { ...prev.deductions!, labourCess: parseFloat(e.target.value) || 0 }
                              }))}
                            />
                          </div>
                        </div>
                      </div>

                      <Button onClick={createBillAbstract} className="w-full">
                        Create Bill Abstract
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {projectBills.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No bill abstracts created. Create one using the button above.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectBills.map((bill) => (
                      <div key={bill.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{bill.billNumber}</h3>
                            <p className="text-gray-600">{bill.period}</p>
                          </div>
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Current Bill Amount</Label>
                            <p className="text-lg font-semibold">₹{bill.currentBillAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Total Deductions</Label>
                            <p className="text-lg font-semibold text-red-600">
                              ₹{Object.values(bill.deductions).reduce((sum, val) => sum + val, 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Net Payable</Label>
                            <p className="text-lg font-semibold text-green-600">₹{bill.netPayable.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Created by: {bill.createdBy}</span>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <EditIcon className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm">
                                <PrinterIcon className="w-4 h-4 mr-1" />
                                Print
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="project-summary">
            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Project Header */}
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getProjectTypeColor(selectedProjectData.estimateType)}>
                      {getProjectTypeIcon(selectedProjectData.estimateType)} {selectedProjectData.estimateType.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-600">Activity Code: {selectedProjectData.activityCode}</span>
                  </div>
                  <h2 className="text-xl font-bold">{selectedProjectData.name}</h2>
                  <p className="text-gray-600">{selectedProjectData.location}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Project Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Type:</span> {selectedProjectData.estimateType.replace('-', ' ')}</p>
                      <p><span className="font-medium">Contractor:</span> {selectedProjectData.contractor}</p>
                      <p><span className="font-medium">Engineer:</span> {selectedProjectData.engineerInCharge}</p>
                      <p><span className="font-medium">Work Items:</span> {selectedProjectData.workItems} items</p>
                    </div>
                    
                    {/* Project Dimensions */}
                    {Object.keys(selectedProjectData.projectDimensions).length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Specifications</h4>
                        <div className="space-y-1 text-sm">
                          {selectedProjectData.projectDimensions.length && (
                            <p>Length: {selectedProjectData.projectDimensions.length} m</p>
                          )}
                          {selectedProjectData.projectDimensions.width && (
                            <p>Width: {selectedProjectData.projectDimensions.width} m</p>
                          )}
                          {selectedProjectData.projectDimensions.depth && (
                            <p>Depth: {selectedProjectData.projectDimensions.depth} m</p>
                          )}
                          {selectedProjectData.projectDimensions.capacity && (
                            <p>Capacity: {selectedProjectData.projectDimensions.capacity} {selectedProjectData.projectDimensions.unit}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Measurement Summary</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Total Entries:</span> {projectMeasurements.length}</p>
                      <p><span className="font-medium">Verified Entries:</span> {projectMeasurements.filter(m => m.status === 'verified').length}</p>
                      <p><span className="font-medium">Draft Entries:</span> {projectMeasurements.filter(m => m.status === 'draft').length}</p>
                      <p><span className="font-medium">Total Measured Value:</span> ₹{projectMeasurements.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Financial Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Agreement Amount</p>
                      <p className="text-xl font-bold text-blue-800">₹{selectedProjectData.agreementAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Sanctioned Amount</p>
                      <p className="text-xl font-bold text-green-800">₹{selectedProjectData.sanctionedAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600">Total Measured</p>
                      <p className="text-xl font-bold text-purple-800">
                        ₹{projectMeasurements.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-3">Bill Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Total Bills</p>
                      <p className="text-2xl font-bold text-blue-800">{projectBills.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Total Billed</p>
                      <p className="text-lg font-bold text-green-800">
                        ₹{projectBills.reduce((sum, b) => sum + b.currentBillAmount, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600">Total Deductions</p>
                      <p className="text-lg font-bold text-red-800">
                        ₹{projectBills.reduce((sum, b) => sum + Object.values(b.deductions).reduce((acc, val) => acc + val, 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600">Net Payable</p>
                      <p className="text-lg font-bold text-purple-800">
                        ₹{projectBills.reduce((sum, b) => sum + b.netPayable, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Budget Analysis */}
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Budget Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>Budget Utilization:</span>
                        <span className={`font-medium ${selectedProjectData.agreementAmount > selectedProjectData.sanctionedAmount ? 'text-red-600' : 'text-green-600'}`}>
                          {((selectedProjectData.agreementAmount / selectedProjectData.sanctionedAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Measurement Progress:</span>
                        <span className="font-medium">
                          {((projectMeasurements.reduce((sum, m) => sum + m.amount, 0) / selectedProjectData.agreementAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}



