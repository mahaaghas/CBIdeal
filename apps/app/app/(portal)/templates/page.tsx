"use client"

import Link from "next/link"
import { Eye, Lock } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { useCommunication } from "@/lib/communication-store"

export default function TemplatesPage() {
  const { state } = useCommunication()

  const groupedCounts = Array.from(new Set(state.templates.map((template) => template.category))).map((category) => ({
    label: category,
    value: state.templates.filter((template) => template.category === category).length,
  }))

  return (
    <div className="space-y-8">
      <CrmPageHeader
        eyebrow="Templates"
        title="Locked communication templates with controlled variables"
        description="The email structure is fixed in the product so teams can preview and send polished messages without editing raw HTML or breaking the layout."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CrmSectionCard title="Template library" description="Approved locked templates available for workflow communication.">
          <p className="font-serif text-[2.8rem] leading-none tracking-[-0.04em] text-white">{state.templates.length}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Locked layout" description="HTML is fixed and rendered by the backend template engine.">
          <div className="flex items-center gap-3 text-white">
            <Lock className="size-4" />
            <span className="text-sm font-semibold">No raw HTML editing</span>
          </div>
        </CrmSectionCard>
        <CrmSectionCard title="Connected mailbox" description="Current sender mailbox for draft and send actions.">
          <p className="text-lg font-semibold text-white">{state.integration.senderMailbox}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Integration status" description="Current mail integration mode.">
          <CrmStatusBadge status={state.integration.status} className="border-white/10 bg-white/[0.07] text-white" />
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <CrmSectionCard
          title="Template categories"
          description="Coverage across payment reminders, document requests, quotation follow-ups, and progress updates."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {groupedCounts.map((item) => (
              <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                <p className="mt-3 text-[1.9rem] font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </CrmSectionCard>

        <CrmSectionCard
          title="Editing rules"
          description="Only approved variables can change. Layout, CTA styling, and overall structure stay locked."
        >
          <div className="space-y-3">
            {[
              "HTML body is no longer editable in the dashboard.",
              "Teams work with structured fields such as client name, case name, payment amount, and upload link.",
              "Preview always reflects the final locked email clients receive.",
              "Send actions go through the backend mail route with validation.",
            ].map((item) => (
              <div key={item} className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {state.templates.map((template) => (
          <CrmSectionCard
            key={template.id}
            title={template.name}
            description={`${template.category} / last edited ${template.lastEdited}`}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <CrmStatusBadge status={template.category} className="border-white/10 bg-white/[0.06] text-white" />
                <span className="text-sm text-slate-300">
                  Last used {template.lastUsed ?? "not yet"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                  Locked template
                </span>
              </div>

              <div className="space-y-2 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Subject</p>
                <p className="text-sm text-white">{template.subject}</p>
                <p className="text-sm leading-6 text-slate-300">{template.previewText}</p>
              </div>

              <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Approved variables</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.variables.map((variable) => (
                    <span
                      key={variable.key}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-200"
                    >
                      {variable.label}
                    </span>
                  ))}
                </div>
              </div>

              <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white">
                <Link href={`/templates/${template.id}`}>
                  <Eye className="size-4" />
                  Preview and send
                </Link>
              </Button>
            </div>
          </CrmSectionCard>
        ))}
      </div>
    </div>
  )
}
