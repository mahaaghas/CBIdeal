"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AuthShell, AuthStateCard } from "@/components/auth-shell"
import { SetupStatusNotice } from "@/components/setup-status-notice"
import { authAbsoluteUrls, authRoutes } from "@/lib/auth-flow"
import { customerSafeMessages } from "@/lib/customer-safe-errors"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        console.error("[auth.forgot-password] browser client unavailable")
        setError(customerSafeMessages.authUnavailable)
        setSubmitting(false)
        return
      }

      const { error: requestError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: authAbsoluteUrls.resetPassword,
      })

      if (requestError) {
        console.error("[auth.forgot-password] reset request failed", requestError)
        setError(customerSafeMessages.authUnavailable)
        setSubmitting(false)
        return
      }

      router.push(`${authRoutes.checkEmail}?intent=reset-password&email=${encodeURIComponent(email)}`)
    } catch (requestError) {
      console.error("[auth.forgot-password] unexpected error", requestError)
      setError(customerSafeMessages.authUnavailable)
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Password recovery"
      title="Reset your password"
      description="Enter the email address tied to your account and we'll send a secure link so you can choose a new password."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthStateCard
          title="Request a secure reset link"
          description="We only use this email to send the next step. If a valid account exists, the instructions will arrive in your inbox."
          note="If you don't see the message after a moment, check your spam folder."
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-100">
                Work email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-13 w-full rounded-2xl border border-white/12 bg-slate-950/40 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--app-brand-primary)]"
                placeholder="name@firm.com"
                required
              />
            </div>

            {error ? <SetupStatusNotice tone="warning" title="Something went wrong" description={error} /> : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-[var(--app-brand-primary)] px-5 py-3 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending link..." : "Send reset link"}
              </button>
              <Link
                href={authRoutes.login}
                className="rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/28"
              >
                Back to login
              </Link>
            </div>
          </div>
        </AuthStateCard>
      </form>
    </AuthShell>
  )
}
