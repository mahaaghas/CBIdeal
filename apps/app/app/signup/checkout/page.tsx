"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { formatPlanAmount, getSaasPlan, saasAppConfig, type SelfServePlanId } from "@cbideal/config"
import { usePlatformAccess } from "@/lib/platform-access-store"

function SignupCheckoutPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentTenant, markCheckoutPending } = usePlatformAccess()
  const tenantId = searchParams.get("tenant")
  const planId = (searchParams.get("plan") as SelfServePlanId | null) ?? "starter"
  const plan = getSaasPlan(planId)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (!tenantId) return
    setSubmitting(true)
    setError(null)

    const response = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, planId }),
    })

    const payload = (await response.json()) as { url?: string; checkoutSessionId?: string | null; error?: string }
    if (!response.ok || !payload.url) {
      setError(payload.error ?? "Unable to begin checkout.")
      setSubmitting(false)
      return
    }

    markCheckoutPending(tenantId, payload.checkoutSessionId ?? null)
    router.push(payload.url)
  }

  return (
    <div className="app-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1180px] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="section-card rounded-[32px] p-8 md:p-10">
          <div className="space-y-5">
            <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">Billing</span>
            <h1 className="font-serif text-[2.4rem] leading-[1.04] tracking-[-0.04em] text-white">
              Confirm the plan before secure checkout.
            </h1>
            <p className="text-base leading-8 text-slate-300">
              This step reviews the workspace being created, the plan limits, and the billing path before the Stripe handoff or local billing sandbox redirect.
            </p>
          </div>
          <div className="mt-8 space-y-3 rounded-[24px] border border-white/10 bg-white/6 p-5">
            <p className="text-sm font-semibold text-white">Workspace</p>
            <p className="text-lg font-semibold text-white">{currentTenant?.companyName ?? "Pending workspace"}</p>
            <p className="text-sm leading-7 text-slate-300">
              The first admin account and company record have already been prepared. Payment is the final activation step.
            </p>
          </div>
        </section>

        <section className="section-card rounded-[32px] p-8 md:p-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="eyebrow">Checkout review</span>
              <h2 className="font-serif text-[2.05rem] leading-[1.08] tracking-[-0.04em] text-white">
                {plan.name} plan
              </h2>
              <p className="text-sm leading-7 text-slate-300">
                Clear pricing and limits before the billing handoff.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/6 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">{plan.name}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-semibold text-white">{formatPlanAmount(plan)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">per month</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-300">
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-[#f04f4f]/30 bg-[#f04f4f]/10 px-4 py-3 text-sm text-[#f9c7c7]">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={!tenantId || submitting}
                className="rounded-full bg-[var(--app-brand-primary)] px-5 py-3.5 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Opening checkout…" : "Continue to secure checkout"}
              </button>
              <Link
                href="/demo"
                className="rounded-full border border-white/12 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/28"
              >
                View Demo
              </Link>
              <Link
                href={saasAppConfig.enterprisePath}
                className="rounded-full border border-white/12 px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-white/28 hover:text-white"
              >
                Request enterprise setup
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function SignupCheckoutPage() {
  return (
    <Suspense fallback={<div className="app-shell min-h-screen" />}>
      <SignupCheckoutPageContent />
    </Suspense>
  )
}
