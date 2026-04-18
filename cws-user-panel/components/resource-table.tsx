"use client"

import { useFetch } from "@/hooks/use-fetch"
import { useMemo, useState, useEffect } from "react"
import React from "react"
import { RefreshCw, Loader2, Database, Monitor, Settings, Server, HardDrive, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiRequest } from "@/lib/api-config"
import { ResourceRowSkeleton } from "@/components/ui/skeleton-rows"
import { ErrorMessages } from "@/lib/error-messages"


interface Resource {
    id: string
    name: string
    type: "application" | "mongodb" | "postgresql" | "redis" | "mariadb" | "mysql" | "service"
    status: string
    rawData?: any
}

interface ResourceTableProps {
    projectId: string
    onSelectResource: (resource: any) => void
    refetchTrigger?: number
}

interface BaseResource {
    id: number | string
    uuid: string
    name: string
    status: string
    destination?: {
        server?: {
            name: string
        }
    }
}

interface ProjectResourcesResponse {
    applications?: BaseResource[]
    mongodbs?: BaseResource[]
    postgresqls?: BaseResource[]
    redis?: BaseResource[]
    mariadbs?: BaseResource[]
    mysqls?: BaseResource[]
    services?: BaseResource[]
}

const RESOURCE_ICONS = {
    application: Server,
    mongodb: Database,
    postgresql: HardDrive,
    redis: Zap,
    mariadb: Database,
    mysql: Database,
    service: Settings,
} as const

function getStatusColor(status: string): string {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes("running")) return "bg-green-500/20 text-green-700"
    if (lowerStatus.includes("deploying")) return "bg-blue-500/20 text-blue-700"
    if (lowerStatus.includes("exited")) return "bg-red-500/20 text-red-700"
    if (lowerStatus.includes("unhealthy")) return "bg-yellow-500/20 text-yellow-700"
    if (lowerStatus.includes("stopped")) return "bg-gray-500/20 text-gray-700"
    return "bg-muted text-muted-foreground"
}

function parseProjectResources(data: ProjectResourcesResponse | null, deploymentStatuses: Record<string, string> = {}): Resource[] {
    if (!data) return []

    const resources: Resource[] = []

    // Parse applications
    if (data.applications?.length ?? 0 > 0) {
        data.applications?.forEach((app) => {
            const deploymentStatus = deploymentStatuses[String(app.id)]
            const status = deploymentStatus || app.status || "unknown"

            resources.push({
                id: String(app.id),
                name: (app as BaseResource & { git_repository?: string }).git_repository || app.name || `App ${app.id}`,
                type: "application",
                status: status,
                rawData: app
            })
        })
    }

    // Parse different database types
    const dbTypes = [
        { key: "mongodbs" as const, type: "mongodb" as const, label: "MongoDB" },
        { key: "postgresqls" as const, type: "postgresql" as const, label: "PostgreSQL" },
        { key: "redis" as const, type: "redis" as const, label: "Redis" },
        { key: "mariadbs" as const, type: "mariadb" as const, label: "MariaDB" },
        { key: "mysqls" as const, type: "mysql" as const, label: "MySQL" },
    ]

    dbTypes.forEach(({ key, type, label }) => {
        const items = data[key]
        if (items?.length ?? 0 > 0) {
            items?.forEach((db) => {
                resources.push({
                    id: String(db.id),
                    name: db.name || `${label} ${db.id}`,
                    type,
                    status: db.status || "unknown",
                    rawData: db
                })
            })
        }
    })

    // Parse services
    if (data.services?.length ?? 0 > 0) {
        data.services?.forEach((service) => {
            resources.push({
                id: String(service.id),
                name: service.name || `Service ${service.id}`,
                type: "service",
                status: service.status || "unknown",
                rawData: service
            })
        })
    }

    return resources
}

export default function ResourceTable({ projectId, onSelectResource, refetchTrigger }: ResourceTableProps) {
    const { data, isLoading, error, refetch } = useFetch<ProjectResourcesResponse>(`/api/projects/${projectId}/resources`)
    const [deploymentStatuses, setDeploymentStatuses] = useState<Record<string, string>>({})

    // Trigger refetch when refetchTrigger changes
    useEffect(() => {
        if (refetchTrigger && refetchTrigger > 0) {
            refetch()
        }
    }, [refetchTrigger, refetch])

    // Fetch deployment statuses for applications
    useEffect(() => {
        if (data?.applications && data.applications.length > 0) {
            const fetchDeploymentStatuses = async () => {
                const statuses: Record<string, string> = {}

                for (const app of data.applications || []) {
                    try {
                        const deploymentData = await apiRequest(`/get-deployment/${app.uuid}`) as any
                        const hasInProgress = deploymentData.deployments?.some((deployment: any) =>
                            deployment.status === 'in_progress'
                        )
                        if (hasInProgress) {
                            statuses[String(app.id)] = 'deploying'
                        }
                    } catch (error) {
                    }
                }

                setDeploymentStatuses(statuses)
            }

            fetchDeploymentStatuses()
        }
    }, [data])

    const resources = useMemo(() =>
        parseProjectResources(data, deploymentStatuses),
        [data, deploymentStatuses]
    )

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border/50 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">
                            Project Resources
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Applications, databases, and services
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-sm font-medium text-foreground">
                                {isLoading ? "Loading..." : `${resources.length} item${resources.length !== 1 ? "s" : ""}`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Total resources
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isLoading}
                            className="h-9 px-3"
                            title="Refresh resources"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-muted/30 backdrop-blur-sm border-b border-border/50">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Resource
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Type
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <>
                                <ResourceRowSkeleton />
                                <ResourceRowSkeleton />
                                <ResourceRowSkeleton />
                            </>
                        ) : error ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center">
                                    <div className="text-red-500 text-sm">{ErrorMessages.RESOURCES_FAILED}</div>
                                    <div className="text-muted-foreground text-xs mt-1">{error.message}</div>
                                </td>
                            </tr>
                        ) : resources.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-sm text-muted-foreground text-center">
                                    No resources found in this project
                                </td>
                            </tr>
                        ) : (
                            resources.map((resource) => (
                                <tr
                                    key={`${resource.type}-${resource.id}`}
                                    className="border-b border-border/30 hover:bg-muted/40 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                                    onClick={() => onSelectResource(resource.rawData)}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                {React.createElement(RESOURCE_ICONS[resource.type] || Database, {
                                                    className: "w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                                                })}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {resource.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Click to view details
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-muted-foreground capitalize">
                                                {resource.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(resource.status)} flex items-center gap-1.5 shadow-sm`}>
                                            {resource.status === 'deploying' && (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            )}
                                            {resource.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


        </div>
    )
}
