import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full">
        {/* Decorative background elements */}
        <div className="absolute -top-12 -left-16 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute -top-4 -right-16 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>

        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="text-center space-y-6">
            {/* Animated 404 number */}
            <div className="inline-flex flex-col items-center">
              <span className="text-9xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-bounce">
                404
              </span>
              <div className="w-full h-1.5 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full" />
            </div>

            {/* Illustration */}
            <div className="mx-auto max-w-xs">
              <svg viewBox="0 0 400 300" className="text-red-100">
                <path
                  fill="currentColor"
                  d="M81.9 258.1c-9.1 2.8-18.6-3.5-19.7-12.8l-8.6-70.7c-1.1-9.3 4.9-17.9 14-20.7l130.1-40.3c9.1-2.8 18.6 3.5 19.7 12.8l8.6 70.7c1.1 9.3-4.9 17.9-14 20.7L81.9 258.1z"
                />
                <circle cx="280" cy="120" r="40" fill="#FBBF24" />
                <path
                  fill="#3B82F6"
                  d="M150 80h100v140H150V80zm20 20v100h60V100h-60z"
                />
                <path
                  stroke="#EF4444"
                  strokeWidth="8"
                  strokeLinecap="round"
                  d="M50 50l300 200M350 50L50 250"
                />
              </svg>
            </div>

            {/* Text content */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Lost in Space?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Do not worry, even the best explorers get lost sometimes. Let s get you back to safety!
              </p>
            </div>

            {/* Back button */}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full md:w-auto font-semibold text-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-100 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              Beam Me Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
