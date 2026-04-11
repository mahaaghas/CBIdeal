import { Resend } from "resend"
import type { ConsultationRequestValues } from "@/lib/consultation-form"

interface ConsultationNotificationField {
  label: string
  value?: string | null
}

interface SendConsultationNotificationInput {
  referenceId: string
  submittedAt: string
  pageUrl: string
  values: ConsultationRequestValues
  userAgent: string
}

function splitRecipients(value?: string | null) {
  return value
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean) ?? []
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function normalizeValue(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : "Not provided"
}

function buildRows(fields: ConsultationNotificationField[]) {
  return fields
    .map((field) => {
      const value = normalizeValue(field.value)
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #e8ebf0;font-size:13px;font-weight:600;line-height:1.5;color:#435066;vertical-align:top;width:34%;">
            ${escapeHtml(field.label)}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #e8ebf0;font-size:14px;line-height:1.7;color:#111827;vertical-align:top;">
            ${escapeHtml(value).replaceAll("\n", "<br />")}
          </td>
        </tr>
      `
    })
    .join("")
}

function buildFields(input: SendConsultationNotificationInput): ConsultationNotificationField[] {
  const { values, pageUrl, userAgent } = input

  return [
    { label: "Full name", value: values.fullName },
    { label: "Email", value: values.email },
    { label: "Phone / WhatsApp", value: values.phoneWhatsApp },
    { label: "Country of residence", value: values.countryOfResidence },
    { label: "Nationality", value: values.nationality },
    { label: "Interested in", value: values.interestedIn },
    { label: "Budget range", value: values.budgetRange },
    { label: "Preferred contact method", value: values.preferredContactMethod },
    { label: "Family application", value: values.familyApplication },
    { label: "Timeline", value: values.timeline },
    { label: "Current residency status", value: values.currentResidencyStatus },
    { label: "Message", value: values.message },
    { label: "Language", value: values.language },
    { label: "Source category", value: values.sourceCategory },
    { label: "Source page", value: values.sourcePage },
    { label: "Source URL", value: pageUrl },
    { label: "Campaign", value: values.campaign },
    { label: "User agent", value: userAgent },
  ]
}

function buildHtmlBody(input: SendConsultationNotificationInput) {
  const fields = buildFields(input)

  return `
    <div style="margin:0;padding:32px 0;background:#f4f1ea;font-family:Inter,Segoe UI,Arial,sans-serif;color:#111827;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e6e0d3;border-radius:24px;overflow:hidden;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
        <tr>
          <td style="padding:28px 32px;background:#1e2a3d;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#d6dde8;">Consultation request</p>
            <h1 style="margin:0;font-size:28px;line-height:1.2;font-family:Georgia,'Times New Roman',serif;font-weight:600;color:#f8f6f1;">New private consultation request</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e8ebf0;border-radius:18px;overflow:hidden;background:#fcfbf8;">
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e8ebf0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Reference</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e8ebf0;font-size:14px;font-weight:600;color:#111827;">${escapeHtml(input.referenceId)}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e8ebf0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Page URL</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e8ebf0;font-size:14px;color:#111827;">${escapeHtml(input.pageUrl)}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Submitted at</td>
                <td style="padding:12px 16px;font-size:14px;color:#111827;">${escapeHtml(input.submittedAt)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e8ebf0;border-radius:18px;overflow:hidden;">
              ${buildRows(fields)}
            </table>
          </td>
        </tr>
      </table>
    </div>
  `
}

function buildTextBody(input: SendConsultationNotificationInput) {
  const fields = buildFields(input)

  return [
    "New private consultation request",
    "",
    `Reference: ${input.referenceId}`,
    `Page URL: ${input.pageUrl}`,
    `Submitted at: ${input.submittedAt}`,
    "",
    ...fields.map((field) => `${field.label}: ${normalizeValue(field.value)}`),
  ].join("\n")
}

export function getConsultationNotificationConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || null
  const fromEmail =
    process.env.CONSULTATION_FROM_EMAIL?.trim() ||
    process.env.LEAD_NOTIFICATIONS_FROM_EMAIL?.trim() ||
    null
  const recipients = [
    ...splitRecipients(process.env.CONSULTATION_NOTIFICATION_EMAIL),
    ...splitRecipients(process.env.CONSULTATION_NOTIFICATION_EMAILS),
  ]

  return {
    apiKey,
    fromEmail,
    recipients: Array.from(new Set(recipients)),
  }
}

export async function sendConsultationNotificationEmail(input: SendConsultationNotificationInput) {
  const { apiKey, fromEmail, recipients } = getConsultationNotificationConfig()

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY for consultation notifications.")
  }

  if (!fromEmail) {
    throw new Error("Missing CONSULTATION_FROM_EMAIL for consultation notifications.")
  }

  if (recipients.length === 0) {
    throw new Error("Missing CONSULTATION_NOTIFICATION_EMAIL for consultation notifications.")
  }

  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: recipients,
    subject: "New Consultation Request - CBI Deal Website",
    html: buildHtmlBody(input),
    text: buildTextBody(input),
    replyTo: input.values.email,
  })

  if (error) {
    throw new Error(`Resend consultation notification failed: ${error.message}`)
  }

  return {
    messageId: data?.id ?? null,
    recipients,
    fromEmail,
  }
}
