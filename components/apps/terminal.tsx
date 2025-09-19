"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { fileSystem } from "@/lib/filesystem"

interface TerminalLine {
  id: string
  type: "command" | "output" | "error"
  content: string
  timestamp: Date
}

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentCommand, setCurrentCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentPath, setCurrentPath] = useState("/")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Welcome message
    addLine("output", "SyntexOS Terminal v1.0")
    addLine("output", "Type 'help' for available commands")
    addLine("output", "")
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const addLine = (type: "command" | "output" | "error", content: string) => {
    const newLine: TerminalLine = {
      id: crypto.randomUUID(),
      type,
      content,
      timestamp: new Date(),
    }
    setLines((prev) => [...prev, newLine])
  }

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim()
    if (!trimmedCommand) return

    // Add command to history
    setCommandHistory((prev) => [...prev, trimmedCommand])
    addLine("command", `${currentPath}$ ${trimmedCommand}`)

    const [cmd, ...args] = trimmedCommand.split(" ")

    try {
      switch (cmd.toLowerCase()) {
        case "help":
          addLine("output", "Available commands:")
          addLine("output", "  help          - Show this help message")
          addLine("output", "  ls            - List files and directories")
          addLine("output", "  pwd           - Print working directory")
          addLine("output", "  mkdir <name>  - Create a directory")
          addLine("output", "  touch <name>  - Create a file")
          addLine("output", "  cat <file>    - Display file contents")
          addLine("output", "  rm <name>     - Delete a file or directory")
          addLine("output", "  clear         - Clear the terminal")
          addLine("output", "  date          - Show current date and time")
          addLine("output", "  echo <text>   - Display text")
          addLine("output", "  whoami        - Display current user")
          break

        case "ls":
          try {
            const items = await fileSystem.getChildren(currentPath === "/" ? null : currentPath)
            if (items.length === 0) {
              addLine("output", "Directory is empty")
            } else {
              items.forEach((item) => {
                const type = item.type === "folder" ? "d" : "-"
                const size = item.size.toString().padStart(8)
                const date = item.modifiedAt.toLocaleDateString()
                addLine("output", `${type}rwxr-xr-x ${size} ${date} ${item.name}`)
              })
            }
          } catch (error) {
            addLine("error", "Failed to list directory contents")
          }
          break

        case "pwd":
          addLine("output", currentPath)
          break

        case "mkdir":
          if (args.length === 0) {
            addLine("error", "mkdir: missing operand")
          } else {
            try {
              await fileSystem.createFolder(args[0], currentPath === "/" ? null : currentPath)
              addLine("output", `Directory '${args[0]}' created`)
            } catch (error) {
              addLine("error", `mkdir: cannot create directory '${args[0]}'`)
            }
          }
          break

        case "touch":
          if (args.length === 0) {
            addLine("error", "touch: missing operand")
          } else {
            try {
              await fileSystem.createFile(args[0], "", "text/plain", currentPath === "/" ? null : currentPath)
              addLine("output", `File '${args[0]}' created`)
            } catch (error) {
              addLine("error", `touch: cannot create file '${args[0]}'`)
            }
          }
          break

        case "cat":
          if (args.length === 0) {
            addLine("error", "cat: missing operand")
          } else {
            try {
              const items = await fileSystem.getChildren(currentPath === "/" ? null : currentPath)
              const file = items.find((item) => item.name === args[0] && item.type === "file")
              if (file && file.content) {
                const content = typeof file.content === "string" ? file.content : "Binary file"
                addLine("output", content)
              } else {
                addLine("error", `cat: ${args[0]}: No such file`)
              }
            } catch (error) {
              addLine("error", `cat: cannot read '${args[0]}'`)
            }
          }
          break

        case "rm":
          if (args.length === 0) {
            addLine("error", "rm: missing operand")
          } else {
            try {
              const items = await fileSystem.getChildren(currentPath === "/" ? null : currentPath)
              const item = items.find((i) => i.name === args[0])
              if (item) {
                await fileSystem.deleteItem(item.id)
                addLine("output", `'${args[0]}' deleted`)
              } else {
                addLine("error", `rm: cannot remove '${args[0]}': No such file or directory`)
              }
            } catch (error) {
              addLine("error", `rm: cannot remove '${args[0]}'`)
            }
          }
          break

        case "clear":
          setLines([])
          break

        case "date":
          addLine("output", new Date().toString())
          break

        case "echo":
          addLine("output", args.join(" "))
          break

        case "whoami":
          addLine("output", "user")
          break

        default:
          addLine("error", `${cmd}: command not found`)
      }
    } catch (error) {
      addLine("error", `Error executing command: ${error}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand)
      setCurrentCommand("")
      setHistoryIndex(-1)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentCommand("")
      }
    }
  }

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm flex flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-1">
          {lines.map((line) => (
            <div
              key={line.id}
              className={`
                ${line.type === "command" ? "text-white" : ""}
                ${line.type === "error" ? "text-red-400" : ""}
                ${line.type === "output" ? "text-green-400" : ""}
              `}
            >
              {line.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <span className="text-white mr-2">{currentPath}$</span>
          <Input
            ref={inputRef}
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none text-green-400 font-mono focus:ring-0 focus:outline-none"
            placeholder="Enter command..."
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}
