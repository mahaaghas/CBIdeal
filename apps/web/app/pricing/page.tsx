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
      title: "Solutions for Professional Firms",
      description:
        "Review clear solutions for professional firms, including structured packages and tailored arrangements for larger teams.",
      keywords: [
        "professional solutions",
        "private advisory solutions",
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
      eyebrow: "Solutions",
      title: "Clear SaaS plans for specialist firms.",
      description:
        "This page explains the self-serve and sales-led paths into the CBI Deal platform. It should make the next step unambiguous: view the demo, create a workspace, or request a more tailored enterprise setup.",
      primary: "View Demo",
      secondary: "Request Demo",
      plansEyebrow: "Solutions",
      plansTitle: "Three clear plan paths, with the right action attached to each one.",
      plansDescription:
        "Starter and Growth move through self-serve onboarding and billing. Enterprise remains a higher-touch route so broader teams can be configured with more care from the outset.",
      enterpriseTitle: "Need a broader rollout or a more tailored setup?",
      enterpriseDescription:
        "Enterprise is handled separately so implementation, access structure, and commercial scope can be discussed properly before any account is provisioned.",
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
        primaryAction={{ href: ctaLinks.appDemo, label: copy.primary }}
        secondaryAction={{ href: ctaLinks.requestProductDemo, label: copy.secondary }}
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
            title={locale === "ar" ? "هل تفضل مراجعة الحلول في محادثة مباشرة؟" : "Would you prefer to review the solutions together?"}
            description={locale === "ar" ? "استخدم هذا القسم إذا كنت تريد مناقشة حجم الفريق أو النطاق أو الهيكل الأنسب." : "Use this section if you would like to discuss team size, scope, or which solution structure appears most suitable before moving further."}
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow={locale === "ar" ? "ملاحظة حول Enterprise" : "Enterprise note"}
            title={copy.enterpriseTitle}
            description={copy.enterpriseDescription}
            primaryAction={{ href: ctaLinks.enterpriseSetup, label: locale === "ar" ? "Ø§Ø·Ù„Ø¨ Ø¥Ø¹Ø¯Ø§Ø¯ Enterprise" : "Request enterprise setup" }}
            secondaryAction={{ href: routeLinks.forCompanies, label: locale === "ar" ? "العودة إلى صفحة الشركات" : locale === "ru" ? "Назад к странице для компаний" : "Back to company overview" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
