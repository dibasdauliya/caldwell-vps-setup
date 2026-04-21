import { type NextRequest, NextResponse } from "next/server"
import { API_ENDPOINTS } from "@/lib/api-config"
import { serverApiRequest } from "@/lib/server-api-config"

export async function GET() {
  try {
    const projects = await serverApiRequest(API_ENDPOINTS.projects.list)
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

    const newProject = await serverApiRequest(API_ENDPOINTS.projects.create, {
      method: 'POST',
      body: JSON.stringify({ name: body.name })
    })

    return NextResponse.json(newProject, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
