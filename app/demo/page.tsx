import type { Metadata } from "next"
import { CtaPanel } from "@/components/cta-panel"
import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { MeetingSchedulerCard } from "@/components/meeting-scheduler-card"
import { PageHero } from "@/components/page-hero"
import { ProcessSteps } from "@/components/process-steps"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Compass, MonitorPlay, Users } from "lucide-react"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getLocalizedCtaLinks, getLocalizedRouteLinks } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  const localized = {
    en: {
      title: "Guided CRM Demo for Immigration Firms",
      description:
        "Request a guided CRM demo for passport companies and immigration firms, with a focused walkthrough of lead handling, follow-up, visibility, and next-step planning.",
    },
    ar: {
      title: "عرض CRM إرشادي لشركات الهجرة",
      description:
        "اطلب عرضاً إرشادياً لنظام CRM المخصص لشركات الجوازات والهجرة مع شرح واضح لإدارة العملاء المحتملين والمتابعة والخطوات التالية.",
    },
    ru: {
      title: "Проводимое демо CRM для иммиграционных фирм",
      description:
        "Запросите guided demo CRM для паспортных и иммиграционных компаний с фокусом на лидах, сопровождении и следующих шагах.",
    },
  }[locale]

  return buildPageMetadata({
    title: localized.title,
    description: localized.description,
    path: localizeHref(locale, "/demo"),
    keywords: [
      "immigration CRM demo",
      "passport company software demo",
      "guided CRM walkthrough",
    ],
    locale,
  })
}

const demoSteps = [
  {
    icon: Compass,
    title: "Tell us what you want to see",
    description: "We tailor the walkthrough around lead pipeline, case handling, reporting, or the qualified lead partnership model.",
  },
  {
    icon: MonitorPlay,
    title: "Guided product walkthrough",
    description: "We show the CRM structure, explain what is live now, and frame what can be expanded later without overpromising.",
  },
  {
    icon: Users,
    title: "Decide next steps",
    description: "If there is a fit, the next step is pricing, rollout scope, and whether your team also wants qualified leads.",
  },
]

export default function DemoPage() {
  const locale = getRequestLocale()
  const ctaLinks = getLocalizedCtaLinks(locale)
  const routeLinks = getLocalizedRouteLinks(locale)
  const copy = {
    en: {
      eyebrow: "Guided demo",
      title: "Request a guided demo of the CRM and lead workflow.",
      description:
        "A guided demo gives passport companies and immigration firms a clearer way to evaluate the CRM, the lead workflow, and the right next step for their team.",
      requestDemo: "Request guided demo",
      seePricing: "See pricing first",
    },
    ar: {
      eyebrow: "عرض إرشادي",
      title: "اطلب عرضاً إرشادياً لنظام CRM ومسار العملاء المحتملين.",
      description:
        "يوفر العرض الإرشادي لشركات الجوازات والهجرة طريقة أوضح لتقييم النظام ومسار العملاء والخطوة التالية المناسبة للفريق.",
      requestDemo: "اطلب عرضاً إرشادياً",
      seePricing: "اطلع على الأسعار أولاً",
    },
    ru: {
      eyebrow: "Guided demo",
      title: "Запросите guided demo CRM и процесса работы с лидами.",
      description:
        "Guided demo помогает паспортным и иммиграционным компаниям понятнее оценить CRM, процесс работы с лидами и следующий шаг для команды.",
      requestDemo: "Запросить guided demo",
      seePricing: "Сначала посмотреть тарифы",
    },
  }[locale]

  return (
    <SiteShell>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        primaryAction={{ href: "#demo-form", label: copy.requestDemo }}
        secondaryAction={{ href: ctaLinks.viewPricing, label: copy.seePricing }}
        stats={[
          { value: "Walkthrough", label: "tailored to your workflow" },
          { value: "Realistic scope", label: "without product fluff" },
          { value: "Next steps", label: "for CRM, leads, or both" },
        ]}
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow="What the demo includes"
            title="A serious product conversation, not a vague sales tour."
            description="The guided demo is built to show workflow fit, not to overwhelm teams with irrelevant features."
          />
          <ProcessSteps steps={demoSteps} />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <MeetingSchedulerCard
            title="Book a guided demo slot"
            description="Use this booking section if you want to move directly to a product walkthrough or a CRM plus leads discussion."
          />
        </div>
      </section>

      <section id="demo-form" className="section-padding">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <span className="eyebrow">Demo request</span>
            <h2 className="section-title max-w-xl text-foreground">Request a guided walkthrough for your team.</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Share your company profile, team size, and what you want to evaluate. We will tailor the conversation around the use case that matters most.
            </p>
            <Card className="section-card">
              <CardContent className="space-y-3 p-8">
                <h3 className="card-title text-foreground">Typical demo focus areas</h3>
                <p className="fine-print">Lead pipeline setup, client records, follow-up process, management visibility, and lead partnership fit.</p>
              </CardContent>
            </Card>
          </div>
          <LeadQualificationForm
            locale={locale}
            formType="company"
            title="Request guided demo"
            description="Tell us what your team wants to see."
            submitLabel="Request demo"
            source="demo"
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow="Need commercial detail?"
            title="If you want pricing or the full company positioning first, we have both ready."
            description="Use pricing for plan detail or return to the company overview for CRM, qualified leads, and data protection messaging."
            primaryAction={{ href: ctaLinks.viewPricing, label: "View pricing" }}
            secondaryAction={{ href: routeLinks.forCompanies, label: "Back to company overview" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
