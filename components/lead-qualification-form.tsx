"use client"

import type { ReactNode } from "react"
import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  buildLeadFormSchema,
  getApplicantScopeOptions,
  getBusinessInterestOptions,
  getCompanyTeamSizeOptions,
  getInvestorBudgetOptions,
  getInvestorTimeframeOptions,
  getLeadFormTypeCopy,
  getProgramInterestOptions,
  submitLeadForm,
  type LeadFormType,
  type LeadFormValues,
  leadFormDefaults,
  netlifyFormNames,
} from "@/lib/forms"
import { trackFormSubmit } from "@/lib/analytics"
import type { Locale } from "@/lib/i18n/routing"
import { contactDetails } from "@/lib/site"
import { cn } from "@/lib/utils"

interface LeadQualificationFormProps {
  locale?: Locale
  formType: LeadFormType
  title: string
  description: string
  submitLabel?: string
  source: string
}

interface FormGroupProps {
  title: string
  description?: string
  children: ReactNode
}

const investorStepOneFields: Array<keyof LeadFormValues> = [
  "fullName",
  "email",
  "phone",
  "countryOfCitizenship",
  "currentResidence",
]

const investorStepTwoFields: Array<keyof LeadFormValues> = [
  "applicantScope",
  "programInterest",
  "preferredDestination",
  "budgetRange",
  "timeframe",
  "notes",
  "consent",
]

function FormGroup({ title, description, children }: FormGroupProps) {
  return (
    <div className="surface-muted p-5 md:p-7">
      <div className="mb-5 space-y-2">
        <h4 className="text-[1.15rem] leading-tight text-foreground md:text-[1.28rem]">{title}</h4>
        {description ? <p className="max-w-[34rem] text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  )
}

export function LeadQualificationForm({
  locale = "en",
  formType,
  title,
  description,
  submitLabel,
  source,
}: LeadQualificationFormProps) {
  const [isPending, startTransition] = useTransition()
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const copy = getLeadFormTypeCopy(locale, formType)
  const isInvestor = formType === "investor"
  const isRtl = locale === "ar"

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(buildLeadFormSchema(formType, locale)),
    defaultValues: leadFormDefaults(formType),
  })

  const onSubmit = form.handleSubmit((values) => {
    setReferenceId(null)
    setSubmitError(null)
    form.clearErrors()
    startTransition(async () => {
      const result = await submitLeadForm({ ...values, source, formType })

      if (!result.ok) {
        setSubmitError(result.message)

        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            const message = messages?.[0]

            if (message) {
              form.setError(field as keyof LeadFormValues, {
                type: "server",
                message,
              })
            }
          })
        }

        return
      }

      setReferenceId(result.referenceId)
      trackFormSubmit({
        form_type: formType,
        source_page: source,
        language: locale === "ar" ? "AR" : "EN",
      })
      form.reset(leadFormDefaults(formType))
      setStep(0)
    })
  })

  const goToInvestorStepTwo = async () => {
    const valid = await form.trigger(investorStepOneFields)
    if (valid) setStep(1)
  }

  const investorBudgetLabels = getInvestorBudgetOptions(locale)
  const investorTimeframes = getInvestorTimeframeOptions(locale)
  const companyTeamSizes = getCompanyTeamSizeOptions(locale)
  const programInterestOptions = getProgramInterestOptions(locale)
  const applicantScopeOptions = getApplicantScopeOptions(locale)
  const businessInterestOptions = getBusinessInterestOptions(locale)
  const uiCopy =
    locale === "ar"
      ? {
          referenceLabel: "المرجع",
          stepLabel: `الخطوة ${step + 1} من 2`,
          stepOneName: "معلومات التواصل والإقامة",
          stepTwoName: "التفضيلات والهدف من الطلب",
          investorGroupOneTitle: "بيانات التواصل",
          investorGroupOneDescription: "ابدأ بالبيانات الأساسية التي تساعد الجهة المناسبة على قراءة الطلب بسرعة ووضوح.",
          phoneLabel: "الهاتف أو واتساب",
          phoneHelp: "استخدم الرقم الأنسب للتواصل المباشر.",
          investorGroupTwoTitle: "الوضع الحالي",
          investorGroupTwoDescription: "هذه المعلومات تساعد على استبعاد المسارات غير الواقعية قبل أي تواصل تفصيلي.",
          citizenshipLabel: "بلد الجنسية",
          citizenshipPlaceholder: "الدولة الموجودة في جوازك الحالي",
          residenceLabel: "بلد الإقامة الحالي",
          residencePlaceholder: "أين تقيم الآن",
          goalsGroupTitle: "ما الذي تبحث عنه",
          goalsGroupDescription: "ساعدنا على فهم ما تقارنه فعليًا وما الذي يهمك في هذه المرحلة.",
          programInterestLabel: "هل تبحث عن جنسية أم إقامة؟",
          selectOne: "اختر الأنسب",
          applicantScopeLabel: "هل الطلب لك وحدك أم للعائلة؟",
          destinationLabel: "المنطقة أو الوجهة المفضلة",
          destinationPlaceholder: "الكاريبي، أوروبا، تركيا، أو ما زلت منفتحًا",
          budgetLabel: "نطاق الميزانية",
          budgetPlaceholder: "اختر النطاق",
          timeframeLabel: "الإطار الزمني",
          timeframePlaceholder: "اختر التوقيت",
          notesGroupTitle: "تفاصيل إضافية",
          notesGroupDescription: "ملاحظة قصيرة تساعد في جعل المحادثة الأولى أكثر دقة وأقل عشوائية.",
          notesLabel: "ملاحظات إضافية",
          consentLabel: "أوافق على التواصل معي بخصوص هذا الطلب.",
          consentDescription: "ستُراجع البيانات بشكل خاص، ولن تُشارك إلا مع الجهة المناسبة أو الفريق المسؤول عن متابعة الطلب.",
          back: "رجوع",
          continue: "الانتقال إلى المقارنة والتفضيلات",
          footerReview: "سيتم النظر في الطلب أولاً قبل أي تواصل لاحق.",
          companyPrimaryTitle: "بيانات جهة التواصل",
          companyPrimaryDescription: "أخبرنا بمن يجب أن نتواصل داخل الشركة وما نوع الجهة التي تمثلها.",
          companyNameLabel: "اسم الشركة",
          companyNamePlaceholder: "اسم الشركة أو المكتب",
          companyPhoneLabel: "الهاتف أو واتساب",
          companyOpsTitle: "السياق التشغيلي",
          companyOpsDescription: "تفاصيل بسيطة تساعدنا على تجهيز محادثة مهنية أكثر ملاءمة.",
          regionLabel: "البلد أو المنطقة التي تخدمونها",
          regionPlaceholder: "الخليج، أوروبا، الكاريبي، عالمي",
          teamSizeLabel: "عدد أعضاء الفريق",
          teamSizePlaceholder: "اختر حجم الفريق",
          rolloutLabel: "الإطار الزمني المفضل",
          rolloutPlaceholder: "اختر التوقيت",
          businessTitle: "ما الذي تهتمون به",
          businessDescription: "حدد نوع النقاش المهني الذي يبدو أكثر فائدة لفريقك في هذه المرحلة.",
          businessInterestLabel: "ما نوع النقاش الذي تودون ترتيبه؟",
          messageLabel: "رسالتك",
          companyConsentLabel: "أوافق على التواصل معي بخصوص هذا الطلب.",
          companyConsentDescription: "سنستخدم هذه البيانات فقط للرد على الطلب وترتيب الخطوة التالية المناسبة لفريقك.",
        }
      : {
          referenceLabel: "Reference ID",
          stepLabel: `Step ${step + 1} of 2`,
          stepOneName: "Contact and background",
          stepTwoName: "Options and notes",
          investorGroupOneTitle: "Primary contact",
          investorGroupOneDescription: "Begin with the details needed for a calm and properly informed first exchange.",
          phoneLabel: "Phone or WhatsApp",
          phoneHelp: "Use the number you prefer for a direct reply.",
          investorGroupTwoTitle: "Current profile",
          investorGroupTwoDescription: "These details help narrow realistic routes before any next step is discussed.",
          citizenshipLabel: "Country of citizenship",
          citizenshipPlaceholder: "Current passport country",
          residenceLabel: "Current country of residence",
          residencePlaceholder: "Where you live now",
          goalsGroupTitle: "Program goals",
          goalsGroupDescription: "Help us understand the destination, scope, and timing that matter most in your case.",
          programInterestLabel: "Do you need citizenship or residency?",
          selectOne: "Select one",
          applicantScopeLabel: "Is this for you or your family?",
          destinationLabel: "Preferred destination or region",
          destinationPlaceholder: "Caribbean, Europe, Turkey, or open",
          budgetLabel: "Budget range",
          budgetPlaceholder: "Select budget",
          timeframeLabel: "Timeframe",
          timeframePlaceholder: "Select timeframe",
          notesGroupTitle: "Additional context",
          notesGroupDescription: "A short note helps the first conversation start with more context.",
          notesLabel: "Additional notes",
          consentLabel: "I agree to be contacted about my enquiry.",
          consentDescription: "Your details will be reviewed privately and shared only where appropriate for your request.",
          back: "Back",
          continue: "Continue to the next section",
          footerReview: "Your details will be reviewed privately before any reply is arranged.",
          companyPrimaryTitle: "Primary contact",
          companyPrimaryDescription: "Indicate who we should correspond with and which firm or practice you represent.",
          companyNameLabel: "Firm name",
          companyNamePlaceholder: "Your firm or agency",
          companyPhoneLabel: "Phone or WhatsApp",
          companyOpsTitle: "Professional context",
          companyOpsDescription: "A few details help place the discussion in the right professional context.",
          regionLabel: "Country or region served",
          regionPlaceholder: "EU, Caribbean, GCC, global",
          teamSizeLabel: "Number of team members",
          teamSizePlaceholder: "Select team size",
          rolloutLabel: "Preferred timing",
          rolloutPlaceholder: "Select timeframe",
          businessTitle: "What you are interested in",
          businessDescription: "Indicate what kind of institutional or professional discussion would be most useful.",
          businessInterestLabel: "What kind of discussion would you like to arrange?",
          messageLabel: "Message",
          companyConsentLabel: "I agree to be contacted about this enquiry.",
          companyConsentDescription: "We will use these details only to respond to your request and arrange the most suitable next step.",
        }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className={cn("section-card p-7 md:p-9", isRtl && "text-right")}>
      <div className="mb-8 space-y-4">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h3 className="max-w-[18ch] text-[2rem] leading-[1.12] text-foreground md:text-[2.35rem]">{title}</h3>
        <p className="max-w-[34rem] text-sm leading-7 text-muted-foreground md:text-[0.98rem] md:leading-8">{description}</p>
      </div>

      {referenceId ? (
        <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground md:p-5">
          <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
            <CheckCircle2 className="mt-0.5 size-5 text-primary" />
            <div className="space-y-1">
              <p className="font-semibold">{copy.successMessage}</p>
              <p className="text-muted-foreground">
                {uiCopy.referenceLabel}: <span className="font-medium text-foreground">{referenceId}</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {submitError ? (
        <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-foreground md:p-5">
          <p className="font-medium text-foreground">{submitError}</p>
        </div>
      ) : null}

      {isInvestor ? (
        <div className="mb-7 rounded-[26px] border border-border/70 bg-background/80 p-5">
          <div className={cn("mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", isRtl && "sm:flex-row-reverse")}>
            <p className="text-sm font-medium text-foreground">{uiCopy.stepLabel}</p>
            <p className="text-sm text-muted-foreground">{step === 0 ? uiCopy.stepOneName : uiCopy.stepTwoName}</p>
          </div>
          <div className={cn("flex items-center gap-3", isRtl && "flex-row-reverse")}>
            {[0, 1].map((stepIndex) => (
              <div key={stepIndex} className={cn("flex flex-1 items-center gap-3", isRtl && "flex-row-reverse")}>
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition",
                    step === stepIndex
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground",
                  )}
                >
                  {stepIndex + 1}
                </div>
                <div className={cn("h-px flex-1 bg-border", stepIndex === 1 && "hidden")} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <Form {...form}>
        <form
          name={netlifyFormNames[formType]}
          method="POST"
          action="/__forms.html"
          className={cn(
            "space-y-6 [&_label]:text-[0.78rem] [&_label]:font-medium [&_label]:tracking-[0.01em] [&_label]:text-foreground/72 [&_textarea]:rounded-2xl [&_[role=combobox]]:h-11 [&_[role=combobox]]:rounded-2xl",
            isRtl && "[&_label]:text-right",
          )}
          onSubmit={onSubmit}
        >
          <input type="hidden" name="form-name" value={netlifyFormNames[formType]} />
          <input type="hidden" name="bot-field" />
          {isInvestor ? (
            <>
              {step === 0 ? (
                <div className="space-y-6">
                  <FormGroup
                    title={uiCopy.investorGroupOneTitle}
                    description={uiCopy.investorGroupOneDescription}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{copy.contactLabel}</FormLabel>
                            <FormControl>
                              <Input placeholder={locale === "ar" ? "الاسم الكامل" : "Your full name"} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{copy.emailLabel}</FormLabel>
                            <FormControl>
                              <Input type="email" dir={isRtl ? "ltr" : undefined} className={cn(isRtl && "text-left")} placeholder="name@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>{uiCopy.phoneLabel}</FormLabel>
                          <FormControl>
                            <Input dir={isRtl ? "ltr" : undefined} className={cn(isRtl && "text-left")} placeholder={contactDetails.whatsapp} {...field} />
                          </FormControl>
                          <FormDescription>{uiCopy.phoneHelp}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormGroup>

                  <FormGroup
                    title={uiCopy.investorGroupTwoTitle}
                    description={uiCopy.investorGroupTwoDescription}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="countryOfCitizenship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{uiCopy.citizenshipLabel}</FormLabel>
                            <FormControl>
                              <Input placeholder={uiCopy.citizenshipPlaceholder} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currentResidence"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{uiCopy.residenceLabel}</FormLabel>
                            <FormControl>
                              <Input placeholder={uiCopy.residencePlaceholder} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormGroup>
                </div>
              ) : (
                <div className="space-y-6">
                  <FormGroup
                    title={uiCopy.goalsGroupTitle}
                    description={uiCopy.goalsGroupDescription}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="programInterest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{uiCopy.programInterestLabel}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className={cn("w-full", isRtl && "text-right")}>
                                  <SelectValue placeholder={uiCopy.selectOne} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {programInterestOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="applicantScope"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{uiCopy.applicantScopeLabel}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className={cn("w-full", isRtl && "text-right")}>
                                  <SelectValue placeholder={uiCopy.selectOne} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {applicantScopeOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="preferredDestination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{uiCopy.destinationLabel}</FormLabel>
                            <FormControl>
                              <Input placeholder={uiCopy.destinationPlaceholder} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budgetRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{uiCopy.budgetLabel}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className={cn("w-full", isRtl && "text-right")}>
                                  <SelectValue placeholder={uiCopy.budgetPlaceholder} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {investorBudgetLabels.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="timeframe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{uiCopy.timeframeLabel}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className={cn("w-full", isRtl && "text-right")}>
                                  <SelectValue placeholder={uiCopy.timeframePlaceholder} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {investorTimeframes.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup
                    title={uiCopy.notesGroupTitle}
                    description={uiCopy.notesGroupDescription}
                  >
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{uiCopy.notesLabel}</FormLabel>
                          <FormControl>
                            <Textarea rows={5} className={cn(isRtl && "text-right")} placeholder={copy.notesPlaceholder} {...field} />
                          </FormControl>
                          <FormDescription>{copy.notesHelp}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="rounded-2xl border border-border/70 bg-background/80 p-4">
                          <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="text-sm">{uiCopy.consentLabel}</FormLabel>
                              <FormDescription>
                                {uiCopy.consentDescription}
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </FormGroup>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <FormGroup
                title={uiCopy.companyPrimaryTitle}
                description={uiCopy.companyPrimaryDescription}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{copy.contactLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder="Full contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>{uiCopy.companyNameLabel}</FormLabel>
                          <FormControl>
                            <Input placeholder={uiCopy.companyNamePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{copy.emailLabel}</FormLabel>
                        <FormControl>
                          <Input type="email" dir={isRtl ? "ltr" : undefined} className={cn(isRtl && "text-left")} placeholder="name@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{uiCopy.companyPhoneLabel}</FormLabel>
                        <FormControl>
                          <Input dir={isRtl ? "ltr" : undefined} className={cn(isRtl && "text-left")} placeholder={contactDetails.whatsapp} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormGroup>

              <FormGroup
                title={uiCopy.companyOpsTitle}
                description={uiCopy.companyOpsDescription}
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="regionServed"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>{uiCopy.regionLabel}</FormLabel>
                          <FormControl>
                            <Input placeholder={uiCopy.regionPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>{uiCopy.teamSizeLabel}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn("w-full", isRtl && "text-right")}>
                                <SelectValue placeholder={uiCopy.teamSizePlaceholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companyTeamSizes.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>{uiCopy.rolloutLabel}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn("w-full", isRtl && "text-right")}>
                                <SelectValue placeholder={uiCopy.rolloutPlaceholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {investorTimeframes.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormGroup>

              <FormGroup
                title={uiCopy.businessTitle}
                description={uiCopy.businessDescription}
              >
                <FormField
                  control={form.control}
                  name="businessInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{uiCopy.businessInterestLabel}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn("w-full", isRtl && "text-right")}>
                            <SelectValue placeholder={uiCopy.selectOne} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessInterestOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{uiCopy.messageLabel}</FormLabel>
                      <FormControl>
                        <Textarea rows={5} className={cn(isRtl && "text-right")} placeholder={copy.notesPlaceholder} {...field} />
                      </FormControl>
                      <FormDescription>{copy.notesHelp}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="rounded-2xl border border-border/70 bg-background/80 p-4">
                      <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-sm">{uiCopy.companyConsentLabel}</FormLabel>
                          <FormDescription>
                            {uiCopy.companyConsentDescription}
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </FormGroup>
            </div>
          )}

          <div className={cn("flex flex-col gap-3.5 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between", isRtl && "sm:flex-row-reverse")}>
            {isInvestor && step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-muted sm:w-auto"
              >
                {isRtl ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                {uiCopy.back}
              </button>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">{uiCopy.footerReview}</p>
            )}

            {isInvestor && step === 0 ? (
              <button
                type="button"
                onClick={goToInvestorStepTwo}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 sm:w-auto"
              >
                {uiCopy.continue}
                {isRtl ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {submitLabel ?? copy.submitIdleLabel}
              </button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
