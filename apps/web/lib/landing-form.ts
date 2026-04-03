import { z } from "zod"

export const landingLeadFormName = "private-consultation-lead"

export const landingLeadSourceCategories = [
  "program",
  "audience",
  "comparison",
  "pillar",
  "consultation",
] as const

export type LandingLeadSourceCategory = (typeof landingLeadSourceCategories)[number]

export const landingLeadInterestOptions = [
  { value: "citizenship-by-investment", label: "Citizenship by investment", labelAr: "الجنسية عن طريق الاستثمار" },
  { value: "residency-by-investment", label: "Residency by investment", labelAr: "الإقامة عن طريق الاستثمار" },
  { value: "strategic-relocation", label: "Strategic relocation", labelAr: "الانتقال الاستراتيجي" },
  { value: "still-comparing", label: "Still comparing options", labelAr: "ما زلت أقارن بين الخيارات" },
] as const

export const landingLeadApplicationScopeOptions = [
  { value: "individual", label: "Individual application", labelAr: "طلب فردي" },
  { value: "couple", label: "Couple", labelAr: "زوجان" },
  { value: "family", label: "Family application", labelAr: "طلب عائلي" },
] as const

export const landingLeadRegionOptions = [
  { value: "caribbean", label: "Caribbean", labelAr: "الكاريبي" },
  { value: "southern-europe", label: "Southern Europe", labelAr: "جنوب أوروبا" },
  { value: "wider-europe", label: "Wider Europe", labelAr: "أوروبا بشكل أوسع" },
  { value: "still-open", label: "Still open", labelAr: "لم أحدد بعد" },
] as const

export const landingLeadBudgetOptions = [
  { value: "under-150k", label: "Under EUR 150k", labelAr: "أقل من 150 ألف يورو" },
  { value: "150k-300k", label: "EUR 150k to EUR 300k", labelAr: "من 150 ألف إلى 300 ألف يورو" },
  { value: "300k-500k", label: "EUR 300k to EUR 500k", labelAr: "من 300 ألف إلى 500 ألف يورو" },
  { value: "500k-1m", label: "EUR 500k to EUR 1m", labelAr: "من 500 ألف إلى مليون يورو" },
  { value: "1m-plus", label: "EUR 1m+", labelAr: "أكثر من مليون يورو" },
] as const

export const landingLeadTimelineOptions = [
  { value: "within-30-days", label: "Within 30 days", labelAr: "خلال 30 يوماً" },
  { value: "this-quarter", label: "This quarter", labelAr: "خلال هذا الربع" },
  { value: "within-6-months", label: "Within 6 months", labelAr: "خلال 6 أشهر" },
  { value: "researching", label: "Still considering timing", labelAr: "ما زلت أدرس التوقيت" },
] as const

const emailField = z
  .union([z.literal(""), z.string().trim().email("Please enter a valid email address.")])
  .optional()

const optionalNotesField = z
  .union([z.literal(""), z.string().trim().max(1200, "Please keep your note under 1200 characters.")])
  .optional()

const optionalTimelineField = z
  .enum(["within-30-days", "this-quarter", "within-6-months", "researching"])
  .optional()
  .or(z.literal(""))

const optionalBudgetField = z
  .enum(["under-150k", "150k-300k", "300k-500k", "500k-1m", "1m-plus"])
  .optional()
  .or(z.literal(""))

export const landingLeadFormSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  areaOfInterest: z.enum(
    ["citizenship-by-investment", "residency-by-investment", "strategic-relocation", "still-comparing"],
    { message: "Please select your area of interest." },
  ),
  applicationScope: z.enum(["individual", "couple", "family"], {
    message: "Please select who is included.",
  }),
  regionOfInterest: z.enum(["caribbean", "southern-europe", "wider-europe", "still-open"], {
    message: "Please select your region of interest.",
  }),
  budgetRange: optionalBudgetField,
  timeline: optionalTimelineField,
  whatsapp: z.string().trim().min(7, "Please enter a valid WhatsApp number."),
  email: emailField,
  notes: optionalNotesField,
  sourcePage: z.string().trim().min(1, "Source page is required."),
  sourceCategory: z.enum(landingLeadSourceCategories),
  language: z.enum(["EN", "AR"]),
})

export type LandingLeadFormValues = z.infer<typeof landingLeadFormSchema>
export type LandingLeadFormField = keyof LandingLeadFormValues
export type LandingLeadFormFieldErrors = Partial<Record<LandingLeadFormField, string[]>>

export type LandingLeadSubmissionResult =
  | { ok: true; referenceId: string }
  | { ok: false; message: string; fieldErrors?: LandingLeadFormFieldErrors }

export const landingLeadFormDefaults: Pick<
  LandingLeadFormValues,
  | "fullName"
  | "areaOfInterest"
  | "applicationScope"
  | "regionOfInterest"
  | "budgetRange"
  | "timeline"
  | "whatsapp"
  | "email"
  | "notes"
> = {
  fullName: "",
  areaOfInterest: "citizenship-by-investment",
  applicationScope: "individual",
  regionOfInterest: "still-open",
  budgetRange: "",
  timeline: "",
  whatsapp: "",
  email: "",
  notes: "",
}

export function normalizeOptionalLandingValue(value: string | undefined) {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

export function buildLandingLeadNotes(
  values: Pick<
    LandingLeadFormValues,
    "notes" | "sourceCategory" | "language" | "areaOfInterest" | "applicationScope" | "regionOfInterest"
  >,
) {
  const trackingLine = `[Tracking] source_category=${values.sourceCategory}; language=${values.language}; area_of_interest=${values.areaOfInterest}; application_scope=${values.applicationScope}; region_of_interest=${values.regionOfInterest}`
  const note = normalizeOptionalLandingValue(values.notes ?? undefined)

  return note ? `${note}\n\n${trackingLine}` : trackingLine
}

async function submitLandingLeadToApi(values: LandingLeadFormValues): Promise<LandingLeadSubmissionResult> {
  try {
    const response = await fetch("/api/landing-leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const payload = (await response.json().catch(() => null)) as LandingLeadSubmissionResult | null

    if (!response.ok) {
      return {
        ok: false,
        message: payload && "message" in payload ? payload.message : "We could not submit your request. Please try again.",
        fieldErrors: payload && "fieldErrors" in payload ? payload.fieldErrors : undefined,
      }
    }

    if (payload?.ok && "referenceId" in payload) {
      return payload
    }

    return {
      ok: false,
      message: "We could not confirm your submission. Please try again.",
    }
  } catch {
    return {
      ok: false,
      message: "We could not reach the server. Please try again.",
    }
  }
}

export async function submitLandingLeadForm(values: LandingLeadFormValues): Promise<LandingLeadSubmissionResult> {
  return submitLandingLeadToApi(values)
}
