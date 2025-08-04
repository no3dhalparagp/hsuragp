"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, ChevronUp, Menu, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  publicUserMenuItems,
  adminMenuItems,
  employeeMenuItems,
  superAdminMenuItems,
  type MenuItemProps,
} from "@/constants/protected-menu";
import { RootState } from "@/redux/store";
import { toggleMenu } from "@/redux/slices/menuSlice";
import ImprovedFooter from "../improved-footer";

// Types
type Role = "user" | "admin" | "staff" | "superadmin";

interface DashboardConfig {
  title: string;
  items: MenuItemProps[];
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
};

// Components
function MenuItem({ item }: { item: MenuItemProps }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubMenu = () => setIsOpen(!isOpen);

  return (
    <div className="mb-1 relative group">
      <Button
        variant="ghost"
        className="w-full justify-start px-4 py-3 rounded-lg hover:bg-accent/30 
                   transition-all duration-300 group hover:pl-6 active:scale-[0.98] shadow-sm"
        onClick={item.submenu ? toggleSubMenu : undefined}
      >
        <Link
          href={item.menuItemLink || "#"}
          className="flex items-center gap-3 w-full text-foreground"
          onClick={(e) => item.submenu && e.preventDefault()}
        >
          {item.Icon && (
            <div
              className="p-1.5 rounded-md bg-gradient-to-br from-background to-accent/10 
                          group-hover:from-accent/20 group-hover:to-accent/30 shadow-md"
            >
              <item.Icon
                className={`w-5 h-5 ${item.color} transition-colors`}
              />
            </div>
          )}
          <span className="font-medium text-sm group-hover:text-primary transition-colors">
            {item.menuItemText}
          </span>
          {item.submenu && (
            <span className="ml-auto transform transition-transform duration-300">
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
          className={`ml-6 space-y-1 overflow-hidden transition-all duration-500 
                     ease-[cubic-bezier(0.4,0,0.2,1)] ${
                       isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                     }`}
        >
          {item.subMenuItems.map((subItem) => (
            <MenuItem key={subItem.menuItemText} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({ role }: { role: Role }) {
  const config = DASHBOARD_CONFIG[role];

  return (
    <div
      className="w-74 flex-shrink-0 border-r bg-gradient-to-br from-background 
                    to-accent/10 backdrop-blur-lg h-full flex flex-col shadow-xl"
    >
      <header
        className="h-16 border-b p-4 flex items-center justify-between 
                       bg-gradient-to-r from-primary/10 to-primary/30 relative overflow-hidden shadow-md"
      >
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
        <h1 className="text-lg font-semibold tracking-tight text-primary relative">
          {config.title}
        </h1>
        <Avatar
          className="w-8 h-8 border-2 border-primary/20 shadow-sm 
                         hover:border-primary/40 transition-colors"
        >
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </header>

      <ScrollArea className="flex-grow p-3">
        <nav className="space-y-1" aria-label={`${role} navigation`}>
          {config.items.map((item) => (
            <MenuItem key={item.menuItemText} item={item} />
          ))}
        </nav>
      </ScrollArea>

      <ImprovedFooter />
    </div>
  );
}

export default function UnifiedSidebar({ role = "user" }: { role?: Role }) {
  const isMenuOpen = useSelector((state: RootState) => state.menu.isOpen);
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleMenu = () => {
    dispatch(toggleMenu());
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur shadow-lg 
                        rounded-full w-10 h-10 hover:bg-primary/20 hover:scale-110 
                        transition-transform"
              onClick={handleToggleMenu}
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-74 shadow-xl border-0">
            <SidebarContent role={role} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:block shadow-sm">
        <SidebarContent role={role} />
      </div>
    </>
  );
}
