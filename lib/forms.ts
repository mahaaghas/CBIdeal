import { z } from "zod"

export const leadFormTypeSchema = z.enum(["investor", "company", "partner"])

export type LeadFormType = z.infer<typeof leadFormTypeSchema>

export const investorBudgetOptions = [
  { value: "under-150k", label: "Under EUR 150k" },
  { value: "150k-300k", label: "EUR 150k to EUR 300k" },
  { value: "300k-500k", label: "EUR 300k to EUR 500k" },
  { value: "500k-1m", label: "EUR 500k to EUR 1m" },
  { value: "1m-plus", label: "EUR 1m+" },
] as const

export const investorTimeframeOptions = [
  { value: "within-30-days", label: "Within 30 days" },
  { value: "this-quarter", label: "This quarter" },
  { value: "within-6-months", label: "Within 6 months" },
  { value: "researching", label: "Still researching" },
] as const

export const companyTeamSizeOptions = [
  { value: "1-3", label: "1 to 3 team members" },
  { value: "4-10", label: "4 to 10 team members" },
  { value: "11-25", label: "11 to 25 team members" },
  { value: "26-plus", label: "26+ team members" },
] as const

const optionalTextField = z.string().trim().optional()

const leadFormSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter the contact name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(7, "Please enter a valid phone or WhatsApp number."),
  companyName: optionalTextField,
  countryOfCitizenship: optionalTextField,
  currentResidence: optionalTextField,
  preferredDestination: optionalTextField,
  budgetRange: z.enum(["under-150k", "150k-300k", "300k-500k", "500k-1m", "1m-plus"]).optional(),
  timeframe: z.enum(["within-30-days", "this-quarter", "within-6-months", "researching"]).optional(),
  applicantScope: z.enum(["just-me", "me-and-family", "family-office"]).optional(),
  programInterest: z.enum(["citizenship", "residency", "open-to-both"]).optional(),
  regionServed: optionalTextField,
  teamSize: z.enum(["1-3", "4-10", "11-25", "26-plus"]).optional(),
  businessInterest: z.enum(["crm", "leads", "both", "white-label"]).optional(),
  notes: z.string().trim().max(1200, "Please keep your message under 1200 characters.").default(""),
  consent: z.boolean(),
})

export type LeadFormValues = z.infer<typeof leadFormSchema>
export type LeadFormField = keyof LeadFormValues
export type LeadFormFieldErrors = Partial<Record<LeadFormField, string[]>>

export interface LeadSubmissionInput extends LeadFormValues {
  source: string
  formType: LeadFormType
}

export type LeadSubmissionResult =
  | { ok: true; referenceId: string }
  | { ok: false; message: string; fieldErrors?: LeadFormFieldErrors }

export const netlifyFormNames: Record<LeadFormType, string> = {
  investor: "investor-qualification",
  company: "company-inquiry",
  partner: "partner-inquiry",
}

export function buildLeadFormSchema(formType: LeadFormType) {
  return leadFormSchema.superRefine((values, ctx) => {
    if (!values.consent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["consent"],
        message: "Consent is required before submitting.",
      })
    }

    if (formType === "investor") {
      const investorRequiredFields: Array<LeadFormField> = [
        "countryOfCitizenship",
        "currentResidence",
        "preferredDestination",
        "budgetRange",
        "timeframe",
        "applicantScope",
        "programInterest",
      ]

      investorRequiredFields.forEach((field) => {
        if (!values[field]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: "This field is required.",
          })
        }
      })
    }

    if (formType === "company" || formType === "partner") {
      const companyRequiredFields: Array<LeadFormField> = [
        "companyName",
        "regionServed",
        "teamSize",
        "businessInterest",
        "timeframe",
      ]

      companyRequiredFields.forEach((field) => {
        if (!values[field]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: "This field is required.",
          })
        }
      })
    }
  })
}

export const leadFormTypeCopy: Record<
  LeadFormType,
  {
    eyebrow: string
    contactLabel: string
    emailLabel: string
    successMessage: string
    notesPlaceholder: string
    notesHelp: string
    submitIdleLabel: string
  }
> = {
  investor: {
    eyebrow: "Investor qualification",
    contactLabel: "Full name",
    emailLabel: "Email",
    successMessage:
      "Thank you. One of our partner providers will review your details and contact you with the best available offer.",
    notesPlaceholder:
      "Add anything that matters for matching: family members, mobility goals, tax concerns, urgency, or countries already under consideration.",
    notesHelp: "The more precise your profile, the easier it is to match you with the right provider and price point.",
    submitIdleLabel: "Get best offer",
  },
  company: {
    eyebrow: "Company enquiry",
    contactLabel: "Contact person",
    emailLabel: "Work email",
    successMessage: "Thank you. We will contact you to discuss the best setup for your team.",
    notesPlaceholder:
      "Tell us about your current workflow, lead volume, product needs, and whether you are interested in CRM, qualified leads, or both.",
    notesHelp: "Use this field for CRM scope, lead supply questions, rollout timing, or demo priorities.",
    submitIdleLabel: "Contact sales",
  },
  partner: {
    eyebrow: "Lead partnership enquiry",
    contactLabel: "Contact person",
    emailLabel: "Work email",
    successMessage: "Thank you. We will review your enquiry and contact you to discuss the best partnership structure.",
    notesPlaceholder:
      "Describe the jurisdictions you cover, your client profile, and whether you are exploring referrals, white-label work, or software plus leads.",
    notesHelp: "This helps us decide whether the best next step is CRM, lead supply, or a broader commercial partnership.",
    submitIdleLabel: "Submit enquiry",
  },
}

export function leadFormDefaults(formType: LeadFormType): LeadFormValues {
  return {
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    countryOfCitizenship: "",
    currentResidence: "",
    preferredDestination: "",
    budgetRange: formType === "investor" ? "300k-500k" : undefined,
    timeframe: "researching",
    applicantScope: formType === "investor" ? "just-me" : undefined,
    programInterest: formType === "investor" ? "open-to-both" : undefined,
    regionServed: "",
    teamSize: formType === "investor" ? undefined : "4-10",
    businessInterest:
      formType === "company" ? "both" : formType === "partner" ? "leads" : undefined,
    notes: "",
    consent: true,
  }
}

function buildNetlifyReferenceId(formType: LeadFormType) {
  const prefix = formType === "investor" ? "INV" : formType === "partner" ? "PAR" : "COM"
  const suffix = Date.now().toString(36).slice(-6).toUpperCase()

  return `CBI-${prefix}-${suffix}`
}

function buildNetlifyFormPayload(values: LeadSubmissionInput) {
  switch (values.formType) {
    case "investor":
      return {
        full_name: values.fullName,
        email: values.email,
        phone_whatsapp: values.phone,
        nationality: values.countryOfCitizenship ?? "",
        residence_country: values.currentResidence ?? "",
        preferred_destination: values.preferredDestination ?? "",
        budget_range: values.budgetRange ?? "",
        timeline: values.timeframe ?? "",
        applicant_type: values.applicantScope ?? "",
        program_type: values.programInterest ?? "",
        notes: values.notes ?? "",
        source_page: values.source,
        consent: values.consent ? "yes" : "no",
      }
    case "company":
    case "partner":
      return {
        company_name: values.companyName ?? "",
        contact_person: values.fullName,
        work_email: values.email,
        phone_whatsapp: values.phone,
        region_served: values.regionServed ?? "",
        team_size: values.teamSize ?? "",
        interest_type: values.businessInterest ?? "",
        timeline: values.timeframe ?? "",
        message: values.notes ?? "",
        source_page: values.source,
        consent: values.consent ? "yes" : "no",
      }
  }
}

function encodeFormBody(payload: Record<string, string>) {
  return new URLSearchParams(payload).toString()
}

async function submitLeadFormToNetlify(values: LeadSubmissionInput): Promise<LeadSubmissionResult | null> {
  try {
    const formName = netlifyFormNames[values.formType]
    const payload = {
      "form-name": formName,
      "bot-field": "",
      ...buildNetlifyFormPayload(values),
    }

    const response = await fetch("/__forms.html", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: encodeFormBody(payload),
    })

    if (!response.ok) {
      return null
    }

    return {
      ok: true,
      referenceId: buildNetlifyReferenceId(values.formType),
    }
  } catch {
    return null
  }
}

async function submitLeadFormToApi(values: LeadSubmissionInput): Promise<LeadSubmissionResult> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const payload = (await response.json().catch(() => null)) as LeadSubmissionResult | null

    if (!response.ok) {
      return {
        ok: false,
        message: payload && "message" in payload ? payload.message : "We could not submit your request. Please try again.",
        fieldErrors: payload && "fieldErrors" in payload ? payload.fieldErrors : undefined,
      }
    }

    if (payload && payload.ok && "referenceId" in payload) {
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

export async function submitLeadForm(values: LeadSubmissionInput): Promise<LeadSubmissionResult> {
  const isNetlifyRuntime =
    typeof window !== "undefined" &&
    (window.location.hostname.endsWith(".netlify.app") ||
      Boolean(
        document.querySelector(
          'meta[name="generator"][content*="Netlify"], meta[name="generator"][content*="netlify"]',
        ),
      ))

  const netlifyResult = await submitLeadFormToNetlify(values)

  if (netlifyResult) {
    return netlifyResult
  }

  if (isNetlifyRuntime) {
    return {
      ok: false,
      message: "We could not submit your request right now. Please try again in a moment.",
    }
  }

  return submitLeadFormToApi(values)
}
