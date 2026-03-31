"use client"

import { useMemo } from "react"
import Link from "next/link"
import { CrmPageHeader } from "@cbideal/ui"
import { usePlatformAccess } from "@/lib/platform-access-store"

export default function InternalSignupsPage() {
  const { getInternalSignupRecords } = usePlatformAccess()
  const signups = getInternalSignupRecords()
  const metrics = useMemo(
    () => ({
      total: signups.length,
      active: signups.filter((item) => item.subscriptionStatus === "Active").length,
      pending: signups.filter((item) => item.paymentStatus === "Pending").length,
      enterprise: signups.filter((item) => item.source === "Enterprise").length,
    }),
    [signups],
  )

  return (
    <div className="space-y-6">
      <CrmPageHeader
        eyebrow="Internal subscriptions"
        title="Track SaaS signups separately from leads"
        description="This register shows plan selection, payment state, and account activation for the SaaS onboarding flow. It is internal only and separate from the firm-facing workspace."
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total signups", value: metrics.total },
          { label: "Active subscriptions", value: metrics.active },
          { label: "Pending payment", value: metrics.pending },
          { label: "Enterprise reviews", value: metrics.enterprise },
        ].map((item) => (
          <div key={item.label} className="section-card rounded-[26px] p-6">
            <p className="text-sm text-slate-300">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="section-card rounded-[30px] p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Signup register</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Company name, chosen plan, signup date, payment state, and activation status.
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/8">
          <div className="grid grid-cols-[1.2fr_0.8fr_0.95fr_0.95fr_1fr] gap-4 border-b border-white/8 bg-slate-950/40 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <span>Company</span>
            <span>Plan</span>
            <span>Signup date</span>
            <span>Payment</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-white/8">
            {signups.length ? (
              signups.map((signup) => (
                <div key={signup.id} className="grid grid-cols-[1.2fr_0.8fr_0.95fr_0.95fr_1fr] gap-4 px-5 py-4 text-sm text-slate-200">
                  <div>
                    <p className="font-semibold text-white">{signup.companyName}</p>
                    <p className="mt-1 text-slate-400">{signup.userEmail}</p>
                  </div>
                  <span>{signup.planId}</span>
                  <span>{new Date(signup.signupDate).toLocaleDateString("en-GB")}</span>
                  <span>{signup.paymentStatus}</span>
                  <span>{signup.subscriptionStatus}</span>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-sm text-slate-300">
                No SaaS signups have been created yet. Create one through the self-serve onboarding flow on the app domain.
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/signup" className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/28">
            Open signup flow
          </Link>
          <Link href="/demo" className="rounded-full border border-white/12 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-white/28 hover:text-white">
            Open demo access
          </Link>
        </div>
      </div>
    </div>
  )
}
