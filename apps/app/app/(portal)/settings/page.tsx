"use client"

import Link from "next/link"
import { demoWorkspaceConfig, formatPlanAmount, getSaasPlan } from "@cbideal/config/saas"
import { BellRing, Building2, CreditCard, Database, Palette, Users } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { useBranding } from "@/lib/branding-store"
import { reminderSettings, workspace } from "@/lib/mock-data"
import { usePlatformAccess } from "@/lib/platform-access-store"

export default function SettingsPage() {
  const { branding } = useBranding()
  const { currentTenant, mode } = usePlatformAccess()
  const resolvedPlan = getSaasPlan(currentTenant?.planId ?? demoWorkspaceConfig.planId)

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Settings"
        title="Workspace settings arranged for clarity, billing visibility, and controlled automation."
        description="The settings area keeps identity, pricing, access limits, and reminder logic readable at a glance. Each section is separated clearly so the operational structure of the platform stays easy to understand."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmStatCard
          label="Internal team seats"
          value={`${currentTenant?.internalSeatLimit ?? workspace.internalSeats}`}
          note={
            currentTenant
              ? `${currentTenant.internalSeatCount} active of ${currentTenant.internalSeatLimit ?? "custom"} available`
              : "Capacity follows the active workspace plan."
          }
          trend="Operating users"
        />
        <CrmStatCard
          label="External client accounts"
          value={`${currentTenant?.clientAccountLimit ?? workspace.externalAccounts}`}
          note={
            currentTenant
              ? `${currentTenant.clientAccountCount} active of ${currentTenant.clientAccountLimit ?? "custom"} available`
              : "Client access capacity follows the active workspace plan."
          }
          trend="Portal access"
        />
        <CrmStatCard
          label="Current plan"
          value={resolvedPlan.name}
          note={
            resolvedPlan.id === "enterprise" ? "Custom pricing handled through direct advisory contact." : formatPlanAmount(resolvedPlan)
          }
          trend={currentTenant ? currentTenant.subscriptionStatus : "Plan-based billing"}
        />
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.14fr_0.86fr]">
        <div className="app-surface rounded-[26px] px-6 py-6 md:px-8 md:py-7">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Workspace structure</p>
              <h2 className="font-serif text-[2rem] tracking-[-0.035em] text-white">Identity, pricing, and limits</h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">
                The workspace model stays explicit here: one firm identity, separate internal and external account layers, and clear room for branding and workflow customisation.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="app-subtle-card-strong rounded-[22px] px-5 py-5">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-11 items-center justify-center rounded-[18px] bg-[var(--app-brand-surface-tint-strong)] text-white">
                    <Building2 className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white">Account</p>
                    <p className="text-base font-medium text-slate-100">{branding.companyName}</p>
                    <p className="text-sm leading-6 text-slate-300">Tenant ID: {currentTenant?.id ?? workspace.tenantId}</p>
                    <p className="text-sm leading-6 text-slate-300">
                      {mode === "demo"
                        ? "This is the shared demo environment."
                        : resolvedPlan
                          ? `${resolvedPlan.name} plan workspace`
                          : "Custom branding is available for this workspace."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="app-subtle-card-strong rounded-[22px] px-5 py-5">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-11 items-center justify-center rounded-[18px] bg-[var(--app-brand-surface-tint-strong)] text-white">
                    <CreditCard className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white">Billing</p>
                    <p className="text-base font-medium text-slate-100">{resolvedPlan.name}</p>
                    <p className="text-sm leading-6 text-slate-300">
                      {currentTenant
                        ? `This workspace currently sits on the ${resolvedPlan.name} plan with ${currentTenant.subscriptionStatus.toLowerCase()} subscription status.`
                        : resolvedPlan.id === "enterprise"
                          ? "Enterprise access is handled through a direct advisory route before provisioning."
                          : `${resolvedPlan.name} follows the live Stripe-backed public plan structure at ${formatPlanAmount(resolvedPlan)}.`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="app-subtle-card-strong rounded-[22px] px-5 py-5">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-white">Limits</p>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Client-specific workflows",
                        value: workspace.allowsClientSpecificWorkflows ? "Enabled" : "Not enabled",
                      },
                      {
                        label: "Internal seats",
                        value: currentTenant
                          ? `${currentTenant.internalSeatCount} active / ${currentTenant.internalSeatLimit ?? "custom"} allowed`
                          : `${workspace.internalSeats} active`,
                      },
                      {
                        label: "External accounts",
                        value: currentTenant
                          ? `${currentTenant.clientAccountCount} active / ${currentTenant.clientAccountLimit ?? "custom"} allowed`
                          : `${workspace.externalAccounts} active`,
                      },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                        <p className="mt-2 text-sm font-medium leading-6 text-slate-100">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="app-surface rounded-[26px] px-6 py-6 md:px-8 md:py-7">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Admin shortcuts</p>
              <h2 className="font-serif text-[2rem] tracking-[-0.035em] text-white">Common configuration routes</h2>
              <p className="text-sm leading-7 text-slate-300">
                Move quickly into the settings that change how the workspace looks, sends messages, and presents itself to clients.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "Branding and portal identity",
                  body: "Adjust company name, visual accents, logos, and the branded client-facing environment.",
                  href: "/settings/branding",
                  icon: Palette,
                },
                {
                  title: "Email and sender setup",
                  body: "Review mailbox details, sender identity, and connection settings for reminders and updates.",
                  href: "/settings/email",
                  icon: BellRing,
                },
                {
                  title: "Data import center",
                  body: "Import leads, clients, cases, quotations, and payments through one controlled migration flow.",
                  href: "/settings/data",
                  icon: Database,
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="app-subtle-card-strong block rounded-[22px] px-5 py-5 transition-colors hover:bg-white/[0.08]"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex size-11 items-center justify-center rounded-[18px] bg-[var(--app-brand-surface-tint-strong)] text-white">
                      <item.icon className="size-5" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-sm leading-6 text-slate-300">{item.body}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="app-button-secondary rounded-full">
                <Link href="/settings/branding">Open branding</Link>
              </Button>
              <Button asChild variant="outline" className="app-button-secondary rounded-full">
                <Link href="/settings/email">Open email settings</Link>
              </Button>
              <Button asChild variant="outline" className="app-button-secondary rounded-full">
                <Link href="/settings/data">Open data center</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CrmSectionCard
        title="Reminder and automation settings"
        description="Workflow-triggered reminders are grouped here with stronger contrast, clearer descriptions, and a quieter status treatment."
        className="app-surface"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reminderSettings.map((setting) => (
            <div key={setting.id} className="app-subtle-card-strong rounded-[22px] px-5 py-5">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-11 items-center justify-center rounded-[18px] bg-[var(--app-brand-surface-tint-strong)] text-white">
                    <BellRing className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white">{setting.name}</p>
                    <p className="text-sm leading-6 text-slate-300">{setting.trigger}</p>
                    <p className="text-sm leading-6 text-slate-300">{setting.audience}</p>
                  </div>
                </div>
                <CrmStatusBadge status={setting.status} />
              </div>
            </div>
          ))}
        </div>
      </CrmSectionCard>

      <CrmSectionCard
        title="Role model"
        description="Internal operators and external clients remain separate by design, while using one premium interface language."
        className="app-surface"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="app-subtle-card-strong rounded-[22px] px-5 py-5">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex size-11 items-center justify-center rounded-[18px] bg-[var(--app-brand-surface-tint-strong)] text-white">
                <Users className="size-5" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">Internal roles</p>
                <p className="text-sm leading-6 text-slate-300">
                  Account managers, finance, coordinators, and admin roles work inside the full operational layer with review, payment, and communication controls.
                </p>
              </div>
            </div>
          </div>

          <div className="app-subtle-card-strong rounded-[22px] px-5 py-5">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex size-11 items-center justify-center rounded-[18px] bg-[var(--app-brand-surface-tint-strong)] text-white">
                <Users className="size-5" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">External client users</p>
                <p className="text-sm leading-6 text-slate-300">
                  Applicants and approved client-side contacts see only the quotation, payment, document, update, and profile information relevant to their file.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CrmSectionCard>
    </div>
  )
}
