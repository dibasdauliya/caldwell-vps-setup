"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, ChevronRight, HelpCircle, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { apiRequest } from "@/lib/api-config"

interface CreateApplicationDialogProps {
    projectId: string
    onApplicationCreated: () => void
}

function FieldWithTooltip({
    label,
    tooltip,
    children
}: {
    label: string
    tooltip?: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label>{label}</Label>
                {tooltip && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
            {children}
        </div>
    )
}

export function CreateApplicationDialog({ projectId, onApplicationCreated }: CreateApplicationDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [advancedOpen, setAdvancedOpen] = useState(false)
    const [formData, setFormData] = useState({
        git_repository: "",
        ports_exposes: "",
        git_branch: "main",
        build_pack: "nixpacks" as "nixpacks" | "static",
        name: "",
        description: "",
        // Advanced fields
        is_static: false,
        install_command: "",
        build_command: "",
        start_command: "",
        ports_mappings: "",
        base_directory: "",
        publish_directory: "",
        domains: "",
        webhook_secret_github: "",
        webhook_secret_gitlab: "",
    })

    const handleCreateApplication = async () => {
        // Basic validation
        if (!formData.git_repository.trim()) {
            toast.error("Git repository is required")
            return
        }
        if (!formData.ports_exposes.trim()) {
            toast.error("Ports exposes is required")
            return
        }

        // Advanced fields validation
        if (formData.ports_mappings.trim() && !/^(\d+:\d+)(,\d+:\d+)*$/.test(formData.ports_mappings.trim())) {
            toast.error("Ports mappings must be in format 'host:container' (e.g., '3000:3000')")
            return
        }

        if (formData.base_directory.trim() && !/^[\w\-./]+$/.test(formData.base_directory.trim())) {
            toast.error("Base directory must be a valid path")
            return
        }

        if (formData.publish_directory.trim() && !/^[\w\-./]+$/.test(formData.publish_directory.trim())) {
            toast.error("Publish directory must be a valid path")
            return
        }

        setIsLoading(true)

        toast.info("Creating application... This may take up to a minute to complete.")

        try {
            const applicationData = {
                git_repository: formData.git_repository.trim(),
                ports_exposes: formData.ports_exposes.trim(),
                project_uuid: projectId,
                // Only include non-empty optional fields
                ...(formData.name.trim() && { name: formData.name.trim() }),
                ...(formData.description.trim() && { description: formData.description.trim() }),
                ...(formData.git_branch !== "main" && { git_branch: formData.git_branch.trim() }),
                build_pack: formData.build_pack,
                // Advanced fields - only include if not empty
                ...(formData.is_static && { is_static: formData.is_static }),
                ...(formData.install_command.trim() && { install_command: formData.install_command.trim() }),
                ...(formData.build_command.trim() && { build_command: formData.build_command.trim() }),
                ...(formData.start_command.trim() && { start_command: formData.start_command.trim() }),
                ...(formData.ports_mappings.trim() && { ports_mappings: formData.ports_mappings.trim() }),
                ...(formData.base_directory.trim() && { base_directory: formData.base_directory.trim() }),
                ...(formData.publish_directory.trim() && { publish_directory: formData.publish_directory.trim() }),
                ...(formData.domains.trim() && { domains: `https://${formData.domains.trim()}.cstem.us` }),
                ...(formData.webhook_secret_github.trim() && { manual_webhook_secret_github: formData.webhook_secret_github.trim() }),
                ...(formData.webhook_secret_gitlab.trim() && { manual_webhook_secret_gitlab: formData.webhook_secret_gitlab.trim() }),
            }

            await apiRequest('/create-application', {
                method: 'POST',
                body: JSON.stringify(applicationData),
            })

            toast.success("Application created successfully.")

            setIsCreating(false)
            // Reset form
            setFormData({
                git_repository: "",
                ports_exposes: "",
                git_branch: "main",
                build_pack: "nixpacks" as "nixpacks" | "static",
                name: "",
                description: "",
                // Advanced fields
                is_static: false,
                install_command: "",
                build_command: "",
                start_command: "",
                ports_mappings: "",
                base_directory: "",
                publish_directory: "",
                domains: "",
                webhook_secret_github: "",
                webhook_secret_gitlab: "",
            })
            setOpen(false)
            onApplicationCreated()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create application")
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">New Application</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create New Application</DialogTitle>
                    <DialogDescription>
                        Enter the required information to create your application. Additional settings are available in Advanced Settings.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[32rem] overflow-y-auto">
                    {/* Required Fields */}
                    <div className="space-y-2">
                        <Label htmlFor="git-repository">Git Repository *</Label>
                        <Input
                            id="git-repository"
                            placeholder="https://github.com/user/repo"
                            value={formData.git_repository}
                            onChange={(e) => setFormData(prev => ({ ...prev, git_repository: e.target.value }))}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ports-exposes">Port *</Label>
                        <Input
                            id="ports-exposes"
                            placeholder="3000"
                            value={formData.ports_exposes}
                            onChange={(e) => setFormData(prev => ({ ...prev, ports_exposes: e.target.value }))}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            Common ports: <strong>80</strong> (Static site), <strong>3000</strong> (Next.js / Express / Node), <strong>5173</strong> (Vite / React), <strong>8000</strong> (Django)
                        </p>
                    </div>

                    <FieldWithTooltip
                        label="Subdomain"
                        tooltip="Choose a subdomain for your app"
                    >
                        <div className="flex">
                            <Input
                                id="domains"
                                placeholder="my-app"
                                value={formData.domains}
                                onChange={(e) => setFormData(prev => ({ ...prev, domains: e.target.value }))}
                                disabled={isLoading}
                                className="rounded-r-none"
                            />
                            <span className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                                .cstem.us
                            </span>
                        </div>
                    </FieldWithTooltip>

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
                                <Label htmlFor="app-name">Application Name</Label>
                                <Input
                                    id="app-name"
                                    placeholder="My App"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    placeholder="Application description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="git-branch">Git Branch</Label>
                                <Input
                                    id="git-branch"
                                    placeholder="main"
                                    value={formData.git_branch}
                                    onChange={(e) => setFormData(prev => ({ ...prev, git_branch: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="build-pack">Build Pack</Label>
                                <Select
                                    value={formData.build_pack}
                                    onValueChange={(value: "nixpacks" | "static") =>
                                        setFormData(prev => ({ ...prev, build_pack: value }))
                                    }
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="nixpacks">Nixpacks</SelectItem>
                                        <SelectItem value="static">Static</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is-static"
                                        checked={formData.is_static}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_static: !!checked }))}
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="is-static" className="text-sm">Static Application</Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="install-command">Install Command</Label>
                                <Input
                                    id="install-command"
                                    placeholder="npm install"
                                    value={formData.install_command}
                                    onChange={(e) => setFormData(prev => ({ ...prev, install_command: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="build-command">Build Command</Label>
                                <Input
                                    id="build-command"
                                    placeholder="npm run build"
                                    value={formData.build_command}
                                    onChange={(e) => setFormData(prev => ({ ...prev, build_command: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="publish-directory">Publish Directory</Label>
                                <Input
                                    id="publish-directory"
                                    placeholder="dist"
                                    value={formData.publish_directory}
                                    onChange={(e) => setFormData(prev => ({ ...prev, publish_directory: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </div>

                            <FieldWithTooltip
                                label="GitHub Webhook Secret"
                                tooltip="Secret token for GitHub webhooks to trigger automatic deployments"
                            >
                                <Input
                                    id="ports-mappings"
                                    placeholder="3000:3000"
                                    value={formData.ports_mappings}
                                    onChange={(e) => setFormData(prev => ({ ...prev, ports_mappings: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </FieldWithTooltip>

                            <FieldWithTooltip
                                label="Base Directory"
                                tooltip="The directory in your repository where the application code is located (defaults to repository root)"
                            >
                                <Input
                                    id="base-directory"
                                    placeholder="./"
                                    value={formData.base_directory}
                                    onChange={(e) => setFormData(prev => ({ ...prev, base_directory: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </FieldWithTooltip>

                            <FieldWithTooltip
                                label="Publish Directory"
                                tooltip="Directory containing the built application (for static sites, e.g., 'dist', 'build', '_site')"
                            >
                                <Input
                                    id="publish-directory"
                                    placeholder="dist"
                                    value={formData.publish_directory}
                                    onChange={(e) => setFormData(prev => ({ ...prev, publish_directory: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </FieldWithTooltip>

                            <FieldWithTooltip
                                label="GitHub Webhook Secret"
                                tooltip="Secret token for GitHub webhooks to trigger automatic deployments"
                            >
                                <Input
                                    id="webhook-secret-github"
                                    type="password"
                                    placeholder="your-github-webhook-secret"
                                    value={formData.webhook_secret_github}
                                    onChange={(e) => setFormData(prev => ({ ...prev, webhook_secret_github: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </FieldWithTooltip>

                            <FieldWithTooltip
                                label="GitLab Webhook Secret"
                                tooltip="Secret token for GitLab webhooks to trigger automatic deployments"
                            >
                                <Input
                                    id="webhook-secret-gitlab"
                                    type="password"
                                    placeholder="your-gitlab-webhook-secret"
                                    value={formData.webhook_secret_gitlab}
                                    onChange={(e) => setFormData(prev => ({ ...prev, webhook_secret_gitlab: e.target.value }))}
                                    disabled={isLoading}
                                />
                            </FieldWithTooltip>
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
                            onClick={handleCreateApplication}
                            disabled={isLoading || isCreating || !formData.git_repository.trim() || !formData.ports_exposes.trim()}
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
