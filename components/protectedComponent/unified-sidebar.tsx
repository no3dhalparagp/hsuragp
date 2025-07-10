
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, ChevronUp, Menu, User, Lock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/redux/store";
import { toggleMenu } from "@/redux/slices/menuSlice";
import ImprovedFooter from "../improved-footer";
import { useQuery } from "@tanstack/react-query";
import { getIconComponent } from "@/utils/menu-icons";
import { Role } from "@prisma/client";

// Types
type MenuItemData = {
  id: string;
  text: string;
  link?: string;
  icon?: string;
  color?: string;
  children: MenuItemData[];
  allowedRoles: Role[];
};

async function fetchMenu(role: Role): Promise<MenuItemData[]> {
  const res = await fetch('/api/menu');
  if (!res.ok) throw new Error('Failed to fetch menu');
  return res.json();
}

// Menu Item Component
function MenuItem({ 
  item, 
  currentRole 
}: { 
  item: MenuItemData; 
  currentRole: Role; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isRestricted = !item.allowedRoles.includes(currentRole);
  const hasChildren = item.children && item.children.length > 0;
  const IconComponent = item.icon ? getIconComponent(item.icon) : null;

  const toggleSubMenu = () => {
    if (!isRestricted && hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="mb-1 relative group">
      <Button
        variant="ghost"
        className={`w-full justify-start px-4 py-3 rounded-lg transition-all duration-300 group 
                   hover:pl-6 active:scale-[0.98] shadow-sm ${
                     isRestricted 
                       ? "opacity-50 cursor-not-allowed hover:bg-transparent" 
                       : "hover:bg-accent/30"
                   }`}
        onClick={toggleSubMenu}
        disabled={isRestricted}
      >
        <Link
          href={isRestricted ? "#" : item.link || "#"}
          className="flex items-center gap-3 w-full"
          onClick={(e) => {
            if (isRestricted || hasChildren) {
              e.preventDefault();
            }
          }}
        >
          {IconComponent && (
            <div
              className={`p-1.5 rounded-md shadow-md ${
                isRestricted
                  ? "bg-muted"
                  : "bg-gradient-to-br from-background to-accent/10 group-hover:from-accent/20 group-hover:to-accent/30"
              }`}
            >
              <IconComponent
                className={`w-5 h-5 transition-colors ${
                  isRestricted ? "text-muted-foreground" : item.color || "text-blue-500"
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
            {item.text}
          </span>
          
          <div className="ml-auto flex items-center">
            {isRestricted && (
              <Lock className="w-4 h-4 text-red-500 mr-2" />
            )}
            {hasChildren && !isRestricted && (
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

      {hasChildren && !isRestricted && (
        <div
          className={`ml-6 space-y-1 overflow-hidden transition-all duration-500 
                     ease-[cubic-bezier(0.4,0,0.2,1)] ${
                       isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                     }`}
        >
          {item.children.map((child) => (
            <MenuItem 
              key={child.id} 
              item={child} 
              currentRole={currentRole} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({ role }: { role: Role }) {
  const { data: menuItems, isLoading, isError } = useQuery<MenuItemData[]>({
    queryKey: ['menu', role],
    queryFn: () => fetchMenu(role),
    staleTime: 60 * 60 * 1000 // 1 hour cache
  });

  const getTitle = () => {
    switch (role) {
      case Role.PUBLIC: return "User Dashboard";
      case Role.ADMIN: return "Admin Portal";
      case Role.EMPLOYEE: return "Staff Portal";
      case Role.SUPERADMIN: return "Super Admin Portal";
      default: return "Dashboard";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 p-4 text-center">
        Error loading menu. Please try again later.
      </div>
    );
  }

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
          {getTitle()}
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
          {menuItems?.map((item) => (
            <MenuItem key={item.id} item={item} currentRole={role} />
          ))}
        </nav>
      </ScrollArea>

      <ImprovedFooter />
    </div>
  );
}

export default function UnifiedSidebar({ role = Role.PUBLIC }: { role?: Role }) {
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
