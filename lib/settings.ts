// Settings management for SyntexOS
export interface SystemSettings {
  theme: "light" | "dark" | "auto"
  accentColor: string
  wallpaper: string
  wallpaperType: "gradient" | "image" | "solid"
  fontSize: "small" | "medium" | "large"
  animations: boolean
  sounds: boolean
  autoSave: boolean
  language: string
  timeFormat: "12h" | "24h"
  dateFormat: "US" | "EU" | "ISO"
  dockPosition: "bottom" | "left" | "right"
  dockSize: "small" | "medium" | "large"
  taskbarPosition: "top" | "bottom"
  showDesktopIcons: boolean
  showDesktopWidgets: boolean
  windowAnimations: boolean
  transparencyEffects: boolean
  enableParticles: boolean
  dockMagnification: boolean
  autoHideDock: boolean
  multipleDesktops: boolean
  screensaverTimeout: number // minutes
  lockScreenTimeout: number // minutes
  batteryWarningLevel: number // percentage
  showBatteryPercentage: boolean
  location: string // for weather widget
  analogClock: boolean
  userProfile: {
    name: string
    avatar: string
    email: string
  }
  isLocked: boolean
  password: string
}

const defaultSettings: SystemSettings = {
  theme: "auto",
  accentColor: "#8b5cf6",
  wallpaper: "gradient-1",
  wallpaperType: "gradient",
  fontSize: "medium",
  animations: true,
  sounds: true,
  autoSave: true,
  language: "en",
  timeFormat: "12h",
  dateFormat: "US",
  dockPosition: "bottom",
  dockSize: "medium",
  taskbarPosition: "top",
  showDesktopIcons: true,
  showDesktopWidgets: true,
  windowAnimations: true,
  transparencyEffects: true,
  enableParticles: true,
  dockMagnification: true,
  autoHideDock: false,
  multipleDesktops: false,
  screensaverTimeout: 5, // 5 minutes
  lockScreenTimeout: 15, // 15 minutes
  batteryWarningLevel: 20, // 20%
  showBatteryPercentage: true,
  location: "New York",
  analogClock: false,
  userProfile: {
    name: "User",
    avatar: "",
    email: "user@syntexos.com",
  },
  isLocked: false,
  password: "1234",
}

class SettingsManager {
  private settings: SystemSettings = defaultSettings
  private listeners: Array<(settings: SystemSettings) => void> = []

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSettings()
    }
  }

  loadSettings(): void {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return
    }

    try {
      const saved = localStorage.getItem("syntex-settings")
      if (saved) {
        this.settings = { ...defaultSettings, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      this.settings = defaultSettings
    }
    this.applySettings()
  }

  saveSettings(): void {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return
    }

    try {
      localStorage.setItem("syntex-settings", JSON.stringify(this.settings))
      this.applySettings()
      this.notifyListeners()
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  getSettings(): SystemSettings {
    return { ...this.settings }
  }

  updateSetting<K extends keyof SystemSettings>(key: K, value: SystemSettings[K]): void {
    this.settings[key] = value
    this.saveSettings()
  }

  updateSettings(updates: Partial<SystemSettings>): void {
    this.settings = { ...this.settings, ...updates }
    this.saveSettings()
  }

  resetSettings(): void {
    this.settings = { ...defaultSettings }
    this.saveSettings()
  }

  subscribe(listener: (settings: SystemSettings) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.settings))
  }

  private applySettings(): void {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return
    }

    const root = document.documentElement

    if (this.settings.theme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.toggle("dark", prefersDark)
    } else {
      root.classList.toggle("dark", this.settings.theme === "dark")
    }

    // Apply CSS custom properties for dynamic theming with proper contrast
    const isDark =
      this.settings.theme === "dark" ||
      (this.settings.theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    if (!isDark) {
      // Light mode colors
      root.style.setProperty("--text-primary", "#0f172a")
      root.style.setProperty("--text-secondary", "#475569")
      root.style.setProperty("--text-muted", "#64748b")
      root.style.setProperty("--bg-primary", "#ffffff")
      root.style.setProperty("--bg-secondary", "#f8fafc")
      root.style.setProperty("--bg-muted", "#f1f5f9")
      root.style.setProperty("--border-color", "#e2e8f0")
      root.style.setProperty("--glass-bg", "rgba(255, 255, 255, 0.1)")
    } else {
      // Dark mode colors
      root.style.setProperty("--text-primary", "#f8fafc")
      root.style.setProperty("--text-secondary", "#cbd5e1")
      root.style.setProperty("--text-muted", "#94a3b8")
      root.style.setProperty("--bg-primary", "#0f172a")
      root.style.setProperty("--bg-secondary", "#1e293b")
      root.style.setProperty("--bg-muted", "#334155")
      root.style.setProperty("--border-color", "#475569")
      root.style.setProperty("--glass-bg", "rgba(15, 23, 42, 0.1)")
    }

    // Apply accent color
    root.style.setProperty("--accent-color", this.settings.accentColor)
    root.style.setProperty("--primary", this.settings.accentColor)

    // Apply font size
    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
    }
    root.style.setProperty("--base-font-size", fontSizes[this.settings.fontSize])

    // Apply animations
    if (!this.settings.animations) {
      root.style.setProperty("--animation-duration", "0s")
    } else {
      root.style.removeProperty("--animation-duration")
    }

    // Apply transparency effects
    if (!this.settings.transparencyEffects) {
      root.style.setProperty("--glass-blur", "none")
      root.style.setProperty("--window-bg", "var(--background)")
    } else {
      root.style.removeProperty("--glass-blur")
      root.style.removeProperty("--window-bg")
    }

    // Apply advanced features
    root.style.setProperty("--enable-particles", this.settings.enableParticles ? "true" : "false")
    root.style.setProperty("--dock-magnification", this.settings.dockMagnification ? "true" : "false")
    root.style.setProperty("--auto-hide-dock", this.settings.autoHideDock ? "true" : "false")
    root.style.setProperty("--multiple-desktops", this.settings.multipleDesktops ? "true" : "false")

    root.style.setProperty("--screensaver-timeout", `${this.settings.screensaverTimeout}min`)
    root.style.setProperty("--lock-timeout", `${this.settings.lockScreenTimeout}min`)
    root.style.setProperty("--battery-warning", `${this.settings.batteryWarningLevel}%`)
    root.style.setProperty("--show-battery-percentage", this.settings.showBatteryPercentage ? "true" : "false")
    root.style.setProperty("--analog-clock", this.settings.analogClock ? "true" : "false")
  }
}

export const settingsManager = new SettingsManager()

// Predefined wallpapers
export const wallpapers = {
  gradients: [
    {
      id: "gradient-1",
      name: "Ocean Breeze",
      value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "gradient-2",
      name: "Sunset",
      value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: "gradient-3",
      name: "Forest",
      value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      id: "gradient-4",
      name: "Aurora",
      value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      id: "gradient-5",
      name: "Cosmic",
      value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
  ],
  solids: [
    { id: "solid-1", name: "Deep Blue", value: "#1e3a8a" },
    { id: "solid-2", name: "Forest Green", value: "#166534" },
    { id: "solid-3", name: "Purple", value: "#7c3aed" },
    { id: "solid-4", name: "Crimson", value: "#dc2626" },
    { id: "solid-5", name: "Slate", value: "#475569" },
  ],
}

export const accentColors = [
  { name: "Purple", value: "#8b5cf6" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Teal", value: "#14b8a6" },
]
