import { NextResponse } from "next/server"
import { getCustomerSafeMessage } from "@/lib/customer-safe-errors"
import { verifyWorkspaceCredentials } from "@/lib/workspace-billing"

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string }
  const email = body.email?.trim() ?? ""
  const password = body.password ?? ""

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
  }

  try {
    const workspace = await verifyWorkspaceCredentials(email, password)
    return NextResponse.json(workspace)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in."
    console.error("[workspace.login] failed", {
      email,
      error: message,
    })
    const status =
      message.includes("No account") || message.includes("did not match")
        ? 401
        : message.includes("missing")
          ? 503
          : 500
    return NextResponse.json({ error: getCustomerSafeMessage("login", message) }, { status })
  }
}
