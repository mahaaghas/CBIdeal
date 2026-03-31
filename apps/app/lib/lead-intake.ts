import {
  buildLeadRecordKey,
  formatLeadDate,
  parseInvestorStructuredNotes,
  type CrmLeadRecord,
  type LeadLifecycleStatus,
} from "@cbideal/config/lead-intake"
import { internalUsers } from "@/lib/mock-data"
import { getSupabaseServerClient } from "@/lib/supabase/server"

type GenericRecord = Record<string, unknown>

const defaultStatus: LeadLifecycleStatus = "New"

const demoLeads: CrmLeadRecord[] = [
  {
    id: "demo-investor-1",
    recordKey: buildLeadRecordKey("B2C", "demo-investor-1"),
    type: "B2C",
    name: "Nadim Al Kareem",
    companyName: null,
    interest: "Citizenship by investment",
    country: "United Arab Emirates",
    campaign: "gulf-investor-q1",
    submittedAtRaw: "2026-03-30T09:18:00Z",
    submittedAt: formatLeadDate("2026-03-30T09:18:00Z"),
    sourcePage: "/citizenship-by-investment",
    email: "nadim.ak@samplemail.com",
    phone: "+971 55 240 1188",
    status: "New",
    assignedManagerName: "Sami K.",
    assignedManagerId: "usr-sami",
    notes: ["Looking for a family-inclusive route with practical travel utility."],
    detailRows: [
      { label: "Interest type", value: "Citizenship by investment" },
      { label: "Preferred region", value: "Caribbean" },
      { label: "Estimated investment range", value: "EUR 300k to EUR 600k" },
      { label: "Nationality", value: "Jordanian" },
      { label: "Country of residence", value: "United Arab Emirates" },
      { label: "Family application", value: "Spouse and children" },
      { label: "Timeline", value: "Within 3 months" },
      { label: "Preferred contact method", value: "WhatsApp" },
    ],
  },
  {
    id: "demo-business-1",
    recordKey: buildLeadRecordKey("B2B", "demo-business-1"),
    type: "B2B",
    name: "Maya Hatem",
    companyName: "Cedar Bridge Advisory",
    interest: "SaaS platform",
    country: "Lebanon",
    campaign: "b2b-platform-outreach",
    submittedAtRaw: "2026-03-29T13:42:00Z",
    submittedAt: formatLeadDate("2026-03-29T13:42:00Z"),
    sourcePage: "/for-companies",
    email: "maya@cedarbridge-demo.com",
    phone: "+961 70 998 441",
    status: "Contacted",
    assignedManagerName: "Maha A.",
    assignedManagerId: "usr-maha",
    notes: ["Wants a calmer client-facing portal and stronger document tracking."],
    detailRows: [
      { label: "Business type", value: "Wealth / private client advisory" },
      { label: "Interest", value: "SaaS platform" },
      { label: "Approximate client volume per year", value: "21-50" },
      { label: "Current challenge", value: "Portal / client experience" },
      { label: "Current CRM / portal", value: "Yes, basic CRM" },
      { label: "Best time to reach", value: "Late afternoon Gulf time" },
    ],
  },
]

function asString(value: unknown) {
  return typeof value === "string" ? value : ""
}

function pickTimestamp(row: GenericRecord) {
  return asString(row.created_at) || asString(row.inserted_at) || new Date().toISOString()
}

function normaliseInvestorLead(row: GenericRecord): CrmLeadRecord {
  const submittedAtRaw = pickTimestamp(row)
  const parsedNotes = parseInvestorStructuredNotes(asString(row.notes))
  const additionalNotes = parsedNotes["Additional notes"]
  const extraNotes = additionalNotes ? [additionalNotes] : []
  const campaign = parsedNotes["Campaign"] || null

  return {
    id: asString(row.id) || crypto.randomUUID(),
    recordKey: buildLeadRecordKey("B2C", asString(row.id) || crypto.randomUUID()),
    type: "B2C",
    name: asString(row.full_name) || "Unnamed investor",
    companyName: null,
    interest: asString(row.program_type) || "Private consultation",
    country: asString(row.residence_country) || asString(row.nationality) || "Not specified",
    campaign,
    submittedAtRaw,
    submittedAt: formatLeadDate(submittedAtRaw),
    sourcePage: asString(row.source_page) || "/",
    email: asString(row.email),
    phone: asString(row.phone_whatsapp),
    status: defaultStatus,
    assignedManagerName: null,
    assignedManagerId: null,
    notes: extraNotes,
    detailRows: [
      { label: "Enquiry type", value: asString(row.program_type) || "Not specified" },
      { label: "Estimated investment range", value: asString(row.budget_range) || "Not specified" },
      { label: "Nationality", value: asString(row.nationality) || "Not specified" },
      { label: "Country of residence", value: asString(row.residence_country) || "Not specified" },
      { label: "Family size", value: parsedNotes["Family application"] || asString(row.applicant_type) || "Not specified" },
      { label: "Timeline", value: asString(row.timeline) || "Not specified" },
      { label: "Preferred contact method", value: parsedNotes["Preferred contact method"] || "Not specified" },
    ],
    rawMessage: asString(row.notes) || null,
  }
}

function normaliseBusinessLead(row: GenericRecord): CrmLeadRecord {
  const submittedAtRaw = pickTimestamp(row)
  const metadata = typeof row.metadata === "object" && row.metadata !== null ? (row.metadata as GenericRecord) : {}
  const message = asString(row.message)
  const lines = message.split("\n").map((line) => line.trim()).filter(Boolean)
  const mapped = new Map<string, string>()

  for (const line of lines) {
    const [label, ...rest] = line.split(":")
    if (!label || rest.length === 0) continue
    mapped.set(label.trim(), rest.join(":").trim())
  }

  return {
    id: asString(row.id) || crypto.randomUUID(),
    recordKey: buildLeadRecordKey("B2B", asString(row.id) || crypto.randomUUID()),
    type: "B2B",
    name: asString(row.contact_person) || "Professional contact",
    companyName: asString(row.company_name) || "Professional firm",
    interest:
      asString(row.interest_type) || asString(metadata.interest) || asString(metadata.requested_interest) || "Professional discussion",
    country: asString(metadata.country) || asString(row.region_served) || "Not specified",
    campaign: asString(metadata.campaign) || mapped.get("Campaign") || null,
    submittedAtRaw,
    submittedAt: formatLeadDate(submittedAtRaw),
    sourcePage: asString(row.source_page) || "/",
    email: asString(row.work_email),
    phone: asString(row.phone_whatsapp),
    status: defaultStatus,
    assignedManagerName: null,
    assignedManagerId: null,
    notes: mapped.get("Additional notes") ? [mapped.get("Additional notes") as string] : [],
    detailRows: [
      { label: "Services offered", value: asString(metadata.services_offered) || mapped.get("Services offered") || "Not specified" },
      { label: "Interest", value: asString(metadata.interest) || asString(row.interest_type) || "Not specified" },
      { label: "Number of clients per year", value: asString(metadata.client_volume) || asString(row.team_size) || "Not specified" },
    ],
    rawMessage: message || null,
  }
}

export async function getLeadInboxRecords() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return demoLeads
  }

  try {
    const [investorResult, businessResult] = await Promise.all([
      supabase.from("investor_leads").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("company_inquiries").select("*").order("created_at", { ascending: false }).limit(50),
    ])

    const investorRows = (investorResult.data ?? []).map((row) => normaliseInvestorLead(row as GenericRecord))
    const businessRows = (businessResult.data ?? []).map((row) => normaliseBusinessLead(row as GenericRecord))

    const merged = [...investorRows, ...businessRows].sort(
      (left, right) =>
        new Date(right.submittedAtRaw ?? right.submittedAt).getTime() -
        new Date(left.submittedAtRaw ?? left.submittedAt).getTime(),
    )

    return merged.length > 0 ? merged : demoLeads
  } catch (error) {
    console.error("Lead inbox fetch failed:", error)
    return demoLeads
  }
}

export function getAssignableManagers() {
  return internalUsers
    .filter((user) => user.role === "Workspace owner" || user.role === "Account manager" || user.role === "Case coordinator")
    .map((user) => ({
      id: user.id,
      name: user.name,
      role: user.role,
    }))
}
