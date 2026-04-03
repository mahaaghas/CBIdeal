"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Compass, LoaderCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  getLanguageCode,
  getSourcePageFromPath,
  trackFormSubmit,
  trackLeadGenerated,
  trackQuizCompleted,
  trackQuizStarted,
} from "@/lib/analytics"
import {
  getConversionCtaCopy,
  getConversionGuideHref,
  getQuizResult,
  quizHash,
  type QuizAnswers,
  type QuizBudget,
  type QuizGoal,
  type QuizHousehold,
  type QuizTiming,
} from "@/lib/conversion"
import type { Locale } from "@/lib/i18n/routing"
import { localizeHref } from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"

interface ConversionLayerProps {
  locale: Locale
}

type StepKey = "budget" | "goal" | "timing" | "household" | "lead" | "result"

const budgetOptions: Array<{ value: QuizBudget; label: string; labelAr: string }> = [
  { value: "under-150k", label: "Under $150K", labelAr: "أقل من 150 ألف دولار" },
  { value: "150k-300k", label: "$150K–$300K", labelAr: "من 150 إلى 300 ألف دولار" },
  { value: "300k-600k", label: "$300K–$600K", labelAr: "من 300 إلى 600 ألف دولار" },
  { value: "600k-plus", label: "$600K+", labelAr: "أكثر من 600 ألف دولار" },
]

const goalOptions: Array<{ value: QuizGoal; label: string; labelAr: string }> = [
  { value: "second-passport", label: "Second passport", labelAr: "جواز ثانٍ" },
  { value: "residency-europe", label: "Residency in Europe", labelAr: "إقامة في أوروبا" },
  { value: "tax-optimization", label: "Tax optimisation", labelAr: "تنظيم ضريبي" },
  { value: "backup-plan", label: "Long-term contingency", labelAr: "خيار احتياطي طويل المدى" },
]

const timingOptions: Array<{ value: QuizTiming; label: string; labelAr: string }> = [
  { value: "asap", label: "As soon as practical (3–6 months)", labelAr: "في أقرب وقت عملي (3 إلى 6 أشهر)" },
  { value: "six-to-twelve", label: "Within 6–12 months", labelAr: "خلال 6 إلى 12 شهراً" },
  { value: "no-rush", label: "No immediate time pressure", labelAr: "لا يوجد ضغط زمني مباشر" },
]

const householdOptions: Array<{ value: QuizHousehold; label: string; labelAr: string }> = [
  { value: "just-me", label: "Just me", labelAr: "أنا فقط" },
  { value: "couple", label: "Couple", labelAr: "زوجان" },
  { value: "family", label: "Family", labelAr: "عائلة" },
]

async function submitQuizLead(values: {
  name: string
  email: string
  whatsapp?: string
  answers: QuizAnswers
  sourcePage: string
  language: "EN" | "AR"
}) {
  const apiResponse = await fetch("/api/quiz-leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  })

  if (apiResponse.ok) return { ok: true as const }
  return { ok: false as const }
}

export function ConversionLayer({ locale }: ConversionLayerProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<StepKey>("budget")
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copy = getConversionCtaCopy(locale)
  const guideHref = getConversionGuideHref(locale)
  const consultationHref = localizeHref(locale, "/book-a-cbi-consultation")
  const isRtl = locale === "ar"

  const result = useMemo(() => {
    if (!answers.budget || !answers.goal || !answers.timing || !answers.household) return null
    return getQuizResult(locale, answers as QuizAnswers)
  }, [answers, locale])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const trigger = target.closest('a[href="#conversion-quiz"], button[data-conversion-trigger="quiz"]')
      if (!trigger) return
      event.preventDefault()
      setOpen(true)
      setStep("budget")
      trackQuizStarted({
        source_page: getSourcePageFromPath(window.location.pathname),
        language: getLanguageCode(document.documentElement.lang),
      })
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  const selectAndAdvance = (nextStep: StepKey, values: Partial<QuizAnswers>) => {
    setAnswers((current) => ({ ...current, ...values }))
    setStep(nextStep)
  }

  const handleLeadSubmit = async () => {
    if (!result || !name.trim() || !email.trim()) {
      setError(locale === "ar" ? "يرجى إدخال الاسم والبريد الإلكتروني." : "Please enter your name and email.")
      return
    }

    setSubmitting(true)
    setError(null)
    const sourcePage = getSourcePageFromPath(window.location.pathname)
    const language = getLanguageCode(document.documentElement.lang) as "EN" | "AR"
    const response = await submitQuizLead({
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim() || undefined,
      answers: answers as QuizAnswers,
      sourcePage,
      language,
    })
    setSubmitting(false)

    if (!response.ok) {
      setError(
        locale === "ar"
          ? "تعذر إرسال الطلب الآن. حاول مرة أخرى بعد قليل."
          : "We could not submit your request right now. Please try again.",
      )
      return
    }

    trackQuizCompleted({
      source_page: sourcePage,
      language,
      recommended_program: result.title,
    })
    trackLeadGenerated({
      source_page: sourcePage,
      language,
      recommended_program: result.title,
      lead_type: "private_route_review",
    })
    trackFormSubmit({
      form_type: "private_route_review",
      source_page: sourcePage,
      language,
    })
    setStep("result")
  }

  const resetQuiz = () => {
    setOpen(false)
    setStep("budget")
    setAnswers({})
    setName("")
    setEmail("")
    setWhatsapp("")
    setError(null)
    setSubmitting(false)
  }

  return (
    <>
      <button type="button" data-conversion-trigger="quiz" className="conversion-sticky hidden md:inline-flex">
        <Compass className="size-4" />
        {copy.sticky}
      </button>

      <div className="conversion-mobile-bar md:hidden">
        <button type="button" data-conversion-trigger="quiz" className="conversion-mobile-button">
          <Compass className="size-4" />
          {copy.sticky}
        </button>
      </div>

      <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : resetQuiz())}>
        <DialogContent
          showCloseButton
          className="max-h-[90vh] w-[min(100%-1.5rem,40rem)] overflow-y-auto rounded-[28px] border-border/70 p-0"
        >
          <div dir={isRtl ? "rtl" : "ltr"} className={cn("space-y-8 p-6 md:p-8", isRtl && "text-right")}>
            {step !== "result" ? (
              <DialogHeader className={cn("space-y-3", isRtl && "sm:text-right")}>
                <span className="eyebrow w-fit">{locale === "ar" ? "مراجعة خاصة سريعة" : "Private route review"}</span>
                <DialogTitle className="text-[2rem] leading-[1.08] text-foreground">
                  {step === "budget"
                    ? locale === "ar"
                      ? "ما حجم الميزانية التي تفكر بها؟"
                      : "What level of budget are you considering?"
                    : step === "goal"
                      ? locale === "ar"
                        ? "ما الأولوية الأساسية بالنسبة إليك؟"
                        : "What is the main priority for you?"
                      : step === "timing"
                        ? locale === "ar"
                          ? "ما الإطار الزمني الأقرب لتفكيرك؟"
                          : "What timing feels closest to your situation?"
                        : step === "household"
                          ? locale === "ar"
                            ? "من يدخل في هذا القرار؟"
                            : "Who is this decision for?"
                          : locale === "ar"
                            ? "احصل على قراءة أولية"
                            : "Receive an initial indication"}
                </DialogTitle>
                <DialogDescription className="text-sm leading-7 text-muted-foreground">
                  {locale === "ar"
                    ? "أجب عن أربع أسئلة قصيرة حتى نعرض لك توجهاً أولياً أقرب إلى وضعك الحالي."
                    : "Answer four short questions and we will show an initial direction that appears closer to your situation."}
                </DialogDescription>
              </DialogHeader>
            ) : null}

            {step === "budget" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {budgetOptions.map((option) => (
                  <button key={option.value} type="button" className="conversion-choice" onClick={() => selectAndAdvance("goal", { budget: option.value })}>
                    {locale === "ar" ? option.labelAr : option.label}
                  </button>
                ))}
              </div>
            ) : null}

            {step === "goal" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {goalOptions.map((option) => (
                  <button key={option.value} type="button" className="conversion-choice" onClick={() => selectAndAdvance("timing", { goal: option.value })}>
                    {locale === "ar" ? option.labelAr : option.label}
                  </button>
                ))}
              </div>
            ) : null}

            {step === "timing" ? (
              <div className="grid gap-3">
                {timingOptions.map((option) => (
                  <button key={option.value} type="button" className="conversion-choice" onClick={() => selectAndAdvance("household", { timing: option.value })}>
                    {locale === "ar" ? option.labelAr : option.label}
                  </button>
                ))}
              </div>
            ) : null}

            {step === "household" ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {householdOptions.map((option) => (
                  <button key={option.value} type="button" className="conversion-choice" onClick={() => selectAndAdvance("lead", { household: option.value })}>
                    {locale === "ar" ? option.labelAr : option.label}
                  </button>
                ))}
              </div>
            ) : null}

            {step === "lead" ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <h3 className="card-title text-foreground">
                    {locale === "ar" ? "احصل على قراءة أولية" : "Receive an initial indication"}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {locale === "ar"
                      ? "أدخل بياناتك لنظهر لك القراءة الأولية ونقترح الخطوة الأنسب بهدوء."
                      : "Leave your details to see the initial indication and the most suitable next step."}
                  </p>
                </div>
                <div className="grid gap-4">
                  <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={locale === "ar" ? "الاسم" : "Name"} />
                  <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" dir="ltr" className={cn(isRtl && "text-left")} placeholder={locale === "ar" ? "البريد الإلكتروني" : "Email"} />
                  <Input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} dir="ltr" className={cn(isRtl && "text-left")} placeholder={locale === "ar" ? "واتساب (اختياري)" : "WhatsApp (optional)"} />
                </div>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                <button type="button" className="conversion-primary-button w-full" onClick={handleLeadSubmit} disabled={submitting}>
                  {submitting ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                  {locale === "ar" ? "اعرض القراءة الأولية" : "See the initial indication"}
                </button>
              </div>
            ) : null}

            {step === "result" && result ? (
              <div className="space-y-6">
                <div className="section-card space-y-4 p-6">
                  <span className="eyebrow w-fit">{locale === "ar" ? "القراءة الأولية" : "Initial indication"}</span>
                  <h3 className="card-title text-foreground">{result.title}</h3>
                  <p className="text-base leading-8 text-muted-foreground">{result.explanation}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href={consultationHref} className="conversion-primary-button w-full sm:w-auto">
                    <Compass className="size-4" />
                    {copy.schedule}
                  </Link>
                  <Link href={guideHref} className="conversion-secondary-link">
                    {copy.tertiary}
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
