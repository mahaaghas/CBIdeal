"use client"

import { type ReactNode } from "react"
import { Mail, PlugZap, Send, ShieldCheck } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { Input } from "@cbideal/ui/components/ui/input"
import { useCommunication } from "@/lib/communication-store"

function FieldBlock({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2.5">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
        {hint ? <p className="text-sm leading-6 text-slate-300">{hint}</p> : null}
      </div>
      {children}
    </div>
  )
}

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

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current mode</p>
                <p className="mt-2 text-sm font-medium text-white">{state.integration.status}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Reply path</p>
                <p className="mt-2 text-sm font-medium text-white">{state.integration.replyTo}</p>
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
            <FieldBlock label="Sender name" hint="This is the name clients see in their inbox and history.">
              <Input
                value={state.integration.senderName}
                onChange={(event) => updateEmailIntegration({ senderName: event.target.value })}
                className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </FieldBlock>
            <FieldBlock label="Sender mailbox" hint="Prepared drafts and logged sends use this address.">
              <Input
                value={state.integration.senderMailbox}
                onChange={(event) => updateEmailIntegration({ senderMailbox: event.target.value })}
                className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </FieldBlock>
            <FieldBlock label="Reply-to" hint="Use a monitored mailbox so responses stay controlled and visible.">
              <Input
                value={state.integration.replyTo}
                onChange={(event) => updateEmailIntegration({ replyTo: event.target.value })}
                className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </FieldBlock>
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
