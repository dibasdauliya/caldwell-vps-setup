"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail } from "lucide-react"
import { API_ENDPOINTS, apiRequest } from "@/lib/api-config"

function LoginForm() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const searchParams = useSearchParams()

    useEffect(() => {
        // Check for error messages in query params
        const errorParam = searchParams.get('error')
        if (errorParam === 'invalid_token') {
            setError('The login link is invalid or has expired. Please request a new one.')
        } else if (errorParam === 'missing_token') {
            setError('Invalid login link. Please request a new one.')
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            // Send magic link request
            await apiRequest(API_ENDPOINTS.auth.signIn, {
                method: "POST",
                body: JSON.stringify({ email }),
            })

            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send magic link. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Mail className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle>Check your email</CardTitle>
                        <CardDescription className="mt-2">
                            We've sent a magic link to <strong>{email}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertDescription>
                                Click the link in your email to sign in. The link will expire in 10 minutes.
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => {
                                setSuccess(false)
                                setEmail("")
                            }}
                            variant="outline"
                            className="w-full"
                        >
                            Try another email
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Sign in to C-STEM</CardTitle>
                    <CardDescription>
                        Enter your email to receive a magic sign-in link
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || !email}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending magic link...
                                </>
                            ) : (
                                "Send magic link"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
