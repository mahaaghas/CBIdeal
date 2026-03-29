import type { Metadata } from "next"
import { CtaPanel } from "@/components/cta-panel"
import { PageHero } from "@/components/page-hero"
import { SectionHeading } from "@/components/section-heading"
import { SiteShell } from "@/components/site-shell"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getLocalizedRouteLinks } from "@/lib/site"
import { getResolvedSiteSettings } from "@/lib/sanity/content"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()

  return buildPageMetadata({
    title: "Privacy Policy",
    description:
      "Read how CBI Deal collects, uses, stores, and protects personal data, including form submissions, cookies, analytics, and Google advertising-related disclosures.",
    path: localizeHref(locale, "/privacy-policy"),
    keywords: [
      "privacy policy",
      "google ads privacy policy",
      "google analytics privacy policy",
      "cookie policy",
      "citizenship by investment privacy policy",
    ],
    locale,
  })
}

const collectionItems = [
  {
    title: "Information you provide",
    body:
      "This includes information submitted through investor, contact, consultation, or company forms, such as your name, nationality, country of residence, budget range, preferred timing, WhatsApp number, email address, and any notes you choose to provide.",
  },
  {
    title: "Technical and usage data",
    body:
      "When you browse the website, technical information may be collected automatically, including IP address, browser type, device information, referral source, page views, engagement signals, and approximate geographic data inferred from technical signals.",
  },
  {
    title: "Cookies and similar technologies",
    body:
      "We and our service providers may use cookies, local storage, pixels, tags, and similar technologies to operate the website, understand performance, measure consultations and enquiries, and, where enabled, support advertising or remarketing.",
  },
] as const

const useCases = [
  "review and respond to enquiries",
  "qualify requests and route them to the relevant internal team or licensed partner path",
  "improve website performance, usability, and security",
  "measure page performance, lead submissions, and marketing effectiveness",
  "comply with legal, regulatory, and compliance obligations",
] as const

const cookieItems = [
  {
    title: "Necessary technologies",
    body: "Used for core site delivery, security, routing, and essential user interactions.",
  },
  {
    title: "Analytics technologies",
    body:
      "Used to understand site usage and improve the experience. The website currently uses Google Analytics 4 to measure page views and selected engagement or conversion-related events.",
  },
  {
    title: "Advertising technologies",
    body:
      "If enabled, these technologies may be used to measure advertising performance, understand audience behavior, support remarketing, and evaluate consultation-related conversion activity.",
  },
] as const

const rights = [
  "request access to personal data we hold about you",
  "request correction of inaccurate or incomplete data",
  "request deletion where applicable",
  "object to or restrict certain processing where applicable",
  "withdraw consent for consent-based processing",
  "complain to a competent supervisory authority",
] as const

export default async function PrivacyPolicyPage() {
  const locale = getRequestLocale()
  const settings = await getResolvedSiteSettings()
  const routeLinks = getLocalizedRouteLinks(locale)

  return (
    <SiteShell>
      <PageHero
        eyebrow="Privacy policy"
        title="Clear privacy disclosures for enquiries, analytics, cookies, and advertising-related measurement."
        description="This policy explains what information we collect, how we use it, how Google-related analytics and advertising tools may interact with the site, and what choices users have."
        primaryAction={{ href: routeLinks.contact, label: "Contact us about privacy" }}
        secondaryAction={{ href: routeLinks.dataProtection, label: "View data protection notice" }}
      />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <Card className="section-card">
            <CardContent className="space-y-6 p-8 md:p-10">
              <div className="space-y-3">
                <span className="eyebrow">Overview</span>
                <h2 className="card-title text-foreground">What this policy covers</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-3xl border border-border/70 bg-muted/30 p-6">
                  <h3 className="text-xl text-foreground">Enquiries</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    We collect the information needed to review investor, company, and consultation enquiries responsibly.
                  </p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-muted/30 p-6">
                  <h3 className="text-xl text-foreground">Analytics</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
We use analytics to understand site usage, improve performance, and measure enquiry activity.
                  </p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-muted/30 p-6">
                  <h3 className="text-xl text-foreground">Advertising</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Where Google advertising features are enabled, we disclose cookies, measurement, remarketing, and consent expectations here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <Card className="section-card">
            <CardContent className="space-y-5 p-8 md:p-10">
              <div className="space-y-3">
                <span className="eyebrow">Controller</span>
                <h2 className="card-title text-foreground">Who is responsible for the website</h2>
              </div>
              <p className="fine-print">
                This policy applies to the CBI Deal website and the personal data collected through its public forms and website interactions.
              </p>
              <p className="fine-print">
                Website operator: <span className="text-foreground">{settings.siteName}</span>
              </p>
              <p className="fine-print">
                Privacy contact:{" "}
                <a className="text-foreground underline-offset-4 hover:underline" href={`mailto:${settings.salesEmail}`}>
                  {settings.salesEmail}
                </a>
              </p>
              <p className="fine-print">
                Operating location reference: <span className="text-foreground">{settings.location}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="section-card">
            <CardContent className="space-y-5 p-8 md:p-10">
              <div className="space-y-3">
                <span className="eyebrow">Legal basis</span>
                <h2 className="card-title text-foreground">Why processing may be permitted</h2>
              </div>
              <p className="fine-print">
                Depending on the context, we may rely on consent, legitimate interests, steps requested before entering a business relationship, or compliance with legal obligations.
              </p>
              <p className="fine-print">
                Where consent is required, especially for non-essential cookies or Google advertising-related technologies in regulated jurisdictions, those technologies should only be activated after the relevant consent signal has been obtained.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Collection"
            title="Information we collect"
            description="We aim to collect only the information reasonably needed to handle enquiries, operate the site, measure performance, and meet legal obligations."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {collectionItems.map((item) => (
              <Card key={item.title} className="section-card">
                <CardContent className="space-y-4 p-8">
                  <h3 className="text-2xl text-foreground">{item.title}</h3>
                  <p className="fine-print">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <Card className="section-card">
            <CardContent className="space-y-5 p-8 md:p-10">
              <div className="space-y-3">
                <span className="eyebrow">Use of data</span>
                <h2 className="card-title text-foreground">How we use personal data</h2>
              </div>
              <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                {useCases.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 rounded-full bg-primary/80" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="fine-print">
                We do not use enquiry data to make legal nationality decisions, and we do not sell personal data as part of the advisory process described on this website.
              </p>
            </CardContent>
          </Card>

          <Card className="section-card">
            <CardContent className="space-y-5 p-8 md:p-10">
              <div className="space-y-3">
                <span className="eyebrow">Sharing</span>
                <h2 className="card-title text-foreground">Who may receive data</h2>
              </div>
              <p className="fine-print">
                Personal data may be shared with service providers that help us operate the website, communications tools, analytics services, form processing, hosting providers, and, where relevant, licensed providers or authorized partners involved in a properly qualified enquiry path.
              </p>
              <p className="fine-print">
                Data may also be disclosed where required by law, regulation, legal process, or to protect rights, safety, and platform integrity.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Cookies and Google tools"
            title="Analytics, cookies, and Google advertising-related disclosures"
            description="This section is designed to support clear disclosure around Google Analytics and any Google advertising features used on or with the website."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {cookieItems.map((item) => (
              <Card key={item.title} className="section-card">
                <CardContent className="space-y-4 p-8">
                  <h3 className="text-2xl text-foreground">{item.title}</h3>
                  <p className="fine-print">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="section-card mt-6">
            <CardContent className="space-y-5 p-8 md:p-10">
              <h3 className="text-2xl text-foreground">Important disclosures for Google Analytics and Google Ads-related features</h3>
              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  The website currently uses Google Analytics 4 to measure page views and selected engagement or lead-related events. This helps us understand which pages are useful and which routes generate qualified consultation intent.
                </p>
                <p>
                  If Google Ads conversion tracking, remarketing, audience building, or similar Google advertising features are enabled, Google and its partners may use cookies, local storage, pixels, and similar technologies to measure ad performance, understand audience behavior, and support advertising or remarketing.
                </p>
                <p>
                  If you are located in the European Economic Area, the United Kingdom, or Switzerland, consent should be obtained before personal data is shared with Google for personalized advertising, or before advertising cookies or local storage are used for that purpose.
                </p>
                <p>
                  You can also manage cookies through your browser settings, and Google provides additional controls through its ad and privacy settings pages.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <Card className="section-card">
            <CardContent className="space-y-5 p-8 md:p-10">
              <div className="space-y-3">
                <span className="eyebrow">Retention and transfers</span>
                <h2 className="card-title text-foreground">How long data may be kept and where it may be processed</h2>
              </div>
              <p className="fine-print">
                We keep data only for as long as reasonably necessary for the purposes described in this policy, including lead handling, follow-up, compliance review, record-keeping, analytics reporting, and legal obligations.
              </p>
              <p className="fine-print">
                Because the website and some service providers operate internationally, personal data may be processed outside your country of residence. Where applicable, we aim to rely on appropriate safeguards for cross-border transfers.
              </p>
            </CardContent>
          </Card>

          <Card className="section-card">
            <CardContent className="space-y-5 p-8 md:p-10">
              <div className="space-y-3">
                <span className="eyebrow">Your rights</span>
                <h2 className="card-title text-foreground">Choices and rights</h2>
              </div>
              <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                {rights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 rounded-full bg-primary/80" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow="Next step"
            title="Need clarity on privacy, tracking, or how your enquiry is handled?"
            description="Use the contact page if you want to discuss privacy, confidentiality, consent, or how a consultation request is processed before any provider introduction."
            primaryAction={{ href: routeLinks.contact, label: "Go to contact" }}
            secondaryAction={{ href: routeLinks.dataProtection, label: "View data protection notice" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
