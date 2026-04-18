import { type NextRequest, NextResponse } from "next/server"
import { API_ENDPOINTS, apiRequest } from "@/lib/api-config"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Validate request body
        if (!body.id || typeof body.id !== 'string') {
            return NextResponse.json(
                { error: "Project ID is required" },
                { status: 400 }
            )
        }

        // Get the cookie header from the incoming request
        const cookieHeader = req.headers.get('cookie') || ''

        // Forward the request to the backend API
        await apiRequest(API_ENDPOINTS.projects.delete(body.id), {
            method: 'GET',
            cookieHeader,
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        // Get error message
        const errorMessage = error instanceof Error ? error.message : "Failed to delete project"

        // Check if error message indicates project has resources
        if (errorMessage.toLowerCase().includes('has') ||
            errorMessage.toLowerCase().includes('resource') ||
            errorMessage.toLowerCase().includes('application') ||
            errorMessage.toLowerCase().includes('database') ||
            errorMessage.toLowerCase().includes('cannot')) {
            return NextResponse.json(
                { error: "Cannot delete project with active resources. Please delete all applications and databases first." },
                { status: 409 }
            )
        }

        // Pass through the actual error message for better debugging
        const responseError = errorMessage.includes('Failed')
            ? "Failed to delete project"
            : errorMessage

        return NextResponse.json(
            { error: responseError },
            { status: 500 }
        )
    }
}
