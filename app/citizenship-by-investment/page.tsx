import type { Metadata } from "next"
import { BadgeCheck, CircleDollarSign, Compass, FileCheck2, Globe2, ShieldCheck, Users } from "lucide-react"
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
    title: "Citizenship by Investment: A Structured Advisory Route for Global Investors",
    description:
      "Understand citizenship by investment from a realistic advisory perspective, including who it suits, what to compare, how the process works, and when to request a private consultation.",
    path: localizeHref(locale, "/citizenship-by-investment"),
    keywords: [
      "citizenship by investment",
      "second citizenship advisory",
      "citizenship by investment consultation",
      "caribbean citizenship programs",
    ],
    locale,
  })
}

const trustItems = [
  {
    title: "Confidential first review",
    description:
      "Every enquiry is framed around profile fit, documentation readiness, and realistic next steps before a provider is introduced.",
  },
  {
    title: "Designed for real decision-making",
    description:
      "We help clients compare suitability, family fit, and trade-offs rather than pushing one route on every profile.",
  },
  {
    title: "Licensed-provider introductions",
    description:
      "Our role is to qualify and structure the enquiry before it reaches a licensed provider or authorized partner.",
  },
  {
    title: "Compliance-aware from the start",
    description:
      "Due diligence, AML, KYC, and source-of-funds readiness are treated as core parts of the process, not fine print.",
  },
]

const processSteps = [
  {
    icon: Compass,
    title: "1. Private qualification",
    description:
      "We review your citizenship, residence, budget, family structure, and what you are actually trying to solve.",
  },
  {
    icon: Globe2,
    title: "2. Route comparison",
    description:
      "We narrow the conversation to the programs that appear commercially and practically relevant to your profile.",
  },
  {
    icon: FileCheck2,
    title: "3. Provider handoff",
    description:
      "A licensed provider or authorized partner reviews the case and outlines the formal next steps if the fit is real.",
  },
  {
    icon: ShieldCheck,
    title: "4. Due diligence and application",
    description:
      "Formal review, document collection, and application handling proceed only through official program structures.",
  },
]

const faqs = [
  {
    question: "Who usually explores citizenship by investment seriously?",
    answer:
      "Most serious applicants are planning for mobility, family optionality, business continuity, or long-term flexibility rather than simply chasing a passport ranking.",
  },
  {
    question: "Do you guarantee that a route will be suitable?",
    answer:
      "No. The purpose of qualification is to test fit before expectations become unrealistic. Final suitability depends on your profile, documentation, and the rules of the official program involved.",
  },
  {
    question: "Is this only relevant for Caribbean programs?",
    answer:
      "No. This pillar page is designed to explain citizenship by investment broadly, while related comparison pages help narrow the Caribbean shortlist or compare citizenship with residency routes.",
  },
  {
    question: "What happens after I submit the form?",
    answer:
      "Your enquiry is reviewed privately and, where appropriate, matched to a licensed provider or authorized partner for a more formal conversation.",
  },
]

export default function CitizenshipByInvestmentPage() {
  const locale = getRequestLocale()
  const routes = getLocalizedRouteLinks(locale)

  return (
    <SiteShell>
      <LandingHero
        eyebrow="Citizenship by investment"
        title="Citizenship by investment for investors who want a clearer, more structured route."
        description="We help qualified clients compare official citizenship by investment programs, understand the trade-offs honestly, and speak with licensed providers that fit the profile."
        primaryAction={{ href: "#qualification", label: "See your best-fit route" }}
        secondaryAction={{ href: routes.bookConsultation, label: "Request a private consultation" }}
        stats={[
          { value: "Private review", label: "handled discreetly from the first step" },
          { value: "Profile-led", label: "built around fit, not generic rankings" },
          { value: "Provider match", label: "qualified before any introduction" },
        ]}
        highlightsLabel="Why investors use this page"
        aside={
          <LocalizedLandingLeadForm
            locale={locale}
            title="Start your qualification"
            description="Share the essentials and we will help you understand which route appears most suitable before a provider conversation begins."
            submitLabel="See your best-fit option"
            sourceCategory="pillar"
            sourcePage="citizenship-by-investment"
          />
        }
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <TrustGrid items={trustItems} />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="What this route is really for"
            title="A second citizenship can be valuable, but only when the objective is clear."
            description="The strongest cases usually begin with a practical goal: smoother travel, family planning, contingency options, or long-term international flexibility."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Globe2,
                title: "Mobility",
                text: "Useful where travel friction affects business, family movement, or international planning.",
              },
              {
                icon: Users,
                title: "Family optionality",
                text: "Relevant for households planning for children, dependants, or future relocation choices.",
              },
              {
                icon: CircleDollarSign,
                title: "Long-term planning",
                text: "Best understood as part of a wider private planning conversation rather than a quick purchase.",
              },
              {
                icon: BadgeCheck,
                title: "Structured execution",
                text: "The right route depends on documentation quality, due diligence readiness, and provider fit.",
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

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow="How the process works"
            title="A serious first conversation starts with cleaner qualification."
            description="This route is designed to move from enquiry to provider handoff in a way that feels selective, structured, and easier to trust."
          />
          <ProcessSteps steps={processSteps} />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="Shortlist logic"
            title="Most investors are comparing a few practical route types, not dozens of completely different outcomes."
            description="The strongest comparison is usually not about tiny ranking differences. It is about fit: cost structure, family inclusion, reputation, and strategic use."
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
                factor: "General positioning",
                values: [
                  "Premium and reputation-led",
                  "Practical and value-conscious",
                  "Often strong for family-led cases",
                  "More strategic and longer-horizon",
                ],
              },
              {
                factor: "Who it often suits",
                values: [
                  "Investors prioritizing maturity and optics",
                  "Applicants focused on cleaner economics",
                  "Households comparing total family fit",
                  "Business owners and broader planners",
                ],
              },
              {
                factor: "What to compare carefully",
                values: [
                  "Higher threshold vs perceived program strength",
                  "Value vs long-term positioning",
                  "Family economics and practical obligations",
                  "Strategy fit rather than simple rankings",
                ],
              },
            ]}
          />
        </div>
      </section>

      <section id="qualification" className="section-padding pt-0">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="Where to go next"
            title="Choose the next page based on the kind of decision you are making."
            description="Some visitors need a broad comparison, others need a private consultation. This system is meant to support both without forcing a rushed decision."
          />
          <LandingLinkGrid
            items={[
              {
                title: "Compare the main Caribbean routes",
                description:
                  "Use the comparison page if you want to understand how the principal Caribbean options differ in practice.",
                href: routes.caribbeanComparison,
              },
              {
                title: "Book a private consultation",
                description:
                  "Use the consultation page if you already have a profile, timing pressure, or a family-specific question.",
                href: routes.bookConsultation,
              },
              {
                title: "Read deeper advisory content",
                description:
                  "Use the insights hub if you are still working through trade-offs, due diligence, or region-specific questions.",
                href: routes.insights,
              },
            ]}
          />
        </div>
      </section>

      <LandingFaqSection
        eyebrow="FAQ"
        title="Common questions from investor-side enquiries."
        description="These answers keep expectations realistic while helping serious enquirers understand what the process is designed to do."
        items={faqs}
      />

      <LandingCtaSection
        eyebrow="Private consultation"
        title="Ready to discuss your case in a more structured setting?"
        description="Request a private consultation if you want to move from broad research into a profile-led conversation with realistic next steps."
        primaryAction={{ href: routes.bookConsultation, label: "Request a private consultation" }}
        secondaryAction={{ href: routes.contact, label: "Contact the advisory team" }}
      />
    </SiteShell>
  )
}
