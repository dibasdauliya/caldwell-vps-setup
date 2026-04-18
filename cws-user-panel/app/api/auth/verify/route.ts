import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
        return NextResponse.redirect(new URL('/login?error=missing_token', request.url))
    }

    // Decode the JWT payload to extract user email (no verification needed here —
    // the backend already verified the token before redirecting)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))

        const redirectUrl = searchParams.get('redirect') || '/'
        const redirectResponse = NextResponse.redirect(new URL(redirectUrl, request.url))

        // Set the auth token cookie on the frontend domain
        redirectResponse.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 60, // 60 days (matches JWT exp)
            path: '/',
        })

        if (payload.email) {
            redirectResponse.cookies.set('user_email', payload.email, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 60,
                path: '/',
            })
        }

        return redirectResponse
    } catch {
        return NextResponse.redirect(new URL('/login?error=invalid_token', request.url))
    }
}
