"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useDesktop } from "@/contexts/desktop-context"
import { Minus, X, Maximize2 } from "lucide-react"

interface WindowProps {
  id: string
  title: string
  isActive: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  children: React.ReactNode
}

export default function Window({
  id,
  title,
  isActive,
  isMinimized,
  isMaximized,
  position,
  size,
  zIndex,
  children,
}: WindowProps) {
  const { updateWindow, closeWindow, focusWindow } = useDesktop()
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("window-header")) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
      focusWindow(id)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      updateWindow(id, {
        position: {
          x: Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x)),
          y: Math.max(32, Math.min(window.innerHeight - size.height - 80, e.clientY - dragStart.y)),
        },
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, position, size])

  if (isMinimized) return null

  const windowStyle = isMaximized
    ? { top: 32, left: 0, width: "100vw", height: "calc(100vh - 112px)" }
    : {
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
      }

  return (
    <div
      ref={windowRef}
      className={`
        absolute window-glass rounded-lg shadow-2xl pointer-events-auto
        transition-all duration-200 ease-out
        ${isActive ? "ring-2 ring-primary/50" : ""}
        ${isDragging ? "cursor-move" : ""}
      `}
      style={{
        ...windowStyle,
        zIndex,
      }}
      onMouseDown={handleMouseDown}
      onClick={() => focusWindow(id)}
    >
      {/* Window Header */}
      <div className="window-header flex items-center justify-between h-8 px-3 border-b border-white/10 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 rounded-full bg-red-500 hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation()
                closeWindow(id)
              }}
            >
              <X className="h-2 w-2 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 rounded-full bg-yellow-500 hover:bg-yellow-600"
              onClick={(e) => {
                e.stopPropagation()
                updateWindow(id, { isMinimized: true })
              }}
            >
              <Minus className="h-2 w-2 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 rounded-full bg-green-500 hover:bg-green-600"
              onClick={(e) => {
                e.stopPropagation()
                updateWindow(id, { isMaximized: !isMaximized })
              }}
            >
              <Maximize2 className="h-2 w-2 text-white" />
            </Button>
          </div>
          <span className="text-sm font-medium text-foreground/90">{title}</span>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden rounded-b-lg" style={{ height: "calc(100% - 32px)" }}>
        {children}
      </div>
    </div>
  )
}
