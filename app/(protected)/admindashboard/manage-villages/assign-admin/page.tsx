"use client"

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Search, UserPlus, MapPin, Users, Home, TreePine } from 'lucide-react'

type Village = {
    id: string
    name: string
    district: string
    currentAdmin: string | null
}

type Administrator = {
    id: string
    name: string
    email: string
}

const villages: Village[] = [
    { id: '1', name: 'Greenfield', district: 'Westshire', currentAdmin: 'John Doe' },
    { id: '2', name: 'Newtown', district: 'Eastborough', currentAdmin: null },
    { id: '3', name: 'Riverside', district: 'Southdale', currentAdmin: 'Jane Smith' },
    { id: '4', name: 'Hillcrest', district: 'Northfield', currentAdmin: null },
    { id: '5', name: 'Oakville', district: 'Westshire', currentAdmin: 'Bob Johnson' },
]

const administrators: Administrator[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com' },
    { id: '4', name: 'Alice Brown', email: 'alice.brown@example.com' },
    { id: '5', name: 'Charlie Davis', email: 'charlie.davis@example.com' },
]

const formSchema = z.object({
    villageId: z.string().min(1, { message: "Please select a village" }),
    administratorId: z.string().min(1, { message: "Please select an administrator" }),
})

export default function Component() {
    const [searchTerm, setSearchTerm] = React.useState('')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            villageId: "",
            administratorId: "",
        },
    })

    const filteredVillages = villages.filter(village =>
        village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.district.toLowerCase().includes(searchTerm.toLowerCase())
    )

    function onSubmit(values: z.infer<typeof formSchema>) {
        const village = villages.find(v => v.id === values.villageId)
        const admin = administrators.find(a => a.id === values.administratorId)
        if (village && admin) {
            toast({
                title: "Administrator Assigned",
                description: `${admin.name} has been assigned as the administrator of ${village.name}.`,
            })
            console.log(`Assigned ${admin.name} to ${village.name}`)
        }
        form.reset()
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Assign Administrators</CardTitle>
                    <CardDescription>Assign administrators to manage specific villages.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="villageId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Village</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a village" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {villages.map((village) => (
                                                    <SelectItem key={village.id} value={village.id}>{village.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Choose the village to assign an administrator to.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="administratorId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Administrator</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an administrator" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {administrators.map((admin) => (
                                                    <SelectItem key={admin.id} value={admin.id}>{admin.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Select the administrator to assign to the village.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Assign Administrator
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Current Village Assignments</CardTitle>
                    <CardDescription>View and search current village-administrator assignments.</CardDescription>
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
                                <TableHead>Village Name</TableHead>
                                <TableHead>District</TableHead>
                                <TableHead>Current Administrator</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVillages.map(village => (
                                <TableRow key={village.id}>
                                    <TableCell className="font-medium">{village.name}</TableCell>
                                    <TableCell>{village.district}</TableCell>
                                    <TableCell>{village.currentAdmin || 'Not Assigned'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                        Administrators
                    </div>
                    <div className="flex items-center">
                        <Home className="mr-1 h-4 w-4" />
                        Villages
                    </div>
                    <div className="flex items-center">
                        <TreePine className="mr-1 h-4 w-4" />
                        Districts
                    </div>
                </div>
                <div>
                    Total Villages: {filteredVillages.length}
                </div>
            </div>
        </div>
    )
}