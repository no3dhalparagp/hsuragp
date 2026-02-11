import Header from "@/components/protectedComponent/Header"
import UnifiedSidebar from "@/components/protectedComponent/unified-sidebar"
import "react-datepicker/dist/react-datepicker.css";

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <UnifiedSidebar role="staff" />
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 w-full overflow-hidden lg:ml-64 xl:ml-72">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/20">
          <div className="w-full px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-3 xs:py-4 sm:py-5 md:py-6 lg:py-8 max-w-full">
            <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
