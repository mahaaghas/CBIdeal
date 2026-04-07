import { NextResponse } from "next/server"
import {
  consultationBudgetOptions,
  consultationContactMethodOptions,
  consultationFamilyApplicationOptions,
  consultationInterestOptions,
  consultationRequestSchema,
  consultationTimelineOptions,
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
import { sendLeadNotificationEmail } from "@/lib/lead-notifications"

const CONSULTATION_NOTIFICATION_RECIPIENTS = [
  "sales@cbideal.nl",
  "va.agency.hirings@gmail.com",
]

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

function optionLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value?: string | null,
) {
  if (!value) return undefined
  return options.find((option) => option.value === value)?.label ?? value
}

function getNotificationRecipients() {
  const configured = process.env.CONSULTATION_NOTIFICATION_EMAILS
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)

  return configured && configured.length > 0 ? configured : CONSULTATION_NOTIFICATION_RECIPIENTS
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
    const notificationRecipients = getNotificationRecipients()

    console.info("[consultation] request received", {
      referenceId,
      sourcePage: values.sourcePage,
      sourceCategory: values.sourceCategory || "consultation",
      email: maskEmail(values.email),
    })

    await createConsultationSubmissionRecord({
      referenceId,
      values,
      recipients: notificationRecipients,
      submittedAt: timestamp,
      sourceUrl: pageUrl,
      userAgent,
    })

    let emailResult: Awaited<ReturnType<typeof sendLeadNotificationEmail>> | null = null

    try {
      emailResult = await sendLeadNotificationEmail({
        category: "Consultation request",
        referenceId,
        pageUrl,
        timestamp,
        subject: "New Consultation Request - CBI Deal Website",
        to: notificationRecipients,
        replyTo: values.email,
        fields: [
          { label: "Full name", value: values.fullName },
          { label: "Email", value: values.email },
          { label: "Phone / WhatsApp", value: values.phoneWhatsApp },
          { label: "Country of residence", value: values.countryOfResidence },
          { label: "Nationality", value: values.nationality },
          { label: "Interested in", value: optionLabel(consultationInterestOptions, values.interestedIn) },
          { label: "Budget range", value: optionLabel(consultationBudgetOptions, values.budgetRange) },
          {
            label: "Preferred contact method",
            value: optionLabel(consultationContactMethodOptions, values.preferredContactMethod),
          },
          {
            label: "Family application",
            value: optionLabel(consultationFamilyApplicationOptions, values.familyApplication),
          },
          { label: "Timeline", value: optionLabel(consultationTimelineOptions, values.timeline) },
          { label: "Current residency status", value: values.currentResidencyStatus },
          { label: "Message", value: values.message },
          { label: "Language", value: values.language },
          { label: "Source category", value: values.sourceCategory || "consultation" },
          { label: "Source page", value: values.sourcePage },
          { label: "Source URL", value: pageUrl },
          { label: "Campaign", value: values.campaign },
          { label: "User agent", value: userAgent },
        ],
      })

      await markConsultationEmailSuccess(referenceId, emailResult?.id ?? null)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown email delivery error"

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

    try {
      const crmRecordId = await syncConsultationToLeadInbox(values)
      await markConsultationCrmSyncSuccess(referenceId, crmRecordId)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown CRM sync error"

      console.error("[consultation] lead inbox sync failed", {
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

    console.info("[consultation] request delivered", {
      referenceId,
      emailId: emailResult?.id ?? null,
    })

    return NextResponse.json({
      ok: true,
      referenceId,
    })
  } catch (error) {
    console.error("[consultation] request failed", {
      referenceId,
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json(
      {
        ok: false,
        message:
          "We could not send your consultation request right now. Please try again in a moment or contact us directly.",
      },
      { status: 500 },
    )
  }
}
