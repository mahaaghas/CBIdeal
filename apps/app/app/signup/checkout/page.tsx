"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { getSaasPlan, saasAppConfig, type SelfServePlanId } from "@cbideal/config"
import { SetupStatusNotice } from "@/components/setup-status-notice"
import { customerSafeMessages } from "@/lib/customer-safe-errors"
import { usePlatformAccess } from "@/lib/platform-access-store"

type BillingRuntimePayload = {
  hardFail?: boolean
  userMessage?: string | null
}

function renderPlanPrice(plan: { monthlyPrice: number | null }) {
  return plan.monthlyPrice === null ? "Custom" : `$${plan.monthlyPrice}`
}

function renderSeatLimit(limit: number | null) {
  if (limit == null) return "Flexible number of users"
  return limit === 1 ? "1 user" : `Up to ${limit} users`
}

function SignupCheckoutPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentTenant, markCheckoutPending, syncTenantStatus } = usePlatformAccess()
  const tenantId = searchParams.get("tenant")
  const rawPlanId = searchParams.get("plan")
  const planId = rawPlanId && (rawPlanId === "solo" || rawPlanId === "team" || rawPlanId === "business") ? rawPlanId : "solo"
  const plan = getSaasPlan(planId)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [billingBlockedMessage, setBillingBlockedMessage] = useState<string | null>(null)
  const [checkingAvailability, setCheckingAvailability] = useState(true)

  const checkBillingAvailability = async () => {
    setCheckingAvailability(true)

    try {
      const response = await fetch("/api/billing/runtime", { cache: "no-store" })
      const payload = (await response.json()) as BillingRuntimePayload
      setBillingBlockedMessage(payload.hardFail ? payload.userMessage ?? customerSafeMessages.billingUnavailable : null)
    } catch (runtimeError) {
      console.error("[billing.checkout.ui] runtime check failed", runtimeError)
      setBillingBlockedMessage(customerSafeMessages.billingUnavailable)
    } finally {
      setCheckingAvailability(false)
    }
  }

  useEffect(() => {
    if (!tenantId) return
    void syncTenantStatus(tenantId).then((result) => {
      if (result.ok && result.tenant?.subscriptionStatus === "Active" && result.tenant.paymentStatus === "Paid") {
        router.replace("/setup")
      }
    })
  }, [router, syncTenantStatus, tenantId])

  useEffect(() => {
    void checkBillingAvailability()
  }, [])

  const handleCheckout = async () => {
    if (!tenantId) {
      setError(customerSafeMessages.workspaceMissing)
      return
    }

    if (checkingAvailability || billingBlockedMessage) {
      setError(billingBlockedMessage ?? customerSafeMessages.billingUnavailable)
      return
    }

    setSubmitting(true)
    setError(null)

    console.info("[billing.checkout.ui] requesting checkout session", {
      tenantId,
      planId,
    })

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, planId }),
      })

      const payload = (await response.json()) as { url?: string; checkoutSessionId?: string | null; error?: string }

      if (!response.ok || !payload.url) {
        console.error("[billing.checkout.ui] checkout request failed", {
          tenantId,
          planId,
          error: payload.error ?? customerSafeMessages.billingPreparationFailed,
        })
        setError(payload.error ?? customerSafeMessages.billingPreparationFailed)
        setSubmitting(false)
        return
      }

      markCheckoutPending(tenantId, payload.checkoutSessionId ?? null)
      router.push(payload.url)
    } catch (checkoutError) {
      console.error("[billing.checkout.ui] checkout request crashed", {
        tenantId,
        planId,
        error: checkoutError instanceof Error ? checkoutError.message : "Unknown checkout error",
      })
      setError(customerSafeMessages.billingPreparationFailed)
      setSubmitting(false)
    }
  }

  return (
    <div className="app-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1240px] gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <section className="section-card rounded-[32px] p-8 md:p-10 lg:p-11">
          <div className="space-y-8">
            <div className="space-y-5">
              <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">Billing</span>
              <h1 className="font-serif text-[2.6rem] leading-[1.01] tracking-[-0.045em] text-white md:text-[3.1rem]">
                Confirm the plan before secure checkout.
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300">
                This step reviews the workspace, confirms the selected plan, and moves into the live Stripe checkout that must complete before access is activated.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_55px_rgba(8,13,24,0.14)]">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-white">Workspace</p>
                  <p className="mt-3 text-xl font-semibold text-white">{currentTenant?.companyName ?? "Pending workspace"}</p>
                </div>
                <p className="text-sm leading-7 text-slate-300">
                  The admin account and company record are already prepared. Payment confirmation is the final step before the workspace can open.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-white/8 bg-slate-950/22 px-4 py-4 text-sm text-slate-300">
                    Plan selected: {plan.name}
                  </div>
                  <div className="rounded-[20px] border border-white/8 bg-slate-950/22 px-4 py-4 text-sm text-slate-300">
                    Billing activates access only after Stripe confirmation
                  </div>
                </div>
              </div>
            </div>

            <SetupStatusNotice
              title="Need a tailored rollout instead?"
              description="Enterprise remains on a contact-led route so implementation scope, integrations, and access structure can be agreed before provisioning."
              actions={
                <Link
                  href={saasAppConfig.enterprisePath}
                  className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/28"
                >
                  Contact us
                </Link>
              }
            />
          </div>
        </section>

        <section className="section-card rounded-[32px] p-8 md:p-10 lg:p-11">
          <div className="space-y-7">
            <div className="space-y-3">
              <span className="eyebrow">Checkout review</span>
              <h2 className="font-serif text-[2.15rem] leading-[1.04] tracking-[-0.045em] text-white">
                {plan.name} plan
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                Review the workspace plan and continue only when you are ready to open secure checkout.
              </p>
            </div>

            {billingBlockedMessage ? (
              <SetupStatusNotice
                tone="warning"
                title="Billing is temporarily unavailable"
                description={billingBlockedMessage}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => void checkBillingAvailability()}
                      className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/28"
                    >
                      Retry
                    </button>
                    <Link
                      href="https://www.cbideal.nl/contact"
                      className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/28 hover:text-white"
                    >
                      Contact support
                    </Link>
                  </>
                }
              />
            ) : null}

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_55px_rgba(8,13,24,0.14)]">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Selected plan</p>
                  <p className="mt-3 text-xl font-semibold text-white">{plan.name}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{plan.description}</p>
                  <p className="mt-2 text-sm font-medium text-slate-200">{renderSeatLimit(plan.internalSeatLimit)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[2.15rem] font-semibold text-white">{renderPlanPrice(plan)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">monthly</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="rounded-[20px] border border-white/8 bg-slate-950/22 px-4 py-4 text-sm leading-7 text-slate-300">
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {error ? <SetupStatusNotice tone="warning" title="We couldn't prepare billing" description={error} /> : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={!tenantId || submitting || checkingAvailability || Boolean(billingBlockedMessage)}
                className="rounded-full bg-[var(--app-brand-primary)] px-5 py-3.5 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkingAvailability
                  ? "Checking billing..."
                  : submitting
                    ? "Opening secure checkout..."
                    : billingBlockedMessage
                      ? "Billing temporarily unavailable"
                      : "Continue to secure checkout"}
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
                Contact us
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
