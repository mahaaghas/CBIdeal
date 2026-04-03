"use client"

import { Mail, MapPin, ShieldCheck, UserRound } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { useWorkflow } from "@/lib/workflow-store"

export default function PortalProfilePage() {
  const {
    currentPortalClientId,
    getPortalUserByClientId,
    getClientDetail,
    getCaseByClientId,
  } = useWorkflow()

  const user = getPortalUserByClientId(currentPortalClientId)
  const client = getClientDetail(currentPortalClientId)
  const caseRecord = getCaseByClientId(currentPortalClientId)

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Profile"
        title="Account and access details"
        description="Profile details are kept intentionally simple here so the portal stays focused on the case itself while still making access, contact details, and active matter visibility clear."
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <CrmSectionCard title="Portal user" description="Current signed-in profile.">
          <div className="space-y-3">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{user?.name ?? client?.name}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{user?.role ?? client?.profileType}</p>
                </div>
              </div>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard title="Case profile" description="Matter currently associated with this account.">
          <div className="space-y-3">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{caseRecord?.route ?? "No active matter"}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{client?.applicationStatus ?? "Portal access active"}</p>
                </div>
              </div>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard title="Contact details" description="Contact information used for portal updates and notices.">
          <div className="space-y-3">
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{user?.email ?? "No portal email configured"}</p>
                  <p className="text-sm leading-6 text-muted-foreground">Primary notification address</p>
                </div>
              </div>
            </div>
            <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Portal access active</p>
                  <p className="text-sm leading-6 text-muted-foreground">{user?.portalStatus ?? "Portal live"}</p>
                </div>
              </div>
            </div>
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}
