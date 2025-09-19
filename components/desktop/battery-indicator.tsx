"use client"

import { useState, useEffect } from "react"
import { Battery, BatteryLow, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BatteryIndicatorProps {
  showPercentage?: boolean
  warningLevel?: number
}

export default function BatteryIndicator({ showPercentage = true, warningLevel = 20 }: BatteryIndicatorProps) {
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [isCharging, setIsCharging] = useState(false)

  useEffect(() => {
    // Simulate battery level changes
    const interval = setInterval(() => {
      setBatteryLevel((prev) => {
        const change = Math.random() * 2 - 1 // Random change between -1 and 1
        const newLevel = Math.max(0, Math.min(100, prev + change))
        return Math.round(newLevel)
      })

      // Randomly toggle charging status
      if (Math.random() < 0.1) {
        setIsCharging((prev) => !prev)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getBatteryIcon = () => {
    if (batteryLevel <= warningLevel) {
      return <BatteryLow className="w-4 h-4 text-red-500" />
    }
    return <Battery className="w-4 h-4" />
  }

  const getBatteryColor = () => {
    if (batteryLevel <= warningLevel) return "text-red-500"
    if (batteryLevel <= 50) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="flex items-center space-x-1 text-white/90">
      <div className="relative">
        {getBatteryIcon()}
        {isCharging && <Zap className="w-2 h-2 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />}
      </div>
      {showPercentage && <span className={`text-xs ${getBatteryColor()}`}>{batteryLevel}%</span>}
      {batteryLevel <= warningLevel && (
        <Badge variant="destructive" className="text-xs px-1 py-0">
          Low
        </Badge>
      )}
    </div>
  )
}
