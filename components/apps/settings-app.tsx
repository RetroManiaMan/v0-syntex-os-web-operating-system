"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { settingsManager, type SystemSettings, wallpapers, accentColors } from "@/lib/settings"
import {
  Palette,
  Monitor,
  Globe,
  Accessibility,
  Shield,
  Zap,
  Sparkles,
  User,
  Clock,
  MapPin,
  Battery,
  Volume2,
  Eye,
  Keyboard,
} from "lucide-react"

export default function SettingsApp() {
  const [settings, setSettings] = useState<SystemSettings>(settingsManager.getSettings())

  useEffect(() => {
    const unsubscribe = settingsManager.subscribe(setSettings)
    return unsubscribe
  }, [])

  const updateSetting = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    settingsManager.updateSetting(key, value)
  }

  const resetAllSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      settingsManager.resetSettings()
    }
  }

  return (
    <div className="h-full bg-background">
      <Tabs defaultValue="appearance" className="h-full flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Settings</h2>
            <p className="text-sm text-muted-foreground">Customize your SyntexOS experience</p>
          </div>
          <TabsList className="flex flex-col h-auto w-full bg-transparent p-2">
            <TabsTrigger value="appearance" className="w-full justify-start">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="display" className="w-full justify-start">
              <Monitor className="h-4 w-4 mr-2" />
              Display
            </TabsTrigger>
            <TabsTrigger value="system" className="w-full justify-start">
              <Zap className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="advanced" className="w-full justify-start">
              <Sparkles className="h-4 w-4 mr-2" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="w-full justify-start">
              <Accessibility className="h-4 w-4 mr-2" />
              Accessibility
            </TabsTrigger>
            <TabsTrigger value="privacy" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="about" className="w-full justify-start">
              <Globe className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <ScrollArea className="h-full">
            <div className="p-6">
              <TabsContent value="appearance" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Theme & Colors</h3>
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Theme</CardTitle>
                          <CardDescription>Choose your preferred color scheme</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Select value={settings.theme} onValueChange={(value: any) => updateSetting("theme", value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="auto">Auto (System)</SelectItem>
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Accent Color</CardTitle>
                          <CardDescription>Choose your accent color</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-4 gap-2">
                            {accentColors.map((color) => (
                              <Button
                                key={color.value}
                                variant="outline"
                                className={`h-12 p-2 ${
                                  settings.accentColor === color.value ? "ring-2 ring-primary" : ""
                                }`}
                                onClick={() => updateSetting("accentColor", color.value)}
                              >
                                <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: color.value }} />
                                <span className="text-xs">{color.name}</span>
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Wallpaper</h3>
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Wallpaper Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Select
                            value={settings.wallpaperType}
                            onValueChange={(value: any) => updateSetting("wallpaperType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gradient">Gradient</SelectItem>
                              <SelectItem value="solid">Solid Color</SelectItem>
                              <SelectItem value="image">Custom Image</SelectItem>
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>

                      {settings.wallpaperType === "gradient" && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Gradient Wallpapers</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                              {wallpapers.gradients.map((wallpaper) => (
                                <Button
                                  key={wallpaper.id}
                                  variant="outline"
                                  className={`h-20 p-2 ${
                                    settings.wallpaper === wallpaper.id ? "ring-2 ring-primary" : ""
                                  }`}
                                  onClick={() => updateSetting("wallpaper", wallpaper.id)}
                                >
                                  <div className="flex flex-col items-center">
                                    <div className="w-12 h-8 rounded mb-1" style={{ background: wallpaper.value }} />
                                    <span className="text-xs">{wallpaper.name}</span>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {settings.wallpaperType === "solid" && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Solid Colors</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-3 gap-3">
                              {wallpapers.solids.map((wallpaper) => (
                                <Button
                                  key={wallpaper.id}
                                  variant="outline"
                                  className={`h-16 p-2 ${
                                    settings.wallpaper === wallpaper.id ? "ring-2 ring-primary" : ""
                                  }`}
                                  onClick={() => updateSetting("wallpaper", wallpaper.id)}
                                >
                                  <div className="flex flex-col items-center">
                                    <div
                                      className="w-8 h-8 rounded mb-1"
                                      style={{ backgroundColor: wallpaper.value }}
                                    />
                                    <span className="text-xs">{wallpaper.name}</span>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="display" className="mt-0">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Display Settings</h3>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Font Size</CardTitle>
                      <CardDescription>Adjust the system font size</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select
                        value={settings.fontSize}
                        onValueChange={(value: any) => updateSetting("fontSize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Dock Settings</CardTitle>
                      <CardDescription>Customize the dock appearance and position</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Position</Label>
                        <Select
                          value={settings.dockPosition}
                          onValueChange={(value: any) => updateSetting("dockPosition", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bottom">Bottom</SelectItem>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Size</Label>
                        <Select
                          value={settings.dockSize}
                          onValueChange={(value: any) => updateSetting("dockSize", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Visual Effects</CardTitle>
                      <CardDescription>Control animations and transparency</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Window Animations</Label>
                          <p className="text-sm text-muted-foreground">Enable smooth window transitions</p>
                        </div>
                        <Switch
                          checked={settings.windowAnimations}
                          onCheckedChange={(checked) => updateSetting("windowAnimations", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Transparency Effects</Label>
                          <p className="text-sm text-muted-foreground">Enable glassmorphism effects</p>
                        </div>
                        <Switch
                          checked={settings.transparencyEffects}
                          onCheckedChange={(checked) => updateSetting("transparencyEffects", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Clock & Widgets
                      </CardTitle>
                      <CardDescription>Configure desktop widgets and clock display</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Analog Clock Widget</Label>
                          <p className="text-sm text-muted-foreground">Show analog clock on desktop</p>
                        </div>
                        <Switch
                          checked={settings.analogClock}
                          onCheckedChange={(checked) => updateSetting("analogClock", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Show Desktop Widgets</Label>
                          <p className="text-sm text-muted-foreground">Display clock, weather, and system widgets</p>
                        </div>
                        <Switch
                          checked={settings.showDesktopWidgets}
                          onCheckedChange={(checked) => updateSetting("showDesktopWidgets", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="system" className="mt-0">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">System Preferences</h3>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4" />
                        User Profile
                      </CardTitle>
                      <CardDescription>Manage your account and profile settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Display Name</Label>
                        <Input
                          value={settings.userProfile.name}
                          onChange={(e) =>
                            updateSetting("userProfile", { ...settings.userProfile, name: e.target.value })
                          }
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={settings.userProfile.email}
                          onChange={(e) =>
                            updateSetting("userProfile", { ...settings.userProfile, email: e.target.value })
                          }
                          placeholder="Enter your email"
                          type="email"
                        />
                      </div>
                      <div>
                        <Label>System Password</Label>
                        <Input
                          value={settings.password}
                          onChange={(e) => updateSetting("password", e.target.value)}
                          placeholder="Enter system password"
                          type="password"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Used for lock screen authentication</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Security & Power</CardTitle>
                      <CardDescription>Configure lock screen and screensaver settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Screensaver Timeout</Label>
                        <div className="flex items-center space-x-4 mt-2">
                          <Slider
                            value={[settings.screensaverTimeout]}
                            onValueChange={([value]) => updateSetting("screensaverTimeout", value)}
                            max={60}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground w-16">{settings.screensaverTimeout} min</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Time before screensaver activates</p>
                      </div>
                      <div>
                        <Label>Lock Screen Timeout</Label>
                        <div className="flex items-center space-x-4 mt-2">
                          <Slider
                            value={[settings.lockScreenTimeout]}
                            onValueChange={([value]) => updateSetting("lockScreenTimeout", value)}
                            max={120}
                            min={5}
                            step={5}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground w-16">{settings.lockScreenTimeout} min</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Time before system locks automatically</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Battery className="h-4 w-4" />
                        Battery & Power
                      </CardTitle>
                      <CardDescription>Configure battery indicator and power management</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Show Battery Percentage</Label>
                          <p className="text-sm text-muted-foreground">Display percentage in battery indicator</p>
                        </div>
                        <Switch
                          checked={settings.showBatteryPercentage}
                          onCheckedChange={(checked) => updateSetting("showBatteryPercentage", checked)}
                        />
                      </div>
                      <div>
                        <Label>Low Battery Warning Level</Label>
                        <div className="flex items-center space-x-4 mt-2">
                          <Slider
                            value={[settings.batteryWarningLevel]}
                            onValueChange={([value]) => updateSetting("batteryWarningLevel", value)}
                            max={50}
                            min={5}
                            step={5}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground w-12">{settings.batteryWarningLevel}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Show warning when battery drops below this level
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Time & Date</CardTitle>
                      <CardDescription>Configure time and date formats</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Time Format</Label>
                        <Select
                          value={settings.timeFormat}
                          onValueChange={(value: any) => updateSetting("timeFormat", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12h">12 Hour</SelectItem>
                            <SelectItem value="24h">24 Hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Date Format</Label>
                        <Select
                          value={settings.dateFormat}
                          onValueChange={(value: any) => updateSetting("dateFormat", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">US (MM/DD/YYYY)</SelectItem>
                            <SelectItem value="EU">EU (DD/MM/YYYY)</SelectItem>
                            <SelectItem value="ISO">ISO (YYYY-MM-DD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </CardTitle>
                      <CardDescription>Set your location for weather and time zone</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label>Current Location</Label>
                        <Input
                          value={settings.location}
                          onChange={(e) => updateSetting("location", e.target.value)}
                          placeholder="Enter your city"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Used for weather widget and local time</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">General</CardTitle>
                      <CardDescription>General system settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto Save</Label>
                          <p className="text-sm text-muted-foreground">Automatically save your work</p>
                        </div>
                        <Switch
                          checked={settings.autoSave}
                          onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>System Sounds</Label>
                          <p className="text-sm text-muted-foreground">Play system notification sounds</p>
                        </div>
                        <Switch
                          checked={settings.sounds}
                          onCheckedChange={(checked) => updateSetting("sounds", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Show Desktop Icons</Label>
                          <p className="text-sm text-muted-foreground">Display icons on the desktop</p>
                        </div>
                        <Switch
                          checked={settings.showDesktopIcons}
                          onCheckedChange={(checked) => updateSetting("showDesktopIcons", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Background Particles</Label>
                          <p className="text-sm text-muted-foreground">Show animated particles on desktop</p>
                        </div>
                        <Switch
                          checked={settings.enableParticles}
                          onCheckedChange={(checked) => updateSetting("enableParticles", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="mt-0">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Advanced Features</h3>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Dock Enhancements</CardTitle>
                      <CardDescription>Advanced dock features and behaviors</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Dock Magnification</Label>
                          <p className="text-sm text-muted-foreground">Icons grow when hovered</p>
                        </div>
                        <Switch
                          checked={settings.dockMagnification}
                          onCheckedChange={(checked) => updateSetting("dockMagnification", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-Hide Dock</Label>
                          <p className="text-sm text-muted-foreground">Hide dock when not in use</p>
                        </div>
                        <Switch
                          checked={settings.autoHideDock}
                          onCheckedChange={(checked) => updateSetting("autoHideDock", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Workspace Features</CardTitle>
                      <CardDescription>Multi-desktop and workspace management</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Multiple Desktops</Label>
                          <p className="text-sm text-muted-foreground">Enable virtual desktop switching</p>
                        </div>
                        <Switch
                          checked={settings.multipleDesktops}
                          onCheckedChange={(checked) => updateSetting("multipleDesktops", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Performance</CardTitle>
                      <CardDescription>System performance and resource usage</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Hardware Acceleration</Label>
                          <p className="text-sm text-muted-foreground">Use GPU for better performance</p>
                        </div>
                        <Switch defaultChecked disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Preload Applications</Label>
                          <p className="text-sm text-muted-foreground">Load apps faster on startup</p>
                        </div>
                        <Switch defaultChecked disabled />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Developer Options</CardTitle>
                      <CardDescription>Advanced settings for developers and power users</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Debug Mode</Label>
                          <p className="text-sm text-muted-foreground">Show debug information in console</p>
                        </div>
                        <Switch disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Experimental Features</Label>
                          <p className="text-sm text-muted-foreground">Enable beta features (may be unstable)</p>
                        </div>
                        <Switch disabled />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="accessibility" className="mt-0">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Accessibility</h3>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Visual Accessibility
                      </CardTitle>
                      <CardDescription>Settings to improve visual accessibility</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Reduce Motion</Label>
                          <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                        </div>
                        <Switch
                          checked={!settings.animations}
                          onCheckedChange={(checked) => updateSetting("animations", !checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>High Contrast</Label>
                          <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                        </div>
                        <Switch disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Large Text</Label>
                          <p className="text-sm text-muted-foreground">Use larger font sizes throughout the system</p>
                        </div>
                        <Switch
                          checked={settings.fontSize === "large"}
                          onCheckedChange={(checked) => updateSetting("fontSize", checked ? "large" : "medium")}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Audio Accessibility
                      </CardTitle>
                      <CardDescription>Audio and sound accessibility features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Visual Notifications</Label>
                          <p className="text-sm text-muted-foreground">Flash screen for audio notifications</p>
                        </div>
                        <Switch disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Mono Audio</Label>
                          <p className="text-sm text-muted-foreground">Play stereo audio as mono</p>
                        </div>
                        <Switch disabled />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Keyboard className="h-4 w-4" />
                        Input Accessibility
                      </CardTitle>
                      <CardDescription>Keyboard and mouse accessibility options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Sticky Keys</Label>
                          <p className="text-sm text-muted-foreground">Use modifier keys without holding them down</p>
                        </div>
                        <Switch disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Slow Keys</Label>
                          <p className="text-sm text-muted-foreground">Ignore brief or repeated keystrokes</p>
                        </div>
                        <Switch disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Mouse Keys</Label>
                          <p className="text-sm text-muted-foreground">Control mouse pointer with keyboard</p>
                        </div>
                        <Switch disabled />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="mt-0">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Privacy & Security</h3>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Data Collection</CardTitle>
                      <CardDescription>Control what data is collected and stored</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Usage Analytics</Label>
                          <p className="text-sm text-muted-foreground">Help improve SyntexOS by sharing usage data</p>
                        </div>
                        <Switch disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Crash Reports</Label>
                          <p className="text-sm text-muted-foreground">Automatically send crash reports</p>
                        </div>
                        <Switch disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Location Services</Label>
                          <p className="text-sm text-muted-foreground">Allow apps to access your location</p>
                        </div>
                        <Switch disabled />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Data Storage</CardTitle>
                      <CardDescription>Manage your local data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Clear Cache</Label>
                          <p className="text-sm text-muted-foreground">Remove temporary files and cached data</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (confirm("This will clear cached data. Continue?")) {
                              // Clear cache logic would go here
                              alert("Cache cleared successfully!")
                            }
                          }}
                        >
                          Clear Cache
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Clear All Data</Label>
                          <p className="text-sm text-muted-foreground">Remove all stored files and settings</p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (confirm("This will delete all your data. Are you sure?")) {
                              localStorage.clear()
                              location.reload()
                            }
                          }}
                        >
                          Clear Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Security</CardTitle>
                      <CardDescription>System security and authentication settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Password</Label>
                          <p className="text-sm text-muted-foreground">Require password for system access</p>
                        </div>
                        <Switch defaultChecked disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-Lock System</Label>
                          <p className="text-sm text-muted-foreground">Automatically lock after inactivity</p>
                        </div>
                        <Switch defaultChecked disabled />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="about" className="mt-0">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">About SyntexOS</h3>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">System Information</CardTitle>
                      <CardDescription>Details about your SyntexOS installation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Version:</span>
                        <Badge variant="secondary">1.2.0</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Build:</span>
                        <span className="text-muted-foreground">2024.12.18</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Platform:</span>
                        <span className="text-muted-foreground">Web Browser</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Storage:</span>
                        <span className="text-muted-foreground">IndexedDB + LocalStorage</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">User Agent:</span>
                        <span className="text-muted-foreground text-xs">{navigator.userAgent.split(" ")[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Screen Resolution:</span>
                        <span className="text-muted-foreground">
                          {screen.width} × {screen.height}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Features</CardTitle>
                      <CardDescription>What's included in this version</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Desktop Environment</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Window Management</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>File System</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Application Dock</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>System Settings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Theme System</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Desktop Widgets</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Lock Screen</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Screensaver</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>Battery Monitor</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Credits</CardTitle>
                      <CardDescription>Built with modern web technologies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Framework:</span> Next.js 15 with React 18
                      </div>
                      <div>
                        <span className="font-medium">Styling:</span> Tailwind CSS v4
                      </div>
                      <div>
                        <span className="font-medium">Components:</span> shadcn/ui
                      </div>
                      <div>
                        <span className="font-medium">Icons:</span> Lucide React
                      </div>
                      <div>
                        <span className="font-medium">Animations:</span> Framer Motion
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Reset Settings</CardTitle>
                      <CardDescription>Restore all settings to their default values</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" onClick={resetAllSettings}>
                        Reset All Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  )
}
