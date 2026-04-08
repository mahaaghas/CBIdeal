import { NextResponse } from "next/server"
import { isSelfServePlan, type SelfServePlanId } from "@cbideal/config"
import { createWorkspaceSignup } from "@/lib/workspace-billing"

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fullName?: string
    email?: string
    password?: string
    companyName?: string
    planId?: SelfServePlanId
  }

  const fullName = body.fullName?.trim() ?? ""
  const email = body.email?.trim() ?? ""
  const password = body.password ?? ""
  const companyName = body.companyName?.trim() ?? ""
  const planId = body.planId

  if (!fullName || !email || !password || !companyName || !planId || !isSelfServePlan(planId)) {
    return NextResponse.json(
      { error: "Full name, email, password, company name, and a valid self-serve plan are required." },
      { status: 400 },
    )
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Passwords must contain at least 8 characters." }, { status: 400 })
  }

  try {
    const workspace = await createWorkspaceSignup({
      fullName,
      email,
      password,
      companyName,
      planId,
    })

    return NextResponse.json(workspace)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create the workspace."
    const status = message.includes("already exists") ? 409 : message.includes("missing") ? 503 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
