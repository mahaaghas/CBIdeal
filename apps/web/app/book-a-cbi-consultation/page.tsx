import type { Metadata } from "next"
import { LockKeyhole, MessageSquareQuote, ShieldCheck, TimerReset } from "lucide-react"
import { LocalizedLandingLeadForm } from "@/components/forms/localized-landing-lead-form"
import { LandingCtaSection } from "@/components/landing/landing-cta-section"
import { LandingFaqSection } from "@/components/landing/landing-faq-section"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingLinkGrid } from "@/components/landing/landing-link-grid"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { TrustGrid } from "@/components/trust-grid"
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

const trustItems = [
  {
    title: "Private by design",
    description:
      "Conversations are framed for discretion from the outset, especially where family considerations, timing, or profile sensitivity matter.",
  },
  {
    title: "Grounded in suitability",
    description:
      "The aim is to establish whether a route appears suitable, not to create artificial certainty or push a quick decision before the context is properly understood.",
  },
  {
    title: "Measured from the outset",
    description:
      "The first step is intended to clarify priorities, household context, and timing before any more detailed route discussion is treated as worthwhile.",
  },
]

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

  return (
    <SiteShell>
      <LandingHero
        eyebrow={copy?.heroEyebrow ?? "Private consultation"}
        title={copy?.heroTitle ?? "Request a private consultation"}
        description={
          copy?.heroDescription ??
          "This page explains what a private consultation is for, what the first exchange tends to cover, and when it makes sense to request it. The initial conversation itself allows us to understand your situation, priorities, and timeline, and to determine whether there is a sensible basis for a more detailed discussion."
        }
        primaryAction={{ href: "#consultation-form", label: copy?.heroPrimary ?? "Request a consultation" }}
        secondaryAction={{ href: routes.programs, label: copy?.heroSecondary ?? "Explore your options" }}
        stats={
          copy?.stats ?? [
            { value: "Private", label: "handled with discretion from the outset" },
            { value: "Measured", label: "focused on suitability rather than speed or premature certainty" },
            { value: "Clear", label: "designed to bring structure to the next step and the wider decision" },
          ]
        }
        aside={
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
        }
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <TrustGrid items={copy?.trustItems ?? trustItems} />
        </div>
      </section>

      <section id="consultation-form" className="section-padding bg-muted/30">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow={copy?.valueEyebrow ?? "What this first step is for"}
            title={copy?.valueTitle ?? "A more considered first exchange, before anything more involved is discussed."}
            description={
              copy?.valueDescription ??
              "The purpose is to clarify the broader picture: route preference, readiness, family considerations, and whether a more detailed next step makes sense."
            }
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {(copy?.valueCards ?? [
              {
                icon: MessageSquareQuote,
                title: "Area of interest",
                text: "Whether the stronger fit appears to be citizenship by investment, residency by investment, or a wider relocation strategy.",
              },
              {
                icon: TimerReset,
                title: "Timing",
                text: "Whether there is a genuine need to move now, or whether a more measured pace would be wiser.",
              },
              {
                icon: ShieldCheck,
                title: "Suitability",
                text: "Whether the direction under consideration appears coherent with your current position and wider objectives.",
              },
              {
                icon: LockKeyhole,
                title: "Next step",
                text: "Whether a more detailed discussion, a written introduction, or a pause for reflection would be more appropriate.",
              },
            ]).map((item) => (
              <Card key={item.title} className="section-card h-full">
                <CardContent className="space-y-4 p-6 md:p-7">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="size-6" />
                  </div>
                  <h2 className="text-xl leading-tight text-foreground">{item.title}</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
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
