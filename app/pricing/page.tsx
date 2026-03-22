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
      title: "CRM Pricing for Immigration Firms",
      description:
        "Review clear per-user pricing for the immigration CRM, including guided demo access, annual savings, and custom options for larger passport companies.",
      keywords: [
        "immigration CRM pricing",
        "passport company software pricing",
        "citizenship by investment CRM cost",
      ],
    },
    ar: {
      title: "أسعار CRM لشركات الهجرة",
      description:
        "راجع تسعيراً واضحاً لكل مستخدم لنظام CRM الخاص بشركات الهجرة، مع العرض التوضيحي والتوفير السنوي وخيارات مخصصة للفرق الأكبر.",
      keywords: ["أسعار CRM الهجرة", "أسعار برنامج شركات الجوازات", "تكلفة CRM الجنسية عن طريق الاستثمار"],
    },
    ru: {
      title: "Тарифы CRM для иммиграционных фирм",
      description:
        "Изучите понятные тарифы за пользователя для иммиграционной CRM, включая демо, экономию при годовой оплате и кастомные опции для крупных команд.",
      keywords: ["тарифы CRM для иммиграции", "цены на ПО для паспортных компаний", "стоимость CRM для CBI"],
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
      eyebrow: "SaaS pricing",
      title: "Pricing designed for a specialized immigration CRM.",
      description:
        "Starter works for smaller teams, Growth suits firms that need stronger visibility, and Enterprise covers custom rollout or lead partnership setups.",
      primary: "Try guided demo",
      secondary: "Contact sales",
      plansEyebrow: "Plans",
      plansTitle: "Three plans are enough for a credible early-stage B2B offer.",
      plansDescription:
        "The pricing stays realistic for a niche SaaS: not too cheap to feel disposable, and not so aggressive that it breaks trust.",
      enterpriseTitle: "Need multi-office rollout, lead partnership pricing, or custom workflows?",
      enterpriseDescription:
        "Enterprise setup can include implementation planning, white-label positioning, and commercial terms for qualified lead delivery.",
    },
    ar: {
      eyebrow: "أسعار SaaS",
      title: "تسعير مصمم لنظام CRM متخصص للهجرة.",
      description:
        "خطة Starter مناسبة للفرق الصغيرة، وخطة Growth للفرق التي تحتاج رؤية أقوى، بينما تغطي Enterprise الإطلاقات المخصصة وشراكات العملاء المحتملين.",
      primary: "جرّب العرض التوضيحي",
      secondary: "تواصل مع المبيعات",
      plansEyebrow: "الخطط",
      plansTitle: "ثلاث خطط تكفي لتقديم عرض B2B مبكر وموثوق.",
      plansDescription:
        "يحافظ التسعير على منطقية مناسبة لبرمجيات متخصصة: ليس منخفضاً لدرجة فقدان الجدية ولا مرتفعاً بشكل يضعف الثقة.",
      enterpriseTitle: "هل تحتاج إلى إطلاق متعدد المكاتب أو تسعير شراكات أو مهام مخصصة؟",
      enterpriseDescription:
        "يمكن أن يشمل إعداد Enterprise تخطيط التنفيذ والتموضع بالعلامة البيضاء والشروط التجارية لتسليم العملاء المحتملين المؤهلين.",
    },
    ru: {
      eyebrow: "Тарифы SaaS",
      title: "Тарифы для специализированной иммиграционной CRM.",
      description:
        "Starter подходит небольшим командам, Growth — фирмам с потребностью в большей прозрачности, а Enterprise закрывает кастомные внедрения и лид-партнёрства.",
      primary: "Попробовать демо",
      secondary: "Связаться с продажами",
      plansEyebrow: "Тарифы",
      plansTitle: "Трёх тарифов достаточно для убедительного раннего B2B-предложения.",
      plansDescription:
        "Цены выглядят реалистично для нишевого SaaS: не слишком низко, чтобы обесценить продукт, и не слишком агрессивно, чтобы подорвать доверие.",
      enterpriseTitle: "Нужен multi-office rollout, цены на лид-партнёрство или кастомные процессы?",
      enterpriseDescription:
        "Enterprise может включать план внедрения, white-label позиционирование и коммерческие условия по квалифицированным лидам.",
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
          { value: "Per user", label: "pricing for software seats" },
          { value: "Annual savings", label: "with yearly billing" },
          { value: "Enterprise", label: "for custom rollout" },
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
            title="Prefer to walk through pricing live?"
            description="Use a booking slot for team sizing, rollout scoping, or lead partnership pricing questions."
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow="Enterprise note"
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
