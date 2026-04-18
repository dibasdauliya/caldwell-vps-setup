"use client"

import { useState } from "react"
import ProjectsPage from "@/components/projects-page"
import ProjectDetail from "@/components/project-detail"
import { ResourceDetailPage } from "@/components/resource-detail-page"
import { AppHeader } from "@/components/app-header"
import { AuthProvider } from "@/lib/auth-context"

interface SelectedView {
    type: "projects" | "project" | "resource"
    projectId?: string
    resource?: any
}

export default function Home() {
    const [selectedView, setSelectedView] = useState<SelectedView>({ type: "projects" })

    return (
        <AuthProvider>
            <AppHeader
                showBackButton={selectedView.type === "project" || selectedView.type === "resource"}
                onBack={() => {
                    if (selectedView.type === "resource") {
                        setSelectedView({ type: "project", projectId: selectedView.projectId })
                    } else {
                        setSelectedView({ type: "projects" })
                    }
                }}
            />
            {selectedView.type === "resource" && selectedView.resource ? (
                <ResourceDetailPage
                    resource={selectedView.resource}
                    onBack={() => setSelectedView({ type: "project", projectId: selectedView.projectId })}
                />
            ) : selectedView.type === "project" && selectedView.projectId ? (
                <div className="min-h-screen bg-background text-foreground">
                    <ProjectDetail
                        projectId={selectedView.projectId}
                        onSelectResource={(resource) => setSelectedView({ type: "resource", projectId: selectedView.projectId, resource })}
                    />
                </div>
            ) : (
                <ProjectsPage onSelectProject={(projectId) => {
                    if (projectId) {
                        setSelectedView({ type: "project", projectId })
                    }
                }} />
            )}
        </AuthProvider>
    )
}
