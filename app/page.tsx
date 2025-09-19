"use client"

import { useState, useEffect } from "react"
import Desktop from "@/components/desktop/desktop"
import LoginScreen from "@/components/apps/login-screen"
import { authManager } from "@/lib/auth"

export default function SyntexOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      setIsAuthenticated(authManager.isAuthenticated())
      setIsLoading(false)
    }

    checkAuth()

    // Subscribe to auth changes
    const unsubscribe = authManager.subscribe((user) => {
      setIsAuthenticated(user !== null)
    })

    return unsubscribe
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p className="text-lg font-medium">Loading SyntexOS...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <Desktop /> : <LoginScreen onLogin={handleLogin} />
}
