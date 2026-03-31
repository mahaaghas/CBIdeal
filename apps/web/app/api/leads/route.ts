import { NextResponse } from "next/server"
import {
  businessLeadSchema,
  buildBusinessLeadInsert,
  buildInvestorLeadInsert,
  investorLeadSchema,
} from "@/lib/lead-intake"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const INVESTOR_LEADS_TABLE = "investor_leads"
const COMPANY_INQUIRIES_TABLE = "company_inquiries"

function buildReferenceId(prefix: "INV" | "COM", recordId: string | null) {
  const suffix = recordId ? recordId.replace(/-/g, "").slice(0, 8).toUpperCase() : Date.now().toString().slice(-8)
  return `CBI-${prefix}-${suffix}`
}

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const formType = typeof body?.formType === "string" ? body.formType : null

    if (formType !== "b2c" && formType !== "b2b") {
      return NextResponse.json({ ok: false, message: "We could not identify the form type." }, { status: 400 })
    }

    const validation =
      formType === "b2c" ? investorLeadSchema.safeParse(body) : businessLeadSchema.safeParse(body)

    if (!validation.success) {
      const flattened = validation.error.flatten()
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
    const tableName = formType === "b2c" ? INVESTOR_LEADS_TABLE : COMPANY_INQUIRIES_TABLE
    const payload =
      formType === "b2c" ? buildInvestorLeadInsert(validation.data) : buildBusinessLeadInsert(validation.data)

    const { data, error } = await supabase.from(tableName).insert(payload).select("id").single()

    if (error) {
      console.error("Lead submission insert failed:", error)
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
      referenceId: buildReferenceId(formType === "b2c" ? "INV" : "COM", data?.id ?? null),
    })
  } catch (error) {
    console.error("Lead request failed:", error)
    return NextResponse.json(
      {
        ok: false,
        message: "We could not process your enquiry right now. Please try again shortly.",
      },
      { status: 500 },
    )
  }
}
