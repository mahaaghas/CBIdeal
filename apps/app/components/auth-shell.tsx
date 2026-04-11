import type { ReactNode } from "react"
import Link from "next/link"
import { AppBrand } from "@cbideal/ui/components/app-brand"
import { cn } from "@cbideal/ui/lib/utils"

type AuthShellProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  sideTitle?: string
  sideDescription?: string
  className?: string
}

const defaultSeatSummary = [
  {
    label: "Solo",
    value: "1 user, 5 client accounts",
  },
  {
    label: "Team",
    value: "Up to 3 users, 20 client accounts",
  },
  {
    label: "Business",
    value: "Up to 8 users, 60 client accounts",
  },
  {
    label: "Enterprise",
    value: "Custom team setup",
  },
]

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  sideTitle = "Secure workspace access",
  sideDescription = "Account confirmation, password recovery, and workspace invitations all stay inside one controlled CBI Deal environment.",
  className,
}: AuthShellProps) {
  return (
    <div className="app-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1220px] gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="section-card flex flex-col justify-between rounded-[32px] p-8 md:p-10">
          <div className="space-y-7">
            <AppBrand name="CBI Deal" subtitle="Private advisory platform" />
            <div className="space-y-4">
              <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">{eyebrow}</span>
              <h1 className="font-serif text-[2.45rem] leading-[1.03] tracking-[-0.045em] text-white md:text-[3rem]">
                {sideTitle}
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300">{sideDescription}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {defaultSeatSummary.map((item) => (
                <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.05] px-5 py-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                  <p className="mt-3 text-base font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Invite team members and assign available seats from your workspace settings. Need more seats? Upgrade your plan to expand workspace access.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/28"
              >
                Go to login
              </Link>
              <Link
                href="https://www.cbideal.nl/contact"
                className="rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/28 hover:text-white"
              >
                Contact support
              </Link>
            </div>
          </div>
        </section>

        <section className={cn("section-card rounded-[32px] p-8 md:p-10", className)}>
          <div className="mx-auto max-w-[620px] space-y-8">
            <div className="space-y-4">
              <span className="eyebrow">{eyebrow}</span>
              <div className="space-y-3">
                <h2 className="font-serif text-[2.15rem] leading-[1.05] tracking-[-0.045em] text-white">{title}</h2>
                <p className="max-w-2xl text-sm leading-7 text-slate-300">{description}</p>
              </div>
            </div>
            {children}
          </div>
        </section>
      </div>
    </div>
  )
}

type AuthAction = {
  label: string
  href: string
  tone?: "primary" | "secondary"
}

type AuthStateCardProps = {
  title: string
  description: string
  note?: string
  actions?: AuthAction[]
  children?: ReactNode
}

export function AuthStateCard({ title, description, note, actions, children }: AuthStateCardProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_22px_52px_rgba(8,13,24,0.14)]">
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="font-serif text-[1.75rem] leading-[1.08] tracking-[-0.035em] text-white">{title}</h3>
          <p className="text-base leading-8 text-slate-300">{description}</p>
        </div>

        {children}

        {note ? <p className="text-sm leading-7 text-slate-400">{note}</p> : null}

        {actions?.length ? (
          <div className="flex flex-wrap gap-3 pt-1">
            {actions.map((action) => (
              <Link
                key={`${action.href}-${action.label}`}
                href={action.href}
                className={
                  action.tone === "secondary"
                    ? "rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/28"
                    : "rounded-full bg-[var(--app-brand-primary)] px-5 py-3 text-sm font-semibold text-[var(--app-brand-on-primary)] transition hover:bg-[var(--app-brand-primary-strong)]"
                }
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
