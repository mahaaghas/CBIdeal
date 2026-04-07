"use client"

import { BellRing, MessageSquareMore } from "lucide-react"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { useWorkflow } from "@/lib/workflow-store"

export default function PortalMessagesPage() {
  const {
    currentPortalClientId,
    getNotificationsForClient,
    getClientUpdates,
    getDocumentActivityForClient,
  } = useWorkflow()

  const notifications = getNotificationsForClient(currentPortalClientId)
  const updates = getClientUpdates(currentPortalClientId)
  const documentActivity = getDocumentActivityForClient(currentPortalClientId)

  return (
    <div className="space-y-8">
      <section className="app-surface rounded-[28px] px-7 py-8 md:px-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Messages</p>
          <h1 className="font-serif text-[2.25rem] tracking-[-0.04em] text-white">Updates, notices, and case movement</h1>
          <p className="text-sm leading-7 text-slate-300">
            This area keeps client-facing updates and system notices together so important movement is easy to review
            without searching through multiple sections of the portal.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-[1.95rem] tracking-[-0.03em] text-white">Advisory updates</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Clear written updates prepared for the client-facing view of the case.
              </p>
            </div>

            <div className="space-y-3">
              {updates.map((item, index) => (
                <div key={`${item}-${index}`} className="app-surface-soft rounded-[18px] px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                      <MessageSquareMore className="size-4" />
                    </div>
                    <p className="text-sm leading-7 text-slate-200">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="app-surface rounded-[24px] px-6 py-6 md:px-7">
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-[1.95rem] tracking-[-0.03em] text-white">Workflow notices</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Document decisions and notice history remain visible here in a simpler operational timeline.
              </p>
            </div>

            <div className="space-y-3">
              {documentActivity.slice(0, 4).map((item) => (
                <div key={item.id} className="app-surface-soft rounded-[18px] px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                      <MessageSquareMore className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-semibold text-white">{item.itemLabel}</p>
                        <CrmStatusBadge status={item.toStatus} className="border-white/10 bg-white/[0.07] text-white" />
                      </div>
                      <p className="text-sm leading-6 text-slate-400">
                        {item.actorName} | {item.createdAt}
                      </p>
                      <p className="text-sm leading-6 text-slate-300">{item.note ?? "Workflow updated."}</p>
                    </div>
                  </div>
                </div>
              ))}

              {notifications.map((item) => (
                <div key={item.id} className="rounded-[18px] border border-white/10 bg-white/[0.03] px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                      <BellRing className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-semibold text-white">{item.type}</p>
                        <CrmStatusBadge status={item.status} className="border-white/10 bg-white/[0.07] text-white" />
                      </div>
                      <p className="text-sm leading-6 text-slate-400">
                        {item.channel} | {item.sentAt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
