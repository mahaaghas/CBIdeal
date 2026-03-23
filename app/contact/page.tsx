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
      title: "Contact Investors and Partner Firms",
      description:
        "Contact CBI Deal for investor enquiries, CRM questions, guided demos, pricing discussions, or qualified lead partnerships in one premium contact experience.",
      keywords: [
        "citizenship by investment contact",
        "immigration CRM contact",
        "passport company demo request",
      ],
    },
    ar: {
      title: "تواصل مع المستثمرين والشركات الشريكة",
      description:
        "تواصل مع CBI Deal بخصوص استفسارات المستثمرين أو أسئلة الـ CRM أو العروض التوضيحية أو التسعير أو شراكات العملاء المحتملين عبر تجربة تواصل مميزة.",
      keywords: ["التواصل الجنسية عن طريق الاستثمار", "التواصل CRM الهجرة", "طلب عرض توضيحي للشركات"],
    },
    ru: {
      title: "Контакты для инвесторов и партнёрских компаний",
      description:
        "Свяжитесь с CBI Deal по вопросам инвесторов, CRM, демо, тарифов или партнёрства по квалифицированным лидам в едином премиальном формате.",
      keywords: ["контакты гражданство за инвестиции", "контакты CRM для иммиграции", "запрос демо для компаний"],
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
    title: "Investor enquiries",
    body: "If you are looking for citizenship or residency by investment, use the investor form so we can qualify you by profile, family scope, budget, and timing.",
  },
  {
    title: "Company enquiries",
    body: "If you run a passport company, immigration firm, or advisory desk, use the company form for CRM, qualified leads, pricing, or demo questions.",
  },
  {
    title: "Privacy and confidentiality",
    body: "If your enquiry is sensitive, mention that in the notes and we will keep the follow-up route more controlled and direct.",
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
      title: "A direct contact point for investors and partner companies.",
      description:
        "Whether you are an investor looking for the right offer or a company exploring the CRM and qualified leads, the conversation stays clear, warm, and privacy-aware.",
      openForm: "Open contact form",
      viewPrivacy: "View data protection",
    },
    ar: {
      eyebrow: "تواصل معنا",
      title: "نقطة تواصل مباشرة للمستثمرين والشركات الشريكة.",
      description:
        "سواء كنت مستثمراً يبحث عن العرض المناسب أو شركة تستكشف الـ CRM والعملاء المؤهلين، تبقى المحادثة واضحة وودودة وواعية بالخصوصية.",
      openForm: "افتح نموذج التواصل",
      viewPrivacy: "عرض حماية البيانات",
    },
    ru: {
      eyebrow: "Контакты",
      title: "Прямой контакт для инвесторов и партнёрских компаний.",
      description:
        "Если вы инвестор в поиске подходящего предложения или компания, изучающая CRM и квалифицированные лиды, диалог остаётся ясным, тёплым и конфиденциальным.",
      openForm: "Открыть форму контакта",
      viewPrivacy: "Смотреть защиту данных",
    },
  }[locale]
  const localizedFaqs =
    locale === "ar"
      ? [
          {
            title: "استفسارات المستثمرين",
            body: "إذا كنت تبحث عن الجنسية أو الإقامة عن طريق الاستثمار، فاستخدم نموذج المستثمر حتى نتمكن من تأهيلك وفق الملف ونطاق العائلة والميزانية والتوقيت.",
          },
          {
            title: "استفسارات الشركات",
            body: "إذا كنت تدير شركة جوازات أو مكتب هجرة أو مكتبًا استشاريًا، فاستخدم نموذج الشركة لأسئلة CRM أو العملاء المحتملين المؤهلين أو الأسعار أو العرض التوضيحي.",
          },
          {
            title: "الخصوصية والسرية",
            body: "إذا كان استفسارك حساسًا، فاذكر ذلك في الملاحظات وسنجعل مسار المتابعة أكثر ضبطًا ومباشرة.",
          },
        ]
      : locale === "ru"
        ? [
            {
              title: "Запросы инвесторов",
              body: "Если вас интересует гражданство или резидентство за инвестиции, используйте форму инвестора, чтобы мы могли квалифицировать запрос по профилю, семье, бюджету и срокам.",
            },
            {
              title: "Запросы компаний",
              body: "Если вы управляете паспортной компанией, иммиграционной фирмой или advisory desk, используйте форму компании для вопросов по CRM, лидам, тарифам или демо.",
            },
            {
              title: "Приватность и конфиденциальность",
              body: "Если ваш запрос чувствителен, укажите это в комментарии, и мы построим более контролируемый и прямой маршрут follow-up.",
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
          : "Use one contact flow for both sides of the business.",
    reachDescription:
      locale === "ar"
        ? "غالبًا ما يحتاج المستثمرون والشركات إلى محادثات مختلفة. هذا التخطيط يبقيها منفصلة دون تجزئة العلامة أو دفع أي طرف إلى نموذج غير مناسب."
        : locale === "ru"
          ? "Инвесторам и фирмам часто нужны разные разговоры. Эта структура разделяет их, не дробя бренд и не отправляя людей в неподходящую форму."
          : "Investors and firms often need different conversations. This layout keeps them separate without fragmenting the brand or forcing anyone through the wrong form.",
    bulletOne:
      locale === "ar" ? "مطابقة المستثمرين الدافئين وإحالتهم إلى المزود المناسب." : locale === "ru" ? "Подбор теплых инвесторских запросов и направление к провайдеру." : "Warm investor matching and provider routing.",
    bulletTwo:
      locale === "ar" ? "محادثات الشركات حول CRM والأسعار والعروض والعملاء المحتملين المؤهلين." : locale === "ru" ? "Разговоры с компаниями о CRM, тарифах, демо и квалифицированных лидах." : "Company discussions about CRM, pricing, demos, and qualified leads.",
    bulletThree:
      locale === "ar" ? "رسائل واضحة تراعي الخصوصية وتوقعات المتابعة." : locale === "ru" ? "Понятная privacy-aware коммуникация и ожидания по follow-up." : "Clear privacy-aware messaging and follow-up expectations.",
    directEyebrow: locale === "ar" ? "تواصل مباشر" : locale === "ru" ? "Прямой контакт" : "Direct contact",
    directTitle:
      locale === "ar"
        ? "هل تحتاج إلى محادثة مباشرة بدلًا من ذلك؟"
        : locale === "ru"
          ? "Нужен прямой разговор вместо формы?"
          : "Need a direct conversation instead?",
    directDescription:
      locale === "ar"
        ? "إذا كان استفسارك حساسًا زمنيًا أو سريًا، يمكنك التواصل مباشرة عبر القنوات التالية."
        : locale === "ru"
          ? "Если запрос срочный или конфиденциальный, вы можете связаться с командой напрямую по каналам ниже."
          : "If your enquiry is time-sensitive or confidential, you can contact the team directly using the channels below.",
    formsEyebrow: locale === "ar" ? "النماذج" : locale === "ru" ? "Формы" : "Forms",
    formsTitle:
      locale === "ar"
        ? "اختر مسار الاستفسار الذي يناسب وضعك."
        : locale === "ru"
          ? "Выберите сценарий запроса, который соответствует вашей ситуации."
          : "Choose the enquiry flow that matches your situation.",
    formsDescription:
      locale === "ar"
        ? "توفر النماذج المخصصة تجربة أكثر صلة للمستثمرين والشركات من نموذج تواصل عام واحد."
        : locale === "ru"
          ? "Специализированные формы дают более релевантный опыт для инвесторов и компаний, чем одна общая контактная форма."
          : "Tailored forms create a more relevant experience for both investors and companies than a single generic contact form.",
    faqEyebrow: locale === "ar" ? "الأسئلة الشائعة" : locale === "ru" ? "FAQ" : "FAQ",
    faqTitle:
      locale === "ar"
        ? "ملاحظات سريعة قبل الإرسال."
        : locale === "ru"
          ? "Пара быстрых замечаний перед отправкой."
          : "A few quick notes before you submit.",
    faqDescription:
      locale === "ar"
        ? "إجابات قصيرة تساعد في ضبط التوقعات وتعزيز الثقة."
        : locale === "ru"
          ? "Короткие ответы, которые помогают настроить ожидания и усилить доверие."
          : "Short answers that help set expectations and reinforce trust.",
    ctaEyebrow: locale === "ar" ? "ما زلت تقرر؟" : locale === "ru" ? "Еще решаете?" : "Still deciding?",
    ctaTitle:
      locale === "ar"
        ? "هل تريد الأسعار أو جولة إرشادية قبل التواصل؟"
        : locale === "ru"
          ? "Нужны тарифы или guided walkthrough до обращения?"
          : "Want pricing context or a guided walkthrough before reaching out?",
    ctaDescription:
      locale === "ar"
        ? "يمكنك الانتقال مباشرة إلى العرض التوضيحي أو صفحة الأسعار ثم العودة إلى التواصل عندما تكون جاهزًا."
        : locale === "ru"
          ? "Вы можете перейти к демо или тарифам, а затем вернуться к контакту, когда будете готовы."
          : "You can move directly to the demo or pricing section and come back to contact when you are ready.",
    ctaPrimary: locale === "ar" ? "انتقل إلى العرض الإرشادي" : locale === "ru" ? "Перейти к guided demo" : "Go to guided demo",
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
          { value: settings.salesEmail, label: "company email" },
          { value: settings.phone, label: "direct phone" },
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
              <span className="eyebrow">Compliance</span>
              <h3 className="card-title text-foreground">Compliance & Regulatory Notice</h3>
              <p className="fine-print">
                We operate as an independent advisory and lead-qualification platform. We connect qualified clients with licensed citizenship and residency by investment providers and do not act as a governmental authority.
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
            primaryAction={{ href: ctaLinks.requestDemo, label: detailCopy.ctaPrimary }}
            secondaryAction={{ href: ctaLinks.viewPricing, label: "View pricing" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
