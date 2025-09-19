"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Taskbar from "./taskbar"
import Dock from "./dock"
import WindowManager from "./window-manager"
import ContextMenu from "./context-menu"
import BootScreen from "./boot-screen"
import { ClockWidget, WeatherWidget, SystemStatsWidget } from "./desktop-widgets"
import { DesktopProvider, useDesktop } from "@/contexts/desktop-context"
import { settingsManager, wallpapers } from "@/lib/settings"

function DesktopContent() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [settings, setSettings] = useState(settingsManager.getSettings())
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [isBooting, setIsBooting] = useState(true)
  const [widgets, setWidgets] = useState([
    { id: "clock", type: "clock", position: { x: 50, y: 80 } },
    { id: "weather", type: "weather", position: { x: 280, y: 80 } },
    { id: "stats", type: "stats", position: { x: 480, y: 80 } },
  ])
  const { openApp } = useDesktop()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const unsubscribe = settingsManager.subscribe(setSettings)
    return unsubscribe
  }, [])

  const getWallpaperStyle = () => {
    if (settings.wallpaperType === "gradient") {
      const gradient = wallpapers.gradients.find((w) => w.id === settings.wallpaper)
      return gradient ? { background: gradient.value } : {}
    } else if (settings.wallpaperType === "solid") {
      const solid = wallpapers.solids.find((w) => w.id === settings.wallpaper)
      return solid ? { backgroundColor: solid.value } : {}
    }
    return {}
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const handleContextAction = (action: string) => {
    switch (action) {
      case "settings":
        openApp("settings")
        break
      case "wallpaper":
        openApp("settings")
        break
      case "new-folder":
        openApp("files")
        break
      case "new-document":
        openApp("notes")
        break
      case "refresh":
        window.location.reload()
        break
      default:
        console.log("Context action:", action)
    }
  }

  const updateWidgetPosition = (widgetId: string, position: { x: number; y: number }) => {
    // Ensure widgets stay within screen bounds
    const maxX = window.innerWidth - 200 // Approximate widget width
    const maxY = window.innerHeight - 150 // Approximate widget height

    const boundedPosition = {
      x: Math.max(0, Math.min(position.x, maxX)),
      y: Math.max(0, Math.min(position.y, maxY)),
    }

    setWidgets((prev) => prev.map((w) => (w.id === widgetId ? { ...w, position: boundedPosition } : w)))
  }

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden relative"
      style={getWallpaperStyle()}
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-500/10 to-pink-500/10" />

      {settings.enableParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(settings.animations ? 25 : 8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {settings.showDesktopWidgets && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="pointer-events-auto">
            {widgets.map((widget) => {
              switch (widget.type) {
                case "clock":
                  return (
                    <ClockWidget
                      key={widget.id}
                      position={widget.position}
                      onDrag={(pos) => updateWidgetPosition(widget.id, pos)}
                    />
                  )
                case "weather":
                  return (
                    <WeatherWidget
                      key={widget.id}
                      position={widget.position}
                      onDrag={(pos) => updateWidgetPosition(widget.id, pos)}
                    />
                  )
                case "stats":
                  return (
                    <SystemStatsWidget
                      key={widget.id}
                      position={widget.position}
                      onDrag={(pos) => updateWidgetPosition(widget.id, pos)}
                    />
                  )
                default:
                  return null
              }
            })}
          </div>
        </div>
      )}

      {settings.showDesktopIcons && (
        <div className="absolute inset-0 p-4">
          <div className="grid grid-cols-12 gap-4 h-full">{/* Desktop icons will go here */}</div>
        </div>
      )}

      <WindowManager />

      {settings.taskbarPosition === "top" && <Taskbar currentTime={currentTime} settings={settings} />}

      <Dock settings={settings} />

      {settings.taskbarPosition === "bottom" && <Taskbar currentTime={currentTime} settings={settings} />}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAction={handleContextAction}
        />
      )}
    </div>
  )
}

export default function Desktop() {
  return (
    <DesktopProvider>
      <DesktopContent />
    </DesktopProvider>
  )
}
