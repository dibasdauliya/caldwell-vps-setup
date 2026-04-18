"use client"

import { useState } from "react"
import ResourceTable from "./resource-table"
import { CreateApplicationDialog } from "./create-application-dialog"
import { CreateDatabaseDialog } from "./create-database-dialog"

interface ProjectDetailProps {
  projectId: string
  onSelectResource: (resource: any) => void
}

export default function ProjectDetail({ projectId, onSelectResource }: ProjectDetailProps) {
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const handleResourceCreated = () => {
    // Trigger a refetch of the resource table
    setRefetchTrigger(prev => prev + 1)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Project {projectId}
        </h2>
        <div className="flex gap-2">
          <CreateApplicationDialog
            projectId={projectId}
            onApplicationCreated={handleResourceCreated}
          />
          <CreateDatabaseDialog
            projectId={projectId}
            onDatabaseCreated={handleResourceCreated}
          />
        </div>
      </div>
      <ResourceTable projectId={projectId} onSelectResource={onSelectResource} refetchTrigger={refetchTrigger} />
    </div>
  )
}