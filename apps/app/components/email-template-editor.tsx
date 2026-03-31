"use client"

import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"
import { ArrowLeft, Copy, Save, Trash2 } from "lucide-react"
import { Button } from "@cbideal/ui/components/ui/button"
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

export function EmailTemplateEditor({ templateId }: { templateId: string }) {
  const { getTemplateById, updateTemplate, duplicateTemplate, deleteTemplate, renderTemplate } = useCommunication()
  const template = getTemplateById(templateId)

  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const preview = useMemo(
    () =>
      template
        ? renderTemplate(template.id, {
            clientId: "a-rahman",
            caseId: "case-2034",
            quotationId: "quo-1001",
            paymentId: "pay-rahman-2",
            checklistItemId: "doc-rahman-2",
            customReason: "The file is not fully legible and needs to be reissued.",
          })
        : null,
    [renderTemplate, template],
  )

  if (!template) {
    return (
      <div className="space-y-6">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-6 py-8 text-slate-200">
          This template could not be found.
        </div>
        <Button asChild className="rounded-full">
          <Link href="/templates">Return to templates</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white">
          <Link href="/templates">
            <ArrowLeft className="size-4" />
            Back to templates
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white"
            onClick={() => {
              const copyId = duplicateTemplate(template.id)
              setStatusMessage(copyId ? "Template duplicated successfully." : "Unable to duplicate this template.")
            }}
          >
            <Copy className="size-4" />
            Duplicate
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-rose-300/30 bg-rose-500/10 text-rose-50 hover:bg-rose-500/20 hover:text-white"
            onClick={() => {
              deleteTemplate(template.id)
              setStatusMessage("Template removed from the library.")
            }}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <div className="space-y-5 rounded-[26px] border border-white/10 bg-white/[0.03] px-6 py-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Template editor</p>
            <h1 className="font-serif text-[2.2rem] tracking-[-0.03em] text-white">{template.name}</h1>
            <p className="text-sm leading-7 text-slate-300">
              Update copy, placeholders, and structure while keeping the message ready for workflow use.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldBlock label="Template name" hint="Use a clear internal name so the team can find this quickly.">
              <Input
                value={template.name}
                onChange={(event) => updateTemplate(template.id, { name: event.target.value })}
                className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </FieldBlock>
            <FieldBlock label="Category" hint="Keep the template aligned with the workflow where it is triggered.">
              <Select value={template.category} onValueChange={(value) => updateTemplate(template.id, { category: value as TemplateCategory })}>
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

          <FieldBlock label="Subject line" hint="Keep it brief and anchored to the exact client context.">
            <Input
              value={template.subject}
              onChange={(event) => updateTemplate(template.id, { subject: event.target.value })}
              className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
            />
          </FieldBlock>

          <FieldBlock label="Preview text" hint="This becomes the short line clients see before opening the email.">
            <Input
              value={template.previewText}
              onChange={(event) => updateTemplate(template.id, { previewText: event.target.value })}
              className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
            />
          </FieldBlock>

          <FieldBlock label="HTML body" hint="Use placeholders where the CRM should insert client, case, payment, or document details.">
            <Textarea
              value={template.htmlBody}
              onChange={(event) => updateTemplate(template.id, { htmlBody: event.target.value })}
              className="min-h-[260px] rounded-2xl border-white/10 bg-white/[0.04] text-white"
            />
          </FieldBlock>

          <FieldBlock label="Plain text version" hint="Keep the text fallback as direct and readable as the HTML version.">
            <Textarea
              value={template.textBody}
              onChange={(event) => updateTemplate(template.id, { textBody: event.target.value })}
              className="min-h-[180px] rounded-2xl border-white/10 bg-white/[0.04] text-white"
            />
          </FieldBlock>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
            <div className="space-y-1">
              <p>Last edited: {template.lastEdited}</p>
              <p>Last used: {template.lastUsed ?? "Not yet used"}</p>
            </div>
            <Button className="rounded-full" onClick={() => setStatusMessage("Template saved in the library.")}>
              <Save className="size-4" />
              Save changes
            </Button>
          </div>

          {statusMessage ? (
            <div className="rounded-[18px] border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-50">
              {statusMessage}
            </div>
          ) : null}
        </div>

        <div className="space-y-5 rounded-[26px] border border-white/10 bg-white/[0.03] px-6 py-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Rendered preview</p>
            <h2 className="font-serif text-[2rem] tracking-[-0.03em] text-white">Live email preview</h2>
            <p className="text-sm leading-7 text-slate-300">
              The preview uses live placeholder replacement from a real client and case context.
            </p>
          </div>

          {preview ? (
            <>
              <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Preview context</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {[
                    ["Client", preview.variables.client_name],
                    ["Case", preview.variables.case_name],
                    ["Document", preview.variables.document_name],
                    ["Payment", preview.variables.payment_amount],
                    ["Due date", preview.variables.payment_due_date],
                    ["Recipient", preview.recipient],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[16px] border border-white/10 bg-white/[0.03] px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
                      <p className="mt-1 text-sm leading-6 text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Subject</p>
                <p className="mt-2 text-sm text-white">{preview.subject}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Preview text</p>
                <p className="mt-2 text-sm text-slate-300">{preview.previewText}</p>
              </div>
              <div className="max-h-[620px] overflow-auto rounded-[22px] border border-white/10 bg-[#f4f1ea] p-3">
                <div
                  className="rounded-[18px] bg-white shadow-sm"
                  dangerouslySetInnerHTML={{ __html: preview.htmlBody }}
                />
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Plain text fallback</p>
                <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">{preview.textBody}</pre>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
