import { NextResponse } from "next/server"
import { getBillingRuntimeDiagnostics, logBillingRuntimeState } from "@/lib/workspace-billing"

export async function GET() {
  const diagnostics = logBillingRuntimeState("runtime-check")

  return NextResponse.json({
    ...getBillingRuntimeDiagnostics(),
    hardFail: diagnostics.issues.length > 0 || !diagnostics.supabaseConfigured,
  })
}
