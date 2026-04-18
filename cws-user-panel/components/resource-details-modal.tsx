"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Database, Monitor, Settings, Server, HardDrive, Zap } from "lucide-react"
import React from "react"

interface ResourceDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource: any
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
  // Skip internal fields and nested objects
  if (
    key.startsWith("_") ||
    typeof value === "object" ||
    value === null ||
    value === undefined
  ) {
    return false
  }
  // Skip very long strings
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
  if (lowerStatus.includes("exited") || lowerStatus.includes("stopped"))
    return "text-red-500"
  if (lowerStatus.includes("unhealthy")) return "text-yellow-500"
  return "text-gray-500"
}

export function ResourceDetailsModal({
  open,
  onOpenChange,
  resource,
}: ResourceDetailsModalProps) {
  if (!resource) return null

  const resourceType = getResourceType(resource)
  const icon = RESOURCE_ICONS[resource.type || resource.database_type?.split("-")[1]] || Database

  // Get important fields to display
  const importantFields = [
    "name",
    "status",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {React.createElement(icon, {
              className: "w-8 h-8 text-primary"
            })}
            <div>
              <DialogTitle className="text-2xl">{resource.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{resourceType}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          {resource.status && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Status:</span>
              <span className={`text-sm font-semibold ${getStatusColor(resource.status)}`}>
                {resource.status}
              </span>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {importantFields.map((field) => {
              const value = resource[field]
              if (!isDetailField(field, value)) return null

              return (
                <div key={field}>
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    {formatKey(field)}
                  </p>
                  <p className="text-sm text-foreground break-words mt-1">
                    {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Connection URLs */}
          {(resource.internal_db_url || resource.external_db_url || resource.fqdn) && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-3">Connection Details</h4>
              <div className="space-y-3">
                {resource.internal_db_url && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      Internal URL
                    </p>
                    <p className="text-xs text-foreground break-all font-mono bg-muted p-2 rounded mt-1">
                      {resource.internal_db_url}
                    </p>
                  </div>
                )}
                {resource.external_db_url && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      External URL
                    </p>
                    <p className="text-xs text-foreground break-all font-mono bg-muted p-2 rounded mt-1">
                      {resource.external_db_url}
                    </p>
                  </div>
                )}
                {resource.fqdn && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">FQDN</p>
                    <p className="text-xs text-foreground break-all font-mono bg-muted p-2 rounded mt-1">
                      {resource.fqdn}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Credentials */}
          {(resource.mongo_initdb_root_username ||
            resource.postgres_user ||
            resource.redis_conf) && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-3">Credentials</h4>
              <div className="space-y-3">
                {resource.mongo_initdb_root_username && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      Username
                    </p>
                    <p className="text-xs text-foreground font-mono bg-muted p-2 rounded mt-1">
                      {resource.mongo_initdb_root_username}
                    </p>
                  </div>
                )}
                {resource.postgres_user && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      Username
                    </p>
                    <p className="text-xs text-foreground font-mono bg-muted p-2 rounded mt-1">
                      {resource.postgres_user}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
