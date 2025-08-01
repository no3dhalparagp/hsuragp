import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Dhalpara Gram Panchayat Footer",
  description: "Footer for the official website of Dhalpara Gram Panchayat",
}

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/development" className="text-gray-300 hover:text-white">
                  Development Projects
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Government Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://wb.gov.in" className="text-gray-300 hover:text-white flex items-center">
                  West Bengal Government <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://panchayat.gov.in" className="text-gray-300 hover:text-white flex items-center">
                  Panchayati Raj Department <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://egramswaraj.gov.in" className="text-gray-300 hover:text-white flex items-center">
                  e-Gram Swaraj <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Important Schemes</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/schemes/pmay" className="text-gray-300 hover:text-white">
                  PM Awas Yojana
                </Link>
              </li>
              <li>
                <Link href="/schemes/mgnrega" className="text-gray-300 hover:text-white">
                  MGNREGA
                </Link>
              </li>
              <li>
                <Link href="/schemes/swachh-bharat" className="text-gray-300 hover:text-white">
                  Swachh Bharat Mission
                </Link>
              </li>
              <li>
                <Link href="/schemes/digital-india" className="text-gray-300 hover:text-white">
                  Digital India
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Transparency</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/rti" className="text-gray-300 hover:text-white">
                  RTI Information
                </Link>
              </li>
              <li>
                <Link href="/budget" className="text-gray-300 hover:text-white">
                  Budget & Expenditure
                </Link>
              </li>
              <li>
                <Link href="/tenders" className="text-gray-300 hover:text-white">
                  Tenders
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="text-gray-300 hover:text-white">
                  Grievance Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {currentYear} Dhalpara Gram Panchayat. All rights reserved. |
            <Link href="/privacy" className="ml-2 hover:text-white">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/terms" className="ml-2 hover:text-white">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

