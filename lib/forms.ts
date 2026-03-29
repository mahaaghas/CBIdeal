import type { Locale } from "@/lib/i18n/routing"
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

const optionLabels = {
  ar: {
    investorBudget: {
      "under-150k": "أقل من 150 ألف يورو",
      "150k-300k": "من 150 ألف إلى 300 ألف يورو",
      "300k-500k": "من 300 ألف إلى 500 ألف يورو",
      "500k-1m": "من 500 ألف إلى مليون يورو",
      "1m-plus": "أكثر من مليون يورو",
    },
    timeframe: {
      "within-30-days": "خلال 30 يومًا",
      "this-quarter": "خلال هذا الربع",
      "within-6-months": "خلال 6 أشهر",
      researching: "ما زلت في مرحلة المقارنة",
    },
    teamSize: {
      "1-3": "من 1 إلى 3 أعضاء",
      "4-10": "من 4 إلى 10 أعضاء",
      "11-25": "من 11 إلى 25 عضوًا",
      "26-plus": "أكثر من 26 عضوًا",
    },
    programInterest: {
      citizenship: "الجنسية",
      residency: "الإقامة",
      "open-to-both": "أقارن بين الاثنين",
    },
    applicantScope: {
      "just-me": "لي فقط",
      "me-and-family": "لي ولعائلتي",
      "family-office": "لحالة عائلية أو عبر مكتب خاص",
    },
    businessInterest: {
      crm: "مراجعة تشغيلية",
      leads: "نقاش مهني أولي",
      both: "نقاش مهني أوسع",
      "white-label": "ترتيب مؤسسي أو شراكة خاصة",
    },
  },
} as const

export function getInvestorBudgetOptions(locale: Locale) {
  if (locale !== "ar") return investorBudgetOptions

  return investorBudgetOptions.map((option) => ({
    ...option,
    label: optionLabels.ar.investorBudget[option.value],
  }))
}

export function getInvestorTimeframeOptions(locale: Locale) {
  if (locale !== "ar") return investorTimeframeOptions

  return investorTimeframeOptions.map((option) => ({
    ...option,
    label: optionLabels.ar.timeframe[option.value],
  }))
}

export function getCompanyTeamSizeOptions(locale: Locale) {
  if (locale !== "ar") return companyTeamSizeOptions

  return companyTeamSizeOptions.map((option) => ({
    ...option,
    label: optionLabels.ar.teamSize[option.value],
  }))
}

export function getProgramInterestOptions(locale: Locale) {
  const base = [
    { value: "citizenship", label: "Citizenship" },
    { value: "residency", label: "Residency" },
    { value: "open-to-both", label: "Open to both" },
  ] as const

  if (locale !== "ar") return base

  return base.map((option) => ({
    ...option,
    label: optionLabels.ar.programInterest[option.value],
  }))
}

export function getApplicantScopeOptions(locale: Locale) {
  const base = [
    { value: "just-me", label: "For me" },
    { value: "me-and-family", label: "For me and my family" },
    { value: "family-office", label: "For a family office or adviser-led case" },
  ] as const

  if (locale !== "ar") return base

  return base.map((option) => ({
    ...option,
    label: optionLabels.ar.applicantScope[option.value],
  }))
}

export function getBusinessInterestOptions(locale: Locale) {
  const base = [
    { value: "crm", label: "Operational review" },
    { value: "leads", label: "Referral discussion" },
    { value: "both", label: "Wider professional discussion" },
    { value: "white-label", label: "Institutional or white-label arrangement" },
  ] as const

  if (locale !== "ar") return base

  return base.map((option) => ({
    ...option,
    label: optionLabels.ar.businessInterest[option.value],
  }))
}

const optionalTextField = z.string().trim().optional()

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

function getFormValidationCopy(locale: Locale) {
  if (locale === "ar") {
    return {
      nameRequired: "يرجى إدخال الاسم الكامل.",
      emailInvalid: "يرجى إدخال بريد إلكتروني صحيح.",
      phoneInvalid: "يرجى إدخال رقم هاتف أو واتساب صحيح.",
      notesTooLong: "يرجى إبقاء الرسالة تحت 1200 حرف.",
      consentRequired: "الموافقة مطلوبة قبل الإرسال.",
      fieldRequired: "هذا الحقل مطلوب.",
    }
  }

  return {
    nameRequired: "Please enter the contact name.",
    emailInvalid: "Please enter a valid email address.",
    phoneInvalid: "Please enter a valid phone or WhatsApp number.",
    notesTooLong: "Please keep your message under 1200 characters.",
    consentRequired: "Consent is required before submitting.",
    fieldRequired: "This field is required.",
  }
}

export function buildLeadFormSchema(formType: LeadFormType, locale: Locale = "en") {
  const messages = getFormValidationCopy(locale)
  const leadFormSchema = z.object({
    fullName: z.string().trim().min(2, messages.nameRequired),
    email: z.string().trim().email(messages.emailInvalid),
    phone: z.string().trim().min(7, messages.phoneInvalid),
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
    notes: z.string().trim().max(1200, messages.notesTooLong).default(""),
    consent: z.boolean(),
  })

  return leadFormSchema.superRefine((values, ctx) => {
    if (!values.consent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["consent"],
        message: messages.consentRequired,
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
            message: messages.fieldRequired,
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
            message: messages.fieldRequired,
          })
        }
      })
    }
  })
}

const leadFormTypeCopyByLocale: Record<
  Locale,
  Record<
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
  >
> = {
  en: {
    investor: {
      eyebrow: "Private review",
      contactLabel: "Full name",
      emailLabel: "Email",
      successMessage:
        "Thank you. Your request has been received and will be reviewed privately before we reply.",
      notesPlaceholder:
        "Add anything that matters for context: family members, mobility goals, timing, or jurisdictions already under consideration.",
      notesHelp: "A clearer picture makes it easier to indicate the most suitable next step.",
      submitIdleLabel: "Request a consultation",
    },
    company: {
      eyebrow: "Professional enquiry",
      contactLabel: "Contact person",
      emailLabel: "Work email",
      successMessage: "Thank you. We will review your enquiry and return in the most suitable format.",
      notesPlaceholder:
        "Tell us about your current structure, what you are reviewing, and the kind of professional discussion you would like to arrange.",
      notesHelp: "Use this field for operating context, timing, or any particular sensitivities around the discussion.",
      submitIdleLabel: "Request a reply",
    },
    partner: {
      eyebrow: "Professional enquiry",
      contactLabel: "Contact person",
      emailLabel: "Work email",
      successMessage: "Thank you. We will review your enquiry and reply in the most appropriate format.",
      notesPlaceholder:
        "Describe the jurisdictions you cover, the profile of the work involved, and the kind of professional relationship you are exploring.",
      notesHelp: "This helps us decide what kind of response would be most appropriate.",
      submitIdleLabel: "Send enquiry",
    },
  },
  ar: {
    investor: {
      eyebrow: "تأهيل المستثمر",
      contactLabel: "الاسم الكامل",
      emailLabel: "البريد الإلكتروني",
      successMessage: "شكرًا لك. وصلنا طلبك، وسيتم التعامل معه بشكل خاص قبل تحديد الصيغة الأنسب للمتابعة.",
      notesPlaceholder:
        "اذكر أي تفاصيل مهمة مثل عدد أفراد العائلة، الهدف من الطلب، البلدان التي تقارن بينها، أو أي عامل زمني يجب أخذه في الاعتبار.",
      notesHelp: "كلما كانت الصورة أوضح، أصبح من الأسهل قراءة المسار الأنسب لك بهدوء ومنهجية.",
      submitIdleLabel: "اطلب مراجعة أولية",
    },
    company: {
      eyebrow: "استفسار شركة",
      contactLabel: "الشخص المسؤول",
      emailLabel: "بريد العمل",
      successMessage: "شكرًا لك. سنراجع طلبك ونتواصل معك بالصيغة الأنسب لفريقك ومرحلة العمل الحالية.",
      notesPlaceholder:
        "أخبرنا عن السياق الحالي لفريقك، وما الذي ترغب في مناقشته، وأي اعتبارات مهنية تراها مهمة.",
      notesHelp: "يمكنك استخدام هذا الحقل لتوضيح ما إذا كنت تبحث عن مراجعة تشغيلية أو نقاش مؤسسي أوسع أو عرض خاص أكثر هدوءاً.",
      submitIdleLabel: "ابدأ محادثة للشركة",
    },
    partner: {
      eyebrow: "استفسار شراكة",
      contactLabel: "الشخص المسؤول",
      emailLabel: "بريد العمل",
      successMessage: "شكرًا لك. سنراجع طلب الشراكة ونتواصل معك بصيغة تبدو مناسبة لنموذج العمل والجهات التي تخدمها.",
      notesPlaceholder:
        "اشرح الأسواق أو البرامج التي تغطيها، ونوعية العملاء، ونوع العلاقة المهنية التي ترى أنها قد تكون مناسبة.",
      notesHelp: "يساعدنا ذلك على فهم ما إذا كانت الخطوة التالية الأنسب هي محادثة أولية أكثر تحفظاً أو نقاش مؤسسي أوسع.",
      submitIdleLabel: "إرسال طلب الشراكة",
    },
  },
  ru: {
    investor: {
      eyebrow: "Квалификация инвестора",
      contactLabel: "Полное имя",
      emailLabel: "Электронная почта",
      successMessage:
        "Спасибо. Ваш запрос будет рассмотрен в более частном порядке, после чего мы определим наиболее уместный формат дальнейшего общения.",
      notesPlaceholder:
        "Укажите всё важное для подбора: состав семьи, цели по мобильности, налоговые вопросы, срочность или страны, которые вы уже рассматриваете.",
      notesHelp: "Чем точнее ваш профиль, тем легче подойти к решению спокойнее, яснее и с большей пригодностью.",
      submitIdleLabel: "Запросить первичный обзор",
    },
    company: {
      eyebrow: "Запрос компании",
      contactLabel: "Контактное лицо",
      emailLabel: "Рабочий email",
      successMessage: "Спасибо. Мы рассмотрим ваш запрос и вернёмся в наиболее уместном формате для вашей команды.",
      notesPlaceholder:
        "Опишите текущий контекст команды, что именно вы хотели бы обсудить и какие профессиональные соображения важны в первую очередь.",
      notesHelp: "Это поле можно использовать, чтобы пояснить, нужен ли вам операционный обзор, более широкий профессиональный разговор или частный обзор.",
      submitIdleLabel: "Начать профессиональный разговор",
    },
    partner: {
      eyebrow: "Партнёрский запрос",
      contactLabel: "Контактное лицо",
      emailLabel: "Рабочий email",
      successMessage: "Спасибо. Мы рассмотрим ваш запрос и вернёмся в формате, который покажется наиболее уместным для дальнейшего разговора.",
      notesPlaceholder:
        "Опишите юрисдикции, с которыми вы работаете, профиль клиентов и какой формат профессионального взаимодействия выглядит для вас уместным.",
      notesHelp: "Это помогает понять, уместнее ли спокойный первый разговор или более широкий институциональный формат.",
      submitIdleLabel: "Отправить запрос",
    },
  },
}

export function getLeadFormTypeCopy(locale: Locale, formType: LeadFormType) {
  return leadFormTypeCopyByLocale[locale][formType]
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
