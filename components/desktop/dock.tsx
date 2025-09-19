"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useDesktop } from "@/contexts/desktop-context"
import {
  FolderOpen,
  NotebookPen,
  Terminal,
  Settings,
  Calculator,
  Headphones,
  Camera,
  Globe,
  MessageSquare,
  ShoppingBag,
} from "lucide-react"
import type { SystemSettings } from "@/lib/settings"

const dockApps = [
  { id: "files", name: "Files", icon: FolderOpen, color: "text-blue-500" },
  { id: "notes", name: "Notes", icon: NotebookPen, color: "text-amber-500" },
  { id: "terminal", name: "Terminal", icon: Terminal, color: "text-emerald-500" },
  { id: "browser", name: "Browser", icon: Globe, color: "text-indigo-500" },
  { id: "calculator", name: "Calculator", icon: Calculator, color: "text-slate-600" },
  { id: "music", name: "Music", icon: Headphones, color: "text-violet-500" },
  { id: "photos", name: "Photos", icon: Camera, color: "text-rose-500" },
  { id: "chat", name: "Chat", icon: MessageSquare, color: "text-teal-500" },
  { id: "app-store", name: "App Store", icon: ShoppingBag, color: "text-cyan-500" },
  { id: "settings", name: "Settings", icon: Settings, color: "text-gray-500" },
]

interface DockProps {
  settings: SystemSettings
}

export default function Dock({ settings }: DockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { openWindow } = useDesktop()

  const getDockSize = () => {
    switch (settings.dockSize) {
      case "small":
        return "h-10 w-10"
      case "large":
        return "h-16 w-16"
      default:
        return "h-12 w-12"
    }
  }

  const getIconSize = () => {
    switch (settings.dockSize) {
      case "small":
        return "h-5 w-5"
      case "large":
        return "h-8 w-8"
      default:
        return "h-6 w-6"
    }
  }

  const getDockPosition = () => {
    const baseClasses = "absolute z-40 transition-all duration-300"
    const hideClass = settings.autoHideDock ? "hover:opacity-100 opacity-30" : ""

    switch (settings.dockPosition) {
      case "left":
        return `${baseClasses} ${hideClass} left-4 top-1/2 transform -translate-y-1/2`
      case "right":
        return `${baseClasses} ${hideClass} right-4 top-1/2 transform -translate-y-1/2`
      default:
        return `${baseClasses} ${hideClass} bottom-4 left-1/2 transform -translate-x-1/2`
    }
  }

  const getDockLayout = () => {
    return settings.dockPosition === "left" || settings.dockPosition === "right"
      ? "flex flex-col items-center space-y-1"
      : "flex items-center space-x-1"
  }

  const getMagnificationScale = (appIndex: number) => {
    if (!settings.dockMagnification || !hoveredApp) return 1

    const hoveredIndex = dockApps.findIndex((app) => app.id === hoveredApp)
    const distance = Math.abs(appIndex - hoveredIndex)

    if (distance === 0) return 1.4
    if (distance === 1) return 1.2
    if (distance === 2) return 1.1
    return 1
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <div className={getDockPosition()} onMouseMove={handleMouseMove}>
      <div className="dock-glass rounded-2xl p-2 border border-white/20 backdrop-blur-md bg-white/10">
        <div className={getDockLayout()}>
          {dockApps.map((app, index) => {
            const Icon = app.icon
            const isHovered = hoveredApp === app.id
            const buttonSize = getDockSize()
            const iconSize = getIconSize()
            const scale = getMagnificationScale(index)

            return (
              <div key={app.id} className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    ${buttonSize} p-0 rounded-xl transition-all duration-200 ease-out
                    hover:bg-white/20 relative
                    ${settings.windowAnimations ? "hover:scale-110 hover:-translate-y-1" : ""}
                    ${settings.dockPosition === "left" ? "hover:-translate-x-1" : ""}
                    ${settings.dockPosition === "right" ? "hover:translate-x-1" : ""}
                  `}
                  style={{
                    transform: settings.dockMagnification
                      ? `scale(${scale}) ${isHovered ? "translateY(-4px)" : ""}`
                      : undefined,
                  }}
                  onMouseEnter={() => setHoveredApp(app.id)}
                  onMouseLeave={() => setHoveredApp(null)}
                  onClick={() => openWindow(app.id, app.name)}
                >
                  <Icon className={`${iconSize} ${app.color}`} />
                </Button>

                {isHovered && (
                  <div
                    className={`
                    absolute z-50 px-2 py-1 text-xs text-white bg-black/80 rounded
                    pointer-events-none transition-opacity duration-200
                    ${settings.dockPosition === "bottom" ? "bottom-full mb-2" : ""}
                    ${settings.dockPosition === "top" ? "top-full mt-2" : ""}
                    ${settings.dockPosition === "left" ? "left-full ml-2" : ""}
                    ${settings.dockPosition === "right" ? "right-full mr-2" : ""}
                  `}
                  >
                    {app.name}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
