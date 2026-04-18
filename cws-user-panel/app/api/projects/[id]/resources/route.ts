import { type NextRequest, NextResponse } from "next/server"
import { API_ENDPOINTS, apiRequest } from "@/lib/api-config"

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Handle both async and sync params for compatibility
  const resolvedParams = await Promise.resolve(params)
  const projectId = resolvedParams.id
  
  if (!projectId || projectId === 'undefined') {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
  }
  
  try {
    // Get the cookie header from the incoming request
    const cookieHeader = req.headers.get('cookie') || ''

    // Use the get-project-resources endpoint to fetch all resources
    const projectResources = await apiRequest(API_ENDPOINTS.projects.getResources(projectId), {
      cookieHeader
    })
    return NextResponse.json(projectResources)
  } catch {
    return NextResponse.json({ error: "Failed to fetch project resources" }, { status: 500 })
  }
}