"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { saasAppConfig } from "@cbideal/config"
import { usePlatformAccess } from "@/lib/platform-access-store"

type BillingRuntimePayload = {
  hardFail?: boolean
  issues?: string[]
}

function BillingSuccessPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { syncTenantStatus } = usePlatformAccess()
  const tenantId = searchParams.get("tenant")
  const planId = searchParams.get("plan")
  const sandbox = searchParams.get("sandbox") === "1"
  const checkoutPath = tenantId ? `/signup/checkout?tenant=${tenantId}${planId ? `&plan=${planId}` : ""}` : "/signup"
  const [status, setStatus] = useState<"checking" | "active" | "pending" | "error">("checking")
  const [error, setError] = useState<string | null>(null)
  const [navigating, setNavigating] = useState(false)
  const [hardFailError, setHardFailError] = useState<string | null>(null)

  useEffect(() => {
    if (!sandbox) return
    console.error("[billing.success.ui] sandbox query detected in production-style flow", {
      tenantId,
      planId,
      sandbox,
    })
    setStatus("error")
    setError("The old sandbox success path is invalid. Workspace activation requires confirmed Stripe payment.")
  }, [planId, sandbox, tenantId])

  useEffect(() => {
    let cancelled = false

    void fetch("/api/billing/runtime", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as BillingRuntimePayload
        if (cancelled) return
        if (payload.hardFail) {
          const message =
            payload.issues?.join(" ") ??
            "Billing is unavailable because Stripe or workspace storage is not configured."
          console.error("[billing.success.ui] hard fail", payload)
          setHardFailError(message)
          setStatus("error")
        }
      })
      .catch((runtimeError) => {
        if (cancelled) return
        const message =
          runtimeError instanceof Error ? runtimeError.message : "Unable to verify the billing runtime."
        console.error("[billing.success.ui] runtime check failed", runtimeError)
        setHardFailError(message)
        setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (sandbox || hardFailError) return
    if (!tenantId) {
      setStatus("error")
      setError("The billing confirmation is missing a workspace reference.")
      return
    }

    let cancelled = false
    let timeout: ReturnType<typeof setTimeout> | undefined
    let attempts = 0

    const confirmStatus = async () => {
      console.info("[billing.success.ui] checking workspace activation status", { tenantId })
      const result = await syncTenantStatus(tenantId)
      if (cancelled) return

      if (!result.ok || !result.tenant) {
        console.error("[billing.success.ui] status sync failed", {
          tenantId,
          error: result.error ?? "We could not confirm the Stripe payment yet.",
        })
        setStatus("error")
        setError(result.error ?? "We could not confirm the Stripe payment yet.")
        return
      }

      if (result.tenant.subscriptionStatus === "Active" && result.tenant.paymentStatus === "Paid") {
        setStatus("active")
        setError(null)
        return
      }

      attempts += 1
      if (attempts >= 8) {
        console.warn("[billing.success.ui] activation still pending after retries", { tenantId })
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
  }, [hardFailError, sandbox, syncTenantStatus, tenantId])

  const continueToSetup = () => {
    console.info("[billing.success.ui] continue setup clicked", {
      tenantId,
      planId,
      status,
      hardFailError,
    })
    if (status === "active") {
      setNavigating(true)
      router.push("/setup")
      return
    }

    if (status === "checking") {
      console.error("[billing.success.ui] continue setup blocked while status is still checking", {
        tenantId,
        status,
        hardFailError,
      })
      return
    }

    console.warn("[billing.success.ui] routing back to checkout because workspace is not active", {
      tenantId,
      planId,
      status,
    })
    setNavigating(true)
    router.push(checkoutPath)
  }

  return (
    <div className="app-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[860px] items-center">
        <div className="section-card w-full rounded-[32px] p-10 md:p-12">
          <div className="space-y-5">
            <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">
              {status === "active" ? "Subscription active" : "Payment confirmation"}
            </span>
            <h1 className="font-serif text-[2.5rem] leading-[1.02] tracking-[-0.04em] text-white md:text-[3rem]">
              {status === "active" ? "Your workspace is ready." : "We are confirming the Stripe payment."}
            </h1>
            <p className="text-base leading-8 text-slate-300">
              {status === "active"
                ? `The subscription has been confirmed and the firm workspace is now active on ${saasAppConfig.appUrl}.`
                : "Stripe has returned successfully, but workspace access stays blocked until the webhook confirms the payment on the server."}
            </p>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-[#f04f4f]/30 bg-[#f04f4f]/10 px-4 py-3 text-sm text-[#f9c7c7]">
              {error}
            </div>
          ) : null}

          {hardFailError ? (
            <div className="mt-6 rounded-2xl border border-[#f04f4f]/35 bg-[#f04f4f]/12 px-4 py-3 text-sm text-[#f9c7c7]">
              Billing is blocked in this environment. {hardFailError}
            </div>
          ) : null}

          {status === "pending" ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-300">
              Payment is still being confirmed. If Stripe already charged the card, the webhook may still be processing. Refresh this page in a few seconds, or contact support if the delay continues.
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
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
                    : "Returning to checkout..."
                  : status === "active"
                    ? "Continue workspace setup"
                    : "Return to checkout"}
            </button>
            <Link
              href={checkoutPath}
              className="rounded-full border border-white/12 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/28"
            >
              Return to billing
            </Link>
            <Link
              href="/dashboard"
              className={`rounded-full border border-white/12 px-5 py-3.5 text-sm font-semibold transition hover:border-white/28 ${status === "active" ? "text-white" : "pointer-events-none text-slate-500 opacity-60"}`}
            >
              Open workspace now
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
