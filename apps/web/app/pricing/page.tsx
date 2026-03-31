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
        "Изучите понятные форматы взаимодействия для профессиональных фирм, включая структурированные пакеты и более широкие индивидуальные варианты.",
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
        "This page explains the self-serve and sales-led paths into the CBI Deal platform. It should make the next step unambiguous: view the demo, create a workspace, or contact sales for a more tailored enterprise setup.",
      primary: "View Demo",
      secondary: "Request Demo",
      plansEyebrow: "Solutions",
      plansTitle: "Three clear plan paths, with the right action attached to each one.",
      plansDescription:
        "Starter and Growth move through self-serve onboarding and billing. Enterprise remains a higher-touch route so broader teams can be configured with more care from the outset.",
      enterpriseTitle: "Need a broader rollout or a more tailored setup?",
      enterpriseDescription:
        "Enterprise is handled separately so implementation, access structure, and commercial scope can be discussed properly before any account is provisioned.",
      enterpriseAction: "Contact Sales",
      enterpriseNote: "Enterprise note",
      backToCompanies: "Back to company overview",
      reviewTogether: "Would you prefer to review the solutions together?",
      reviewTogetherDescription:
        "Use this section if you would like to discuss team size, scope, or which solution structure appears most suitable before moving further.",
    },
    ar: {
      eyebrow: "خيارات التعامل",
      title: "خيارات واضحة وهادئة للمكاتب المتخصصة.",
      description:
        "هذه الصفحة تشرح مسار الاشتراك الذاتي ومسار المبيعات المخصص داخل منصة CBI Deal، بحيث تكون الخطوة التالية واضحة: عرض النسخة التجريبية، إنشاء مساحة العمل، أو التواصل معنا بخصوص إعداد Enterprise.",
      primary: "عرض النسخة التجريبية",
      secondary: "طلب عرض توضيحي",
      plansEyebrow: "الخطط",
      plansTitle: "ثلاثة مسارات واضحة، ولكل مسار الإجراء المناسب له.",
      plansDescription:
        "Starter و Growth ينتقلان عبر مسار تسجيل وفوترة ذاتي. أما Enterprise فيبقى مساراً أكثر خصوصية حتى يمكن ترتيب الفرق الأوسع بعناية أكبر.",
      enterpriseTitle: "هل تحتاج إلى ترتيب أوسع أو صيغة أكثر تخصيصاً؟",
      enterpriseDescription:
        "يتم التعامل مع Enterprise بشكل منفصل حتى يمكن مناقشة التنفيذ وهيكل الوصول والنطاق التجاري قبل إنشاء أي حساب.",
      enterpriseAction: "تواصل مع المبيعات",
      enterpriseNote: "ملاحظة حول Enterprise",
      backToCompanies: "العودة إلى صفحة الشركات",
      reviewTogether: "هل تفضل مراجعة الحلول في محادثة مباشرة؟",
      reviewTogetherDescription:
        "استخدم هذا القسم إذا كنت تريد مناقشة حجم الفريق أو النطاق أو الهيكل الأنسب قبل المضي قدماً.",
    },
    ru: {
      eyebrow: "Форматы взаимодействия",
      title: "Понятные варианты для специализированных практик.",
      description:
        "Эта страница объясняет самостоятельный и sales-led пути входа в платформу CBI Deal, чтобы следующий шаг был однозначным: открыть демо, создать рабочее пространство или связаться с отделом продаж по Enterprise.",
      primary: "Открыть демо",
      secondary: "Запросить демо",
      plansEyebrow: "Тарифы",
      plansTitle: "Три понятных варианта, и у каждого есть правильное следующее действие.",
      plansDescription:
        "Starter и Growth идут через самостоятельную регистрацию и биллинг. Enterprise остаётся более персональным маршрутом, чтобы более широкие команды можно было настроить осознанно.",
      enterpriseTitle: "Нужен более широкий формат или более индивидуальная структура?",
      enterpriseDescription:
        "Enterprise обрабатывается отдельно, чтобы внедрение, структура доступа и коммерческие условия были согласованы до создания аккаунта.",
      enterpriseAction: "Связаться с отделом продаж",
      enterpriseNote: "Примечание по Enterprise",
      backToCompanies: "Назад к странице для компаний",
      reviewTogether: "Хотите обсудить решения вместе?",
      reviewTogetherDescription:
        "Используйте этот раздел, если хотите обсудить размер команды, объём работ или наиболее подходящую структуру решения перед следующим шагом.",
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
          {
            value: locale === "ar" ? "لكل مستخدم" : locale === "ru" ? "На пользователя" : "Per user",
            label:
              locale === "ar"
                ? "تسعير واضح للمقاعد"
                : locale === "ru"
                  ? "понятная модель по количеству мест"
                  : "clear seat-based pricing",
          },
          {
            value: locale === "ar" ? "توفير سنوي" : locale === "ru" ? "Годовая экономия" : "Annual savings",
            label:
              locale === "ar"
                ? "عند اختيار الفوترة السنوية"
                : locale === "ru"
                  ? "при годовой оплате"
                  : "with yearly billing",
          },
          {
            value: "Enterprise",
            label:
              locale === "ar"
                ? "للهياكل الأوسع أو الاحتياجات المخصصة"
                : locale === "ru"
                  ? "для более широких структур и индивидуальных настроек"
                  : "for broader custom structures",
          },
        ]}
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading eyebrow={copy.plansEyebrow} title={copy.plansTitle} description={copy.plansDescription} />
          <PricingSection locale={locale} />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <MeetingSchedulerCard compact title={copy.reviewTogether} description={copy.reviewTogetherDescription} />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow={copy.enterpriseNote}
            title={copy.enterpriseTitle}
            description={copy.enterpriseDescription}
            primaryAction={{ href: ctaLinks.enterpriseSetup, label: copy.enterpriseAction }}
            secondaryAction={{ href: routeLinks.forCompanies, label: copy.backToCompanies }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
