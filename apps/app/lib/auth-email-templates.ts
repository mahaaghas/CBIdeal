import "server-only"

import { authRoutes } from "@/lib/auth-flow"

export type SupabaseAuthTemplateId = "confirm-signup" | "reset-password" | "workspace-invite"

type AuthEmailTemplateDefinition = {
  id: SupabaseAuthTemplateId
  subject: string
  title: string
  intro: string
  body: string
  ctaLabel: string
  ctaHref: string
  note: string
  supportingLine?: string
}

const siteUrlToken = "{{ .SiteURL }}"
const tokenHashToken = "{{ .TokenHash }}"

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function withSiteUrl(pathname: string, type: string) {
  const url = new URL(pathname, `${siteUrlToken}/`)
  url.searchParams.set("token_hash", tokenHashToken)
  url.searchParams.set("type", type)
  return url.toString()
}

const templateDefinitions: AuthEmailTemplateDefinition[] = [
  {
    id: "confirm-signup",
    subject: "Confirm your email to continue",
    title: "Confirm your email",
    intro: "You're almost set.",
    body: "Please confirm your email to continue setting up your account.",
    ctaLabel: "Confirm email",
    ctaHref: withSiteUrl(authRoutes.confirm, "email"),
    note: "If you didn't create this account, you can ignore this email.",
  },
  {
    id: "reset-password",
    subject: "Reset your password",
    title: "Reset your password",
    intro: "We received a request to reset your password.",
    body: "Click below to choose a new one.",
    ctaLabel: "Reset password",
    ctaHref: withSiteUrl(authRoutes.resetPassword, "recovery"),
    note: "If you didn't request this, you can safely ignore this email.",
  },
  {
    id: "workspace-invite",
    subject: "You've been invited to join a workspace",
    title: "You've been invited",
    intro: "You've been invited to join a workspace.",
    body: "Click below to accept the invitation and set up your account.",
    ctaLabel: "Accept invitation",
    ctaHref: withSiteUrl(authRoutes.inviteAccept, "invite"),
    note: "If you weren't expecting this, you can ignore this email.",
    supportingLine: "This invitation may expire after a limited period for security reasons.",
  },
]

function renderAuthEmailShell(template: AuthEmailTemplateDefinition) {
  const pieces = [
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1ea;padding:28px 0;font-family:Inter,Segoe UI,Arial,sans-serif;color:#223047;">`,
    `<tr><td align="center">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e2ddd3;border-radius:24px;overflow:hidden;box-shadow:0 16px 40px rgba(24,34,48,0.06);">`,
    `<tr><td style="padding:28px 36px 18px;">`,
    `<div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#7f8b9f;font-weight:700;">CBI Deal</div>`,
    `<div style="margin-top:10px;height:1px;background:#ece7dd;"></div>`,
    `</td></tr>`,
    `<tr><td style="padding:8px 36px 36px;">`,
    `<h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.06;color:#223047;font-weight:600;">${escapeHtml(template.title)}</h1>`,
    `<p style="margin:0 0 12px;font-size:16px;line-height:1.75;color:#44546b;">${escapeHtml(template.intro)}</p>`,
    `<p style="margin:0 0 26px;font-size:16px;line-height:1.75;color:#44546b;">${escapeHtml(template.body)}</p>`,
    `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#5b78a2;">`,
    `<a href="${template.ctaHref}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:#5b78a2;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">${escapeHtml(template.ctaLabel)}</a>`,
    `</td></tr></table>`,
  ]

  if (template.supportingLine) {
    pieces.push(
      `<p style="margin:20px 0 0;font-size:13px;line-height:1.7;color:#66748a;">${escapeHtml(template.supportingLine)}</p>`,
    )
  }

  pieces.push(
    `<p style="margin:20px 0 0;font-size:13px;line-height:1.7;color:#66748a;">${escapeHtml(template.note)}</p>`,
    `<div style="margin-top:28px;padding-top:18px;border-top:1px solid #ece7dd;font-size:12px;line-height:1.7;color:#7f8b9f;">CBI Deal<br/>Private advisory platform</div>`,
    `</td></tr></table>`,
    `</td></tr></table>`,
  )

  return pieces.join("")
}

function renderPlainText(template: AuthEmailTemplateDefinition) {
  return [
    template.title,
    "",
    template.intro,
    template.body,
    "",
    `${template.ctaLabel}: ${template.ctaHref}`,
    "",
    template.supportingLine ?? "",
    template.note,
    "",
    "CBI Deal",
    "Private advisory platform",
  ]
    .filter(Boolean)
    .join("\n")
}

export function getSupabaseAuthEmailTemplates() {
  return templateDefinitions.map((template) => ({
    id: template.id,
    subject: template.subject,
    html: renderAuthEmailShell(template),
    text: renderPlainText(template),
    ctaHref: template.ctaHref,
  }))
}

export function getSupabaseAuthEmailTemplate(templateId: SupabaseAuthTemplateId) {
  const template = getSupabaseAuthEmailTemplates().find((entry) => entry.id === templateId)
  if (!template) {
    throw new Error("Auth email template not found.")
  }

  return template
}
