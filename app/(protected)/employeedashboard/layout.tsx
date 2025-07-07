
import Header from "@/components/protectedComponent/Header"

import UnifiedSidebar from "@/components/protectedComponent/unified-sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {


  return (
    <div className="flex min-h-screen bg-background">
      <UnifiedSidebar role="staff" />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-2 md:p-6 overflow-hidden">

          <div className="container mx-auto space-y-6">

            {children}
          </div>

        </main>
      </div>
    </div>
  )
}