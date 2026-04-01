import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Compass, Globe2, ShieldCheck, Sparkles, Users } from "lucide-react"
import { LocalizedLandingLeadForm } from "@/components/forms/localized-landing-lead-form"
import { LandingCtaSection } from "@/components/landing/landing-cta-section"
import { LandingHero } from "@/components/landing/landing-hero"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getLocalizedRouteLinks } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()

  return buildPageMetadata({
    title: "Citizenship by Investment: Clearer Program Comparison for Serious Investors",
    description:
      "Compare citizenship by investment programs through a profile-led advisory lens: shortlist the right routes, understand the trade-offs, and move toward a more private next step with greater clarity.",
    path: localizeHref(locale, "/citizenship-by-investment"),
    keywords: [
      "citizenship by investment",
      "second citizenship advisory",
      "caribbean citizenship comparison",
      "citizenship by investment consultation",
    ],
    locale,
  })
}

const offerCards = [
  {
    title: "A faster shortlist",
    description:
      "Understand which routes deserve attention before you lose time speaking to the wrong providers or comparing every programme equally.",
  },
  {
    title: "Commercial reality, not brochure logic",
    description:
      "Compare cost structure, family fit, timing, and programme positioning rather than relying on generic rankings or sales-led lists.",
  },
  {
    title: "A cleaner next step",
    description:
      "Move from broad curiosity to a more private, considered conversation once the route itself begins to make sense.",
  },
]

const programs = [
  {
    country: "St. Kitts & Nevis",
    startingInvestment: "From US$250,000",
    keyBenefit: "Often chosen for premium programme positioning and a more established market profile.",
    timeline: "Official approvals are generally framed around roughly 120 to 180 days.",
  },
  {
    country: "Antigua & Barbuda",
    startingInvestment: "From US$230,000",
    keyBenefit: "Often attractive where family inclusion and total application economics matter more than headline prestige.",
    timeline: "The contribution path is straightforward, though the final pace still depends on file quality and approvals.",
  },
  {
    country: "Dominica",
    startingInvestment: "From US$200,000",
    keyBenefit: "Often shortlisted when investors want a simpler entry point and a direct route without overcomplicating the decision.",
    timeline: "Usually approached as a disciplined direct route rather than a speed-led purchase.",
  },
  {
    country: "Grenada",
    startingInvestment: "From US$235,000",
    keyBenefit: "Often considered when investors want a broader strategic angle alongside straightforward mobility planning.",
    timeline: "Official programme materials cite a processing rhythm of roughly three to four months.",
  },
]

const guidanceCards = [
  {
    title: "For direct mobility pressure",
    description:
      "If the main objective is a second citizenship outcome without a long residence period, the shortlist usually narrows quickly to the Caribbean routes.",
  },
  {
    title: "For family-led decision making",
    description:
      "If dependants, parents, or future education planning matter, total family economics often matter more than the lowest single-applicant number.",
  },
  {
    title: "For premium programme positioning",
    description:
      "Some investors care more about programme maturity, perceived strength, and long-term optics than simply reaching the lowest contribution threshold.",
  },
  {
    title: "For broader strategic optionality",
    description:
      "Business owners and globally mobile families often need more than a passport headline. The right route depends on the wider planning context around it.",
  },
]

const processItems = [
  {
    title: "1. Clarify the objective",
    description:
      "We start with the reason behind the enquiry: mobility, family planning, contingency, or a broader international structure.",
  },
  {
    title: "2. Narrow the shortlist",
    description:
      "The comparison becomes more useful once the unrealistic routes drop away and only the commercially coherent options remain.",
  },
  {
    title: "3. Move carefully",
    description:
      "Only once the route appears sensible should the case move toward a more formal introduction, due diligence, and document preparation.",
  },
]

const trustPoints = [
  {
    title: "Confidential first review",
    description: "The first conversation is shaped around fit and discretion, not pressure to apply.",
  },
  {
    title: "Compliance-aware from the start",
    description: "Due diligence, source of funds, and file readiness are treated as part of the decision itself.",
  },
  {
    title: "Structured introductions only where appropriate",
    description: "The aim is not to push a programme. It is to narrow towards the right next step.",
  },
]

export default function CitizenshipByInvestmentPage() {
  const locale = getRequestLocale()
  const routes = getLocalizedRouteLinks(locale)

  return (
    <SiteShell>
      <LandingHero
        eyebrow="Citizenship by investment"
        title="Compare the right citizenship route before you commit capital."
        description="This page is built for investors who want clarity before momentum: which programmes belong on a serious shortlist, where the real trade-offs sit, and when a private review becomes worthwhile."
        primaryAction={{ href: "#programs", label: "Review the core programmes" }}
        secondaryAction={{ href: routes.bookConsultation, label: "Request a private review" }}
        stats={[
          {
            value: "Shortlist clarity",
            label: "See which routes deserve attention before you speak to a provider.",
          },
          {
            value: "Profile-first guidance",
            label: "Compare family fit, timing, and structure instead of relying on generic rankings.",
          },
          {
            value: "Private next step",
            label: "Move into a confidential review once the shortlist begins to narrow.",
          },
        ]}
        highlightsLabel="Why serious investors use this page"
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <Card className="section-card border-0 shadow-none">
              <CardContent className="space-y-6 p-7 md:p-8 lg:p-9">
                <span className="eyebrow">Private advisory intake</span>
                <div className="space-y-3">
                  <h2 className="section-title max-w-[16ch]">
                    Request a more considered review once the shortlist starts to make sense.
                  </h2>
                  <p className="max-w-[34rem] text-base leading-8 text-muted-foreground">
                    This intake is designed for investors who want to move beyond general reading and into a calmer first conversation shaped around profile, timing, and route fit.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    "Useful once you have moved past general curiosity and want a more private next step.",
                    "Structured to clarify profile, residence, family scope, budget, and timing before a reply is arranged.",
                    "Reviewed discreetly so the next conversation starts from context instead of repeating the basics.",
                  ].map((item) => (
                    <div key={item} className="rounded-[22px] bg-background px-5 py-5">
                      <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <LocalizedLandingLeadForm
              locale={locale}
              title="Request a private consultation"
              description="Share the basics and we will help you understand which routes deserve a closer look before the conversation becomes more formal."
              submitLabel="Request a private consultation"
              sourceCategory="pillar"
              sourcePage="citizenship-by-investment"
            />
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="What this page offers"
            title="This is not a programme directory. It is a clearer way to reach a usable shortlist."
            description="The point is not to flood you with route names. It is to help you compare the programmes that may actually fit your profile, your family, and the kind of decision you are trying to make."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {offerCards.map((item) => (
              <Card key={item.title} className="section-card h-full border-0 shadow-none">
                <CardContent className="space-y-4 p-7 md:p-8">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-[1.3rem] leading-[1.18] text-foreground">{item.title}</h3>
                    <p className="fine-print">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="programs" className="section-padding">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="Programmes overview"
            title="The strongest shortlist is usually four or fewer realistic routes."
            description="Use this section to understand the practical starting point for the core Caribbean programmes. The real comparison is never just price. It is price, structure, reputation, family economics, and how the route fits the wider objective."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {programs.map((program) => (
              <Card key={program.country} className="section-card overflow-hidden border-0 shadow-none">
                <CardContent className="space-y-6 p-7 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="eyebrow w-fit border-border/70 bg-background text-foreground/70">
                        {program.startingInvestment}
                      </p>
                      <h3 className="text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-foreground">
                        {program.country}
                      </h3>
                    </div>
                    <Button asChild variant="ghost" className="h-10 rounded-full px-0 text-primary hover:bg-transparent hover:text-primary/85">
                      <Link href={routes.bookConsultation}>
                        Ask about this route
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Why it makes the shortlist
                      </p>
                      <p className="text-base leading-8 text-foreground/82">{program.keyBenefit}</p>
                    </div>
                    <div className="rounded-[22px] bg-primary/[0.045] px-5 py-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Timing view
                      </p>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{program.timeline}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <div className="hero-panel relative overflow-hidden px-7 py-8 sm:px-9 sm:py-10 md:px-12 md:py-11 lg:px-[4.5rem] lg:py-[4rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,187,131,0.12),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_34%)]" />
            <div className="relative space-y-10">
              <SectionHeading
                eyebrow="Decision guidance"
                title="Different investors usually need different programme logic."
                description="This is where the comparison becomes more useful. The best route depends on what you are optimizing for, not simply which programme appears cheapest in isolation."
                align="left"
                theme="dark"
              />

              <div className="grid gap-5 md:grid-cols-2">
                {guidanceCards.map((item, index) => {
                  const Icon = index % 2 === 0 ? Compass : index === 1 ? Users : index === 2 ? ShieldCheck : Globe2

                  return (
                    <div
                      key={item.title}
                      className="rounded-[24px] border border-white/10 bg-white/[0.05] px-6 py-6 shadow-[0_18px_48px_rgba(9,15,24,0.14)]"
                    >
                      <div className="space-y-4">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/[0.08] text-primary-foreground">
                          <Icon className="size-5" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-[1.25rem] leading-[1.18] text-primary-foreground">{item.title}</h3>
                          <p className="text-sm leading-7 text-primary-foreground/74">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
            <Card className="section-card border-0 shadow-none">
              <CardContent className="space-y-8 p-7 md:p-8 lg:p-9">
                <div className="space-y-3">
                  <span className="eyebrow">How the advisory works</span>
                  <h2 className="section-title max-w-[18ch]">A cleaner process usually leads to a stronger decision.</h2>
                  <p className="max-w-[38rem] text-base leading-8 text-muted-foreground">
                    The advisory layer exists to make the next step more coherent. It should make the shortlist tighter, the trade-offs clearer, and the formal process less reactive.
                  </p>
                </div>

                <div className="space-y-4">
                  {processItems.map((item) => (
                    <div key={item.title} className="rounded-[22px] bg-background px-5 py-5">
                      <h3 className="text-[1.08rem] font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="section-card border-0 shadow-none">
              <CardContent className="space-y-8 p-7 md:p-8 lg:p-9">
                <div className="space-y-3">
                  <span className="eyebrow">Trust and process</span>
                  <h2 className="section-title max-w-[17ch]">What a serious first review should feel like.</h2>
                  <p className="max-w-[34rem] text-base leading-8 text-muted-foreground">
                    Clear, private, and grounded in real eligibility and commercial logic. Not rushed. Not sales-heavy.
                  </p>
                </div>

                <div className="space-y-4">
                  {trustPoints.map((item) => (
                    <div key={item.title} className="flex items-start gap-4 rounded-[22px] bg-background px-5 py-5">
                      <div className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ShieldCheck className="size-5" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-[1.05rem] font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button asChild size="lg" className="rounded-full">
                  <Link href={routes.bookConsultation}>Move to a private consultation</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <LandingCtaSection
        eyebrow="Private consultation"
        title="Ready to narrow the shortlist around your own profile?"
        description="Use a private consultation when the question is no longer what citizenship by investment is, but which route actually deserves a closer look for your case."
        primaryAction={{ href: routes.bookConsultation, label: "Request a private consultation" }}
        secondaryAction={{ href: routes.contact, label: "Send a written enquiry" }}
      />
    </SiteShell>
  )
}
