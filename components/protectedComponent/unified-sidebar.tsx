"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { ChevronDown, ChevronUp, Menu, User, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  publicUserMenuItems,
  adminMenuItems,
  employeeMenuItems,
  superAdminMenuItems,
  type MenuItemProps,
} from "@/constants/protected-menu"
import type { RootState } from "@/redux/store"
import { toggleMenu } from "@/redux/slices/menuSlice"
import ImprovedFooter from "@/components/improved-footer"

// Types
type Role = "user" | "admin" | "staff" | "superadmin"

interface DashboardConfig {
  title: string
  items: MenuItemProps[]
}

// Configuration
const DASHBOARD_CONFIG: Record<Role, DashboardConfig> = {
  user: {
    title: "User Dashboard",
    items: publicUserMenuItems,
  },
  admin: {
    title: "Admin Portal",
    items: adminMenuItems,
  },
  staff: {
    title: "Staff Portal",
    items: employeeMenuItems,
  },
  superadmin: {
    title: "Super Admin Portal",
    items: superAdminMenuItems,
  },
}

// Helper function to check if a path is active
function isActivePath(pathname: string, link?: string): boolean {
  if (!link || link === "#") return false
  return pathname === link || pathname.startsWith(link + "/")
}

// Components
function MenuItem({ item, pathname, level = 0 }: { item: MenuItemProps; pathname: string; level?: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const isActive = isActivePath(pathname, item.menuItemLink)
  const hasActiveChild = item.subMenuItems.some(subItem => 
    isActivePath(pathname, subItem.menuItemLink) || 
    subItem.subMenuItems.some(subSubItem => isActivePath(pathname, subSubItem.menuItemLink))
  )

  // Auto-expand if has active child
  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true)
    }
  }, [hasActiveChild])

  const toggleSubMenu = () => setIsOpen(!isOpen)

  return (
    <div className="mb-1 relative group">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start px-3 py-2.5 rounded-lg transition-all duration-200",
          "hover:bg-primary/10 hover:text-primary",
          "active:scale-[0.98]",
          isActive && "bg-primary/15 text-primary font-semibold shadow-sm border-l-2 border-primary",
          level > 0 && "ml-2 text-sm"
        )}
        onClick={item.submenu ? toggleSubMenu : undefined}
      >
        <Link
          href={item.menuItemLink || "#"}
          className="flex items-center w-full text-foreground min-w-0 gap-3"
          onClick={(e) => item.submenu && e.preventDefault()}
        >
          {item.Icon && (
            <div
              className={cn(
                "p-1.5 rounded-lg flex-shrink-0 transition-all",
                isActive 
                  ? "bg-primary/20 text-primary" 
                  : "bg-muted/50 group-hover:bg-primary/10"
              )}
            >
              <item.Icon className={cn("w-4 h-4", item.color, isActive && "text-primary")} />
            </div>
          )}
          <span className={cn(
            "font-medium text-sm truncate flex-1 text-left",
            isActive && "text-primary"
          )}>
            {item.menuItemText}
          </span>
          {item.submenu && (
            <span className="ml-auto transform transition-transform duration-200 flex-shrink-0">
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </span>
          )}
        </Link>
      </Button>

      {item.submenu && (
        <div
          className={cn(
            "ml-6 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-[1000px] opacity-100 mt-1" : "max-h-0 opacity-0"
          )}
        >
          {item.subMenuItems.map((subItem) => (
            <MenuItem key={subItem.menuItemText} item={subItem} pathname={pathname} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarContent({ role, pathname, onClose }: { role: Role; pathname: string; onClose?: () => void }) {
  const config = DASHBOARD_CONFIG[role]

  return (
    <div
      className="w-full sm:w-64 md:w-72 lg:w-64 xl:w-72 flex-shrink-0 border-r border-border/40 
                    bg-gradient-to-br from-background via-background to-muted/20 
                    backdrop-blur-sm h-screen flex flex-col shadow-lg fixed left-0 top-0 z-30"
    >
      <header
        className="h-16 border-b border-border/40 p-4 flex items-center justify-between 
                       bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 
                       relative overflow-hidden"
      >
        <h1 className="text-base md:text-lg font-bold tracking-tight text-foreground relative z-10 truncate pr-2">
          {config.title}
        </h1>
        <div className="flex items-center gap-2">
          <Avatar
            className="w-8 h-8 border-2 border-primary/20 shadow-sm 
                         hover:border-primary/40 transition-all hover:scale-105 flex-shrink-0"
          >
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      <ScrollArea className="flex-1 min-h-0 px-3 py-4">
        <nav className="space-y-1" aria-label={`${role} navigation`}>
          {config.items.map((item) => (
            <MenuItem key={item.menuItemText} item={item} pathname={pathname} />
          ))}
        </nav>
      </ScrollArea>

      <ImprovedFooter />
    </div>
  )
}

export default function UnifiedSidebar({ role = "user" }: { role?: Role }) {
  const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen)
  const dispatch = useDispatch()
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleToggleMenu = () => {
    dispatch(toggleMenu())
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false)
    dispatch(toggleMenu())
  }

  if (!isMounted) return null

  return (
    <>
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 bg-background/95 backdrop-blur-md shadow-lg 
                        rounded-lg w-10 h-10 hover:bg-primary/10 hover:border-primary/50 
                        transition-all border-2"
              onClick={handleToggleMenu}
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="p-0 w-[280px] sm:w-[320px] md:w-[360px] shadow-2xl border-r"
          >
            <SidebarContent role={role} pathname={pathname} onClose={handleCloseMobileMenu} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:block fixed left-0 top-0 z-30">
        <SidebarContent role={role} pathname={pathname} />
      </div>
    </>
  )
}
