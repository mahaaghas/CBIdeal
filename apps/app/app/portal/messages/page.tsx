import { BellRing, MessageSquareMore } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { getNotificationsForClient, portalSnapshot } from "@/lib/mock-data"

export default function PortalMessagesPage() {
  const notifications = getNotificationsForClient("a-rahman")

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Messages / Updates"
        title="Approved updates and workflow notices"
        description="This area keeps important client-facing messages together, including approved status updates and operational notices such as quotation release or payment reminders."
      />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <CrmSectionCard title="Recent updates" description="Case updates written for client visibility.">
          <div className="space-y-3">
            {portalSnapshot.updates.map((item) => (
              <div key={item} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
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

        <CrmSectionCard title="Workflow notices" description="Operational notifications relevant to your matter.">
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BellRing className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-foreground">{item.type}</p>
                      <CrmStatusBadge status={item.status} />
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.channel} · {item.sentAt}
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
