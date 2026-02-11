"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  submenu?: NavItem[];
}

interface PublicNavbarProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "About Us",
    href: "/aboutus",
    submenu: [
      { name: "Our History", href: "/aboutus/history" },
      { name: "Team", href: "/aboutus/team" },
      { name: "Vision & Mission", href: "/aboutus/vision-mission" },
      { name: "Achievements", href: "/aboutus/achivement" },
    ],
  },
  {
    name: "Services",
    href: "/services",
    submenu: [
      {
        name: "E-Governance",
        href: "/services/egovernance",
        submenu: [
          {
            name: "Online Applications",
            href: "/services/e-governance/applications",
          },
          {
            name: "Document Verification",
            href: "/services/e-governance/verification",
          },
          {
            name: "Grievance Redressal",
            href: "/services/e-governance/grievance",
          },
        ],
      },
      {
        name: "Social Welfare",
        href: "/services/social-welfare",
        submenu: [
          { name: "Pension Schemes", href: "/services/social-welfare/pension" },
          {
            name: "Education Support",
            href: "/services/social-welfare/education",
          },
          {
            name: "Healthcare Initiatives",
            href: "/services/social-welfare/healthcare",
          },
        ],
      },
      { name: "Infrastructure Development", href: "/services/infrastructure" },
    ],
  },
  {
    name: "Population",
    href: "/populationinfo",
    submenu: [
      { name: "Demographics", href: "/populationinfo/demographics" },
      { name: "Census Data", href: "/populationinfo/census" },
      { name: "Population Trends", href: "/populationinfo/trends" },
    ],
  },
  {
    name: "Development",
    href: "/development",
    submenu: [
      { name: "Agriculture", href: "/development/agriculture" },
      { name: "Rural Industries", href: "/development/rural-industries" },
      { name: "Skill Development", href: "/development/skill-development" },
      { name: "Women Empowerment", href: "/development/women-empowerment" },
    ],
  },
  {
    name: "Tender",
    href: "/tender",
    submenu: [
      { name: "Current Tenders", href: "/tender/current" },
      { name: "Past Tenders", href: "/tender/past" },
      { name: "How to Apply", href: "/tender/how-to-apply" },
      { name: "Tender Guidelines", href: "/tender/guidelines" },
    ],
  },
  {
    name: "Resources",
    href: "/resources",
    submenu: [
      { name: "Forms & Documents", href: "/resources/forms" },
      { name: "Acts & Rules", href: "/resources/acts-rules" },
      { name: "Reports", href: "/resources/reports" },
      { name: "FAQs", href: "/resources/faqs" },
    ],
  },
  { name: "Contact Us", href: "/contact" },
];

function DropdownMenu({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative group" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive
            ? "text-primary bg-primary/10"
            : "text-foreground/80 hover:bg-accent/50 hover:text-foreground"
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {item.name}
        <ChevronDown
          className={cn(
            "ml-1.5 h-3.5 w-3.5 opacity-70 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && item.submenu && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.1 }}
            className="absolute left-0 mt-1 w-52 rounded-lg shadow-md bg-background/95 backdrop-blur-sm border"
          >
            <div className="p-1.5 space-y-0.5">
              {item.submenu.map((subItem) => (
                <div key={subItem.name}>
                  {subItem.submenu ? (
                    <NestedDropdown item={subItem} />
                  ) : (
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <Link
                        href={subItem.href}
                        className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/50 transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NestedDropdown({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const nestedDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        nestedDropdownRef.current &&
        !nestedDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative group"
      ref={nestedDropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.button
        className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md hover:bg-accent/50 transition-colors"
        role="menuitem"
        whileHover={{ x: 1 }}
      >
        <span>{item.name}</span>
        <ChevronRight className="ml-1.5 h-3.5 w-3.5 opacity-70" />
      </motion.button>

      <AnimatePresence>
        {isOpen && item.submenu && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.1 }}
            className="absolute left-full top-0 -ml-1 w-52 rounded-lg shadow-md bg-background/95 backdrop-blur-sm border"
          >
            <div className="p-1.5 space-y-0.5">
              {item.submenu.map((subItem) => (
                <motion.div key={subItem.name} whileHover={{ scale: 1.01 }}>
                  <Link
                    href={subItem.href}
                    className="block px-3 py-2 text-sm rounded-md hover:bg-accent/50 transition-colors"
                  >
                    {subItem.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenuItem({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="border-b last:border-0 border-border/10">
      {item.submenu ? (
        <>
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium",
              pathname.startsWith(item.href)
                ? "text-primary"
                : "text-foreground/80"
            )}
            whileTap={{ scale: 0.98 }}
          >
            <span>{item.name}</span>
            <ChevronRight
              className={cn(
                "h-4 w-4 transform transition-transform",
                isOpen && "rotate-90"
              )}
            />
          </motion.button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-3 space-y-1"
              >
                {item.submenu.map((subItem) => (
                  <MobileMenuItem key={subItem.name} item={subItem} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          href={item.href}
          className={cn(
            "block px-3 py-2.5 text-sm font-medium",
            pathname === item.href ? "text-primary" : "text-foreground/80"
          )}
        >
          {item.name}
        </Link>
      )}
    </div>
  );
}

export function PublicNavbar({ className, ...props }: PublicNavbarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "relative z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className
      )}
      {...props}
    >
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-0.5">
        {navItems.map((item) => (
          <React.Fragment key={item.name}>
            {item.submenu ? (
              <DropdownMenu
                item={item}
                isActive={pathname.startsWith(item.href)}
              />
            ) : (
              <motion.div whileHover={{ scale: 1.01 }}>
                <Link
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-background/80 backdrop-blur-sm hover:bg-accent/50 h-8 w-8"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[85vw] max-w-sm sm:w-[300px] p-0"
          >
            <nav className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto px-1.5 py-3">
                <div className="space-y-0.5">
                  {navItems.map((item) => (
                    <MobileMenuItem key={item.name} item={item} />
                  ))}
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default PublicNavbar;
