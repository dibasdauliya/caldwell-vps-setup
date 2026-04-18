import { type NextRequest, NextResponse } from "next/server"
import { API_ENDPOINTS, apiRequest } from "@/lib/api-config"

export async function GET(req: NextRequest) {
  try {
    // Get the cookie header from the incoming request
    const cookieHeader = req.headers.get('cookie') || ''

    const projects = await apiRequest(API_ENDPOINTS.projects.list, {
      cookieHeader
    })
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request body
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      )
    }

    // Get the cookie header from the incoming request
    const cookieHeader = req.headers.get('cookie') || ''

    // Forward the request to the backend API
    const newProject = await apiRequest(API_ENDPOINTS.projects.create, {
      method: 'POST',
      cookieHeader,
      body: JSON.stringify({ name: body.name })
    })

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
