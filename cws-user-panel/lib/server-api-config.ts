import { cookies } from 'next/headers'
import { API_BASE_URL } from './api-config'

// Server-side API request helper that includes cookies
export async function serverApiRequest<T = unknown>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth-token')

    const url = `${API_BASE_URL}${endpoint}`

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    // Add auth token if available
    if (authToken) {
        defaultHeaders['Authorization'] = `Bearer ${authToken.value}`
    }

    // Include all cookies in the Cookie header for server-to-server requests
    const cookieHeader = cookieStore.toString()
    if (cookieHeader) {
        defaultHeaders['Cookie'] = cookieHeader
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options?.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
}
