// App platform and permissions system for SyntexOS
export interface AppManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
  icon: string
  category: string
  permissions: Permission[]
  size: number
  installDate?: Date
  updateDate?: Date
  isSystem?: boolean
}

export interface Permission {
  type: "filesystem" | "network" | "notifications" | "camera" | "microphone" | "location"
  description: string
  required: boolean
}

export interface AppStore {
  featured: AppManifest[]
  categories: { [key: string]: AppManifest[] }
  installed: AppManifest[]
}

class AppPlatformManager {
  private installedApps: Map<string, AppManifest> = new Map()
  private permissions: Map<string, Set<string>> = new Map()

  constructor() {
    this.loadInstalledApps()
    this.initializeSystemApps()
  }

  async installApp(manifest: AppManifest): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if app is already installed
      if (this.installedApps.has(manifest.id)) {
        return { success: false, error: "App already installed" }
      }

      // Request permissions
      const granted = await this.requestPermissions(manifest.id, manifest.permissions)
      if (!granted) {
        return { success: false, error: "Permissions denied" }
      }

      // Install app
      const installedManifest: AppManifest = {
        ...manifest,
        installDate: new Date(),
      }

      this.installedApps.set(manifest.id, installedManifest)
      this.saveInstalledApps()

      return { success: true }
    } catch (error) {
      return { success: false, error: "Installation failed" }
    }
  }

  async uninstallApp(appId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const app = this.installedApps.get(appId)
      if (!app) {
        return { success: false, error: "App not found" }
      }

      if (app.isSystem) {
        return { success: false, error: "Cannot uninstall system app" }
      }

      // Remove app and permissions
      this.installedApps.delete(appId)
      this.permissions.delete(appId)
      this.saveInstalledApps()

      // Clean up app data
      this.cleanupAppData(appId)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Uninstallation failed" }
    }
  }

  getInstalledApps(): AppManifest[] {
    return Array.from(this.installedApps.values())
  }

  getApp(appId: string): AppManifest | undefined {
    return this.installedApps.get(appId)
  }

  hasPermission(appId: string, permission: string): boolean {
    const appPermissions = this.permissions.get(appId)
    return appPermissions ? appPermissions.has(permission) : false
  }

  async requestPermissions(appId: string, permissions: Permission[]): Promise<boolean> {
    // In a real implementation, this would show a permission dialog
    const requiredPermissions = permissions.filter((p) => p.required)

    if (requiredPermissions.length === 0) {
      return true
    }

    // Simulate user approval (in real app, show dialog)
    const approved = confirm(
      `${appId} requests the following permissions:\n\n${requiredPermissions
        .map((p) => `• ${p.description}`)
        .join("\n")}\n\nDo you want to grant these permissions?`,
    )

    if (approved) {
      const grantedPermissions = new Set(permissions.map((p) => p.type))
      this.permissions.set(appId, grantedPermissions)
      this.savePermissions()
    }

    return approved
  }

  getAvailableApps(): AppStore {
    // Mock app store data
    const availableApps: AppManifest[] = [
      {
        id: "text-editor-pro",
        name: "Text Editor Pro",
        version: "2.1.0",
        description: "Advanced text editor with syntax highlighting and themes",
        author: "SyntexOS Team",
        icon: "📝",
        category: "Productivity",
        size: 2.5,
        permissions: [
          { type: "filesystem", description: "Read and write files", required: true },
          { type: "notifications", description: "Show save notifications", required: false },
        ],
      },
      {
        id: "media-player",
        name: "Media Player",
        version: "1.5.2",
        description: "Play audio and video files with playlist support",
        author: "Community",
        icon: "🎵",
        category: "Entertainment",
        size: 4.2,
        permissions: [
          { type: "filesystem", description: "Access media files", required: true },
          { type: "notifications", description: "Show playback notifications", required: false },
        ],
      },
      {
        id: "code-editor",
        name: "Code Editor",
        version: "3.0.1",
        description: "Professional code editor with Git integration",
        author: "DevTools Inc",
        icon: "💻",
        category: "Development",
        size: 8.7,
        permissions: [
          { type: "filesystem", description: "Read and write code files", required: true },
          { type: "network", description: "Git operations and package management", required: true },
          { type: "notifications", description: "Build and error notifications", required: false },
        ],
      },
      {
        id: "photo-editor",
        name: "Photo Editor",
        version: "1.8.0",
        description: "Edit and enhance your photos with professional tools",
        author: "Creative Suite",
        icon: "🎨",
        category: "Graphics",
        size: 12.3,
        permissions: [
          { type: "filesystem", description: "Access and save images", required: true },
          { type: "camera", description: "Take photos directly", required: false },
        ],
      },
    ]

    return {
      featured: availableApps.slice(0, 2),
      categories: {
        Productivity: availableApps.filter((app) => app.category === "Productivity"),
        Entertainment: availableApps.filter((app) => app.category === "Entertainment"),
        Development: availableApps.filter((app) => app.category === "Development"),
        Graphics: availableApps.filter((app) => app.category === "Graphics"),
      },
      installed: this.getInstalledApps(),
    }
  }

  private initializeSystemApps(): void {
    const systemApps: AppManifest[] = [
      {
        id: "files",
        name: "Files",
        version: "1.0.0",
        description: "System file manager",
        author: "SyntexOS",
        icon: "📁",
        category: "System",
        size: 1.2,
        permissions: [{ type: "filesystem", description: "Full filesystem access", required: true }],
        isSystem: true,
        installDate: new Date(),
      },
      {
        id: "settings",
        name: "Settings",
        version: "1.0.0",
        description: "System settings and preferences",
        author: "SyntexOS",
        icon: "⚙️",
        category: "System",
        size: 0.8,
        permissions: [],
        isSystem: true,
        installDate: new Date(),
      },
      {
        id: "terminal",
        name: "Terminal",
        version: "1.0.0",
        description: "Command line interface",
        author: "SyntexOS",
        icon: "💻",
        category: "System",
        size: 1.5,
        permissions: [{ type: "filesystem", description: "Filesystem operations", required: true }],
        isSystem: true,
        installDate: new Date(),
      },
    ]

    systemApps.forEach((app) => {
      this.installedApps.set(app.id, app)
      if (app.permissions.length > 0) {
        const permissions = new Set(app.permissions.map((p) => p.type))
        this.permissions.set(app.id, permissions)
      }
    })
  }

  private loadInstalledApps(): void {
    try {
      const data = localStorage.getItem("syntex-installed-apps")
      if (data) {
        const apps = JSON.parse(data)
        apps.forEach((app: any) => {
          this.installedApps.set(app.id, {
            ...app,
            installDate: app.installDate ? new Date(app.installDate) : undefined,
            updateDate: app.updateDate ? new Date(app.updateDate) : undefined,
          })
        })
      }

      const permissionsData = localStorage.getItem("syntex-app-permissions")
      if (permissionsData) {
        const permissions = JSON.parse(permissionsData)
        Object.entries(permissions).forEach(([appId, perms]) => {
          this.permissions.set(appId, new Set(perms as string[]))
        })
      }
    } catch (error) {
      console.error("Failed to load installed apps:", error)
    }
  }

  private saveInstalledApps(): void {
    try {
      const apps = Array.from(this.installedApps.values())
      localStorage.setItem("syntex-installed-apps", JSON.stringify(apps))
    } catch (error) {
      console.error("Failed to save installed apps:", error)
    }
  }

  private savePermissions(): void {
    try {
      const permissions: { [key: string]: string[] } = {}
      this.permissions.forEach((perms, appId) => {
        permissions[appId] = Array.from(perms)
      })
      localStorage.setItem("syntex-app-permissions", JSON.stringify(permissions))
    } catch (error) {
      console.error("Failed to save permissions:", error)
    }
  }

  private cleanupAppData(appId: string): void {
    // Remove app-specific data
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(`${appId}-`))
    keys.forEach((key) => localStorage.removeItem(key))
  }
}

export const appPlatform = new AppPlatformManager()
