"use client"

import { BellRing, MessageSquareMore } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { useWorkflow } from "@/lib/workflow-store"

export default function PortalMessagesPage() {
  const { currentPortalClientId, getNotificationsForClient, getClientUpdates } = useWorkflow()

  const notifications = getNotificationsForClient(currentPortalClientId)
  const updates = getClientUpdates(currentPortalClientId)

  return (
    <div className="space-y-8">
      <CrmPageHeader
        eyebrow="Messages"
        title="Recent updates and notices"
        description="This area keeps the client-facing record together, including workflow notices, approval outcomes, and anything that requires a further step from you."
      />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <CrmSectionCard title="Latest case updates" description="Updates written for client visibility and easy review.">
          <div className="space-y-3">
            {updates.map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MessageSquareMore className="size-4" />
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>

        <CrmSectionCard title="Notices and email placeholders" description="System-triggered notices created when payments or documents move.">
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BellRing className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-medium text-foreground">{item.type}</p>
                      <CrmStatusBadge status={item.status} />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.channel} � {item.sentAt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}

