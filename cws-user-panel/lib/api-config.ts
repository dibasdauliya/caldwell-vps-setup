// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// API Endpoints - Next.js API routes (proxy to backend)
export const API_ENDPOINTS = {
    // User/Authentication endpoints
    auth: {
        createUser: '/create-user',
        listUsers: '/list-user',
        deleteUser: (email: string) => `/delete-user/${email}`,
        signIn: '/signin-user',
        signInWithToken: (token: string) => `/signin-user/${token}`,
    },

    // Project endpoints
    projects: {
        list: '/list-project',
        create: '/create-project',
        get: (id: string) => `/get-project/${id}`,
        getResources: (id: string) => `/get-project-resources/${id}`,
        delete: (id: string) => `/delete-project/${id}`,
    },

    // Application endpoints - Next.js API routes
    applications: {
        create: '/create-application',
        get: (id: string) => `/get-application/${id}`,
        update: (id: string) => `/update-application/${id}`,
        delete: (id: string) => `/delete-application/${id}`,
        start: (id: string) => `/start-application/${id}`,
        stop: (id: string) => `/stop-application/${id}`,
        restart: (id: string) => `/restart-application/${id}`,
    },

    databases: {
        createMongo: '/create-database-mongo',
        get: (id: string) => `/get-database/${id}`,
        delete: (id: string) => `/delete-database/${id}`,
        start: (id: string) => `/start-database/${id}`,
        stop: (id: string) => `/stop-database/${id}`,
    }
}

// Helper function to make API requests
export async function apiRequest<T = unknown>(
    endpoint: string,
    options?: RequestInit & { cookieHeader?: string }
): Promise<T> {
    // For Next.js API routes (starting with /api/), make relative requests
    // For backend routes, use the full API_BASE_URL
    const url = endpoint.startsWith('/api/') ? endpoint : `${API_BASE_URL}${endpoint}`

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    // If cookieHeader is provided (from server-side), forward it
    if (options?.cookieHeader) {
        defaultHeaders['Cookie'] = options.cookieHeader
    }

    const response = await fetch(url, {
        ...options,
        credentials: 'include', // This ensures cookies are sent with requests
        headers: {
            ...defaultHeaders,
            ...options?.headers,
        },
    })

    if (!response.ok) {
        // If unauthorized, redirect to login (only on client-side)
        if (response.status === 401 && typeof window !== 'undefined') {
            window.location.href = '/login'
        }
        const errorData = await response.json().catch(() => null)
        const message = errorData?.message || response.statusText
        throw new Error(message)
    }

    return response.json()
}
