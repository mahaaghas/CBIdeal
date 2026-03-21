import type { Metadata } from "next"
import { CtaPanel } from "@/components/cta-panel"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { Card, CardContent } from "@/components/ui/card"
import { buildPageMetadata } from "@/lib/metadata"
import { ctaLinks, routeLinks } from "@/lib/site"

export const metadata: Metadata = buildPageMetadata({
  title: "Data Protection and Confidentiality",
  description:
    "Read how investor enquiries and company CRM information are handled with confidentiality, structured access, and a privacy-aware approach.",
  path: "/data-protection",
  keywords: [
    "data protection immigration CRM",
    "confidential investor enquiries",
    "privacy immigration firm software",
  ],
})

const sections = [
  {
    title: "Confidential investor enquiries",
    body: "Investor submissions are intended to be reviewed only for qualification, provider matching, and appropriate follow-up. The goal is to keep sensitive immigration interest handled with care and relevance.",
  },
  {
    title: "Responsible company data handling",
    body: "Company and CRM enquiries are positioned around controlled internal use, structured access, and workflow clarity. The website language is designed to reassure buyers that client information should not be handled casually.",
  },
  {
    title: "Limited use of submitted information",
    body: "Submitted details are used to review requests, coordinate follow-up, and route enquiries to the relevant internal team or matched provider. Access is kept limited to the people involved in handling the request responsibly.",
  },
  {
    title: "Questions and data concerns",
    body: "Users and partner companies should have a clear way to raise privacy or data concerns. This page keeps that communication path visible until final legal text and operating entity details are signed off.",
  },
]

export default function DataProtectionPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Data protection"
        title="Confidentiality and responsible data handling matter on both sides of the business."
        description="This gives investors and companies a clean, credible explanation of how submitted information is handled, without unnecessary legal jargon."
        primaryAction={{ href: ctaLinks.privacyContact, label: "Contact us about privacy" }}
        secondaryAction={{ href: routeLinks.forCompanies, label: "Back to company overview" }}
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Overview"
            title="A privacy-aware approach to investor and company information."
            description="This is a concise, trust-building explanation of how the business handles confidential enquiries and CRM-related data."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {sections.map((section) => (
              <Card key={section.title} className="section-card">
                <CardContent className="space-y-4 p-8">
                  <h3 className="text-2xl text-foreground">{section.title}</h3>
                  <p className="text-base leading-8 text-muted-foreground">{section.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow="Next step"
            title="Need to discuss privacy, CRM rollout, or investor lead handling in more detail?"
            description="Use contact for privacy questions, company enquiries, or investor requests that require a direct conversation."
            primaryAction={{ href: ctaLinks.privacyContact, label: "Go to contact" }}
            secondaryAction={{ href: ctaLinks.returnHome, label: "Return home" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
