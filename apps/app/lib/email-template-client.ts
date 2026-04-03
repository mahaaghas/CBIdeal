export interface RenderedEmailPreview {
  subject: string
  previewText: string
  htmlBody: string
  textBody: string
}

interface EmailTemplateApiPayload {
  templateId: string
  variables: Record<string, string>
  branding?: {
    companyName?: string
    senderName?: string
    replyTo?: string
    primaryColor?: string
  }
}

export async function fetchEmailPreview(payload: EmailTemplateApiPayload): Promise<RenderedEmailPreview> {
  const response = await fetch("/api/communications/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => null)) as
    | { ok: true; rendered: RenderedEmailPreview }
    | { ok: false; message: string }
    | null

  if (!response.ok || !data || !("ok" in data) || !data.ok) {
    throw new Error(data && "message" in data ? data.message : "Unable to render email preview.")
  }

  return data.rendered
}

export async function sendEmailPreview(
  payload: EmailTemplateApiPayload & { recipientEmail: string },
): Promise<RenderedEmailPreview> {
  const response = await fetch("/api/communications/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => null)) as
    | { ok: true; rendered: RenderedEmailPreview }
    | { ok: false; message: string }
    | null

  if (!response.ok || !data || !("ok" in data) || !data.ok) {
    throw new Error(data && "message" in data ? data.message : "Unable to send email.")
  }

  return data.rendered
}
