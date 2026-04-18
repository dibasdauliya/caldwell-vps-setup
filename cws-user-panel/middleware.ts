import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/api/auth/verify', '/signin']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the route is public
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    // Get the auth token from cookies
    const authToken = request.cookies.get('auth-token')

    // If the route is protected and user is not authenticated, redirect to login
    if (!isPublicRoute && !authToken) {
        const loginUrl = new URL('/login', request.url)
        // Add the original URL as a redirect parameter
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If user is authenticated and trying to access login, redirect to home
    if (isPublicRoute && authToken && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
    ],
}
