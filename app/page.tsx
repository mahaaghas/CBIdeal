import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Globe2, HandCoins, ShieldCheck } from "lucide-react"
import { CtaPanel } from "@/components/cta-panel"
import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { PageHero } from "@/components/page-hero"
import { ProcessSteps } from "@/components/process-steps"
import { ProgramGrid } from "@/components/program-grid"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { TrustGrid } from "@/components/trust-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LandingPageRenderer } from "@/components/cms/landing-page-renderer"
import { buildPageMetadata } from "@/lib/metadata"
import { siteImages } from "@/lib/site-images"
import { ctaLinks, routeLinks } from "@/lib/site"
import { getHomepageLandingPage, getResolvedSiteSettings } from "@/lib/sanity/content"

export async function generateMetadata(): Promise<Metadata> {
  const [cmsPage, settings] = await Promise.all([getHomepageLandingPage(), getResolvedSiteSettings()])

  if (cmsPage?.seo) {
    return buildPageMetadata({
      title: cmsPage.seo.title || cmsPage.title,
      description: cmsPage.seo.description || settings.siteDescription,
      path: "/",
      keywords: cmsPage.seo.keywords ?? [
        "citizenship by investment offers",
        "residency by investment options",
        "second passport advisory",
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
    title: "Citizenship by Investment and Residency by Investment",
    description:
      "Compare trusted citizenship-by-investment and residency-by-investment options, qualify your profile, and receive a best-fit offer from a suitable provider.",
    path: "/",
    keywords: [
      "citizenship by investment offers",
      "residency by investment options",
      "second passport advisory",
    ],
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
  })
}

const trustItems = [
  {
    title: "We compare trusted providers",
    description: "We help filter the market so you are not spending time with firms that do not match your profile, budget, or destination goals.",
  },
  {
    title: "We qualify before we connect",
    description: "The intake flow captures your citizenship, residence, family scope, timeframe, and budget before a provider reaches out.",
  },
  {
    title: "We focus on best-fit offers",
    description: "The goal is not generic brochure advice. It is to connect you with a provider that can make a serious, relevant offer.",
  },
  {
    title: "We keep the process clear",
    description: "You get a cleaner, more selective first step that feels discreet, premium, and easier to trust for a high-value decision.",
  },
]

const howItWorks = [
  {
    icon: Globe2,
    title: "Submit your profile",
    description: "Share your citizenship, current residence, budget, timeline, and whether the enquiry is for you alone or your family.",
  },
  {
    icon: ShieldCheck,
    title: "We review your fit",
    description: "We screen your requirements and remove bad-fit options before passing your enquiry to a suitable provider.",
  },
  {
    icon: HandCoins,
    title: "A provider contacts you",
    description: "A matched provider comes back with the best-fit offer and next-step guidance for your case.",
  },
]

const programs = [
  {
    title: "Caribbean citizenship by investment",
    description: "For applicants prioritizing speed, mobility, and efficient family inclusion through established CBI programs.",
    image: siteImages.stLuciaAerial.src,
    alt: siteImages.stLuciaAerial.alt,
  },
  {
    title: "European residency by investment",
    description: "For families seeking long-term flexibility, optional relocation, and structured access into European markets.",
    image: siteImages.coimbra.src,
    alt: siteImages.coimbra.alt,
  },
  {
    title: "Fast-track and family-led cases",
    description: "For cases where timing, dependants, or multi-jurisdiction planning matter as much as the headline program itself.",
    image: siteImages.ghent.src,
    alt: siteImages.ghent.alt,
  },
]

export default async function HomePage() {
  const cmsPage = await getHomepageLandingPage()

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
        eyebrow="Citizenship and residency by investment"
        title="Find the best citizenship-by-investment offer for your profile."
        description="We help you compare trusted providers, filter bad-fit options, and get the best available offer in the market based on your goals, budget, and timeline."
        primaryAction={{ href: ctaLinks.checkEligibility, label: "Check your eligibility" }}
        secondaryAction={{ href: routeLinks.programs, label: "Explore programs" }}
        stats={[
          { value: "Qualified profile", label: "reviewed before provider contact" },
          { value: "Best-fit offers", label: "matched to profile and budget" },
          { value: "Trusted providers", label: "selected for relevance and fit" },
        ]}
      >
        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70">What happens next</p>
            <div className="mt-4 space-y-4">
              {[
                "You submit a short qualification profile.",
                "We review the case against budget, timing, and destination preferences.",
                "A suitable provider contacts you with the best available offer.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-5 text-secondary" />
                  <p className="text-sm leading-7 text-primary-foreground/80">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-secondary/30 bg-background/95 p-5 text-foreground shadow-[0_20px_60px_rgba(19,24,38,0.16)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Are you a company?</p>
            <h3 className="card-title mt-2 text-foreground">Passport company or immigration firm?</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Explore the CRM, pricing, guided demo, and qualified lead partnership offer.
            </p>
            <Button asChild className="mt-4 w-full sm:w-auto">
              <Link href={routeLinks.forCompanies}>
                Explore CRM and lead partnerships
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </PageHero>

      <section id="eligibility" className="section-padding pt-0">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <span className="eyebrow">Qualification form</span>
            <h2 className="section-title max-w-xl text-foreground">Tell us what you need and let the right provider come back to you.</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Share your profile, budget, and goals in a format that helps the right provider respond with a serious, relevant offer.
            </p>
            <div className="space-y-4">
              {[
                "Country of citizenship and current residence help filter realistic pathways.",
                "Budget and timeframe help providers return a serious, relevant offer faster.",
                "Family scope and program preference help avoid bad-fit conversations from the start.",
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
            title="Get the best offer"
            description="Complete the qualification form and a provider will contact you with the best-fit option."
            source="homepage-investor"
          />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Why work with us"
            title="We help investors save time and avoid bad-fit options."
            description="The experience stays focused on comparison, matching, and provider access rather than exaggerated promises. That is what makes it feel trustworthy."
          />
          <TrustGrid items={trustItems} />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell">
          <SectionHeading
            eyebrow="How it works"
            title="A simple process built for high-value, profile-based decisions."
            description="Move from first enquiry to provider handoff without unnecessary friction or sales noise."
          />
          <ProcessSteps steps={howItWorks} />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Programs and opportunities"
            title="Programs we regularly help clients compare."
            description="The current mix covers the most common routes while leaving room for dedicated destination pages as the domain grows."
          />
          <ProgramGrid items={programs} />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="section-card overflow-hidden p-0">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative min-h-[320px]">
                <Image src={siteImages.familyWaterfront.src} alt={siteImages.familyWaterfront.alt} fill className="object-cover" />
              </div>
              <CardContent className="space-y-5 p-8">
                <span className="eyebrow">Trust and discretion</span>
                <h3 className="card-title text-foreground">A cleaner way to approach citizenship and residency planning.</h3>
                <p className="text-base leading-8 text-muted-foreground">
                  High-value immigration decisions require discretion, clear qualification, and a serious tone. The restrained visual language helps the experience feel credible to both investors and partner firms.
                </p>
                <Button variant="outline" asChild>
                  <Link href={ctaLinks.speakToTeam}>Speak to our team</Link>
                </Button>
              </CardContent>
            </div>
          </Card>

          <Card className="section-card overflow-hidden p-0">
            <div className="relative min-h-[320px]">
              <Image src={siteImages.budapest.src} alt={siteImages.budapest.alt} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
            </div>
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow">For companies</span>
              <h3 className="card-title text-foreground">We also help passport companies and immigration firms grow.</h3>
              <p className="fine-print">
                If you run a passport company, immigration firm, or advisory desk, we offer a dedicated CRM experience, guided demo path, pricing, and qualified lead partnership flow under the same domain.
              </p>
              <Button asChild>
                <Link href={routeLinks.forCompanies}>
                  Visit the company overview
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow="Final step"
            title="Ready to see what the market can offer for your case?"
            description="Submit your qualification details and we will route your enquiry to a provider that matches your profile, budget, and destination goals."
            primaryAction={{ href: ctaLinks.checkEligibility, label: "Get best offer" }}
            secondaryAction={{ href: routeLinks.forCompanies, label: "Company? Start here" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
