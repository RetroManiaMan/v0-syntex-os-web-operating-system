"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { appPlatform, type AppManifest, type AppStore } from "@/lib/app-platform"
import { Download, Trash2, Search, Star, Shield, HardDrive } from "lucide-react"

export default function AppStoreApp() {
  const [appStore, setAppStore] = useState<AppStore | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedApp, setSelectedApp] = useState<AppManifest | null>(null)
  const [isInstalling, setIsInstalling] = useState(false)
  const [showPermissions, setShowPermissions] = useState(false)

  useEffect(() => {
    loadAppStore()
  }, [])

  const loadAppStore = () => {
    const store = appPlatform.getAvailableApps()
    setAppStore(store)
  }

  const installApp = async (app: AppManifest) => {
    setIsInstalling(true)
    const result = await appPlatform.installApp(app)

    if (result.success) {
      loadAppStore() // Refresh to update installed status
    } else {
      alert(`Installation failed: ${result.error}`)
    }

    setIsInstalling(false)
    setSelectedApp(null)
  }

  const uninstallApp = async (appId: string) => {
    if (confirm("Are you sure you want to uninstall this app?")) {
      const result = await appPlatform.uninstallApp(appId)

      if (result.success) {
        loadAppStore()
      } else {
        alert(`Uninstallation failed: ${result.error}`)
      }
    }
  }

  const isAppInstalled = (appId: string): boolean => {
    return appStore?.installed.some((app) => app.id === appId) || false
  }

  const formatSize = (size: number): string => {
    return `${size.toFixed(1)} MB`
  }

  const filterApps = (apps: AppManifest[]): AppManifest[] => {
    if (!searchQuery) return apps
    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  if (!appStore) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p>Loading App Store...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-background">
      <Tabs defaultValue="featured" className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">App Store</h2>
              <p className="text-muted-foreground">Discover and install apps for SyntexOS</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>

          <TabsList>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="installed">Installed</TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="featured" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Featured Apps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterApps(appStore.featured).map((app) => (
                    <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{app.icon}</div>
                            <div>
                              <CardTitle className="text-base">{app.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{app.author}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">{app.description}</CardDescription>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatSize(app.size)}</span>
                            <span>v{app.version}</span>
                          </div>
                          {isAppInstalled(app.id) ? (
                            <Badge variant="outline" className="text-green-600">
                              Installed
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedApp(app)
                                setShowPermissions(true)
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Install
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="categories" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                {Object.entries(appStore.categories).map(([category, apps]) => {
                  const filteredApps = filterApps(apps)
                  if (filteredApps.length === 0) return null

                  return (
                    <div key={category} className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredApps.map((app) => (
                          <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader>
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">{app.icon}</div>
                                <div>
                                  <CardTitle className="text-base">{app.name}</CardTitle>
                                  <p className="text-sm text-muted-foreground">{app.author}</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <CardDescription className="mb-4">{app.description}</CardDescription>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{formatSize(app.size)}</span>
                                  <span>v{app.version}</span>
                                </div>
                                {isAppInstalled(app.id) ? (
                                  <Badge variant="outline" className="text-green-600">
                                    Installed
                                  </Badge>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedApp(app)
                                      setShowPermissions(true)
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Install
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="installed" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Installed Apps</h3>
                <div className="space-y-4">
                  {filterApps(appStore.installed).map((app) => (
                    <Card key={app.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{app.icon}</div>
                            <div>
                              <h4 className="font-medium">{app.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {app.author} • v{app.version} • {formatSize(app.size)}
                              </p>
                              {app.installDate && (
                                <p className="text-xs text-muted-foreground">
                                  Installed {app.installDate.toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {app.isSystem && <Badge variant="outline">System</Badge>}
                            {!app.isSystem && (
                              <Button variant="outline" size="sm" onClick={() => uninstallApp(app.id)}>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Uninstall
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>

      {/* Permission Dialog */}
      <Dialog open={showPermissions} onOpenChange={setShowPermissions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install {selectedApp?.name}</DialogTitle>
            <DialogDescription>This app requires the following permissions:</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl">{selectedApp.icon}</div>
                <div>
                  <h4 className="font-medium">{selectedApp.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedApp.author} • v{selectedApp.version}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <HardDrive className="h-4 w-4" />
                  <span>Size: {formatSize(selectedApp.size)}</span>
                </div>
              </div>

              {selectedApp.permissions.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Permissions Required
                  </h5>
                  <div className="space-y-2">
                    {selectedApp.permissions.map((permission, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        <div>
                          <span className="font-medium capitalize">{permission.type}</span>
                          <p className="text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowPermissions(false)}>
                  Cancel
                </Button>
                <Button onClick={() => selectedApp && installApp(selectedApp)} disabled={isInstalling}>
                  {isInstalling ? "Installing..." : "Install"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
