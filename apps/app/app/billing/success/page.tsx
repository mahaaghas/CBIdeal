"use client"

import Link from "next/link"
import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { usePlatformAccess } from "@/lib/platform-access-store"

function BillingSuccessPageContent() {
  const searchParams = useSearchParams()
  const { activateSubscription } = usePlatformAccess()
  const tenantId = searchParams.get("tenant")
  const sessionId = searchParams.get("session_id")
  const sandbox = searchParams.get("sandbox") === "1"

  useEffect(() => {
    if (!tenantId) return
    activateSubscription(tenantId, {
      checkoutSessionId: sessionId,
    })
  }, [activateSubscription, sessionId, tenantId])

  return (
    <div className="app-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[860px] items-center">
        <div className="section-card w-full rounded-[32px] p-10 md:p-12">
          <div className="space-y-5">
            <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">
              {sandbox ? "Billing sandbox" : "Subscription active"}
            </span>
            <h1 className="font-serif text-[2.5rem] leading-[1.02] tracking-[-0.04em] text-white md:text-[3rem]">
              Your workspace is ready.
            </h1>
            <p className="text-base leading-8 text-slate-300">
              {sandbox
                ? "Stripe is not configured in this environment, so the flow completed through the local billing sandbox. The workspace has still been activated for end-to-end testing."
                : "The subscription has been confirmed and the firm workspace is now active on app.cbideal.nl."}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-[var(--app-brand-primary)] px-5 py-3.5 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)]">
              Open workspace
            </Link>
            <Link href="/settings" className="rounded-full border border-white/12 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/28">
              Review plan settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={<div className="app-shell min-h-screen" />}>
      <BillingSuccessPageContent />
    </Suspense>
  )
}
