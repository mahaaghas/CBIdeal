"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthShell, AuthStateCard } from "@/components/auth-shell"
import { buildAuthErrorHref } from "@/lib/auth-flow"
import { customerSafeMessages } from "@/lib/customer-safe-errors"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

function InviteAcceptPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"verifying" | "accepted" | "error">("verifying")
  const [description, setDescription] = useState(
    "You've been invited to join this workspace. Accept the invitation to create your account and access your assigned seat.",
  )

  useEffect(() => {
    let active = true

    const verifyInvite = async () => {
      const tokenHash = searchParams.get("token_hash")
      const type = searchParams.get("type")
      const supabase = getSupabaseBrowserClient()

      if (!tokenHash || type !== "invite" || !supabase) {
        router.replace(buildAuthErrorHref("invalid-link", "/login"))
        return
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "invite",
      })

      if (!active) return

      if (error) {
        console.error("[auth.invite] invite acceptance failed", error)
        router.replace(buildAuthErrorHref("invalid-link", "/login"))
        return
      }

      setStatus("accepted")
      setDescription("Your invitation has been confirmed. Continue to sign in and access your assigned seat.")
    }

    void verifyInvite()

    return () => {
      active = false
    }
  }, [router, searchParams])

  return (
    <AuthShell
      eyebrow="Workspace invitation"
      title={status === "accepted" ? "Invitation accepted" : "Accepting your invitation"}
      description={description}
    >
      <AuthStateCard
        title={status === "accepted" ? "Invitation accepted" : "Accepting your invitation"}
        description={description}
        note={
          status === "accepted"
            ? "If no seats are currently available, remove a user or upgrade the plan before adding another team member."
            : customerSafeMessages.authUnavailable
        }
        actions={status === "accepted" ? [{ label: "Go to login", href: "/login" }] : undefined}
      />
    </AuthShell>
  )
}

export default function InviteAcceptPage() {
  return (
    <Suspense fallback={<div className="app-shell min-h-screen" />}>
      <InviteAcceptPageContent />
    </Suspense>
  )
}
