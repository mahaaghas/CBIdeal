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
        "immigration CRM",
        "passport company CRM",
        "citizenship by investment software",
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
        ? "CRM لشركات الجوازات ومكاتب الهجرة"
        : locale === "ru"
          ? "CRM для паспортных компаний и иммиграционных фирм"
          : "CRM for Passport Companies and Immigration Firms",
    description:
      locale === "ar"
        ? "استكشف نظام CRM مصمم لشركات الجوازات والهجرة مع العروض التوضيحية والأسعار وحماية البيانات وشراكات العملاء المحتملين."
        : locale === "ru"
          ? "Изучите CRM для паспортных и иммиграционных фирм с демо, тарифами, позицией по защите данных и партнёрствами по лидам."
          : "Explore a CRM built for passport companies and immigration firms, with guided demos, pricing, data protection positioning, and qualified lead partnerships.",
    path: localizeHref(locale, "/for-companies"),
    keywords: [
      "immigration CRM",
      "passport company CRM",
      "citizenship by investment software",
    ],
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
    locale,
  })
}

const trustItems = [
  {
    title: "Built for immigration workflows",
    description: "Built for passport companies, CBI agencies, and immigration firms that need a CRM aligned with their actual sales and case process.",
  },
  {
    title: "CRM and lead partnerships",
    description: "Companies can adopt the CRM, receive qualified investor leads, or structure a combined commercial setup.",
  },
  {
    title: "Sales-ready and credible",
    description: "The product story stays premium, specific, and credible for firms making a serious buying decision.",
  },
  {
    title: "Privacy-aware by design",
    description: "The structure explicitly reassures firms about confidentiality, internal access, and responsible data handling.",
  },
]

const features = [
  {
    icon: Building2,
    title: "Lead pipeline management",
    description: "Track every enquiry from first contact to consultation, proposal, and retained case without losing ownership across the team.",
  },
  {
    icon: FileCheck2,
    title: "Client profiles and case tracking",
    description: "Store client notes, categorize programs, and keep onboarding or case status visible across advisers and operations.",
  },
  {
    icon: MessagesSquare,
    title: "Follow-ups and team coordination",
    description: "Keep reminders, follow-up responsibility, and next actions organized for a sales cycle that rarely closes in one call.",
  },
  {
    icon: BarChart3,
    title: "Basic reporting visibility",
    description: "Give leadership a simple view of volume, ownership, and progress without a heavy reporting implementation.",
  },
]

const proofBlocks = [
  "Built around the workflow of immigration teams, not generic SaaS templates.",
  "Designed for lead handling, handoff clarity, and follow-up discipline.",
  "Positioned to support CRM rollout, qualified leads, or both together.",
]

export default async function ForCompaniesPage() {
  const locale = getRequestLocale()
  const ctaLinks = getLocalizedCtaLinks(locale)
  const routeLinks = getLocalizedRouteLinks(locale)
  const cmsPage = await getLandingPageBySlug("for-companies")
  const copy = {
    heroEyebrow: locale === "ar" ? "CRM وشراكات العملاء المحتملين" : locale === "ru" ? "CRM и лид-партнерства" : "CRM and lead partnerships",
    heroTitle:
      locale === "ar"
        ? "CRM مبني لشركات الجوازات ومكاتب الهجرة."
        : locale === "ru"
          ? "CRM для паспортных компаний и иммиграционных фирм."
          : "CRM built for passport companies and immigration firms.",
    heroDescription:
      locale === "ar"
        ? "أدر العملاء المحتملين وسجلات العملاء والمتابعات في مكان واحد مع منح شركتك أيضًا طريقًا واضحًا للحصول على طلب مستثمرين مؤهلين من صفحاتنا."
        : locale === "ru"
          ? "Управляйте лидами, карточками клиентов и follow-up в одном месте, а также получайте понятный путь к квалифицированному инвесторскому спросу с наших лендингов."
          : "Manage leads, client records, and follow-ups in one place while also giving your firm a clear path to receive qualified investor demand from our landing pages.",
    bookMeeting: locale === "ar" ? "احجز اجتماعًا" : locale === "ru" ? "Забронировать встречу" : "Book a meeting",
    requestDemo: locale === "ar" ? "اطلب عرضًا إرشاديًا" : locale === "ru" ? "Запросить guided demo" : "Request a guided demo",
    whatFirms: locale === "ar" ? "ما الذي يمكن للشركات فعله هنا" : locale === "ru" ? "Что компания может сделать здесь" : "What firms can do here",
    crmSaas: locale === "ar" ? "CRM للشركات" : locale === "ru" ? "CRM SaaS" : "CRM SaaS",
    crmSaasDesc:
      locale === "ar"
        ? "نظّم العملاء المحتملين وملفات العملاء والملاحظات ومراحل القضايا ومسارات المتابعة في أداة مبنية لفرق الهجرة."
        : locale === "ru"
          ? "Организуйте лиды, профили клиентов, заметки, этапы кейсов и follow-up-процессы в системе, созданной для иммиграционных команд."
          : "Organize leads, client profiles, notes, case stages, and follow-up workflows in a tool built for immigration teams.",
    qualifiedLeads: locale === "ar" ? "خيار العملاء المؤهلين" : locale === "ru" ? "Опция квалифицированных лидов" : "Qualified lead option",
    qualifiedLeadsDesc:
      locale === "ar"
        ? "اعمل معنا على طلب مستثمرين دافئ يتم جمعه عبر نماذج تأهيل ومطابقة مع المزود المناسب."
        : locale === "ru"
          ? "Работайте с нами по теплому инвесторскому спросу, собранному через квалификационные формы и логику подбора провайдера."
          : "Work with us on warm investor demand captured through profile-based intake forms and provider matching logic.",
    productEyebrow: locale === "ar" ? "عرض المنتج" : locale === "ru" ? "Продукт" : "Product showcase",
    productTitle:
      locale === "ar"
        ? "قصة CRM مركزة لفرق الجوازات والهجرة."
        : locale === "ru"
          ? "Сфокусированная CRM-история для паспортных и иммиграционных команд."
          : "A focused CRM story for passport and immigration teams.",
    productDescription:
      locale === "ar"
        ? "تبقى قصة المنتج قريبة من سلوك الفرق الحقيقي: الاستفسارات الواردة وملكية المستشار وملفات العملاء وتصنيف القضايا وانضباط المتابعة."
        : locale === "ru"
          ? "Продуктовая история привязана к реальному поведению команд: входящие запросы, ownership консультанта, профили клиентов, категоризация кейсов и follow-up discipline."
          : "The product story stays close to real team behavior: incoming enquiries, adviser ownership, client profiles, case categorization, and follow-up discipline.",
    partnershipEyebrow: locale === "ar" ? "شراكة العملاء المحتملين" : locale === "ru" ? "Лид-партнерство" : "Lead partnership",
    partnershipTitle:
      locale === "ar"
        ? "نساعد الشركات أيضًا على تلقي عملاء مستثمرين مؤهلين."
        : locale === "ru"
          ? "Мы также помогаем компаниям получать квалифицированных инвесторских лидов."
          : "We also help firms receive qualified investor leads.",
    partnershipDescription:
      locale === "ar"
        ? "تجمع صفحاتنا الموجهة للمستثمرين طلبًا مؤهلًا عبر أسئلة إدخال منظمة. نقوم بالتصفية بحسب الملف والميزانية والأهداف، ثم نربط الطلب بالمزود المناسب."
        : locale === "ru"
          ? "Наши investor-facing страницы собирают квалифицированный спрос через структурированные intake-вопросы. Мы фильтруем по профилю, бюджету и целям, а затем соединяем запрос с релевантным провайдером."
          : "Our investor-facing pages collect qualified demand through structured intake questions. We filter for profile, budget, and goals, then connect matching leads to relevant providers.",
    companyFormEyebrow: locale === "ar" ? "نموذج استفسار الشركات" : locale === "ru" ? "Форма запроса компании" : "Company enquiry form",
    companyFormTitle:
      locale === "ar" ? "أخبرنا بما تحتاجه شركتك." : locale === "ru" ? "Расскажите, что нужно вашей фирме." : "Tell us what your firm needs.",
    companyFormDescription:
      locale === "ar"
        ? "استخدم النموذج لأسئلة CRM أو مناقشات العملاء المؤهلين أو محادثة مشتركة حول المنتج وتوليد الطلب."
        : locale === "ru"
          ? "Используйте форму для вопросов по CRM, обсуждения квалифицированных лидов или комбинированного разговора о продукте и генерации спроса."
          : "Use the form for CRM questions, qualified lead discussions, or a combined conversation about product and demand generation.",
    formTitle: locale === "ar" ? "اطلب محادثة للشركة" : locale === "ru" ? "Запросить разговор для компании" : "Request a company conversation",
    formDescription:
      locale === "ar"
        ? "شارك ملف فريقك وسنعود إليك بالإعداد الأكثر ملاءمة."
        : locale === "ru"
          ? "Поделитесь профилем своей команды, и мы вернемся с наиболее релевантной конфигурацией."
          : "Share your team profile and we will come back with the most relevant setup.",
    submit: locale === "ar" ? "تواصل مع فريقنا" : locale === "ru" ? "Связаться с нашей командой" : "Contact our team",
  }
  const localizedTrustItems =
    locale === "ar"
      ? [
          { title: "مبني لسير عمل الهجرة", description: "مصمم لشركات الجوازات ووكالات CBI ومكاتب الهجرة التي تحتاج إلى CRM منسجم مع عملية البيع والقضية الفعلية." },
          { title: "CRM وشراكات العملاء المحتملين", description: "يمكن للشركات اعتماد الـ CRM أو استلام عملاء مؤهلين أو هيكلة نموذج تجاري يجمع بين الاثنين." },
          { title: "جاهز للبيع وموثوق", description: "تبقى قصة المنتج فاخرة ومحددة وموثوقة للشركات التي تتخذ قرار شراء جاد." },
          { title: "يراعي الخصوصية من الأساس", description: "يطمئن الهيكل الشركات بشأن السرية والوصول الداخلي والتعامل المسؤول مع البيانات." },
        ]
      : locale === "ru"
        ? [
            { title: "Создан для иммиграционных процессов", description: "Подходит паспортным компаниям, CBI-агентствам и иммиграционным фирмам, которым нужен CRM под реальный процесс продаж и кейсов." },
            { title: "CRM и лид-партнерства", description: "Фирмы могут внедрить CRM, получать квалифицированные лиды или обсуждать комбинированную коммерческую модель." },
            { title: "Готово к продажам и выглядит убедительно", description: "История продукта остается премиальной, конкретной и убедительной для серьезного B2B-решения." },
            { title: "Privacy-aware по дизайну", description: "Структура с самого начала успокаивает компании насчет конфиденциальности, внутреннего доступа и ответственной работы с данными." },
          ]
        : trustItems
  const localizedProofBlocks =
    locale === "ar"
      ? [
          "مبني حول سير عمل فرق الهجرة لا قوالب SaaS العامة.",
          "مصمم لمعالجة العملاء المحتملين ووضوح الإحالة وانضباط المتابعة.",
          "مهيأ ليدعم إطلاق الـ CRM أو العملاء المؤهلين أو كليهما معًا.",
        ]
      : locale === "ru"
        ? [
            "Построено вокруг процессов иммиграционных команд, а не вокруг универсальных SaaS-шаблонов.",
            "Спроектировано для обработки лидов, ясной передачи и дисциплины follow-up.",
            "Позиционируется для rollout CRM, квалифицированных лидов или обеих моделей сразу.",
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
          { value: "CRM", label: "for specialized immigration workflows" },
          { value: "Leads", label: "for matched investor demand" },
          { value: "Pricing", label: "built for niche B2B rollout" },
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
                <span className="eyebrow">Product view</span>
                <h3 className="card-title text-foreground">A clearer view of the workflow your team would manage every day.</h3>
                <p className="fine-print">
                  The preview focuses on the parts buyers care about first: lead ownership, case status, follow-up control, and team visibility.
                </p>
                <div className="rounded-[28px] border border-border/70 bg-primary p-6 text-primary-foreground shadow-[0_24px_60px_rgba(20,26,42,0.22)]">
                  <div className="grid gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <div className="mb-2 flex items-center justify-between text-sm text-primary-foreground/70">
                        <span>Lead board</span>
                        <span>12 active enquiries</span>
                      </div>
                      <div className="space-y-3">
                        {["New investor call", "Malta follow-up", "Portugal family review"].map((row) => (
                          <div key={row} className="rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm">
                            {row}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">
                        Client notes, status, and adviser ownership
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">
                        Team visibility and next-step reminders
                      </div>
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
                "We collect demand from end clients looking for citizenship or residency options.",
                "We qualify against budget, timeframe, and destination interest before handoff.",
                "We can discuss CRM only, leads only, or a combined commercial model.",
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
              <span className="eyebrow">Why firms engage</span>
              <h3 className="card-title text-foreground">Built for the workflow of specialized immigration teams.</h3>
              <div className="space-y-3">
                {localizedProofBlocks.map((block) => (
                  <div key={block} className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-4 text-sm leading-7 text-muted-foreground">
                    {block}
                  </div>
                ))}
              </div>
              <Button variant="outline" asChild>
                <Link href={routeLinks.partners}>Explore partnerships</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="meeting" className="section-padding">
        <div className="container-shell">
          <MeetingSchedulerCard
            title="Book a CRM, lead, or rollout conversation"
            description="Schedule a first conversation to discuss CRM fit, qualified lead delivery, or the right rollout approach for your team."
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
            eyebrow="Pricing preview"
            title="Simple, credible pricing for a specialized B2B SaaS."
            description="Pricing is structured per user and leaves room for enterprise rollout and lead partnership pricing where required."
          />
          <PricingSection locale={locale} preview />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell grid gap-6 lg:grid-cols-2">
          <Card className="section-card">
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow">Data protection</span>
              <h3 className="card-title text-foreground">Built to support confidential client handling.</h3>
              <p className="fine-print">
                We position the CRM and lead process around responsible handling of investor and company data, structured access, and privacy-aware internal workflows.
              </p>
              <Button variant="outline" asChild>
                <Link href={routeLinks.dataProtection}>Read data protection</Link>
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
              <span className="eyebrow">Guided demo</span>
              <h3 className="card-title text-foreground">Not ready for a product login? Start with a guided walkthrough.</h3>
              <p className="fine-print">
                The guided demo gives teams a clearer buying experience when a self-serve trial is not the right first step.
              </p>
              <Button asChild>
                <Link href={ctaLinks.requestDemo}>
                  Request guided demo
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
            eyebrow="Next step"
            title="Want to see pricing, book a demo, or ask about lead partnerships?"
            description="Move deeper into pricing, guided demo, or data protection details without leaving the same premium brand environment."
            primaryAction={{ href: ctaLinks.viewPricing, label: "View pricing" }}
            secondaryAction={{ href: ctaLinks.requestDemo, label: "Request demo" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
