import { NextResponse } from "next/server"
import {
  businessLeadSchema,
  buildBusinessLeadInsert,
  buildInvestorLeadInsert,
  investorLeadSchema,
} from "@/lib/lead-intake"
import {
  buildSubmissionPageUrl,
  sendLeadNotificationEmail,
  type LeadNotificationField,
} from "@/lib/lead-notifications"
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

    const timestamp = new Date().toISOString()
    const referenceId = buildReferenceId(formType === "b2c" ? "INV" : "COM", null)
    const values = validation.data
    const pageUrl = buildSubmissionPageUrl(request, values.sourcePage)
    const notificationFields: LeadNotificationField[] =
      formType === "b2c"
        ? [
            { label: "Lead type", value: "B2C investor intake" },
            { label: "Full name", value: values.fullName },
            { label: "Email", value: values.email },
            { label: "Phone", value: values.phoneWhatsApp },
            { label: "Nationality", value: values.nationality },
            { label: "Country of residence", value: values.countryOfResidence },
            { label: "Family size / dependents", value: values.familyApplication },
            { label: "Budget / investment range", value: values.investmentRange },
            { label: "Selected program", value: values.interestType },
            { label: "Preferred region", value: values.preferredRegion },
            { label: "Preferred contact method", value: values.preferredContactMethod },
            { label: "Timeline", value: values.timeline },
            { label: "Message / notes", value: values.additionalNotes },
            { label: "Campaign", value: values.campaign },
          ]
        : [
            { label: "Lead type", value: "B2B partner / SaaS enquiry" },
            { label: "Company name", value: values.companyName },
            { label: "Contact person", value: values.contactPerson },
            { label: "Email", value: values.workEmail },
            { label: "Phone", value: values.phoneWhatsApp },
            { label: "Country", value: values.country },
            { label: "Services offered", value: values.servicesOffered },
            { label: "Interest", value: values.interest },
            { label: "Client volume", value: values.clientVolume },
            { label: "Campaign", value: values.campaign },
          ]

    await sendLeadNotificationEmail({
      category: formType === "b2c" ? "Investor website form" : "Business website form",
      referenceId,
      pageUrl,
      timestamp,
      replyTo: formType === "b2c" ? values.email : values.workEmail,
      fields: notificationFields,
    })

    const supabase = getSupabaseServerClient()
    const tableName = formType === "b2c" ? INVESTOR_LEADS_TABLE : COMPANY_INQUIRIES_TABLE
    const payload = formType === "b2c" ? buildInvestorLeadInsert(values) : buildBusinessLeadInsert(values)

    const { error } = await supabase.from(tableName).insert(payload)

    if (error) {
      console.error("Lead submission insert failed after email notification:", error)
    }

    return NextResponse.json({
      ok: true,
      referenceId,
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
