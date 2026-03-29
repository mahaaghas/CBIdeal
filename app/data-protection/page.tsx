import type { Metadata } from "next"
import { CtaPanel } from "@/components/cta-panel"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getLocalizedCtaLinks, getLocalizedRouteLinks } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  const localized = {
    en: {
      title: "Data Protection and Confidentiality",
      description:
        "Read how investor and professional enquiries are handled with confidentiality, structured access, and a privacy-aware approach.",
    },
    ar: {
      title: "حماية البيانات والسرية",
      description: "تعرف على كيفية التعامل مع استفسارات المستثمرين والاستفسارات المهنية بسرية وبنهج واعٍ بالخصوصية.",
    },
    ru: {
      title: "Защита данных и конфиденциальность",
      description:
        "Узнайте, как запросы инвесторов и профессиональные обращения обрабатываются конфиденциально и с учётом приватности.",
    },
  }[locale]

  return buildPageMetadata({
    title: localized.title,
    description: localized.description,
    path: localizeHref(locale, "/data-protection"),
    keywords: [
      "data protection advisory enquiries",
      "confidential investor enquiries",
      "private consultation privacy",
    ],
    locale,
  })
}

const sections = [
  {
    title: "Confidential investor enquiries",
    body: "Investor submissions are reviewed only for the purpose of understanding the enquiry and deciding whether a further discussion would be appropriate.",
  },
  {
    title: "Responsible company data handling",
    body: "Professional enquiries are handled with restricted access and a measured internal review so that sensitive commercial information is treated with care.",
  },
  {
    title: "Limited use of submitted information",
    body: "Submitted details are used only to review requests, respond appropriately, and maintain a clear record of the enquiry. Access is limited to the people involved in handling it responsibly.",
  },
  {
    title: "Questions and data concerns",
    body: "Users and partner companies should have a clear way to raise privacy or data concerns. This page keeps that communication path visible until final legal text and operating entity details are signed off.",
  },
]

export default function DataProtectionPage() {
  const locale = getRequestLocale()
  const ctaLinks = getLocalizedCtaLinks(locale)
  const routeLinks = getLocalizedRouteLinks(locale)
  const localizedSections =
    locale === "ar"
      ? [
          {
            title: "استفسارات المستثمرين السرية",
            body: "تتم مراجعة طلبات المستثمرين فقط من أجل فهم الاستفسار وتحديد ما إذا كانت هناك حاجة إلى نقاش لاحق أكثر تفصيلاً. الهدف هو التعامل مع هذا النوع من الاهتمام بعناية وملاءمة.",
          },
          {
            title: "التعامل المسؤول مع بيانات الشركات",
            body: "تُعامل الاستفسارات المهنية في إطار وصول منظم ومراجعة داخلية هادئة حتى تبقى المعلومات التجارية الحساسة مصونة ومحدودة التداول.",
          },
          {
            title: "استخدام محدود للمعلومات المرسلة",
            body: "تُستخدم البيانات المرسلة فقط لمراجعة الطلبات والرد عليها والاحتفاظ بسجل واضح لها. ويظل الوصول محصوراً في الأشخاص المعنيين بالتعامل المسؤول مع الاستفسار.",
          },
          {
            title: "الأسئلة ومخاوف البيانات",
            body: "يجب أن يكون لدى المستخدمين والشركات الشريكة طريق واضح لإثارة المخاوف المتعلقة بالخصوصية أو البيانات. وتبقي هذه الصفحة هذا المسار ظاهرًا إلى أن يتم اعتماد النص القانوني النهائي وتفاصيل الكيان التشغيلي.",
          },
        ]
      : locale === "ru"
        ? [
            {
              title: "Конфиденциальные запросы инвесторов",
              body: "Инвесторские обращения рассматриваются только для понимания сути запроса и оценки того, уместен ли более подробный следующий разговор. Цель — работать с таким интересом бережно и релевантно.",
            },
            {
              title: "Ответственное обращение с данными компаний",
              body: "Профессиональные запросы обрабатываются в формате ограниченного доступа и спокойного внутреннего рассмотрения, чтобы чувствительная коммерческая информация оставалась защищённой.",
            },
            {
              title: "Ограниченное использование отправленной информации",
              body: "Отправленные данные используются только для рассмотрения запросов, корректного ответа и сохранения понятной записи об обращении. Доступ ограничен теми, кто действительно участвует в его обработке.",
            },
            {
              title: "Вопросы и concerns по данным",
              body: "У пользователей и профессиональных контрагентов должен быть понятный способ поднимать вопросы приватности. Эта страница сохраняет такой канал видимым и понятным.",
            },
          ]
        : sections
  const copy = {
    heroEyebrow: locale === "ar" ? "حماية البيانات" : locale === "ru" ? "Защита данных" : "Data protection",
    heroTitle:
      locale === "ar"
        ? "السرية والتعامل المسؤول مع البيانات مهمان على جانبي النشاط."
        : locale === "ru"
          ? "Конфиденциальность и ответственная работа с данными важны для обеих сторон бизнеса."
      : "Confidentiality and responsible data handling are central to the platform.",
    heroDescription:
      locale === "ar"
        ? "تمنح هذه الصفحة المستثمرين والشركات شرحًا نظيفًا وموثوقًا لكيفية التعامل مع المعلومات المرسلة دون تعقيد قانوني غير ضروري."
        : locale === "ru"
          ? "Эта страница дает инвесторам и компаниям понятное и убедительное объяснение того, как обрабатывается отправленная информация без лишнего юридического шума."
          : "This page explains how submitted information is handled, why confidentiality is treated seriously, and where to look if a more detailed privacy question arises. It is intended to give both investors and professional firms a clearer understanding of the platform's approach.",
    primary: locale === "ar" ? "تواصل معنا بخصوص الخصوصية" : locale === "ru" ? "Связаться по вопросам приватности" : "Raise a privacy question",
    secondary: locale === "ar" ? "العودة إلى الصفحة الرئيسية" : locale === "ru" ? "Назад на главную" : "Return home",
    overviewEyebrow: locale === "ar" ? "نظرة عامة" : locale === "ru" ? "Обзор" : "Overview",
    overviewTitle:
      locale === "ar"
        ? "نهج واعٍ بالخصوصية تجاه معلومات المستثمرين والشركات."
        : locale === "ru"
          ? "Privacy-aware подход к данным инвесторов и компаний."
      : "A privacy-aware approach to sensitive enquiries.",
    overviewDescription:
      locale === "ar"
        ? "هذا شرح موجز يعزز الثقة حول كيفية تعامل المنصة مع الاستفسارات السرية والبيانات المرتبطة بها."
        : locale === "ru"
          ? "Это краткое и спокойное объяснение того, как платформа обращается с конфиденциальными обращениями и связанными с ними данными."
      : "The section below sets out the main principles in straightforward terms, so visitors can understand the essentials without having to work through unnecessary legal language.",
    ctaEyebrow: locale === "ar" ? "الخطوة التالية" : locale === "ru" ? "Следующий шаг" : "Next step",
    ctaTitle:
      locale === "ar"
        ? "هل تحتاج إلى مناقشة الخصوصية أو السرية بمزيد من التفصيل؟"
        : locale === "ru"
          ? "Нужно подробнее обсудить приватность или конфиденциальность?"
      : "Need to discuss privacy or confidentiality in more detail?",
    ctaDescription:
      locale === "ar"
        ? "استخدم صفحة التواصل إذا كنت ترغب في طرح سؤال متعلق بالخصوصية أو متابعة النقاش بشكل مباشر."
        : locale === "ru"
          ? "Используйте контактную страницу, если хотите поднять вопрос приватности или продолжить разговор напрямую."
          : "Use the contact page if you would like to raise a privacy question or continue the discussion directly.",
    goContact: locale === "ar" ? "تواصل معنا" : locale === "ru" ? "Связаться с нами" : "Contact us",
  }
  return (
    <SiteShell>
      <PageHero
        eyebrow={copy.heroEyebrow}
        title={copy.heroTitle}
        description={copy.heroDescription}
        primaryAction={{ href: ctaLinks.privacyContact, label: copy.primary }}
        secondaryAction={{ href: routeLinks.forCompanies, label: copy.secondary }}
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.overviewEyebrow}
            title={copy.overviewTitle}
            description={copy.overviewDescription}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {localizedSections.map((section) => (
              <Card key={section.title} className="section-card">
                <CardContent className="space-y-4 p-8">
                  <h3 className="text-2xl text-foreground">{section.title}</h3>
                  <p className="text-base leading-8 text-muted-foreground">{section.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Compliance"
            title="Compliance & Regulatory Notice"
            description="This notice clarifies the role of the platform, the role of licensed partners, and the standards expected across every enquiry, so the distinction between advisory access and formal programme decision-making remains clear."
          />
          <Card className="section-card">
            <CardContent className="space-y-5 p-8 md:p-10">
              <p className="text-base leading-8 text-muted-foreground">
We operate as an independent advisory platform connecting prospective clients with licensed citizenship and residency by investment providers.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                We do not issue passports, provide legal nationality decisions, or act as a governmental authority. All applications are processed and approved solely by the respective official government programs and authorized agents.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                We are committed to complying with all applicable European Union regulations, international sanctions frameworks, and anti-money laundering (AML) and know-your-customer (KYC) standards.
              </p>
              <p className="text-base leading-8 text-muted-foreground">
                Our services are not available to individuals or entities subject to international sanctions or restrictions. All clients are expected to undergo full due diligence procedures conducted by the respective program authorities and licensed partners.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow={copy.ctaEyebrow}
            title={copy.ctaTitle}
            description={copy.ctaDescription}
            primaryAction={{ href: ctaLinks.privacyContact, label: copy.goContact }}
            secondaryAction={{ href: ctaLinks.returnHome, label: "Return home" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
