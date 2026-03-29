import type { Metadata } from "next"
import { Compass, LockKeyhole, Network, ShieldCheck } from "lucide-react"
import { CtaPanel } from "@/components/cta-panel"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getLocalizedRouteLinks } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  const localized = {
    en: {
      title: "Our Approach",
      description:
        "CBI Deal provides a structured and discreet starting point for individuals exploring citizenship and residency pathways.",
    },
    ar: {
      title: "نهجنا",
      description:
        "يوفّر CBI Deal نقطة بداية أكثر هدوءاً وتنظيماً للأفراد الذين يدرسون مسارات الجنسية والإقامة.",
    },
    ru: {
      title: "Наш подход",
      description:
        "CBI Deal предлагает структурированную и конфиденциальную отправную точку для тех, кто рассматривает маршруты гражданства и резидентства.",
    },
  }[locale]

  return buildPageMetadata({
    title: localized.title,
    description: localized.description,
    path: localizeHref(locale, "/about"),
    keywords: [
      "citizenship advisory approach",
      "residency advisory approach",
      "private citizenship advisory gateway",
    ],
    locale,
  })
}

const principleCards = [
  {
    icon: Compass,
    title: "Structured perspective",
    description:
      "Complex cross-border decisions tend to benefit from a more ordered starting point, especially where several jurisdictions or route types are being weighed at once.",
  },
  {
    icon: ShieldCheck,
    title: "Context-driven guidance",
    description:
      "No route should be considered in isolation. Timing, family circumstances, mobility priorities, and wider planning considerations all affect suitability.",
  },
  {
    icon: Network,
    title: "Relevant access",
    description:
      "Where appropriate, the platform can help bring clarity to which licensed counterparties or formal next steps may be worth considering more seriously.",
  },
  {
    icon: LockKeyhole,
    title: "Discreet process",
    description:
      "The experience is intended to remain calm, selective, and privacy-aware from the outset, particularly for sensitive family or international planning decisions.",
  },
]

export default function AboutPage() {
  const locale = getRequestLocale()
  const routes = getLocalizedRouteLinks(locale)
  const copy =
    locale === "ar"
      ? {
          heroEyebrow: "نهجنا",
          heroTitle: "نهجنا",
          heroDescription:
            "يوفّر CBI Deal نقطة بداية أكثر هدوءاً وتنظيماً للأفراد الذين يدرسون مسارات الجنسية والإقامة.",
          heroPrimary: "استكشف الخيارات",
          heroSecondary: "اطلب استشارة خاصة",
          principlesEyebrow: "المبادئ الأساسية",
          principlesTitle: "مدخل أكثر هدوءاً ووضوحاً للقرارات الدولية المعقدة.",
          principlesDescription:
            "الهدف ليس الإكثار من الوعود، بل توفير إطار أكثر اتزاناً يساعد على قراءة الخيارات بوضوح أكبر.",
          principleCards: [
            {
              title: "رؤية منظمة",
              description:
                "القرارات العابرة للحدود تستفيد عادةً من نقطة بداية أكثر ترتيباً، خصوصاً عندما تتعدد الجهات والمسارات المحتملة.",
            },
            {
              title: "توجيه قائم على السياق",
              description:
                "لا يمكن قراءة أي مسار بمعزل عن التوقيت، ووضع العائلة، وأولويات التنقل، واعتبارات التخطيط الأوسع.",
            },
            {
              title: "وصول ذو صلة",
              description:
                "عندما يبدو ذلك مناسباً، تساعد المنصة على توضيح الجهة المرخصة أو الخطوة الرسمية التي تستحق مزيداً من النظر.",
            },
            {
              title: "مسار أكثر تحفظاً",
              description:
                "التجربة مصممة لتبقى هادئة وانتقائية وواعية بالخصوصية منذ البداية، خصوصاً في القرارات العائلية أو الدولية الحساسة.",
            },
          ],
          supportingEyebrow: "لماذا هذا النهج مهم؟",
          supportingTitle: "المسارات والجهات تختلف، وكذلك ما يناسب كل حالة.",
          supportingDescription:
            "الاختلاف بين الولايات القضائية والبرامج لا يتعلق فقط بالشروط أو التكاليف، بل أيضاً بكيفية انسجام كل مسار مع التوقيت، وبنية العائلة، ودرجة الجاهزية، وطبيعة الأهداف طويلة المدى. صُممت المنصة لتساعد الزائر على الاقتراب من هذه القرارات بقدر أكبر من الوضوح والملاءمة.",
          ctaEyebrow: "الخطوة التالية",
          ctaTitle: "اطلب استشارة خاصة",
          ctaDescription:
            "إذا بدا أن حالتك تستحق نقاشاً أولياً أكثر هدوءاً، يمكنك استخدام هذه الخطوة لفهم ما إذا كان من المناسب الاستمرار.",
          ctaPrimary: "اطلب استشارة خاصة",
          ctaSecondary: "استكشف الخيارات",
        }
      : locale === "ru"
        ? {
            heroEyebrow: "Наш подход",
            heroTitle: "Наш подход",
            heroDescription:
              "CBI Deal предлагает более спокойную и структурированную отправную точку для людей, рассматривающих маршруты гражданства и резидентства.",
            heroPrimary: "Изучить варианты",
            heroSecondary: "Запросить частную консультацию",
            principlesEyebrow: "Ключевые принципы",
            principlesTitle: "Более ясная отправная точка для сложных международных решений.",
            principlesDescription:
              "Речь не о громких обещаниях, а о более взвешенной рамке, которая помогает смотреть на варианты с большей ясностью.",
            principleCards: [
              {
                title: "Структурированный взгляд",
                description:
                  "Сложные трансграничные решения обычно требуют более упорядоченной отправной точки, особенно когда рассматриваются несколько юрисдикций или типов маршрутов.",
              },
              {
                title: "Контекстная оценка",
                description:
                  "Ни один маршрут не стоит рассматривать изолированно. На пригодность влияют сроки, семья, приоритеты мобильности и более широкое планирование.",
              },
              {
                title: "Релевантный доступ",
                description:
                  "Когда это уместно, платформа помогает понять, какие лицензированные участники или формальные следующие шаги действительно стоят дальнейшего рассмотрения.",
              },
              {
                title: "Сдержанный процесс",
                description:
                  "Опыт задуман как спокойный, избирательный и чувствительный к приватности с самого начала, особенно в деликатных семейных и международных вопросах.",
              },
            ],
            supportingEyebrow: "Почему это важно",
            supportingTitle: "Юрисдикции и маршруты различаются, как и то, что подходит конкретной ситуации.",
            supportingDescription:
              "Разница между юрисдикциями и программами определяется не только условиями или стоимостью, но и тем, насколько каждый маршрут согласуется со сроками, семейной структурой, уровнем готовности и долгосрочными целями. Платформа задумана так, чтобы помогать подходить к этим решениям с большей ясностью и уместностью.",
            ctaEyebrow: "Следующий шаг",
            ctaTitle: "Запросить частную консультацию",
            ctaDescription:
              "Если ваша ситуация требует более спокойного первого разговора, этот шаг поможет понять, есть ли смысл двигаться дальше.",
            ctaPrimary: "Запросить консультацию",
            ctaSecondary: "Изучить варианты",
          }
        : {
            heroEyebrow: "Our approach",
            heroTitle: "Our approach",
            heroDescription:
              "CBI Deal provides a structured and discreet starting point for individuals exploring citizenship and residency pathways.",
            heroPrimary: "Explore your options",
            heroSecondary: "Request a private consultation",
            principlesEyebrow: "Core principles",
            principlesTitle: "A more considered starting point for complex international decisions.",
            principlesDescription:
              "The intention is not to overstate certainty, but to provide a more disciplined frame through which options can be approached with greater clarity.",
            principleCards,
            supportingEyebrow: "Why this matters",
            supportingTitle: "Jurisdictions and pathways vary, as does what is suitable for each case.",
            supportingDescription:
              "Different jurisdictions and pathway structures require careful consideration. Suitability is rarely defined by a single programme feature; it is shaped by timing, family circumstances, preparedness, and longer-term priorities. The platform is designed to help visitors approach these decisions with greater clarity and suitability.",
            ctaEyebrow: "Next step",
            ctaTitle: "Request a private consultation",
            ctaDescription:
              "If your situation would benefit from a more considered first conversation, this is the appropriate point to begin.",
            ctaPrimary: "Request a consultation",
            ctaSecondary: "Explore your options",
          }

  const cards = copy.principleCards.map((card, index) => ({
    ...card,
    icon: principleCards[index]?.icon ?? Compass,
  }))

  return (
    <SiteShell>
      <PageHero
        eyebrow={copy.heroEyebrow}
        title={copy.heroTitle}
        description={copy.heroDescription}
        primaryAction={{ href: routes.programs, label: copy.heroPrimary }}
        secondaryAction={{ href: routes.bookConsultation, label: copy.heroSecondary }}
        showGuideLink={false}
        secondaryActionStyle="text"
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.principlesEyebrow}
            title={copy.principlesTitle}
            description={copy.principlesDescription}
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((item) => (
              <Card key={item.title} className="section-card h-full">
                <CardContent className="section-stack flex h-full min-h-[220px] justify-center p-7 md:p-8">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="max-w-[14rem] text-[1.28rem] leading-[1.22] text-foreground md:text-[1.4rem]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.supportingEyebrow}
            title={copy.supportingTitle}
            description={copy.supportingDescription}
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow={copy.ctaEyebrow}
            title={copy.ctaTitle}
            description={copy.ctaDescription}
            primaryAction={{ href: routes.bookConsultation, label: copy.ctaPrimary }}
            secondaryAction={{ href: routes.programs, label: copy.ctaSecondary }}
            showGuideLink={false}
          />
        </div>
      </section>
    </SiteShell>
  )
}
