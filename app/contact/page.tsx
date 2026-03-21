import type { Metadata } from "next"
import Image from "next/image"
import { MessageSquareText, PhoneCall, ShieldCheck } from "lucide-react"
import { ContactInquiryTabs } from "@/components/contact-inquiry-tabs"
import { CtaPanel } from "@/components/cta-panel"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { ctaLinks } from "@/lib/site"
import { Card, CardContent } from "@/components/ui/card"
import { buildPageMetadata } from "@/lib/metadata"
import { getResolvedSiteSettings } from "@/lib/sanity/content"

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Investors and Partner Firms",
  description:
    "Contact CBI Deal for investor enquiries, CRM questions, guided demos, pricing discussions, or qualified lead partnerships in one premium contact experience.",
  path: "/contact",
  keywords: [
    "citizenship by investment contact",
    "immigration CRM contact",
    "passport company demo request",
  ],
})

interface ContactPageProps {
  searchParams?: Promise<{ intent?: string }>
}

const faqs = [
  {
    title: "Investor enquiries",
    body: "If you are looking for citizenship or residency by investment, use the investor form so we can qualify you by profile, family scope, budget, and timing.",
  },
  {
    title: "Company enquiries",
    body: "If you run a passport company, immigration firm, or advisory desk, use the company form for CRM, qualified leads, pricing, or demo questions.",
  },
  {
    title: "Privacy and confidentiality",
    body: "If your enquiry is sensitive, mention that in the notes and we will keep the follow-up route more controlled and direct.",
  },
]

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const defaultValue = resolvedSearchParams?.intent === "demo" ? "company" : "investor"
  const settings = await getResolvedSiteSettings()

  return (
    <SiteShell>
      <PageHero
        eyebrow="Contact"
        title="A direct contact point for investors and partner companies."
        description="Whether you are an investor looking for the right offer or a company exploring the CRM and qualified leads, the conversation stays clear, warm, and privacy-aware."
        primaryAction={{ href: "#contact-form", label: "Open contact form" }}
        secondaryAction={{ href: ctaLinks.viewDataProtection, label: "View data protection" }}
        stats={[
          { value: settings.salesEmail, label: "company email" },
          { value: settings.phone, label: "direct phone" },
          { value: settings.whatsapp, label: "WhatsApp" },
        ]}
      />

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="section-card overflow-hidden p-0">
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative min-h-[300px]">
                <Image src="/people-bg.png" alt="Professional consultation setting" fill className="object-cover" />
              </div>
              <CardContent className="space-y-5 p-8">
                <span className="eyebrow">Reach the right team</span>
                <h3 className="text-3xl text-foreground">Use one contact flow for both sides of the business.</h3>
                <p className="text-base leading-8 text-muted-foreground">
                  Investors and firms often need different conversations. This layout keeps them separate without fragmenting the brand or forcing anyone through the wrong form.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MessageSquareText className="mt-1 size-5 text-primary" />
                    <p className="fine-print">Warm investor matching and provider routing.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <PhoneCall className="mt-1 size-5 text-primary" />
                    <p className="fine-print">Company discussions about CRM, pricing, demos, and qualified leads.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 size-5 text-primary" />
                    <p className="fine-print">Clear privacy-aware messaging and follow-up expectations.</p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="section-card overflow-hidden p-0">
            <div className="relative min-h-[300px]">
              <Image src="/santorini-greece-white-buildings-blue-domes.jpg" alt="Premium destination view" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />
            </div>
            <CardContent className="space-y-4 p-8">
              <span className="eyebrow">Direct contact</span>
              <h3 className="text-3xl text-foreground">Need a direct conversation instead?</h3>
              <p className="fine-print">
                If your enquiry is time-sensitive or confidential, you can contact the team directly using the channels below.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="leading-7 [overflow-wrap:anywhere]">{settings.salesEmail}</p>
                <p className="leading-7">{settings.phone}</p>
                <p className="leading-7">{settings.whatsapp}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="contact-form" className="section-padding bg-muted/30">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Forms"
            title="Choose the enquiry flow that matches your situation."
            description="Tailored forms create a more relevant experience for both investors and companies than a single generic contact form."
          />
          <ContactInquiryTabs defaultValue={defaultValue} />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell">
          <SectionHeading
            eyebrow="FAQ"
            title="A few quick notes before you submit."
            description="Short answers that help set expectations and reinforce trust."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {faqs.map((faq) => (
              <Card key={faq.title} className="section-card">
                <CardContent className="space-y-4 p-8">
                  <h3 className="text-2xl text-foreground">{faq.title}</h3>
                  <p className="fine-print">{faq.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow="Still deciding?"
            title="Want pricing context or a guided walkthrough before reaching out?"
            description="You can move directly to the demo or pricing section and come back to contact when you are ready."
            primaryAction={{ href: ctaLinks.requestDemo, label: "Go to guided demo" }}
            secondaryAction={{ href: ctaLinks.viewPricing, label: "View pricing" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
