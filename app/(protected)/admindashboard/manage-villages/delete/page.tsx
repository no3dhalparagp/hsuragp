"use client"

import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Search, Trash2, AlertTriangle, MapPin, Users, Home, TreePine } from 'lucide-react'

type Village = {
    id: string
    name: string
    district: string
    population: number
    area: number
    type: 'rural' | 'urban' | 'suburban'
}

const villages: Village[] = [
    { id: '1', name: 'Greenfield', district: 'Westshire', population: 1500, area: 25.5, type: 'rural' },
    { id: '2', name: 'Newtown', district: 'Eastborough', population: 5000, area: 40.2, type: 'suburban' },
    { id: '3', name: 'Riverside', district: 'Southdale', population: 3200, area: 30.8, type: 'rural' },
    { id: '4', name: 'Hillcrest', district: 'Northfield', population: 8000, area: 55.6, type: 'urban' },
    { id: '5', name: 'Oakville', district: 'Westshire', population: 2800, area: 35.3, type: 'suburban' },
]

export default function Component() {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [selectedVillages, setSelectedVillages] = React.useState<string[]>([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

    const filteredVillages = villages.filter(village =>
        village.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCheckboxChange = (checked: boolean, id: string) => {
        if (checked) {
            setSelectedVillages([...selectedVillages, id])
        } else {
            setSelectedVillages(selectedVillages.filter(villageId => villageId !== id))
        }
    }

    const handleDeleteVillages = () => {
        // In a real application, you would call an API to delete the villages here
        console.log('Deleting villages with IDs:', selectedVillages)
        toast({
            title: "Villages Deleted",
            description: `Successfully deleted ${selectedVillages.length} village(s).`,
        })
        setSelectedVillages([])
        setIsDeleteDialogOpen(false)
    }

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Delete Villages</CardTitle>
                    <CardDescription>Select villages to remove from the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4 mb-4">
                        <Input
                            placeholder="Search villages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <Button variant="outline">
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Select</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>District</TableHead>
                                <TableHead>Population</TableHead>
                                <TableHead>Area (sq km)</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVillages.map(village => (
                                <TableRow key={village.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedVillages.includes(village.id)}
                                            onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, village.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{village.name}</TableCell>
                                    <TableCell>{village.district}</TableCell>
                                    <TableCell>{village.population.toLocaleString()}</TableCell>
                                    <TableCell>{village.area.toFixed(1)}</TableCell>
                                    <TableCell>{village.type}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-4 flex justify-end">
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" disabled={selectedVillages.length === 0}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Selected Villages
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete the selected villages? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center space-x-2 text-yellow-500">
                                    <AlertTriangle className="h-6 w-6" />
                                    <p>You are about to delete {selectedVillages.length} village(s).</p>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                                    <Button variant="destructive" onClick={handleDeleteVillages}>Confirm Delete</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex space-x-4">
                    <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        Location
                    </div>
                    <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        Population
                    </div>
                    <div className="flex items-center">
                        <Home className="mr-1 h-4 w-4" />
                        Type
                    </div>
                    <div className="flex items-center">
                        <TreePine className="mr-1 h-4 w-4" />
                        Area
                    </div>
                </div>
                <div>
                    Total Villages: {filteredVillages.length}
                </div>
            </div>
        </div>
    )
}