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
      title: "A clear plan structure for serious client-workflow operations.",
      description:
        "Review the public CBI Deal plan structure with a direct self-serve route for Solo, Team, and Business, plus a separate contact-led Enterprise path for tailored rollout discussions.",
      primary: "View Demo",
      secondary: "Contact us",
      plansEyebrow: "Plans",
      plansTitle: "Four plans, with one clear next step attached to each.",
      plansDescription:
        "Solo, Team, and Business move directly into workspace signup and live Stripe checkout. Enterprise stays separate so broader rollout, integrations, and governance can be handled properly before provisioning.",
      enterpriseTitle: "Need a tailored structure beyond the public plans?",
      enterpriseDescription:
        "Enterprise is handled through a direct contact route so implementation scope, integrations, access structure, and support expectations can be shaped before any workspace is provisioned.",
      enterpriseAction: "Contact us",
      enterpriseNote: "Enterprise route",
      backToCompanies: "Back to company overview",
      reviewTogether: "Would you prefer to review the plan structure together?",
      reviewTogetherDescription:
        "Use this section if you would like to discuss team size, operating scope, or which plan path appears most suitable before moving further.",
    },
    ar: {
      eyebrow: "خيارات التعامل",
      title: "خيارات واضحة وهادئة للمكاتب المتخصصة.",
      description:
        "هذه الصفحة تشرح مسار الاشتراك الذاتي ومسار المبيعات المخصص داخل منصة CBI Deal، بحيث تكون الخطوة التالية واضحة: عرض النسخة التجريبية، إنشاء مساحة العمل، أو التواصل معنا بخصوص إعداد Enterprise.",
      primary: "عرض النسخة التجريبية",
      secondary: "تواصل معنا",
      plansEyebrow: "الخطط",
      plansTitle: "أربع خطط واضحة، ولكل خطة الخطوة التالية المناسبة.",
      plansDescription:
        "Solo و Team و Business تنتقل مباشرة إلى التسجيل والدفع الذاتي. أما Enterprise فيبقى مسار تواصل منفصل حتى تتم مناقشة النطاق والتنفيذ والتكامل بالشكل المناسب.",
      enterpriseTitle: "هل تحتاج إلى هيكل مخصص يتجاوز الخطط العامة؟",
      enterpriseDescription:
        "يتم التعامل مع Enterprise عبر مسار تواصل مباشر حتى يمكن تحديد نطاق التنفيذ والتكامل وهيكل الوصول ومستوى الدعم قبل إنشاء أي مساحة عمل.",
      enterpriseAction: "تواصل معنا",
      enterpriseNote: "مسار Enterprise",
      backToCompanies: "العودة إلى صفحة الشركات",
      reviewTogether: "هل تفضل مراجعة هيكل الخطط في محادثة مباشرة؟",
      reviewTogetherDescription:
        "استخدم هذا القسم إذا كنت تريد مناقشة حجم الفريق أو النطاق التشغيلي أو الخطة الأنسب قبل المضي قدماً.",
    },
    ru: {
      eyebrow: "Форматы взаимодействия",
      title: "Понятные варианты для специализированных практик.",
      description:
        "Эта страница объясняет самостоятельный и sales-led пути входа в платформу CBI Deal, чтобы следующий шаг был однозначным: открыть демо, создать рабочее пространство или связаться с отделом продаж по Enterprise.",
      primary: "Открыть демо",
      secondary: "Связаться с нами",
      plansEyebrow: "Тарифы",
      plansTitle: "Четыре понятных плана, и у каждого есть правильный следующий шаг.",
      plansDescription:
        "Solo, Team и Business идут напрямую в самостоятельную регистрацию и оплату. Enterprise остаётся отдельным маршрутом, чтобы масштаб, внедрение и интеграции можно было согласовать заранее.",
      enterpriseTitle: "Нужна более индивидуальная структура, чем публичные планы?",
      enterpriseDescription:
        "Enterprise проходит через отдельный контактный маршрут, чтобы внедрение, интеграции, структура доступа и формат поддержки были согласованы до создания рабочего пространства.",
      enterpriseAction: "Связаться с нами",
      enterpriseNote: "Маршрут Enterprise",
      backToCompanies: "Назад к странице для компаний",
      reviewTogether: "Хотите обсудить структуру планов вместе?",
      reviewTogetherDescription:
        "Используйте этот раздел, если хотите обсудить размер команды, операционный масштаб или наиболее подходящий план перед следующим шагом.",
    },
  }[locale]

  return (
    <SiteShell>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        primaryAction={{ href: ctaLinks.appDemo, label: copy.primary }}
        secondaryAction={{ href: ctaLinks.enterpriseContact, label: copy.secondary }}
        stats={[
          {
            value: locale === "ar" ? "USD" : locale === "ru" ? "USD" : "USD",
            label:
              locale === "ar"
                ? "تسعير شهري واضح للخطط العامة"
                : locale === "ru"
                  ? "понятная месячная структура публичных планов"
                  : "clear monthly public plan pricing",
          },
          {
            value: locale === "ar" ? "3" : locale === "ru" ? "3" : "3",
            label:
              locale === "ar"
                ? "خطط ذاتية الاشتراك"
                : locale === "ru"
                  ? "самостоятельно оформляемых плана"
                  : "self-serve plans",
          },
          {
            value: "Enterprise",
            label:
              locale === "ar"
                ? "للتنفيذ المخصص والاحتياجات الأوسع"
                : locale === "ru"
                  ? "для индивидуального внедрения и более широких структур"
                  : "for tailored rollout and custom structures",
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
            primaryAction={{ href: ctaLinks.enterpriseContact, label: copy.enterpriseAction }}
            secondaryAction={{ href: routeLinks.forCompanies, label: copy.backToCompanies }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
