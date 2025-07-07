import React from "react";
import { Bell, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserButtonProfile from "../auth/userButton";
import NotificationBell from "../NotificationBell";
import NotificationMessage from "../NotificationMessage";
import Humbargarmenu from "./Humbargarmenu";
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
    <header className="sticky top-0 z-10 w-full border-b border-gray-100/95 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="hidden items-center space-x-2 rounded-full bg-white px-3 py-1.5 shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-300 sm:flex">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] border-none bg-transparent focus:outline-none md:w-[300px]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {userInfo?.role === "admin" && (
              <>
                <NotificationBell />

                <NotificationMessage />
              </>
            )}

            <UserButtonProfile user={userInfo} />
          </div>
        </div>
      </div>
    </header>
  );
}
