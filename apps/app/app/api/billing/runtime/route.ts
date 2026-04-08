import { NextResponse } from "next/server"
import { customerSafeMessages } from "@/lib/customer-safe-errors"
import { logBillingRuntimeState } from "@/lib/workspace-billing"

export async function GET() {
  const diagnostics = logBillingRuntimeState("runtime-check")
  const hardFail = diagnostics.issues.length > 0 || !diagnostics.supabaseConfigured

  return NextResponse.json({
    hardFail,
    userMessage: hardFail ? customerSafeMessages.billingUnavailable : null,
  })
}
