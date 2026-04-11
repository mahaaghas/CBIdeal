import { NextResponse } from "next/server"
import {
  consultationRequestSchema,
  type ConsultationRequestValues,
} from "@/lib/consultation-form"
import {
  insertConsultationSubmissionRecord,
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
import { getSupabaseBrowserConfig, getSupabaseServerConfig } from "@/lib/supabase/config"

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
    console.info("CONSULTATION REQUEST RECEIVED")

    const browserConfig = getSupabaseBrowserConfig()
    const serverConfig = getSupabaseServerConfig()
    const body = (await request.json()) as Partial<ConsultationRequestValues>
    console.info("[consultation] env presence", {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()),
      SUPABASE_SECRET_KEY: Boolean(process.env.SUPABASE_SECRET_KEY?.trim()),
      SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
      resolvedBrowserUrl: Boolean(browserConfig.url),
      resolvedBrowserKey: Boolean(browserConfig.publishableKey),
      resolvedServerKey: Boolean(serverConfig.secretKey),
    })
    console.info("[consultation] payload keys", Object.keys(body ?? {}).sort())
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
      email: maskEmail(values.email),
    })

    try {
      const insertResult = await insertConsultationSubmissionRecord({
        referenceId,
        values,
        recipients: notificationConfig.recipients,
        submittedAt: timestamp,
        sourceUrl: pageUrl,
        userAgent,
      })

      console.info("[consultation] target table", insertResult.table)
      console.info("[consultation] insert payload", insertResult.payload)
      console.info("[consultation] supabase response", insertResult)

      if (insertResult.error) {
        console.error("[consultation] supabase error", insertResult.error)
        console.error("[consultation] failure reason returned to frontend", "Supabase insert returned an error object.")
        throw new Error(`Consultation submission insert failed: ${insertResult.error.message}`)
      }

      console.info("[consultation] supabase insert succeeded", {
        referenceId,
        table: insertResult.table,
      })
    } catch (error) {
      console.error("[consultation] supabase insert failed", {
        referenceId,
        table: "consultation_submissions",
        error: error instanceof Error ? error.message : "Unknown insert error",
      })
      console.error(
        "[consultation] failure reason returned to frontend",
        error instanceof Error ? error.message : "Unknown insert error",
      )
      throw error
    }

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

    void (async () => {
      try {
        const crmRecordId = await syncConsultationToLeadInbox(values)
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

        try {
          await markConsultationCrmSyncFailure(referenceId, message)
        } catch (updateError) {
          console.error("[consultation] CRM sync failure could not be recorded", {
            referenceId,
            error: updateError instanceof Error ? updateError.message : "Unknown update error",
          })
        }
      }

      try {
        const emailResult = await sendConsultationNotificationEmail({
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
      }
    })()

    return response
  } catch (error) {
    console.error("[consultation] request failed", {
      referenceId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    console.error(
      "[consultation] failure reason returned to frontend",
      error instanceof Error ? error.message : "Unknown error",
    )

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
