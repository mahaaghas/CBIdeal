"use client"

import Link from "next/link"
import { useEffect, useMemo, useState, type ReactNode } from "react"
import { ArrowLeft, LoaderCircle, Mail, RefreshCcw, Send } from "lucide-react"
import { Button } from "@cbideal/ui/components/ui/button"
import { Input } from "@cbideal/ui/components/ui/input"
import { useBranding } from "@/lib/branding-store"
import { type EmailTemplateVariableDefinition } from "@/lib/communication-data"
import { useCommunication } from "@/lib/communication-store"
import {
  fetchEmailPreview,
  sendEmailPreview,
  type RenderedEmailPreview,
} from "@/lib/email-template-client"

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

function buildInitialValues(variables: EmailTemplateVariableDefinition[]) {
  return variables.reduce<Record<string, string>>((accumulator, variable) => {
    accumulator[variable.key] = variable.placeholder
    return accumulator
  }, {})
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function validateVariables(variables: EmailTemplateVariableDefinition[], values: Record<string, string>) {
  const errors: Record<string, string> = {}

  variables.forEach((variable) => {
    const value = values[variable.key]?.trim() ?? ""

    if (variable.required && !value) {
      errors[variable.key] = `${variable.label} is required.`
      return
    }

    if (value && variable.type === "url") {
      try {
        new URL(value)
      } catch {
        errors[variable.key] = `${variable.label} must be a valid URL.`
      }
    }
  })

  return errors
}

export function EmailTemplateEditor({ templateId }: { templateId: string }) {
  const { branding } = useBranding()
  const { state, getTemplateById } = useCommunication()
  const template = getTemplateById(templateId)

  const [variables, setVariables] = useState<Record<string, string>>({})
  const [recipientEmail, setRecipientEmail] = useState("client@example.com")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState<RenderedEmailPreview | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (!template) return
    setVariables(buildInitialValues(template.variables))
  }, [template])

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
    if (!template) return

    const run = async () => {
      setIsPreviewing(true)
      try {
        const rendered = await fetchEmailPreview({
          templateId: template.id,
          variables,
          branding: brandingPayload,
        })
        setPreview(rendered)
        setStatusMessage(null)
      } catch (error) {
        setPreview(null)
        setStatusMessage(error instanceof Error ? error.message : "Unable to render preview.")
      } finally {
        setIsPreviewing(false)
      }
    }

    void run()
  }, [brandingPayload, template, variables])

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

  const handleVariableChange = (key: string, value: string) => {
    setVariables((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const handleSend = async () => {
    const variableErrors = validateVariables(template.variables, variables)
    if (!recipientEmail.trim()) {
      variableErrors.recipientEmail = "Recipient Email is required."
    } else if (!isValidEmail(recipientEmail)) {
      variableErrors.recipientEmail = "Recipient Email must be a valid email address."
    }

    setErrors(variableErrors)
    if (Object.keys(variableErrors).length > 0) {
      setStatusMessage("Please correct the highlighted fields before sending.")
      return
    }

    setIsSending(true)
    try {
      const rendered = await sendEmailPreview({
        templateId: template.id,
        variables,
        recipientEmail,
        branding: brandingPayload,
      })
      setPreview(rendered)
      setStatusMessage("Email sent successfully using the locked template.")
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to send email.")
    } finally {
      setIsSending(false)
    }
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
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <div className="space-y-5 rounded-[26px] border border-white/10 bg-white/[0.03] px-6 py-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Locked email template</p>
            <h1 className="font-serif text-[2.2rem] tracking-[-0.03em] text-white">{template.name}</h1>
            <p className="text-sm leading-7 text-slate-300">
              The email layout is fixed in the backend. Teams can only fill approved variables, preview the result, and send the final message.
            </p>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Template metadata</p>
              <p className="text-sm text-white">{template.subject}</p>
              <p className="text-sm leading-6 text-slate-300">{template.previewText}</p>
              <p className="text-sm text-slate-400">Category: {template.category}</p>
            </div>
          </div>

          <FieldBlock label="Recipient Email" hint="Used only for delivery. This does not affect the locked template layout.">
            <Input
              value={recipientEmail}
              onChange={(event) => setRecipientEmail(event.target.value)}
              className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
              placeholder="client@example.com"
            />
            {errors.recipientEmail ? <p className="text-sm text-rose-200">{errors.recipientEmail}</p> : null}
          </FieldBlock>

          <div className="grid gap-4 md:grid-cols-2">
            {template.variables.map((variable) => (
              <FieldBlock
                key={variable.key}
                label={variable.label}
                hint={variable.helpText}
              >
                <Input
                  value={variables[variable.key] ?? ""}
                  onChange={(event) => handleVariableChange(variable.key, event.target.value)}
                  className="rounded-2xl border-white/10 bg-white/[0.04] text-white"
                  placeholder={variable.placeholder}
                />
                {errors[variable.key] ? <p className="text-sm text-rose-200">{errors[variable.key]}</p> : null}
              </FieldBlock>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
            <div className="space-y-1">
              <p>Last edited: {template.lastEdited}</p>
              <p>Last used: {template.lastUsed ?? "Not yet used"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="app-button-secondary rounded-full"
                onClick={() => setVariables(buildInitialValues(template.variables))}
              >
                <RefreshCcw className="size-4" />
                Reset values
              </Button>
              <Button className="rounded-full" onClick={handleSend} disabled={isSending || isPreviewing}>
                {isSending ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
                Send email
              </Button>
            </div>
          </div>

          {statusMessage ? (
            <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
              {statusMessage}
            </div>
          ) : null}
        </div>

        <div className="space-y-5 rounded-[26px] border border-white/10 bg-white/[0.03] px-6 py-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Rendered preview</p>
            <h2 className="font-serif text-[2rem] tracking-[-0.03em] text-white">Live email preview</h2>
            <p className="text-sm leading-7 text-slate-300">
              This is the exact locked layout the client receives. The interface only controls approved variables.
            </p>
          </div>

          {isPreviewing ? (
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-6 py-10 text-sm leading-7 text-slate-300">
              <div className="flex items-center gap-3">
                <LoaderCircle className="size-4 animate-spin" />
                Rendering email preview
              </div>
            </div>
          ) : preview ? (
            <>
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
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-sm leading-7 text-slate-300">
              <div className="flex items-center gap-3">
                <Mail className="size-4" />
                Fill the approved variables to render the email preview.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
