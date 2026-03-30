import { saasPricingModel } from "@cbideal/config/pricing"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
import { pricingSnapshot, workspace } from "@/lib/mock-data"

export default function SettingsPage() {
  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Settings"
        title="Account rules, billing visibility, and future workspace limits."
        description="The settings area is structured around the product model that matters first: internal seats for the operating team and external accounts for clients or approved outside users. It is ready to expand into fuller tenant controls later."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmStatCard
          label="Internal team seats"
          value={`${workspace.internalSeats}`}
          note={`${saasPricingModel.currency} ${saasPricingModel.internalSeatMonthly} per seat monthly`}
          trend="Primary operating layer"
        />
        <CrmStatCard
          label="External client accounts"
          value={`${workspace.externalAccounts}`}
          note={`${saasPricingModel.currency} ${saasPricingModel.externalClientMonthly} per account monthly`}
          trend="Separate client-facing layer"
        />
        <CrmStatCard
          label="Current monthly total"
          value={`${saasPricingModel.currency} ${pricingSnapshot.total}`}
          note="Combined view of internal seats and external access."
          trend="Billing snapshot"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <CrmSectionCard
          title="Account"
          description="Core workspace identity and tenant-level details."
        >
          <div className="space-y-3">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
              <p className="mt-1 text-sm font-medium text-foreground">{workspace.workspaceName}</p>
            </div>
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Tenant id</p>
              <p className="mt-1 text-sm font-medium text-foreground">{workspace.tenantId}</p>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard
          title="Billing"
          description="Prepared for plan visibility, invoice handling, and later tenant-specific billing controls."
        >
          <div className="space-y-3">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm">
              <p className="text-sm leading-7 text-muted-foreground">
                Internal seats and external accounts are priced separately to reflect the two different layers of platform use.
              </p>
            </div>
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm">
              <p className="text-sm leading-7 text-muted-foreground">
                The same structure can later support client-specific billing logic, plan tiers, and account-level limits.
              </p>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard
          title="Limits"
          description="Current operating limits and readiness for future expansion."
        >
          <div className="space-y-3">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Custom branding</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {workspace.allowsCustomBranding ? "Available" : "Not enabled"}
              </p>
            </div>
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Client-specific workflows</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {workspace.allowsClientSpecificWorkflows ? "Enabled" : "Not enabled"}
              </p>
            </div>
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}
