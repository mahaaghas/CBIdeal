"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useMemo, useState } from "react"
import { formatPlanAmount, getSaasPlan, isSelfServePlan, saasAppConfig, saasPlans, type SelfServePlanId } from "@cbideal/config"
import { AppBrand } from "@cbideal/ui/components/app-brand"
import { useBranding } from "@/lib/branding-store"
import { getSelfServeCheckoutUrl, usePlatformAccess } from "@/lib/platform-access-store"

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { branding } = useBranding()
  const { registerWorkspace, ready } = usePlatformAccess()
  const requestedPlan = searchParams.get("plan")
  const initialPlan = requestedPlan && isSelfServePlan(requestedPlan) ? requestedPlan : "starter"
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [planId, setPlanId] = useState<SelfServePlanId>(initialPlan === "growth" ? "growth" : "starter")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const activePlan = useMemo(() => getSaasPlan(planId), [planId])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
      setError(result.error ?? "We could not create the workspace.")
      setSubmitting(false)
      return
    }

    router.push(getSelfServeCheckoutUrl(planId, result.tenantId))
  }

  return (
    <div className="app-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1240px] gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <section className="section-card rounded-[32px] p-8 md:p-10">
          <div className="space-y-7">
            <AppBrand
              name={branding.companyName}
              subtitle="Self-serve onboarding"
              logoUrl={branding.companyLogoUrl}
              darkLogoUrl={branding.darkLogoUrl}
            />
            <div className="space-y-4">
              <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">Step 1</span>
              <h1 className="font-serif text-[2.4rem] leading-[1.04] tracking-[-0.04em] text-white md:text-[3rem]">
                Create your firm workspace.
              </h1>
              <p className="text-base leading-8 text-slate-300">
                Starter and Growth plans move through a clean self-serve flow: account creation, company setup, billing, and direct access to app.cbideal.nl.
              </p>
            </div>
            <div className="space-y-3">
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold text-white">What happens next</p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-300">
                  <li>1. Create the admin account for your firm</li>
                  <li>2. Confirm the company name and chosen plan</li>
                  <li>3. Continue to secure billing</li>
                  <li>4. Land inside your own workspace</li>
                </ul>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold text-white">Need a broader setup?</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Enterprise remains sales-led so larger teams can be configured deliberately and rolled out with the right structure.
                </p>
                <Link
                  href={saasAppConfig.enterprisePath}
                  className="mt-4 inline-flex rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/28"
                >
                  Request enterprise setup
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-card rounded-[32px] p-8 md:p-10">
          <div className="mx-auto max-w-[620px] space-y-8">
            <div className="space-y-3">
              <span className="eyebrow">Workspace onboarding</span>
              <h2 className="font-serif text-[2.1rem] leading-[1.06] tracking-[-0.04em] text-white">
                Set up the account that will own the workspace
              </h2>
              <p className="text-sm leading-7 text-slate-300">
                This creates the first admin user, the company record, and the subscription context that billing will activate.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-brand-primary)]/20 bg-[var(--app-brand-surface-tint)] px-4 py-2 text-sm text-slate-100">
                <span className="app-pill rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
                  Plan
                </span>
                <span>{activePlan.name} is preselected from the pricing page.</span>
              </div>
            </div>

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
                <div className="grid gap-4 md:grid-cols-2">
                  {saasPlans
                    .filter((plan) => plan.id !== "enterprise")
                    .map((plan) => {
                      const selected = planId === plan.id
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setPlanId(plan.id as SelfServePlanId)}
                          className={`rounded-[24px] border p-5 text-left transition ${selected ? "border-[var(--app-brand-primary)] bg-[var(--app-brand-surface-tint)]" : "border-white/10 bg-white/6 hover:border-white/24"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-lg font-semibold text-white">{plan.name}</p>
                              <p className="mt-1 text-sm text-slate-300">{plan.description}</p>
                            </div>
                            <span className="app-pill rounded-full px-3 py-1.5 text-xs font-semibold">
                              {formatPlanAmount(plan)}
                            </span>
                          </div>
                          <div className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
                            <p>{plan.internalSeatLimit} internal users</p>
                            <p>{plan.clientAccountLimit} client accounts</p>
                          </div>
                        </button>
                      )
                    })}
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-[#f04f4f]/30 bg-[#f04f4f]/10 px-4 py-3 text-sm text-[#f9c7c7]">
                  {error}
                </div>
              ) : null}

              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold text-white">Selected plan</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{activePlan.name}</p>
                    <p className="mt-1 text-sm leading-7 text-slate-300">{activePlan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-white">{formatPlanAmount(activePlan)}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">per month</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!ready || submitting}
                className="w-full rounded-full bg-[var(--app-brand-primary)] px-5 py-3.5 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating workspace…" : "Continue to billing"}
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
