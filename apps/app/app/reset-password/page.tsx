"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { AuthError } from "@supabase/supabase-js"
import { AuthShell, AuthStateCard } from "@/components/auth-shell"
import { SetupStatusNotice } from "@/components/setup-status-notice"
import { buildAuthErrorHref } from "@/lib/auth-flow"
import { customerSafeMessages } from "@/lib/customer-safe-errors"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

type ResetState = "verifying" | "ready" | "saving" | "error"

function ResetPasswordPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<ResetState>("verifying")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const verifyRecoveryLink = async () => {
      const tokenHash = searchParams.get("token_hash")
      const type = searchParams.get("type")
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        setStatus("error")
        setError(customerSafeMessages.authUnavailable)
        return
      }

      if (tokenHash && type === "recovery") {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        })

        if (!active) return

        if (verifyError) {
          console.error("[auth.reset-password] recovery verification failed", verifyError)
          router.replace(buildAuthErrorHref("invalid-link", "/forgot-password"))
          return
        }

        setStatus("ready")
        setError(null)
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!active) return

      if (!session) {
        router.replace(buildAuthErrorHref("invalid-link", "/forgot-password"))
        return
      }

      setStatus("ready")
      setError(null)
    }

    void verifyRecoveryLink()

    return () => {
      active = false
    }
  }, [router, searchParams])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password.length < 8) {
      setError("Please choose a password with at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("The passwords don't match. Please enter the same password twice.")
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setError(customerSafeMessages.authUnavailable)
      return
    }

    setStatus("saving")
    setError(null)

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      console.error("[auth.reset-password] password update failed", updateError as AuthError)
      setStatus("error")
      setError(customerSafeMessages.passwordResetFailed)
      return
    }

    await supabase.auth.signOut()
    router.push("/auth/confirmed?intent=password-updated")
  }

  return (
    <AuthShell
      eyebrow="Password reset"
      title="Choose a new password"
      description="Reset your password here, then return to login with your updated credentials."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthStateCard
          title="Choose a new password"
          description={
            status === "verifying"
              ? "We're checking this reset link now."
              : "Create a new password for your account to continue."
          }
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-100">
                New password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-13 w-full rounded-2xl border border-white/12 bg-slate-950/40 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--app-brand-primary)]"
                placeholder="Create a new password"
                minLength={8}
                disabled={status !== "ready"}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-100">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="h-13 w-full rounded-2xl border border-white/12 bg-slate-950/40 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--app-brand-primary)]"
                placeholder="Enter the new password again"
                minLength={8}
                disabled={status !== "ready"}
                required
              />
            </div>

            {error ? <SetupStatusNotice tone="warning" title="Something went wrong" description={error} /> : null}

            <button
              type="submit"
              disabled={status !== "ready"}
              className="rounded-full bg-[var(--app-brand-primary)] px-5 py-3 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "verifying"
                ? "Checking link..."
                : status === "saving"
                  ? "Updating password..."
                  : "Update password"}
            </button>
          </div>
        </AuthStateCard>
      </form>
    </AuthShell>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="app-shell min-h-screen" />}>
      <ResetPasswordPageContent />
    </Suspense>
  )
}
