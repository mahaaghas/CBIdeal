import type { Metadata } from "next"
import { LockKeyhole, MessageSquareQuote, ShieldCheck, TimerReset } from "lucide-react"
import { CalendlyInlineEmbed } from "@/components/calendly-inline-embed"
import { LocalizedLandingLeadForm } from "@/components/forms/localized-landing-lead-form"
import { LandingCtaSection } from "@/components/landing/landing-cta-section"
import { LandingFaqSection } from "@/components/landing/landing-faq-section"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingLinkGrid } from "@/components/landing/landing-link-grid"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { TrustGrid } from "@/components/trust-grid"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getLocalizedRouteLinks, schedulerConfig } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()

  return buildPageMetadata({
    title: "Book a CBI Consultation: Private, Structured, and Realistic",
    description:
      "Request a private citizenship by investment consultation to review route fit, family planning, documentation readiness, and realistic next steps.",
    path: localizeHref(locale, "/book-a-cbi-consultation"),
    keywords: [
      "citizenship by investment consultation",
      "private cbi consultation",
      "second citizenship advisory call",
    ],
    locale,
  })
}

const trustItems = [
  {
    title: "Confidential by default",
    description:
      "The consultation is designed for private, high-trust conversations where family and documentation issues can be discussed realistically.",
  },
  {
    title: "No guaranteed-outcome language",
    description:
      "The purpose of the call is to improve clarity, not to create false certainty around eligibility or approval.",
  },
  {
    title: "Useful for complex profiles",
    description:
      "Family structures, GCC residence histories, and business-owner cases usually benefit from a more tailored conversation.",
  },
  {
    title: "Built to lead somewhere practical",
    description:
      "If the fit is real, the next step is a licensed-provider introduction or a cleaner route shortlist.",
  },
]

const faqs = [
  {
    question: "What does the consultation usually cover?",
    answer:
      "The conversation usually covers route fit, timing, family implications, budget framing, documentation readiness, and whether a licensed-provider introduction makes sense.",
  },
  {
    question: "Is this a sales call?",
    answer:
      "The goal is advisory clarity first. If the fit is real, commercial next steps can follow in a more structured way.",
  },
  {
    question: "Should I submit the form or book the meeting link?",
    answer:
      "If you want written context reviewed first, use the form. If you are ready for a scheduled conversation, use the booking link. Some people do both.",
  },
  {
    question: "Can this help if I am still early in the process?",
    answer:
      "Yes, especially if you want to avoid spending time on the wrong route or relying on generic internet comparisons.",
  },
]

export default function BookConsultationPage() {
  const locale = getRequestLocale()
  const routes = getLocalizedRouteLinks(locale)

  return (
    <SiteShell>
      <LandingHero
        eyebrow="Private consultation"
        title="Book a citizenship by investment consultation built around your real profile."
        description="If you are comparing routes seriously, the best next step is often a private conversation that clarifies fit, timing, family implications, and whether your case is ready for a licensed-provider introduction."
        primaryAction={{ href: "#consultation-form", label: "Request a private consultation" }}
        secondaryAction={{ href: routes.programs, label: "Review investor options" }}
        stats={[
          { value: "Private", label: "handled discreetly from the first interaction" },
          { value: "Structured", label: "focused on fit, not generic selling" },
          { value: "Practical", label: "designed to lead to a clear next step" },
        ]}
        aside={
          <LocalizedLandingLeadForm
            locale={locale}
            title="Request a private consultation"
            description="Share the essentials below so the first conversation starts with enough context to be useful."
            submitLabel="Request a private consultation"
            sourceCategory="consultation"
            sourcePage="book-a-cbi-consultation"
          />
        }
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <TrustGrid items={trustItems} />
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-shell grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: MessageSquareQuote,
              title: "Route fit",
              text: "Which citizenship or residency route appears most relevant once the real profile is clear.",
            },
            {
              icon: TimerReset,
              title: "Timing pressure",
              text: "Whether urgency is real, manageable, or being overstated by the wider market conversation.",
            },
            {
              icon: ShieldCheck,
              title: "Due diligence readiness",
              text: "Where the documentation story looks strong and where it may need more discipline first.",
            },
            {
              icon: LockKeyhole,
              title: "Confidential next steps",
              text: "Whether the enquiry should move toward provider review, further comparison, or a pause for preparation.",
            },
          ].map((item) => (
            <Card key={item.title} className="section-card h-full">
              <CardContent className="space-y-4 p-6 md:p-7">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="size-6" />
                </div>
                <h2 className="text-xl leading-tight text-foreground">{item.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="consultation-form" className="section-padding">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow="Choose a time directly"
            title="Select a suitable consultation slot in a cleaner, more direct format."
            description="If you are ready for a scheduled conversation, use the live booking calendar below to choose a convenient time without leaving the advisory flow."
          />
          <div className="section-card overflow-hidden p-5 md:p-8">
            <div className="mx-auto max-w-[42rem] space-y-4 pb-6 md:pb-8">
              <h3 className="card-title text-foreground">Book a private consultation</h3>
              <p className="text-base leading-8 text-muted-foreground">
                Choose a suitable time for a short, structured discussion about route fit, timing, and the most realistic next step for your profile.
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                Your booking is private, there is no obligation to proceed, and the call is intended to clarify options before any formal provider introduction.
              </p>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-border/70 bg-background/70 p-2 md:p-3">
              <CalendlyInlineEmbed url={schedulerConfig.bookingUrl} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Useful before the call"
            title="If you want to prepare more before booking, start with the pages below."
            description="These pages usually help visitors arrive at the consultation with better questions and more realistic expectations."
          />
          <LandingLinkGrid
            items={[
              {
                title: "Citizenship by investment pillar page",
                description: "Use the main investor page if you want the broader framework first.",
                href: routes.programs,
              },
              {
                title: "Caribbean CBI comparison",
                description: "Use the comparison page if you are already narrowing a practical shortlist.",
                href: routes.caribbeanComparison,
              },
              {
                title: "Insights hub",
                description: "Use the insights hub if you want deeper thinking on cost, due diligence, and GCC-specific issues.",
                href: routes.insights,
              },
            ]}
          />
        </div>
      </section>

      <LandingFaqSection
        eyebrow="FAQ"
        title="Common questions before booking a private consultation."
        description="These answers are meant to keep the process calm, clear, and grounded in realistic expectations."
        items={faqs}
      />

      <LandingCtaSection
        eyebrow="Need a lighter first step?"
        title="If you prefer not to schedule yet, you can still submit your profile privately."
        description="Use the contact page if you want a softer written start before moving into a scheduled consultation."
        primaryAction={{ href: routes.contact, label: "Contact the advisory team" }}
        secondaryAction={{ href: routes.programs, label: "Back to investor overview" }}
      />
    </SiteShell>
  )
}
