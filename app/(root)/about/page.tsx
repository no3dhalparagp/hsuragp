import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Calendar, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Dhalpara Gram Panchayat
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            A progressive rural local government committed to sustainable
            development and community welfare
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our History & Heritage
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Dhalpara Gram Panchayat was established in 1947 following
                India&apos;s independence, as part of the democratic
                decentralization initiative. Located in the heart of West
                Bengal, our panchayat has been serving the rural community for
                over 75 years, evolving from a traditional village
                administration to a modern, technology-enabled local government.
              </p>
              <p className="text-gray-700 mb-6">
                The name &quot;Dhalpara&quot; derives from the Bengali words
                &quot;Dhal&quot; (lentils) and &quot;Para&quot; (locality),
                reflecting the area&apos;s historical significance as a major
                lentil trading hub. Over the decades, our region has transformed
                while maintaining its agricultural roots and cultural heritage.
              </p>
              <p className="text-gray-700">
                Today, Dhalpara Gram Panchayat stands as a model of rural
                governance, implementing innovative solutions for community
                development while preserving our rich cultural traditions and
                environmental heritage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demographics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Demographics & Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Total Population</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  25,658
                </div>
                <p className="text-gray-600">As per 2021 Census</p>
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Male:</span>
                    <span>13,191</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Female:</span>
                    <span>12,467</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle>Area Coverage</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  23.5
                </div>
                <p className="text-gray-600">Square Kilometers</p>
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Villages:</span>
                    <span>23</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Households:</span>
                    <span>5,821</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>Literacy Rate</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  68.0%
                </div>
                <p className="text-gray-600">Overall Literacy</p>
                <div className="mt-4 space-y-1 text-sm">
                  {/* <div className="flex justify-between">
                    <span>Male:</span>
                    <span>82.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Female:</span>
                    <span>74.8%</span>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                <CardTitle>Economic Profile</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  ₹96.53Lakh
                </div>
                <p className="text-gray-600">Annual Budget</p>
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Agriculture:</span>
                    <span>65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Small Business:</span>
                    <span>25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Services:</span>
                    <span>10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="https://res.cloudinary.com/dqkmkxgdo/image/upload/v1698161664/IMG_20231024_210228_dyy8dw.jpg?height=120&width=120"
                  alt="Prodhan"
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-4 border-4 border-blue-200"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Smt. Bithika Ghosh
                </h3>
                <Badge className="mb-3">Prodhan</Badge>
                <p className="text-gray-600 text-sm">
                  Leading the panchayat with 8 years of experience in rural
                  governance and community development.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="https://res.cloudinary.com/dqkmkxgdo/image/upload/v1697867382/demomember_avlg9n.png?height=120&width=120"
                  alt="Up-Prodhan"
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-4 border-4 border-green-200"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Sri Mostafijul Mondal
                </h3>
                <Badge variant="secondary" className="mb-3">
                  Up-Prodhan
                </Badge>
                <p className="text-gray-600 text-sm">
                  Supporting development initiatives with focus on
                  infrastructure and agricultural advancement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="https://res.cloudinary.com/dqkmkxgdo/image/upload/v1697867382/demomember_avlg9n.png?height=120&width=120"
                  alt="Secretary"
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-4 border-4 border-purple-200"
                />
                <h3 className="text-xl font-semibold mb-2">Sri Arpan Sarkar</h3>
                <Badge variant="outline" className="mb-3">
                  Secretary
                </Badge>
                <p className="text-gray-600 text-sm">
                  Administrative head ensuring efficient service delivery and
                  transparent governance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Vision & Mission
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-600">
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    To transform Dhalpara into a model rural community that
                    combines traditional values with modern development,
                    ensuring sustainable growth, social equity, and
                    environmental conservation for future generations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-green-600">
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Provide efficient and transparent governance</li>
                    <li>• Promote inclusive economic development</li>
                    <li>• Ensure quality education and healthcare</li>
                    <li>• Preserve cultural heritage and environment</li>
                    <li>• Empower women and marginalized communities</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
