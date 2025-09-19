"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface WindowState {
  id: string
  title: string
  isActive: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

interface DesktopContextType {
  windows: WindowState[]
  openWindow: (id: string, title: string) => void
  closeWindow: (id: string) => void
  updateWindow: (id: string, updates: Partial<WindowState>) => void
  focusWindow: (id: string) => void
  openApp: (appId: string) => void
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined)

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [nextZIndex, setNextZIndex] = useState(100)

  const appTitles: Record<string, string> = {
    files: "File Explorer",
    notes: "Notes",
    terminal: "Terminal",
    calculator: "Calculator",
    browser: "Browser",
    settings: "Settings",
    "image-viewer": "Image Viewer",
    "app-store": "App Store",
  }

  const openWindow = (id: string, title: string) => {
    const existingWindow = windows.find((w) => w.id === id)

    if (existingWindow) {
      focusWindow(id)
      if (existingWindow.isMinimized) {
        updateWindow(id, { isMinimized: false })
      }
      return
    }

    const newWindow: WindowState = {
      id,
      title,
      isActive: true,
      isMinimized: false,
      isMaximized: false,
      position: {
        x: Math.random() * (window.innerWidth - 600) + 50,
        y: Math.random() * (window.innerHeight - 400) + 100,
      },
      size: { width: 600, height: 400 },
      zIndex: nextZIndex,
    }

    setWindows((prev) => [...prev.map((w) => ({ ...w, isActive: false })), newWindow])
    setNextZIndex((prev) => prev + 1)
  }

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }

  const updateWindow = (id: string, updates: Partial<WindowState>) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)))
  }

  const focusWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => ({
        ...w,
        isActive: w.id === id,
        zIndex: w.id === id ? nextZIndex : w.zIndex,
      })),
    )
    setNextZIndex((prev) => prev + 1)
  }

  const openApp = (appId: string) => {
    const title = appTitles[appId] || appId
    openWindow(appId, title)
  }

  return (
    <DesktopContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        updateWindow,
        focusWindow,
        openApp,
      }}
    >
      {children}
    </DesktopContext.Provider>
  )
}

export function useDesktop() {
  const context = useContext(DesktopContext)
  if (context === undefined) {
    throw new Error("useDesktop must be used within a DesktopProvider")
  }
  return context
}
