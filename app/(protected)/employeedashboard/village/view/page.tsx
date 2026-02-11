"use client"

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Search, ChevronLeft, ChevronRight, Users, Home, MapPin } from "lucide-react"

type Village = {
  id: string;
  name: string;
  population: number;
  households: number;
  area: number;
  headman: string;
  mainOccupation: string;
}

const mockVillages: Village[] = [
  { id: 'V001', name: 'Sundarpur', population: 5000, households: 1200, area: 10.5, headman: 'Rajesh Kumar', mainOccupation: 'Agriculture' },
  { id: 'V002', name: 'Chandanagar', population: 3500, households: 800, area: 8.2, headman: 'Priya Singh', mainOccupation: 'Fishing' },
  { id: 'V003', name: 'Greenville', population: 6200, households: 1500, area: 12.7, headman: 'Amit Patel', mainOccupation: 'Textile' },
  { id: 'V004', name: 'Riverside', population: 4800, households: 1100, area: 9.8, headman: 'Sneha Gupta', mainOccupation: 'Agriculture' },
  { id: 'V005', name: 'Hilltown', population: 2800, households: 650, area: 7.5, headman: 'Vikram Reddy', mainOccupation: 'Tourism' },
]

export default function ViewVillageDetails() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null)
  const villagesPerPage = 10

  const filteredVillages = mockVillages.filter(village => 
    village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    village.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastVillage = currentPage * villagesPerPage
  const indexOfFirstVillage = indexOfLastVillage - villagesPerPage
  const currentVillages = filteredVillages.slice(indexOfFirstVillage, indexOfLastVillage)

  const totalPages = Math.ceil(filteredVillages.length / villagesPerPage)

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">View Village Details</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search villages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Villages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Population</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentVillages.map((village) => (
                  <TableRow key={village.id}>
                    <TableCell>{village.id}</TableCell>
                    <TableCell>{village.name}</TableCell>
                    <TableCell>{village.population}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedVillage(village)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Village Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedVillage ? (
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="demographics">Demographics</TabsTrigger>
                  <TabsTrigger value="economy">Economy</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="space-y-4">
                    <div>
                      <Label>Village ID</Label>
                      <Input value={selectedVillage.id} readOnly />
                    </div>
                    <div>
                      <Label>Village Name</Label>
                      <Input value={selectedVillage.name} readOnly />
                    </div>
                    <div>
                      <Label>Area (sq km)</Label>
                      <Input value={selectedVillage.area.toString()} readOnly />
                    </div>
                    <div>
                      <Label>Village Headman</Label>
                      <Input value={selectedVillage.headman} readOnly />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="demographics">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label>Total Population</Label>
                        <p className="text-2xl font-bold">{selectedVillage.population}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Home className="h-5 w-5 text-green-500" />
                      <div>
                        <Label>Number of Households</Label>
                        <p className="text-2xl font-bold">{selectedVillage.households}</p>
                      </div>
                    </div>
                    <div>
                      <Label>Average Household Size</Label>
                      <p className="text-xl">{(selectedVillage.population / selectedVillage.households).toFixed(2)} persons</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="economy">
                  <div className="space-y-4">
                    <div>
                      <Label>Main Occupation</Label>
                      <Input value={selectedVillage.mainOccupation} readOnly />
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-red-500" />
                      <div>
                        <Label>Population Density</Label>
                        <p className="text-xl">{(selectedVillage.population / selectedVillage.area).toFixed(2)} persons/sq km</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-4">
                Select a village to view its details.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
