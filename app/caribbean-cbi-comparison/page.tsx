import type { Metadata } from "next"
import { BadgeCheck, CircleDollarSign, Compass, Landmark, ShieldCheck, Users } from "lucide-react"
import { LocalizedLandingLeadForm } from "@/components/forms/localized-landing-lead-form"
import { LandingComparisonTable } from "@/components/landing/landing-comparison-table"
import { LandingCtaSection } from "@/components/landing/landing-cta-section"
import { LandingFaqSection } from "@/components/landing/landing-faq-section"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingLinkGrid } from "@/components/landing/landing-link-grid"
import { ProcessSteps } from "@/components/process-steps"
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
    title: "Caribbean CBI Comparison: What Actually Separates the Main Programs",
    description:
      "Compare the main Caribbean citizenship by investment programs with a realistic lens on cost, family fit, positioning, and strategic use.",
    path: localizeHref(locale, "/caribbean-cbi-comparison"),
    keywords: [
      "caribbean citizenship by investment comparison",
      "caribbean passport comparison",
      "best caribbean citizenship program",
    ],
    locale,
  })
}

const trustItems = [
  {
    title: "Compare by fit, not hype",
    description:
      "Most investors do not need the loudest route. They need the route that matches their profile more cleanly.",
  },
  {
    title: "Differences are real but often narrower",
    description:
      "The main Caribbean programs can feel closer in actual use than generic ranking pages suggest.",
  },
  {
    title: "Family economics matter",
    description:
      "A route that looks attractive for a single applicant can look different once spouse and dependants are included.",
  },
  {
    title: "Reputation and execution still matter",
    description:
      "Program positioning, provider quality, and due diligence readiness all shape the final experience.",
  },
]

const processSteps = [
  {
    icon: Compass,
    title: "1. Clarify the objective",
    description:
      "Start by defining whether you care most about value, family fit, reputation, or broader strategic optionality.",
  },
  {
    icon: Landmark,
    title: "2. Compare the right shortlist",
    description:
      "St. Kitts & Nevis, Dominica, Antigua & Barbuda, and Grenada often cover most serious Caribbean comparisons.",
  },
  {
    icon: Users,
    title: "3. Stress-test the household fit",
    description:
      "The comparison changes meaningfully once family structure, residence history, and documentation are included.",
  },
  {
    icon: ShieldCheck,
    title: "4. Move to provider review",
    description:
      "Only after the route appears suitable should the case move into licensed-provider review and formal due diligence.",
  },
]

const faqs = [
  {
    question: "Which Caribbean program is usually best?",
    answer:
      "There is no universal answer. St. Kitts & Nevis often leads on reputation, Dominica on practical value, Antigua & Barbuda on family fit, and Grenada on strategic use.",
  },
  {
    question: "Are the mobility differences huge between the programs?",
    answer:
      "Usually not. For many investors, the practical gap between the major Caribbean routes is smaller than the gap in marketing language around them.",
  },
  {
    question: "Should I decide mainly on cost?",
    answer:
      "Cost matters, but total family economics, documentation strength, and strategic fit often matter more than the lowest visible number.",
  },
  {
    question: "When should I request a consultation instead of comparing alone?",
    answer:
      "If you have a family case, a GCC residence structure, business ownership complexity, or real timing pressure, a private consultation is usually the better next step.",
  },
]

export default function CaribbeanComparisonPage() {
  const locale = getRequestLocale()
  const routes = getLocalizedRouteLinks(locale)

  return (
    <SiteShell>
      <LandingHero
        eyebrow="Caribbean comparison"
        title="A realistic comparison of the main Caribbean citizenship by investment routes."
        description="Most Caribbean programs are closer in practical value than marketing suggests. The stronger decision usually comes from understanding cost logic, family fit, positioning, and strategic use honestly."
        primaryAction={{ href: "#compare", label: "Compare the programs" }}
        secondaryAction={{ href: routes.bookConsultation, label: "Request a private consultation" }}
        stats={[
          { value: "Value", label: "compare real economics, not brochure snapshots" },
          { value: "Family fit", label: "household structure changes the answer quickly" },
          { value: "Positioning", label: "reputation still matters for some investors" },
        ]}
        highlights={[
          "Useful for investors narrowing a serious Caribbean shortlist.",
          "Built for profile-led decisions rather than generic rankings.",
          "Connected directly to consultation and deeper process pages.",
        ]}
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <TrustGrid items={trustItems} />
        </div>
      </section>

      <section id="compare" className="section-padding pt-0">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="Comparison matrix"
            title="The practical differences usually sit in fit, economics, and positioning."
            description="This is the comparison frame we would use in a first advisory conversation before a provider is introduced."
          />
          <LandingComparisonTable
            columns={[
              { key: "st-kitts", label: "St. Kitts & Nevis" },
              { key: "dominica", label: "Dominica" },
              { key: "antigua", label: "Antigua & Barbuda" },
              { key: "grenada", label: "Grenada" },
            ]}
            rows={[
              {
                factor: "Typical angle",
                values: [
                  "Premium and mature",
                  "Practical and efficient",
                  "Often family-led",
                  "Broader strategic use",
                ],
              },
              {
                factor: "Who often chooses it",
                values: [
                  "Reputation-conscious investors",
                  "Value-focused applicants",
                  "Households comparing total fit",
                  "Business owners and planners",
                ],
              },
              {
                factor: "Main trade-off",
                values: [
                  "Higher threshold",
                  "Less prestige differentiation",
                  "Needs careful family modeling",
                  "Not always the simplest answer",
                ],
              },
              {
                factor: "Best next question",
                values: [
                  "Is premium positioning worth the cost?",
                  "Does value outweigh brand optics?",
                  "How does this work for the whole family?",
                  "Do you need strategic optionality or just mobility?",
                ],
              },
            ]}
          />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow="How to use this page"
            title="A better comparison starts with the right shortlist and the right questions."
            description="Do not use this page to chase a winner. Use it to narrow the route that deserves a more serious consultation."
          />
          <ProcessSteps steps={processSteps} />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="What investors often miss"
            title="The strongest route is often the one that feels most coherent once your real profile is on the table."
            description="That means budget is only one part of the conversation. Family inclusion, residence history, business structure, and how much weight you place on program reputation all matter."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: BadgeCheck,
                title: "Do not buy on rankings alone",
                text: "Small differences in mobility rankings rarely explain the best decision by themselves.",
              },
              {
                icon: Users,
                title: "Family cases change the math",
                text: "A route that looks economical for one person can feel different with spouse and children.",
              },
              {
                icon: CircleDollarSign,
                title: "Headline cost is not total cost",
                text: "Due diligence, dependants, and file complexity all affect the real picture.",
              },
              {
                icon: ShieldCheck,
                title: "A clean file still matters",
                text: "Even the most suitable route can become difficult if the documentation story is weak.",
              },
            ].map((item) => (
              <Card key={item.title} className="section-card h-full">
                <CardContent className="space-y-4 p-6 md:p-7">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="size-6" />
                  </div>
                  <h3 className="text-xl leading-tight text-foreground">{item.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <span className="eyebrow">Need help deciding?</span>
            <h2 className="section-title max-w-xl text-foreground">Use a private review if the comparison already feels close.</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              This is especially useful if you are comparing routes for a family, a GCC-based residence situation, or a business-owner profile where the trade-offs are less obvious.
            </p>
            <LandingLinkGrid
              items={[
                {
                  title: "Broad pillar page",
                  description: "Go back to the authority page if you want a wider explanation before narrowing further.",
                  href: routes.programs,
                },
                {
                  title: "Book a private consultation",
                  description: "Move to a more direct conversation if the shortlist already feels meaningful.",
                  href: routes.bookConsultation,
                },
                {
                  title: "Explore insights",
                  description: "Continue reading if you want deeper guidance on cost, due diligence, or GCC-specific use cases.",
                  href: routes.insights,
                },
              ]}
            />
          </div>
          <LocalizedLandingLeadForm
            locale={locale}
            title="Request a comparison review"
            description="Tell us a little about your profile and we will help you understand which Caribbean route appears strongest before a provider conversation begins."
            submitLabel="Request a private consultation"
            sourceCategory="comparison"
            sourcePage="caribbean-cbi-comparison"
          />
        </div>
      </section>

      <LandingFaqSection
        eyebrow="FAQ"
        title="Questions investors usually ask once the shortlist gets real."
        description="These answers are meant to keep the comparison useful without forcing a false sense of certainty."
        items={faqs}
      />

      <LandingCtaSection
        eyebrow="Private consultation"
        title="Want help narrowing the shortlist without relying on generic rankings?"
        description="A private consultation is often the fastest way to turn a broad comparison into a realistic next step."
        primaryAction={{ href: routes.bookConsultation, label: "Request a private consultation" }}
        secondaryAction={{ href: routes.contact, label: "Contact the advisory team" }}
      />
    </SiteShell>
  )
}
