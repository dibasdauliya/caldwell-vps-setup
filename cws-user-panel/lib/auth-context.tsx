"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    isAuthenticated: boolean
    userEmail: string | null
    loading: boolean
    logout: () => Promise<void>
    checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const checkAuth = () => {
        // Check for auth token in cookies
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=')
            acc[key] = value
            return acc
        }, {} as Record<string, string>)

        // Using 'auth-token' to match Hono JWT middleware configuration
        const hasAuthToken = cookies['auth-token']
        const email = cookies.user_email

        if (hasAuthToken) {
            setIsAuthenticated(true)
            setUserEmail(email ? decodeURIComponent(email) : null)
        } else {
            setIsAuthenticated(false)
            setUserEmail(null)
        }
        setLoading(false)
    }

    const logout = async () => {
        try {
            // Call the logout API to clear server-side cookies
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })
        } catch {
            // Logout error handled silently
        }
        
        // Clear client-side cookies by setting them with expired date
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        document.cookie = 'user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        
        // Clear localStorage token if it exists
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token')
        }

        setIsAuthenticated(false)
        setUserEmail(null)
        router.push('/login')
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, userEmail, loading, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}