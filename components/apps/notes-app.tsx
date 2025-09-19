"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Trash2, Edit3, Save } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  modifiedAt: Date
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = () => {
    const savedNotes = localStorage.getItem("syntex-notes")
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        modifiedAt: new Date(note.modifiedAt),
      }))
      setNotes(parsedNotes)
    } else {
      // Create default welcome note
      const welcomeNote: Note = {
        id: crypto.randomUUID(),
        title: "Welcome to Notes",
        content:
          "Welcome to SyntexOS Notes!\n\nThis is your personal note-taking app. You can:\n\n• Create new notes\n• Edit existing notes\n• Search through your notes\n• Delete notes you no longer need\n\nYour notes are automatically saved to your browser's local storage.",
        createdAt: new Date(),
        modifiedAt: new Date(),
      }
      setNotes([welcomeNote])
      setSelectedNote(welcomeNote)
      saveNotes([welcomeNote])
    }
  }

  const saveNotes = (notesToSave: Note[]) => {
    localStorage.setItem("syntex-notes", JSON.stringify(notesToSave))
  }

  const createNote = () => {
    if (newNoteTitle.trim()) {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: newNoteTitle.trim(),
        content: newNoteContent,
        createdAt: new Date(),
        modifiedAt: new Date(),
      }
      const updatedNotes = [newNote, ...notes]
      setNotes(updatedNotes)
      saveNotes(updatedNotes)
      setSelectedNote(newNote)
      setNewNoteTitle("")
      setNewNoteContent("")
      setIsNewNoteOpen(false)
    }
  }

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    setNotes(updatedNotes)
    saveNotes(updatedNotes)
    if (selectedNote?.id === noteId) {
      setSelectedNote(updatedNotes[0] || null)
    }
  }

  const startEditing = () => {
    if (selectedNote) {
      setEditContent(selectedNote.content)
      setIsEditing(true)
    }
  }

  const saveEdit = () => {
    if (selectedNote) {
      const updatedNote = {
        ...selectedNote,
        content: editContent,
        modifiedAt: new Date(),
      }
      const updatedNotes = notes.map((note) => (note.id === selectedNote.id ? updatedNote : note))
      setNotes(updatedNotes)
      saveNotes(updatedNotes)
      setSelectedNote(updatedNote)
      setIsEditing(false)
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Notes</h2>
            <Dialog open={isNewNoteOpen} onOpenChange={setIsNewNoteOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="note-title">Title</Label>
                    <Input
                      id="note-title"
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      placeholder="Enter note title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="note-content">Content</Label>
                    <Textarea
                      id="note-content"
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Start writing..."
                      rows={6}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsNewNoteOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createNote}>Create</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Notes List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`
                  p-3 rounded-lg cursor-pointer mb-2 transition-colors
                  ${selectedNote?.id === note.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"}
                `}
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {note.content.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{formatDate(note.modifiedAt)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 ml-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNote(note.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Note Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">{selectedNote.title}</h1>
                <p className="text-sm text-muted-foreground">Modified {formatDate(selectedNote.modifiedAt)}</p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <Button onClick={saveEdit}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                ) : (
                  <Button onClick={startEditing}>
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                <Button variant="outline" onClick={() => deleteNote(selectedNote.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 p-4">
              {isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full resize-none border-none focus:ring-0 text-base"
                  placeholder="Start writing..."
                />
              ) : (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">{selectedNote.content}</pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a note to view or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
