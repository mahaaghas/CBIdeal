import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BarChart3, Building2, FileCheck2, MessagesSquare, ShieldCheck } from "lucide-react"
import { CtaPanel } from "@/components/cta-panel"
import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { MeetingSchedulerCard } from "@/components/meeting-scheduler-card"
import { PageHero } from "@/components/page-hero"
import { PricingSection } from "@/components/pricing-section"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { TrustGrid } from "@/components/trust-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingPageRenderer } from "@/components/cms/landing-page-renderer"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { siteImages } from "@/lib/site-images"
import { getLocalizedCtaLinks, getLocalizedRouteLinks } from "@/lib/site"
import { getLandingPageBySlug, getResolvedSiteSettings } from "@/lib/sanity/content"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  const [cmsPage, settings] = await Promise.all([
    getLandingPageBySlug("for-companies"),
    getResolvedSiteSettings(),
  ])

  if (cmsPage?.seo) {
    return buildPageMetadata({
      title: cmsPage.seo.title || cmsPage.title,
      description: cmsPage.seo.description || settings.siteDescription,
      path: localizeHref(locale, "/for-companies"),
      keywords: cmsPage.seo.keywords ?? [
        "licensed firms",
        "professional immigration enquiries",
        "advisory practice overview",
      ],
      image: cmsPage.seo.openGraphImage?.url,
      openGraphTitle: cmsPage.seo.openGraphTitle,
      openGraphDescription: cmsPage.seo.openGraphDescription,
      noIndex: cmsPage.seo.noIndex,
      siteName: settings.siteName,
      siteUrl: settings.siteUrl,
      locale,
    })
  }

  return buildPageMetadata({
    title:
      locale === "ar"
        ? "للمكاتب المرخصة والممارسات الاستشارية"
        : locale === "ru"
          ? "Для лицензированных фирм и консультативных практик"
          : "For Licensed Firms and Advisory Practices",
    description:
      locale === "ar"
        ? "مدخل مهني أكثر هدوءاً للمكاتب المرخصة والممارسات الاستشارية التي ترغب في مناقشة مناسبة ومحددة."
        : locale === "ru"
          ? "Более спокойная профессиональная точка входа для лицензированных фирм и консультативных практик."
          : "Explore a structured entry point for licensed firms and advisory practices seeking a more private professional discussion.",
    path: localizeHref(locale, "/for-companies"),
    keywords: [
        "licensed firms",
        "advisory practices",
        "professional immigration enquiries",
    ],
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    locale,
  })
}

const trustItems = [
  {
    title: "Structured for specialist firms",
    description: "Designed for licensed practices and specialist teams that value clarity, order, and a more considered professional tone.",
  },
  {
    title: "Private professional discussions",
    description: "The page is designed for serious conversations around working methods, institutional fit, and longer-term relationships.",
  },
  {
    title: "Credible and well positioned",
    description: "The presentation remains premium, specific, and credible for firms making careful decisions.",
  },
  {
    title: "Privacy-aware by design",
    description: "The structure explicitly reassures firms about confidentiality, internal access, and responsible data handling.",
  },
]

const features = [
  {
    icon: Building2,
    title: "Structured enquiry oversight",
    description: "Maintain a clearer view of incoming enquiries, ownership, and internal continuity across the team.",
  },
  {
    icon: FileCheck2,
    title: "Client records and case continuity",
    description: "Keep client notes, jurisdictional context, and case status visible in a way that supports calmer internal coordination.",
  },
  {
    icon: MessagesSquare,
    title: "Internal coordination",
    description: "Keep responsibilities, reminders, and next actions organised across a process that often develops over time.",
  },
  {
    icon: BarChart3,
    title: "Management visibility",
    description: "Give leadership a simple view of volume, ownership, and progress without making reporting the centre of the experience.",
  },
]

const proofBlocks = [
  "Built around the working rhythm of specialist immigration teams, not generic off-the-shelf structures.",
  "Designed for continuity, discretion, and a more orderly internal process.",
  "Suitable for firms seeking a calmer and more structured way to organise professional discussions.",
]

export default async function ForCompaniesPage() {
  const locale = getRequestLocale()
  const ctaLinks = getLocalizedCtaLinks(locale)
  const routeLinks = getLocalizedRouteLinks(locale)
  const cmsPage = await getLandingPageBySlug("for-companies")
  const copy = {
    heroEyebrow: locale === "ar" ? "للشركات والمكاتب المتخصصة" : locale === "ru" ? "Для фирм и профессиональных практик" : "For licensed firms and advisory practices",
    heroTitle:
      locale === "ar"
        ? "مدخل مهني أكثر هدوءاً للمكاتب المرخصة والممارسات الاستشارية."
        : locale === "ru"
          ? "Более спокойная профессиональная точка входа для лицензированных фирм и консультативных практик."
          : "A more considered entry point for licensed firms and advisory practices.",
    heroDescription:
      locale === "ar"
        ? "استخدم هذه الصفحة إذا كنت تمثل جهة مهنية وتبحث عن نقاش خاص وأكثر تنظيماً حول الملاءمة وطبيعة العلاقة المهنية المحتملة."
        : locale === "ru"
          ? "Используйте эту страницу, если вы представляете фирму и хотите начать более частный и структурированный разговор о профессиональной пригодности и формате возможного взаимодействия."
          : "Use this section if you represent a firm and would like a more private discussion around structure, professional fit, and how a relationship might be approached.",
    bookMeeting: locale === "ar" ? "رتّب محادثة خاصة" : locale === "ru" ? "Договориться о частном обсуждении" : "Arrange a private discussion",
    requestDemo: locale === "ar" ? "اطلب عرضًا خاصًا" : locale === "ru" ? "Запросить частный обзор" : "Request a private overview",
    whatFirms: locale === "ar" ? "كيف يُستخدم هذا القسم" : locale === "ru" ? "Как используется эта страница" : "How firms use this section",
    crmSaas: locale === "ar" ? "نظرة مهنية منظمة" : locale === "ru" ? "Профессиональный обзор" : "Working overview",
    crmSaasDesc:
      locale === "ar"
        ? "هذه الصفحة تمنحك قراءة أوضح لطبيعة المنصة، والنبرة المهنية، وكيف يمكن أن يبدأ النقاش بشكل أكثر هدوءاً."
        : locale === "ru"
          ? "Эта страница помогает спокойно понять характер платформы, профессиональный тон и то, как может начаться дальнейший разговор."
          : "Review how enquiries, client context, internal notes, and continuity can sit within a more orderly working environment.",
    qualifiedLeads: locale === "ar" ? "محادثة مهنية أوسع" : locale === "ru" ? "Более широкое профессиональное обсуждение" : "Professional relationship",
    qualifiedLeadsDesc:
      locale === "ar"
        ? "قد تستخدم بعض الجهات هذا القسم لفهم ما إذا كانت هناك أرضية مناسبة لنقاش مهني أوسع ضمن إطار أكثر تحفظاً."
        : locale === "ru"
          ? "Некоторые фирмы используют эту страницу, чтобы понять, есть ли спокойная и уместная основа для более широкого профессионального разговора."
          : "Use the page to begin a more thoughtful discussion around structure, presentation, and the kind of relationship that may be worth exploring.",
    productEyebrow: locale === "ar" ? "نظرة عامة" : locale === "ru" ? "Обзор" : "Overview",
    productTitle:
      locale === "ar"
        ? "عرض أقرب إلى واقع الفرق المتخصصة."
        : locale === "ru"
          ? "Более сфокусированный обзор для специализированных команд."
          : "A clearer professional view for specialist firms.",
    productDescription:
      locale === "ar"
        ? "يركز العرض على ما يهم الفرق المهنية فعلاً: وضوح الحالة، وسياق العميل، وتماسك العمل داخل الفريق."
        : locale === "ru"
          ? "Обзор остаётся близким к тому, что действительно важно профессиональным командам: ясность по статусу, контекст клиента и согласованность внутренней работы."
          : "The overview remains close to day-to-day realities: incoming enquiries, adviser responsibility, client context, and continuity of follow-up.",
    partnershipEyebrow: locale === "ar" ? "علاقات مهنية" : locale === "ru" ? "Профессиональные отношения" : "Professional relationships",
    partnershipTitle:
      locale === "ar"
        ? "تبدأ بعض الجهات من هنا لفهم ما إذا كان هناك أساس مناسب لعلاقة مهنية أوسع."
        : locale === "ru"
          ? "Некоторые фирмы начинают здесь, чтобы понять, уместен ли более широкий профессиональный формат."
          : "Some firms begin here when exploring a wider professional relationship.",
    partnershipDescription:
      locale === "ar"
        ? "المقصود ليس فتح مسار تجاري صريح، بل معرفة ما إذا كانت هناك مناسبة مهنية حقيقية لنقاش أكثر تحديداً."
        : locale === "ru"
          ? "Речь не о прямой коммерческой подаче, а о понимании того, есть ли реальная профессиональная уместность для более предметного разговора."
          : "The wider platform can support a more structured conversation around presentation, working methods, and how introductions may be handled where appropriate.",
    companyFormEyebrow: locale === "ar" ? "نموذج استفسار الشركات" : locale === "ru" ? "Форма запроса компании" : "Professional enquiry form",
    companyFormTitle:
      locale === "ar" ? "أخبرنا بما تحتاجه شركتك الآن." : locale === "ru" ? "Расскажите, что нужно вашей фирме." : "Tell us what your firm needs.",
    companyFormDescription:
      locale === "ar"
        ? "استخدم النموذج إذا كنت ترغب في مشاركة السياق الحالي لفريقك وبدء نقاش مهني أكثر هدوءاً."
        : locale === "ru"
          ? "Используйте форму, если хотите описать текущий контекст своей команды и начать более спокойный профессиональный разговор."
          : "Use the form for a professional enquiry about structure, fit, or the most suitable next discussion.",
    formTitle: locale === "ar" ? "اطلب محادثة مهنية" : locale === "ru" ? "Запросить профессиональное обсуждение" : "Request a professional discussion",
    formDescription:
      locale === "ar"
        ? "شارك وضع فريقك الحالي وسنعود إليك بالصورة أو الإعداد الأقرب لاحتياجك."
        : locale === "ru"
          ? "Поделитесь профилем своей команды, и мы вернемся с наиболее релевантной конфигурацией."
          : "Share a little context and we will return in the most suitable format.",
    submit: locale === "ar" ? "اطلب محادثة" : locale === "ru" ? "Запросить обсуждение" : "Request discussion",
  }
  const localizedTrustItems =
    locale === "ar"
      ? [
          { title: "مصمم للمكاتب المتخصصة", description: "مهيأ للجهات المرخصة والفرق المتخصصة التي تفضل الوضوح والنظام ونبرة مهنية أكثر هدوءاً." },
          { title: "نقاشات مهنية خاصة", description: "تمنح الصفحة مساحة مناسبة لمحادثات جادة حول الملاءمة المؤسسية وطبيعة العلاقة المهنية." },
          { title: "عرض موثوق ومتماسك", description: "يبقى التقديم محدداً وهادئاً وملائماً للجهات التي تتخذ قراراتها بعناية." },
          { title: "يراعي الخصوصية من البداية", description: "تم تصميم البنية بما يطمئن الفرق المهنية بشأن السرية والوصول المنظم والتعامل المسؤول مع البيانات." },
        ]
      : locale === "ru"
        ? [
            { title: "Для специализированных практик", description: "Подходит лицензированным фирмам и профессиональным командам, которым важны ясность, порядок и более сдержанный тон." },
            { title: "Частные профессиональные разговоры", description: "Страница создаёт пространство для серьёзных разговоров об институциональной пригодности и формате взаимодействия." },
            { title: "Убедительно и сдержанно", description: "Подача остаётся премиальной, конкретной и уместной для фирм, принимающих взвешенные решения." },
            { title: "Приватность с самого начала", description: "Структура изначально подчёркивает конфиденциальность, организованный доступ и ответственное обращение с данными." },
          ]
        : trustItems
  const localizedProofBlocks =
    locale === "ar"
      ? [
          "يعرض المنصة بصيغة أقرب إلى واقع الجهات المتخصصة، لا إلى قوالب عامة أو مبالغ فيها.",
          "يعطي انطباعاً أكثر هدوءاً وتنظيماً حول الطريقة التي يمكن أن تبدأ بها العلاقة المهنية.",
          "يفيد الجهات التي تفضل الوضوح والخصوصية قبل أي خطوة أكثر تحديداً.",
        ]
      : locale === "ru"
        ? [
            "Показывает платформу ближе к реальности специализированных практик, а не к шаблонным продуктовым обещаниям.",
            "Создаёт более спокойное и структурированное впечатление о том, как может начаться профессиональный диалог.",
            "Полезно для фирм, которым важны ясность и приватность до более предметного следующего шага.",
          ]
        : proofBlocks

  if (cmsPage) {
    return (
      <SiteShell>
        <LandingPageRenderer page={cmsPage} />
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow={copy.heroEyebrow}
        title={copy.heroTitle}
        description={copy.heroDescription}
        primaryAction={{ href: "#meeting", label: copy.bookMeeting }}
        secondaryAction={{ href: ctaLinks.requestDemo, label: copy.requestDemo }}
        stats={[
          { value: "Structure", label: locale === "ar" ? "لعرض تشغيلي أكثر وضوحًا" : "for a clearer operating view" },
          { value: "Discretion", label: locale === "ar" ? "للنقاشات المهنية المدروسة" : "for measured professional discussions" },
          { value: "Fit", label: locale === "ar" ? "لتقدير الملاءمة بشكل أهدأ" : "for calmer fit assessment" },
        ]}
      >
        <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.18em] text-primary-foreground/70">{copy.whatFirms}</p>
          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-sm text-primary-foreground/70">{copy.crmSaas}</p>
              <p className="mt-2 text-sm leading-7 text-primary-foreground/80">
                {copy.crmSaasDesc}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-sm text-primary-foreground/70">{copy.qualifiedLeads}</p>
              <p className="mt-2 text-sm leading-7 text-primary-foreground/80">
                {copy.qualifiedLeadsDesc}
              </p>
            </div>
          </div>
        </div>
      </PageHero>

      <section className="section-padding">
        <div className="container-shell">
          <TrustGrid items={localizedTrustItems} />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.productEyebrow}
            title={copy.productTitle}
            description={copy.productDescription}
          />
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title} className="section-card">
                  <CardContent className="space-y-4 p-8">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <feature.icon className="size-6" />
                    </div>
                    <h3 className="card-title text-foreground">{feature.title}</h3>
                    <p className="fine-print">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="section-card overflow-hidden">
              <CardContent className="space-y-6 p-8">
                <span className="eyebrow">{locale === "ar" ? "نظرة عامة" : "Overview"}</span>
                <h3 className="card-title text-foreground">{locale === "ar" ? "رؤية أوضح لبيئة العمل التي يعتمد عليها فريقك يوميًا." : "A clearer view of the environment your team would work within day to day."}</h3>
                <p className="fine-print">
                  {locale === "ar"
                    ? "يركز هذا العرض على ما يهم المشتري أولًا: ملكية الطلب، وحالة الملف، وانضباط المتابعة، ووضوح العمل داخل الفريق."
                    : "The overview focuses on the areas teams usually care about first: ownership, status clarity, internal continuity, and visibility."}
                </p>
                <div className="rounded-[28px] border border-border/70 bg-primary p-6 text-primary-foreground shadow-[0_24px_60px_rgba(20,26,42,0.22)]">
                  <div className="grid gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <div className="mb-2 flex items-center justify-between text-sm text-primary-foreground/70">
                        <span>{locale === "ar" ? "المشهد العام" : "General overview"}</span>
                        <span>{locale === "ar" ? "12 ملفاً نشطاً" : "12 active matters"}</span>
                      </div>
                      <div className="space-y-3">
                        {locale === "ar"
                          ? ["مراجعة حالة جديدة", "مراجعة مالطا", "ملف عائلي للبرتغال"].map((row) => (
                              <div key={row} className="rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm">
                                {row}
                              </div>
                            ))
                          : ["New enquiry note", "Malta review", "Portugal family case"].map((row) => (
                          <div key={row} className="rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm">
                            {row}
                          </div>
                            ))}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">{locale === "ar" ? "ملاحظات العميل، والحالة الحالية، وملكية المستشار" : "Client notes, status, and adviser ownership"}</div>
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">{locale === "ar" ? "رؤية أوضح للفريق وتذكيرات بالخطوات التالية" : "Team visibility and next-step reminders"}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30" id="lead-partnership">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <span className="eyebrow">{copy.partnershipEyebrow}</span>
            <h2 className="section-title max-w-xl text-foreground">{copy.partnershipTitle}</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              {copy.partnershipDescription}
            </p>
            <div className="space-y-4">
              {[ 
                locale === "ar"
                  ? "تبدأ هذه الصفحة من نقاش مهني منظم بدلاً من انتقال سريع إلى خطوات غير مناسبة."
                  : "We begin with a structured professional discussion rather than a rushed introduction.",
                locale === "ar"
                  ? "ننظر أولاً إلى السياق العام والتوقيت والأهداف قبل اقتراح أي خطوة لاحقة."
                  : "We consider context, timing, and objectives before suggesting any next step.",
                locale === "ar"
                  ? "إذا بدت الملاءمة حقيقية، يمكن عندها الانتقال إلى نقاش أكثر تحديداً."
                  : "If the fit appears genuine, the discussion can then move into a more defined format.",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 size-5 text-primary" />
                  <p className="fine-print">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="section-card">
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow">{locale === "ar" ? "لماذا تدخل الشركات هذا المسار" : "Why firms begin here"}</span>
              <h3 className="card-title text-foreground">{locale === "ar" ? "التجربة مبنية حول الجدية والتنظيم." : "The experience is built around seriousness, structure, and fit."}</h3>
              <div className="space-y-3">
                {localizedProofBlocks.map((block) => (
                  <div key={block} className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-4 text-sm leading-7 text-muted-foreground">
                    {block}
                  </div>
                ))}
              </div>
              <Button variant="outline" asChild>
                  <Link href={routeLinks.partners}>{locale === "ar" ? "استكشف العلاقات المهنية" : "Explore professional relationships"}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="meeting" className="section-padding">
        <div className="container-shell">
          <MeetingSchedulerCard
            title="Arrange a private discussion"
            description="Use this section if you would like to arrange an introductory private discussion."
          />
        </div>
      </section>

      <section id="company-form" className="section-padding pt-0">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <span className="eyebrow">{copy.companyFormEyebrow}</span>
            <h2 className="section-title max-w-xl text-foreground">{copy.companyFormTitle}</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              {copy.companyFormDescription}
            </p>
          </div>
          <LeadQualificationForm
            locale={locale}
            formType="company"
            title={copy.formTitle}
            description={copy.formDescription}
            submitLabel={copy.submit}
            source="for-companies"
          />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Engagement options"
            title={locale === "ar" ? "تسعير واضح وموثوق لهيكل التعامل." : "Clear, credible options for a structured engagement."}
            description={locale === "ar" ? "الأسعار مصاغة بشكل واضح، مع مرونة للنطاق الأوسع عندما يكون ذلك منطقيًا." : "The options are presented clearly, with room for broader arrangements where that proves sensible."}
          />
          <PricingSection locale={locale} preview />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <Card className="section-card">
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow">{locale === "ar" ? "حماية البيانات" : "Data protection"}</span>
              <h3 className="card-title text-foreground">{locale === "ar" ? "مصمم لدعم التعامل السري مع بيانات العملاء." : "Designed to support confidential client handling."}</h3>
              <p className="fine-print">
                {locale === "ar"
                  ? "تم تأطير التجربة بما يحترم خصوصية بيانات المستثمرين والشركات، ويعتمد على وصول منظم وتعامل داخلي مسؤول."
                  : "The wider structure is framed around responsible handling of investor and company information, restricted access, and a privacy-aware way of working."}
              </p>
              <Button variant="outline" asChild>
                <Link href={routeLinks.dataProtection}>{locale === "ar" ? "اقرأ سياسة حماية البيانات" : "Read data protection"}</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="section-card overflow-hidden p-0">
            <div className="relative h-52">
              <Image
                src={siteImages.businessStreet.src}
                alt={siteImages.businessStreet.alt}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
            </div>
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow">{locale === "ar" ? "عرض خاص" : "Private overview"}</span>
              <h3 className="card-title text-foreground">{locale === "ar" ? "إذا لم تكن تريد التواصل مباشرة بعد، ابدأ بعرض خاص." : "If you would prefer a calmer first step, begin with a private overview."}</h3>
              <p className="fine-print">
                {locale === "ar"
                  ? "العرض الإرشادي يمنح الفريق تجربة شراء أوضح عندما لا تكون التجربة الذاتية هي الخطوة الأولى المناسبة."
                  : "A private overview often gives firms a clearer first impression when a direct introduction would feel too abrupt."}
              </p>
              <Button asChild>
                <Link href={ctaLinks.requestDemo}>
                  {locale === "ar" ? "اطلب عرضًا خاصًا" : "Request a private overview"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow={locale === "ar" ? "الخطوة التالية" : "Next step"}
            title={locale === "ar" ? "هل تريد الاطلاع على الأسعار أو طلب عرض خاص أو قراءة حماية البيانات؟" : "Would you prefer to review the engagement options, request a private overview, or read about data protection?"}
            description={locale === "ar" ? "يمكنك الانتقال إلى الأسعار أو العرض الخاص أو تفاصيل حماية البيانات من دون مغادرة نفس التجربة المتماسكة." : "You can move into the engagement options, a private overview, or data protection detail without leaving the same coherent experience."}
            primaryAction={{ href: ctaLinks.viewPricing, label: locale === "ar" ? "اطلع على الأسعار" : "View pricing" }}
            secondaryAction={{ href: ctaLinks.requestDemo, label: locale === "ar" ? "اطلب عرضًا خاصًا" : "Request a private overview" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
