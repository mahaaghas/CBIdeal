"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { CalendarClock, LoaderCircle, Mail, Send, Sparkles } from "lucide-react"
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
import { useBranding } from "@/lib/branding-store"
import type { TemplateCategory } from "@/lib/communication-data"
import { useCommunication } from "@/lib/communication-store"
import {
  fetchEmailPreview,
  sendEmailPreview,
  type RenderedEmailPreview,
} from "@/lib/email-template-client"

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
  const { branding } = useBranding()
  const {
    state,
    getTemplatesByCategory,
    getDefaultVariables,
    getRecipientForClient,
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
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState<RenderedEmailPreview | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isSending, setIsSending] = useState(false)

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

  useEffect(() => {
    if (!templateId) return
    setVariables(
      getDefaultVariables(templateId, {
        clientId,
        caseId,
        quotationId,
        paymentId,
        checklistItemId,
        customReason,
      }),
    )
  }, [caseId, checklistItemId, clientId, customReason, getDefaultVariables, paymentId, quotationId, templateId])

  const template = templates.find((entry) => entry.id === templateId)
  const recipient = getRecipientForClient(clientId)

  const brandingPayload = useMemo(
    () => ({
      companyName: branding.companyName,
      senderName: branding.senderDisplayName,
      replyTo: state.integration.replyTo,
      primaryColor: branding.primaryColor,
    }),
    [branding, state.integration.replyTo],
  )

  useEffect(() => {
    if (!templateId) return

    const run = async () => {
      setIsPreviewing(true)
      try {
        const rendered = await fetchEmailPreview({
          templateId,
          variables,
          branding: brandingPayload,
        })
        setPreview(rendered)
        setPreviewError(null)
      } catch (error) {
        setPreview(null)
        setPreviewError(error instanceof Error ? error.message : "Unable to render email preview.")
      } finally {
        setIsPreviewing(false)
      }
    }

    void run()
  }, [brandingPayload, templateId, variables])

  const runAction = async (
    status: "Draft" | "Prepared" | "Sent" | "Scheduled",
    channel: "Outlook draft" | "Workspace send" | "Scheduled send",
  ) => {
    if (!templateId || !preview || !template) return

    if (status === "Sent") {
      setIsSending(true)
      try {
        const rendered = await sendEmailPreview({
          templateId,
          recipientEmail: recipient,
          variables,
          branding: brandingPayload,
        })
        saveCommunication({
          templateId,
          clientId,
          caseId,
          quotationId,
          paymentId,
          checklistItemId,
          customReason,
          status,
          channel,
          rendered,
          recipient,
        })
        setPreview(rendered)
        setResult("Email sent successfully and logged to communication history.")
      } catch (error) {
        setResult(error instanceof Error ? error.message : "Unable to send email.")
      } finally {
        setIsSending(false)
      }
      return
    }

    if (status === "Prepared" && typeof window !== "undefined") {
      const query = new URLSearchParams({
        subject: preview.subject,
        body: preview.textBody,
      })
      window.open(`mailto:${recipient}?${query.toString()}`, "_blank", "noopener,noreferrer")
    }

    saveCommunication({
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
      rendered: preview,
      recipient,
    })

    setResult(
      status === "Draft"
        ? "Draft saved to communication history."
        : status === "Prepared"
          ? "Prepared in Outlook draft mode and logged to the client record."
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
                Templates are locked. Fill approved variables, preview the result, and then save, draft, schedule, or send.
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

              <DetailBlock label="Template" hint="Each email layout is locked and only approved variables can change.">
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger className="w-full rounded-2xl border-white/10 bg-white/[0.04] text-white">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#233047] text-white">
                    {templates.map((entry) => (
                      <SelectItem key={entry.id} value={entry.id}>
                        {entry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DetailBlock>

              <DetailBlock label="Recipient" hint="This is pulled from the client record and used for delivery.">
                <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white">
                  {recipient}
                </div>
              </DetailBlock>

              {template ? (
                <div className="space-y-4">
                  {template.variables.map((variable) => (
                    <DetailBlock key={variable.key} label={variable.label} hint={variable.helpText}>
                      <Input
                        value={variables[variable.key] ?? ""}
                        onChange={(event) =>
                          setVariables((current) => ({ ...current, [variable.key]: event.target.value }))
                        }
                        className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
                        placeholder={variable.placeholder}
                      />
                    </DetailBlock>
                  ))}
                </div>
              ) : null}

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
                    <p className="font-semibold text-white">Locked templates, controlled variables</p>
                    <p>
                      Layout, CTA styling, and structure stay fixed so every email remains polished and consistent.
                    </p>
                  </div>
                </div>
              </div>

              {previewError ? (
                <div className="rounded-[18px] border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-50">
                  {previewError}
                </div>
              ) : null}
            </div>
          </div>

          <div className="p-6">
            {isPreviewing ? (
              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-6 py-10 text-sm leading-7 text-slate-300">
                <div className="flex items-center gap-3">
                  <LoaderCircle className="size-4 animate-spin" />
                  Rendering email preview
                </div>
              </div>
            ) : preview ? (
              <div className="space-y-5">
                <DetailBlock label="Subject">
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white">
                    {preview.subject}
                  </div>
                </DetailBlock>

                <DetailBlock label="Preview text">
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                    {preview.previewText}
                  </div>
                </DetailBlock>

                <DetailBlock label="Rendered email" hint="This is the final locked HTML version the client will receive.">
                  <div className="max-h-[420px] overflow-auto rounded-[22px] border border-white/10 bg-[#f4f1ea] p-3">
                    <div
                      className="rounded-[18px] bg-white shadow-sm"
                      dangerouslySetInnerHTML={{ __html: preview.htmlBody }}
                    />
                  </div>
                </DetailBlock>

                <DetailBlock label="Plain text version" hint="Used for mail clients that do not display the HTML layout.">
                  <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-4">
                    <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{preview.textBody}</pre>
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
                Fill the approved variables to preview the locked email.
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
              <Button variant="outline" className="app-button-secondary rounded-full" onClick={() => void runAction("Draft", "Workspace send")} disabled={!templateId || !preview}>
                Save draft
              </Button>
              <Button variant="outline" className="app-button-secondary rounded-full" onClick={() => void runAction("Prepared", "Outlook draft")} disabled={!templateId || !preview}>
                Open in Outlook
              </Button>
              <Button variant="outline" className="app-button-secondary rounded-full" onClick={() => void runAction("Scheduled", "Scheduled send")} disabled={!templateId || !preview || !scheduledFor}>
                <CalendarClock className="size-4" />
                Schedule
              </Button>
              <Button className="rounded-full" onClick={() => void runAction("Sent", "Workspace send")} disabled={!templateId || !preview || isSending}>
                {isSending ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
                Send email
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
