import HousingListButton from "@/components/HousingListButton";
import HeroSection from "@/components/hero-section";
import AdminMarquee from "@/components/AdminMarquee";
import PayPropertyTaxButton from "@/components/PayPropertyTaxButton";
import { db } from "@/lib/db";
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
import { Calendar, Users, MapPin, Phone, Mail } from "lucide-react";
import LatestNewsUpdate from "@/components/latest-news-update";
import { AdUnit } from "@/components/adsense-provider";

type AdminMessage = {
  id: string;
  title: string;
  content: string;
  bgColor: string;
  textColor: string;
  createdAt: Date;
  updatedAt: Date;
};

export default async function Home() {
  const addminmessage = (await db.adminMessage.findMany({})) as AdminMessage[];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Hero Section */}
      <section className="relative py-8 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <HeroSection />
        </div>
      </section>
      <div>
        {addminmessage.length > 0 &&
          addminmessage.map((item) => (
            <AdminMarquee
              key={item.id}
              message={item.content}
              bgColor={item.bgColor}
              textColor={item.textColor}
              speed={25}
              icon={<span>🚨</span>}
            />
          ))}
      </div>

      <section className="py-6 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative z-10">
          <PayPropertyTaxButton />
        </div>
      </section>

      <section className="py-6 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-3">
          <HousingListButton />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 bg-white/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Serving our community with dedication and transparency
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-3">
                  15,247
                </div>
                <div className="text-gray-600 font-medium">
                  Total Population
                </div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-3">
                  12
                </div>
                <div className="text-gray-600 font-medium">
                  Villages Covered
                </div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-3">
                  ₹2.5Cr
                </div>
                <div className="text-gray-600 font-medium">Annual Budget</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-3">
                  45+
                </div>
                <div className="text-gray-600 font-medium">
                  Development Projects
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Message from Prodhan */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <CardTitle className="text-3xl font-bold mb-2">
                    Message from the Prodhan
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-lg">
                    Leadership committed to community development
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-10">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-shrink-0 mx-auto lg:mx-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30"></div>
                      <Image
                        src="https://res.cloudinary.com/dqkmkxgdo/image/upload/v1698161664/IMG_20231024_210228_dyy8dw.jpg"
                        alt="Prodhan Photo"
                        width={180}
                        height={180}
                        className="rounded-full border-4 border-white shadow-xl relative z-10"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed font-light">
                      &quot;Welcome to Dhalpara Gram Panchayat. We are committed
                      to serving our community and working towards sustainable
                      development. Our goal is to improve the quality of life
                      for all residents through transparent governance,
                      inclusive growth, and community-driven initiatives that
                      address the real needs of our people.&quot;
                    </blockquote>
                    <div className="border-t border-gray-200 pt-6">
                      <p className="font-bold text-gray-900 text-xl">
                        Smt.Bithika Ghosh
                      </p>
                      <p className="text-gray-600 text-lg mb-3">
                        Prodhan, Dhalpara Gram Panchayat
                      </p>
                      <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-2 inline-block">
                        Elected: 2023 | Experience: 8 years in local governance
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              Our Services
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive services designed to meet the diverse needs of our
              community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4 shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  Birth & Death Certificates
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Quick and efficient processing of birth and death certificates
                  with online tracking facility.
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mr-4 shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  Property Tax Services
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Online property tax payment, assessment, and grievance
                  redressal services.
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center text-xl">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mr-4 shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  Welfare Schemes
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Information and application process for various government
                  welfare schemes and benefits.
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent News & Updates */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
              Latest News & Updates
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              Stay informed about recent developments and announcements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:scale-105">
              <CardHeader>
                <Badge className="w-fit mb-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                  Development
                </Badge>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  New Water Supply Project Launched
                </CardTitle>
                <CardDescription className="text-gray-500">
                  January 15, 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  A comprehensive water supply project covering 8 villages has
                  been initiated with a budget of ₹50 lakhs.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:scale-105">
              <CardHeader>
                <Badge className="w-fit mb-3 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                  Meeting
                </Badge>
                <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                  Monthly Gram Sabha Meeting
                </CardTitle>
                <CardDescription className="text-gray-500">
                  January 20, 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Next Gram Sabha meeting scheduled to discuss budget allocation
                  and ongoing development projects.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:scale-105">
              <CardHeader>
                <Badge className="w-fit mb-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                  Scheme
                </Badge>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                  PM Awas Yojana Applications
                </CardTitle>
                <CardDescription className="text-gray-500">
                  January 10, 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  New round of applications for PM Awas Yojana housing scheme
                  now open for eligible beneficiaries.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest News Update */}
      <section className="my-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <LatestNewsUpdate />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold mb-8">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start group">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-4 group-hover:bg-white/30 transition-colors">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <span className="text-lg leading-relaxed">
                      Dhalpara Gram Panchayat Office, Dhalpara, West Bengal -
                      733126
                    </span>
                  </div>
                  <div className="flex items-center group">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-4 group-hover:bg-white/30 transition-colors">
                      <Phone className="h-6 w-6" />
                    </div>
                    <span className="text-lg">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-4 group-hover:bg-white/30 transition-colors">
                      <Mail className="h-6 w-6" />
                    </div>
                    <span className="text-lg">info@dhalparagp.in</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-8">Office Hours</h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4 text-lg">
                  <p>
                    <strong className="text-white">Monday - Friday:</strong>{" "}
                    10:00 AM - 5:00 PM
                  </p>
                  <p>
                    <strong className="text-white">Saturday:</strong> 10:00 AM -
                    2:00 PM
                  </p>
                  <p>
                    <strong className="text-white">Sunday:</strong> Closed
                  </p>
                  <p className="text-blue-200 text-base mt-6 bg-white/10 rounded-lg p-4">
                    Emergency services available 24/7
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex justify-center mt-12">
              <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <AdUnit
                  slot="8324866123"
                  format="auto"
                  responsive={true}
                  style={{ minHeight: "300px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
