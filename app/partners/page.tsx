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
        ? "للمكاتب المتخصصة والجهات المهنية الموثوقة"
        : locale === "ru"
          ? "Для специализированных практик и профессиональных партнёров"
          : "For Specialist Practices and Professional Counterparts",
    description:
      locale === "ar"
        ? "مساحة أكثر هدوءاً لبدء نقاش مهني مع المكاتب المتخصصة والجهات الدولية التي تعمل في هذا المجال."
        : locale === "ru"
          ? "Более спокойная точка входа для профессионального разговора со специализированными практиками и международными участниками рынка."
          : "A more discreet starting point for professional discussions with specialist practices and trusted international counterparts.",
    path: localizeHref(locale, "/partners"),
    keywords: [
      "professional advisory relationships",
      "specialist immigration practices",
      "trusted international counterparts",
    ],
    locale,
  })
}

const trustItems = [
  {
    title: "For established practices",
    description: "Designed for specialist firms and trusted introducers that value privacy, seriousness, and a more measured first conversation.",
  },
  {
    title: "Structured professional dialogue",
    description: "The page creates space for calm discussions around collaboration, suitability, and the right professional format.",
  },
  {
    title: "Aligned with the wider platform",
    description: "These conversations sit naturally alongside the broader advisory platform without turning the public experience into a marketplace.",
  },
  {
    title: "Private by design",
    description: "The initial exchange is intended to feel selective and discreet, particularly where reputation or client sensitivity matters.",
  },
]

const models = [
  {
    icon: Handshake,
    title: "Professional introductions",
    description: "For firms that value a trusted counterpart and prefer a more selective basis for first conversations.",
  },
  {
    icon: Network,
    title: "Coordinated collaboration",
    description: "For practices exploring a more considered relationship where presentation, discretion, and fit all matter.",
  },
  {
    icon: Users2,
    title: "Institutional dialogue",
    description: "For firms seeking a broader conversation about long-term alignment, case handling, or professional cooperation.",
  },
]

const criteria = [
  "A clear view of the jurisdictions, client profile, and scope of work you are actually focused on.",
  "A realistic understanding of compliance, suitability, and documentation standards.",
  "A measured basis for deciding whether a more detailed professional conversation is appropriate.",
]

export default function PartnersPage() {
  const locale = getRequestLocale()
  const routeLinks = getLocalizedRouteLinks(locale)
  return (
    <SiteShell>
      <PageHero
        eyebrow="For specialist practices"
        title="Professional conversations for specialist practices and trusted counterparts."
        description="This page is intended for specialist counterparts who want to understand the professional frame before moving into specifics. Use it where a more private discussion is needed around collaboration, institutional fit, or cross-border case context."
        primaryAction={{ href: "#partner-form", label: "Request a professional discussion" }}
        secondaryAction={{ href: routeLinks.forCompanies, label: "View professional overview" }}
        stats={[
          { value: "Private", label: "for measured first conversations" },
          { value: "Selective", label: "for cases where fit matters" },
          { value: "Structured", label: "for calmer professional dialogue" },
        ]}
      >
        <div className="rounded-[28px] border border-white/10 bg-black/10 p-5 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.18em] text-primary-foreground/70">Who this is for</p>
          <div className="mt-4 space-y-4">
            {[
              "Specialist practices seeking a calmer route into professional discussion.",
              "International counterparts comparing how a relationship may be approached.",
              "Advisory firms that value discretion before any more defined next step is discussed.",
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
            eyebrow="Professional context"
            title="A clearer basis for professional collaboration."
            description="This section outlines the contexts in which a professional discussion usually becomes relevant. The aim is to clarify the shape of a possible relationship without turning the page into a transactional marketplace."
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
              Professional discussions work best when the context is clear.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              This section explains the conditions that usually make a professional conversation worthwhile. It replaces vague partnership language with a more grounded sense of suitability, seriousness, and institutional fit.
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
              <span className="eyebrow">Context</span>
              <h3 className="card-title text-foreground">A quieter route into broader professional context.</h3>
              <p className="fine-print">
                Keeping these conversations on the same domain makes it easier to understand the wider platform before deciding whether a more specific professional dialogue should continue.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="partner-form" className="section-padding">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
          <span className="eyebrow">Professional context</span>
          <h2 className="section-title max-w-xl text-foreground">Request a private professional discussion.</h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
               Use the form to outline your practice, the jurisdictions you cover, and the kind of discussion that would be useful. The purpose is to give the first reply the right context rather than relying on broad assumptions.
            </p>
          </div>
          <LeadQualificationForm
            locale={locale}
            formType="partner"
            title="Request a professional discussion"
            description="Outline where you operate and what kind of professional context you would like to explore."
            submitLabel="Request a discussion"
            source="partners"
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <CtaPanel
            eyebrow="Further context"
            title="Would you prefer a broader overview before taking the conversation further?"
            description="Move to the professional overview if you would like a broader sense of the platform and its tone before continuing. For some firms, that wider reading is the better starting point before a more specific exchange."
            primaryAction={{ href: routeLinks.forCompanies, label: "View professional overview" }}
            secondaryAction={{ href: routeLinks.programs, label: "Go to investor pathways" }}
          />
        </div>
      </section>
    </SiteShell>
  )
}
