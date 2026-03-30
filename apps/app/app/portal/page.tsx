import Link from "next/link"
import { CreditCard, FileText, Upload } from "lucide-react"

const steps = [
  { label: "Apply", state: "complete" },
  { label: "Upload", state: "complete" },
  { label: "Pay", state: "active" },
  { label: "Review", state: "upcoming" },
  { label: "Approved", state: "upcoming" },
] as const

export default function ClientPortalPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-[2.9rem] leading-[1.02] tracking-[-0.045em] text-white md:text-[3.5rem]">
            Welcome back, Ahmed
          </h1>
          <span className="app-pill rounded-full px-4 py-1.5 text-sm font-semibold">Private client</span>
        </div>
        <p className="max-w-3xl text-[1.05rem] text-slate-200/82">
          Track your application progress, payment stages, and requested documents from one clear client view.
        </p>
      </div>

      <section className="app-surface rounded-[26px] px-7 py-7 md:px-8 md:py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="font-serif text-[2.2rem] tracking-[-0.035em] text-white">Application Progress</h2>
          </div>

          <div className="relative">
            <div className="app-step-rail absolute left-0 right-0 top-6 rounded-full" />
            <div className="app-step-rail-fill absolute left-0 top-6 h-1 w-[38%] rounded-full" />

            <div className="relative grid gap-6 md:grid-cols-5">
              {steps.map((step, index) => {
                const active = step.state === "active" || step.state === "complete"
                return (
                  <div key={step.label} className="space-y-4">
                    <div
                      className={`app-step-circle flex size-12 items-center justify-center rounded-full text-lg font-semibold ${active ? "app-step-circle-active" : ""}`}
                    >
                      {step.state === "complete" ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12.5l4.2 4.2L19 7.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <p className={`text-lg font-semibold ${active ? "text-white" : "text-slate-400"}`}>{step.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="app-kpi-icon flex size-12 items-center justify-center rounded-[18px] text-white">
                <CreditCard className="size-5" />
              </div>
              <div>
                <h2 className="font-serif text-[2rem] tracking-[-0.03em] text-white">Payment Status</h2>
                <p className="mt-1 text-base text-slate-300">Dominica citizenship route</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="app-surface-soft rounded-[18px] px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[1.05rem] font-semibold text-white">Advisory retainer</p>
                    <p className="text-sm text-slate-300">Paid on Mar 22, 2026</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="app-status-pill app-status-green">Paid</span>
                    <p className="text-[1.4rem] font-semibold text-white">$9,000</p>
                  </div>
                </div>
              </div>

              <div className="app-surface-soft rounded-[18px] px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[1.05rem] font-semibold text-white">Government contribution stage</p>
                    <p className="text-sm text-slate-300">Pending verification</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="app-status-pill app-status-amber">Pending</span>
                    <p className="text-[1.4rem] font-semibold text-white">$200,000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/8 pt-5">
              <div className="flex items-center justify-between">
                <p className="font-serif text-[2rem] tracking-[-0.03em] text-white">Total</p>
                <p className="font-serif text-[2.2rem] tracking-[-0.04em] text-white">$209,000</p>
              </div>
            </div>

            <Link href="/portal/payments" className="block w-full rounded-2xl bg-[#5b759b] px-5 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-[#6884ad]">
              Complete Payment
            </Link>
          </div>
        </section>

        <section className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="app-kpi-icon flex size-12 items-center justify-center rounded-[18px] text-white">
                <FileText className="size-5" />
              </div>
              <div>
                <h2 className="font-serif text-[2rem] tracking-[-0.03em] text-white">Documents</h2>
                <p className="mt-1 text-base text-slate-300">2 of 4 uploaded</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: "Passport Copy", note: "Uploaded Mar 18, 2026", tone: "green", action: null },
                { name: "Marriage Certificate", note: "Under review", tone: "amber", action: null },
                { name: "Proof of Address", note: "Still required", tone: "amber", action: "Upload" },
                { name: "Source of Funds Evidence", note: "Still required", tone: "amber", action: "Upload" },
              ].map((item) => (
                <div key={item.name} className="app-surface-soft rounded-[18px] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[1.05rem] font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-slate-300">{item.note}</p>
                    </div>
                    {item.action ? (
                      <Link href="/portal/documents" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/5">
                        {item.action}
                      </Link>
                    ) : (
                      <span className={item.tone === "green" ? "app-status-pill app-status-green" : "app-status-pill app-status-amber"}>
                        {item.tone === "green" ? "Uploaded" : "Pending"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Link href="/portal/documents" className="app-upload-zone block rounded-[20px] px-6 py-10 text-center transition-colors hover:bg-white/[0.03]">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white/5 text-slate-200">
                <Upload className="size-7" />
              </div>
              <p className="mt-5 text-lg font-semibold text-white">Drop files here or click to upload</p>
              <p className="mt-2 text-sm text-slate-300">Accepted formats: PDF, JPG, PNG</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
