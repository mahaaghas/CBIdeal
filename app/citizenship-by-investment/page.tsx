import type { Metadata } from "next"
import { BadgeCheck, CheckCircle2, Globe2, Shield, Users } from "lucide-react"
import { CtaPanel } from "@/components/cta-panel"
import { FaqList } from "@/components/faq-list"
import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { PageHero } from "@/components/page-hero"
import { ProcessSteps } from "@/components/process-steps"
import { ProgramGrid } from "@/components/program-grid"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { TrustGrid } from "@/components/trust-grid"
import { LandingPageRenderer } from "@/components/cms/landing-page-renderer"
import { buildPageMetadata } from "@/lib/metadata"
import { siteImages } from "@/lib/site-images"
import { routeLinks } from "@/lib/site"
import { getLandingPageBySlug, getResolvedSiteSettings } from "@/lib/sanity/content"

export async function generateMetadata(): Promise<Metadata> {
  const [cmsPage, settings] = await Promise.all([
    getLandingPageBySlug("citizenship-by-investment"),
    getResolvedSiteSettings(),
  ])

  if (cmsPage?.seo) {
    return buildPageMetadata({
      title: cmsPage.seo.title || cmsPage.title,
      description: cmsPage.seo.description || settings.siteDescription,
      path: "/citizenship-by-investment",
      keywords: cmsPage.seo.keywords ?? [
        "citizenship by investment programs",
        "residency by investment advisory",
        "second passport options",
      ],
      image: cmsPage.seo.openGraphImage?.url,
      openGraphTitle: cmsPage.seo.openGraphTitle,
      openGraphDescription: cmsPage.seo.openGraphDescription,
      noIndex: cmsPage.seo.noIndex,
      siteName: settings.siteName,
      siteUrl: settings.siteUrl,
    })
  }

  return buildPageMetadata({
    title: "Citizenship by Investment Options",
    description:
      "Review citizenship-by-investment and residency-by-investment pathways, qualify your profile, and connect with a provider suited to your budget, timing, and goals.",
    path: "/citizenship-by-investment",
    keywords: [
      "citizenship by investment programs",
      "residency by investment advisory",
      "second passport options",
    ],
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
  })
}

const trustItems = [
  {
    title: "Confidential screening",
    description: "Every enquiry is framed around eligibility, documentation readiness, and commercial fit before a provider conversation begins.",
  },
  {
    title: "Family-first planning",
    description: "We assess principal applicants, dependants, timing pressure, and multi-jurisdiction goals together rather than in isolation.",
  },
  {
    title: "Jurisdiction comparison",
    description: "The process is structured to help clients compare mobility, due diligence, family fit, and execution complexity across programs.",
  },
  {
    title: "Provider matching",
    description: "The goal is to connect each enquiry with a relevant provider that can make a serious, best-fit offer.",
  },
]

const pathways = [
  {
    title: "Caribbean citizenship routes",
    description: "Suitable for applicants prioritizing speed, mobility, and family inclusion through established donation or approved investment pathways.",
    image: siteImages.petitPiton.src,
    alt: siteImages.petitPiton.alt,
  },
  {
    title: "Southern Europe residency routes",
    description: "Designed for families who value optional relocation, real estate strategy, and long-term access planning across European markets.",
    image: siteImages.coimbra.src,
    alt: siteImages.coimbra.alt,
  },
  {
    title: "Mediterranean residence and settlement planning",
    description: "Useful where clients need flexibility around lifestyle assets, tax conversations, or regional operating presence.",
    image: siteImages.budapest.src,
    alt: siteImages.budapest.alt,
  },
]

const process = [
  {
    icon: Shield,
    title: "1. Suitability review",
    description: "We begin with nationality, family structure, budget, timeline, and any immediate red flags that could affect program fit.",
  },
  {
    icon: Globe2,
    title: "2. Provider matching",
    description: "We narrow the route to suitable programs and pass the enquiry to a provider that fits the commercial and geographic context.",
  },
  {
    icon: Users,
    title: "3. Offer and next steps",
    description: "A matched provider follows up with the best-fit offer and the next steps for your case.",
  },
]

const faqs = [
  {
    question: "What happens after I submit the qualification form?",
    answer:
      "A provider will review your details and contact you with the best available offer for your profile. You will also receive a submission reference after the form is sent.",
  },
  {
    question: "Is this page only for citizenship by investment?",
    answer:
      "No. The page is positioned for both citizenship by investment and residency by investment conversations, with the form capturing the distinction clearly.",
  },
  {
    question: "Do you guarantee eligibility before review?",
    answer:
      "No. The messaging is intentionally built around qualification and provider matching rather than guarantees. Final advice always depends on the applicant profile and the program rules in force.",
  },
]

export default async function CitizenshipByInvestmentPage() {
  const cmsPage = await getLandingPageBySlug("citizenship-by-investment")

  if (cmsPage) {
    return (
      <SiteShell>
        <LandingPageRenderer page={cmsPage} />
      </SiteShell>
    )
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Citizenship and residency options"
        title="Get matched with the best citizenship or residency offer for your profile."
        description="We focus on profile fit, budget, and provider matching so a suitable firm can come back with the right offer."
        primaryAction={{ href: "#qualification", label: "Check your fit" }}
        secondaryAction={{ href: routeLinks.forCompanies, label: "For agencies and companies" }}
        stats={[
          { value: "Provider match", label: "based on profile and goals" },
          { value: "Warm demand", label: "qualified before handoff" },
          { value: "Private review", label: "handled with discretion" },
        ]}
      >
        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white/10 bg-black/10 p-5 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70">What you can expect</p>
            <div className="mt-4 space-y-4">
              {[
                "Clear positioning for citizenship and residency by investment.",
                "A qualification flow that filters for fit before provider contact.",
                "A more private, trust-oriented first step for high-value enquiries.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 text-secondary" />
                  <p className="text-sm leading-7 text-primary-foreground/75">{item}</p>
                </div>
              ))}
            </div>
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
            eyebrow="Program framing"
            title="Positioned around pathways, not generic brochure content."
            description="The copy stays useful without relying on unstable legal thresholds. It signals seriousness while leaving room for market-specific updates later."
          />
          <ProgramGrid items={pathways} />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Process"
            title="A better first conversation starts with cleaner qualification."
            description="The process moves from website enquiry to provider handoff in a way that feels clear, selective, and easier to trust."
          />
          <ProcessSteps steps={process} />
        </div>
      </section>

      <section id="qualification" className="section-padding">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <span className="eyebrow">Lead qualification</span>
            <h2 className="section-title max-w-xl text-foreground">Request a private assessment.</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Use this form to screen citizenship or residency options, flag family-specific considerations, and surface urgency before a provider is introduced.
            </p>
            <div className="space-y-4">
              {[
                "Captures the details advisers need for a more productive first review.",
                "Balances strong qualification with a calm, premium user experience.",
                "Structured for secure routing and a consistent follow-up process.",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 size-5 text-primary" />
                  <p className="fine-print">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <LeadQualificationForm
            formType="investor"
            title="Start your qualification"
            description="Share enough context for a productive first review."
            submitLabel="Request assessment"
            source="citizenship"
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions from investor-side enquiries."
            description="The answers keep expectations grounded and reinforce the site's trust-building tone."
          />
          <FaqList items={faqs} />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow="Also relevant"
            title="If you operate an immigration firm, the company overview explains the CRM and lead side."
            description="Use the company overview to explore the CRM, guided demo, pricing, and qualified lead partnership offer."
            primaryAction={{ href: routeLinks.forCompanies, label: "View company overview" }}
            secondaryAction={{ href: routeLinks.partners, label: "Explore partnerships" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
