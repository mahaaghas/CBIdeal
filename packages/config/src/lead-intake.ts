export const investorInterestTypes = [
  "Citizenship by investment",
  "Residency by investment",
  "Not sure yet",
] as const

export const investorRegions = ["Europe", "Caribbean", "Middle East", "Flexible"] as const

export const investorInvestmentRanges = [
  "Under EUR 150k",
  "EUR 150k to EUR 300k",
  "EUR 300k to EUR 600k",
  "EUR 600k+",
] as const

export const investorFamilyScopes = [
  "Just me",
  "Spouse",
  "Spouse and children",
  "Larger family application",
] as const

export const investorTimelines = [
  "Immediately",
  "Within 3 months",
  "Within 6 months",
  "Just exploring",
] as const

export const investorContactMethods = ["Email", "WhatsApp", "Phone call"] as const

export const businessTypes = [
  "Immigration advisory",
  "Citizenship / residency consultancy",
  "Legal practice",
  "Wealth / private client advisory",
  "Other",
] as const

export const businessInterests = ["Partnership", "SaaS platform", "Both"] as const

export const businessVolumes = ["1-20", "21-50", "51-100", "100+"] as const

export const businessChallenges = [
  "Client communication",
  "Document collection",
  "Payment follow-up",
  "Workflow visibility",
  "Portal / client experience",
  "All of the above",
] as const

export const businessCrmStates = ["No", "Yes, basic CRM", "Yes, dedicated platform"] as const

export type WebsiteLeadFormType = "b2c" | "b2b"
export type LeadLifecycleStatus = "New" | "Contacted" | "Qualified" | "Converted"

export interface InvestorLeadSubmission {
  formType: "b2c"
  sourcePage: string
  campaign?: string
  interestType?: (typeof investorInterestTypes)[number]
  preferredRegion?: (typeof investorRegions)[number]
  investmentRange: (typeof investorInvestmentRanges)[number]
  nationality: string
  countryOfResidence: string
  familyApplication: (typeof investorFamilyScopes)[number]
  timeline: (typeof investorTimelines)[number]
  fullName: string
  email: string
  phoneWhatsApp: string
  preferredContactMethod: (typeof investorContactMethods)[number]
  additionalNotes?: string
}

export interface BusinessLeadSubmission {
  formType: "b2b"
  sourcePage: string
  campaign?: string
  companyName: string
  country: string
  servicesOffered: string
  interest: (typeof businessInterests)[number]
  clientVolume: (typeof businessVolumes)[number]
  contactPerson: string
  workEmail: string
  phoneWhatsApp: string
}

export type WebsiteLeadSubmission = InvestorLeadSubmission | BusinessLeadSubmission

export interface CrmLeadRecord {
  id: string
  recordKey: string
  type: "B2C" | "B2B"
  name: string
  companyName?: string | null
  interest: string
  country: string
  campaign?: string | null
  submittedAtRaw?: string
  submittedAt: string
  sourcePage: string
  email: string
  phone: string
  status: LeadLifecycleStatus
  assignedManagerName?: string | null
  assignedManagerId?: string | null
  notes: string[]
  detailRows: Array<{ label: string; value: string }>
  rawMessage?: string | null
}

export interface LeadPanelNote {
  id: string
  body: string
  createdAt: string
  author: string
}

export interface LeadPanelHistory {
  id: string
  label: string
  createdAt: string
}

export interface LeadPanelOverlay {
  status?: LeadLifecycleStatus
  assignedManagerId?: string | null
  assignedManagerName?: string | null
  notes?: LeadPanelNote[]
  history?: LeadPanelHistory[]
  linkedInternalClientId?: string | null
  linkedInternalCaseId?: string | null
}

function normaliseOptional(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function buildInvestorStructuredNotes(values: InvestorLeadSubmission) {
  const lines = [
    `Preferred contact method: ${values.preferredContactMethod}`,
    `Family application: ${values.familyApplication}`,
  ]

  const campaign = normaliseOptional(values.campaign)
  if (campaign) {
    lines.push(`Campaign: ${campaign}`)
  }

  const notes = normaliseOptional(values.additionalNotes)
  if (notes) {
    lines.push(`Additional notes: ${notes}`)
  }

  return lines.join("\n")
}

export function parseInvestorStructuredNotes(notes?: string | null) {
  const result: Record<string, string> = {}
  const lines = notes?.split("\n").map((line) => line.trim()).filter(Boolean) ?? []

  for (const line of lines) {
    const [label, ...rest] = line.split(":")
    if (!label || rest.length === 0) continue
    result[label.trim()] = rest.join(":").trim()
  }

  return result
}

export function buildBusinessMessage(values: BusinessLeadSubmission) {
  const lines = [
    `Services offered: ${values.servicesOffered}`,
  ]

  const campaign = normaliseOptional(values.campaign)
  if (campaign) {
    lines.push(`Campaign: ${campaign}`)
  }

  return lines.join("\n")
}

export function buildLeadRecordKey(type: "B2C" | "B2B", id: string) {
  return `${type.toLowerCase()}::${id}`
}

export function formatLeadDate(value?: string | null) {
  const date = value ? new Date(value) : new Date()
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
