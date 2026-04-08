"use client"

import Link from "next/link"
import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { usePlatformAccess } from "@/lib/platform-access-store"

function BillingCancelPageContent() {
  const searchParams = useSearchParams()
  const { markPaymentFailed } = usePlatformAccess()
  const tenantId = searchParams.get("tenant")
  const planId = searchParams.get("plan")

  useEffect(() => {
    if (!tenantId) return
    markPaymentFailed(tenantId)
  }, [markPaymentFailed, tenantId])

  return (
    <div className="app-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[860px] items-center">
        <div className="section-card w-full rounded-[32px] p-10 md:p-12">
          <div className="space-y-5">
            <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">Checkout paused</span>
            <h1 className="font-serif text-[2.5rem] leading-[1.02] tracking-[-0.04em] text-white md:text-[3rem]">
              Billing was not completed.
            </h1>
            <p className="text-base leading-8 text-slate-300">
              Your firm workspace remains prepared but inactive until payment is completed. You can return to checkout or move through the demo instead.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={tenantId ? `/signup/checkout?tenant=${tenantId}${planId ? `&plan=${planId}` : ""}` : "/signup"}
              className="rounded-full bg-[var(--app-brand-primary)] px-5 py-3.5 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)]"
            >
              Return to checkout
            </Link>
            <Link
              href="/demo"
              className="rounded-full border border-white/12 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/28"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BillingCancelPage() {
  return (
    <Suspense fallback={<div className="app-shell min-h-screen" />}>
      <BillingCancelPageContent />
    </Suspense>
  )
}
