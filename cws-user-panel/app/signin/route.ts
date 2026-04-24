import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://upload.cstem.us'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (token) {
        return NextResponse.redirect(`${BASE_URL}/api/auth/verify?token=${token}`)
    }

    return NextResponse.redirect(`${BASE_URL}/login?error=missing_token`)
}
