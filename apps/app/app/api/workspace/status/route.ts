import { NextResponse } from "next/server"
import { getStripeBillingConfigIssues, getWorkspaceStatus } from "@/lib/workspace-billing"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tenantId = searchParams.get("tenant")?.trim()

  if (!tenantId) {
    return NextResponse.json({ error: "A tenant id is required." }, { status: 400 })
  }

  try {
    const workspace = await getWorkspaceStatus(tenantId)
    if (!workspace) {
      return NextResponse.json({ error: "Workspace billing record not found." }, { status: 404 })
    }

    return NextResponse.json({
      ...workspace,
      stripeConfigIssues: getStripeBillingConfigIssues(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load workspace status."
    const status = message.includes("missing") ? 503 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
