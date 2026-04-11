import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, LockKeyhole, MessageSquareQuote, ShieldCheck, TimerReset } from "lucide-react"
import { LocalizedLandingLeadForm } from "@/components/forms/localized-landing-lead-form"
import { LandingCtaSection } from "@/components/landing/landing-cta-section"
import { LandingFaqSection } from "@/components/landing/landing-faq-section"
import { LandingLinkGrid } from "@/components/landing/landing-link-grid"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getLocalizedRouteLinks } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()

  return buildPageMetadata({
    title:
      locale === "ar"
        ? "اطلب استشارة خاصة: مراجعة أولية هادئة ومدروسة"
        : "Request a Private Consultation",
    description:
      locale === "ar"
        ? "ابدأ بطلب استشارة خاصة لفهم مدى ملاءمة المسار، والأولويات العائلية، والتوقيت، وما إذا كان من المناسب الاستمرار في مراجعة أوسع."
        : "Request a private consultation to review route suitability, family priorities, timing, and whether a more detailed discussion would be appropriate.",
    path: localizeHref(locale, "/book-a-cbi-consultation"),
    keywords: [
      "private citizenship by investment consultation",
      "citizenship advisory consultation",
      "residency by investment private consultation",
    ],
    locale,
  })
}

const faqs = [
  {
    question: "What is this first consultation for?",
    answer:
      "It is intended to understand your broader situation, priorities, and timing, and to determine whether there is a sensible basis for further discussion.",
  },
  {
    question: "Do I need to have chosen a programme already?",
    answer:
      "No. Many visitors use the first conversation to narrow the field and understand which direction is worth considering more seriously.",
  },
  {
    question: "Can I start in writing instead?",
    answer:
      "Yes. If you would prefer a more discreet written introduction first, you can use the contact page and keep the initial exchange more measured.",
  },
  {
    question: "Is every enquiry taken forward?",
    answer:
      "No. We work with a limited number of cases and prioritise enquiries where the objectives, timing, and wider circumstances appear serious and coherent.",
  },
]

export default function BookConsultationPage() {
  const locale = getRequestLocale()
  const routes = getLocalizedRouteLinks(locale)
  const copy =
    locale === "ar"
      ? {
          heroEyebrow: "استشارة خاصة",
          heroTitle: "اطلب استشارة خاصة",
          heroDescription:
            "تتيح لنا هذه المحادثة الأولية فهم وضعك الحالي وأولوياتك وتوقيتك، وتحديد ما إذا كان من المناسب أن ندعم حالتك في مرحلة لاحقة.",
          heroPrimary: "اطلب الاستشارة",
          heroSecondary: "استكشف الخيارات",
          stats: [
            { value: "خاصة", label: "تبدأ بسرية وهدوء منذ أول تواصل" },
            { value: "مدروسة", label: "تركز على الملاءمة لا على الانطباعات السريعة" },
            { value: "واضحة", label: "تمنحك تصوراً أنضج للخطوة التالية" },
          ],
          formTitle: "اطلب استشارة خاصة",
          formDescription: "شارك المعلومات الأساسية التي تساعدنا على فهم مسارك بشكل أولي وأكثر دقة.",
          trustItems: [
            {
              title: "خصوصية منذ البداية",
              description: "تتم المحادثات في إطار خاص يراعي حساسية الحالة، سواء تعلقت بالعائلة أو التوقيت أو طبيعة الملف.",
            },
            {
              title: "تركيز على الملاءمة",
              description: "الهدف هو فهم ما إذا كان المسار مناسباً، لا خلق انطباع سريع أو وعود غير واقعية.",
            },
            {
              title: "إيقاع أكثر هدوءاً",
              description: "الخطوة الأولى مصممة لتوضيح الصورة العامة وتحديد ما إذا كان من المناسب الاستمرار في نقاش أوسع.",
            },
          ],
          valueEyebrow: "ما الذي تغطيه هذه الخطوة؟",
          valueTitle: "محادثة أولى أكثر هدوءاً، لفهم الصورة قبل أي التزام أوسع.",
          valueDescription:
            "نراجع فيها ما يهم فعلاً: نوع المسار، درجة الاستعداد، اعتبارات العائلة، وما إذا كانت الخطوة التالية تبدو مناسبة.",
          valueCards: [
            { icon: MessageSquareQuote, title: "مجال الاهتمام", text: "هل الأولوية للجنسية عن طريق الاستثمار، أم للإقامة، أم لمسار انتقال أكثر اتساعاً." },
            { icon: TimerReset, title: "عامل التوقيت", text: "هل هناك حاجة فعلية للتحرك الآن، أم أن القرار يحتاج إلى مزيد من التروي." },
            { icon: ShieldCheck, title: "الملاءمة العامة", text: "ما إذا كان الاتجاه الذي تفكر فيه يبدو متسقاً مع وضعك الحالي وأهدافك." },
            { icon: LockKeyhole, title: "الخطوة اللاحقة", text: "هل الأفضل متابعة النقاش، أو البدء برسالة خاصة، أو الاكتفاء بالمراجعة الحالية." },
          ],
          prepEyebrow: "إذا رغبت في الاطلاع أولاً",
          prepTitle: "يمكنك البدء بهذه الصفحات قبل طلب الاستشارة.",
          prepDescription: "تساعد هذه الصفحات كثيراً من الزوار على الوصول إلى المحادثة الأولى وهم أكثر وضوحاً واطلاعاً.",
          prepLinks: [
            {
              title: "الجنسية عن طريق الاستثمار",
              description: "ابدأ بالصفحة الأساسية إذا كنت تريد فهماً أوسع لطبيعة هذا المسار.",
              href: routes.programs,
            },
            {
              title: "مقارنة برامج الكاريبي",
              description: "استخدم صفحة المقارنة إذا كنت تقارن بالفعل بين أكثر من خيار عملي.",
              href: routes.caribbeanComparison,
            },
            {
              title: "قسم المقالات",
              description: "اقرأ التحليلات إذا كنت تريد فهماً أعمق للكلفة، والعناية الواجبة، واعتبارات التخطيط الدولي.",
              href: routes.insights,
            },
          ],
          faqEyebrow: "أسئلة شائعة",
          faqTitle: "ما الذي ينبغي توقعه من هذه الخطوة الأولى؟",
          faqDescription: "إجابات مختصرة تساعد على إبقاء العملية واضحة وهادئة منذ البداية.",
          faqs: [
            {
              question: "ما الهدف من هذه الاستشارة الأولى؟",
              answer: "هدفها فهم وضعك الحالي وأولوياتك وتوقيتك، وتحديد ما إذا كان هناك أساس مناسب للانتقال إلى نقاش أوسع.",
            },
            {
              question: "هل يجب أن أكون قد اخترت البرنامج مسبقاً؟",
              answer: "لا. كثير من الزوار يستخدمون هذه الخطوة لتضييق الخيارات وفهم أي اتجاه يستحق دراسة أكثر جدية.",
            },
            {
              question: "هل يمكن أن أبدأ برسالة مكتوبة بدلاً من المحادثة؟",
              answer: "نعم. إذا كنت تفضل بداية أكثر تحفظاً، يمكنك استخدام صفحة التواصل والبدء برسالة خاصة أولاً.",
            },
            {
              question: "هل تتم متابعة كل الطلبات؟",
              answer: "لا. نعمل مع عدد محدود من الحالات ونمنح الأولوية للطلبات الجادة والواضحة من حيث الهدف والتوقيت والظروف العامة.",
            },
          ],
          ctaEyebrow: "تفضل خطوة أكثر تحفظاً؟",
          ctaTitle: "إذا رغبت في بداية مكتوبة أولاً، يمكنك طلب معاودة الاتصال.",
          ctaDescription: "استخدم صفحة التواصل إذا كنت تفضل أن يبدأ التبادل الأولي برسالة خاصة قبل أي محادثة مباشرة.",
          ctaPrimary: "اطلب معاودة الاتصال",
          ctaSecondary: "العودة إلى خيارات المستثمرين",
        }
      : null
  const heroDescription =
    copy?.heroDescription ??
    "Share the essentials so the first conversation starts with the right context. This initial step is designed to clarify priorities, timing, and whether a more detailed discussion is appropriate."
  const supportEyebrow = copy?.valueEyebrow ?? "What this first step is for"
  const supportDescription =
    copy?.valueDescription ??
    "A measured first exchange to understand your priorities, timing, family context, and whether a more detailed next step makes sense."
  const supportPoints = copy?.supportPoints ?? ["Clarify priorities", "Review timing", "Determine suitability"]
  const processSteps = [
    {
      step: "01",
      title: "Profile",
      description: "We begin with your current nationality, residence position, and any family context shaping the enquiry.",
    },
    {
      step: "02",
      title: "Planning",
      description: "We review timing, budget, and what you are actually trying to solve before any route is treated as the answer.",
    },
    {
      step: "03",
      title: "Contact",
      description: "We confirm the best reply format and whether a broader advisory step appears appropriate after review.",
    },
  ]
  return (
    <SiteShell>
      <section className="section-padding pb-10 md:pb-14">
        <div className="container-shell">
          <div className="hero-panel relative overflow-hidden px-7 py-8 sm:px-9 sm:py-10 md:px-12 md:py-11 lg:px-[4.3rem] lg:py-[3.6rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,187,131,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_34%)]" />
            <div className="relative grid gap-8 xl:grid-cols-[minmax(22rem,0.82fr)_minmax(39rem,1fr)] xl:items-start xl:gap-10">
              <div className="flex h-full flex-col justify-start pt-1 xl:max-w-[31rem]">
                <div className="space-y-5">
                  <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">
                    {copy?.heroEyebrow ?? "PRIVATE CONSULTATION"}
                  </span>
                  <h1 className="max-w-[11ch] text-[clamp(2.5rem,3.1vw,3.65rem)] leading-[0.98] tracking-[-0.045em] text-primary-foreground">
                    {copy?.heroTitle ?? "Request a private consultation"}
                  </h1>
                  <p className="max-w-[31rem] text-[0.98rem] leading-8 text-primary-foreground/74 md:text-[1.02rem]">
                    {heroDescription}
                  </p>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link href="#consultation-request-form" className="conversion-primary-button w-full sm:w-auto">
                    {copy?.heroPrimary ?? "Request a consultation"}
                  </Link>
                  <Link href={routes.programs} className="conversion-secondary-button w-full sm:w-auto">
                    {copy?.heroSecondary ?? "Explore your options"}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <div className="mt-8 max-w-[29rem] rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-5 shadow-[0_18px_52px_rgba(9,15,24,0.1)] md:px-7">
                  <div className="space-y-3">
                    <p className="text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground/66">
                      {supportEyebrow}
                    </p>
                    <p className="max-w-[30rem] text-sm leading-7 text-primary-foreground/72 md:text-[0.98rem]">
                      {supportDescription}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="space-y-2 text-[0.8rem] uppercase tracking-[0.16em] text-primary-foreground/60">
                      {supportPoints.map((point) => (
                        <p key={point}>{point}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div id="consultation-request-form" className="xl:pl-2">
                <LocalizedLandingLeadForm
                  locale={locale}
                  title={copy?.formTitle ?? "Request a private consultation"}
                  description={
                    copy?.formDescription ??
                    "Share the essentials below so the first conversation begins with the right context. The form is intended to clarify what should be discussed first, and whether a more detailed exchange appears appropriate."
                  }
                  submitLabel={copy?.heroPrimary ?? "Request a consultation"}
                  sourceCategory="consultation"
                  sourcePage="book-a-cbi-consultation"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0 bg-muted/30">
        <div className="container-shell">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start">
            <Card className="section-card border-0 shadow-none">
              <CardContent className="space-y-5 p-7 md:p-8 lg:p-9">
                <span className="eyebrow">Intake structure</span>
                <h2 className="section-title max-w-[18ch] text-foreground">
                  A cleaner three-part review, outside the form itself.
                </h2>
                <p className="max-w-[40rem] text-base leading-8 text-muted-foreground">
                  The form should feel calm and direct. The explanation sits here instead: first we understand the
                  profile, then the planning context, then the best reply format and next step.
                </p>
                <div className="rounded-[24px] border border-border/70 bg-background px-5 py-5">
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Private reassurance
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    This is a private advisory intake, not an automated funnel stage. Requests are reviewed before any
                    further conversation is arranged, and weak or unclear submissions are not treated as automatic next
                    steps.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {processSteps.map((item) => (
                <Card key={item.step} className="section-card border-0 shadow-none">
                  <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:gap-5 md:p-7">
                    <div className="inline-flex w-fit rounded-full bg-primary px-3.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
                      Step {item.step}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-[1.18rem] leading-6 text-foreground">{item.title}</h3>
                      <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy?.prepEyebrow ?? "Useful before you proceed"}
            title={copy?.prepTitle ?? "If you would prefer to read a little more first, begin with the pages below."}
            description={
              copy?.prepDescription ??
              "These pages are here for visitors who want a little more context before requesting a conversation. They often help narrow the route and make the first exchange more focused."
            }
          />
          <LandingLinkGrid
            items={
              copy?.prepLinks ?? [
                {
                  title: "Citizenship by investment",
                  description: "Begin with the main page if you would like a clearer overview of the broader route first.",
                  
                  href: routes.programs,
                },
                {
                  title: "Caribbean CBI comparison",
                  description: "Use the comparison page if you are already narrowing the field between practical programme options.",
                  
                  href: routes.caribbeanComparison,
                },
                {
                  title: "Insights",
                  description: "Read further analysis on programme comparisons, due diligence, and wider international planning considerations.",
                  
                  href: routes.insights,
                },
              ]
            }
          />
        </div>
      </section>

      <LandingFaqSection
        eyebrow={copy?.faqEyebrow ?? "FAQ"}
        title={copy?.faqTitle ?? "Common questions before requesting a private consultation."}
        description={
          copy?.faqDescription ??
          "These short answers are intended to explain the role of this first step, how to approach it, and what it should help clarify."
        }
        items={copy?.faqs ?? faqs}
      />

      <LandingCtaSection
        eyebrow={copy?.ctaEyebrow ?? "Prefer a more discreet approach?"}
        title={copy?.ctaTitle ?? "If you would prefer to begin in writing, request call-back instead."}
        description={
          copy?.ctaDescription ??
          "Use the contact page if you would rather begin in writing before moving into a direct conversation."
        }
        primaryAction={{ href: routes.contact, label: copy?.ctaPrimary ?? "Request call-back" }}
        secondaryAction={{ href: routes.programs, label: copy?.ctaSecondary ?? "View pathways" }}
      />
    </SiteShell>
  )
}
