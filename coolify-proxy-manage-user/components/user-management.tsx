"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Toaster, toast } from 'sonner'
import { useAuth } from "@/components/auth-wrapper";
import { appConfig } from "@/config/app.config";

interface User {
    id: string;
    email: string;
    created_at: string;
}


const createDataLayer = (token: string, setIsUnauthorized: (value: boolean) => void) => ({
    getUsers: async () => {
        const response = await fetch(`${appConfig.api.baseUrl}${appConfig.api.endpoints.listUsers}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )
        if (!response.ok) {
            // Check if it's an authorization error
            if (response.status === 401 || response.status === 403) {
                setIsUnauthorized(true);
                toast.error("Couldn't authorize. Please check your access token.");
            } else {
                try {
                    const errorData = await response.json();
                    toast.error(errorData.message || "Failed to fetch users");
                } catch {
                    toast.error("Failed to fetch users");
                }
            }
            return
        }
        return response.json()
    },
    addUser: async (email: string) => {
        const response = await fetch(`${appConfig.api.baseUrl}${appConfig.api.endpoints.createUser}`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email
                })
            }
        )

        if (!response.ok) {
            // Check if it's an authorization error
            if (response.status === 401 || response.status === 403) {
                setIsUnauthorized(true);
                toast.error("Couldn't authorize. Please check your access token.");
            } else {
                try {
                    const errorData = await response.json();
                    toast.error(errorData.message || "Failed to add user");
                } catch {
                    toast.error("Failed to add user");
                }
            }
            return;
        }

        return response.json()
    },
    deleteUser: async (id: string) => {
        const response = await fetch(`${appConfig.api.baseUrl}${appConfig.api.endpoints.deleteUser}/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        )

        if (!response.ok) {
            // Check if it's an authorization error
            if (response.status === 401 || response.status === 403) {
                setIsUnauthorized(true);
                toast.error("Couldn't authorize. Please check your access token.");
            } else {
                try {
                    const errorData = await response.json();
                    toast.error(errorData.message || "Failed to delete user");
                } catch {
                    toast.error("Failed to delete user");
                }
            }
            return;
        }

        return response.json()
    }
})

export function UserManagement() {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    const handleAddUser = async () => {
        if (!email.trim()) return;
        setIsLoading(true);
        const DATA_LAYER = createDataLayer(token, setIsUnauthorized);
        const user = await DATA_LAYER.addUser(email);
        if (user) {
            setUsers((prev) => [user, ...prev])
        }
        setEmail("");
        setIsLoading(false);
    };

    const handleRemoveUser = async (id: string) => {
        setIsLoading(true);
        const DATA_LAYER = createDataLayer(token, setIsUnauthorized);
        const result = await DATA_LAYER.deleteUser(id);
        if (result) {
            setUsers((prev) => prev.filter((u) => u.id !== id))
        }
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isLoading) {
            handleAddUser();
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true)
            const DATA_LAYER = createDataLayer(token, setIsUnauthorized);
            const users = await DATA_LAYER.getUsers() || [];
            setUsers(users)
            setIsLoading(false)
        }

        fetchUsers()
    }, [token])

    // Show unauthorized message if user is not authorized
    if (isUnauthorized) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-destructive">Unauthorized</h1>
                    <p className="text-muted-foreground text-lg">
                        You are not authorized to access this resource.
                    </p>
                    <p className="text-muted-foreground">
                        Please check your access token and try again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Toaster />
            {/* Add User Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Add New User</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Input
                        type="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button
                        onClick={handleAddUser}
                        disabled={isLoading || !email.trim()}
                    >
                        {isLoading ? "Adding..." : "Add"}
                    </Button>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Users ({users.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {users.length === 0
                        ? (
                            <p className="text-muted-foreground text-center py-8">
                                No users yet. Add one to get started.
                            </p>
                        )
                        : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                Email
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-foreground">
                                                Added
                                            </th>
                                            <th className="text-right py-3 px-4 font-semibold text-foreground">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b hover:bg-muted/50 transition-colors"
                                            >
                                                <td className="py-3 px-4 text-foreground">
                                                    {user.email}
                                                </td>
                                                <td className="py-3 px-4 text-muted-foreground">
                                                    {new Date(user.created_at)
                                                        .toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute:
                                                                    "2-digit",
                                                            },
                                                        )}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleRemoveUser(
                                                                user.id,
                                                            )}
                                                        disabled={isLoading}
                                                        className="text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </CardContent>
            </Card>
        </div>
    );
}
