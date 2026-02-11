import React from "react";
import { Bell, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserButtonProfile from "../auth/userButton";
import NotificationBell from "../NotificationBell";
import NotificationMessage from "../NotificationMessage";
import { currentUser } from "@/lib/auth";
import { User } from "@prisma/client";
import { db } from "@/lib/db";

export default async function Header() {
  const cuser = await currentUser();
  let userInfo: User | null = null;

  if (cuser) {
    userInfo = await db.user.findUnique({
      where: { id: cuser.id },
    });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm lg:ml-64 xl:ml-72">
      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 max-w-full">
        <div className="flex h-16 items-center justify-between gap-3 md:gap-4">
          {/* Left Section - Search (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4 h-9 bg-muted/50 border-border/50 focus:bg-background focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {userInfo?.role === "admin" && (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="relative">
                    <NotificationBell />
                  </div>
                  <div className="relative">
                    <NotificationMessage />
                  </div>
                </div>
              </>
            )}

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            <UserButtonProfile user={userInfo} />
          </div>
        </div>
      </div>
    </header>
  );
}
