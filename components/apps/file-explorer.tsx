"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { fileSystem, type FileSystemItem, initializeFileSystem } from "@/lib/filesystem"
import { Folder, File, ArrowLeft, ArrowRight, Home, Plus, Upload, Trash2, Grid3X3, List, Search } from "lucide-react"

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState<string | null>(null)
  const [pathHistory, setPathHistory] = useState<(string | null)[]>([null])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [items, setItems] = useState<FileSystemItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)
  const [isNewFileOpen, setIsNewFileOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFileName, setNewFileName] = useState("")
  const [newFileContent, setNewFileContent] = useState("")

  useEffect(() => {
    initializeFileSystem().then(() => {
      loadItems(currentPath)
    })
  }, [currentPath])

  const loadItems = async (parentId: string | null) => {
    try {
      const children = await fileSystem.getChildren(parentId)
      setItems(children)
    } catch (error) {
      console.error("Failed to load items:", error)
    }
  }

  const navigateTo = (folderId: string | null) => {
    const newHistory = pathHistory.slice(0, historyIndex + 1)
    newHistory.push(folderId)
    setPathHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setCurrentPath(folderId)
    setSelectedItems(new Set())
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCurrentPath(pathHistory[newIndex])
      setSelectedItems(new Set())
    }
  }

  const goForward = () => {
    if (historyIndex < pathHistory.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCurrentPath(pathHistory[newIndex])
      setSelectedItems(new Set())
    }
  }

  const goHome = () => {
    navigateTo(null)
  }

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === "folder") {
      navigateTo(item.id)
    } else {
      // Open file in appropriate app
      console.log("Opening file:", item.name)
    }
  }

  const handleItemSelect = (itemId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedItems)
    if (isSelected) {
      newSelected.add(itemId)
    } else {
      newSelected.delete(itemId)
    }
    setSelectedItems(newSelected)
  }

  const createFolder = async () => {
    if (newFolderName.trim()) {
      await fileSystem.createFolder(newFolderName.trim(), currentPath)
      setNewFolderName("")
      setIsNewFolderOpen(false)
      loadItems(currentPath)
    }
  }

  const createFile = async () => {
    if (newFileName.trim()) {
      await fileSystem.createFile(newFileName.trim(), newFileContent, "text/plain", currentPath)
      setNewFileName("")
      setNewFileContent("")
      setIsNewFileOpen(false)
      loadItems(currentPath)
    }
  }

  const deleteSelected = async () => {
    for (const itemId of selectedItems) {
      await fileSystem.deleteItem(itemId)
    }
    setSelectedItems(new Set())
    loadItems(currentPath)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(async (file) => {
      const content = await file.arrayBuffer()
      await fileSystem.createFile(file.name, content, file.type, currentPath)
    })

    loadItems(currentPath)
    event.target.value = "" // Reset input
  }

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={goBack} disabled={historyIndex <= 0}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goForward} disabled={historyIndex >= pathHistory.length - 1}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goHome}>
            <Home className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 mx-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folder-name">Folder Name</Label>
                  <Input
                    id="folder-name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                    onKeyDown={(e) => e.key === "Enter" && createFolder()}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewFolderOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createFolder}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewFileOpen} onOpenChange={setIsNewFileOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-name">File Name</Label>
                  <Input
                    id="file-name"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="Enter file name"
                  />
                </div>
                <div>
                  <Label htmlFor="file-content">Content</Label>
                  <Textarea
                    id="file-content"
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                    placeholder="Enter file content"
                    rows={6}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewFileOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createFile}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="sm" asChild>
            <label>
              <Upload className="h-4 w-4 mr-1" />
              Upload
              <input type="file" multiple onChange={handleFileUpload} className="hidden" />
            </label>
          </Button>

          {selectedItems.size > 0 && (
            <Button variant="ghost" size="sm" onClick={deleteSelected}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete ({selectedItems.size})
            </Button>
          )}

          <div className="flex border rounded">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-6 gap-4">
              {filteredItems.map((item) => (
                <ContextMenu key={item.id}>
                  <ContextMenuTrigger>
                    <div
                      className={`
                        flex flex-col items-center p-3 rounded-lg cursor-pointer
                        hover:bg-muted/50 transition-colors
                        ${selectedItems.has(item.id) ? "bg-primary/10 ring-2 ring-primary/50" : ""}
                      `}
                      onClick={() => handleItemClick(item)}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        handleItemSelect(item.id, !selectedItems.has(item.id))
                      }}
                    >
                      {item.type === "folder" ? (
                        <Folder className="h-12 w-12 text-blue-500 mb-2" />
                      ) : (
                        <File className="h-12 w-12 text-gray-500 mb-2" />
                      )}
                      <span className="text-sm text-center break-words max-w-full">{item.name}</span>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => handleItemClick(item)}>Open</ContextMenuItem>
                    <ContextMenuItem onClick={() => fileSystem.deleteItem(item.id).then(() => loadItems(currentPath))}>
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <ContextMenu key={item.id}>
                  <ContextMenuTrigger>
                    <div
                      className={`
                        flex items-center gap-3 p-2 rounded cursor-pointer
                        hover:bg-muted/50 transition-colors
                        ${selectedItems.has(item.id) ? "bg-primary/10 ring-2 ring-primary/50" : ""}
                      `}
                      onClick={() => handleItemClick(item)}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        handleItemSelect(item.id, !selectedItems.has(item.id))
                      }}
                    >
                      {item.type === "folder" ? (
                        <Folder className="h-5 w-5 text-blue-500" />
                      ) : (
                        <File className="h-5 w-5 text-gray-500" />
                      )}
                      <span className="flex-1">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{formatFileSize(item.size)}</span>
                      <span className="text-sm text-muted-foreground">{formatDate(item.modifiedAt)}</span>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => handleItemClick(item)}>Open</ContextMenuItem>
                    <ContextMenuItem onClick={() => fileSystem.deleteItem(item.id).then(() => loadItems(currentPath))}>
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              {searchQuery ? "No files match your search." : "This folder is empty."}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
