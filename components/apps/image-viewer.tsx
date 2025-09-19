"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw, Download, Maximize } from "lucide-react"

export default function ImageViewer() {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const zoomIn = () => setZoom((prev) => Math.min(prev + 25, 500))
  const zoomOut = () => setZoom((prev) => Math.max(prev - 25, 25))
  const rotate = () => setRotation((prev) => (prev + 90) % 360)
  const resetView = () => {
    setZoom(100)
    setRotation(0)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={zoomOut} disabled={zoom <= 25}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
          <Button variant="ghost" size="sm" onClick={zoomIn} disabled={zoom >= 500}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={rotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={resetView}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <label>
              Open Image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </Button>
          {selectedImage && (
            <Button variant="ghost" size="sm" asChild>
              <a href={selectedImage} download="image">
                <Download className="h-4 w-4 mr-1" />
                Download
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Image Display */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
        {selectedImage ? (
          <div className="flex items-center justify-center min-h-full p-4">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Viewed image"
              className="max-w-none transition-transform duration-200"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: "center",
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">No image selected</p>
              <p className="text-sm">Click "Open Image" to view an image</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
