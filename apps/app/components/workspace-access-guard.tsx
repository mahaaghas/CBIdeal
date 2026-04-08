"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { customerSafeMessages } from "@/lib/customer-safe-errors"
import { usePlatformAccess } from "@/lib/platform-access-store"

export function WorkspaceAccessGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { currentTenant, mode, ready, syncTenantStatus } = usePlatformAccess()
  const [checking, setChecking] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) return
    if (mode === "guest") {
      router.replace("/login")
      return
    }

    if (mode === "workspace" && !currentTenant) {
      router.replace("/login")
      return
    }

    if (mode !== "workspace" || !currentTenant) {
      setChecking(false)
      return
    }

    let cancelled = false
    setChecking(true)
    setStatusError(null)

    void syncTenantStatus(currentTenant.id)
      .then((result) => {
        if (cancelled) return
        if (!result.ok || !result.tenant) {
          setStatusError(result.error ?? customerSafeMessages.workspaceAccessFailed)
          router.replace(`/signup/checkout?tenant=${currentTenant.id}&plan=${currentTenant.planId}`)
          return
        }

        if (result.tenant.subscriptionStatus !== "Active" || result.tenant.paymentStatus !== "Paid") {
          router.replace(`/signup/checkout?tenant=${currentTenant.id}&plan=${result.tenant.planId}`)
          return
        }

        setChecking(false)
      })
      .catch((error) => {
        if (cancelled) return
        console.error("[workspace.access] status check failed", {
          tenantId: currentTenant.id,
          error: error instanceof Error ? error.message : "Unknown access failure",
        })
        setStatusError(customerSafeMessages.workspaceAccessFailed)
        router.replace(`/signup/checkout?tenant=${currentTenant.id}&plan=${currentTenant.planId}`)
      })

    return () => {
      cancelled = true
    }
  }, [currentTenant?.id, currentTenant?.planId, mode, ready, router, syncTenantStatus])

  if (
    !ready ||
    checking ||
    mode === "guest" ||
    (mode === "workspace" &&
      (!currentTenant || currentTenant.subscriptionStatus !== "Active" || currentTenant.paymentStatus !== "Paid"))
  ) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-[28px] border border-white/10 bg-white/5 px-8 py-14 text-center text-sm text-slate-300">
        {statusError ?? "Preparing your workspace access..."}
      </div>
    )
  }

  return <>{children}</>
}
