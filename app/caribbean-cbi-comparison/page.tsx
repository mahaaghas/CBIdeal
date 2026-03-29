import type { Metadata } from "next"
import { BadgeCheck, CircleDollarSign, Compass, Landmark, ShieldCheck, Users } from "lucide-react"
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
import { getLocalizedRouteLinks } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()

  return buildPageMetadata({
    title:
      locale === "ar"
        ? "مقارنة برامج الكاريبي: ما الفرق الفعلي بين الخيارات الرئيسية؟"
        : "Caribbean CBI Comparison: What Actually Separates the Main Programs",
    description:
      locale === "ar"
        ? "قارن بين برامج الجنسية عن طريق الاستثمار في الكاريبي من زاوية عملية تركّز على الكلفة، وملاءمة العائلة، والسمعة، والاستخدام الاستراتيجي."
        : "Compare the main Caribbean citizenship by investment programs with a realistic lens on cost, family fit, positioning, and strategic use.",
    path: localizeHref(locale, "/caribbean-cbi-comparison"),
    keywords: [
      "caribbean citizenship by investment comparison",
      "caribbean passport comparison",
      "best caribbean citizenship program",
    ],
    locale,
  })
}

const trustItems = [
  {
    title: "Compare by fit, not hype",
    description:
      "Most investors do not need the loudest route. They need the route that matches their profile more cleanly.",
  },
  {
    title: "Differences are real but often narrower",
    description:
      "The main Caribbean programs can feel closer in actual use than generic ranking pages suggest.",
  },
  {
    title: "Family economics matter",
    description:
      "A route that looks attractive for a single applicant can look different once spouse and dependants are included.",
  },
  {
    title: "Reputation and execution still matter",
    description:
      "Programme positioning, implementation quality, and due diligence readiness all shape the final experience.",
  },
]

const processSteps = [
  {
    icon: Compass,
    title: "1. Clarify the objective",
    description:
      "Start by defining whether you care most about value, family fit, reputation, or broader strategic optionality.",
  },
  {
    icon: Landmark,
    title: "2. Compare the right shortlist",
    description:
      "St. Kitts & Nevis, Dominica, Antigua & Barbuda, and Grenada often cover most serious Caribbean comparisons.",
  },
  {
    icon: Users,
    title: "3. Stress-test the household fit",
    description:
      "The comparison changes meaningfully once family structure, residence history, and documentation are included.",
  },
  {
    icon: ShieldCheck,
    title: "4. Move to formal review",
    description:
      "Only after the route appears suitable should the case move into formal review and due diligence with the appropriate licensed party.",
  },
]

const faqs = [
  {
    question: "Which Caribbean program is usually best?",
    answer:
      "There is no universal answer. St. Kitts & Nevis often leads on reputation, Dominica on practical value, Antigua & Barbuda on family fit, and Grenada on strategic use.",
  },
  {
    question: "Are the mobility differences huge between the programs?",
    answer:
      "Usually not. For many investors, the practical gap between the major Caribbean routes is smaller than the gap in marketing language around them.",
  },
  {
    question: "Should I decide mainly on cost?",
    answer:
      "Cost matters, but total family economics, documentation strength, and strategic fit often matter more than the lowest visible number.",
  },
  {
    question: "When should I request a consultation instead of comparing alone?",
    answer:
      "If you have a family case, a GCC residence structure, business ownership complexity, or real timing pressure, a private consultation is usually the better next step.",
  },
]

export default function CaribbeanComparisonPage() {
  const locale = getRequestLocale()
  const routes = getLocalizedRouteLinks(locale)
  const copy =
    locale === "ar"
      ? {
          heroEyebrow: "مقارنة الكاريبي",
          heroTitle: "مقارنة عملية لبرامج الكاريبي تساعدك على اختيار الأقرب لملفك، لا الأشهر في التسويق.",
          heroDescription:
            "في الواقع، كثير من البرامج الكاريبية أقرب إلى بعضها مما توحي به الصفحات التسويقية. الفرق الحقيقي يظهر عند النظر إلى الكلفة العائلية، والتموضع، والهدف من الاستخدام، ونوعية الملف.",
          heroPrimary: "ابدأ المقارنة",
          heroSecondary: "اطلب استشارة خاصة",
          stats: [
            { value: "كلفة واقعية", label: "قارن الصورة الكاملة لا الرقم الرئيسي فقط" },
            { value: "ملاءمة للعائلة", label: "هيكل الأسرة يغيّر القرار بسرعة" },
            { value: "تموضع البرنامج", label: "السمعة والتنفيذ ما زالا جزءًا من القرار" },
          ],
          highlights: [
            "مفيد لمن يضيّق قائمة الخيارات الكاريبية بجدية.",
            "مبني على ملاءمة الملف لا على ترتيب عام.",
            "مرتبط مباشرة بصفحات الاستشارة والقرار التالية.",
          ],
          compareEyebrow: "جدول المقارنة",
          compareTitle: "الفروقات العملية تظهر غالبًا في الملاءمة والهيكل المالي والتموضع.",
          compareDescription: "هذا هو الإطار الذي نستخدمه عادة في أول محادثة جادة قبل الانتقال إلى جهة مرخصة.",
          compareRows: [
            { factor: "الزاوية المعتادة", values: ["أكثر رسوخًا واهتمامًا بالسمعة", "أكثر عملية ووضوحًا من ناحية القيمة", "غالبًا مناسب للعائلات", "أوسع في الاستخدام الاستراتيجي"] },
            { factor: "من يختاره غالبًا", values: ["من يضع السمعة في أولوية القرار", "من يركز على اقتصاديات أوضح", "من يقارن على مستوى العائلة كاملة", "أصحاب الأعمال والحالات الأطول أفقًا"] },
            { factor: "أهم نقطة للموازنة", values: ["هل تستحق المكانة كلفة أعلى؟", "هل القيمة أهم من صورة البرنامج؟", "كيف يتغير القرار مع أفراد العائلة؟", "هل تحتاج هذه الميزة الاستراتيجية فعلًا؟"] },
            { factor: "السؤال الأهم", values: ["هل أحتاج برنامجًا أقوى سمعة أم أكثر كفاءة؟", "هل يوفر هذا الخيار أفضل توازن؟", "هل هذا هو الأنسب للأسرة كلها؟", "هل هدفي تنقل فقط أم مرونة أوسع؟"] },
          ],
          processEyebrow: "كيف تستخدم هذه الصفحة",
          processTitle: "المقارنة الأفضل تبدأ بالأسئلة الصحيحة، لا بالبحث عن فائز جاهز.",
          processDescription: "استخدم هذه الصفحة لتضييق القائمة إلى المسار الذي يستحق محادثة أكثر جدية، لا لاختيار اسم لمجرد أنه الأكثر تداولًا.",
          missesEyebrow: "ما الذي يفوته كثير من المستثمرين",
          missesTitle: "أقوى برنامج هو غالبًا ما يبدو أكثر تماسكًا عندما تضع ملفك الحقيقي على الطاولة.",
          missesDescription: "هذا يعني أن الميزانية عامل مهم، لكنه ليس العامل الوحيد. فالعائلة، والإقامة الحالية، وطبيعة النشاط، والوزن الذي تعطيه لسمعة البرنامج كلها تؤثر في القرار.",
          reviewEyebrow: "هل تحتاج إلى مساعدة في الحسم؟",
          reviewTitle: "استخدم مراجعة خاصة إذا أصبحت المقارنة بين برنامجين أو ثلاثة فقط.",
          reviewDescription: "يصبح ذلك أكثر فائدة إذا كانت الحالة عائلية، أو مرتبطة بإقامة خليجية، أو تتطلب فهمًا أدق بين السمعة والكلفة والهدف العملي.",
          links: [
            {
              title: "العودة إلى صفحة الجنسية عن طريق الاستثمار",
              description: "ارجع إلى الصفحة الرئيسية لهذا الموضوع إذا كنت تريد الإطار الأشمل قبل تضييق المقارنة أكثر.",
              href: routes.programs,
            },
            {
              title: "احجز استشارة خاصة",
              description: "انتقل إلى صفحة الاستشارة إذا أصبحت القائمة القصيرة واضحة وتريد نقاشًا أكثر تخصيصًا.",
              href: routes.bookConsultation,
            },
            {
              title: "اطلع على المقالات",
              description: "تابع القراءة إذا كنت تريد فهمًا أعمق للكلفة أو العناية الواجبة أو الأسئلة الخاصة بالمقيمين في الخليج.",
              href: routes.insights,
            },
          ],
          formTitle: "اطلب مراجعة للمقارنة",
          formDescription: "شارك بعض التفاصيل عن ملفك وسنساعدك على فهم أي مسار كاريبي يبدو أقرب إلى وضعك قبل الانتقال إلى جهة مرخصة.",
          formSubmit: "اطلب استشارة خاصة",
          faqEyebrow: "الأسئلة الشائعة",
          faqTitle: "أسئلة يطرحها المستثمرون عندما تصبح المقارنة أكثر جدية.",
          faqDescription: "الإجابات هنا تساعد على إبقاء المقارنة مفيدة من دون وعود زائفة أو يقين مبالغ فيه.",
          ctaEyebrow: "استشارة خاصة",
          ctaTitle: "هل تريد تضييق القائمة بعيدًا عن التصنيفات العامة؟",
          ctaDescription: "الاستشارة الخاصة غالبًا هي أسرع طريقة لتحويل مقارنة واسعة إلى خطوة واقعية تليق بملفك.",
          ctaPrimary: "اطلب استشارة خاصة",
          ctaSecondary: "تواصل مع فريقنا",
        }
      : null
  const localizedTrustItems =
    locale === "ar"
      ? [
          {
            title: "قارن بحسب الملاءمة لا الضجيج",
            description: "كثير من المستثمرين لا يحتاجون إلى البرنامج الأعلى صوتًا، بل إلى البرنامج الأقرب لملفهم الفعلي.",
          },
          {
            title: "الفروقات الحقيقية أضيق مما تبدو",
            description: "الاستخدام العملي لبرامج الكاريبي الرئيسية غالبًا أقرب إلى بعضه مما توحي به صفحات التصنيف.",
          },
          {
            title: "الهيكل العائلي يغيّر القرار",
            description: "البرنامج الذي يبدو مناسبًا لفرد واحد قد يبدو مختلفًا تمامًا عند إدخال الزوجة أو الأبناء أو المعالين.",
          },
          {
            title: "السمعة والتنفيذ مهمان",
            description: "تموضع البرنامج، وجودة الجهة المنفذة، وجاهزية الملف للعناية الواجبة كلها تؤثر في النتيجة النهائية.",
          },
        ]
      : trustItems
  const localizedProcessSteps =
    locale === "ar"
      ? [
          {
            icon: Compass,
            title: "1. حدّد ما الذي يهمك فعليًا",
            description: "ابدأ بتحديد ما إذا كنت تركز على الكلفة، أو العائلة، أو السمعة، أو استخدام استراتيجي أوسع.",
          },
          {
            icon: Landmark,
            title: "2. قارن بين القائمة الصحيحة",
            description: "غالبًا ما تغطي سانت كيتس، ودومينيكا، وأنتيغوا، وغرينادا معظم المقارنات الجدية في الكاريبي.",
          },
          {
            icon: Users,
            title: "3. اختبر ملاءمة العائلة",
            description: "المقارنة تتغير فعليًا عند إدخال هيكل الأسرة، والإقامة الحالية، وطبيعة الوثائق المتاحة.",
          },
          {
            icon: ShieldCheck,
            title: "4. انتقل إلى مراجعة خاصة",
            description: "بعد تضييق الخيارات فقط يصبح من المنطقي الانتقال إلى جهة مرخصة أو إلى عناية واجبة أكثر رسمية.",
          },
        ]
      : processSteps
  const localizedFaqs =
    locale === "ar"
      ? [
          {
            question: "أي برنامج كاريبي يعتبر الأفضل عادة؟",
            answer:
              "لا توجد إجابة واحدة للجميع. سانت كيتس تميل إلى السمعة، ودومينيكا إلى القيمة العملية، وأنتيغوا إلى الملاءمة العائلية، وغرينادا إلى الاستخدام الأكثر استراتيجية.",
          },
          {
            question: "هل الفروقات في حرية التنقل كبيرة فعلًا؟",
            answer:
              "غالبًا لا. بالنسبة لكثير من المستثمرين، الفجوة العملية بين البرامج الكبرى أصغر من الفجوة الموجودة في الخطاب التسويقي حولها.",
          },
          {
            question: "هل يجب أن أبني القرار على الكلفة فقط؟",
            answer:
              "الكلفة مهمة، لكن هيكل العائلة، وقوة الوثائق، والهدف الاستراتيجي، وطبيعة الاستخدام النهائي غالبًا أهم من أقل رقم ظاهر.",
          },
          {
            question: "متى تصبح الاستشارة الخاصة أفضل من المقارنة الذاتية؟",
            answer:
              "عندما تكون الحالة عائلية، أو مرتبطة بإقامة خليجية، أو فيها نشاط تجاري، أو ضغط زمني، تصبح الاستشارة الخاصة عادة خطوة أكثر فائدة.",
          },
        ]
      : faqs
  const localizedMisses =
    locale === "ar"
      ? [
          {
            icon: BadgeCheck,
            title: "لا تبنِ القرار على التصنيف فقط",
            text: "الفروقات الصغيرة في الترتيب نادرًا ما تشرح وحدها أفضل قرار لملف جاد.",
          },
          {
            icon: Users,
            title: "حالات العائلة تغيّر الحسابات",
            text: "المسار الذي يبدو اقتصاديًا لشخص واحد قد يتغير تمامًا عند إضافة الزوجة أو الأبناء.",
          },
          {
            icon: CircleDollarSign,
            title: "الكلفة المعلنة ليست الكلفة النهائية",
            text: "العناية الواجبة، والتابعون، وتعقيد الملف كلها تؤثر في الصورة الحقيقية.",
          },
          {
            icon: ShieldCheck,
            title: "قوة الملف ما زالت مهمة",
            text: "حتى المسار المناسب قد يصبح أصعب إذا كانت الرواية الوثائقية أو الجاهزية ضعيفة.",
          },
        ]
      : [
          {
            icon: BadgeCheck,
            title: "Do not buy on rankings alone",
            text: "Small differences in mobility rankings rarely explain the best decision by themselves.",
          },
          {
            icon: Users,
            title: "Family cases change the math",
            text: "A route that looks economical for one person can feel different with spouse and children.",
          },
          {
            icon: CircleDollarSign,
            title: "Headline cost is not total cost",
            text: "Due diligence, dependants, and file complexity all affect the real picture.",
          },
          {
            icon: ShieldCheck,
            title: "A clean file still matters",
            text: "Even the most suitable route can become difficult if the documentation story is weak.",
          },
        ]

  return (
    <SiteShell>
      <LandingHero
        eyebrow={copy?.heroEyebrow ?? "Caribbean comparison"}
        title={copy?.heroTitle ?? "A realistic comparison of the main Caribbean citizenship by investment routes."}
        description={copy?.heroDescription ?? "Most Caribbean programs are closer in practical value than marketing suggests. The stronger decision usually comes from understanding cost logic, family fit, positioning, and strategic use honestly."}
        primaryAction={{ href: "#compare", label: copy?.heroPrimary ?? "Compare the programs" }}
        secondaryAction={{ href: routes.bookConsultation, label: copy?.heroSecondary ?? "Request a consultation" }}
        stats={copy?.stats ?? [
          { value: "Value", label: "compare real economics, not brochure snapshots" },
          { value: "Family fit", label: "household structure changes the answer quickly" },
          { value: "Positioning", label: "reputation still matters for some investors" },
        ]}
        highlights={copy?.highlights ?? [
          "Useful for investors narrowing a serious Caribbean shortlist.",
          "Built for profile-led decisions rather than generic rankings.",
          "Connected directly to consultation and deeper process pages.",
        ]}
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <TrustGrid items={localizedTrustItems} />
        </div>
      </section>

      <section id="compare" className="section-padding pt-0">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow={copy?.compareEyebrow ?? "Comparison matrix"}
            title={copy?.compareTitle ?? "The practical differences usually sit in fit, economics, and positioning."}
            description={copy?.compareDescription ?? "This is the comparison frame we would use in a first advisory conversation before matters move towards formal review."}
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
                factor: "Typical angle",
                values: [
                  "Premium and mature",
                  "Practical and efficient",
                  "Often family-led",
                  "Broader strategic use",
                ],
              },
              {
                factor: "Who often chooses it",
                values: [
                  "Reputation-conscious investors",
                  "Value-focused applicants",
                  "Households comparing total fit",
                  "Business owners and planners",
                ],
              },
              {
                factor: "Main trade-off",
                values: [
                  "Higher threshold",
                  "Less prestige differentiation",
                  "Needs careful family modeling",
                  "Not always the simplest answer",
                ],
              },
              {
                factor: "Best next question",
                values: [
                  "Is premium positioning worth the cost?",
                  "Does value outweigh brand optics?",
                  "How does this work for the whole family?",
                  "Do you need strategic optionality or just mobility?",
                ],
              },
            ]}
          />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy?.processEyebrow ?? "How to use this page"}
            title={copy?.processTitle ?? "A better comparison starts with the right shortlist and the right questions."}
            description={copy?.processDescription ?? "Do not use this page to chase a winner. Use it to narrow the route that deserves a more serious consultation."}
          />
          <ProcessSteps steps={localizedProcessSteps} />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow={copy?.missesEyebrow ?? "What investors often miss"}
            title={copy?.missesTitle ?? "The strongest route is often the one that feels most coherent once your real profile is on the table."}
            description={copy?.missesDescription ?? "That means budget is only one part of the conversation. Family inclusion, residence history, business structure, and how much weight you place on program reputation all matter."}
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {localizedMisses.map((item) => (
              <Card key={item.title} className="section-card h-full">
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
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <span className="eyebrow">{copy?.reviewEyebrow ?? "Need help deciding?"}</span>
            <h2 className="section-title max-w-xl text-foreground">{copy?.reviewTitle ?? "Use a private review if the comparison already feels close."}</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              {copy?.reviewDescription ?? "This is especially useful if you are comparing routes for a family, a GCC-based residence situation, or a business-owner profile where the trade-offs are less obvious."}
            </p>
            <LandingLinkGrid
              items={copy?.links ?? [
                {
                  title: "Broad pillar page",
                  description: "Go back to the authority page if you want a wider explanation before narrowing further.",
                  href: routes.programs,
                },
                {
                title: "Arrange a private consultation",
                  description: "Move to a more direct conversation if the shortlist already feels meaningful.",
                  href: routes.bookConsultation,
                },
                {
                  title: "Explore insights",
                  description: "Continue reading if you want deeper guidance on cost, due diligence, or GCC-specific use cases.",
                  href: routes.insights,
                },
              ]}
            />
          </div>
          <LocalizedLandingLeadForm
            locale={locale}
            title={copy?.formTitle ?? "Request a comparison review"}
            description={copy?.formDescription ?? "Tell us a little about your profile and we will help you understand which Caribbean route appears strongest before the discussion becomes more formal."}
            submitLabel={copy?.formSubmit ?? "Request a consultation"}
            sourceCategory="comparison"
            sourcePage="caribbean-cbi-comparison"
          />
        </div>
      </section>

      <LandingFaqSection
        eyebrow={copy?.faqEyebrow ?? "FAQ"}
        title={copy?.faqTitle ?? "Questions investors usually ask once the shortlist gets real."}
        description={copy?.faqDescription ?? "These answers are meant to keep the comparison useful without forcing a false sense of certainty."}
        items={localizedFaqs}
      />

      <LandingCtaSection
        eyebrow={copy?.ctaEyebrow ?? "Private consultation"}
        title={copy?.ctaTitle ?? "Want help narrowing the shortlist without relying on generic rankings?"}
        description={copy?.ctaDescription ?? "A private consultation is often the fastest way to turn a broad comparison into a realistic next step."}
        primaryAction={{ href: routes.bookConsultation, label: copy?.ctaPrimary ?? "Request a consultation" }}
        secondaryAction={{ href: routes.contact, label: copy?.ctaSecondary ?? "Arrange a written introduction" }}
      />
    </SiteShell>
  )
}
