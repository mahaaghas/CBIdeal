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
        "Read how investor enquiries and company CRM information are handled with confidentiality, structured access, and a privacy-aware approach.",
    },
    ar: {
      title: "حماية البيانات والسرية",
      description: "تعرف على كيفية التعامل مع استفسارات المستثمرين وبيانات CRM الخاصة بالشركات بسرية وبنهج واعٍ بالخصوصية.",
    },
    ru: {
      title: "Защита данных и конфиденциальность",
      description:
        "Узнайте, как запросы инвесторов и CRM-данные компаний обрабатываются конфиденциально и с учётом приватности.",
    },
  }[locale]

  return buildPageMetadata({
    title: localized.title,
    description: localized.description,
    path: localizeHref(locale, "/data-protection"),
    keywords: [
      "data protection immigration CRM",
      "confidential investor enquiries",
      "privacy immigration firm software",
    ],
    locale,
  })
}

const sections = [
  {
    title: "Confidential investor enquiries",
    body: "Investor submissions are intended to be reviewed only for qualification, provider matching, and appropriate follow-up. The goal is to keep sensitive immigration interest handled with care and relevance.",
  },
  {
    title: "Responsible company data handling",
    body: "Company and CRM enquiries are positioned around controlled internal use, structured access, and workflow clarity. The website language is designed to reassure buyers that client information should not be handled casually.",
  },
  {
    title: "Limited use of submitted information",
    body: "Submitted details are used to review requests, coordinate follow-up, and route enquiries to the relevant internal team or matched provider. Access is kept limited to the people involved in handling the request responsibly.",
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
            body: "تهدف طلبات المستثمرين إلى المراجعة لأغراض التأهيل ومطابقة المزود والمتابعة المناسبة فقط. الهدف هو التعامل مع الاهتمام ببرامج الهجرة الحساسة بعناية وملاءمة.",
          },
          {
            title: "التعامل المسؤول مع بيانات الشركات",
            body: "تتمحور استفسارات الشركات وطلبات CRM حول الاستخدام الداخلي المنضبط والصلاحيات المنظمة ووضوح سير العمل. صياغة الموقع مصممة لطمأنة المشترين بأن بيانات العملاء لا تُدار بشكل عشوائي.",
          },
          {
            title: "استخدام محدود للمعلومات المرسلة",
            body: "تُستخدم البيانات المرسلة لمراجعة الطلبات وتنسيق المتابعة وتوجيه الاستفسارات إلى الفريق الداخلي المناسب أو المزود المطابق. ويظل الوصول محصورًا في الأشخاص المعنيين بالتعامل المسؤول مع الطلب.",
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
              body: "Инвесторские заявки предназначены только для квалификации, подбора провайдера и корректного follow-up. Цель — бережно и релевантно работать с чувствительным интересом к иммиграционным программам.",
            },
            {
              title: "Ответственное обращение с данными компаний",
              body: "Запросы компаний и CRM-потоки строятся вокруг контролируемого внутреннего использования, структурированного доступа и понятного workflow. Формулировки сайта должны показывать, что клиентские данные не обрабатываются легкомысленно.",
            },
            {
              title: "Ограниченное использование отправленной информации",
              body: "Отправленные данные используются для рассмотрения запросов, координации follow-up и маршрутизации к соответствующей внутренней команде или подобранному провайдеру. Доступ ограничен людьми, которые действительно участвуют в обработке запроса.",
            },
            {
              title: "Вопросы и concerns по данным",
              body: "У пользователей и партнерских компаний должен быть понятный способ поднимать privacy-вопросы. Эта страница сохраняет такой канал видимым до финального согласования юридического текста и данных операционной компании.",
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
          : "Confidentiality and responsible data handling matter on both sides of the business.",
    heroDescription:
      locale === "ar"
        ? "تمنح هذه الصفحة المستثمرين والشركات شرحًا نظيفًا وموثوقًا لكيفية التعامل مع المعلومات المرسلة دون تعقيد قانوني غير ضروري."
        : locale === "ru"
          ? "Эта страница дает инвесторам и компаниям понятное и убедительное объяснение того, как обрабатывается отправленная информация без лишнего юридического шума."
          : "This gives investors and companies a clean, credible explanation of how submitted information is handled, without unnecessary legal jargon.",
    primary: locale === "ar" ? "تواصل معنا بخصوص الخصوصية" : locale === "ru" ? "Связаться по вопросам приватности" : "Contact us about privacy",
    secondary: locale === "ar" ? "العودة إلى صفحة الشركات" : locale === "ru" ? "Назад к странице для компаний" : "Back to company overview",
    overviewEyebrow: locale === "ar" ? "نظرة عامة" : locale === "ru" ? "Обзор" : "Overview",
    overviewTitle:
      locale === "ar"
        ? "نهج واعٍ بالخصوصية تجاه معلومات المستثمرين والشركات."
        : locale === "ru"
          ? "Privacy-aware подход к данным инвесторов и компаний."
          : "A privacy-aware approach to investor and company information.",
    overviewDescription:
      locale === "ar"
        ? "هذا شرح موجز يعزز الثقة حول كيفية تعامل النشاط مع الاستفسارات السرية والبيانات المرتبطة بالـ CRM."
        : locale === "ru"
          ? "Это краткое trust-building объяснение того, как бизнес обращается с конфиденциальными заявками и данными, связанными с CRM."
          : "This is a concise, trust-building explanation of how the business handles confidential enquiries and CRM-related data.",
    ctaEyebrow: locale === "ar" ? "الخطوة التالية" : locale === "ru" ? "Следующий шаг" : "Next step",
    ctaTitle:
      locale === "ar"
        ? "هل تحتاج إلى مناقشة الخصوصية أو إطلاق CRM أو التعامل مع العملاء المحتملين بمزيد من التفصيل؟"
        : locale === "ru"
          ? "Нужно подробнее обсудить privacy, rollout CRM или обработку инвесторских лидов?"
          : "Need to discuss privacy, CRM rollout, or investor lead handling in more detail?",
    ctaDescription:
      locale === "ar"
        ? "استخدم صفحة التواصل لأسئلة الخصوصية أو استفسارات الشركات أو طلبات المستثمرين التي تحتاج إلى محادثة مباشرة."
        : locale === "ru"
          ? "Используйте контактную страницу для privacy-вопросов, запросов компаний или инвесторских обращений, которым нужен прямой разговор."
          : "Use contact for privacy questions, company enquiries, or investor requests that require a direct conversation.",
    goContact: locale === "ar" ? "اذهب إلى التواصل" : locale === "ru" ? "Перейти к контактам" : "Go to contact",
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
            description="This notice clarifies the role of the platform, the role of licensed partners, and the standards we expect across every enquiry."
          />
          <Card className="section-card">
            <CardContent className="space-y-5 p-8 md:p-10">
              <p className="text-base leading-8 text-muted-foreground">
                We operate as an independent advisory and lead-generation platform connecting prospective clients with licensed citizenship and residency by investment providers.
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
