"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Clock, Thermometer, Wifi, Battery, Cpu, HardDrive } from "lucide-react"

interface WidgetProps {
  position: { x: number; y: number }
  onDrag?: (position: { x: number; y: number }) => void
}

export function ClockWidget({ position, onDrag }: WidgetProps) {
  const [time, setTime] = useState(new Date())
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!widgetRef.current) return
    const rect = widgetRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    }
    onDrag?.(newPosition)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  return (
    <Card
      ref={widgetRef}
      className={`absolute p-4 bg-white/10 backdrop-blur-md border-white/20 cursor-move select-none transition-all duration-200 hover:bg-white/15 ${isDragging ? "scale-105 shadow-2xl" : ""}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-3 text-white">
        <Clock className="w-5 h-5 text-blue-400" />
        <div>
          <div className="text-lg font-mono font-semibold">{time.toLocaleTimeString()}</div>
          <div className="text-xs opacity-80">{time.toLocaleDateString()}</div>
        </div>
      </div>
    </Card>
  )
}

export function WeatherWidget({ position, onDrag }: WidgetProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!widgetRef.current) return
    const rect = widgetRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    }
    onDrag?.(newPosition)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  return (
    <Card
      ref={widgetRef}
      className={`absolute p-4 bg-white/10 backdrop-blur-md border-white/20 cursor-move select-none transition-all duration-200 hover:bg-white/15 ${isDragging ? "scale-105 shadow-2xl" : ""}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-3 text-white">
        <Thermometer className="w-5 h-5 text-orange-400" />
        <div>
          <div className="text-lg font-semibold">72°F</div>
          <div className="text-xs opacity-80">Sunny & Clear</div>
        </div>
      </div>
    </Card>
  )
}

export function SystemStatsWidget({ position, onDrag }: WidgetProps) {
  const [stats, setStats] = useState({ cpu: 45, memory: 62, network: true, battery: 85 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 30) + 20,
        memory: Math.floor(Math.random() * 40) + 40,
        network: Math.random() > 0.1,
        battery: Math.floor(Math.random() * 20) + 75,
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!widgetRef.current) return
    const rect = widgetRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    }
    onDrag?.(newPosition)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  return (
    <Card
      ref={widgetRef}
      className={`absolute p-4 bg-white/10 backdrop-blur-md border-white/20 cursor-move select-none transition-all duration-200 hover:bg-white/15 ${isDragging ? "scale-105 shadow-2xl" : ""}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <div className="text-white space-y-3">
        <div className="text-sm font-semibold flex items-center gap-2">
          <Cpu className="w-4 h-4 text-green-400" />
          System Stats
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              CPU:
            </span>
            <span className="font-mono">{stats.cpu}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              Memory:
            </span>
            <span className="font-mono">{stats.memory}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Wifi className={`w-3 h-3 ${stats.network ? "text-green-400" : "text-red-400"}`} />
              <Battery className="w-3 h-3 text-blue-400" />
            </div>
            <span className="font-mono">{stats.battery}%</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
