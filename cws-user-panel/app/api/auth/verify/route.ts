import { NextRequest, NextResponse } from 'next/server'
import { API_ENDPOINTS, API_BASE_URL } from '@/lib/api-config'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
        return NextResponse.redirect(new URL('/login?error=missing_token', request.url))
    }

    try {
        // Verify the token with the backend
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.signInWithToken(token)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error('Invalid or expired token')
        }

        const data = await response.json()

        const setCookieHeaders = response.headers.getSetCookie()

        // Check if there was a redirect URL stored
        const redirectUrl = searchParams.get('redirect') || '/'

        // Create a redirect response and forward the Set-Cookie headers from the backend
        const redirectResponse = NextResponse.redirect(new URL(redirectUrl, request.url))
        
        // Forward all Set-Cookie headers from the backend to the client
        for (const cookie of setCookieHeaders) {
            redirectResponse.headers.append('Set-Cookie', cookie)
        }
        
        // Also set user email cookie if available (for client-side display)
        if (data.user && data.user.email) {
            redirectResponse.cookies.set('user_email', data.user.email, {
                httpOnly: false, // Allow client-side access for display purposes
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            })
        } else if (data.email) {
            redirectResponse.cookies.set('user_email', data.email, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            })
        }

        return redirectResponse
     } catch {
         return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
     }
}
