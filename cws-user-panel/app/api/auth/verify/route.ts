import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://upload.cstem.us'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
        return NextResponse.redirect(`${BASE_URL}/login?error=missing_token`)
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]))

        const redirectUrl = searchParams.get('redirect') || '/'
        const redirectResponse = NextResponse.redirect(`${BASE_URL}${redirectUrl}`)

        redirectResponse.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 60,
            path: '/',
        })

        if (payload.email) {
            redirectResponse.cookies.set('user_email', payload.email, {
                httpOnly: false,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 60,
                path: '/',
            })
        }

        return redirectResponse
    } catch {
        return NextResponse.redirect(`${BASE_URL}/login?error=invalid_token`)
    }
}
