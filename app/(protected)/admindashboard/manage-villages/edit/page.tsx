"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Search, Edit, MapPin, Users, Home, TreePine } from 'lucide-react'

type Village = {
    id: string
    name: string
    district: string
    population: number
    area: number
    type: 'rural' | 'urban' | 'suburban'
    description: string
}

const villages: Village[] = [
    { id: '1', name: 'Greenfield', district: 'Westshire', population: 1500, area: 25.5, type: 'rural', description: 'A peaceful farming community.' },
    { id: '2', name: 'Newtown', district: 'Eastborough', population: 5000, area: 40.2, type: 'suburban', description: 'A growing residential area with modern amenities.' },
    { id: '3', name: 'Riverside', district: 'Southdale', population: 3200, area: 30.8, type: 'rural', description: 'A picturesque village along the river.' },
    { id: '4', name: 'Hillcrest', district: 'Northfield', population: 8000, area: 55.6, type: 'urban', description: 'A bustling town center with diverse businesses.' },
    { id: '5', name: 'Oakville', district: 'Westshire', population: 2800, area: 35.3, type: 'suburban', description: 'A quiet suburb known for its beautiful oak trees.' },
]

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Village name must be at least 2 characters.",
    }),
    district: z.string().min(2, {
        message: "District name must be at least 2 characters.",
    }),
    population: z.number().min(1, {
        message: "Population must be at least 1.",
    }),
    area: z.number().min(0.1, {
        message: "Area must be at least 0.1 square kilometers.",
    }),
    type: z.enum(["rural", "urban", "suburban"]),
    description: z.string().optional(),
})

export default function Component() {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [selectedVillage, setSelectedVillage] = React.useState<Village | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            district: "",
            population: 0,
            area: 0,
            type: "rural",
            description: "",
        },
    })

    const filteredVillages = villages.filter(village =>
        village.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    function onSubmit(values: z.infer<typeof formSchema>) {
        toast({
            title: "Village Updated",
            description: `Successfully updated ${values.name}.`,
        })
        console.log(values)
        setSelectedVillage(null)
        form.reset()
    }

    const handleEditClick = (village: Village) => {
        setSelectedVillage(village)
        form.reset({
            name: village.name,
            district: village.district,
            population: village.population,
            area: village.area,
            type: village.type,
            description: village.description,
        })
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Edit Villages</CardTitle>
                    <CardDescription>Select a village to edit its details.</CardDescription>
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
                                <TableHead>Name</TableHead>
                                <TableHead>District</TableHead>
                                <TableHead>Population</TableHead>
                                <TableHead>Area (sq km)</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVillages.map(village => (
                                <TableRow key={village.id}>
                                    <TableCell className="font-medium">{village.name}</TableCell>
                                    <TableCell>{village.district}</TableCell>
                                    <TableCell>{village.population.toLocaleString()}</TableCell>
                                    <TableCell>{village.area.toFixed(1)}</TableCell>
                                    <TableCell>{village.type}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleEditClick(village)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {selectedVillage && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Edit Village: {selectedVillage.name}</CardTitle>
                        <CardDescription>Update the details of the selected village.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Village Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormDescription>The official name of the village.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>District</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormDescription>The district where the village is located.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="population"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Population</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                            </FormControl>
                                            <FormDescription>The current population of the village.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Area (sq km)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                            </FormControl>
                                            <FormDescription>The total area of the village in square kilometers.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Village Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select village type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="rural">Rural</SelectItem>
                                                    <SelectItem value="urban">Urban</SelectItem>
                                                    <SelectItem value="suburban">Suburban</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>The classification of the village.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormDescription>A short description of the village, its history, or notable features.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Update Village</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

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