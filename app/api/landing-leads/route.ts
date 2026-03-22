import { NextResponse } from "next/server"
import {
  buildLandingLeadNotes,
  landingLeadFormSchema,
  normalizeOptionalLandingValue,
  type LandingLeadFormValues,
} from "@/lib/landing-form"
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
    nationality: values.nationality,
    residence_country: values.currentResidence,
    preferred_destination: null,
    budget_range: values.budgetRange,
    timeline: normalizeOptionalLandingValue(values.timeline ?? undefined),
    applicant_type: null,
    program_type: "citizenship",
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

    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from(INVESTOR_LEADS_TABLE)
      .insert(buildInvestorLeadRow(validationResult.data))
      .select("id")
      .single()

    if (error) {
      console.error("Supabase landing lead insert failed:", error)

      return NextResponse.json(
        {
          ok: false,
          message: "We could not store your enquiry right now. Please try again shortly.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      ok: true,
      referenceId: buildReferenceId(data?.id ?? null),
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
