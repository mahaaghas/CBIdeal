"use client"

import Link from "next/link"
import { useEffect, useMemo, useState, type ReactNode } from "react"
import { CalendarClock, Mail, Send, Sparkles } from "lucide-react"
import { Button } from "@cbideal/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useCommunication } from "@/lib/communication-store"
import type { TemplateCategory } from "@/lib/communication-data"

type CommunicationComposerProps = {
  clientId: string
  caseId?: string | null
  quotationId?: string | null
  paymentId?: string | null
  checklistItemId?: string | null
  customReason?: string | null
  defaultCategory?: TemplateCategory
  availableCategories?: TemplateCategory[]
  triggerLabel?: string
  className?: string
}

function DetailBlock({
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

export function CommunicationComposer({
  clientId,
  caseId,
  quotationId,
  paymentId,
  checklistItemId,
  customReason,
  defaultCategory,
  availableCategories,
  triggerLabel = "Send update",
  className,
}: CommunicationComposerProps) {
  const {
    state,
    getTemplatesByCategory,
    renderTemplate,
    saveCommunication,
  } = useCommunication()

  const categoryOptions = useMemo(() => {
    const list = availableCategories ?? Array.from(new Set(state.templates.map((template) => template.category)))
    return list
  }, [availableCategories, state.templates])

  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<TemplateCategory>(
    defaultCategory ?? categoryOptions[0] ?? "Application progress update",
  )
  const templates = getTemplatesByCategory(category)
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "")
  const [scheduledFor, setScheduledFor] = useState("")
  const [result, setResult] = useState<string | null>(null)

  useEffect(() => {
    if (!categoryOptions.includes(category)) {
      setCategory(categoryOptions[0] ?? "Application progress update")
    }
  }, [category, categoryOptions])

  useEffect(() => {
    if (!templates.some((template) => template.id === templateId)) {
      setTemplateId(templates[0]?.id ?? "")
    }
  }, [templateId, templates])

  const rendered = templateId
    ? renderTemplate(templateId, {
        clientId,
        caseId,
        quotationId,
        paymentId,
        checklistItemId,
        customReason,
      })
    : null

  const runAction = (
    status: "Draft" | "Prepared" | "Sent" | "Scheduled",
    channel: "Outlook draft" | "Workspace send" | "Scheduled send",
  ) => {
    if (!templateId) return

    const href = saveCommunication({
      templateId,
      clientId,
      caseId,
      quotationId,
      paymentId,
      checklistItemId,
      customReason,
      status,
      channel,
      scheduledFor: status === "Scheduled" ? scheduledFor : null,
    })

    if (status === "Prepared" && href && typeof window !== "undefined") {
      window.open(href, "_blank", "noopener,noreferrer")
    }

    setResult(
      status === "Draft"
        ? "Draft saved to communication history."
        : status === "Prepared"
          ? "Prepared in Outlook draft mode and logged to the client record."
          : status === "Sent"
            ? "Marked as sent and added to communication history."
            : "Scheduled and logged for later delivery.",
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={className ?? "rounded-full"}>
          <Mail className="size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[980px] rounded-[28px] border-white/10 bg-[#233047] p-0 text-white">
        <div className="grid gap-0 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
            <DialogHeader className="space-y-3 text-left">
              <DialogTitle className="font-serif text-[2rem] tracking-[-0.03em] text-white">
                Prepare client communication
              </DialogTitle>
              <DialogDescription className="text-sm leading-7 text-slate-300">
                Choose a premium template, preview the rendered message, then save a draft, open it in Outlook, send now, or schedule it for later.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-5">
              <DetailBlock label="Category" hint="Choose the communication type that fits the current workflow step.">
                <Select value={category} onValueChange={(value) => setCategory(value as TemplateCategory)}>
                  <SelectTrigger className="w-full rounded-2xl border-white/10 bg-white/[0.04] text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#233047] text-white">
                    {categoryOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DetailBlock>

              <DetailBlock label="Template" hint="Templates are filled automatically from the selected client, case, document, or payment context.">
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger className="w-full rounded-2xl border-white/10 bg-white/[0.04] text-white">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#233047] text-white">
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DetailBlock>

              <DetailBlock label="Schedule for later" hint="Use this when the message should go out at a later checkpoint.">
                <Input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(event) => setScheduledFor(event.target.value)}
                  className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
                />
              </DetailBlock>

              <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="space-y-1 text-sm leading-6 text-slate-300">
                    <p className="font-semibold text-white">Template variables are live</p>
                    <p>
                      Client, case, document, quotation, and payment values are filled from the current CRM context before the message is logged.
                    </p>
                  </div>
                </div>
              </div>

              {rendered ? (
                <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Resolved context</p>
                    <div className="grid gap-3">
                      {[
                        ["Recipient", rendered.recipient],
                        ["Client", rendered.variables.client_name],
                        ["Matter", rendered.variables.case_name],
                        ["Document", rendered.variables.document_name],
                        ["Payment", rendered.variables.payment_amount],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-slate-400">{label}</span>
                          <span className="text-right text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {templateId ? (
                <Button asChild variant="outline" className="app-button-secondary w-full rounded-full">
                  <Link href={`/templates/${templateId}`}>Open template editor</Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="p-6">
            {rendered ? (
              <div className="space-y-5">
                <DetailBlock label="Subject">
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white">
                    {rendered.subject}
                  </div>
                </DetailBlock>

                <DetailBlock label="Preview text">
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                    {rendered.previewText}
                  </div>
                </DetailBlock>

                <DetailBlock label="Rendered email" hint="This is the branded HTML version the client will see.">
                  <div className="max-h-[420px] overflow-auto rounded-[22px] border border-white/10 bg-[#f4f1ea] p-3">
                    <div
                      className="rounded-[18px] bg-white shadow-sm"
                      dangerouslySetInnerHTML={{ __html: rendered.htmlBody }}
                    />
                  </div>
                </DetailBlock>

                <DetailBlock label="Plain text version" hint="Used for mail clients that do not display the HTML layout.">
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
                    <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{rendered.textBody}</pre>
                  </div>
                </DetailBlock>

                {result ? (
                  <div className="rounded-[18px] border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-50">
                    {result}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-sm leading-7 text-slate-300">
                Select a template to preview the rendered message.
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t border-white/10 px-6 py-4">
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <Button variant="outline" className="app-button-secondary rounded-full" onClick={() => setOpen(false)}>
              Close
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="app-button-secondary rounded-full" onClick={() => runAction("Draft", "Workspace send")} disabled={!templateId}>
                Save draft
              </Button>
              <Button variant="outline" className="app-button-secondary rounded-full" onClick={() => runAction("Prepared", "Outlook draft")} disabled={!templateId}>
                Open in Outlook
              </Button>
              <Button variant="outline" className="app-button-secondary rounded-full" onClick={() => runAction("Scheduled", "Scheduled send")} disabled={!templateId || !scheduledFor}>
                <CalendarClock className="size-4" />
                Schedule
              </Button>
              <Button className="rounded-full" onClick={() => runAction("Sent", "Workspace send")} disabled={!templateId}>
                <Send className="size-4" />
                Send now
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
