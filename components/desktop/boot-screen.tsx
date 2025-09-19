"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface BootScreenProps {
  onComplete: () => void
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("Initializing SyntexOS...")

  const bootSteps = [
    "Initializing SyntexOS...",
    "Loading system components...",
    "Setting up desktop environment...",
    "Configuring applications...",
    "Applying user preferences...",
    "Starting window manager...",
    "Ready to use!",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2
        const stepIndex = Math.floor((newProgress / 100) * bootSteps.length)
        if (stepIndex < bootSteps.length) {
          setCurrentStep(bootSteps[stepIndex])
        }

        if (newProgress >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 text-white max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <h1 className="text-2xl font-bold">SyntexOS</h1>
            <p className="text-sm opacity-80">Web Operating System</p>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <Progress value={progress} className="h-2" />
            <p className="text-sm opacity-90">{currentStep}</p>
          </div>

          {/* Version info */}
          <div className="text-xs opacity-60">Version 1.0.0 • Build 2024.01.01</div>
        </div>
      </Card>
    </div>
  )
}
