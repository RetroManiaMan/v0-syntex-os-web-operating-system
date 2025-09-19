// Virtual File System for SyntexOS using IndexedDB
export interface FileSystemItem {
  id: string
  name: string
  type: "file" | "folder"
  parentId: string | null
  content?: string | ArrayBuffer
  mimeType?: string
  size: number
  createdAt: Date
  modifiedAt: Date
  isTrash?: boolean
}

class VirtualFileSystem {
  private dbName = "SyntexOS_FileSystem"
  private dbVersion = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains("files")) {
          const store = db.createObjectStore("files", { keyPath: "id" })
          store.createIndex("parentId", "parentId", { unique: false })
          store.createIndex("name", "name", { unique: false })
          store.createIndex("type", "type", { unique: false })
        }
      }
    })
  }

  async createFolder(name: string, parentId: string | null = null): Promise<FileSystemItem> {
    const folder: FileSystemItem = {
      id: crypto.randomUUID(),
      name,
      type: "folder",
      parentId,
      size: 0,
      createdAt: new Date(),
      modifiedAt: new Date(),
    }

    await this.saveItem(folder)
    return folder
  }

  async createFile(
    name: string,
    content: string | ArrayBuffer,
    mimeType: string,
    parentId: string | null = null,
  ): Promise<FileSystemItem> {
    const file: FileSystemItem = {
      id: crypto.randomUUID(),
      name,
      type: "file",
      parentId,
      content,
      mimeType,
      size: typeof content === "string" ? content.length : content.byteLength,
      createdAt: new Date(),
      modifiedAt: new Date(),
    }

    await this.saveItem(file)
    return file
  }

  async saveItem(item: FileSystemItem): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readwrite")
      const store = transaction.objectStore("files")
      const request = store.put(item)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getItem(id: string): Promise<FileSystemItem | null> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readonly")
      const store = transaction.objectStore("files")
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async getChildren(parentId: string | null): Promise<FileSystemItem[]> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readonly")
      const store = transaction.objectStore("files")
      const index = store.index("parentId")
      const request = index.getAll(parentId)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const items = request.result.filter((item) => !item.isTrash)
        resolve(
          items.sort((a, b) => {
            if (a.type !== b.type) return a.type === "folder" ? -1 : 1
            return a.name.localeCompare(b.name)
          }),
        )
      }
    })
  }

  async deleteItem(id: string): Promise<void> {
    const item = await this.getItem(id)
    if (!item) return

    // Move to trash instead of permanent delete
    item.isTrash = true
    item.modifiedAt = new Date()
    await this.saveItem(item)

    // If it's a folder, move all children to trash too
    if (item.type === "folder") {
      const children = await this.getAllChildren(id)
      for (const child of children) {
        child.isTrash = true
        child.modifiedAt = new Date()
        await this.saveItem(child)
      }
    }
  }

  async getAllChildren(parentId: string): Promise<FileSystemItem[]> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readonly")
      const store = transaction.objectStore("files")
      const index = store.index("parentId")
      const request = index.getAll(parentId)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async moveItem(id: string, newParentId: string | null): Promise<void> {
    const item = await this.getItem(id)
    if (!item) return

    item.parentId = newParentId
    item.modifiedAt = new Date()
    await this.saveItem(item)
  }

  async renameItem(id: string, newName: string): Promise<void> {
    const item = await this.getItem(id)
    if (!item) return

    item.name = newName
    item.modifiedAt = new Date()
    await this.saveItem(item)
  }

  async getTrashItems(): Promise<FileSystemItem[]> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readonly")
      const store = transaction.objectStore("files")
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const trashItems = request.result.filter((item) => item.isTrash)
        resolve(trashItems)
      }
    })
  }

  async restoreFromTrash(id: string): Promise<void> {
    const item = await this.getItem(id)
    if (!item) return

    delete item.isTrash
    item.modifiedAt = new Date()
    await this.saveItem(item)
  }

  async permanentDelete(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["files"], "readwrite")
      const store = transaction.objectStore("files")
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

export const fileSystem = new VirtualFileSystem()

// Initialize default folders
export async function initializeFileSystem() {
  await fileSystem.init()

  // Check if default folders exist
  const rootItems = await fileSystem.getChildren(null)

  if (rootItems.length === 0) {
    // Create default folder structure
    await fileSystem.createFolder("Documents")
    await fileSystem.createFolder("Downloads")
    await fileSystem.createFolder("Pictures")
    await fileSystem.createFolder("Music")
    await fileSystem.createFolder("Videos")
    await fileSystem.createFolder("Desktop")

    // Create some sample files
    await fileSystem.createFile(
      "Welcome.txt",
      "Welcome to SyntexOS!\n\nThis is your virtual file system. You can create, edit, and organize files just like a real operating system.",
      "text/plain",
    )
    await fileSystem.createFile(
      "README.md",
      "# SyntexOS\n\nAn open-source web-based operating system.\n\n## Features\n- Virtual file system\n- Window management\n- Built-in applications\n- And much more!",
      "text/markdown",
    )
  }
}
