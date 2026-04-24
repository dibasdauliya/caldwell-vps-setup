import { NextRequest, NextResponse } from 'next/server'

function getBaseUrl(request: NextRequest): string {
    const proto = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'
    return `${proto}://${host}`
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    const baseUrl = getBaseUrl(request)

    // Redirect to the actual verify endpoint with the token
    if (token) {
        return NextResponse.redirect(`${baseUrl}/api/auth/verify?token=${token}`)
    }

    // If no token, redirect to login page with error
    return NextResponse.redirect(`${baseUrl}/login?error=missing_token`)
}