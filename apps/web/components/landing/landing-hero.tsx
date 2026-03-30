import type { ReactNode } from "react"
import { CheckCircle2 } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { getRequestDirection } from "@/lib/i18n/request"
import { cn } from "@/lib/utils"

interface HeroAction {
  href: string
  label: string
}

interface HeroStat {
  value: string
  label: string
}

interface LandingHeroProps {
  eyebrow: string
  title: string
  description: string
  primaryAction: HeroAction
  secondaryAction?: HeroAction
  stats?: HeroStat[]
  highlightsLabel?: string
  highlights?: string[]
  aside?: ReactNode
}

export function LandingHero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  stats,
  highlightsLabel = "Why this page matters",
  highlights = [],
  aside,
}: LandingHeroProps) {
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"

  const fallbackAside =
    highlights.length > 0 ? (
      <div className="rounded-[28px] border border-white/10 bg-black/10 p-5 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70">{highlightsLabel}</p>
        <div className="mt-4 space-y-4">
          {highlights.map((item) => (
            <div key={item} className={cn("landing-hero-highlight-row flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
              <CheckCircle2 className="mt-0.5 size-5 text-secondary" />
              <p className="text-sm leading-7 text-primary-foreground/75">{item}</p>
            </div>
          ))}
        </div>
      </div>
    ) : null

  return (
    <PageHero
      eyebrow={eyebrow}
      title={title}
      description={description}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      stats={stats}
      showGuideLink={false}
    >
      {aside ?? fallbackAside}
    </PageHero>
  )
}
