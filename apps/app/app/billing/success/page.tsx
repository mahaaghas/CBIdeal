"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { saasAppConfig } from "@cbideal/config"
import { SetupStatusNotice } from "@/components/setup-status-notice"
import { customerSafeMessages } from "@/lib/customer-safe-errors"
import { usePlatformAccess } from "@/lib/platform-access-store"

function BillingSuccessPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { syncTenantStatus } = usePlatformAccess()
  const tenantId = searchParams.get("tenant")
  const planId = searchParams.get("plan")
  const checkoutPath = tenantId ? `/signup/checkout?tenant=${tenantId}${planId ? `&plan=${planId}` : ""}` : "/signup"

  const [status, setStatus] = useState<"checking" | "active" | "pending" | "error">("checking")
  const [error, setError] = useState<string | null>(null)
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    if (!tenantId) {
      setStatus("error")
      setError(customerSafeMessages.missingBillingReference)
      return
    }

    let cancelled = false
    let timeout: ReturnType<typeof setTimeout> | undefined
    let attempts = 0

    const confirmStatus = async () => {
      const result = await syncTenantStatus(tenantId)
      if (cancelled) return

      if (!result.ok || !result.tenant) {
        console.error("[billing.success.ui] status sync failed", {
          tenantId,
          error: result.error ?? customerSafeMessages.billingConfirmationFailed,
        })
        setStatus("error")
        setError(result.error ?? customerSafeMessages.billingConfirmationFailed)
        return
      }

      if (result.tenant.subscriptionStatus === "Active" && result.tenant.paymentStatus === "Paid") {
        setStatus("active")
        setError(null)
        return
      }

      attempts += 1
      if (attempts >= 8) {
        setStatus("pending")
        return
      }

      timeout = setTimeout(confirmStatus, 1500)
    }

    setStatus("checking")
    setError(null)
    void confirmStatus()

    return () => {
      cancelled = true
      if (timeout) clearTimeout(timeout)
    }
  }, [syncTenantStatus, tenantId])

  const continueToSetup = () => {
    console.info("[billing.success.ui] continue setup clicked", {
      tenantId,
      planId,
      status,
    })

    if (status === "active") {
      setNavigating(true)
      router.push("/setup")
      return
    }

    if (status === "checking") {
      return
    }

    setNavigating(true)
    router.push(checkoutPath)
  }

  return (
    <div className="app-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[900px] items-center">
        <div className="section-card w-full rounded-[32px] p-10 md:p-12">
          <div className="space-y-6">
            <div className="space-y-5">
              <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">
                {status === "active" ? "Subscription active" : "Payment confirmation"}
              </span>
              <h1 className="font-serif text-[2.6rem] leading-[1.01] tracking-[-0.045em] text-white md:text-[3.1rem]">
                {status === "active" ? "Your workspace is ready." : "We’re confirming the payment now."}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                {status === "active"
                  ? `The subscription has been confirmed and your firm workspace is now active on ${saasAppConfig.appUrl}.`
                  : "Stripe has returned successfully, but workspace access stays blocked until payment confirmation is recorded on the server."}
              </p>
            </div>

            {error ? (
              <SetupStatusNotice tone="warning" title="We couldn't complete this step" description={error} />
            ) : null}

            {status === "pending" ? (
              <SetupStatusNotice
                title="Payment is still being confirmed"
                description="If the charge has already gone through, the confirmation may still be finishing in the background. Please refresh this page in a few seconds, or return to billing if the delay continues."
              />
            ) : null}

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_55px_rgba(8,13,24,0.14)]">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] border border-white/8 bg-slate-950/22 px-4 py-4 text-sm text-slate-300">
                  Access opens only after payment confirmation
                </div>
                <div className="rounded-[20px] border border-white/8 bg-slate-950/22 px-4 py-4 text-sm text-slate-300">
                  Setup continues directly into your own workspace flow
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={continueToSetup}
                disabled={status === "checking" || navigating}
                className="rounded-full bg-[var(--app-brand-primary)] px-5 py-3.5 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "checking"
                  ? "Confirming payment..."
                  : navigating
                    ? status === "active"
                      ? "Opening setup..."
                      : "Returning to billing..."
                    : status === "active"
                      ? "Continue workspace setup"
                      : "Return to billing"}
              </button>
              <Link
                href={checkoutPath}
                className="rounded-full border border-white/12 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/28"
              >
                Return to billing
              </Link>
              <Link
                href="https://www.cbideal.nl/contact"
                className="rounded-full border border-white/12 px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-white/28 hover:text-white"
              >
                Contact support
              </Link>
            </div>
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
