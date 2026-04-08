"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useState } from "react"
import { getSaasPlan, saasAppConfig, saasPlans, type SelfServePlanId } from "@cbideal/config"
import { AppBrand } from "@cbideal/ui/components/app-brand"
import { SetupStatusNotice } from "@/components/setup-status-notice"
import { useBranding } from "@/lib/branding-store"
import { customerSafeMessages } from "@/lib/customer-safe-errors"
import { getSelfServeCheckoutUrl, usePlatformAccess } from "@/lib/platform-access-store"

type BillingRuntimePayload = {
  hardFail?: boolean
  userMessage?: string | null
}

function renderPlanPrice(plan: { monthlyPrice: number | null }) {
  return plan.monthlyPrice === null ? "Custom" : `$${plan.monthlyPrice}`
}

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { branding } = useBranding()
  const { registerWorkspace, ready } = usePlatformAccess()
  const requestedPlan = searchParams.get("plan")
  const initialPlan =
    requestedPlan === "solo" || requestedPlan === "team" || requestedPlan === "business" ? requestedPlan : "solo"

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [planId, setPlanId] = useState<SelfServePlanId>(initialPlan)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(true)
  const [setupBlockedMessage, setSetupBlockedMessage] = useState<string | null>(null)

  const activePlan = useMemo(() => getSaasPlan(planId), [planId])

  const checkSetupAvailability = async () => {
    setCheckingAvailability(true)

    try {
      const response = await fetch("/api/billing/runtime", { cache: "no-store" })
      const payload = (await response.json()) as BillingRuntimePayload
      setSetupBlockedMessage(payload.hardFail ? payload.userMessage ?? customerSafeMessages.setupUnavailable : null)
    } catch (runtimeError) {
      console.error("[signup.ui] runtime check failed", runtimeError)
      setSetupBlockedMessage(customerSafeMessages.setupUnavailable)
    } finally {
      setCheckingAvailability(false)
    }
  }

  useEffect(() => {
    void checkSetupAvailability()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (checkingAvailability || setupBlockedMessage) {
      setError(setupBlockedMessage ?? customerSafeMessages.setupUnavailable)
      return
    }

    setSubmitting(true)
    setError(null)

    const result = await registerWorkspace({
      fullName,
      email,
      password,
      companyName,
      planId,
    })

    if (!result.ok || !result.tenantId) {
      setError(result.error ?? customerSafeMessages.setupUnavailable)
      setSubmitting(false)
      return
    }

    router.push(getSelfServeCheckoutUrl(planId, result.tenantId))
  }

  return (
    <div className="app-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1280px] gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <section className="section-card rounded-[32px] p-8 md:p-10 lg:p-11">
          <div className="space-y-8">
            <AppBrand
              name={branding.companyName}
              subtitle="Self-serve onboarding"
              logoUrl={branding.companyLogoUrl}
              darkLogoUrl={branding.darkLogoUrl}
            />

            <div className="space-y-5">
              <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">Step 1</span>
              <h1 className="font-serif text-[2.6rem] leading-[1.01] tracking-[-0.045em] text-white md:text-[3.25rem]">
                Create your firm workspace.
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300">
                Set up the admin account, confirm the workspace plan, and move into secure billing before access is activated on {saasAppConfig.appUrl}.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_55px_rgba(8,13,24,0.14)]">
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">What happens next</p>
                  <p className="text-sm leading-7 text-slate-300">
                    The workspace is prepared first, then billing confirms the subscription before access opens.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    "Create the first admin account for the firm",
                    "Confirm the company name and selected plan",
                    "Move into secure Stripe checkout",
                    "Continue into workspace setup after payment confirmation",
                  ].map((item, index) => (
                    <div key={item} className="flex items-start gap-3 rounded-[20px] border border-white/8 bg-slate-950/22 px-4 py-4">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-white/12 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-7 text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SetupStatusNotice
              title="Need a broader rollout?"
              description="Enterprise stays contact-led so implementation scope, access structure, and rollout support can be agreed before any workspace is provisioned."
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
          <div className="mx-auto max-w-[680px] space-y-8">
            <div className="space-y-4">
              <span className="eyebrow">Workspace onboarding</span>
              <h2 className="font-serif text-[2.25rem] leading-[1.04] tracking-[-0.045em] text-white">
                Set up the account that will own the workspace
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                This creates the first admin user, the company record, and the subscription context that billing will activate.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-brand-primary)]/20 bg-[var(--app-brand-surface-tint)] px-4 py-2 text-sm text-slate-100">
                <span className="app-pill rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
                  Plan
                </span>
                <span>{activePlan.name} is preselected from the pricing page.</span>
              </div>
            </div>

            {setupBlockedMessage ? (
              <SetupStatusNotice
                tone="warning"
                title="Setup is temporarily unavailable"
                description={setupBlockedMessage}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => void checkSetupAvailability()}
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

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-slate-100">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="h-13 w-full rounded-2xl border border-white/12 bg-slate-950/40 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--app-brand-primary)]"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium text-slate-100">
                    Company name
                  </label>
                  <input
                    id="companyName"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    className="h-13 w-full rounded-2xl border border-white/12 bg-slate-950/40 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--app-brand-primary)]"
                    placeholder="Your firm"
                    autoComplete="organization"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-100">
                    Work email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-13 w-full rounded-2xl border border-white/12 bg-slate-950/40 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--app-brand-primary)]"
                    placeholder="name@firm.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-100">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-13 w-full rounded-2xl border border-white/12 bg-slate-950/40 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--app-brand-primary)]"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-100">Choose a plan</p>
                <div className="grid gap-4 xl:grid-cols-3">
                  {saasPlans
                    .filter((plan) => plan.id !== "enterprise")
                    .map((plan) => {
                      const selected = planId === plan.id
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setPlanId(plan.id as SelfServePlanId)}
                          className={`rounded-[26px] border p-5 text-left shadow-[0_18px_44px_rgba(8,13,24,0.12)] transition ${selected ? "border-[var(--app-brand-primary)] bg-[var(--app-brand-surface-tint)]" : "border-white/10 bg-white/[0.05] hover:border-white/24 hover:bg-white/[0.08]"}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <p className="text-lg font-semibold text-white">{plan.name}</p>
                              <p className="text-sm leading-7 text-slate-300">{plan.description}</p>
                            </div>
                            <div className="rounded-[18px] border border-white/10 bg-slate-950/34 px-3.5 py-2.5 text-right">
                              <p className="text-lg font-semibold leading-none text-white">{renderPlanPrice(plan)}</p>
                              <p className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">monthly</p>
                            </div>
                          </div>
                          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                            <p>Up to {plan.internalSeatLimit} internal users</p>
                            <p>Up to {plan.clientAccountLimit} client accounts</p>
                          </div>
                        </button>
                      )
                    })}
                </div>
              </div>

              {error ? (
                <SetupStatusNotice tone="warning" title="We couldn't continue setup" description={error} />
              ) : null}

              <div className="rounded-[26px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_18px_44px_rgba(8,13,24,0.12)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Selected plan</p>
                    <p className="mt-3 text-xl font-semibold text-white">{activePlan.name}</p>
                    <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">{activePlan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[2rem] font-semibold text-white">{renderPlanPrice(activePlan)}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">monthly</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-white/8 bg-slate-950/22 px-4 py-4 text-sm text-slate-300">
                    Up to {activePlan.internalSeatLimit} internal users
                  </div>
                  <div className="rounded-[20px] border border-white/8 bg-slate-950/22 px-4 py-4 text-sm text-slate-300">
                    Up to {activePlan.clientAccountLimit} client accounts
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!ready || submitting || checkingAvailability || Boolean(setupBlockedMessage)}
                className="w-full rounded-full bg-[var(--app-brand-primary)] px-5 py-3.5 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkingAvailability
                  ? "Checking setup..."
                  : submitting
                    ? "Preparing workspace..."
                    : setupBlockedMessage
                      ? "Setup temporarily unavailable"
                      : "Continue to billing"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="app-shell min-h-screen" />}>
      <SignupPageContent />
    </Suspense>
  )
}
