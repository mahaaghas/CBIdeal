import { NextResponse } from "next/server"
import {
  consultationRequestSchema,
  type ConsultationRequestValues,
} from "@/lib/consultation-form"
import {
  createConsultationSubmissionRecord,
  markConsultationCrmSyncFailure,
  markConsultationCrmSyncSuccess,
  markConsultationEmailFailure,
  markConsultationEmailSuccess,
  syncConsultationToLeadInbox,
} from "@/lib/consultation-submissions"
import {
  getConsultationNotificationConfig,
  sendConsultationNotificationEmail,
} from "@/lib/consultation-notifications"

export const runtime = "nodejs"

function buildReferenceId() {
  const suffix = `${Date.now().toString().slice(-6)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase()
  return `CBI-CON-${suffix}`
}

function maskEmail(email: string) {
  const [localPart = "", domain = ""] = email.split("@")
  const visibleLocalPart = localPart.slice(0, 2)
  return `${visibleLocalPart}${localPart.length > 2 ? "***" : ""}@${domain}`
}

function buildPageUrl(values: ConsultationRequestValues, request: Request) {
  if (values.sourceUrl?.trim()) {
    return values.sourceUrl.trim()
  }

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  const protocol =
    request.headers.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https")
  const normalizedPath =
    values.sourcePage === "home"
      ? "/"
      : values.sourcePage.startsWith("/")
        ? values.sourcePage
        : `/${values.sourcePage}`

  return host ? `${protocol}://${host}${normalizedPath}` : normalizedPath
}

export async function POST(request: Request) {
  const referenceId = buildReferenceId()

  try {
    const body = (await request.json()) as Partial<ConsultationRequestValues>
    const validationResult = consultationRequestSchema.safeParse(body)

    if (!validationResult.success) {
      const flattened = validationResult.error.flatten()

      console.warn("[consultation] validation failed", {
        referenceId,
        sourcePage: body?.sourcePage,
      })

      return NextResponse.json(
        {
          ok: false,
          message: "Please review the highlighted fields and try again.",
          fieldErrors: flattened.fieldErrors,
        },
        { status: 400 },
      )
    }

    const values = validationResult.data
    const timestamp = new Date().toISOString()
    const pageUrl = buildPageUrl(values, request)
    const userAgent = request.headers.get("user-agent") || "Not provided"
    const notificationConfig = getConsultationNotificationConfig()

    console.info("[consultation] validation passed", {
      referenceId,
      sourcePage: values.sourcePage,
      sourceCategory: values.sourceCategory || "consultation",
    })

    console.info("[consultation] request received", {
      referenceId,
      sourcePage: values.sourcePage,
      sourceCategory: values.sourceCategory || "consultation",
      email: maskEmail(values.email),
    })

    try {
      await createConsultationSubmissionRecord({
        referenceId,
        values,
        recipients: notificationConfig.recipients,
        submittedAt: timestamp,
        sourceUrl: pageUrl,
        userAgent,
      })

      console.info("[consultation] supabase insert succeeded", {
        referenceId,
        table: "consultation_submissions",
      })
    } catch (error) {
      console.error("[consultation] supabase insert failed", {
        referenceId,
        table: "consultation_submissions",
        error: error instanceof Error ? error.message : "Unknown insert error",
      })
      throw error
    }

    let crmRecordId: string | null = null

    try {
      crmRecordId = await syncConsultationToLeadInbox(values)
      await markConsultationCrmSyncSuccess(referenceId, crmRecordId)
      console.info("[consultation] lead inbox insert succeeded", {
        referenceId,
        table: "investor_leads",
        crmRecordId,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown CRM sync error"

      console.error("[consultation] lead inbox insert failed", {
        referenceId,
        error: message,
      })

      await markConsultationCrmSyncFailure(referenceId, message)
      throw error
    }

    let emailResult: Awaited<ReturnType<typeof sendConsultationNotificationEmail>> | null = null

    try {
      emailResult = await sendConsultationNotificationEmail({
        referenceId,
        submittedAt: timestamp,
        pageUrl,
        values,
        userAgent,
      })

      await markConsultationEmailSuccess(referenceId, emailResult.messageId)
      console.info("[consultation] email send succeeded", {
        referenceId,
        emailId: emailResult.messageId,
        recipients: emailResult.recipients,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown email delivery error"

      console.error("[consultation] email send failed", {
        referenceId,
        error: message,
      })

      try {
        await markConsultationEmailFailure(referenceId, message)
      } catch (updateError) {
        console.error("[consultation] email failure could not be recorded", {
          referenceId,
          error: updateError instanceof Error ? updateError.message : "Unknown update error",
        })
      }

      throw error
    }

    console.info("[consultation] request delivered", {
      referenceId,
      crmRecordId,
      emailId: emailResult?.messageId ?? null,
    })

    const response = NextResponse.json({
      ok: true,
      referenceId,
      redirectTo: "/thank-you",
    })

    console.info("[consultation] response returned", {
      referenceId,
      status: 200,
      ok: true,
    })

    return response
  } catch (error) {
    console.error("[consultation] request failed", {
      referenceId,
      error: error instanceof Error ? error.message : "Unknown error",
    })

    const response = NextResponse.json(
      {
        ok: false,
        message:
          "We could not send your consultation request right now. Please try again in a moment or contact us directly.",
      },
      { status: 500 },
    )

    console.info("[consultation] response returned", {
      referenceId,
      status: 500,
      ok: false,
    })

    return response
  }
}
