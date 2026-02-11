'use client'

import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useTransition } from 'react'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { renewSession } from '@/action/session'


export default function HeaderCountdown() {
  const { data: session, update } = useSession()
  const [remainingTime, setRemainingTime] = useState(0)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (session?.expires) {
      const interval = setInterval(() => {
        const now = Date.now()
        const expiresAt = new Date(session.expires).getTime()
        const timeLeft = Math.max(0, Math.floor((expiresAt - now) / 1000))
        setRemainingTime(timeLeft)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [session])

  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60
  // Assuming 15 minutes session length

  const isExpiringSoon = remainingTime <= 300 // 5 minutes or less
  const isExpired = remainingTime === 0

  const handleRenewSession = () => {
    startTransition(async () => {
      try {
        const result = await renewSession()
        if (result.success) {
          await update({ expires: result.newExpiryTime })
        }
      } catch (error) {
        console.error('Failed to renew session:', error)
      }
    })
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      
      <span
        className={`font-medium ${isExpired ? 'text-red-500' :
          isExpiringSoon ? 'text-yellow-500' :
            'text-green-500'
          }`}
      >
        {isExpired ? (
          <span role="alert">Expired</span>
        ) : (
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        )}
      </span>
      {(isExpiringSoon || isExpired) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRenewSession}
          disabled={isPending}
          aria-label="Renew session"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
