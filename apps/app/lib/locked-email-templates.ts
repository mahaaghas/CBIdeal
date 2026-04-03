import "server-only"

import { buildSaasAppUrl, normalizeSaasAppHref } from "@cbideal/config"
import { emailTemplates, type EmailTemplateRecord } from "@/lib/communication-data"

export interface LockedTemplateBranding {
  companyName: string
  senderName: string
  replyTo: string
  primaryColor?: string
}

export interface RenderedLockedEmail {
  subject: string
  previewText: string
  htmlBody: string
  textBody: string
}

const defaultBranding: LockedTemplateBranding = {
  companyName: "CBI Deal Advisory",
  senderName: "CBI Deal Advisory",
  replyTo: "private@cbideal.nl",
  primaryColor: "#5b7096",
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function sanitizeUrl(value: string) {
  const parsed = new URL(value)
  return parsed.toString()
}

function validateEmailValue(template: EmailTemplateRecord, values: Record<string, string>) {
  const issues: string[] = []

  template.variables.forEach((variable) => {
    const raw = values[variable.key]?.trim() ?? ""

    if (variable.required && raw.length === 0) {
      issues.push(`${variable.label} is required.`)
      return
    }

    if (raw.length === 0) return

    if (variable.type === "url") {
      try {
        sanitizeUrl(raw)
      } catch {
        issues.push(`${variable.label} must be a valid URL.`)
      }
    }
  })

  return issues
}

function shell(headline: string, body: string, ctaLabel: string, ctaHref: string, branding: LockedTemplateBranding) {
  const primary = branding.primaryColor ?? defaultBranding.primaryColor!

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:24px 0;font-family:Manrope,Arial,sans-serif;color:#223047;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:640px;background:#ffffff;border-radius:20px;overflow:hidden;">
          <tr>
            <td style="background:${primary};padding:24px 32px;">
              <div style="font-family:Cormorant Garamond,Georgia,serif;font-size:30px;line-height:1.05;color:#ffffff;">${escapeHtml(branding.companyName)}</div>
              <div style="margin-top:10px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#d7dce6;">Private client communication</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px;font-family:Cormorant Garamond,Georgia,serif;font-size:34px;line-height:1.08;color:#223047;">${headline}</h1>
              <div style="font-size:16px;line-height:1.8;color:#4e5a6f;">${body}</div>
              <div style="margin-top:28px;">
                <a href="${ctaHref}" style="display:inline-block;background:${primary};color:#f8fafc;text-decoration:none;padding:13px 22px;border-radius:999px;font-size:14px;font-weight:600;">${ctaLabel}</a>
              </div>
              <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e7ebf2;font-size:13px;line-height:1.8;color:#66728a;">
                ${escapeHtml(branding.senderName)}<br/>
                ${escapeHtml(branding.companyName)}<br/>
                ${escapeHtml(branding.replyTo)}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`
}

function buildTemplateContent(templateId: string, values: Record<string, string>, branding: LockedTemplateBranding) {
  const v = (key: string) => escapeHtml(values[key] ?? "")
  const text = (key: string) => values[key] ?? ""
  const url = (key: string, fallback = buildSaasAppUrl("/portal")) => {
    const value = values[key]?.trim()
    if (!value) return fallback
    return sanitizeUrl(normalizeSaasAppHref(value, fallback))
  }

  switch (templateId) {
    case "tpl-missing-document":
      return {
        headline: "A document is still required",
        body: `<p>Dear ${v("client_name")},</p><p>We still require <strong>${v("document_name")}</strong> in order to keep <strong>${v("case_name")}</strong> moving without delay.</p><p>You can upload the item securely through the portal using the link below.</p>`,
        ctaLabel: "Upload document",
        ctaHref: url("upload_link"),
        textBody:
          `Dear ${text("client_name")},\n\n` +
          `We still require ${text("document_name")} for ${text("case_name")}.\n\n` +
          `You can upload it here: ${text("upload_link")}\n\n` +
          `${text("account_manager_name")}\n${branding.companyName}`,
      }
    case "tpl-document-reupload":
      return {
        headline: "A reviewed document needs to be replaced",
        body: `<p>Dear ${v("client_name")},</p><p>We reviewed <strong>${v("document_name")}</strong> and a revised upload is required before it can be approved.</p><p><strong>Review note:</strong> ${v("rejection_reason")}</p><p>Once updated, the file can be uploaded directly through the portal.</p>`,
        ctaLabel: "Upload revised document",
        ctaHref: url("upload_link"),
        textBody:
          `Dear ${text("client_name")},\n\n` +
          `We reviewed ${text("document_name")} and a revised upload is required.\n\n` +
          `Review note: ${text("rejection_reason")}\n\n` +
          `Please upload the revised file here: ${text("upload_link")}\n\n` +
          `${text("account_manager_name")}\n${branding.companyName}`,
      }
    case "tpl-payment-reminder":
      return {
        headline: "A payment stage is approaching",
        body: `<p>Dear ${v("client_name")},</p><p>This is a quiet reminder that <strong>${v("payment_amount")}</strong> relating to <strong>${v("case_name")}</strong> is approaching its due date on <strong>${v("payment_due_date")}</strong>.</p><p>If the transfer has already been arranged, you may upload the proof directly through the portal.</p>`,
        ctaLabel: "Open payment detail",
        ctaHref: url("portal_link"),
        textBody:
          `Dear ${text("client_name")},\n\n` +
          `This is a reminder that ${text("payment_amount")} relating to ${text("case_name")} is approaching its due date on ${text("payment_due_date")}.\n\n` +
          `You may upload proof through the portal here: ${text("portal_link")}\n\n` +
          `${text("account_manager_name")}\n${branding.companyName}`,
      }
    case "tpl-overdue-payment":
      return {
        headline: "A payment stage remains open",
        body: `<p>Dear ${v("client_name")},</p><p>The payment stage of <strong>${v("payment_amount")}</strong> linked to <strong>${v("case_name")}</strong> remains open beyond the planned date of <strong>${v("payment_due_date")}</strong>.</p><p>Please review the position so the file can keep moving in a controlled way.</p>`,
        ctaLabel: "Review payment stage",
        ctaHref: url("portal_link"),
        textBody:
          `Dear ${text("client_name")},\n\n` +
          `The payment stage of ${text("payment_amount")} linked to ${text("case_name")} remains open beyond the planned date of ${text("payment_due_date")}.\n\n` +
          `Please review the payment stage here: ${text("portal_link")}\n\n` +
          `${text("account_manager_name")}\n${branding.companyName}`,
      }
    case "tpl-quotation-followup":
      return {
        headline: "A brief follow-up on your quotation",
        body: `<p>Dear ${v("client_name")},</p><p>We are following up on <strong>${v("quotation_name")}</strong>, which remains open in relation to <strong>${v("case_name")}</strong>.</p><p>If helpful, we can clarify the structure, timing, or next administrative step before anything further is decided.</p>`,
        ctaLabel: "Open portal view",
        ctaHref: url("portal_link"),
        textBody:
          `Dear ${text("client_name")},\n\n` +
          `We are following up on ${text("quotation_name")}, which remains open in relation to ${text("case_name")}.\n\n` +
          `Please let us know if you would like clarification on structure or next steps.\n\n` +
          `${text("account_manager_name")}\n${branding.companyName}`,
      }
    case "tpl-consultation-confirmation":
      return {
        headline: "Your consultation is noted",
        body: `<p>Dear ${v("client_name")},</p><p>Thank you for arranging an introductory discussion with <strong>${v("company_name")}</strong>.</p><p>We will use the conversation to understand priorities, timing, and the relevant route structure before suggesting any next step.</p>`,
        ctaLabel: "Open your portal",
        ctaHref: url("portal_link"),
        textBody:
          `Dear ${text("client_name")},\n\n` +
          `Thank you for arranging an introductory discussion with ${text("company_name")}.\n\n` +
          `We will use the conversation to understand priorities, timing, and route structure before suggesting any next step.\n\n` +
          `${branding.senderName}`,
      }
    case "tpl-progress-update":
    default:
      return {
        headline: "A progress update on your matter",
        body: `<p>Dear ${v("client_name")},</p><p>This is a concise update regarding <strong>${v("case_name")}</strong>.</p><p>The current position remains structured, and the next step is being managed in line with the agreed process.</p>`,
        ctaLabel: "View recent updates",
        ctaHref: url("portal_link"),
        textBody:
          `Dear ${text("client_name")},\n\n` +
          `This is a concise update regarding ${text("case_name")}.\n\n` +
          `The current position remains structured and the next step is being managed in line with the agreed process.\n\n` +
          `${text("account_manager_name")}\n${branding.companyName}`,
      }
  }
}

export function getLockedTemplateById(templateId: string) {
  return emailTemplates.find((template) => template.id === templateId)
}

export function validateLockedTemplateVariables(templateId: string, values: Record<string, string>) {
  const template = getLockedTemplateById(templateId)
  if (!template) {
    return ["This template is not available."]
  }

  return validateEmailValue(template, values)
}

export function renderLockedEmailTemplate(
  templateId: string,
  values: Record<string, string>,
  brandingPatch?: Partial<LockedTemplateBranding>,
): RenderedLockedEmail {
  const template = getLockedTemplateById(templateId)
  if (!template) {
    throw new Error("Template not found.")
  }

  const branding = {
    ...defaultBranding,
    ...brandingPatch,
  }

  const errors = validateLockedTemplateVariables(templateId, values)
  if (errors.length) {
    throw new Error(errors[0])
  }

  const content = buildTemplateContent(templateId, values, branding)

  const resolveMeta = (input: string) =>
    input.replace(/\{\{(.*?)\}\}/g, (_, key) => values[key.trim()] ?? "")

  return {
    subject: resolveMeta(template.subject),
    previewText: resolveMeta(template.previewText),
    htmlBody: shell(content.headline, content.body, content.ctaLabel, content.ctaHref, branding),
    textBody: content.textBody,
  }
}
