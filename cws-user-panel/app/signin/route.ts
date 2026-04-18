import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    
    // Redirect to the actual verify endpoint with the token
    if (token) {
        return NextResponse.redirect(new URL(`/api/auth/verify?token=${token}`, request.url))
    }
    
    // If no token, redirect to login page with error
    return NextResponse.redirect(new URL('/login?error=missing_token', request.url))
}