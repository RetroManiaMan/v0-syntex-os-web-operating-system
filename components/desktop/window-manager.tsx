"use client"

import { useDesktop } from "@/contexts/desktop-context"
import Window from "./window"
import FileExplorer from "@/components/apps/file-explorer"
import NotesApp from "@/components/apps/notes-app"
import Terminal from "@/components/apps/terminal"
import Calculator from "@/components/apps/calculator"
import Browser from "@/components/apps/browser"
import ImageViewer from "@/components/apps/image-viewer"
import SettingsApp from "@/components/apps/settings-app"
import AppStoreApp from "@/components/apps/app-store"

const getAppContent = (appId: string) => {
  switch (appId) {
    case "files":
      return <FileExplorer />
    case "notes":
      return <NotesApp />
    case "terminal":
      return <Terminal />
    case "calculator":
      return <Calculator />
    case "browser":
      return <Browser />
    case "photos":
      return <ImageViewer />
    case "settings":
      return <SettingsApp />
    case "app-store": // Added App Store app content
      return <AppStoreApp />
    case "music":
      return (
        <div className="p-4 text-center text-muted-foreground">
          <p>Music Player</p>
          <p className="text-sm mt-2">Coming soon...</p>
        </div>
      )
    case "chat":
      return (
        <div className="p-4 text-center text-muted-foreground">
          <p>Chat Application</p>
          <p className="text-sm mt-2">Coming soon...</p>
        </div>
      )
    default:
      return (
        <div className="p-4 text-center text-muted-foreground">
          <p>Welcome to {appId}</p>
          <p className="text-sm mt-2">This app is under development.</p>
        </div>
      )
  }
}

export default function WindowManager() {
  const { windows } = useDesktop()

  return (
    <div className="absolute inset-0 pointer-events-none">
      {windows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          isActive={window.isActive}
          isMinimized={window.isMinimized}
          isMaximized={window.isMaximized}
          position={window.position}
          size={window.size}
          zIndex={window.zIndex}
        >
          {getAppContent(window.id)}
        </Window>
      ))}
    </div>
  )
}
