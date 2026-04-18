"use client"

import { useFetch } from "@/hooks/use-fetch"
import { ProjectRowSkeleton } from "@/components/ui/skeleton-rows"
import { ErrorMessages } from "@/lib/error-messages"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { DeleteProjectDialog } from "@/components/delete-project-dialog"

interface Project {
    id: string
    name: string
    apps_count?: number
    dbs_count?: number
}

interface ProjectsPageProps {
    onSelectProject: (id: string) => void
}

export default function ProjectsPage({ onSelectProject }: ProjectsPageProps) {
    const { data, isLoading, error, refetch } = useFetch<Project[]>("/api/projects")
    const projects = data ?? []

    return (
        <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="flex flex-col h-screen">
                {/* Header Section */}
                <div className="flex-shrink-0 px-8 py-12 border-b border-border/50 bg-background/80 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h1 className="text-4xl font-bold text-foreground mb-2">Projects</h1>
                                <p className="text-muted-foreground text-lg">
                                    Manage and access your projects
                                </p>
                            </div>
                            <CreateProjectDialog onProjectCreated={refetch} />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-6xl mx-auto px-8 py-8">
                        {isLoading ? (
                            <div className="space-y-4">
                                <ProjectRowSkeleton />
                                <ProjectRowSkeleton />
                                <ProjectRowSkeleton />
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-96">
                                <div className="text-center p-8 rounded-lg border border-destructive/20 bg-destructive/5">
                                    <div className="text-destructive font-semibold text-lg mb-2">⚠️ {ErrorMessages.PROJECTS_FAILED}</div>
                                    <div className="text-muted-foreground">{error.message}</div>
                                </div>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="flex items-center justify-center h-96">
                                <div className="text-center p-12 rounded-lg border-2 border-dashed border-muted-foreground/25">
                                    <div className="text-6xl mb-4">📁</div>
                                    <div className="text-muted-foreground text-lg font-medium mb-2">No projects found</div>
                                    <div className="text-muted-foreground text-sm">Create your first project to get started</div>
                                </div>
                            </div>
                        ) : (
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="p-6 rounded-xl border border-border/50 bg-card hover:bg-muted/30 hover:border-border/80 hover:shadow-md transition-all duration-300 group cursor-pointer"
                                    onClick={() => onSelectProject(project.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <span className="text-xl">📁</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                                    {project.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Project resources and deployments
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 flex items-center gap-3">
                                            <div className="text-muted-foreground group-hover:text-muted-foreground/80 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                            <DeleteProjectDialog
                                                projectId={project.id}
                                                projectName={project.name}
                                                onProjectDeleted={refetch}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </main>
    )
}