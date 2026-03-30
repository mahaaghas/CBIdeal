import type { Metadata } from "next"
import Image from "next/image"
import { MessageSquareText, PhoneCall, ShieldCheck } from "lucide-react"
import { ContactInquiryTabs } from "@/components/contact-inquiry-tabs"
import { CtaPanel } from "@/components/cta-panel"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { Card, CardContent } from "@/components/ui/card"
import { buildPageMetadata } from "@/lib/metadata"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { siteImages } from "@/lib/site-images"
import { getLocalizedCtaLinks } from "@/lib/site"
import { getResolvedSiteSettings } from "@/lib/sanity/content"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()

  const localized = {
    en: {
      title: "Contact CBI Deal",
      description:
        "Contact CBI Deal for private consultations, professional enquiries, and discreet conversations around citizenship and residency planning.",
      keywords: [
        "citizenship by investment contact",
        "private citizenship consultation",
        "international mobility contact",
      ],
    },
    ar: {
      title: "تواصل مع CBI Deal",
      description:
        "تواصل مع CBI Deal بخصوص الاستشارات الخاصة أو الاستفسارات المهنية أو المحادثات الهادئة حول خيارات الجنسية والإقامة.",
      keywords: ["التواصل الجنسية عن طريق الاستثمار", "الاستشارة الخاصة", "التواصل التنقل الدولي"],
    },
    ru: {
      title: "Связаться с CBI Deal",
      description:
        "Свяжитесь с CBI Deal по вопросам частной консультации, профессиональных запросов и более сдержанного разговора о гражданстве и резидентстве.",
      keywords: ["контакты гражданство за инвестиции", "частная консультация", "международная мобильность контакты"],
    },
  }[locale]

  return buildPageMetadata({
    title: localized.title,
    description: localized.description,
    path: localizeHref(locale, "/contact"),
    keywords: localized.keywords,
    locale,
  })
}

interface ContactPageProps {
  searchParams?: Promise<{ intent?: string }>
}

const faqs = [
  {
    title: "Private consultations",
    body: "If you are considering citizenship or residency by investment, use the investor form so the first exchange begins with the right context.",
  },
  {
    title: "Professional enquiries",
    body: "If you represent a licensed firm or advisory practice, use the professional form so the conversation can be directed appropriately from the outset.",
  },
  {
    title: "Privacy and discretion",
    body: "If the matter is sensitive, mention that in the notes and we will keep the exchange more measured and direct.",
  },
]

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const locale = getRequestLocale()
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const defaultValue = resolvedSearchParams?.intent === "demo" ? "company" : "investor"
  const settings = await getResolvedSiteSettings()
  const ctaLinks = getLocalizedCtaLinks(locale)
  const copy = {
    en: {
      eyebrow: "Contact",
      title: "A discreet contact point for private consultations and professional enquiries.",
      description:
        "Whether you are exploring your options personally or writing on behalf of a firm, this page is intended to show the most appropriate way to get in touch and what kind of first exchange each route is designed for.",
      openForm: "Write to us",
      viewPrivacy: "View data protection",
    },
    ar: {
      eyebrow: "تواصل معنا",
      title: "ابدأ محادثة واضحة سواء كنت مستثمرًا أو تمثل شركة.",
      description:
        "هذه الصفحة تقودك إلى المسار الصحيح من البداية: مراجعة للمستثمرين، أو محادثة للشركات، أو تواصل مباشر إذا كانت الحالة أكثر حساسية.",
      openForm: "افتح نموذج التواصل",
      viewPrivacy: "عرض حماية البيانات",
    },
    ru: {
      eyebrow: "Контакты",
      title: "Дискретный контакт для частных консультаций и профессиональных запросов.",
      description:
        "Независимо от того, рассматриваете ли вы варианты лично или пишете от имени фирмы, разговор остаётся сдержанным, ясным и конфиденциальным.",
      openForm: "Открыть форму контакта",
      viewPrivacy: "Смотреть защиту данных",
    },
  }[locale]
  const localizedFaqs =
    locale === "ar"
      ? [
          {
            title: "استفسارات المستثمرين",
            body: "إذا كنت تقارن بين الجنسية أو الإقامة الثانية، فاستخدم نموذج المستثمر حتى نراجع الهدف والميزانية ووضع العائلة قبل أي إحالة.",
          },
          {
            title: "استفسارات الشركات",
            body: "إذا كنت تدير شركة جوازات أو مكتب هجرة أو مكتباً استشارياً، فاستخدم نموذج الشركات لبدء نقاش مهني أوضح وأكثر ملاءمة.",
          },
          {
            title: "الخصوصية والسرية",
            body: "إذا كانت الحالة حساسة أو تحتاج إلى تعامل أكثر تحفظًا، اذكر ذلك في الملاحظات وسنحافظ على مسار متابعة أكثر مباشرة وهدوءًا.",
          },
        ]
      : locale === "ru"
        ? [
            {
              title: "Запросы инвесторов",
              body: "Если вас интересует гражданство или резидентство за инвестиции, используйте форму инвестора, чтобы первый разговор начался с правильного контекста.",
            },
            {
              title: "Запросы компаний",
              body: "Если вы представляете фирму или консультативную практику, используйте профессиональную форму, чтобы разговор сразу пошёл в более подходящем формате.",
            },
            {
              title: "Приватность и конфиденциальность",
              body: "Если ваш запрос чувствителен, укажите это в комментарии, и мы сохраним обмен более сдержанным и прямым.",
            },
          ]
        : faqs
  const detailCopy = {
    reachEyebrow: locale === "ar" ? "الوصول إلى الفريق المناسب" : locale === "ru" ? "Выход на нужную команду" : "Reach the right team",
    reachTitle:
      locale === "ar"
        ? "استخدم مسار تواصل واحدًا للطرفين من النشاط."
        : locale === "ru"
          ? "Один контактный поток для обеих сторон бизнеса."
          : "One contact point, handled with discretion.",
    reachDescription:
      locale === "ar"
        ? "يحتاج المستثمر إلى نوع مختلف من الأسئلة عن ذلك الذي تحتاجه الشركة. لهذا نفصل المسارين من دون تشتيت التجربة أو دفع أي طرف إلى نموذج غير مناسب."
        : locale === "ru"
          ? "Инвесторам и фирмам часто нужны разные разговоры. Эта структура разделяет их, не дробя бренд и не отправляя людей в неподходящую форму."
          : "Investors and professional firms often need different conversations. This section explains how the contact routes are separated so the first exchange can remain calm, relevant, and easier to navigate.",
    bulletOne:
      locale === "ar" ? "مراجعة استفسارات المستثمرين بعناية وتوجيهها إلى المسار الأنسب." : locale === "ru" ? "Внимательный первый разбор запросов инвесторов и направление по наиболее уместному пути." : "Private investor enquiries are reviewed with care and directed to the most suitable path.",
    bulletTwo:
      locale === "ar" ? "الاستفسارات المهنية تُوجّه إلى الصيغة الأكثر ملاءمة للنقاش." : locale === "ru" ? "Профессиональные запросы направляются в наиболее уместный формат обсуждения." : "Professional enquiries are directed into the most appropriate format for discussion.",
    bulletThree:
      locale === "ar" ? "أسلوب واضح يحترم الخصوصية ويوضح ما يمكن توقعه بعد الرسالة." : locale === "ru" ? "Понятная и бережная к приватности коммуникация с ясными ожиданиями." : "Clear, privacy-aware communication with measured expectations from the start.",
    directEyebrow: locale === "ar" ? "تواصل مباشر" : locale === "ru" ? "Прямой контакт" : "Direct contact",
    directTitle:
      locale === "ar"
        ? "هل تفضّل تواصلًا مباشرًا بدل النموذج؟"
        : locale === "ru"
          ? "Нужен прямой разговор вместо формы?"
          : "Would you prefer to write to us directly?",
    directDescription:
      locale === "ar"
        ? "إذا كانت الحالة حساسة من ناحية الوقت أو الخصوصية، يمكنك التواصل مباشرة عبر القنوات التالية."
        : locale === "ru"
          ? "Если запрос срочный или конфиденциальный, вы можете связаться с командой напрямую по каналам ниже."
          : "If your enquiry is time-sensitive or confidential, you can contact the team directly using the channels below.",
    formsEyebrow: locale === "ar" ? "النماذج" : locale === "ru" ? "Формы" : "Forms",
    formsTitle:
      locale === "ar"
        ? "اختر المسار الذي يناسب وضعك الحالي."
        : locale === "ru"
          ? "Выберите сценарий запроса, который соответствует вашей ситуации."
          : "Choose the route that best fits your enquiry.",
    formsDescription:
      locale === "ar"
        ? "تمنحك النماذج المخصصة بداية أوضح: المستثمر يبدأ من المقارنة والملف، والشركة تبدأ من الاحتياج التشغيلي."
        : locale === "ru"
          ? "Специализированные формы дают более релевантный опыт для инвесторов и компаний, чем одна общая контактная форма."
          : "This section helps you choose the right contact route before you begin. Separate forms keep the first exchange more relevant and make it easier to see which information matters at the outset, depending on who is writing.",
    faqEyebrow: locale === "ar" ? "الأسئلة الشائعة" : locale === "ru" ? "FAQ" : "FAQ",
    faqTitle:
      locale === "ar"
        ? "ملاحظات سريعة قبل الإرسال"
        : locale === "ru"
          ? "Пара быстрых замечаний перед отправкой."
          : "A few notes before you get in touch.",
    faqDescription:
      locale === "ar"
        ? "إجابات قصيرة تساعد في ضبط التوقعات وتعزيز الثقة."
        : locale === "ru"
          ? "Короткие ответы, которые помогают настроить ожидания и усилить доверие."
          : "These short answers are intended to clarify how the page works, what each contact route is for, and what you should expect from the first exchange.",
    ctaEyebrow: locale === "ar" ? "ما زلت تقرر؟" : locale === "ru" ? "Еще решаете?" : "Still deciding?",
    ctaTitle:
      locale === "ar"
        ? "هل تريد الاطلاع على الأسعار أو العرض الإرشادي قبل التواصل؟"
        : locale === "ru"
          ? "Хотите сначала посмотреть направления и материалы?"
          : "Would you prefer to review the pathways and editorial material first?",
    ctaDescription:
      locale === "ar"
        ? "يمكنك الانتقال إلى العرض الإرشادي أو صفحة الأسعار أولًا، ثم العودة إلى التواصل عندما تصبح الصورة أوضح."
        : locale === "ru"
          ? "Вы можете перейти к демо или тарифам, а затем вернуться к контакту, когда будете готовы."
          : "You may prefer to review the main pathways or editorial insights first, then return when the picture is clearer. This is often the better route if your questions are still broad and you are not yet ready for a case-specific exchange.",
    ctaPrimary: locale === "ar" ? "استكشف المسارات" : locale === "ru" ? "Смотреть направления" : "View pathways",
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        primaryAction={{ href: "#contact-form", label: copy.openForm }}
        secondaryAction={{ href: ctaLinks.viewDataProtection, label: copy.viewPrivacy }}
        stats={[
          { value: settings.salesEmail, label: "private correspondence" },
          { value: settings.phone, label: "telephone" },
          { value: settings.whatsapp, label: "WhatsApp" },
        ]}
      />

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="section-card overflow-hidden p-0">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative min-h-[300px]">
                <Image
                  src={siteImages.passportHandoff.src}
                  alt={siteImages.passportHandoff.alt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="object-cover"
                />
              </div>
              <CardContent className="space-y-5 p-8">
                <span className="eyebrow">{detailCopy.reachEyebrow}</span>
                <h3 className="text-3xl text-foreground">{detailCopy.reachTitle}</h3>
                <p className="text-base leading-8 text-muted-foreground">
                  {detailCopy.reachDescription}
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MessageSquareText className="mt-1 size-5 text-primary" />
                    <p className="fine-print">{detailCopy.bulletOne}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <PhoneCall className="mt-1 size-5 text-primary" />
                    <p className="fine-print">{detailCopy.bulletTwo}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 size-5 text-primary" />
                    <p className="fine-print">{detailCopy.bulletThree}</p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="section-card overflow-hidden p-0">
            <div className="relative min-h-[300px]">
              <Image
                src={siteImages.coastalCafe.src}
                alt={siteImages.coastalCafe.alt}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />
            </div>
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow">{detailCopy.directEyebrow}</span>
              <h3 className="text-3xl text-foreground">{detailCopy.directTitle}</h3>
              <p className="fine-print">
                {detailCopy.directDescription}
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="leading-7 [overflow-wrap:anywhere]">{settings.salesEmail}</p>
                <p className="leading-7">{settings.phone}</p>
                <p className="leading-7">{settings.whatsapp}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="contact-form" className="section-padding bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow={detailCopy.formsEyebrow}
            title={detailCopy.formsTitle}
            description={detailCopy.formsDescription}
          />
          <Card className="section-card mb-8">
            <CardContent className="space-y-3 p-6 md:p-8">
              <span className="eyebrow">{locale === "ar" ? "الامتثال" : "Compliance"}</span>
              <h3 className="card-title text-foreground">
                {locale === "ar" ? "إشعار الامتثال والتنظيم" : "Compliance & Regulatory Notice"}
              </h3>
              <p className="fine-print">
                {locale === "ar"
                  ? "نعمل كمنصة مستقلة للمراجعة والتأهيل الأولي، ونربط الحالات المناسبة بجهات مرخصة ومعتمدة في مجال الجنسية أو الإقامة عن طريق الاستثمار. نحن لا نمثل جهة حكومية ولا نصدر أي قرارات سيادية."
                  : "We operate as an independent advisory platform. We connect suitable cases with licensed citizenship and residency by investment providers and do not act as a governmental authority."}
              </p>
            </CardContent>
          </Card>
          <ContactInquiryTabs locale={locale} defaultValue={defaultValue} />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell">
          <SectionHeading
            eyebrow={detailCopy.faqEyebrow}
            title={detailCopy.faqTitle}
            description={detailCopy.faqDescription}
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {localizedFaqs.map((faq) => (
              <Card key={faq.title} className="section-card">
                <CardContent className="space-y-4 p-8">
                  <h3 className="text-2xl text-foreground">{faq.title}</h3>
                  <p className="fine-print">{faq.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow={detailCopy.ctaEyebrow}
            title={detailCopy.ctaTitle}
            description={detailCopy.ctaDescription}
            primaryAction={{ href: ctaLinks.explorePrograms, label: "Explore pathways" }}
            secondaryAction={{ href: ctaLinks.viewPricing, label: locale === "ar" ? "اطلع على الخيارات" : "View solutions" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
