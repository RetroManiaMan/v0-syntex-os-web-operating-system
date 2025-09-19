"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Folder,
  FileText,
  ImageIcon,
  RefreshCw as Refresh,
  Monitor,
  Palette,
  Grid3X3,
  List,
} from "lucide-react"

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  onAction: (action: string) => void
}

export default function ContextMenu({ x, y, onClose, onAction }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const menuItems = [
    { icon: Refresh, label: "Refresh", action: "refresh" },
    { icon: Folder, label: "New Folder", action: "new-folder" },
    { icon: FileText, label: "New Document", action: "new-document" },
    { icon: ImageIcon, label: "New Image", action: "new-image" },
    { type: "separator" },
    { icon: Grid3X3, label: "View as Grid", action: "view-grid" },
    { icon: List, label: "View as List", action: "view-list" },
    { type: "separator" },
    { icon: Palette, label: "Change Wallpaper", action: "wallpaper" },
    { icon: Monitor, label: "Display Settings", action: "display" },
    { icon: Settings, label: "System Settings", action: "settings" },
  ]

  return (
    <Card
      ref={menuRef}
      className="absolute z-50 min-w-48 p-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20 shadow-lg"
      style={{ left: x, top: y }}
    >
      {menuItems.map((item, index) =>
        item.type === "separator" ? (
          <Separator key={index} className="my-1" />
        ) : (
          <button
            key={index}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/20 dark:hover:bg-gray-700/50 rounded transition-colors"
            onClick={() => {
              onAction(item.action)
              onClose()
            }}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ),
      )}
    </Card>
  )
}
