"use client";

import type React from "react";
import { useState, createContext, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { KeyRound } from "lucide-react";

interface AuthContextType {
    token: string;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

interface AuthWrapperProps {
    children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
    const [token, setToken] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputToken, setInputToken] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputToken.trim()) {
            setToken(inputToken);
            setIsAuthenticated(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit(e as any);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-8">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-3">
                        <div className="flex justify-center">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <KeyRound className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-center">Authentication Required</CardTitle>
                        <CardDescription className="text-center">
                            Please enter your access token to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="token">Access Token</Label>
                                <Input
                                    id="token"
                                    type="password"
                                    placeholder="Enter your token"
                                    value={inputToken}
                                    onChange={(e) => setInputToken(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full"
                                    autoFocus
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={!inputToken.trim()}
                            >
                                Access Dashboard
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ token, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}