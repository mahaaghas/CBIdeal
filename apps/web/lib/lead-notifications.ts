import { Resend } from "resend"

const DEFAULT_SUBJECT = "New CBI Lead - Website Submission"

export interface LeadNotificationField {
  label: string
  value?: string | null
}

interface LeadNotificationPayload {
  category: string
  referenceId: string
  pageUrl: string
  timestamp: string
  replyTo?: string | null
  subject?: string
  to?: string | string[]
  fields: LeadNotificationField[]
}

function splitRecipients(value?: string | string[] | null) {
  if (!value) return []

  const entries = Array.isArray(value) ? value : value.split(",")

  return entries.map((entry) => entry.trim()).filter(Boolean)
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

function buildRows(fields: LeadNotificationField[]) {
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

function buildTextBody(payload: LeadNotificationPayload) {
  const subject = payload.subject?.trim() || DEFAULT_SUBJECT
  const lines = [
    subject,
    "",
    `Category: ${payload.category}`,
    `Reference: ${payload.referenceId}`,
    `Page URL: ${payload.pageUrl}`,
    `Submitted at: ${payload.timestamp}`,
    "",
    ...payload.fields.map((field) => `${field.label}: ${normalizeValue(field.value)}`),
  ]

  return lines.join("\n")
}

function buildHtmlBody(payload: LeadNotificationPayload) {
  const subject = payload.subject?.trim() || DEFAULT_SUBJECT
  return `
    <div style="margin:0;padding:32px 0;background:#f4f1ea;font-family:Inter,Segoe UI,Arial,sans-serif;color:#111827;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e6e0d3;border-radius:24px;overflow:hidden;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
        <tr>
          <td style="padding:28px 32px;background:#1e2a3d;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#d6dde8;">Website lead notification</p>
            <h1 style="margin:0;font-size:28px;line-height:1.2;font-family:Georgia,'Times New Roman',serif;font-weight:600;color:#f8f6f1;">${escapeHtml(subject)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 12px;">
            <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#8b5e3c;">${escapeHtml(payload.category)}</p>
            <p style="margin:0;font-size:14px;line-height:1.8;color:#516074;">A new website submission has been received and routed to the sales inbox.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e8ebf0;border-radius:18px;overflow:hidden;background:#fcfbf8;">
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e8ebf0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Reference</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e8ebf0;font-size:14px;font-weight:600;color:#111827;">${escapeHtml(payload.referenceId)}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #e8ebf0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Page URL</td>
                <td style="padding:12px 16px;border-bottom:1px solid #e8ebf0;font-size:14px;color:#111827;">${escapeHtml(payload.pageUrl)}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Submitted at</td>
                <td style="padding:12px 16px;font-size:14px;color:#111827;">${escapeHtml(payload.timestamp)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #e8ebf0;border-radius:18px;overflow:hidden;">
              ${buildRows(payload.fields)}
            </table>
          </td>
        </tr>
      </table>
    </div>
  `
}

export function buildSubmissionPageUrl(request: Request, sourcePage: string) {
  if (/^https?:\/\//i.test(sourcePage)) return sourcePage

  const normalizedPath = sourcePage === "home" ? "/" : sourcePage.startsWith("/") ? sourcePage : `/${sourcePage}`
  const forwardedHost = request.headers.get("x-forwarded-host")
  const host = forwardedHost ?? request.headers.get("host")
  const protocol =
    request.headers.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https")

  if (!host) return normalizedPath
  return `${protocol}://${host}${normalizedPath}`
}

export async function sendLeadNotificationEmail(payload: LeadNotificationPayload) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.LEAD_NOTIFICATIONS_FROM_EMAIL
  const configuredRecipients = splitRecipients(process.env.LEAD_NOTIFICATION_EMAIL)
  const payloadRecipients = splitRecipients(payload.to)
  const to = payloadRecipients.length > 0 ? payloadRecipients : configuredRecipients
  const subject = payload.subject?.trim() || DEFAULT_SUBJECT

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY for lead submission notifications.")
  }

  if (!from) {
    throw new Error("Missing LEAD_NOTIFICATIONS_FROM_EMAIL for lead submission notifications.")
  }

  if (to.length === 0) {
    throw new Error("Missing notification recipient email for lead submission notifications.")
  }

  const resend = new Resend(apiKey)

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html: buildHtmlBody(payload),
    text: buildTextBody(payload),
    replyTo: payload.replyTo?.trim() ? payload.replyTo : undefined,
  })

  if (error) {
    throw new Error(`Resend email send failed: ${error.message}`)
  }

  return data
}
