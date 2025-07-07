// app/(protected)/admindashboard/reports/layout.tsx
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, MenuIcon } from "lucide-react";
import { X } from "lucide-react";

const reportPages = [
  {
    name: "Applications",
    path: "applications",
    icon: () => (
      <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
        A
      </span>
    ),
  },
  {
    name: "Budget",
    path: "budget",
    icon: () => (
      <span className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
        B
      </span>
    ),
  },
  {
    name: "Earnest Money",
    path: "earnest-money",
    icon: () => (
      <span className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
        E
      </span>
    ),
  },
  {
    name: "Expenditure",
    path: "expenditure",
    icon: () => (
      <span className="bg-rose-100 text-rose-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
        E
      </span>
    ),
  },
  {
    name: "Performance",
    path: "performance",
    icon: () => (
      <span className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
        P
      </span>
    ),
  },
  {
    name: "Technical Compliance",
    path: "technical-compliance",
    icon: () => (
      <span className="bg-violet-100 text-violet-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
        T
      </span>
    ),
  },
  {
    name: "Vendor Participation",
    path: "vendor-participation",
    icon: () => (
      <span className="bg-cyan-100 text-cyan-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
        V
      </span>
    ),
  },
];

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-muted/40">
      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-background shadow-sm">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 rounded-md text-foreground hover:bg-accent focus:outline-none">
              <MenuIcon className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b p-4 flex flex-row items-center justify-between">
              <SheetTitle className="text-lg font-bold">
                Reports Dashboard
              </SheetTitle>
              <SheetTrigger asChild>
                <button className="p-2 rounded-md text-foreground hover:bg-accent">
                  <X className="h-5 w-5" />
                </button>
              </SheetTrigger>
            </SheetHeader>
            <div className="p-4">
              <nav className="w-full">
                <ul className="flex flex-col gap-1">
                  {reportPages.map((report) => (
                    <li key={report.path}>
                      <Link
                        href={`/admindashboard/reports/${report.path}`}
                        className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {report.icon()}
                        <span>{report.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="p-4 mt-auto border-t">
              <p className="text-xs text-muted-foreground text-center">
                Reports Dashboard v1.0
              </p>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">Reports Dashboard</h1>
        <Link
          href="/admindashboard"
          className="p-2 rounded-md text-foreground hover:bg-accent"
        >
          <HomeIcon className="h-5 w-5" />
        </Link>
      </div>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-background border-r p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold">Reports Dashboard</h1>
          <Link
            href="/admindashboard"
            className="p-2 rounded-md text-foreground hover:bg-accent"
          >
            <HomeIcon className="h-5 w-5" />
          </Link>
        </div>
        <nav className="w-full">
          <ul className="flex flex-col gap-1">
            {reportPages.map((report) => (
              <li key={report.path}>
                <Link
                  href={`/admindashboard/reports/${report.path}`}
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {report.icon()}
                  <span>{report.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Reports Dashboard v1.0
          </p>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-6">
        <Card className="min-h-[calc(100vh-2rem)]">
          <CardContent className="p-4 lg:p-6">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
