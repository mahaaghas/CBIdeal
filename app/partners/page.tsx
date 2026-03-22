import type { Metadata } from "next"
import { BadgeCheck, Handshake, Network, ShieldCheck, Users2 } from "lucide-react"
import { CtaPanel } from "@/components/cta-panel"
import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { TrustGrid } from "@/components/trust-grid"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getLocalizedRouteLinks } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  return buildPageMetadata({
    title:
      locale === "ar"
        ? "شراكات للوكالات وشركات الجوازات"
        : locale === "ru"
          ? "Партнёрства для агентств и паспортных компаний"
          : "Partnerships for Agencies and Passport Companies",
    description:
      locale === "ar"
        ? "استكشف فرص الشراكات بالإحالة أو العلامة البيضاء أو CRM للوكالات وشركات الجوازات ومشغلي الهجرة الدوليين."
        : locale === "ru"
          ? "Изучите реферальные, white-label и CRM-партнёрства для агентств, паспортных компаний и международных иммиграционных операторов."
          : "Explore referral, white-label, and CRM partnership opportunities for agencies, passport companies, and cross-border immigration operators.",
    path: localizeHref(locale, "/partners"),
    keywords: [
      "immigration firm partnerships",
      "passport company partnerships",
      "white label immigration CRM",
    ],
    locale,
  })
}

const trustItems = [
  {
    title: "For established operators",
    description: "Built for agencies, introducers, and passport firms that need a serious commercial conversation, not affiliate-style fluff.",
  },
  {
    title: "Multi-model partnerships",
    description: "Supports referral, implementation, co-branded, and white-label discussions in one place.",
  },
  {
    title: "Aligned with the CRM story",
    description: "Partner conversations can naturally extend into software adoption, resale, or operational collaboration.",
  },
  {
    title: "Reusable intake logic",
    description: "The partner form follows the same structured intake approach used across investor and company enquiries for consistent review and follow-up.",
  },
]

const models = [
  {
    icon: Handshake,
    title: "Referral partnerships",
    description: "For firms that want a trusted advisory or product partner without changing their own operating model.",
  },
  {
    icon: Network,
    title: "White-label collaboration",
    description: "For agencies that want co-branded delivery, discreet backend support, or a more integrated commercial structure.",
  },
  {
    icon: Users2,
    title: "Software and service bundling",
    description: "For passport companies that want to pair a CRM rollout with stronger intake and client management workflows.",
  },
]

const criteria = [
  "Clear service scope, markets served, and the jurisdictions you actively work in.",
  "A realistic view of compliance, client suitability, and documentation standards.",
  "Commercial alignment on lead ownership, handoff expectations, and brand presentation.",
]

export default function PartnersPage() {
  const locale = getRequestLocale()
  const routeLinks = getLocalizedRouteLinks(locale)
  return (
    <SiteShell>
      <PageHero
        eyebrow="Agency and passport company partnerships"
        title="Partnerships for agencies, passport companies, and cross-border immigration operators."
        description="Open serious partnership conversations around referrals, white-label collaboration, CRM distribution, and shared case workflows. The tone is commercial, selective, and built to support trust."
        primaryAction={{ href: "#partner-form", label: "Apply to partner" }}
        secondaryAction={{ href: routeLinks.forCompanies, label: "View company overview" }}
        stats={[
          { value: "Referral", label: "for channel relationships" },
          { value: "White-label", label: "for co-branded delivery" },
          { value: "Software", label: "for CRM expansion" },
        ]}
      >
        <div className="rounded-[28px] border border-white/10 bg-black/10 p-5 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.18em] text-primary-foreground/70">Who this is for</p>
          <div className="mt-4 space-y-4">
            {[
              "Immigration agencies seeking a structured partner desk.",
              "Passport companies exploring product or service distribution.",
              "Advisory firms that want a stronger operating layer across leads and cases.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 size-5 text-secondary" />
                <p className="text-sm leading-7 text-primary-foreground/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </PageHero>

      <section className="section-padding">
        <div className="container-shell">
          <TrustGrid items={trustItems} />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Partner models"
            title="Structured paths for commercial collaboration."
            description="This makes it easy for agencies and passport companies to understand the type of relationship they can pursue without unnecessary complexity."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {models.map((model) => (
              <Card key={model.title} className="section-card">
                <CardContent className="space-y-4 p-8">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <model.icon className="size-6" />
                  </div>
                  <h3 className="card-title text-foreground">{model.title}</h3>
                  <p className="fine-print">{model.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <span className="eyebrow">Selection criteria</span>
            <h2 className="section-title max-w-xl text-foreground">
              Partnerships work best when the operating model is clear.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              This section replaces vague partner claims with practical criteria that make the business feel selective, serious, and easier to trust.
            </p>
            <div className="space-y-4">
              {criteria.map((criterion) => (
                <div key={criterion} className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 size-5 text-primary" />
                  <p className="fine-print">{criterion}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="section-card">
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow">Commercial note</span>
              <h3 className="card-title text-foreground">One route for service partnerships and CRM channel growth.</h3>
              <p className="fine-print">
                Keeping partnerships on the same domain creates a clean bridge between the advisory business and the SaaS offering. Agencies can discuss referrals, co-branded execution, or software adoption without leaving the site.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="partner-form" className="section-padding">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <span className="eyebrow">Partner application</span>
            <h2 className="section-title max-w-xl text-foreground">Start a partner conversation.</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Use the form to describe your business, markets, and preferred partnership model. We will review the enquiry and suggest the most relevant next step.
            </p>
          </div>
          <LeadQualificationForm
            locale={locale}
            formType="partner"
            title="Apply as a partner"
            description="Tell us where you operate and the relationship you want to explore."
            submitLabel="Submit partner enquiry"
            source="partners"
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow="Product path"
            title="Need to evaluate the software before discussing distribution?"
            description="Move to the company overview for a clearer product narrative aimed at operational teams, owners, and commercial decision-makers."
            primaryAction={{ href: routeLinks.forCompanies, label: "Go to company overview" }}
            secondaryAction={{ href: routeLinks.programs, label: "Go to investor section" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
