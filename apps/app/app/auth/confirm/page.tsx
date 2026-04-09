"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthShell, AuthStateCard } from "@/components/auth-shell"
import { buildAuthErrorHref } from "@/lib/auth-flow"
import { customerSafeMessages } from "@/lib/customer-safe-errors"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

function ConfirmEmailPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("We're confirming this email now.")

  useEffect(() => {
    let active = true

    const confirmEmail = async () => {
      const tokenHash = searchParams.get("token_hash")
      const type = searchParams.get("type")
      const supabase = getSupabaseBrowserClient()

      if (!tokenHash || type !== "email" || !supabase) {
        router.replace(buildAuthErrorHref("invalid-link", "/signup"))
        return
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "email",
      })

      if (!active) return

      if (error) {
        console.error("[auth.confirm] email confirmation failed", error)
        router.replace(buildAuthErrorHref("invalid-link", "/signup"))
        return
      }

      setMessage("Your email has been confirmed. Redirecting now.")
      router.replace("/auth/confirmed?intent=email-confirmed")
    }

    void confirmEmail()

    return () => {
      active = false
    }
  }, [router, searchParams])

  return (
    <AuthShell eyebrow="Confirming email" title="Confirming your email" description={message}>
      <AuthStateCard
        title="Confirming your email"
        description={message}
        note={customerSafeMessages.authUnavailable}
      />
    </AuthShell>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div className="app-shell min-h-screen" />}>
      <ConfirmEmailPageContent />
    </Suspense>
  )
}
