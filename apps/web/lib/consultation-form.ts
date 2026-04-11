import { z } from "zod"

export const consultationInterestOptions = [
  { value: "citizenship-by-investment", label: "Citizenship by investment" },
  { value: "residency-by-investment", label: "Residency by investment" },
  { value: "strategic-relocation", label: "Strategic relocation" },
  { value: "still-exploring", label: "Still exploring options" },
] as const

export const consultationBudgetOptions = [
  { value: "under-250k", label: "Under EUR 250k" },
  { value: "250k-500k", label: "EUR 250k to EUR 500k" },
  { value: "500k-1m", label: "EUR 500k to EUR 1m" },
  { value: "1m-plus", label: "EUR 1m+" },
  { value: "prefer-to-discuss", label: "Prefer to discuss privately" },
] as const

export const consultationTimelineOptions = [
  { value: "immediately", label: "Immediately" },
  { value: "within-3-months", label: "Within 3 months" },
  { value: "within-6-months", label: "Within 6 months" },
  { value: "researching", label: "Still researching" },
] as const

export const consultationContactMethodOptions = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone call" },
] as const

export const consultationFamilyApplicationOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const

const optionalUrlField = z
  .union([z.literal(""), z.string().trim().url("Please provide a valid source URL.")])
  .optional()

const optionalFamilyApplicationField = z
  .enum(["yes", "no"])
  .optional()
  .or(z.literal(""))

const optionalTimelineField = z
  .enum(["immediately", "within-3-months", "within-6-months", "researching"])
  .optional()
  .or(z.literal(""))

export const consultationRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phoneWhatsApp: z.string().trim().min(7, "Please enter a valid phone or WhatsApp number."),
  countryOfResidence: z.string().trim().min(2, "Please enter your country of residence."),
  nationality: z.string().trim().min(2, "Please enter your nationality."),
  interestedIn: z.enum(
    ["citizenship-by-investment", "residency-by-investment", "strategic-relocation", "still-exploring"],
    { message: "Please select what you are interested in." },
  ),
  budgetRange: z.enum(["under-250k", "250k-500k", "500k-1m", "1m-plus", "prefer-to-discuss"], {
    message: "Please select your budget range.",
  }),
  preferredContactMethod: z.enum(["email", "whatsapp", "phone"], {
    message: "Please choose your preferred contact method.",
  }),
  familyApplication: optionalFamilyApplicationField,
  timeline: optionalTimelineField,
  currentResidencyStatus: z
    .union([z.literal(""), z.string().trim().max(200, "Please keep this under 200 characters.")])
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please share a short message so we can review your request properly.")
    .max(2000, "Please keep your message under 2000 characters."),
  sourcePage: z.string().trim().min(1, "Source page is required."),
  sourceCategory: z.string().trim().max(100).optional(),
  sourceUrl: optionalUrlField,
  campaign: z.string().trim().max(200).optional(),
  language: z.enum(["EN", "AR", "RU"]),
})

export type ConsultationRequestValues = z.infer<typeof consultationRequestSchema>
export type ConsultationRequestField = keyof ConsultationRequestValues
export type ConsultationRequestFieldErrors = Partial<Record<ConsultationRequestField, string[] | undefined>>

export type ConsultationRequestSubmissionResult =
  | { ok: true; referenceId: string; redirectTo: string }
  | {
      ok: false
      message: string
      fieldErrors?: ConsultationRequestFieldErrors
    }

export const consultationRequestDefaults: Pick<
  ConsultationRequestValues,
  | "fullName"
  | "email"
  | "phoneWhatsApp"
  | "countryOfResidence"
  | "nationality"
  | "interestedIn"
  | "budgetRange"
  | "preferredContactMethod"
  | "familyApplication"
  | "timeline"
  | "currentResidencyStatus"
  | "message"
  | "sourceUrl"
  | "campaign"
> = {
  fullName: "",
  email: "",
  phoneWhatsApp: "",
  countryOfResidence: "",
  nationality: "",
  interestedIn: "citizenship-by-investment",
  budgetRange: "250k-500k",
  preferredContactMethod: "email",
  familyApplication: "",
  timeline: "",
  currentResidencyStatus: "",
  message: "",
  sourceUrl: "",
  campaign: "",
}

export async function submitConsultationRequest(
  values: ConsultationRequestValues,
): Promise<ConsultationRequestSubmissionResult> {
  try {
    const response = await fetch("/api/consultation-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const payload = (await response.json().catch(() => null)) as ConsultationRequestSubmissionResult | null

    if (!response.ok) {
      return {
        ok: false,
        message: payload && "message" in payload ? payload.message : "We could not process your request right now.",
        fieldErrors: payload && "fieldErrors" in payload ? payload.fieldErrors : undefined,
      }
    }

    if (payload?.ok && "referenceId" in payload && "redirectTo" in payload) {
      return payload
    }

    return {
      ok: false,
      message: "We could not confirm your request right now. Please try again.",
    }
  } catch {
    return {
      ok: false,
      message: "We could not reach the server. Please try again.",
    }
  }
}
