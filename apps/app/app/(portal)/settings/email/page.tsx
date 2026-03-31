"use client"

import { Mail, PlugZap, Send, ShieldCheck } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { Input } from "@cbideal/ui/components/ui/input"
import { useCommunication } from "@/lib/communication-store"

export default function EmailSettingsPage() {
  const { state, updateEmailIntegration, testEmailIntegration } = useCommunication()

  return (
    <div className="space-y-8">
      <CrmPageHeader
        eyebrow="Email settings"
        title="Outlook and sender configuration"
        description="Prepare the firm mailbox, sender identity, and draft flow used by templates, reminders, and communication logs."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmSectionCard title="Provider" description="Mailbox connection layer.">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold text-white">{state.integration.provider}</p>
            <CrmStatusBadge status={state.integration.status} className="border-white/10 bg-white/[0.07] text-white" />
          </div>
        </CrmSectionCard>
        <CrmSectionCard title="Sender mailbox" description="Address used for prepared and sent emails.">
          <p className="text-lg font-semibold text-white">{state.integration.senderMailbox}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Last tested" description="Latest connection test recorded in the workspace.">
          <p className="text-lg font-semibold text-white">{state.integration.lastTested ?? "Not yet tested"}</p>
        </CrmSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <CrmSectionCard
          title="Microsoft 365 connection"
          description="Phase 1 keeps prepared drafts, sender configuration, and communication logs live before direct sending is enabled."
        >
          <div className="space-y-4">
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-5 py-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                  <PlugZap className="size-4" />
                </div>
                <div className="space-y-2 text-sm leading-6 text-slate-300">
                  <p className="font-semibold text-white">Connection mode</p>
                  <p>{state.integration.note}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                className="rounded-full"
                onClick={() =>
                  updateEmailIntegration({
                    connected: true,
                    status: "Draft-only mode",
                  })
                }
              >
                <Mail className="size-4" />
                Connect Outlook
              </Button>
              <Button variant="outline" className="rounded-full" onClick={() => testEmailIntegration()}>
                <ShieldCheck className="size-4" />
                Test connection
              </Button>
            </div>
          </div>
        </CrmSectionCard>

        <CrmSectionCard
          title="Sender identity"
          description="Set the sender name, mailbox, and reply-to details used by template actions."
        >
          <div className="space-y-4">
            <Input
              value={state.integration.senderName}
              onChange={(event) => updateEmailIntegration({ senderName: event.target.value })}
              className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
            />
            <Input
              value={state.integration.senderMailbox}
              onChange={(event) => updateEmailIntegration({ senderMailbox: event.target.value })}
              className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
            />
            <Input
              value={state.integration.replyTo}
              onChange={(event) => updateEmailIntegration({ replyTo: event.target.value })}
              className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
            />
            <Button className="rounded-full" onClick={() => updateEmailIntegration({ status: "Draft-only mode" })}>
              <Send className="size-4" />
              Save sender settings
            </Button>
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}
