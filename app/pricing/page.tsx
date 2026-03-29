import type { Metadata } from "next"
import { CtaPanel } from "@/components/cta-panel"
import { MeetingSchedulerCard } from "@/components/meeting-scheduler-card"
import { PageHero } from "@/components/page-hero"
import { PricingSection } from "@/components/pricing-section"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getLocalizedCtaLinks, getLocalizedRouteLinks } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  const localized = {
    en: {
      title: "Engagement Options for Professional Firms",
      description:
        "Review clear engagement options for professional firms, including indicative structures and tailored arrangements for larger teams.",
      keywords: [
        "professional engagement options",
        "private advisory pricing",
        "licensed firm consultation",
      ],
    },
    ar: {
      title: "خيارات التعامل للمكاتب المتخصصة",
      description:
        "راجع خيارات تعامل واضحة للمكاتب المتخصصة، مع هياكل إرشادية وترتيبات أوسع عند الحاجة.",
      keywords: ["خيارات التعامل للمكاتب المتخصصة", "الاستشارة الخاصة للشركات", "الترتيبات المهنية"],
    },
    ru: {
      title: "Форматы взаимодействия для профессиональных фирм",
      description:
        "Изучите понятные форматы взаимодействия для профессиональных фирм, включая ориентиры и более широкие индивидуальные структуры.",
      keywords: ["форматы взаимодействия для фирм", "частная консультация для практик", "профессиональные структуры"],
    },
  }[locale]

  return buildPageMetadata({
    title: localized.title,
    description: localized.description,
    path: localizeHref(locale, "/pricing"),
    keywords: localized.keywords,
    locale,
  })
}

export default function PricingPage() {
  const locale = getRequestLocale()
  const ctaLinks = getLocalizedCtaLinks(locale)
  const routeLinks = getLocalizedRouteLinks(locale)
  const copy = {
    en: {
      eyebrow: "Engagement options",
      title: "Clear engagement options for professional firms.",
      description:
        "This page is intended to explain the broad engagement structure in a straightforward way. It should give firms enough context for an informed first view, while leaving room for a more tailored discussion where that proves appropriate.",
      primary: "Request a private overview",
      secondary: "Contact us directly",
      plansEyebrow: "Plans",
      plansTitle: "Three clear structures are enough for a calm and credible pricing page.",
      plansDescription:
        "The figures below are there to provide orientation rather than pressure. They should help firms understand the broad structure, compare the main options, and decide whether a more detailed conversation would be useful.",
      enterpriseTitle: "Need a wider structure or a more tailored arrangement?",
      enterpriseDescription:
        "Wider arrangements can include tailored access, implementation planning, and a more bespoke way of working. This final section is intended to show where the standard structures end and where a more tailored conversation may begin.",
    },
    ar: {
      eyebrow: "خيارات التعامل",
      title: "خيارات واضحة وهادئة للمكاتب المتخصصة.",
      description:
        "صُممت البنية لتكون واضحة بما يكفي لاتخاذ قرار أولي، مع ترك مساحة لترتيبات أوسع عندما يكون ذلك منطقياً.",
      primary: "اطلب عرضاً خاصاً",
      secondary: "اكتب إلينا بدلاً من ذلك",
      plansEyebrow: "الخطط",
      plansTitle: "عدد محدود من الخيارات يكفي لشرح الهيكل بوضوح.",
      plansDescription:
        "الأرقام هنا موضوعة لتدعم قراراً أولياً هادئاً من دون مبالغة أو عرض استعراضي.",
      enterpriseTitle: "هل تحتاج إلى ترتيب أوسع أو صيغة أكثر تخصيصاً؟",
      enterpriseDescription:
        "يمكن أن تشمل الترتيبات الأوسع نطاقاً أكثر خصوصية أو تخطيطاً أدق أو طريقة عمل مصممة حول احتياج الفريق.",
    },
    ru: {
      eyebrow: "Форматы взаимодействия",
      title: "Понятные варианты для специализированных практик.",
      description:
        "Структура задумана так, чтобы дать ясную основу для первого решения и оставить пространство для более индивидуальных форматов при необходимости.",
      primary: "Запросить частный обзор",
      secondary: "Написать нам",
      plansEyebrow: "Тарифы",
      plansTitle: "Небольшого числа вариантов достаточно для ясного первого обзора.",
      plansDescription:
        "Цифры здесь нужны для спокойного первого решения, без излишней агрессии и без ощущения шаблонной продуктовой страницы.",
      enterpriseTitle: "Нужен более широкий формат или более индивидуальная структура?",
      enterpriseDescription:
        "Более широкие форматы могут включать индивидуальный объём доступа, более подробное планирование и более адаптированный способ работы.",
    },
  }[locale]

  return (
    <SiteShell>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        primaryAction={{ href: ctaLinks.requestDemo, label: copy.primary }}
        secondaryAction={{ href: ctaLinks.contactSales, label: copy.secondary }}
        stats={[
          { value: locale === "ar" ? "لكل مستخدم" : "Per user", label: locale === "ar" ? "تسعير واضح للمقاعد" : "clear seat-based pricing" },
          { value: locale === "ar" ? "توفير سنوي" : "Annual savings", label: locale === "ar" ? "عند اختيار الفوترة السنوية" : "with yearly billing" },
          { value: "Enterprise", label: locale === "ar" ? "للهياكل الأوسع أو الاحتياجات المخصصة" : "for broader custom structures" },
        ]}
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow={copy.plansEyebrow}
            title={copy.plansTitle}
            description={copy.plansDescription}
          />
          <PricingSection locale={locale} />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <MeetingSchedulerCard
            compact
            title={locale === "ar" ? "هل تفضل مراجعة الأسعار في محادثة مباشرة؟" : "Would you prefer to review the engagement options together?"}
            description={locale === "ar" ? "استخدم هذا القسم إذا كنت تريد مناقشة حجم الفريق أو النطاق أو الهيكل الأنسب للتعامل." : "Use this section if you would like to discuss team size, scope, or which engagement structure appears most suitable before moving further."}
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow={locale === "ar" ? "ملاحظة حول Enterprise" : "Enterprise note"}
            title={copy.enterpriseTitle}
            description={copy.enterpriseDescription}
            primaryAction={{ href: ctaLinks.contactSales, label: copy.secondary }}
            secondaryAction={{ href: routeLinks.forCompanies, label: locale === "ar" ? "العودة إلى صفحة الشركات" : locale === "ru" ? "Назад к странице для компаний" : "Back to company overview" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
