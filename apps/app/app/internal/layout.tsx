"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { InternalShell } from "@/components/internal-shell"
import { hasInternalAreaAccess } from "@/lib/platform-access"
import { usePlatformAccess } from "@/lib/platform-access-store"

export default function InternalLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { currentTenant, currentUser, mode, ready } = usePlatformAccess()

  useEffect(() => {
    if (!ready) return

    if (mode !== "workspace") {
      router.replace("/login")
      return
    }

    if (!hasInternalAreaAccess(currentTenant, currentUser)) {
      router.replace("/dashboard")
    }
  }, [currentTenant, currentUser, mode, ready, router])

  if (!ready || mode !== "workspace" || !hasInternalAreaAccess(currentTenant, currentUser)) {
    return null
  }

  return <InternalShell>{children}</InternalShell>
}
