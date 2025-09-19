"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, Battery, Volume2, Settings, Bell, Search, Menu } from "lucide-react"
import type { SystemSettings } from "@/lib/settings"

interface TaskbarProps {
  currentTime: Date
  settings: SystemSettings
}

export default function Taskbar({ currentTime, settings }: TaskbarProps) {
  const [notifications] = useState(3)

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: settings.timeFormat === "12h",
    }
    return date.toLocaleTimeString("en-US", options)
  }

  const formatDate = (date: Date) => {
    let options: Intl.DateTimeFormatOptions

    switch (settings.dateFormat) {
      case "EU":
        options = { weekday: "short", day: "numeric", month: "short" }
        break
      case "ISO":
        options = { weekday: "short", month: "2-digit", day: "2-digit" }
        break
      default: // US
        options = { weekday: "short", month: "short", day: "numeric" }
    }

    return date.toLocaleDateString("en-US", options)
  }

  const taskbarClass = `
    absolute left-0 right-0 h-8 taskbar-glass border border-white/10 z-50
    ${settings.taskbarPosition === "top" ? "top-0 border-b" : "bottom-0 border-t"}
  `

  return (
    <div className={taskbarClass}>
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section - App Menu */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-white/90 hover:bg-white/10">
            <Menu className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-white/90 hover:bg-white/10">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Center Section - Time and Date */}
        <div className="flex flex-col items-center text-white/90 text-xs leading-tight">
          <div className="font-medium">{formatTime(currentTime)}</div>
          <div className="text-white/70">{formatDate(currentTime)}</div>
        </div>

        {/* Right Section - System Tray */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-white/90 hover:bg-white/10">
            <Wifi className="h-4 w-4" />
          </Button>
          {settings.sounds && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-white/90 hover:bg-white/10">
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-6 px-2 text-white/90 hover:bg-white/10">
            <Battery className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-white/90 hover:bg-white/10 relative">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500 text-white">
                {notifications}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-white/90 hover:bg-white/10">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
