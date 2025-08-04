
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, ChevronUp, Menu, User, Lock } from "lucide-react";
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
  isRestrictedForRole,
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
    items: superAdminMenuItems
  },
};

// Components
function MenuItem({ 
  item, 
  currentRole 
}: { 
  item: MenuItemProps; 
  currentRole: Role; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isRestricted = isRestrictedForRole(item, currentRole);

  const toggleSubMenu = () => {
    if (!isRestricted) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="mb-1 relative group">
      <Button
        variant="ghost"
        className={`w-full justify-start px-4 py-3 rounded-xl transition-all duration-300 group 
                   hover:pl-6 active:scale-[0.98] ${
                     isRestricted 
                       ? "opacity-50 cursor-not-allowed hover:bg-transparent" 
                       : "hover:bg-primary/10"
                   }`}
        onClick={item.submenu ? toggleSubMenu : undefined}
        disabled={isRestricted}
      >
        <Link
          href={isRestricted ? "#" : item.menuItemLink || "#"}
          className="flex items-center gap-3 w-full"
          onClick={(e) => {
            if (item.submenu || isRestricted) {
              e.preventDefault();
            }
          }}
        >
          {item.Icon && (
            <div
              className={`p-2 rounded-xl ${
                isRestricted
                  ? "bg-muted"
                  : "bg-gradient-to-br from-background to-primary/10 group-hover:from-primary/20 group-hover:to-primary/30"
              }`}
            >
              <item.Icon
                className={`w-5 h-5 transition-colors ${
                  isRestricted ? "text-muted-foreground" : item.color
                }`}
              />
            </div>
          )}
          <span
            className={`font-medium text-sm transition-colors ${
              isRestricted
                ? "text-muted-foreground"
                : "group-hover:text-primary"
            }`}
          >
            {item.menuItemText}
          </span>
          
          <div className="ml-auto flex items-center">
            {isRestricted && (
              <Lock className="w-4 h-4 text-red-500/80 mr-2" />
            )}
            {item.submenu && !isRestricted && (
              <span className="transform transition-transform duration-300">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </span>
            )}
          </div>
        </Link>
      </Button>

      {item.submenu && !isRestricted && (
        <div
          className={`ml-8 pl-2 border-l-2 border-primary/20 space-y-1 overflow-hidden transition-all duration-500 
                     ease-[cubic-bezier(0.4,0,0.2,1)] ${
                       isOpen ? "max-h-screen opacity-100 mt-2" : "max-h-0 opacity-0"
                     }`}
        >
          {item.subMenuItems.map((subItem) => (
            <MenuItem 
              key={subItem.menuItemText} 
              item={subItem} 
              currentRole={currentRole} 
            />
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
      className="w-74 flex-shrink-0 border-r border-primary/10 bg-background/70 backdrop-blur-xl 
                h-full flex flex-col shadow-lg"
    >
      <header
        className="h-20 border-b border-primary/10 p-4 flex items-center justify-between 
                  bg-gradient-to-r from-primary/5 to-primary/15 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary to-secondary p-1.5 rounded-xl">
            <div className="bg-background p-1 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-primary">
            {config.title}
          </h1>
        </div>
        <Avatar
          className="w-9 h-9 border border-primary/20 shadow-sm 
                    hover:border-primary/40 transition-colors"
        >
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </header>

      <ScrollArea className="flex-grow p-4">
        <nav className="space-y-2" aria-label={`${role} navigation`}>
          {config.items.map((item) => (
            <MenuItem 
              key={item.menuItemText} 
              item={item} 
              currentRole={role} 
            />
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
                        rounded-xl w-10 h-10 hover:bg-primary/10 hover:scale-110 
                        transition-transform border-primary/20"
              onClick={handleToggleMenu}
            >
              <Menu className="w-5 h-5 text-primary" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="p-0 w-74 shadow-xl border-0 bg-background/80 backdrop-blur-lg"
          >
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
