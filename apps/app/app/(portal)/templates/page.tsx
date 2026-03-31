"use client"

import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"
import { Copy, Eye, MailPlus, Trash2 } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cbideal/ui/components/ui/dialog"
import { Input } from "@cbideal/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cbideal/ui/components/ui/select"
import { Textarea } from "@cbideal/ui/components/ui/textarea"
import { useCommunication } from "@/lib/communication-store"
import type { TemplateCategory } from "@/lib/communication-data"

const categories: TemplateCategory[] = [
  "Payment reminder",
  "Overdue payment",
  "Missing document",
  "Document re-upload request",
  "Quotation follow-up",
  "Consultation confirmation",
  "Application progress update",
]

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

export default function TemplatesPage() {
  const { state, createTemplate, duplicateTemplate, deleteTemplate } = useCommunication()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("New email template")
  const [category, setCategory] = useState<TemplateCategory>("Application progress update")
  const [subject, setSubject] = useState("Progress update for {{case_name}}")
  const [previewText, setPreviewText] = useState("A concise update prepared from the CRM context.")
  const [htmlBody, setHtmlBody] = useState("<p>Dear {{client_name}},</p><p>This is a concise update regarding {{case_name}}.</p>")
  const [textBody, setTextBody] = useState("Dear {{client_name}},\n\nThis is a concise update regarding {{case_name}}.")

  const groupedCounts = useMemo(
    () =>
      categories.map((item) => ({
        label: item,
        value: state.templates.filter((template) => template.category === item).length,
      })),
    [state.templates],
  )

  return (
    <div className="space-y-8">
      <CrmPageHeader
        eyebrow="Templates"
        title="Email templates and reusable communication"
        description="Store premium email templates by category, preview them with live variables, and keep reminder language consistent across the workspace."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <MailPlus className="size-4" />
                Create template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[720px] rounded-[28px] border-white/10 bg-[#233047] text-white">
              <DialogHeader>
                <DialogTitle className="font-serif text-[2rem] tracking-[-0.03em] text-white">
                  Create email template
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldBlock label="Template name" hint="Use a clear internal name that teams can find quickly.">
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
                    />
                  </FieldBlock>
                  <FieldBlock label="Category" hint="Attach the template to the workflow where it will be used.">
                    <Select value={category} onValueChange={(value) => setCategory(value as TemplateCategory)}>
                      <SelectTrigger className="w-full rounded-2xl border-white/10 bg-white/[0.04] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-[#233047] text-white">
                        {categories.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldBlock>
                </div>

                <FieldBlock label="Subject line" hint="Keep this concise and specific to the client context.">
                  <Input
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
                  />
                </FieldBlock>

                <FieldBlock label="Preview text" hint="This appears as the short summary before the email is opened.">
                  <Input
                    value={previewText}
                    onChange={(event) => setPreviewText(event.target.value)}
                    className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
                  />
                </FieldBlock>

                <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                  <FieldBlock label="HTML body" hint="Use branded copy and placeholders to keep the message ready for client use.">
                    <Textarea
                      value={htmlBody}
                      onChange={(event) => setHtmlBody(event.target.value)}
                      className="min-h-[200px] rounded-2xl border-white/10 bg-white/[0.04] text-white"
                    />
                  </FieldBlock>
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-5 py-5">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Useful variables</p>
                      <p className="text-sm leading-6 text-slate-300">
                        Client, case, document, payment, quotation, and portal values are filled automatically when the template is opened from the relevant record.
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["{{client_name}}", "{{case_name}}", "{{document_name}}", "{{payment_due_date}}", "{{portal_link}}"].map((token) => (
                        <span
                          key={token}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-200"
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <FieldBlock label="Plain text fallback" hint="Used for mail clients that cannot render the HTML version.">
                  <Textarea
                    value={textBody}
                    onChange={(event) => setTextBody(event.target.value)}
                    className="min-h-[140px] rounded-2xl border-white/10 bg-white/[0.04] text-white"
                  />
                </FieldBlock>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => {
                    createTemplate({
                      name,
                      category,
                      subject,
                      previewText,
                      htmlBody,
                      textBody,
                    })
                    setOpen(false)
                  }}
                >
                  Save template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CrmSectionCard title="Library size" description="Reusable templates across all workflow categories.">
          <p className="font-serif text-[2.8rem] leading-none tracking-[-0.04em] text-white">{state.templates.length}</p>
        </CrmSectionCard>
        <CrmSectionCard title="Last used" description="Most recent active template in workflow use.">
          <p className="text-lg font-semibold text-white">
            {state.templates.find((template) => template.lastUsed)?.name ?? "Not yet used"}
          </p>
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
          description="A quick read on where coverage already exists and which reminders are ready for use."
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
          title="Library standards"
          description="The same structure should hold across payment reminders, document requests, and progress updates."
        >
          <div className="space-y-3">
            {[
              "Keep subject lines specific to the client context.",
              "Use preview text to explain the purpose before opening.",
              "Keep body copy calm, short, and decisive.",
              "Always include a clear next step or portal action.",
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
              </div>
              <div className="space-y-2 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Subject</p>
                <p className="text-sm text-white">{template.subject}</p>
                <p className="text-sm leading-6 text-slate-300">{template.previewText}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white">
                  <Link href={`/templates/${template.id}`}>
                    <Eye className="size-4" />
                    Preview and edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white"
                  onClick={() => duplicateTemplate(template.id)}
                >
                  <Copy className="size-4" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-rose-300/30 bg-rose-500/10 text-rose-50 hover:bg-rose-500/20 hover:text-white"
                  onClick={() => deleteTemplate(template.id)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CrmSectionCard>
        ))}
      </div>
    </div>
  )
}
