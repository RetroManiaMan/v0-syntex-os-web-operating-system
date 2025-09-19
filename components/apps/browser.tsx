"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, RotateCcw, Home, Plus, X } from "lucide-react"

interface Tab {
  id: string
  title: string
  url: string
  isActive: boolean
}

export default function Browser() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: "SyntexOS Browser",
      url: "syntex://home",
      isActive: true,
    },
  ])
  const [addressBar, setAddressBar] = useState("syntex://home")

  const activeTab = tabs.find((tab) => tab.isActive)

  const addTab = () => {
    const newTab: Tab = {
      id: crypto.randomUUID(),
      title: "New Tab",
      url: "syntex://home",
      isActive: true,
    }
    setTabs((prev) => prev.map((tab) => ({ ...tab, isActive: false })).concat(newTab))
    setAddressBar("syntex://home")
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return // Don't close the last tab

    const tabIndex = tabs.findIndex((tab) => tab.id === tabId)
    const newTabs = tabs.filter((tab) => tab.id !== tabId)

    if (tabs[tabIndex].isActive && newTabs.length > 0) {
      const nextActiveIndex = Math.min(tabIndex, newTabs.length - 1)
      newTabs[nextActiveIndex].isActive = true
      setAddressBar(newTabs[nextActiveIndex].url)
    }

    setTabs(newTabs)
  }

  const switchTab = (tabId: string) => {
    const newTabs = tabs.map((tab) => ({
      ...tab,
      isActive: tab.id === tabId,
    }))
    setTabs(newTabs)
    const activeTab = newTabs.find((tab) => tab.isActive)
    if (activeTab) {
      setAddressBar(activeTab.url)
    }
  }

  const navigate = (url: string) => {
    if (!activeTab) return

    const updatedTabs = tabs.map((tab) =>
      tab.id === activeTab.id
        ? {
            ...tab,
            url,
            title: getPageTitle(url),
          }
        : tab,
    )
    setTabs(updatedTabs)
  }

  const getPageTitle = (url: string): string => {
    if (url === "syntex://home") return "SyntexOS Home"
    if (url.startsWith("https://")) return new URL(url).hostname
    return "SyntexOS Browser"
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let url = addressBar.trim()

    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("syntex://")) {
      if (url.includes(".")) {
        url = "https://" + url
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`
      }
    }

    navigate(url)
  }

  const renderContent = () => {
    if (!activeTab) return null

    if (activeTab.url === "syntex://home") {
      return (
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to SyntexOS Browser</h1>
            <p className="text-lg text-gray-600 mb-8">Your gateway to the web within SyntexOS</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { name: "Google", url: "https://google.com" },
                { name: "GitHub", url: "https://github.com" },
                { name: "Stack Overflow", url: "https://stackoverflow.com" },
                { name: "MDN Docs", url: "https://developer.mozilla.org" },
              ].map((site) => (
                <Button
                  key={site.name}
                  variant="outline"
                  className="h-20 flex flex-col bg-transparent"
                  onClick={() => navigate(site.url)}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded mb-2" />
                  {site.name}
                </Button>
              ))}
            </div>

            <div className="text-sm text-gray-500">
              <p>Note: External websites will open in embedded iframes.</p>
              <p>Some sites may not work due to X-Frame-Options restrictions.</p>
            </div>
          </div>
        </div>
      )
    }

    // For external URLs, use iframe
    return (
      <iframe
        src={activeTab.url}
        className="flex-1 w-full border-none"
        title={activeTab.title}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Tab Bar */}
      <div className="flex items-center bg-muted/30 border-b border-border">
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`
                flex items-center min-w-0 max-w-xs px-3 py-2 border-r border-border cursor-pointer
                ${tab.isActive ? "bg-background" : "hover:bg-muted/50"}
              `}
              onClick={() => switchTab(tab.id)}
            >
              <span className="truncate text-sm mr-2">{tab.title}</span>
              {tabs.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={addTab} className="m-1">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate(activeTab?.url || "")}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("syntex://home")}>
            <Home className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleAddressSubmit} className="flex-1">
          <Input
            value={addressBar}
            onChange={(e) => setAddressBar(e.target.value)}
            placeholder="Enter URL or search term..."
            className="w-full"
          />
        </form>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}
