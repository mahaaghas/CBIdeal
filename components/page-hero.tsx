import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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
}: PageHeroProps) {
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const renderStatsBelow = Boolean(children && stats.length)

  return (
    <section className={cn("section-padding pb-12 md:pb-16", compact && "py-14 md:py-16", sectionClassName)}>
      <div className="container-shell">
        <div
          className={cn(
            "hero-panel relative overflow-hidden px-7 py-9 sm:px-9 sm:py-11 md:px-12 md:py-12 lg:px-[4.5rem] lg:py-[4.35rem]",
            compact && "px-7 py-7 sm:px-8 sm:py-8 md:px-10 md:py-9 lg:px-12 lg:py-10",
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,187,131,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_34%)]" />
          <div
            dir={direction}
            className={cn(
              "page-hero-grid relative grid gap-9 md:gap-11",
              children
                ? "lg:grid-cols-[minmax(0,1.28fr)_minmax(20rem,0.72fr)] lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,1.34fr)_minmax(20.5rem,0.68fr)]"
                : "content-measure",
            )}
          >
            <div
              className={cn(
                "page-hero-copy flex min-w-0 flex-col justify-center space-y-7 md:space-y-9",
                compact && "space-y-5 md:space-y-6",
                isRtl && "text-right",
              )}
            >
              <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">{eyebrow}</span>
              <div className={cn("space-y-4 md:space-y-6", compact && "space-y-[0.875rem] md:space-y-[1.125rem]")}>
                <h1
                  className={cn(
                    "text-primary-foreground",
                    children
                      ? "max-w-[15ch] text-[clamp(2.65rem,4vw,3.85rem)] leading-[1.08] tracking-[-0.03em]"
                      : "display-title max-w-[42rem]",
                    compact && !children && "max-w-[18ch] text-[clamp(2.4rem,3.7vw,3.45rem)] leading-[1.08] tracking-[-0.028em]",
                  )}
                >
                  {title}
                </h1>
                <p
                  className={cn(
                    "text-primary-foreground/76",
                    children
                      ? "max-w-[36rem] text-[0.98rem] leading-[1.9] md:text-[1.02rem] md:leading-8"
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
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 w-full rounded-full px-6 text-sm font-semibold sm:w-auto"
                  asChild
                >
                  <Link href={primaryAction.href}>
                    {primaryAction.label}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                {secondaryAction ? (
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-full rounded-full border-white/18 bg-white/[0.02] px-6 text-sm font-semibold text-primary-foreground hover:bg-white/10 sm:w-auto"
                    asChild
                  >
                    <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                  </Button>
                ) : null}
              </div>
              {!renderStatsBelow && stats.length ? (
                <div
                  className={cn(
                    "page-hero-stats grid gap-4 pt-5 md:pt-7",
                    compact && "gap-[0.875rem] pt-4 md:pt-5",
                    children ? "md:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3",
                  )}
                >
                  {stats.map((stat) => (
                    <div key={stat.label} className="min-w-0 rounded-[22px] border border-white/8 bg-white/[0.03] p-5 md:p-6">
                      <div className="min-w-0 text-[1.35rem] leading-snug text-primary-foreground md:text-[1.55rem] [overflow-wrap:anywhere]">
                        {stat.value}
                      </div>
                      <p className="mt-2.5 max-w-[18rem] text-sm leading-6 text-primary-foreground/68">{stat.label}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {children ? (
              <div
                className={cn(
                  "page-hero-aside w-full max-w-[23.5rem] self-start",
                  isRtl ? "lg:justify-self-start" : "lg:justify-self-end",
                )}
              >
                {children}
              </div>
            ) : null}
          </div>
          {renderStatsBelow ? (
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
