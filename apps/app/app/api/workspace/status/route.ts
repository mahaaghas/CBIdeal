import { NextResponse } from "next/server"
import { getCustomerSafeMessage } from "@/lib/customer-safe-errors"
import { getWorkspaceStatus } from "@/lib/workspace-billing"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tenantId = searchParams.get("tenant")?.trim()

  if (!tenantId) {
    return NextResponse.json({ error: "A tenant id is required." }, { status: 400 })
  }

  try {
    const workspace = await getWorkspaceStatus(tenantId)
    if (!workspace) {
      return NextResponse.json({ error: getCustomerSafeMessage("status", "not found") }, { status: 404 })
    }

    return NextResponse.json({
      ...workspace,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load workspace status."
    console.error("[workspace.status] failed", {
      tenantId,
      error: message,
    })
    const status = message.includes("missing") ? 503 : 500
    return NextResponse.json({ error: getCustomerSafeMessage("status", message) }, { status })
  }
}
