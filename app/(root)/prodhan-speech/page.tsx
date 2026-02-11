import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PradhanSpeechPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-green-700 hover:text-green-900 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="mr-2">হোম পেজে ফিরে যান</span>
          <span>Back to Home</span>
        </Link>

        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-green-500 shadow-lg">
                <Image
                  src="https://res.cloudinary.com/dqkmkxgdo/image/upload/v1698161664/IMG_20231024_210228_dyy8dw.jpg"
                  alt="প্রধানের ছবি / Pradhan's Photo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-green-800 mb-2">
                  <span className="block">প্রধানের বার্তা</span>
                  <span className="block">Message from the Pradhan</span>
                </h1>
                <p className="text-xl text-green-700 mb-4">
                  <span className="block">শ্রীমতি বিথিকা ঘোষ</span>
                  <span className="block">Smt. Bithika Ghosh</span>
                </p>
                <p className="text-gray-600 italic">
                  <span className="block">
                    একসাথে, আমরা একটি শক্তিশালী সম্প্রদায় গড়ে তুলি
                  </span>
                  <span className="block">
                    Together we build a stronger community
                  </span>
                </p>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p>
                    নমস্কার, ধলপাড়া গ্রাম পঞ্চায়েতের সম্মানিত নাগরিকবৃন্দ,
                  </p>
                  <p>
                    আপনাদের প্রধান হিসেবে আপনাদের সম্বোধন করতে পেরে আমি অত্যন্ত
                    সম্মানিত ও বিনীত বোধ করছি। আমাদের ধলপাড়া গ্রাম পঞ্চায়েতের
                    একটি সমৃদ্ধ ইতিহাস এবং উজ্জ্বল ভবিষ্যৎ রয়েছে, এবং আমি
                    আমাদের অগ্রগতি ও সমৃদ্ধি অব্যাহত রাখার জন্য অক্লান্ত পরিশ্রম
                    করতে প্রতিশ্রুতিবদ্ধ।
                  </p>
                  <p>
                    সাম্প্রতিক বছরগুলিতে, আমরা উন্নয়নের বিভিন্ন ক্ষেত্রে
                    উল্লেখযোগ্য অগ্রগতি সাধন করেছি। আমরা আমাদের পরিকাঠামো উন্নত
                    করেছি, আমাদের শিক্ষা সুবিধাগুলি বাড়িয়েছি এবং বেশ কয়েকটি
                    কল্যাণমূলক প্রকল্প বাস্তবায়ন করেছি যা আমাদের সম্প্রদায়ের
                    সদস্যদের জীবনে ইতিবাচক প্রভাব ফেলেছে।
                  </p>
                  <p>
                    তবে, আমাদের এই সাফল্যে সন্তুষ্ট থাকলে চলবে না। এখনও এমন কিছু
                    চ্যালেঞ্জ রয়েছে যা আমাদের মোকাবেলা করতে হবে, এবং আমি
                    আপনাদের আশ্বস্ত করছি যে আপনাদের পঞ্চায়েত এই বাধাগুলি
                    অতিক্রম করতে নিবেদিত। আমরা নিম্নলিখিত বিষয়গুলিতে মনোনিবেশ
                    করছি:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>আমাদের কৃষকদের আয় বাড়াতে টেকসই কৃষি পদ্ধতি</li>
                    <li>
                      স্বাস্থ্যসেবা সুবিধা এবং চিকিৎসা পরিষেবায় প্রবেশাধিকার
                      উন্নত করা
                    </li>
                    <li>
                      আমাদের যুবকদের জন্য দক্ষতা উন্নয়ন কর্মসূচি বৃদ্ধি করা
                    </li>
                    <li>
                      সমস্ত পরিবারের জন্য বিশুদ্ধ পানীয় জল এবং উপযুক্ত
                      স্যানিটেশন নিশ্চিত করা
                    </li>
                    <li>
                      আমাদের পরিবেশ রক্ষায় পরিবেশ-বান্ধব উদ্যোগ প্রচার করা
                    </li>
                  </ul>
                  <p>
                    আমি দৃঢ়ভাবে বিশ্বাস করি যে আমাদের পঞ্চায়েতের শক্তি আমাদের
                    নাগরিকদের সক্রিয় অংশগ্রহণের মধ্যে নিহিত। আমি আপনাদের
                    প্রত্যেককে আপনাদের ধারণা, উদ্বেগ এবং পরামর্শ নিয়ে এগিয়ে
                    আসার জন্য উৎসাহিত করছি। একসাথে, আমরা একটি আদর্শ গ্রাম
                    পঞ্চায়েত গড়ে তুলতে পারি যা অন্যদের জন্য অনুসরণীয় উদাহরণ
                    হবে।
                  </p>
                  <p>
                    আসুন আমরা হাত মিলিয়ে আমাদের ধলপাড়া গ্রামের জন্য একটি
                    উজ্জ্বল, আরও সমৃদ্ধ ভবিষ্যতের দিকে কাজ করি। আমার প্রতি এবং
                    আমাদের পঞ্চায়েত প্রশাসনের প্রতি আপনাদের আস্থাই আমাদের
                    সবচেয়ে বড় শক্তি, এবং আমরা আপনাদের প্রত্যাশা পূরণে সর্বদা
                    চেষ্টা করব।
                  </p>
                  <p>
                    আপনাদের অব্যাহত সমর্থন ও সহযোগিতার জন্য ধন্যবাদ। আমাদের
                    ধলপাড়া গ্রাম পঞ্চায়েত যেন ক্রমাগত বৃদ্ধি পায় এবং সমৃদ্ধ
                    হয়!
                  </p>
                  <p className="font-semibold">জয় হিন্দ!</p>
                </div>
                <div className="space-y-4">
                  <p>Namaste, respected citizens of Dhalpara Gram Panchayat,</p>
                  <p>
                    It is with great honor and humility that I address you as
                    your Pradhan. Our Dhalpara Gram Panchayat has a rich history
                    and a bright future, and I am committed to working
                    tirelessly to ensure that we continue to progress and
                    prosper.
                  </p>
                  <p>
                    In recent years, we have made significant strides in various
                    areas of development. We have improved our infrastructure,
                    enhanced our educational facilities, and implemented several
                    welfare schemes that have positively impacted the lives of
                    our community members.
                  </p>
                  <p>
                    However, we must not rest on our laurels. There are still
                    challenges that we need to address, and I assure you that
                    your Panchayat is dedicated to overcoming these obstacles.
                    We are focusing on:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>
                      Sustainable agricultural practices to boost our farmers
                      income
                    </li>
                    <li>
                      Improving healthcare facilities and access to medical
                      services
                    </li>
                    <li>Enhancing skill development programs for our youth</li>
                    <li>
                      Ensuring clean drinking water and proper sanitation for
                      all households
                    </li>
                    <li>
                      Promoting eco-friendly initiatives to protect our
                      environment
                    </li>
                  </ul>
                  <p>
                    I firmly believe that the strength of our Panchayat lies in
                    the active participation of our citizens. I encourage each
                    one of you to come forward with your ideas, concerns, and
                    suggestions. Together, we can build a model Gram Panchayat
                    that will be an example for others to follow.
                  </p>
                  <p>
                    Let us join hands and work towards a brighter, more
                    prosperous future for our Dhalpara village. Your trust in me
                    and our Panchayat administration is our greatest strength,
                    and we shall strive to live up to your expectations.
                  </p>
                  <p>
                    Thank you for your continued support and cooperation. May
                    our Dhalpara Gram Panchayat continue to grow and flourish!
                  </p>
                  <p className="font-semibold">Jai Hind!</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <span className="block">প্রধানের অফিসের সাথে যোগাযোগ করুন</span>
                <span className="block">Contact the Pradhan s Office</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
