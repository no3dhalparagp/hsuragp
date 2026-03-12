"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEstimateTypes, useScheduleRates } from '@/lib/hooks/use-estimate-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, DownloadIcon, PlusIcon, SearchIcon, FileTextIcon, CalculatorIcon, EditIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface WorkItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  category: string;
}

interface DPRData {
  projectName: string;
  projectLocation: string;
  estimatedCost: number;
  sanctionedAmount: number;
  workItems: WorkItem[];
  startDate: string;
  completionDate: string;
  contractor: string;
  engineerInCharge: string;
  estimateType: string;
  activityCode: string;
  projectDimensions: {
    length?: number;
    width?: number;
    depth?: number;
    capacity?: number;
    unit?: string;
  };
  additionalCharges: {
    sgst: number;
    cgst: number;
    labourCess: number;
    contingency: number;
  };
}

export default function WorkEstimateDPRPage() {
  const searchParams = useSearchParams();
  const { estimateTypes, loading: typesLoading } = useEstimateTypes();
  const { 
    scheduleRates, 
    loading: ratesLoading, 
    fetchScheduleRates,
    createScheduleRate 
  } = useScheduleRates();

  const [dprData, setDprData] = useState<DPRData>({
    projectName: '',
    projectLocation: '',
    estimatedCost: 0,
    sanctionedAmount: 0,
    workItems: [],
    startDate: '',
    completionDate: '',
    contractor: '',
    engineerInCharge: '',
    estimateType: '',
    activityCode: '',
    projectDimensions: {},
    additionalCharges: {
      sgst: 9.0,
      cgst: 9.0,
      labourCess: 1.0,
      contingency: 3.0
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingRate, setIsAddingRate] = useState(false);
  const [newRate, setNewRate] = useState({
    estimateTypeId: '',
    code: '',
    description: '',
    unit: '',
    rate: 0,
    category: ''
  });

  const [activeTab, setActiveTab] = useState<string>('project-details');
  const [templates, setTemplates] = useState<any[]>([]);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  // Prefill from query params on first render
  useEffect(() => {
    if (!searchParams) return;
    const qp = (key: string) => searchParams.get(key) || '';
    const prefill: Partial<DPRData> = {
      projectName: qp('projectName') || qp('name') || '',
      projectLocation: qp('projectLocation') || qp('location') || '',
      contractor: qp('contractor') || '',
      engineerInCharge: qp('engineerInCharge') || '',
      estimateType: qp('estimateType') || '',
      activityCode: qp('activityCode') || '',
      sanctionedAmount: parseFloat(qp('sanctionedAmount')) || 0,
    };
    setDprData(prev => ({ ...prev, ...prefill }));

    const tab = qp('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Load schedule rates when estimate type changes
  useEffect(() => {
    if (dprData.estimateType) {
      const selectedType = estimateTypes.find(type => type.code === dprData.estimateType);
      if (selectedType) {
        fetchScheduleRates({ estimateTypeId: selectedType.id });
      }
    }
  }, [dprData.estimateType, estimateTypes, fetchScheduleRates]);

  // Set default estimate type when types are loaded
  useEffect(() => {
    if (estimateTypes.length > 0 && !dprData.estimateType) {
      setDprData(prev => ({ ...prev, estimateType: estimateTypes[0].code }));
    }
  }, [estimateTypes, dprData.estimateType]);

  // Set estimateTypeId when adding new rate
  useEffect(() => {
    if (isAddingRate && dprData.estimateType) {
      const selectedType = estimateTypes.find(type => type.code === dprData.estimateType);
      if (selectedType) {
        setNewRate(prev => ({ ...prev, estimateTypeId: selectedType.id }));
      }
    }
  }, [isAddingRate, dprData.estimateType, estimateTypes]);

  // Load templates for selected estimate type
  useEffect(() => {
    const controller = new AbortController();
    const type = dprData.estimateType;
    if (type) {
      fetch(`/api/development-works/estimate-templates?estimateType=${encodeURIComponent(type)}`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => setTemplates(data.items || []))
        .catch(() => setTemplates([]));
    }
    return () => controller.abort();
  }, [dprData.estimateType]);

  const addWorkItem = (scheduleItem: any, quantity: number) => {
    const newWorkItem: WorkItem = {
      id: `${scheduleItem.id}-${Date.now()}`,
      description: scheduleItem.description,
      unit: scheduleItem.unit,
      quantity: quantity,
      rate: scheduleItem.rate,
      amount: quantity * scheduleItem.rate,
      category: scheduleItem.category
    };

    setDprData(prev => ({
      ...prev,
      workItems: [...prev.workItems, newWorkItem],
      estimatedCost: prev.estimatedCost + newWorkItem.amount
    }));

   
  };

  const removeWorkItem = (itemId: string) => {
    const itemToRemove = dprData.workItems.find(item => item.id === itemId);
    if (itemToRemove) {
      setDprData(prev => ({
        ...prev,
        workItems: prev.workItems.filter(item => item.id !== itemId),
        estimatedCost: prev.estimatedCost - itemToRemove.amount
      }));
      
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setDprData(prev => ({
      ...prev,
      workItems: prev.workItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, amount: newQuantity * item.rate }
          : item
      )
    }));
    
    // Recalculate total cost
    const newTotal = dprData.workItems.reduce((total, item) => 
      item.id === itemId ? total + (newQuantity * item.rate) : total + item.amount, 0
    );
    setDprData(prev => ({ ...prev, estimatedCost: newTotal }));
  };

  const addNewScheduleRate = async () => {
    if (!newRate.estimateTypeId || !newRate.code || !newRate.description || !newRate.unit || !newRate.rate || !newRate.category) {
     
      return;
    }

    try {
      await createScheduleRate(newRate);
      setNewRate({
        estimateTypeId: '',
        code: '',
        description: '',
        unit: '',
        rate: 0,
        category: ''
      });
      setIsAddingRate(false);
     
    } catch (error) {
     
    }
  };

  const applyTemplate = (template: any) => {
    if (!Array.isArray(template?.items)) return;
    const added: WorkItem[] = template.items.map((t: any, idx: number) => {
      const quantity = Number(t.defaultQty || 0);
      const rate = Number(t.rate || 0);
      return {
        id: `${template.id}-${idx}-${Date.now()}`,
        description: t.description,
        unit: t.unit || '',
        quantity,
        rate,
        amount: quantity * rate,
        category: t.category || 'General'
      };
    });
    const delta = added.reduce((sum, it) => sum + it.amount, 0);
    setDprData(prev => ({
      ...prev,
      workItems: [...prev.workItems, ...added],
      estimatedCost: prev.estimatedCost + delta,
    }));
    setActiveTab('work-estimate');
  };

  const saveAsTemplate = async () => {
    if (!newTemplateName || dprData.workItems.length === 0 || !dprData.estimateType) return;
    setIsSavingTemplate(true);
    try {
      const payload = {
        name: newTemplateName,
        estimateType: dprData.estimateType,
        items: dprData.workItems.map(it => ({
          description: it.description,
          unit: it.unit,
          rate: it.rate,
          defaultQty: it.quantity,
          category: it.category,
        })),
      };
      const res = await fetch('/api/development-works/estimate-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setTemplates(prev => [created, ...prev]);
        setNewTemplateName('');
      }
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const calculateTotalWithCharges = () => {
    const subtotal = dprData.estimatedCost;
    const sgstAmount = (subtotal * dprData.additionalCharges.sgst) / 100;
    const cgstAmount = (subtotal * dprData.additionalCharges.cgst) / 100;
    const labourCessAmount = (subtotal * dprData.additionalCharges.labourCess) / 100;
    const contingencyAmount = (subtotal * dprData.additionalCharges.contingency) / 100;
    
    const totalAmount = subtotal + sgstAmount + cgstAmount + labourCessAmount + contingencyAmount;
    
    return {
      subtotal,
      sgstAmount,
      cgstAmount,
      labourCessAmount,
      contingencyAmount,
      totalAmount
    };
  };

  const generateDPR = () => {
    if (!dprData.projectName || dprData.workItems.length === 0) {
     
      return;
    }
    
    const costBreakdown = calculateTotalWithCharges();
    
    // Generate DPR document (in a real app, this would create a PDF)
    const dprContent = {
      ...dprData,
      costBreakdown,
      generatedDate: new Date().toISOString(),
      dprNumber: `DPR-${Date.now()}`
    };
    
    console.log('Generated DPR:', dprContent);
   
  };

  const filteredRates = scheduleRates.filter(rate => {
    const matchesSearch = rate.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || rate.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(scheduleRates.map(rate => rate.category))];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Estimate & DPR</h1>
          <p className="text-gray-600 mt-2">Create detailed project reports with WB PWD schedule rates</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateDPR} className="bg-green-600 hover:bg-green-700">
            <FileTextIcon className="w-4 h-4 mr-2" />
            Generate DPR
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Approved Plans Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Plans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Search approved plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="max-h-[420px] overflow-auto space-y-2">
                {/* In a real app, fetch from /api/approved-action-plans with search */}
                {/* We reuse scheduleRates as placeholder when API not loaded here */}
                {/** Ideally, replace below with fetched plans list */}
                {(Array.isArray([]) ? [] : []).length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-6">Use the Development Works page to browse plans, or paste details to the right.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center: Builder (Tabs) */}
        <div className="lg:col-span-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="project-details">Project Details</TabsTrigger>
              <TabsTrigger value="schedule-rates">Schedule Rates</TabsTrigger>
              <TabsTrigger value="work-estimate">Work Estimate</TabsTrigger>
              <TabsTrigger value="dpr-summary">DPR Summary</TabsTrigger>
            </TabsList>

        <TabsContent value="project-details">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="w-5 h-5" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimateType">Estimate Type</Label>
                  <Select 
                    value={dprData.estimateType} 
                    onValueChange={(value: string) => {
                      setDprData(prev => ({ ...prev, estimateType: value }));
                    }}
                    disabled={typesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={typesLoading ? "Loading..." : "Select estimate type"} />
                    </SelectTrigger>
                    <SelectContent>
                      {estimateTypes.map(type => (
                        <SelectItem key={type.id} value={type.code}>
                          <div className="flex items-center gap-2">
                            {type.icon && <span>{type.icon}</span>}
                            <span>{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="activityCode">Activity Code</Label>
                  <Input
                    id="activityCode"
                    value={dprData.activityCode}
                    onChange={(e) => setDprData(prev => ({ ...prev, activityCode: e.target.value }))}
                    placeholder="e.g., 70330612"
                  />
                </div>
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={dprData.projectName}
                    onChange={(e) => setDprData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label htmlFor="projectLocation">Project Location</Label>
                  <Input
                    id="projectLocation"
                    value={dprData.projectLocation}
                    onChange={(e) => setDprData(prev => ({ ...prev, projectLocation: e.target.value }))}
                    placeholder="Enter project location"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dprData.startDate}
                    onChange={(e) => setDprData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="completionDate">Completion Date</Label>
                  <Input
                    id="completionDate"
                    type="date"
                    value={dprData.completionDate}
                    onChange={(e) => setDprData(prev => ({ ...prev, completionDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="contractor">Contractor</Label>
                  <Input
                    id="contractor"
                    value={dprData.contractor}
                    onChange={(e) => setDprData(prev => ({ ...prev, contractor: e.target.value }))}
                    placeholder="Enter contractor name"
                  />
                </div>
                <div>
                  <Label htmlFor="engineerInCharge">Engineer In Charge</Label>
                  <Input
                    id="engineerInCharge"
                    value={dprData.engineerInCharge}
                    onChange={(e) => setDprData(prev => ({ ...prev, engineerInCharge: e.target.value }))}
                    placeholder="Enter engineer name"
                  />
                </div>
                <div>
                  <Label htmlFor="sanctionedAmount">Sanctioned Amount (₹)</Label>
                  <Input
                    id="sanctionedAmount"
                    type="number"
                    value={dprData.sanctionedAmount}
                    onChange={(e) => setDprData(prev => ({ ...prev, sanctionedAmount: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter sanctioned amount"
                  />
                </div>
              </div>

              {/* Project Dimensions Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Project Dimensions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(() => {
                    const selectedType = estimateTypes.find(type => type.code === dprData.estimateType);
                    const dimensionFields = selectedType?.dimensionFields;
                    
                    if (!dimensionFields) return null;
                    
                    return (
                      <>
                        {dimensionFields.required?.includes('length') && (
                          <div>
                            <Label htmlFor="length">Length ({dimensionFields.units?.[0] || 'm'})</Label>
                            <Input
                              id="length"
                              type="number"
                              step="0.01"
                              value={dprData.projectDimensions.length || ''}
                              onChange={(e) => setDprData(prev => ({ 
                                ...prev, 
                                projectDimensions: { ...prev.projectDimensions, length: parseFloat(e.target.value) || 0 }
                              }))}
                              placeholder="Enter length"
                            />
                          </div>
                        )}
                        
                        {dimensionFields.required?.includes('width') && (
                          <div>
                            <Label htmlFor="width">Width ({dimensionFields.units?.[0] || 'm'})</Label>
                            <Input
                              id="width"
                              type="number"
                              step="0.01"
                              value={dprData.projectDimensions.width || ''}
                              onChange={(e) => setDprData(prev => ({ 
                                ...prev, 
                                projectDimensions: { ...prev.projectDimensions, width: parseFloat(e.target.value) || 0 }
                              }))}
                              placeholder="Enter width"
                            />
                          </div>
                        )}
                        
                        {(dimensionFields.required?.includes('depth') || dimensionFields.optional?.includes('depth')) && (
                          <div>
                            <Label htmlFor="depth">Depth ({dimensionFields.units?.[0] || 'm'})</Label>
                            <Input
                              id="depth"
                              type="number"
                              step="0.01"
                              value={dprData.projectDimensions.depth || ''}
                              onChange={(e) => setDprData(prev => ({ 
                                ...prev, 
                                projectDimensions: { ...prev.projectDimensions, depth: parseFloat(e.target.value) || 0 }
                              }))}
                              placeholder="Enter depth"
                            />
                          </div>
                        )}
                        
                        {dimensionFields.required?.includes('capacity') && (
                          <div>
                            <Label htmlFor="capacity">Capacity ({dimensionFields.units?.[0] || 'Units'})</Label>
                            <Input
                              id="capacity"
                              type="number"
                              step="0.01"
                              value={dprData.projectDimensions.capacity || ''}
                              onChange={(e) => setDprData(prev => ({ 
                                ...prev, 
                                projectDimensions: { ...prev.projectDimensions, capacity: parseFloat(e.target.value) || 0 }
                              }))}
                              placeholder={`Enter capacity (${dimensionFields.units?.[0] || 'Units'})`}
                            />
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Additional Charges Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Additional Charges (%)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="sgst">SGST</Label>
                    <Input
                      id="sgst"
                      type="number"
                      step="0.1"
                      value={dprData.additionalCharges.sgst}
                      onChange={(e) => setDprData(prev => ({ 
                        ...prev, 
                        additionalCharges: { ...prev.additionalCharges, sgst: parseFloat(e.target.value) || 0 }
                      }))}
                      placeholder="9.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cgst">CGST</Label>
                    <Input
                      id="cgst"
                      type="number"
                      step="0.1"
                      value={dprData.additionalCharges.cgst}
                      onChange={(e) => setDprData(prev => ({ 
                        ...prev, 
                        additionalCharges: { ...prev.additionalCharges, cgst: parseFloat(e.target.value) || 0 }
                      }))}
                      placeholder="9.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="labourCess">Labour Cess</Label>
                    <Input
                      id="labourCess"
                      type="number"
                      step="0.1"
                      value={dprData.additionalCharges.labourCess}
                      onChange={(e) => setDprData(prev => ({ 
                        ...prev, 
                        additionalCharges: { ...prev.additionalCharges, labourCess: parseFloat(e.target.value) || 0 }
                      }))}
                      placeholder="1.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contingency">Contingency</Label>
                    <Input
                      id="contingency"
                      type="number"
                      step="0.1"
                      value={dprData.additionalCharges.contingency}
                      onChange={(e) => setDprData(prev => ({ 
                        ...prev, 
                        additionalCharges: { ...prev.additionalCharges, contingency: parseFloat(e.target.value) || 0 }
                      }))}
                      placeholder="3.0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </TabsContent>

            <TabsContent value="schedule-rates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalculatorIcon className="w-5 h-5" />
                Schedule Rates (Manual Entry)
              </CardTitle>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Apply Template</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-auto">
                    <DropdownMenuLabel>Templates for {dprData.estimateType || '—'}</DropdownMenuLabel>
                    {templates.length === 0 ? (
                      <div className="text-sm text-gray-500 p-3">No templates found. Save one from your current estimate.</div>
                    ) : (
                      templates.map(t => (
                        <DropdownMenuItem key={t.id} onClick={() => applyTemplate(t)}>
                          <div>
                            <div className="font-medium">{t.name}</div>
                            <div className="text-xs text-gray-500">{t.items.length} items</div>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog open={isSavingTemplate} onOpenChange={setIsSavingTemplate}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Save as Template</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Current Estimate as Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tplName">Template Name</Label>
                        <Input id="tplName" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} placeholder="e.g., RCC Drain 1m x 0.3m x 0.4m" />
                      </div>
                      <Button className="w-full" onClick={saveAsTemplate} disabled={!newTemplateName || dprData.workItems.length === 0}>Save Template</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={isAddingRate} onOpenChange={setIsAddingRate}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Rate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Schedule Rate</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                    <div>
                      <Label htmlFor="rateCode">Rate Code *</Label>
                      <Input
                        id="rateCode"
                        value={newRate.code}
                        onChange={(e) => setNewRate(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="e.g., WB-006, CUSTOM-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rateDescription">Description *</Label>
                      <Textarea
                        id="rateDescription"
                        value={newRate.description}
                        onChange={(e) => setNewRate(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter work item description..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rateUnit">Unit *</Label>
                        <Select 
                          value={newRate.unit} 
                          onValueChange={(value) => setNewRate(prev => ({ ...prev, unit: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M³">M³</SelectItem>
                            <SelectItem value="Cum">Cum</SelectItem>
                            <SelectItem value="Sqm">Sqm</SelectItem>
                            <SelectItem value="M²">M²</SelectItem>
                            <SelectItem value="Rmt">Rmt</SelectItem>
                            <SelectItem value="Nos">Nos</SelectItem>
                            <SelectItem value="Kg">Kg</SelectItem>
                            <SelectItem value="MT">MT</SelectItem>
                            <SelectItem value="Tonne">Tonne</SelectItem>
                            <SelectItem value="Ltr">Ltr</SelectItem>
                            <SelectItem value="Lot">Lot</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="rateValue">Rate (₹) *</Label>
                        <Input
                          id="rateValue"
                          type="number"
                          step="0.01"
                          value={newRate.rate || ''}
                          onChange={(e) => setNewRate(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                          placeholder="Enter rate..."
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="rateCategory">Category *</Label>
                      <Input
                        id="rateCategory"
                        value={newRate.category}
                        onChange={(e) => setNewRate(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Earthwork, Masonry, Concrete..."
                      />
                    </div>
                    <Button 
                      onClick={addNewScheduleRate} 
                      className="w-full"
                      disabled={ratesLoading}
                    >
                      {ratesLoading ? 'Adding...' : 'Add Schedule Rate'}
                    </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search rates by description or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Rate (₹)</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRates.map((rate) => (
                      <TableRow key={rate.id}>
                        <TableCell className="font-mono">{rate.id}</TableCell>
                        <TableCell>{rate.description}</TableCell>
                        <TableCell>{rate.unit}</TableCell>
                        <TableCell className="font-semibold">₹{rate.rate.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{rate.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => {
                              const quantity = prompt('Enter quantity:');
                              if (quantity && !isNaN(parseFloat(quantity))) {
                                addWorkItem(rate, parseFloat(quantity));
                              }
                            }}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
            </TabsContent>

            <TabsContent value="work-estimate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalculatorIcon className="w-5 h-5" />
                Work Estimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dprData.workItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No work items added yet. Go to Schedule Rates tab to add items.</p>
                </div>
              ) : (
                <>
                  <div className="border rounded-lg mb-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Rate (₹)</TableHead>
                          <TableHead>Amount (₹)</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dprData.workItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value) || 0)}
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>₹{item.rate.toLocaleString()}</TableCell>
                            <TableCell className="font-semibold">₹{item.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeWorkItem(item.id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Subtotal:</span>
                      <span className="font-semibold">₹{dprData.estimatedCost.toLocaleString()}</span>
                    </div>
                    
                    {(() => {
                      const breakdown = calculateTotalWithCharges();
                      return (
                        <>
                          <div className="flex justify-between items-center text-sm">
                            <span>SGST @ {dprData.additionalCharges.sgst}%:</span>
                            <span>₹{breakdown.sgstAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>CGST @ {dprData.additionalCharges.cgst}%:</span>
                            <span>₹{breakdown.cgstAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Labour Cess @ {dprData.additionalCharges.labourCess}%:</span>
                            <span>₹{breakdown.labourCessAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Contingency @ {dprData.additionalCharges.contingency}%:</span>
                            <span>₹{breakdown.contingencyAmount.toLocaleString()}</span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total Amount:</span>
                            <span className="text-green-600">₹{breakdown.totalAmount.toLocaleString()}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
            </TabsContent>

            <TabsContent value="dpr-summary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="w-5 h-5" />
                DPR Summary - {dprData.estimateType ? dprData.estimateType.replace('-', ' ').toUpperCase() : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Estimate Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-bold">Estimate for the {dprData.projectName}</h2>
                <p className="text-gray-600">{dprData.projectLocation}</p>
                {dprData.activityCode && <p className="text-sm">Activity Code: {dprData.activityCode}</p>}
              </div>

              {/* Project Specifications */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Project Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><span className="font-medium">Type:</span> {dprData.estimateType?.replace('-', ' ')}</p>
                    <p><span className="font-medium">Name:</span> {dprData.projectName || 'Not specified'}</p>
                    <p><span className="font-medium">Location:</span> {dprData.projectLocation || 'Not specified'}</p>
                    <p><span className="font-medium">Contractor:</span> {dprData.contractor || 'Not specified'}</p>
                    <p><span className="font-medium">Engineer In Charge:</span> {dprData.engineerInCharge || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    {Object.keys(dprData.projectDimensions).length > 0 && (
                      <>
                        <h4 className="font-medium">Dimensions:</h4>
                        {dprData.projectDimensions.length && <p>Length: {dprData.projectDimensions.length}m</p>}
                        {dprData.projectDimensions.width && <p>Width: {dprData.projectDimensions.width}m</p>}
                        {dprData.projectDimensions.depth && <p>Depth: {dprData.projectDimensions.depth}m</p>}
                        {dprData.projectDimensions.capacity && (
                          <p>Capacity: {dprData.projectDimensions.capacity} {dprData.estimateType === 'solar-pump' ? 'HP' : 'TR'}</p>
                        )}
                      </>
                    )}
                    <p><span className="font-medium">Start Date:</span> {dprData.startDate ? new Date(dprData.startDate).toLocaleDateString() : 'Not specified'}</p>
                    <p><span className="font-medium">Completion Date:</span> {dprData.completionDate ? new Date(dprData.completionDate).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Cost Breakdown */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Financial Analysis</h3>
                {(() => {
                  const breakdown = calculateTotalWithCharges();
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium">Cost Components</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Work Items Subtotal:</span>
                            <span className="font-medium">₹{breakdown.subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SGST @ {dprData.additionalCharges.sgst}%:</span>
                            <span>₹{breakdown.sgstAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CGST @ {dprData.additionalCharges.cgst}%:</span>
                            <span>₹{breakdown.cgstAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Labour Cess @ {dprData.additionalCharges.labourCess}%:</span>
                            <span>₹{breakdown.labourCessAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Contingency @ {dprData.additionalCharges.contingency}%:</span>
                            <span>₹{breakdown.contingencyAmount.toLocaleString()}</span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total Amount:</span>
                            <span className="text-green-600">₹{breakdown.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Budget Analysis</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Estimated Total:</span>
                            <span className="font-medium">₹{breakdown.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sanctioned Amount:</span>
                            <span className="font-medium">₹{dprData.sanctionedAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Variance:</span>
                            <span className={`font-medium ${breakdown.totalAmount > dprData.sanctionedAmount ? 'text-red-600' : 'text-green-600'}`}>
                              {breakdown.totalAmount > dprData.sanctionedAmount ? '+' : ''}₹{Math.abs(breakdown.totalAmount - dprData.sanctionedAmount).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Utilization:</span>
                            <span className="font-medium">
                              {dprData.sanctionedAmount > 0 ? ((breakdown.totalAmount / dprData.sanctionedAmount) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                        </div>
                        
                        {breakdown.totalAmount > dprData.sanctionedAmount && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            ⚠️ Budget Exceeded: Estimated cost exceeds sanctioned amount by ₹{(breakdown.totalAmount - dprData.sanctionedAmount).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Work Items Summary */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Work Items Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total Items</p>
                    <p className="text-2xl font-bold text-blue-800">{dprData.workItems.length}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600">Categories</p>
                    <p className="text-2xl font-bold text-green-800">
                      {new Set(dprData.workItems.map(item => item.category)).size}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Items Cost</p>
                    <p className="text-lg font-bold text-purple-800">₹{dprData.estimatedCost.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600">Final Total</p>
                    <p className="text-lg font-bold text-orange-800">₹{calculateTotalWithCharges().totalAmount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Category-wise breakdown */}
                {dprData.workItems.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Category-wise Breakdown</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from(new Set(dprData.workItems.map(item => item.category))).map(category => {
                        const categoryItems = dprData.workItems.filter(item => item.category === category);
                        const categoryTotal = categoryItems.reduce((sum, item) => sum + item.amount, 0);
                        return (
                          <div key={category} className="border rounded p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{category}</span>
                              <span className="text-sm">({categoryItems.length} items)</span>
                            </div>
                            <div className="text-lg font-semibold text-gray-700">
                              ₹{categoryTotal.toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Final Summary */}
              <div className="border-t pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    Total Estimate: ₹{calculateTotalWithCharges().totalAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {dprData.estimateType?.replace('-', ' ')} - {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Live Summary */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estimate Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Project</div>
                <div className="font-semibold">{dprData.projectName || '—'}</div>
                <div className="text-sm text-gray-600">{dprData.projectLocation || ''}</div>
                {!!dprData.activityCode && (
                  <div className="text-xs text-gray-500 mt-1">Activity: {dprData.activityCode}</div>
                )}
              </div>
              {(() => {
                const breakdown = calculateTotalWithCharges();
                return (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Items Subtotal</span>
                      <span className="font-medium">₹{breakdown.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SGST ({dprData.additionalCharges.sgst}%)</span>
                      <span>₹{breakdown.sgstAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>CGST ({dprData.additionalCharges.cgst}%)</span>
                      <span>₹{breakdown.cgstAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Labour Cess ({dprData.additionalCharges.labourCess}%)</span>
                      <span>₹{breakdown.labourCessAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Contingency ({dprData.additionalCharges.contingency}%)</span>
                      <span>₹{breakdown.contingencyAmount.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span className="text-green-700">₹{breakdown.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sanctioned</span>
                      <span>₹{dprData.sanctionedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Variance</span>
                      <span className={`${breakdown.totalAmount > dprData.sanctionedAmount ? 'text-red-600' : 'text-green-600'} font-medium`}>
                        {breakdown.totalAmount > dprData.sanctionedAmount ? '+' : ''}₹{Math.abs(breakdown.totalAmount - dprData.sanctionedAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })()}
              <div className="pt-2 flex flex-col gap-2">
                <Button onClick={generateDPR} className="w-full">Generate DPR</Button>
                <Link
                  href={{
                    pathname: '/admindashboard/development-works/measurement-book',
                    query: { id: searchParams?.get('id') || '' },
                  }}
                >
                  <Button variant="outline" className="w-full">Open Measurement Book</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



