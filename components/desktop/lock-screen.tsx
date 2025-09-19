"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock, User, Eye, EyeOff } from "lucide-react"
import { authManager } from "@/lib/auth"

interface LockScreenProps {
  onUnlock: () => void
  currentUser?: { username: string; avatar?: string } | null
}

export default function LockScreen({ onUnlock, currentUser }: LockScreenProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleUnlock = async () => {
    if (!currentUser || !password.trim()) return

    setIsLoading(true)
    setError("")

    const result = await authManager.login(currentUser.username, password)

    if (result.success) {
      onUnlock()
    } else {
      setError(result.error || "Invalid password")
      setPassword("")
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUnlock()
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background blur effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />

      {/* Time display */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center text-white">
        <div className="text-6xl font-light mb-2">
          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="text-xl opacity-80">
          {currentTime.toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Login card */}
      <Card className="w-96 p-8 bg-white/10 backdrop-blur-md border-white/20 text-white">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar || "/placeholder.svg"} alt="Avatar" className="w-16 h-16 rounded-full" />
            ) : (
              <User className="w-10 h-10" />
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2">{currentUser?.username || "User"}</h2>
          <p className="text-white/70">Enter your password to unlock</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button
            onClick={handleUnlock}
            disabled={!password.trim() || isLoading}
            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
          >
            <Lock className="w-4 h-4 mr-2" />
            {isLoading ? "Unlocking..." : "Unlock"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
