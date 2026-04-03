import { NextResponse } from "next/server"
import {
  buildLandingLeadNotes,
  landingLeadFormSchema,
  normalizeOptionalLandingValue,
  type LandingLeadFormValues,
} from "@/lib/landing-form"
import {
  buildSubmissionPageUrl,
  sendLeadNotificationEmail,
} from "@/lib/lead-notifications"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const INVESTOR_LEADS_TABLE = "investor_leads"

function buildReferenceId(recordId: string | null) {
  const suffix = recordId ? recordId.replace(/-/g, "").slice(0, 8).toUpperCase() : Date.now().toString().slice(-8)
  return `CBI-LDG-${suffix}`
}

function buildInvestorLeadRow(values: LandingLeadFormValues) {
  return {
    full_name: values.fullName,
    email: normalizeOptionalLandingValue(values.email ?? undefined),
    phone_whatsapp: values.whatsapp,
    nationality: null,
    residence_country: null,
    preferred_destination: normalizeOptionalLandingValue(values.regionOfInterest),
    budget_range: normalizeOptionalLandingValue(values.budgetRange ?? undefined),
    timeline: normalizeOptionalLandingValue(values.timeline ?? undefined),
    applicant_type: values.applicationScope,
    program_type: values.areaOfInterest,
    notes: buildLandingLeadNotes(values),
    source_page: values.sourcePage,
  }
}

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LandingLeadFormValues>
    const validationResult = landingLeadFormSchema.safeParse(body)

    if (!validationResult.success) {
      const flattened = validationResult.error.flatten()

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
    const referenceId = buildReferenceId(null)
    const pageUrl = buildSubmissionPageUrl(request, values.sourcePage)

    await sendLeadNotificationEmail({
      category: "Landing consultation form",
      referenceId,
      pageUrl,
      timestamp,
      replyTo: values.email,
      fields: [
        { label: "Lead type", value: "Consultation / landing enquiry" },
        { label: "Full name", value: values.fullName },
        { label: "Email", value: values.email },
        { label: "Phone", value: values.whatsapp },
        { label: "Area of interest", value: values.areaOfInterest },
        { label: "Region of interest", value: values.regionOfInterest },
        { label: "Family size / dependents", value: values.applicationScope },
        { label: "Budget / investment range", value: values.budgetRange },
        { label: "Timeline", value: values.timeline },
        { label: "Message / notes", value: values.notes },
        { label: "Language", value: values.language },
        { label: "Source category", value: values.sourceCategory },
      ],
    })

    const supabase = getSupabaseServerClient()
    const { error } = await supabase
      .from(INVESTOR_LEADS_TABLE)
      .insert(buildInvestorLeadRow(values))

    if (error) {
      console.error("Supabase landing lead insert failed after email notification:", error)
    }

    return NextResponse.json({
      ok: true,
      referenceId,
    })
  } catch (error) {
    console.error("Landing lead submission failed:", error)

    return NextResponse.json(
      {
        ok: false,
        message: "We could not process your enquiry right now. Please try again shortly.",
      },
      { status: 500 },
    )
  }
}
