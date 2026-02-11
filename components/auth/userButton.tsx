
'use client'

import { useCallback } from "react"
import Link from "next/link"
import { LogOut, User as UserIcon, Settings, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LogoutButton from "./LogoutButton"
import { User } from "@prisma/client"
import { cn } from "@/lib/utils"

const dashboardRoutes = {
  admin: '/admindashboard',
  staff: '/employeedashboard',
  user: '/dashboard',
} as const

export default function UserButtonProfile({ user }: { user: User | null | undefined }) {
  const getDashboardRoute = useCallback((role: string) => {
    return dashboardRoutes[role as keyof typeof dashboardRoutes] || '/dashboard'
  }, [])

  if (!user) {
    return (
      <Link href="/login" passHref>
        <Button variant="outline" className="gap-2">
          <UserIcon className="h-4 w-4" />
          Sign In
        </Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="group relative h-auto px-2 py-1.5 rounded-full gap-3 hover:bg-accent/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-primary/10 group-hover:border-primary/20 transition-all">
              <AvatarImage src={user.image || ""} alt={`${user.name}'s avatar`} />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {user.name ? user.name[0].toUpperCase() : <UserIcon className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email?.split('@')[0]}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-1 transition-transform group-data-[state=open]:rotate-180" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-72 rounded-2xl shadow-lg border border-accent/20 bg-background/90 backdrop-blur-lg animate-in fade-in zoom-in-95"
      >
        <DropdownMenuLabel className="p-4 flex items-center gap-3 bg-accent/5">
          <Avatar className="h-11 w-11 border-2 border-primary/20">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold truncate max-w-[160px]">{user.name}</h3>
            <p className="text-sm text-muted-foreground truncate max-w-[160px]">{user.email}</p>
            <span className="text-xs font-medium text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full mt-1.5 inline-block">
              {user.role}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-accent/10" />

        <div className="p-2">
          <DropdownMenuItem asChild className="rounded-lg hover:bg-accent/20 focus:bg-accent/20 px-2.5 py-2.5">
            <Link
              href={`${getDashboardRoute(user.role)}/profile`}
              className="text-sm flex items-center gap-2"
            >
              <UserIcon className="h-[18px] w-[18px] text-muted-foreground" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild className="rounded-lg hover:bg-accent/20 focus:bg-accent/20 px-2.5 py-2.5">
            <Link
              href={`${getDashboardRoute(user.role)}/settings`}
              className="text-sm flex items-center gap-2"
            >
              <Settings className="h-[18px] w-[18px] text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2 bg-accent/10" />

          <DropdownMenuItem asChild className="rounded-lg hover:bg-destructive/10 focus:bg-destructive/10 text-destructive px-2.5 py-2.5">
            <LogoutButton>
              <div className="flex items-center gap-2 text-sm">
                <LogOut className="h-[18px] w-[18px]" />
                <span>Log Out</span>
              </div>
            </LogoutButton>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
