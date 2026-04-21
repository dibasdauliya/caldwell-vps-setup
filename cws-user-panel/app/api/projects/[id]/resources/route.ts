import { type NextRequest, NextResponse } from "next/server"
import { API_ENDPOINTS } from "@/lib/api-config"
import { serverApiRequest } from "@/lib/server-api-config"

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
    const projectResources = await serverApiRequest(API_ENDPOINTS.projects.getResources(projectId))
    return NextResponse.json(projectResources)
  } catch {
    return NextResponse.json({ error: "Failed to fetch project resources" }, { status: 500 })
  }
}