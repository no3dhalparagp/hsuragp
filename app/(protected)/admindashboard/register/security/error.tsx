'use client'
import Link from "next/link"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-white border border-rose-200/60 shadow-sm rounded-2xl p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
          <span className="text-rose-600 text-2xl">!</span>
        </div>
        <h2 className="text-2xl font-bold text-rose-700 mb-2">Something went wrong</h2>
        <p className="text-slate-600 mb-6">
          {error.message}
          {error.digest ? ` (ref: ${error.digest})` : null}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center rounded-lg bg-rose-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-rose-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
