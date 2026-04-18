"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { apiRequest } from "@/lib/api-config"

type DatabaseType = "mongodb" | "postgresql" | "redis"

interface CreateDatabaseDialogProps {
    projectId: string
    onDatabaseCreated: () => void
}

export function CreateDatabaseDialog({ projectId, onDatabaseCreated }: CreateDatabaseDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [advancedOpen, setAdvancedOpen] = useState(false)
    const [formData, setFormData] = useState({
        database_type: "mongodb" as DatabaseType,
        name: "",
        description: "",
        is_public: false,
        public_port: "",
        // PostgreSQL specific
        postgres_user: "",
        postgres_password: "",
        postgres_db: "",
        postgres_initdb_args: "",
        postgres_host_auth_method: "",
        postgres_conf: "",
        // Redis specific
        redis_password: "",
        redis_conf: "",
        // MongoDB specific
        mongo_conf: "",
        mongo_initdb_root_username: "",
    })

    const handleCreateDatabase = async () => {
        if (!formData.database_type) {
            toast.error("Database type is required")
            return
        }

        setIsLoading(true)

        toast.info("Creating database... This may take up to a minute to complete.")

        try {
            // Build the request data based on database type
            const baseData = {
                project_uuid: projectId,
                ...(formData.name.trim() && { name: formData.name.trim() }),
                ...(formData.description.trim() && { description: formData.description.trim() }),
                ...(formData.is_public && { is_public: formData.is_public }),
                ...(formData.public_port.trim() && { public_port: parseInt(formData.public_port.trim()) }),
            }

            let databaseData: any = baseData

            // Add database-specific fields
            if (formData.database_type === "postgresql") {
                databaseData = {
                    ...baseData,
                    ...(formData.postgres_user.trim() && { postgres_user: formData.postgres_user.trim() }),
                    ...(formData.postgres_password.trim() && { postgres_password: formData.postgres_password.trim() }),
                    ...(formData.postgres_db.trim() && { postgres_db: formData.postgres_db.trim() }),
                    ...(formData.postgres_initdb_args.trim() && { postgres_initdb_args: formData.postgres_initdb_args.trim() }),
                    ...(formData.postgres_host_auth_method.trim() && { postgres_host_auth_method: formData.postgres_host_auth_method.trim() }),
                    ...(formData.postgres_conf.trim() && { postgres_conf: formData.postgres_conf.trim() }),
                }
            } else if (formData.database_type === "redis") {
                databaseData = {
                    ...baseData,
                    ...(formData.redis_password.trim() && { redis_password: formData.redis_password.trim() }),
                    ...(formData.redis_conf.trim() && { redis_conf: formData.redis_conf.trim() }),
                }
            } else if (formData.database_type === "mongodb") {
                databaseData = {
                    ...baseData,
                    ...(formData.mongo_conf.trim() && { mongo_conf: formData.mongo_conf.trim() }),
                    ...(formData.mongo_initdb_root_username.trim() && { mongo_initdb_root_username: formData.mongo_initdb_root_username.trim() }),
                }
            }

            const endpoint = `/create-database-${formData.database_type}`

            await apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(databaseData),
            })

            toast.success("Application created successfully.")

            setIsCreating(false)
            // Reset form
            setFormData({
                database_type: "mongodb",
                name: "",
                description: "",
                is_public: false,
                public_port: "",
                // PostgreSQL specific
                postgres_user: "",
                postgres_password: "",
                postgres_db: "",
                postgres_initdb_args: "",
                postgres_host_auth_method: "",
                postgres_conf: "",
                // Redis specific
                redis_password: "",
                redis_conf: "",
                // MongoDB specific
                mongo_conf: "",
                mongo_initdb_root_username: "",
            })
            setOpen(false)
            onDatabaseCreated()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create database")
        } finally {
            setIsLoading(false)
        }
    }

    const renderAdvancedFields = () => {
        switch (formData.database_type) {
            case "postgresql":
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="postgres-user">PostgreSQL User</Label>
                            <Input
                                id="postgres-user"
                                placeholder="postgres"
                                value={formData.postgres_user}
                                onChange={(e) => setFormData(prev => ({ ...prev, postgres_user: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postgres-password">PostgreSQL Password</Label>
                            <Input
                                id="postgres-password"
                                type="password"
                                placeholder="secure_password"
                                value={formData.postgres_password}
                                onChange={(e) => setFormData(prev => ({ ...prev, postgres_password: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postgres-db">PostgreSQL Database</Label>
                            <Input
                                id="postgres-db"
                                placeholder="myapp"
                                value={formData.postgres_db}
                                onChange={(e) => setFormData(prev => ({ ...prev, postgres_db: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postgres-initdb-args">PostgreSQL InitDB Args</Label>
                            <Input
                                id="postgres-initdb-args"
                                placeholder="--encoding=UTF-8"
                                value={formData.postgres_initdb_args}
                                onChange={(e) => setFormData(prev => ({ ...prev, postgres_initdb_args: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postgres-host-auth-method">PostgreSQL Host Auth Method</Label>
                            <Input
                                id="postgres-host-auth-method"
                                placeholder="trust"
                                value={formData.postgres_host_auth_method}
                                onChange={(e) => setFormData(prev => ({ ...prev, postgres_host_auth_method: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postgres-conf">PostgreSQL Configuration</Label>
                            <Input
                                id="postgres-conf"
                                placeholder="key=value,key2=value2"
                                value={formData.postgres_conf}
                                onChange={(e) => setFormData(prev => ({ ...prev, postgres_conf: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>
                    </>
                )

            case "redis":
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="redis-password">Redis Password</Label>
                            <Input
                                id="redis-password"
                                type="password"
                                placeholder="secure_password"
                                value={formData.redis_password}
                                onChange={(e) => setFormData(prev => ({ ...prev, redis_password: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="redis-conf">Redis Configuration</Label>
                            <Input
                                id="redis-conf"
                                placeholder="key=value,key2=value2"
                                value={formData.redis_conf}
                                onChange={(e) => setFormData(prev => ({ ...prev, redis_conf: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>
                    </>
                )

            case "mongodb":
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="mongo-conf">MongoDB Configuration</Label>
                            <Input
                                id="mongo-conf"
                                placeholder="key=value,key2=value2"
                                value={formData.mongo_conf}
                                onChange={(e) => setFormData(prev => ({ ...prev, mongo_conf: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mongo-initdb-root-username">MongoDB Root Username</Label>
                            <Input
                                id="mongo-initdb-root-username"
                                placeholder="admin"
                                value={formData.mongo_initdb_root_username}
                                onChange={(e) => setFormData(prev => ({ ...prev, mongo_initdb_root_username: e.target.value }))}
                                disabled={isLoading}
                            />
                        </div>
                    </>
                )

            default:
                return null
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">New Database</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create New Database</DialogTitle>
                    <DialogDescription>
                        Choose your database type and configure basic settings. Advanced options are available below.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[32rem] overflow-y-auto">
                    {/* Required Fields */}
                    <div className="space-y-2">
                        <Label htmlFor="database-type">Database Type *</Label>
                        <Select
                            value={formData.database_type}
                            onValueChange={(value: DatabaseType) =>
                                setFormData(prev => ({ ...prev, database_type: value }))
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mongodb">MongoDB</SelectItem>
                                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                                <SelectItem value="redis">Redis</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Advanced Settings */}
                    <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                                <span className="text-sm font-medium">Advanced Settings</span>
                                {advancedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="db-name">Database Name</Label>
                                <Input
                                    id="db-name"
                                    placeholder="my-database"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    placeholder="Database description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is-public"
                                        checked={formData.is_public}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: !!checked }))}
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="is-public" className="text-sm">Public Database</Label>
                                </div>
                            </div>

                            {formData.is_public && (
                                <div className="space-y-2">
                                    <Label htmlFor="public-port">Public Port</Label>
                                    <Input
                                        id="public-port"
                                        type="number"
                                        placeholder="5432"
                                        value={formData.public_port}
                                        onChange={(e) => setFormData(prev => ({ ...prev, public_port: e.target.value }))}
                                        disabled={isLoading}
                                    />
                                </div>
                            )}

                            {/* Database-specific fields */}
                            {renderAdvancedFields()}
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading || isCreating}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateDatabase}
                            disabled={isLoading || isCreating || !formData.database_type}
                        >
                            {isLoading || isCreating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
