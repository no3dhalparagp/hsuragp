'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LogOut, Settings, User } from 'lucide-react'

export default function ImprovedFooter() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const { data: session } = useSession()

    const handleLogout = async () => {
        await signOut({ redirect: false })
        router.push('/')
    }

    const handleSettings = () => {
        router.push('/admindashboard/settings')
    }

    const handleProfile = () => {
        router.push('/admindashboard/profile')
    }

    if (!session?.user) {
        return null
    }

    const { name, email, image } = session.user

    return (
        <footer className="w-full lg:w-64 sticky bottom-0 z-10 p-4 bg-background/95 backdrop-blur border-t border-gray-200 dark:border-gray-800 flex justify-between items-center shadow-sm">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button 
                        variant="ghost" 
                        className="p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                        <Avatar className="h-9 w-9 border-2 border-gray-200 dark:border-gray-700">
                            <AvatarImage src={image || undefined} alt={name || 'User'} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                {name ? name.charAt(0) : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Open user menu</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    className="w-56 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800"
                    align="start"
                >
                    <div className="flex flex-col px-3 py-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{email}</p>
                    </div>
                    <div className="mt-2 space-y-1">
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => { handleProfile(); setIsOpen(false); }}
                        >
                            <User className="mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" />
                            <span className="text-gray-700 dark:text-gray-300">Profile</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => { handleSettings(); setIsOpen(false); }}
                        >
                            <Settings className="mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" />
                            <span className="text-gray-700 dark:text-gray-300">Settings</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full justify-start px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
                            onClick={() => { handleLogout(); setIsOpen(false); }}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="lg:hidden px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
            >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="truncate max-w-[120px]">{name}</span>
            </Button>
        </footer>
    )
}
