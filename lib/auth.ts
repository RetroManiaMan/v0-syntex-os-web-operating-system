// Authentication system for SyntexOS
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: Date
  lastLogin: Date
  preferences: {
    theme: string
    language: string
  }
}

export interface Session {
  id: string
  userId: string
  createdAt: Date
  expiresAt: Date
  isActive: boolean
}

class AuthManager {
  private currentUser: User | null = null
  private currentSession: Session | null = null
  private listeners: Array<(user: User | null) => void> = []

  constructor() {
    this.loadSession()
  }

  async login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate authentication (in real app, this would be server-side)
      const users = this.getStoredUsers()
      const user = users.find((u) => u.username === username)

      if (!user) {
        return { success: false, error: "User not found" }
      }

      // In a real app, you'd hash and compare passwords
      const storedPassword = localStorage.getItem(`syntex-password-${user.id}`)
      if (storedPassword !== password) {
        return { success: false, error: "Invalid password" }
      }

      // Create session
      const session: Session = {
        id: crypto.randomUUID(),
        userId: user.id,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isActive: true,
      }

      // Update last login
      user.lastLogin = new Date()
      this.updateStoredUser(user)

      this.currentUser = user
      this.currentSession = session
      this.saveSession()
      this.notifyListeners()

      return { success: true }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  async register(username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const users = this.getStoredUsers()

      // Check if user already exists
      if (users.find((u) => u.username === username || u.email === email)) {
        return { success: false, error: "User already exists" }
      }

      // Create new user
      const user: User = {
        id: crypto.randomUUID(),
        username,
        email,
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: "auto",
          language: "en",
        },
      }

      // Store user and password
      users.push(user)
      localStorage.setItem("syntex-users", JSON.stringify(users))
      localStorage.setItem(`syntex-password-${user.id}`, password)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    }
  }

  logout(): void {
    this.currentUser = null
    this.currentSession = null
    localStorage.removeItem("syntex-session")
    this.notifyListeners()
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.isSessionValid()
  }

  subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private loadSession(): void {
    try {
      const sessionData = localStorage.getItem("syntex-session")
      if (sessionData) {
        const { user, session } = JSON.parse(sessionData)
        this.currentUser = {
          ...user,
          createdAt: new Date(user.createdAt),
          lastLogin: new Date(user.lastLogin),
        }
        this.currentSession = {
          ...session,
          createdAt: new Date(session.createdAt),
          expiresAt: new Date(session.expiresAt),
        }

        if (!this.isSessionValid()) {
          this.logout()
        }
      }
    } catch (error) {
      console.error("Failed to load session:", error)
    }
  }

  private saveSession(): void {
    if (this.currentUser && this.currentSession) {
      localStorage.setItem(
        "syntex-session",
        JSON.stringify({
          user: this.currentUser,
          session: this.currentSession,
        }),
      )
    }
  }

  private isSessionValid(): boolean {
    return this.currentSession ? new Date() < this.currentSession.expiresAt : false
  }

  private getStoredUsers(): User[] {
    try {
      const users = localStorage.getItem("syntex-users")
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  }

  private updateStoredUser(user: User): void {
    const users = this.getStoredUsers()
    const index = users.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      users[index] = user
      localStorage.setItem("syntex-users", JSON.stringify(users))
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentUser))
  }
}

export const authManager = new AuthManager()
