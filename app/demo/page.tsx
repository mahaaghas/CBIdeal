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
      title: "Private Platform Overview for Professional Firms",
      description:
        "Request a private overview for licensed firms and advisory practices, with a structured conversation around fit, working style, and whether a broader discussion would be worthwhile.",
    },
    ar: {
      title: "عرض خاص للمكاتب المتخصصة",
      description:
        "اطلب عرضاً خاصاً للمكاتب المتخصصة، مع محادثة أوضح حول الملاءمة وأسلوب العمل وما إذا كان من المناسب الاستمرار.",
    },
    ru: {
      title: "Частный обзор для специализированных фирм",
      description:
        "Запросите частный обзор для специализированных фирм с более ясным разговором о пригодности, стиле работы и том, есть ли смысл продолжать.",
    },
  }[locale]

  return buildPageMetadata({
    title: localized.title,
    description: localized.description,
    path: localizeHref(locale, "/demo"),
    keywords: [
      "private platform overview",
      "professional advisory overview",
      "licensed firm consultation",
    ],
    locale,
  })
}

const demoSteps = [
  {
    icon: Compass,
    title: "Set the agenda",
    description: "We shape the discussion around the questions and priorities that matter most to your team.",
  },
  {
    icon: MonitorPlay,
    title: "Private overview",
    description: "We review the structure calmly and directly, focusing on what is relevant rather than trying to show everything at once.",
  },
  {
    icon: Users,
    title: "Consider the next step",
    description: "If the fit appears genuine, the conversation can move towards scope, timing, and the most suitable way to continue.",
  },
]

export default function DemoPage() {
  const locale = getRequestLocale()
  const ctaLinks = getLocalizedCtaLinks(locale)
  const routeLinks = getLocalizedRouteLinks(locale)
  const copy = {
    en: {
      eyebrow: "Private overview",
      title: "Request a private overview for your firm.",
      description:
        "A short private overview can be the clearest way to understand whether the structure, working style, and level of support are right for your team.",
      requestDemo: "Arrange a private overview",
      seePricing: "View pricing first",
    },
    ar: {
      eyebrow: "عرض خاص",
      title: "اطلب عرضاً خاصاً لجهتك.",
      description:
        "يمكن أن يكون العرض الخاص أقرب طريقة لفهم ما إذا كانت البنية وأسلوب العمل ومستوى الدعم مناسبة لفريقك.",
      requestDemo: "اطلب عرضاً خاصاً",
      seePricing: "اطلع على الأسعار أولاً",
    },
    ru: {
      eyebrow: "Частный обзор",
      title: "Запросите частный обзор для вашей фирмы.",
      description:
        "Короткий частный обзор часто оказывается самым ясным способом понять, подходят ли структура, стиль работы и уровень поддержки вашей команде.",
      requestDemo: "Запросить частный обзор",
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
          { value: "Private", label: "tailored to your priorities" },
          { value: "Measured", label: "focused on what matters" },
          { value: "Next step", label: "only where the fit appears genuine" },
        ]}
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow="What the discussion includes"
            title="A structured overview, not a rushed presentation."
            description="The overview is designed to clarify fit and context, not to overwhelm teams with unnecessary detail."
          />
          <ProcessSteps steps={demoSteps} />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <MeetingSchedulerCard
            title="Arrange a private overview"
            description="Use this section if you would prefer to move directly to a structured conversation."
          />
        </div>
      </section>

      <section id="demo-form" className="section-padding">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <span className="eyebrow">Private overview</span>
            <h2 className="section-title max-w-xl text-foreground">Tell us what you would like to discuss.</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Share a little context about your firm and the areas you would like to review. We will shape the discussion accordingly.
            </p>
            <Card className="section-card">
              <CardContent className="space-y-3 p-8">
                <h3 className="card-title text-foreground">Typical discussion areas</h3>
                <p className="fine-print">Working method, team coordination, internal visibility, client handling, and the shape of a possible engagement.</p>
              </CardContent>
            </Card>
          </div>
          <LeadQualificationForm
            locale={locale}
            formType="company"
            title="Request a private overview"
            description="Tell us what would be most useful to cover."
            submitLabel="Request a private overview"
            source="demo"
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow="Need more context first?"
            title="Review pricing or return to the professional overview before getting in touch."
            description="You can read a little more first, then return when you are ready for a private discussion."
            primaryAction={{ href: ctaLinks.viewPricing, label: "View pricing" }}
            secondaryAction={{ href: routeLinks.forCompanies, label: "Back to professional overview" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
