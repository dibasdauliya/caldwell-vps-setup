import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
    const cookieStore = await cookies()
    
    // Clear the authentication cookies
    // Using 'auth-token' to match Hono JWT middleware configuration
    cookieStore.delete('auth-token')
    cookieStore.delete('user_email')
    
    return NextResponse.json({ success: true })
}