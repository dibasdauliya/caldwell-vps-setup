"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface DeleteProjectDialogProps {
  projectId: string
  projectName: string
  onProjectDeleted: () => void
}

export function DeleteProjectDialog({
  projectId,
  projectName,
  onProjectDeleted,
}: DeleteProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteProject = () => {
    // Show confirmation toast for delete actions
    toast(`Delete project "${projectName}"?`, {
      action: {
        label: "Delete",
        onClick: () => performDelete(),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    })
  }

  const performDelete = async () => {
    setIsLoading(true)

    toast.info("Deleting project... This may take up to a minute to complete.")

    try {
      const response = await fetch("/api/projects/delete", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: projectId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `Failed to delete project (HTTP ${response.status})`
        toast.error(errorMessage)
        setIsLoading(false)
        return
      }

      toast.success(`Project "${projectName}" deleted successfully`)

      onProjectDeleted()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete project"
      toast.error(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
      title="Delete project"
      onClick={handleDeleteProject}
      disabled={isLoading}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </Button>
  )
}
