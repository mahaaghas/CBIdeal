"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { AppBrand } from "@cbideal/ui/components/app-brand"
import { getSaasPlan, saasAppConfig } from "@cbideal/config"
import { useBranding } from "@/lib/branding-store"
import { usePlatformAccess } from "@/lib/platform-access-store"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { branding } = useBranding()
  const { login, startDemoSession } = usePlatformAccess()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestedPlan = searchParams.get("plan")
  const selectedPlanId =
    requestedPlan === "solo" || requestedPlan === "team" || requestedPlan === "business" ? requestedPlan : null
  const selectedPlan = selectedPlanId ? getSaasPlan(selectedPlanId) : null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const result = await login(email, password)
    if (!result.ok) {
      setError(result.error ?? "Unable to sign in.")
      setSubmitting(false)
      return
    }

    router.push(result.nextPath ?? "/dashboard")
  }

  const startDemo = () => {
    startDemoSession()
    router.push("/dashboard")
  }

  return (
    <div className="app-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1220px] gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="section-card flex flex-col justify-between rounded-[32px] p-8 md:p-10">
          <div className="space-y-7">
            <AppBrand name={branding.companyName} logoUrl={branding.companyLogoUrl} darkLogoUrl={branding.darkLogoUrl} />
            <div className="space-y-4.5">
              <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">Workspace access</span>
              <h1 className="font-serif text-[2.5rem] leading-[1.02] tracking-[-0.04em] text-white md:text-[3.2rem]">
                One clear place to sign in, start, or explore.
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300">
                Existing teams can sign in immediately. New firms can start a Solo, Team, or Business workspace, open the demo environment, or move into a separate Enterprise contact route.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold text-white">Existing workspace</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Sign in with the credentials created during onboarding and continue inside your firm workspace.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold text-white">Self-serve onboarding</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Solo, Team, and Business move from account creation to billing and live workspace access in one direct path.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold text-white">Instant demo</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Open the shared demonstration workspace immediately, without creating a live account.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm font-semibold text-white">Enterprise setup</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  Larger structures stay on a more deliberate path so scope, rollout, and access can be configured properly.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startDemo}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                View Demo
              </button>
              <Link
                href="/signup"
                className="rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30"
              >
                Create workspace
              </Link>
              <Link
                href={saasAppConfig.enterprisePath}
                className="rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/30 hover:text-white"
              >
                Contact us
              </Link>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Solo, Team, and Business are self-serve. Enterprise stays separate so rollout and support can be handled more deliberately.
            </p>
          </div>
        </section>

        <section className="section-card rounded-[32px] p-8 md:p-10">
          <div className="mx-auto max-w-[560px] space-y-8">
            <div className="space-y-3">
              <span className="eyebrow">Sign in</span>
              <h2 className="font-serif text-[2.1rem] leading-[1.06] tracking-[-0.04em] text-white">
                Sign in to your account
              </h2>
              <p className="text-sm leading-7 text-slate-300">
                {selectedPlan
                  ? `Returning from pricing for the ${selectedPlan.name} plan. You can continue to onboarding or sign in if your workspace already exists.`
                  : "Use the credentials created during onboarding to enter your workspace."}
              </p>
            </div>

            {selectedPlan ? (
              <div className="rounded-[24px] border border-[var(--app-brand-primary)]/20 bg-[var(--app-brand-surface-tint)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{selectedPlan.name} is ready to start</p>
                    <p className="mt-2 text-sm leading-7 text-slate-200">
                      Continue into self-serve onboarding to create the admin account, company workspace, and billing setup for this plan.
                    </p>
                  </div>
                  <Link
                    href={`/signup?plan=${selectedPlan.id}`}
                    className="rounded-full bg-[var(--app-brand-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)]"
                  >
                    Start onboarding
                  </Link>
                </div>
              </div>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-100">
                  Email address
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

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-100">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-13 w-full rounded-2xl border border-white/12 bg-slate-950/40 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[var(--app-brand-primary)]"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-[#f04f4f]/30 bg-[#f04f4f]/10 px-4 py-3 text-sm text-[#f9c7c7]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-[var(--app-brand-primary)] px-5 py-3.5 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
              <p className="text-sm font-semibold text-white">New to the platform?</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Create a Solo, Team, or Business workspace, open the demo environment first, or move through a direct Enterprise contact route.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  href={selectedPlan ? `/signup?plan=${selectedPlan.id}` : "/signup"}
                  className="rounded-full border border-white/12 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:border-white/28"
                >
                  Start onboarding
                </Link>
                <button
                  type="button"
                  onClick={startDemo}
                  className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/28 hover:text-white"
                >
                  Open demo workspace
                </button>
                <Link
                  href={saasAppConfig.enterprisePath}
                  className="rounded-full border border-white/12 px-4 py-2.5 text-center text-sm font-semibold text-slate-300 transition hover:border-white/28 hover:text-white sm:col-span-2"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="app-shell min-h-screen" />}>
      <LoginPageContent />
    </Suspense>
  )
}
