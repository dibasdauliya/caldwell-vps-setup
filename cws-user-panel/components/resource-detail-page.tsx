"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, Loader2, Database, Settings, Server, HardDrive, Zap, RefreshCw } from "lucide-react"
import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { apiRequest, API_ENDPOINTS } from "@/lib/api-config"

interface ResourceDetailPageProps {
  resource: any
  onBack: () => void
}

const RESOURCE_ICONS: Record<string, React.ComponentType<any>> = {
    application: Server,
    mongodb: Database,
    postgresql: HardDrive,
    redis: Zap,
    mariadb: Database,
    mysql: Database,
    service: Settings,
}

function formatKey(key: string): string {
    return key
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

function isDetailField(key: string, value: any): boolean {
    if (
        key.startsWith("_") ||
        typeof value === "object" ||
        value === null ||
        value === undefined
    ) {
        return false
    }
    if (typeof value === "string" && value.length > 500) {
        return false
    }
    return true
}

function getResourceType(resource: any): string {
    if (resource.database_type) {
        return resource.database_type
            .replace("standalone-", "")
            .replace("-", " ")
            .toUpperCase()
    }
    if (resource.type) {
        return resource.type.toUpperCase()
    }
    return "RESOURCE"
}

function getStatusColor(status: string): string {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes("running")) return "text-green-500"
    if (lowerStatus.includes("deploying")) return "text-blue-500"
    if (lowerStatus.includes("exited") || lowerStatus.includes("stopped"))
        return "text-red-500"
    if (lowerStatus.includes("unhealthy")) return "text-yellow-500"
    return "text-gray-500"
}

export function ResourceDetailPage({
    resource,
    onBack,
}: ResourceDetailPageProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [envVars, setEnvVars] = useState<any[]>([])
    const [envLoading, setEnvLoading] = useState(false)
    const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingEnv, setEditingEnv] = useState<{ key: string, value: string } | null>(null)
    const [envValue, setEnvValue] = useState("")
    const [updatingEnv, setUpdatingEnv] = useState(false)
    const [addEnvDialogOpen, setAddEnvDialogOpen] = useState(false)
    const [envText, setEnvText] = useState("")
    const [creatingEnvs, setCreatingEnvs] = useState(false)

    // Helper function to refresh data and go back
    const refreshAndGoBack = () => {
        // For now, just go back to the project view to show updated data
        onBack()
    }

    const resourceType = getResourceType(resource)
    // Determine resource type based on available fields
    const isApplication = !!(resource.git_repository || resource.git_branch || resource.ports_exposes)

    // Fetch environment variables and deployment status for applications
    useEffect(() => {
        if (isApplication && resource.uuid) {
            const fetchData = async () => {
                setEnvLoading(true)
                try {
                    // Fetch environment variables
                    const envData = await apiRequest(`/list-env/${resource.uuid}`) as any[]
                    const uniqueEnvs = envData
                        .filter((env, index, self) =>
                            index === self.findIndex(e => e.key === env.key)
                        )
                        .filter(env => env.key !== 'NIXPACKS_NODE_VERSION')
                    setEnvVars(uniqueEnvs)

                    // Fetch deployment status
                    const deploymentData = await apiRequest(`/get-deployment/${resource.uuid}`) as any
                    const hasInProgress = deploymentData.deployments?.some((deployment: any) =>
                        deployment.status === 'in_progress'
                    )
                    setDeploymentStatus(hasInProgress ? 'deploying' : null)
        } catch (error) {
          // Show error toast for data fetch failures
          toast.error('Failed to load application data')
        } finally {
                    setEnvLoading(false)
                }
            }
            fetchData()
        }
    }, [isApplication, resource.uuid])

    const handleAction = async (action: 'start' | 'stop' | 'delete') => {
        const resourceId = resource.uuid || resource.id
        const resourceType = isApplication ? 'application' : 'database'

        if (action === 'delete') {
            // Show confirmation toast for delete actions
            toast(`Delete ${resourceType} "${resource.name}"?`, {
                action: {
                    label: "Delete",
                    onClick: () => performAction(action, resourceId, resourceType),
                },
                cancel: {
                    label: "Cancel",
                    onClick: () => { },
                },
            })
            return
        }

        // For non-delete actions, proceed immediately
        performAction(action, resourceId, resourceType)
    }

    const performAction = async (action: 'start' | 'stop' | 'delete', resourceId: string, resourceType: string) => {
        setIsLoading(action)

        try {
            // Determine HTTP method based on action and resource type
            let method: 'GET' | 'POST' | 'DELETE' = 'POST'
            if (action === 'delete') {
                method = 'DELETE'
            }

            let endpoint: string
            if (resourceType === 'application') {
                endpoint = API_ENDPOINTS.applications[action](resourceId)
            } else {
                endpoint = API_ENDPOINTS.databases[action](resourceId)
            }

            await apiRequest(endpoint, {
                method,
            })

            if (action === 'start') {
                toast.success(`${resourceType} start queued successfully`)
                refreshAndGoBack()
            } else if (action === 'stop') {
                toast.success(`${resourceType} stop queued successfully`)
                refreshAndGoBack()
            } else if (action === 'delete') {
                // For delete operations, disable button for 5 seconds
                setIsDeleting(true)
                setTimeout(() => {
                    setIsDeleting(false)
                    refreshAndGoBack()
                }, 5000)
            } else {
                // For all other actions, refresh immediately
                refreshAndGoBack()
            }
        } catch (error) {
            toast.error(`Failed to ${action} ${resourceType}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsLoading(null)
        }
    }

    const handleRestart = async () => {
        const resourceId = resource.uuid || resource.id
        setIsLoading('restart')
        try {
            await apiRequest(API_ENDPOINTS.applications.restart(resourceId), {
                method: 'POST',
            })
            toast.success('Redeploy queued successfully')
            refreshAndGoBack()
        } catch (error) {
            toast.error(`Failed to redeploy: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsLoading(null)
        }
    }

    const handleEditEnv = (key: string) => {
        setEditingEnv({ key, value: "" })
        setEnvValue("")
        setEditDialogOpen(true)
    }

    const handleUpdateEnv = async () => {
        if (!editingEnv) return

        setUpdatingEnv(true)
        try {
            await apiRequest(`/update-env/${resource.uuid}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    key: editingEnv.key,
                    value: envValue
                })
            })

            toast.success(`Environment variable "${editingEnv.key}" updated successfully`)
            setEditDialogOpen(false)
            setEditingEnv(null)
            setEnvValue("")

            // Refresh environment variables
            const data = await apiRequest(`/list-env/${resource.uuid}`) as any[]
            const uniqueEnvs = data
                .filter((env, index, self) =>
                    index === self.findIndex(e => e.key === env.key)
                )
                .filter(env => env.key !== 'NIXPACKS_NODE_VERSION')
            setEnvVars(uniqueEnvs)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update environment variable")
        } finally {
            setUpdatingEnv(false)
        }
    }

    const parseEnvText = (text: string) => {
        const envs: { key: string, value: string }[] = []
        const lines = text.split('\n').filter(line => line.trim())

        for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine || trimmedLine.startsWith('#')) continue

            const equalsIndex = trimmedLine.indexOf('=')
            if (equalsIndex === -1) continue

            const key = trimmedLine.substring(0, equalsIndex).trim()
            const value = trimmedLine.substring(equalsIndex + 1).trim()

            if (key && value) {
                envs.push({ key, value })
            }
        }

        return envs
    }

    const handleCreateEnvs = async () => {
        const parsedEnvs = parseEnvText(envText)
        if (parsedEnvs.length === 0) {
            toast.error("No valid environment variables found")
            return
        }

        setCreatingEnvs(true)
        try {
            await apiRequest(`/create-env-bulk/${resource.uuid}`, {
                method: 'POST',
                body: JSON.stringify(parsedEnvs)
            })

            toast.success(`Successfully created ${parsedEnvs.length} environment variable(s)`)
            setAddEnvDialogOpen(false)
            setEnvText("")

            // Refresh environment variables
            const data = await apiRequest(`/list-env/${resource.uuid}`) as any[]
            const uniqueEnvs = data
                .filter((env, index, self) =>
                    index === self.findIndex(e => e.key === env.key)
                )
                .filter(env => env.key !== 'NIXPACKS_NODE_VERSION')
            setEnvVars(uniqueEnvs)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create environment variables")
        } finally {
            setCreatingEnvs(false)
        }
    }

    const handleDeleteEnv = async (envUuid: string, envKey: string) => {
        toast(`Delete environment variable "${envKey}"?`, {
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await apiRequest(`/delete-env/${resource.uuid}/${envUuid}`, {
                            method: 'DELETE'
                        })

                        toast.success(`Environment variable "${envKey}" deleted successfully`)

                        // Refresh environment variables
                        const data = await apiRequest(`/list-env/${resource.uuid}`) as any[]
                        const uniqueEnvs = data.filter((env, index, self) =>
                            index === self.findIndex(e => e.key === env.key)
                        ).filter(env => env.key !== 'NIXPACKS_NODE_VERSION')
                        setEnvVars(uniqueEnvs)
                    } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Failed to delete environment variable")
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
        })
    }

    const importantFields = [
        "name",
        "image",
        "docker_registry_image_name",
        "git_repository",
        "git_branch",
        "ports_exposes",
        "limits_memory",
        "limits_cpus",
        "postgres_db",
        "postgres_user",
        "mongo_initdb_database",
        "mongo_initdb_root_username",
        "redis_conf",
        "internal_db_url",
        "external_db_url",
        "fqdn",
        "health_check_path",
        "created_at",
        "updated_at",
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                        size="sm"
                    >
                        ← Back
                    </Button>
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{resource.name}</h1>
                        </div>
                    </div>
                </div>
                {resource && (
                    <div className="flex items-center gap-4">
                        {/* Status Badge */}
                        {(resource.status || deploymentStatus) && (
                            <div className={`px-3 py-1.5 rounded-full font-semibold text-sm ${getStatusColor(deploymentStatus || resource.status)} flex items-center gap-2 shadow-sm`}>
                                {(deploymentStatus === 'deploying') && (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                )}
                                {deploymentStatus || resource.status}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => handleAction('start')}
                                disabled={isLoading !== null || deploymentStatus === 'deploying' || (resource.status && resource.status.toLowerCase().includes('running'))}
                                className="px-4 py-2"
                            >
                                {isLoading === 'start' ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Starting...
                                    </>
                                ) : (
                                    'Start'
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleAction('stop')}
                                disabled={isLoading !== null || deploymentStatus === 'deploying' || (resource.status && resource.status.toLowerCase().includes('exited'))}
                                className="px-4 py-2"
                            >
                                {isLoading === 'stop' ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Stopping...
                                    </>
                                ) : (
                                    'Stop'
                                )}
                            </Button>
                            {isApplication && (
                                <Button
                                    variant="outline"
                                    onClick={handleRestart}
                                    disabled={isLoading !== null || deploymentStatus === 'deploying'}
                                    className="px-4 py-2"
                                >
                                    {isLoading === 'restart' ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Redeploying...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Redeploy
                                        </>
                                    )}
                                </Button>
                            )}
                            <Button
                                variant="destructive"
                                onClick={() => handleAction('delete')}
                                disabled={isLoading !== null || deploymentStatus === 'deploying'}
                                className="px-4 py-2"
                            >
                                {isLoading === 'delete' || isDeleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                <div className={isApplication ? "max-w-7xl mx-auto px-8 py-8" : "max-w-5xl mx-auto px-8 py-8"}>
                    <div className={isApplication ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "space-y-8"}>

                    {/* Details Grid */}
                    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">Configuration</h2>
                                <p className="text-muted-foreground text-sm">Resource settings and properties</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {importantFields.map((field) => {
                                const value = resource[field]
                                if (!isDetailField(field, value)) return null

                                return (
                                    <div key={field} className="bg-muted/30 rounded-lg p-4 border border-border/30">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                            {formatKey(field)}
                                        </p>
                                        {field === "fqdn" && value ? (
                                            <a
                                                href={`${value}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-medium text-primary hover:text-primary/80 underline break-all transition-colors"
                                            >
                                                {String(value)}
                                            </a>
                                        ) : (
                                            <p className="text-sm font-medium text-foreground break-words">
                                                {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>





                    {/* Environment Variables - Only for applications */}
                    {isApplication && (
                        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h2 className="text-xl font-semibold text-foreground">Environment Variables</h2>
                                        <p className="text-muted-foreground text-sm">Application configuration settings</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setAddEnvDialogOpen(true)}
                                    className="px-4"
                                >
                                    Add Variables
                                </Button>
                            </div>
                            {envLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                        <p className="text-muted-foreground">Loading environment variables...</p>
                                    </div>
                                </div>
                            ) : envVars.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {envVars.map((env, index) => (
                                        <div
                                            key={env.uuid || index}
                                            className="bg-muted/50 hover:bg-muted border border-border/30 p-4 rounded-lg group relative transition-all duration-200 hover:shadow-sm"
                                        >
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => handleEditEnv(env.key)}
                                            >
                                                <p className="text-sm font-mono font-semibold text-foreground mb-1">
                                                    {env.key}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Click to edit
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute -top-2 -right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-destructive hover:bg-destructive/80 shadow-md"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteEnv(env.uuid, env.key)
                                                }}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-3">🔧</div>
                                    <p className="text-muted-foreground font-medium mb-1">No environment variables</p>
                                    <p className="text-muted-foreground text-sm">Add variables to configure your application</p>
                                </div>
                            )}
                        </div>
                    )}
                    </div>

                    {/* Edit Environment Variable Dialog */}
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Environment Variable</DialogTitle>
                                <DialogDescription>
                                    Update the value for environment variable "{editingEnv?.key}"
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="env-key">Key</Label>
                                    <Input
                                        id="env-key"
                                        value={editingEnv?.key || ""}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="env-value">Value</Label>
                                    <Input
                                        id="env-value"
                                        placeholder="Enter new value"
                                        value={envValue}
                                        onChange={(e) => setEnvValue(e.target.value)}
                                        disabled={updatingEnv}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditDialogOpen(false)}
                                        disabled={updatingEnv}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleUpdateEnv}
                                        disabled={updatingEnv}
                                    >
                                        {updatingEnv ? "Updating..." : "Update"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Add Environment Variables Dialog */}
                    <Dialog open={addEnvDialogOpen} onOpenChange={setAddEnvDialogOpen}>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Environment Variables</DialogTitle>
                                <DialogDescription>
                                    Enter environment variables in KEY=VALUE format, one per line.
                                    Lines starting with # will be ignored.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="env-text">Environment Variables</Label>
                                    <Textarea
                                        id="env-text"
                                        placeholder={`MONGO_URI=mongodb://localhost:27017/myapp
PORT=3000
NODE_ENV=development`}
                                        value={envText}
                                        onChange={(e) => setEnvText(e.target.value)}
                                        disabled={creatingEnvs}
                                        rows={8}
                                        className="font-mono text-sm resize-none overflow-y-auto min-h-[120px] max-h-[120px]"
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Example format: KEY=value
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setAddEnvDialogOpen(false)}
                                        disabled={creatingEnvs}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateEnvs}
                                        disabled={creatingEnvs || !envText.trim()}
                                    >
                                        {creatingEnvs ? "Creating..." : "Create Variables"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
