"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePlatformAccess } from "@/lib/platform-access-store"

export function WorkspaceAccessGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { currentTenant, mode, ready } = usePlatformAccess()

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

    if (mode === "workspace" && currentTenant && currentTenant.subscriptionStatus !== "Active") {
      router.replace(`/signup/checkout?tenant=${currentTenant.id}&plan=${currentTenant.planId}`)
    }
  }, [currentTenant, mode, ready, router])

  if (!ready || mode === "guest" || (mode === "workspace" && (!currentTenant || currentTenant.subscriptionStatus !== "Active"))) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-[28px] border border-white/10 bg-white/5 px-8 py-14 text-center text-sm text-slate-300">
        Preparing your workspace access…
      </div>
    )
  }

  return <>{children}</>
}
