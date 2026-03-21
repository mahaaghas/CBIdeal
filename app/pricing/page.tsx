import type { Metadata } from "next"
import { CtaPanel } from "@/components/cta-panel"
import { MeetingSchedulerCard } from "@/components/meeting-scheduler-card"
import { PageHero } from "@/components/page-hero"
import { PricingSection } from "@/components/pricing-section"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { buildPageMetadata } from "@/lib/metadata"
import { ctaLinks, routeLinks } from "@/lib/site"

export const metadata: Metadata = buildPageMetadata({
  title: "CRM Pricing for Immigration Firms",
  description:
    "Review clear per-user pricing for the immigration CRM, including guided demo access, annual savings, and custom options for larger passport companies.",
  path: "/pricing",
  keywords: [
    "immigration CRM pricing",
    "passport company software pricing",
    "citizenship by investment CRM cost",
  ],
})

export default function PricingPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="SaaS pricing"
        title="Pricing designed for a specialized immigration CRM."
        description="Starter works for smaller teams, Growth suits firms that need stronger visibility, and Enterprise covers custom rollout or lead partnership setups."
        primaryAction={{ href: ctaLinks.requestDemo, label: "Try guided demo" }}
        secondaryAction={{ href: ctaLinks.contactSales, label: "Contact sales" }}
        stats={[
          { value: "Per user", label: "pricing for software seats" },
          { value: "Annual savings", label: "with yearly billing" },
          { value: "Enterprise", label: "for custom rollout" },
        ]}
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Plans"
            title="Three plans are enough for a credible early-stage B2B offer."
            description="The pricing stays realistic for a niche SaaS: not too cheap to feel disposable, and not so aggressive that it breaks trust."
          />
          <PricingSection />
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
            title="Need multi-office rollout, lead partnership pricing, or custom workflows?"
            description="Enterprise setup can include implementation planning, white-label positioning, and commercial terms for qualified lead delivery."
            primaryAction={{ href: ctaLinks.contactSales, label: "Contact sales" }}
            secondaryAction={{ href: routeLinks.forCompanies, label: "Back to company overview" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
