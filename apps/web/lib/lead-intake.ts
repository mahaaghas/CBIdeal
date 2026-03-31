import { z } from "zod"
import {
  buildBusinessMessage,
  buildInvestorStructuredNotes,
  businessInterests,
  businessVolumes,
  investorContactMethods,
  investorFamilyScopes,
  investorInvestmentRanges,
  investorTimelines,
  type BusinessLeadSubmission,
  type InvestorLeadSubmission,
  type WebsiteLeadSubmission,
} from "@cbideal/config/lead-intake"

const requiredText = z.string().trim().min(1, "This field is required.")

export const investorLeadSchema = z.object({
  formType: z.literal("b2c"),
  sourcePage: requiredText,
  campaign: z.string().trim().optional(),
  investmentRange: z.enum(investorInvestmentRanges),
  nationality: requiredText,
  countryOfResidence: requiredText,
  familyApplication: z.enum(investorFamilyScopes),
  timeline: z.enum(investorTimelines),
  fullName: requiredText,
  email: z.string().trim().email("Please enter a valid email address."),
  phoneWhatsApp: z.string().trim().min(7, "Please enter a valid phone or WhatsApp number."),
  preferredContactMethod: z.enum(investorContactMethods),
  additionalNotes: z.string().trim().max(1200, "Please keep your note under 1200 characters.").optional(),
})

export const businessLeadSchema = z.object({
  formType: z.literal("b2b"),
  sourcePage: requiredText,
  campaign: z.string().trim().optional(),
  companyName: requiredText,
  country: requiredText,
  servicesOffered: requiredText,
  interest: z.enum(businessInterests),
  clientVolume: z.enum(businessVolumes),
  contactPerson: requiredText,
  workEmail: z.string().trim().email("Please enter a valid work email address."),
  phoneWhatsApp: z.string().trim().min(7, "Please enter a valid phone or WhatsApp number."),
})

export type InvestorLeadFormValues = z.infer<typeof investorLeadSchema>
export type BusinessLeadFormValues = z.infer<typeof businessLeadSchema>
export type WebsiteLeadSubmissionResult =
  | { ok: true; referenceId: string }
  | {
      ok: false
      message: string
      fieldErrors?: Record<string, string[] | undefined>
    }

export const investorLeadDefaults: InvestorLeadFormValues = {
  formType: "b2c",
  sourcePage: "",
  campaign: "",
  investmentRange: "EUR 300k to EUR 600k",
  nationality: "",
  countryOfResidence: "",
  familyApplication: "Just me",
  timeline: "Just exploring",
  fullName: "",
  email: "",
  phoneWhatsApp: "",
  preferredContactMethod: "Email",
  additionalNotes: "",
}

export const businessLeadDefaults: BusinessLeadFormValues = {
  formType: "b2b",
  sourcePage: "",
  campaign: "",
  companyName: "",
  country: "",
  servicesOffered: "",
  interest: "Both",
  clientVolume: "21-50",
  contactPerson: "",
  workEmail: "",
  phoneWhatsApp: "",
}

export async function submitWebsiteLead(values: WebsiteLeadSubmission): Promise<WebsiteLeadSubmissionResult> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })

  const payload = (await response.json().catch(() => null)) as WebsiteLeadSubmissionResult | null

  if (!response.ok) {
    return payload ?? { ok: false, message: "We could not process your request right now. Please try again shortly." }
  }

  return payload ?? { ok: false, message: "We could not confirm your request right now. Please try again shortly." }
}

function deriveInvestorInterest(sourcePage: string) {
  const value = sourcePage.toLowerCase()
  if (value.includes("citizenship")) return "Citizenship enquiry"
  if (value.includes("residency")) return "Residency enquiry"
  return "Investor enquiry"
}

export function buildInvestorLeadInsert(values: InvestorLeadSubmission) {
  return {
    full_name: values.fullName,
    email: values.email,
    phone_whatsapp: values.phoneWhatsApp,
    nationality: values.nationality,
    residence_country: values.countryOfResidence,
    preferred_destination: values.preferredRegion ?? null,
    budget_range: values.investmentRange,
    timeline: values.timeline,
    applicant_type: values.familyApplication,
    program_type: values.interestType ?? deriveInvestorInterest(values.sourcePage),
    notes: buildInvestorStructuredNotes(values),
    source_page: values.sourcePage,
  }
}

export function buildBusinessLeadInsert(values: BusinessLeadSubmission) {
  return {
    company_name: values.companyName,
    contact_person: values.contactPerson,
    work_email: values.workEmail,
    phone_whatsapp: values.phoneWhatsApp,
    region_served: values.country,
    team_size: values.clientVolume,
    interest_type: values.interest,
    message: buildBusinessMessage(values),
    source_page: values.sourcePage,
    metadata: {
      campaign: values.campaign?.trim() || null,
      country: values.country,
      services_offered: values.servicesOffered,
      interest: values.interest,
      client_volume: values.clientVolume,
    },
  }
}
