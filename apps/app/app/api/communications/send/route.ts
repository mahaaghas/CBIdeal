import { NextResponse } from "next/server"
import { Resend } from "resend"
import { renderLockedEmailTemplate } from "@/lib/locked-email-templates"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      templateId?: string
      recipientEmail?: string
      variables?: Record<string, string>
      branding?: {
        companyName?: string
        senderName?: string
        replyTo?: string
        primaryColor?: string
      }
    }

    if (!body.templateId) {
      return NextResponse.json({ ok: false, message: "Template ID is required." }, { status: 400 })
    }

    const recipientEmail = body.recipientEmail?.trim() ?? ""
    if (!emailPattern.test(recipientEmail)) {
      return NextResponse.json({ ok: false, message: "A valid recipient email is required." }, { status: 400 })
    }

    const rendered = renderLockedEmailTemplate(body.templateId, body.variables ?? {}, body.branding)

    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.APP_EMAIL_FROM
    const replyTo = body.branding?.replyTo?.trim() || process.env.APP_EMAIL_REPLY_TO || undefined

    if (!apiKey) {
      return NextResponse.json({ ok: false, message: "Missing RESEND_API_KEY." }, { status: 500 })
    }

    if (!from) {
      return NextResponse.json({ ok: false, message: "Missing APP_EMAIL_FROM." }, { status: 500 })
    }

    const resend = new Resend(apiKey)

    await resend.emails.send({
      from,
      to: recipientEmail,
      subject: rendered.subject,
      html: rendered.htmlBody,
      text: rendered.textBody,
      replyTo,
    })

    return NextResponse.json({ ok: true, rendered })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to send email." },
      { status: 400 },
    )
  }
}
