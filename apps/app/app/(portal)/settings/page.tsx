import Link from "next/link"
import { saasPricingModel } from "@cbideal/config/pricing"
import { BellRing, Building2, CreditCard, Users } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { pricingSnapshot, reminderSettings, workspace } from "@/lib/mock-data"

export default function SettingsPage() {
  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Settings"
        title="Account structure, billing visibility, and workflow automation settings."
        description="The settings area reflects the actual platform model: one firm workspace, internal operating seats, external client accounts, and reminder logic for quotations, payments, and document requests."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmStatCard
          label="Internal team seats"
          value={`${workspace.internalSeats}`}
          note={`${saasPricingModel.currency} ${saasPricingModel.internalSeatMonthly} per seat monthly`}
          trend="Operating users"
        />
        <CrmStatCard
          label="External client accounts"
          value={`${workspace.externalAccounts}`}
          note={`${saasPricingModel.currency} ${saasPricingModel.externalClientMonthly} per account monthly`}
          trend="Portal access"
        />
        <CrmStatCard
          label="Current monthly total"
          value={`${saasPricingModel.currency} ${pricingSnapshot.total}`}
          note="Combined view of internal seats and external accounts."
          trend="Billing snapshot"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <CrmSectionCard title="Account" description="Workspace identity and tenancy structure.">
          <div className="space-y-3">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Building2 className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{workspace.workspaceName}</p>
                  <p className="text-sm leading-6 text-muted-foreground">Tenant ID: {workspace.tenantId}</p>
                </div>
              </div>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard title="Billing" description="Seat and account pricing prepared for later plan expansion.">
          <div className="space-y-3">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CreditCard className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Two account layers</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Internal seats and external client accounts are priced separately so firms can scale the operational layer and the client portal independently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard title="Limits" description="Current capability and future-ready controls.">
          <div className="space-y-3">
            {[
              {
                label: "Custom branding",
                value: workspace.allowsCustomBranding ? "Available" : "Not enabled",
              },
              {
                label: "Client-specific workflows",
                value: workspace.allowsClientSpecificWorkflows ? "Enabled" : "Not enabled",
              },
              {
                label: "Internal seats",
                value: `${workspace.internalSeats} active`,
              },
              {
                label: "External accounts",
                value: `${workspace.externalAccounts} active`,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <CrmSectionCard
        title="Reminder and automation settings"
        description="Workflow-triggered reminders stay configurable without breaking the calm, client-facing tone of the platform."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reminderSettings.map((setting) => (
            <div key={setting.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <BellRing className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{setting.name}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{setting.trigger}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{setting.audience}</p>
                  <div className="pt-1">
                    <CrmStatusBadge status={setting.status} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/settings/email">Open email settings</Link>
          </Button>
        </div>
      </CrmSectionCard>

      <CrmSectionCard
        title="Role model"
        description="The platform keeps internal operators and external client users separate, while preserving one visual system."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Internal roles</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Account managers, case coordinators, finance, and admin roles work inside the full workflow layer.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">External client users</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Applicants and approved client-side contacts see only quotations, payments, documents, updates, and profile details relevant to them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CrmSectionCard>
    </div>
  )
}
