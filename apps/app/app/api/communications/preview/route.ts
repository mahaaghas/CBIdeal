import { NextResponse } from "next/server"
import { renderLockedEmailTemplate } from "@/lib/locked-email-templates"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      templateId?: string
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

    const rendered = renderLockedEmailTemplate(body.templateId, body.variables ?? {}, body.branding)

    return NextResponse.json({ ok: true, rendered })
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unable to render email preview." },
      { status: 400 },
    )
  }
}
