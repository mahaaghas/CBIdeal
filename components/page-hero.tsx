import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRequestDirection, getRequestLocale } from "@/lib/i18n/request"
import { getConversionCtaCopy, getConversionGuideHref } from "@/lib/conversion"
import { cn } from "@/lib/utils"

interface HeroAction {
  href: string
  label: string
}

interface HeroStat {
  value: string
  label: string
}

interface PageHeroProps {
  eyebrow: string
  title: string
  description: string
  primaryAction: HeroAction
  secondaryAction?: HeroAction
  stats?: HeroStat[]
  children?: ReactNode
  compact?: boolean
  sectionClassName?: string
  useConversionLabels?: boolean
  secondaryActionStyle?: "button" | "text"
  showGuideLink?: boolean
}

export function PageHero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  stats = [],
  children,
  compact = false,
  sectionClassName,
  useConversionLabels = false,
  secondaryActionStyle = "button",
  showGuideLink = true,
}: PageHeroProps) {
  const locale = getRequestLocale()
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const hasAside = Boolean(children)
  const renderStatsInPrimaryColumn = Boolean(hasAside && stats.length)
  const renderStandaloneStats = Boolean(!hasAside && stats.length)
  const conversionCopy = getConversionCtaCopy(locale)
  const guideHref = getConversionGuideHref(locale)

  return (
    <section className={cn("section-padding pb-10 md:pb-14", compact && "py-14 md:py-16", sectionClassName)}>
      <div className="container-shell">
        <div
          className={cn(
            "hero-panel relative overflow-hidden px-7 py-8 sm:px-9 sm:py-10 md:px-12 md:py-11 lg:px-[4.5rem] lg:py-[4rem]",
            compact && "px-7 py-7 sm:px-8 sm:py-8 md:px-10 md:py-9 lg:px-12 lg:py-10",
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,187,131,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_34%)]" />
          <div
            dir={direction}
            className={cn(
              "page-hero-grid relative grid gap-8 md:gap-10",
              hasAside
                ? "lg:grid-cols-[minmax(0,1.76fr)_minmax(17.5rem,0.64fr)] lg:items-stretch lg:gap-12 xl:grid-cols-[minmax(0,1.84fr)_minmax(18.5rem,0.6fr)] xl:gap-14"
                : "content-measure",
            )}
          >
            <div
              className={cn(
                "page-hero-copy flex min-w-0 flex-col justify-start space-y-6 md:space-y-8 lg:h-full",
                compact && "space-y-5 md:space-y-6",
                isRtl && "text-right",
              )}
            >
              <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">{eyebrow}</span>
              <div className={cn("space-y-4 md:space-y-6", compact && "space-y-[0.875rem] md:space-y-[1.125rem]")}>
                <h1
                  className={cn(
                    "text-primary-foreground",
                    hasAside
                      ? "max-w-[20ch] text-[clamp(2.15rem,2.7vw,3.02rem)] leading-[1.1] tracking-[-0.028em]"
                      : "display-title max-w-[42rem]",
                    compact && !children && "max-w-[18ch] text-[clamp(2.3rem,3.35vw,3.2rem)] leading-[1.08] tracking-[-0.028em]",
                  )}
                >
                  {title}
                </h1>
                <p
                  className={cn(
                    "text-primary-foreground/76",
                    hasAside
                      ? "max-w-[42rem] text-[0.96rem] leading-[1.82] md:text-[1rem] md:leading-[1.95]"
                      : "max-w-[40rem] text-base leading-7 md:text-lg md:leading-8",
                    compact && !children && "max-w-[40rem] text-[0.98rem] leading-7 md:text-base md:leading-[1.9]",
                  )}
                >
                  {description}
                </p>
              </div>
              <div
                className={cn(
                  "page-hero-actions flex flex-col gap-3.5 pt-1 sm:flex-row sm:items-center",
                  compact && "gap-3 pt-[0.125rem]",
                  isRtl && "sm:flex-row-reverse",
                )}
              >
                <Button size="lg" variant="secondary" data-cta-kind="primary" className="conversion-primary-button w-full sm:w-auto" asChild>
                  <Link href={primaryAction.href}>
                    <Compass className="size-4" />
                    {useConversionLabels ? conversionCopy.primary : primaryAction.label}
                  </Link>
                </Button>
                <Link
                  href={secondaryAction?.href ?? primaryAction.href}
                  className={
                    secondaryActionStyle === "text"
                      ? "inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 underline-offset-4 hover:text-primary-foreground hover:underline"
                      : "conversion-secondary-button w-full sm:w-auto"
                  }
                >
                  {useConversionLabels ? conversionCopy.secondary : secondaryAction?.label ?? conversionCopy.secondary}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              {showGuideLink ? (
                <Link href={guideHref} className={cn("conversion-tertiary-link", isRtl && "self-start")}>
                  {conversionCopy.tertiary}
                </Link>
              ) : null}
              {renderStatsInPrimaryColumn ? (
                <div
                  className={cn(
                    "page-hero-stats mt-auto border-t border-white/10 pt-6",
                    compact && "pt-5 md:pt-6",
                  )}
                >
                  <div className="grid gap-4 lg:grid-cols-3">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex min-h-[148px] min-w-0 flex-col justify-center rounded-[22px] border border-white/8 bg-white/[0.03] p-5 md:min-h-[156px] md:p-6"
                      >
                        <div className="min-w-0 text-[1.3rem] leading-snug text-primary-foreground md:text-[1.45rem] [overflow-wrap:anywhere]">
                          {stat.value}
                        </div>
                        <p className="mt-2.5 max-w-[18rem] text-sm leading-6 text-primary-foreground/68">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            {hasAside ? (
              <div
                className={cn(
                  "page-hero-aside w-full max-w-[19.75rem] self-start xl:max-w-[20.5rem]",
                  isRtl ? "lg:justify-self-start" : "lg:justify-self-end",
                )}
              >
                {children}
              </div>
            ) : null}
          </div>
          {renderStandaloneStats ? (
            <div
              dir={direction}
              className={cn(
                "page-hero-stats relative mt-9 grid gap-4 border-t border-white/10 pt-7 md:mt-12 md:grid-cols-3 md:pt-8",
                isRtl && "text-right",
              )}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex min-h-[152px] min-w-0 flex-col rounded-[22px] border border-white/8 bg-white/[0.03] p-5 md:min-h-[164px] md:p-6">
                  <div className="min-w-0 text-[1.3rem] leading-snug text-primary-foreground md:text-[1.5rem] [overflow-wrap:anywhere]">
                    {stat.value}
                  </div>
                  <p className="mt-2.5 max-w-[18rem] text-sm leading-6 text-primary-foreground/68">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
