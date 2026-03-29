import type { Metadata } from "next"
import Image from "next/image"
import { BadgeCheck, CircleDollarSign, Compass, FileCheck2, Globe2, ShieldCheck, Users } from "lucide-react"
import { LocalizedLandingLeadForm } from "@/components/forms/localized-landing-lead-form"
import { LandingComparisonTable } from "@/components/landing/landing-comparison-table"
import { LandingCtaSection } from "@/components/landing/landing-cta-section"
import { LandingFaqSection } from "@/components/landing/landing-faq-section"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingLinkGrid } from "@/components/landing/landing-link-grid"
import { ProcessSteps } from "@/components/process-steps"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { TrustGrid } from "@/components/trust-grid"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { siteImages } from "@/lib/site-images"
import { getLocalizedRouteLinks } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()

  return buildPageMetadata({
    title:
      locale === "ar"
        ? "الجنسية عن طريق الاستثمار: كيف تختار المسار الأنسب بوضوح أكبر"
        : "Citizenship by Investment: A Structured Advisory Route for Global Investors",
    description:
      locale === "ar"
        ? "افهم الجنسية عن طريق الاستثمار من منظور عملي يساعدك على المقارنة بين المسارات، وتحديد ما يناسب ملفك، ومعرفة متى تحتاج إلى استشارة خاصة."
        : "Understand citizenship by investment from a realistic advisory perspective, including who it suits, what to compare, how the process works, and when a private consultation becomes useful.",
    path: localizeHref(locale, "/citizenship-by-investment"),
    keywords: [
      "citizenship by investment",
      "second citizenship advisory",
      "citizenship by investment consultation",
      "caribbean citizenship programs",
    ],
    locale,
  })
}

const trustItems = [
  {
    title: "Confidential first review",
    description:
      "Every enquiry is framed around profile fit, documentation readiness, and realistic next steps before attention narrows to a specific jurisdiction.",
  },
  {
    title: "Designed for real decision-making",
    description:
      "We help clients compare suitability, family fit, and trade-offs rather than reducing the decision to a single programme headline.",
  },
  {
    title: "Relevant introductions",
    description:
      "Our role is to bring structure to the enquiry before it moves towards licensed and appropriate parties.",
  },
  {
    title: "Compliance-aware from the start",
    description:
      "Due diligence, AML, KYC, and source-of-funds readiness are treated as core parts of the process, not fine print or an afterthought.",
  },
]

const processSteps = [
  {
    icon: Compass,
    title: "1. Initial discussion",
    description:
      "We review your citizenship, residence, budget, family structure, and what you are actually trying to solve.",
  },
  {
    icon: Globe2,
    title: "2. Route comparison",
    description:
      "We narrow the conversation to the programs that appear commercially and practically relevant to your profile.",
  },
  {
    icon: FileCheck2,
    title: "3. Formal introduction",
    description:
      "Where appropriate, a licensed provider or authorised party reviews the case and outlines the formal next steps.",
  },
  {
    icon: ShieldCheck,
    title: "4. Due diligence and application",
    description:
      "Formal review, document collection, and application handling proceed only through official program structures.",
  },
]

const faqs = [
  {
    question: "Who usually explores citizenship by investment seriously?",
    answer:
      "Most serious applicants are planning for mobility, family optionality, business continuity, or long-term flexibility rather than simply chasing a passport ranking.",
  },
  {
    question: "Do you guarantee that a route will be suitable?",
    answer:
      "No. The purpose of the first review is to test fit before expectations become unrealistic. Final suitability depends on your profile, documentation, source-of-funds position, and the rules of the official programme involved.",
  },
  {
    question: "Is this only relevant for Caribbean programs?",
    answer:
      "No. This pillar page is designed to explain citizenship by investment broadly, while related comparison pages help narrow the Caribbean shortlist, compare route types, or explore residency-led alternatives.",
  },
  {
    question: "What happens after I submit the form?",
    answer:
      "Your enquiry is reviewed privately and, where appropriate, moved towards a more detailed conversation with the right licensed party once the route itself appears coherent.",
  },
]

export default function CitizenshipByInvestmentPage() {
  const locale = getRequestLocale()
  const routes = getLocalizedRouteLinks(locale)
  const copy =
    locale === "ar"
      ? {
          heroEyebrow: "الجنسية عن طريق الاستثمار",
          heroTitle: "هذه الصفحة مخصصة لمن يريد أن يفهم الخيار الأنسب، لا أن يختار أسرع برنامج بشكل عشوائي.",
          heroDescription:
            "إذا كنت تقارن بين برامج الجنسية الثانية بجدية، فالمطلوب غالبًا ليس جمع أسماء برامج، بل فهم أي مسار يبدو أنسب لملفك وعائلتك وهدفك الفعلي.",
          heroPrimary: "اعرف الخيار الأنسب لك",
          heroSecondary: "اطلب استشارة خاصة",
          stats: [
            { value: "مراجعة خاصة", label: "تبدأ من الملف والهدف لا من خطاب البيع" },
            { value: "قرار أوضح", label: "مبني على الملاءمة لا على التصنيف فقط" },
            { value: "إحالة مناسبة", label: "تتم بعد تضييق المسارات المحتملة" },
          ],
          leadTitle: "ابدأ المراجعة الأولية",
          leadDescription:
            "شارك الأساسيات، وسنساعدك على فهم أي مسار يبدو أقرب لملفك قبل الانتقال إلى محادثة مع جهة مرخصة.",
          trustEyebrow: "ما الذي يميز هذا المسار",
          trustTitle: "قيمة الجنسية الثانية تظهر عندما يكون الهدف واضحًا من البداية.",
          trustDescription:
            "أقوى الحالات تبدأ عادة بهدف عملي: حرية تنقل أفضل، تخطيط عائلي، خيار احتياطي طويل المدى، أو حضور دولي أكثر مرونة.",
          trustCards: [
            { icon: Globe2, title: "حرية تنقل", text: "مفيدة عندما يصبح السفر جزءًا من القرار العائلي أو العملي وليس مجرد امتياز إضافي." },
            { icon: Users, title: "مرونة للعائلة", text: "مهمة للحالات التي ترتبط بالأبناء أو المعالين أو التفكير في انتقال مستقبلي." },
            { icon: CircleDollarSign, title: "تخطيط بعيد المدى", text: "الأفضل فهمها كجزء من رؤية أوسع، لا كشراء سريع بدافع القلق." },
            { icon: BadgeCheck, title: "تنفيذ منظم", text: "نجاح المسار يعتمد أيضًا على جودة الملف والجاهزية للعناية الواجبة واختيار الجهة المناسبة." },
          ],
          processEyebrow: "كيف تسير العملية",
          processTitle: "أول محادثة جادة تبدأ من تأهيل أنظف وأوضح.",
          processDescription:
            "هذه الصفحة مصممة لتقودك من المقارنة الأولى إلى إحالة أكثر دقة، من دون استعجال أو وعود مبالغ فيها.",
          shortlistEyebrow: "منطق المقارنة",
          shortlistTitle: "معظم المستثمرين لا يقارنون عشرات النتائج المختلفة، بل بضعة مسارات تبدو معقولة لملفهم.",
          shortlistDescription:
            "الفرق الحقيقي غالبًا لا يكون في أرقام التصنيف فقط، بل في البنية المالية، وملاءمة العائلة، وسمعة البرنامج، والاستخدام الاستراتيجي على المدى الطويل.",
          compareRows: [
            { factor: "التموضع العام", values: ["أكثر رسوخًا واهتمامًا بالسمعة", "عملي ويميل إلى القيمة", "غالبًا مناسب للعائلات", "أكثر استخدامًا في التفكير الاستراتيجي"] },
            { factor: "من يناسبه غالبًا", values: ["من يضع السمعة في أولوية القرار", "من يبحث عن كلفة أوضح", "من يقارن على مستوى العائلة كاملة", "أصحاب الأعمال والحالات الأبعد أفقًا"] },
            { factor: "ما الذي يجب مقارنته بدقة", values: ["هل تستحق المكانة كلفة أعلى؟", "هل القيمة أهم من الانطباع العام؟", "كيف يتغير القرار عند إضافة أفراد العائلة؟", "هل تحتاج فعلًا إلى مزايا استراتيجية أوسع؟"] },
          ],
          nextEyebrow: "إلى أين بعد ذلك",
          nextTitle: "اختر الصفحة التالية بحسب نوع القرار الذي تحاول حسمه.",
          nextDescription:
            "بعض الزوار يحتاج إلى مقارنة أوسع، وآخرون يحتاجون إلى استشارة خاصة منذ البداية. النظام هنا مصمم لخدمة الحالتين بهدوء.",
          links: [
            {
              title: "قارن بين البرامج الكاريبية الرئيسية",
              description: "انتقل إلى صفحة المقارنة إذا كنت تريد فهم الفروق العملية بين الخيارات الكاريبية الرئيسية.",
              href: routes.caribbeanComparison,
            },
            {
              title: "احجز استشارة خاصة",
              description: "اختر صفحة الاستشارة إذا كان لديك ملف عائلي أو ضغط زمني أو تريد نقاشًا أكثر دقة.",
              href: routes.bookConsultation,
            },
            {
              title: "اطلع على المقالات المتخصصة",
              description: "استخدم قسم المقالات إذا كنت لا تزال تبني الصورة حول الكلفة أو العناية الواجبة أو المقارنات الإقليمية.",
              href: routes.insights,
            },
          ],
          faqEyebrow: "الأسئلة الشائعة",
          faqTitle: "أسئلة شائعة من المستثمرين في هذه المرحلة.",
          faqDescription: "إجابات قصيرة تساعد على ضبط التوقعات قبل الانتقال إلى خطوة أكثر جدية.",
          ctaEyebrow: "استشارة خاصة",
          ctaTitle: "هل تريد مناقشة حالتك ضمن إطار أكثر هدوءًا ووضوحًا؟",
          ctaDescription: "اطلب استشارة خاصة إذا كنت تريد تحويل البحث العام إلى محادثة مبنية على الملف والهدف والخطوة التالية الواقعية.",
          ctaPrimary: "اطلب استشارة خاصة",
          ctaSecondary: "تواصل مع فريقنا",
        }
      : null
  const localizedTrustItems =
    locale === "ar"
      ? [
          {
            title: "مراجعة خاصة من البداية",
            description: "يتم النظر إلى كل طلب من زاوية الملاءمة والوثائق والخطوة المنطقية التالية قبل إحالة الملف إلى جهة خارجية.",
          },
          {
            title: "مقارنة مبنية على القرار",
            description: "نساعدك على المفاضلة بين المسارات بحسب وضعك والعائلة والهدف، لا بحسب خطاب تسويقي موحد.",
          },
          {
            title: "إحالات إلى جهات مرخصة",
            description: "دورنا هو تنظيم الطلب وتضييق الخيارات قبل الانتقال إلى مزود مرخص أو شريك معتمد.",
          },
          {
            title: "وعي بالامتثال من البداية",
            description: "العناية الواجبة ومصدر الأموال والجاهزية الوثائقية ليست تفاصيل جانبية، بل جزء من القرار نفسه.",
          },
        ]
      : trustItems
  const localizedProcessSteps =
    locale === "ar"
      ? [
          {
            icon: Compass,
            title: "1. مراجعة خاصة للملف",
            description: "نراجع الجنسية الحالية، والإقامة، والميزانية، وسياق العائلة، وما الذي تحاول حله فعليًا.",
          },
          {
            icon: Globe2,
            title: "2. تضييق المقارنة",
            description: "نحصر الحديث في البرامج التي تبدو مناسبة تجاريًا وعمليًا بدل الإبقاء على مقارنة واسعة ومرهقة.",
          },
          {
            icon: FileCheck2,
            title: "3. إحالة إلى الجهة المناسبة",
            description: "إذا اتضحت الملاءمة، تنتقل الحالة إلى مزود مرخص أو شريك معتمد لشرح الخطوات الرسمية التالية.",
          },
          {
            icon: ShieldCheck,
            title: "4. العناية الواجبة والتقديم",
            description: "بعد ذلك فقط تبدأ المراجعة الرسمية، وجمع الوثائق، والتقديم عبر الهياكل الحكومية والجهات المخولة.",
          },
        ]
      : processSteps
  const localizedFaqs =
    locale === "ar"
      ? [
          {
            question: "من الذي يفكر عادة في الجنسية عن طريق الاستثمار بشكل جاد؟",
            answer:
              "غالبًا ما يكونون أشخاصًا يخططون لمرونة في التنقل، أو ترتيب عائلي بعيد المدى، أو حضور دولي أكثر استقرارًا، لا مجرد من يبحث عن جواز إضافي بشكل سريع.",
          },
          {
            question: "هل يعني ذلك أن كل ملف سيكون مناسبًا؟",
            answer:
              "لا. وظيفة المراجعة الأولية هي اختبار الملاءمة قبل خلق توقعات غير واقعية. النتيجة النهائية تعتمد على الملف والوثائق وقواعد البرنامج الرسمي نفسه.",
          },
          {
            question: "هل هذه الصفحة مخصصة للكاريبي فقط؟",
            answer:
              "لا. هذه الصفحة تشرح الفكرة العامة للجنسية عن طريق الاستثمار، بينما تساعدك الصفحات المقارنة على تضييق الخيارات الكاريبية أو المقارنة بين الجنسية والإقامة.",
          },
          {
            question: "ماذا يحدث بعد إرسال النموذج؟",
            answer:
              "يتم النظر في الطلب بشكل خاص أولًا، ثم تتم إحالة الحالات المناسبة إلى مزود مرخص أو شريك معتمد لخطوة أكثر رسمية.",
          },
        ]
      : faqs

  return (
    <SiteShell>
      <LandingHero
        eyebrow={copy?.heroEyebrow ?? "Citizenship by investment"}
        title={copy?.heroTitle ?? "Citizenship by investment for investors seeking a clearer route."}
        description={copy?.heroDescription ?? "This page is intended for investors who want to understand citizenship by investment with greater clarity: what the route covers, where the main trade-offs sit, and how to move from broad interest towards a more informed shortlist."}
        primaryAction={{ href: "#qualification", label: copy?.heroPrimary ?? "Explore your options" }}
        secondaryAction={{ href: routes.bookConsultation, label: copy?.heroSecondary ?? "Request a consultation" }}
        stats={copy?.stats ?? [
          { value: "Private consultation", label: "handled discreetly from the first step and framed around the actual profile" },
          { value: "Profile-led", label: "built around fit, family context, and practical suitability rather than generic rankings" },
          { value: "Measured access", label: "formal introductions only where the route appears coherent and realistically usable" },
        ]}
        highlightsLabel={locale === "ar" ? "لماذا يستخدم المستثمرون هذه الصفحة" : "Why investors use this page"}
        aside={
          <LocalizedLandingLeadForm
            locale={locale}
            title={copy?.leadTitle ?? "Request a private consultation"}
            description={copy?.leadDescription ?? "Use this form if the page has helped narrow the field and you would like a more considered view of which route appears suitable. The aim is to move from broad interest into a clearer first discussion."}
            submitLabel={locale === "ar" ? "اعرف الخيار الأنسب لك" : "Request a private consultation"}
            sourceCategory="pillar"
            sourcePage="citizenship-by-investment"
          />
        }
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <TrustGrid items={localizedTrustItems} />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <div className="section-card relative overflow-hidden p-8 md:p-10 lg:p-12">
            <div className="absolute inset-0">
              <Image
                src={siteImages.businessStreet.src}
                alt={siteImages.businessStreet.alt}
                fill
                sizes="(min-width: 1280px) 1180px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(33,42,66,0.9),rgba(33,42,66,0.78)_34%,rgba(33,42,66,0.62)_100%)]" />
            </div>
            <div className="relative space-y-10">
              <div className="max-w-[42rem] space-y-4">
                <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">
                  {copy?.trustEyebrow ?? "What this route is really for"}
                </span>
                <h2 className="section-title max-w-[40rem] text-primary-foreground">
                  {copy?.trustTitle ?? "A second citizenship can be valuable, but only when the objective is clear."}
                </h2>
                <p className="max-w-[40rem] text-base leading-8 text-primary-foreground/80 md:text-lg">
                  {copy?.trustDescription ?? "The strongest cases usually begin with a practical goal: smoother travel, family planning, contingency options, or long-term international flexibility."}
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {(copy?.trustCards ?? [
                  {
                    icon: Globe2,
                    title: "Mobility",
                    text: "Useful where travel friction affects business, family movement, or international planning.",
                  },
                  {
                    icon: Users,
                    title: "Family optionality",
                    text: "Relevant for households planning for children, dependants, or future relocation choices.",
                  },
                  {
                    icon: CircleDollarSign,
                    title: "Long-term planning",
                    text: "Best understood as part of a wider private planning conversation rather than a quick purchase.",
                  },
                  {
                    icon: BadgeCheck,
                    title: "Structured execution",
                    text: "The right route depends on documentation quality, due diligence readiness, and the strength of the overall fit.",
                  },
                ]).map((item) => (
                  <Card key={item.title} className="h-full border border-white/12 bg-white/92 shadow-[0_24px_80px_rgba(13,18,31,0.12)] backdrop-blur-sm">
                    <CardContent className="space-y-4 p-6 md:p-7">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <item.icon className="size-6" />
                      </div>
                      <h3 className="text-xl leading-tight text-foreground">{item.title}</h3>
                      <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell">
          <div className="section-card bg-primary p-8 md:p-10 lg:p-12">
            <div className="space-y-10">
              <div className="max-w-[42rem] space-y-4">
                <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">
                  {copy?.processEyebrow ?? "How the process works"}
                </span>
                <h2 className="section-title max-w-[40rem] text-primary-foreground">
                  {copy?.processTitle ?? "A serious first conversation begins with a clearer understanding."}
                </h2>
                <p className="max-w-[38rem] text-base leading-8 text-primary-foreground/80 md:text-lg">
                {copy?.processDescription ?? "This route is designed to move from initial enquiry to a more considered next step in a way that feels selective, structured, and easier to trust. The aim is to show how a serious case is usually narrowed before formal programme work begins."}
                </p>
              </div>
              <ProcessSteps steps={localizedProcessSteps} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow={copy?.shortlistEyebrow ?? "Shortlist logic"}
            title={copy?.shortlistTitle ?? "Most investors are comparing a few practical route types, not dozens of completely different outcomes."}
            description={copy?.shortlistDescription ?? "Read this section as a guide to what belongs on a serious shortlist. The strongest comparison is rarely about tiny ranking differences; it is about fit, family inclusion, reputational positioning, due diligence realities, and strategic use."}
          />
          <LandingComparisonTable
            columns={[
              { key: "st-kitts", label: "St. Kitts & Nevis" },
              { key: "dominica", label: "Dominica" },
              { key: "antigua", label: "Antigua & Barbuda" },
              { key: "grenada", label: "Grenada" },
            ]}
            rows={copy?.compareRows ?? [
              {
                factor: "General positioning",
                values: [
                  "Premium and reputation-led",
                  "Practical and value-conscious",
                  "Often strong for family-led cases",
                  "More strategic and longer-horizon",
                ],
              },
              {
                factor: "Who it often suits",
                values: [
                  "Investors prioritizing maturity and optics",
                  "Applicants focused on cleaner economics",
                  "Households comparing total family fit",
                  "Business owners and broader planners",
                ],
              },
              {
                factor: "What to compare carefully",
                values: [
                  "Higher threshold vs perceived program strength",
                  "Value vs long-term positioning",
                  "Family economics and practical obligations",
                  "Strategy fit rather than simple rankings",
                ],
              },
            ]}
          />
        </div>
      </section>

      <section id="qualification" className="section-padding pt-0">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow={copy?.nextEyebrow ?? "Where to go next"}
            title={copy?.nextTitle ?? "Choose the next page based on the kind of decision you are making."}
            description={copy?.nextDescription ?? "Use the links below according to what still feels unresolved. Some visitors need a broader comparison, while others are ready for a more private discussion shaped around their own situation."}
          />
          <LandingLinkGrid
            items={copy?.links ?? [
              {
                title: "Compare the main Caribbean routes",
                description:
                  "Use the comparison page if you want to understand how the principal Caribbean options differ in practice.",
                href: routes.caribbeanComparison,
              },
              {
                title: "Arrange a private consultation",
                description:
                  "Use the consultation page if you already have a profile, timing pressure, or a family-specific question.",
                href: routes.bookConsultation,
              },
              {
                title: "Read deeper advisory content",
                description:
                  "Use the insights hub if you are still working through trade-offs, due diligence, or region-specific questions.",
                href: routes.insights,
              },
            ]}
          />
        </div>
      </section>

      <LandingFaqSection
        eyebrow={copy?.faqEyebrow ?? "FAQ"}
        title={copy?.faqTitle ?? "Common questions from investor-side enquiries."}
        description={copy?.faqDescription ?? "These answers keep expectations realistic while helping serious enquirers understand what the process is designed to do, and what it is not designed to promise."}
        items={localizedFaqs}
      />

      <LandingCtaSection
        eyebrow={copy?.ctaEyebrow ?? "Private consultation"}
        title={copy?.ctaTitle ?? "Ready to discuss your case in a more considered setting?"}
          description={copy?.ctaDescription ?? "Request a consultation if you want to move from broad research into a more considered conversation shaped around your profile, priorities, and realistic next steps."}
        primaryAction={{ href: routes.bookConsultation, label: copy?.ctaPrimary ?? "Request a consultation" }}
        secondaryAction={{ href: routes.contact, label: copy?.ctaSecondary ?? "Arrange a written introduction" }}
      />
    </SiteShell>
  )
}
