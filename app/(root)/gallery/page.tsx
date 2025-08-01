import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Download,
  Share2,
  Eye,
  Upload,
} from "lucide-react";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Photo Gallery</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Visual journey through our community&apos;s development, events, and
            daily life
          </p>
        </div>
      </section>

      {/* Gallery Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">850+</div>
              <div className="text-gray-600">Total Photos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">45</div>
              <div className="text-gray-600">Development Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">120</div>
              <div className="text-gray-600">Community Events</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">25</div>
              <div className="text-gray-600">Albums</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input placeholder="Search photos by event, project, or location..." />
              </div>
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="development" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
              <TabsTrigger value="officials">Officials</TabsTrigger>
              <TabsTrigger value="daily-life">Daily Life</TabsTrigger>
            </TabsList>

            {/* Development Projects */}
            <TabsContent value="development" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Development Projects
                </h2>
                <p className="text-xl text-gray-600">
                  Progress documentation of major infrastructure and development
                  initiatives
                </p>
              </div>

              {/* Water Supply Project Album */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Water Supply Enhancement Project
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        January 2024 - Ongoing |
                        <MapPin className="ml-2 mr-2 h-4 w-4" />8 Villages |
                        <Eye className="ml-2 mr-2 h-4 w-4" />
                        45 Photos
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      In Progress
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="relative cursor-pointer group">
                          <Image
                            src="/placeholder.svg?height=200&width=300"
                            alt="Water pipeline excavation work in progress"
                            width={300}
                            height={200}
                            className="rounded-lg object-cover w-full h-48 group-hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                            <Eye className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            Pipeline Excavation
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>
                            Water Pipeline Excavation - Phase 1
                          </DialogTitle>
                          <DialogDescription>
                            Excavation work for main water pipeline connecting
                            Dhalpara to Madhyapara village. Work started on
                            January 15, 2025. Total length: 3.5 km.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                          <Image
                            src="/placeholder.svg?height=400&width=600"
                            alt="Detailed view of water pipeline excavation work"
                            width={600}
                            height={400}
                            className="rounded-lg object-cover w-full"
                          />
                          <div className="flex gap-2 mt-4">
                            <Button size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="relative cursor-pointer group">
                          <Image
                            src="/placeholder.svg?height=200&width=300"
                            alt="Water treatment plant construction site"
                            width={300}
                            height={200}
                            className="rounded-lg object-cover w-full h-48 group-hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                            <Eye className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            Treatment Plant
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>
                            Water Treatment Plant Construction
                          </DialogTitle>
                          <DialogDescription>
                            Construction of modern water treatment plant with
                            capacity of 50,000 liters per day. Features advanced
                            filtration and purification systems.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                          <Image
                            src="/placeholder.svg?height=400&width=600"
                            alt="Water treatment plant under construction"
                            width={600}
                            height={400}
                            className="rounded-lg object-cover w-full"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="relative cursor-pointer group">
                          <Image
                            src="/placeholder.svg?height=200&width=300"
                            alt="Pipeline installation and testing"
                            width={300}
                            height={200}
                            className="rounded-lg object-cover w-full h-48 group-hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                            <Eye className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            Pipeline Testing
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>
                            Pipeline Installation & Testing
                          </DialogTitle>
                          <DialogDescription>
                            Quality testing of installed water pipelines
                            ensuring proper pressure and leak-proof connections.
                            All pipes tested as per IS standards.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                          <Image
                            src="/placeholder.svg?height=400&width=600"
                            alt="Pipeline testing in progress"
                            width={600}
                            height={400}
                            className="rounded-lg object-cover w-full"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="relative cursor-pointer group">
                          <Image
                            src="/placeholder.svg?height=200&width=300"
                            alt="Community members inspecting water connection"
                            width={300}
                            height={200}
                            className="rounded-lg object-cover w-full h-48 group-hover:opacity-90 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                            <Eye className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            Community Inspection
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>
                            Community Inspection of Water Connections
                          </DialogTitle>
                          <DialogDescription>
                            Local residents and Gram Sabha members inspecting
                            the quality of water connections and testing water
                            flow in newly connected households.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative">
                          <Image
                            src="/placeholder.svg?height=400&width=600"
                            alt="Community members testing water connection"
                            width={600}
                            height={400}
                            className="rounded-lg object-cover w-full"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Button variant="outline" className="w-full">
                    View All 45 Photos
                  </Button>
                </CardContent>
              </Card>

              {/* Road Construction Album */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Village Road Network Improvement
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        October 2024 - Ongoing |
                        <MapPin className="ml-2 mr-2 h-4 w-4" />5 Villages |
                        <Eye className="ml-2 mr-2 h-4 w-4" />
                        38 Photos
                      </CardDescription>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">
                      40% Complete
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Before: Damaged village road with potholes"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Before: Damaged Road
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Road construction machinery at work"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Construction Work
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Concrete laying and road surface preparation"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                        Concrete Laying
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="After: Newly constructed concrete road"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        After: New Road
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View All 38 Photos
                  </Button>
                </CardContent>
              </Card>

              {/* School Modernization Album */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Primary School Modernization
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        August 2024 - December 2024 |
                        <MapPin className="ml-2 mr-2 h-4 w-4" />3 Schools |
                        <Eye className="ml-2 mr-2 h-4 w-4" />
                        52 Photos
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Old school building before renovation"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Before Renovation
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Smart classroom with digital board installation"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Smart Classroom
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="New library with books and reading area"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        New Library
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Children playing in renovated playground"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        New Playground
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View All 52 Photos
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Community Events */}
            <TabsContent value="events" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Community Events
                </h2>
                <p className="text-xl text-gray-600">
                  Celebrations, meetings, and community gatherings throughout
                  the year
                </p>
              </div>

              {/* Gram Sabha Meeting */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Monthly Gram Sabha Meeting - January 2025
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        January 15, 2025 |
                        <Users className="ml-2 mr-2 h-4 w-4" />
                        234 Attendees |
                        <Eye className="ml-2 mr-2 h-4 w-4" />
                        28 Photos
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Official Meeting
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Prodhan addressing the Gram Sabha meeting"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Prodhan`&apos;s Address
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Community members participating in discussion"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Community Discussion
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Budget presentation and financial review"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        Budget Presentation
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Voting on community resolutions"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded">
                        Resolution Voting
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View All 28 Photos
                  </Button>
                </CardContent>
              </Card>

              {/* Festival Celebration */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Durga Puja Celebration 2024
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        October 9-13, 2024 |
                        <Users className="ml-2 mr-2 h-4 w-4" />
                        5000+ Participants |
                        <Eye className="ml-2 mr-2 h-4 w-4" />
                        85 Photos
                      </CardDescription>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">
                      Cultural Event
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Beautiful Durga Puja pandal decoration"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded">
                        Pandal Decoration
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Traditional dance performance by local artists"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Cultural Performance
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Community feast and food distribution"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Community Feast
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Children participating in cultural activities"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Children`&apos;s Activities
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View All 85 Photos
                  </Button>
                </CardContent>
              </Card>

              {/* Independence Day */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Independence Day Celebration 2024
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        August 15, 2024 |
                        <Users className="ml-2 mr-2 h-4 w-4" />
                        800+ Participants |
                        <Eye className="ml-2 mr-2 h-4 w-4" />
                        42 Photos
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      National Event
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Flag hoisting ceremony by Prodhan"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded">
                        Flag Hoisting
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="School children performing patriotic songs"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        School Performance
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Community members singing national anthem"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        National Anthem
                      </div>
                    </div>
                    <div className="relative cursor-pointer group">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Sweet distribution to children"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        Sweet Distribution
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View All 42 Photos
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Infrastructure */}
            <TabsContent value="infrastructure" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Infrastructure
                </h2>
                <p className="text-xl text-gray-600">
                  Completed infrastructure projects and public facilities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Panchayat Office Building
                    </CardTitle>
                    <CardDescription>
                      Modern administrative facility
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Modern Panchayat office building with solar panels"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      Two-story building with modern facilities, solar power,
                      and citizen service center.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 12 Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Community Health Center
                    </CardTitle>
                    <CardDescription>
                      Primary healthcare facility
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Well-equipped community health center"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      24/7 healthcare facility with emergency services,
                      laboratory, and pharmacy.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 18 Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Digital Literacy Center
                    </CardTitle>
                    <CardDescription>
                      Computer training facility
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Computer lab with modern equipment"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      20 computers with internet connectivity for digital skills
                      training.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 15 Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Solar Street Lighting
                    </CardTitle>
                    <CardDescription>Eco-friendly illumination</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Solar LED street lights illuminating village roads"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      150 solar LED street lights providing safe nighttime
                      mobility.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 25 Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Waste Management Facility
                    </CardTitle>
                    <CardDescription>
                      Composting and recycling center
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Organic waste composting facility"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      Comprehensive waste segregation, composting, and recycling
                      facility.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 20 Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Water Storage Tanks
                    </CardTitle>
                    <CardDescription>
                      Clean water storage system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Large water storage tanks with distribution system"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      Multiple water storage tanks ensuring 24/7 water supply to
                      all villages.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 16 Photos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Culture */}
            <TabsContent value="culture" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Cultural Heritage
                </h2>
                <p className="text-xl text-gray-600">
                  Traditional festivals, arts, and cultural activities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Traditional Festivals
                    </CardTitle>
                    <CardDescription>
                      Religious and cultural celebrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Kali Puja celebration with traditional decorations"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Poila Boishakh celebration with cultural programs"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Lakshmi Puja with traditional rituals"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Saraswati Puja celebration in schools"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      View All Festival Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Folk Arts & Crafts
                    </CardTitle>
                    <CardDescription>
                      Traditional skills and handicrafts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Traditional pottery making by local artisans"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Handloom weaving demonstration"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Traditional bamboo craft making"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Folk dance performance by local group"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      View All Craft Photos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Officials */}
            <TabsContent value="officials" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Official Events
                </h2>
                <p className="text-xl text-gray-600">
                  Government visits, inaugurations, and official ceremonies
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      District Collector`&apos;s Visit
                    </CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      December 10, 2024 | Project Review and Community
                      Interaction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="District Collector inspecting water supply project"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Community interaction session with officials"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Review meeting with Panchayat members"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Inauguration of new health center"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      View All 24 Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      MLA`&apos;s Development Review
                    </CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      November 5, 2024 | Annual Development Review Meeting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="MLA addressing the gathering"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Project presentation to MLA"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Community representatives meeting MLA"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Foundation stone laying ceremony"
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-32"
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      View All 18 Photos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Daily Life */}
            <TabsContent value="daily-life" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Daily Life
                </h2>
                <p className="text-xl text-gray-600">
                  Everyday activities and life in our villages
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Agriculture & Farming
                    </CardTitle>
                    <CardDescription>
                      Traditional and modern farming practices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Farmers working in rice fields during harvest season"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      Rice cultivation, vegetable farming, and modern
                      agricultural techniques.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 35 Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Local Markets</CardTitle>
                    <CardDescription>
                      Weekly markets and trade activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Bustling weekly market with local vendors"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      Weekly markets, local vendors, and traditional trade
                      activities.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 28 Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Education & Learning
                    </CardTitle>
                    <CardDescription>
                      Schools and educational activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Children studying in modernized classroom"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      School activities, digital learning, and educational
                      programs.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 42 Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Women`&apos;s Self Help Groups
                    </CardTitle>
                    <CardDescription>
                      Empowerment and skill development
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Women's group meeting and skill training session"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      SHG meetings, skill training, and women empowerment
                      activities.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 31 Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Youth Activities</CardTitle>
                    <CardDescription>
                      Sports and recreational programs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Young people playing football in village ground"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      Sports activities, youth clubs, and recreational programs.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 26 Photos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Healthcare Services
                    </CardTitle>
                    <CardDescription>
                      Medical camps and health programs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Medical camp providing free health checkups"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-48 mb-3"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                      Medical camps, vaccination drives, and health awareness
                      programs.
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      View 33 Photos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Photo Submission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Share Your Photos
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Have photos of community events or development projects? Share
              them with us to be featured in our gallery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Upload className="mr-2 h-5 w-5" />
                Submit Photos
              </Button>
              <Button size="lg" variant="outline">
                Photo Guidelines
              </Button>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Email: photos@dhalparagp.in | WhatsApp: +91 98765 43210
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Request Photos or Information
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Looking for specific photos or need high-resolution images for
            official use? Contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Call: +91 98765 43210
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-indigo-600"
            >
              Email: gallery@dhalparagp.in
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
