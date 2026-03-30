import Link from "next/link"
import {
  BarChart3,
  Building2,
  Compass,
  FileCheck2,
  Globe2,
  HandCoins,
  MessagesSquare,
  MonitorPlay,
  ShieldCheck,
  Users,
} from "lucide-react"
import { CtaPanel } from "@/components/cta-panel"
import { FaqList } from "@/components/faq-list"
import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { PageHero } from "@/components/page-hero"
import { ProcessSteps } from "@/components/process-steps"
import { ProgramGrid } from "@/components/program-grid"
import { SectionHeading } from "@/components/section-heading"
import { TrustGrid } from "@/components/trust-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import type { CmsLandingPage, CmsLandingSection, CmsProcessStep } from "@/lib/sanity/types"

const processIconMap = {
  "bar-chart-3": BarChart3,
  "building-2": Building2,
  compass: Compass,
  "file-check-2": FileCheck2,
  "globe-2": Globe2,
  "hand-coins": HandCoins,
  "messages-square": MessagesSquare,
  "monitor-play": MonitorPlay,
  "shield-check": ShieldCheck,
  users: Users,
} as const

function localizeCmsHref(locale: ReturnType<typeof getRequestLocale>, href: string) {
  return href.startsWith("/") ? localizeHref(locale, href) : href
}

function renderSection(section: CmsLandingSection, index: number, locale: ReturnType<typeof getRequestLocale>) {
  switch (section._type) {
    case "heroSection":
      return (
        <PageHero
          key={`${section._type}-${index}`}
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          primaryAction={{ ...section.primaryAction, href: localizeCmsHref(locale, section.primaryAction.href) }}
          secondaryAction={
            section.secondaryAction
              ? { ...section.secondaryAction, href: localizeCmsHref(locale, section.secondaryAction.href) }
              : undefined
          }
          stats={section.stats ?? []}
        >
          {section.highlights?.length || section.secondaryCard ? (
            <div className="space-y-4">
              {section.highlights?.length ? (
                <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur">
                  {section.highlightsLabel ? (
                    <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70">{section.highlightsLabel}</p>
                  ) : null}
                  <div className="mt-4 space-y-4">
                    {section.highlights.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 size-5 text-secondary" />
                        <p className="text-sm leading-7 text-primary-foreground/80">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {section.secondaryCard ? (
                <div className="rounded-[28px] border border-secondary/30 bg-background/95 p-5 text-foreground shadow-[0_20px_60px_rgba(19,24,38,0.16)]">
                  {section.secondaryCard.eyebrow ? (
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {section.secondaryCard.eyebrow}
                    </p>
                  ) : null}
                  <h3 className="card-title mt-2 text-foreground">{section.secondaryCard.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{section.secondaryCard.description}</p>
                  {section.secondaryCard.cta ? (
                    <Button asChild className="mt-4 w-full sm:w-auto">
                      <Link href={localizeCmsHref(locale, section.secondaryCard.cta.href)}>{section.secondaryCard.cta.label}</Link>
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </PageHero>
      )

    case "trustSection":
      return (
        <section key={`${section._type}-${index}`} className="section-padding bg-muted/30">
          <div className="container-shell">
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
            />
            <TrustGrid items={section.items} />
          </div>
        </section>
      )

    case "featureSection": {
      const hasImages = section.items.every((item) => item.image?.url)

      return (
        <section key={`${section._type}-${index}`} className="section-padding">
          <div className="container-shell">
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
            />
            {hasImages ? (
              <ProgramGrid
                items={section.items.map((item) => ({
                  title: item.title,
                  description: item.description,
                  image: item.image!.url,
                  alt: item.image!.alt,
                }))}
              />
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                {section.items.map((item) => (
                  <Card key={item.title} className="section-card h-full">
                    <CardContent className="space-y-4 p-7 md:p-8">
                      <h3 className="card-title text-foreground">{item.title}</h3>
                      <p className="fine-print">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )
    }

    case "processSection":
      return (
        <section key={`${section._type}-${index}`} className="section-padding">
          <div className="container-shell">
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
            />
            <ProcessSteps
              steps={section.steps.map((step: CmsProcessStep) => ({
                icon: processIconMap[step.icon as keyof typeof processIconMap] ?? ShieldCheck,
                title: step.title,
                description: step.description,
              }))}
            />
          </div>
        </section>
      )

    case "qualificationFormSection":
      return (
        <section key={`${section._type}-${index}`} id={section.source} className="section-padding pt-0">
          <div className="container-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-6">
              <span className="eyebrow">{section.eyebrow}</span>
              <h2 className="section-title max-w-xl text-foreground">{section.title}</h2>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">{section.description}</p>
              {section.bulletPoints?.length ? (
                <div className="space-y-4">
                  {section.bulletPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <ShieldCheck className="mt-1 size-5 text-primary" />
                      <p className="fine-print">{point}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <LeadQualificationForm
              locale={locale}
              formType={section.formType}
              title={section.formTitle}
              description={section.formDescription}
              submitLabel={section.submitLabel ?? undefined}
              source={section.source}
            />
          </div>
        </section>
      )

    case "faqSection":
      return (
        <section key={`${section._type}-${index}`} className="section-padding pt-0">
          <div className="container-shell">
            <SectionHeading
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
            />
            <FaqList items={section.items} />
          </div>
        </section>
      )

    case "ctaBannerSection":
      return (
        <section key={`${section._type}-${index}`} className="section-padding pt-0">
          <div className="container-shell">
            <CtaPanel
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
              primaryAction={{ ...section.primaryAction, href: localizeCmsHref(locale, section.primaryAction.href) }}
              secondaryAction={
                section.secondaryAction
                  ? { ...section.secondaryAction, href: localizeCmsHref(locale, section.secondaryAction.href) }
                  : undefined
              }
            />
          </div>
        </section>
      )

    default:
      return null
  }
}

interface LandingPageRendererProps {
  page: CmsLandingPage
}

export function LandingPageRenderer({ page }: LandingPageRendererProps) {
  const locale = getRequestLocale()
  return <>{page.sections.map((section, index) => renderSection(section, index, locale))}</>
}
