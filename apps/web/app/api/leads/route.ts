import { NextResponse } from "next/server"
import type { LeadSubmissionInput, LeadFormType } from "@/lib/forms"
import { buildLeadFormSchema, leadFormTypeSchema } from "@/lib/forms"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const INVESTOR_LEADS_TABLE = "investor_leads"
const COMPANY_INQUIRIES_TABLE = "company_inquiries"

function toNullableText(value: string | undefined) {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function buildReferenceId(formType: LeadFormType, recordId: string | null) {
  const prefix = formType === "investor" ? "INV" : "COM"
  const suffix = recordId ? recordId.replace(/-/g, "").slice(0, 8).toUpperCase() : Date.now().toString().slice(-8)

  return `CBI-${prefix}-${suffix}`
}

function buildInvestorLeadRow(values: LeadSubmissionInput) {
  return {
    full_name: values.fullName,
    email: values.email,
    phone_whatsapp: values.phone,
    nationality: values.countryOfCitizenship,
    residence_country: values.currentResidence,
    preferred_destination: values.preferredDestination,
    budget_range: values.budgetRange,
    timeline: values.timeframe,
    applicant_type: values.applicantScope,
    program_type: values.programInterest,
    notes: toNullableText(values.notes),
    source_page: values.source,
  }
}

function buildCompanyInquiryRow(values: LeadSubmissionInput) {
  const messageParts = [toNullableText(values.notes)]
  const metadata = {
    requested_timeframe: values.timeframe,
    enquiry_type: values.formType,
  }

  return {
    company_name: values.companyName,
    contact_person: values.fullName,
    work_email: values.email,
    phone_whatsapp: values.phone,
    region_served: values.regionServed,
    team_size: values.teamSize,
    interest_type: values.businessInterest,
    message: messageParts.filter(Boolean).join("\n\n") || null,
    source_page: values.source,
    metadata,
  }
}

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LeadSubmissionInput>
    const formTypeResult = leadFormTypeSchema.safeParse(body.formType)

    if (!formTypeResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "We could not identify the enquiry type.",
        },
        { status: 400 },
      )
    }

    const source = typeof body.source === "string" ? body.source.trim() : ""

    if (!source) {
      return NextResponse.json(
        {
          ok: false,
          message: "We could not identify the source page for this enquiry.",
        },
        { status: 400 },
      )
    }

    const formType = formTypeResult.data
    const validationResult = buildLeadFormSchema(formType).safeParse(body)

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

    const values: LeadSubmissionInput = {
      ...validationResult.data,
      formType,
      source,
    }

    const supabase = getSupabaseServerClient()

    const tableName = formType === "investor" ? INVESTOR_LEADS_TABLE : COMPANY_INQUIRIES_TABLE
    const insertPayload =
      formType === "investor" ? buildInvestorLeadRow(values) : buildCompanyInquiryRow(values)

    const { data, error } = await supabase
      .from(tableName)
      .insert(insertPayload)
      .select("id")
      .single()

    if (error) {
      console.error("Supabase lead insert failed:", error)

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
      referenceId: buildReferenceId(formType, data?.id ?? null),
    })
  } catch (error) {
    console.error("Lead submission failed:", error)

    return NextResponse.json(
      {
        ok: false,
        message: "We could not process your enquiry right now. Please try again shortly.",
      },
      { status: 500 },
    )
  }
}
