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
}

export function PageHero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  stats = [],
  children,
}: PageHeroProps) {
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"

  return (
    <section className="section-padding pb-12 md:pb-14">
      <div className="container-shell">
        <div className="hero-panel relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-14 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,187,131,0.18),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_40%)]" />
          <div
            dir={direction}
            className={cn(
              "page-hero-grid relative grid gap-8 md:gap-10",
              children ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-start lg:gap-12" : "content-measure",
            )}
          >
            <div className={cn("page-hero-copy space-y-6 md:space-y-8", isRtl && "text-right")}>
              <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">{eyebrow}</span>
              <div className="space-y-4 md:space-y-5">
                <h1 className="display-title max-w-[42rem] text-primary-foreground">
                  {title}
                </h1>
                <p className="max-w-[40rem] text-base leading-7 text-primary-foreground/75 md:text-lg md:leading-8">
                  {description}
                </p>
              </div>
              <div className={cn("page-hero-actions flex flex-col gap-3 pt-1 sm:flex-row", isRtl && "sm:flex-row-reverse")}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                  <Link href={primaryAction.href}>
                    {primaryAction.label}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                {secondaryAction ? (
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/20 bg-transparent text-primary-foreground hover:bg-white/10 sm:w-auto"
                    asChild
                  >
                    <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                  </Button>
                ) : null}
              </div>
              {stats.length ? (
                <div
                  className={cn(
                    "page-hero-stats grid gap-4 pt-4 md:pt-6",
                    children ? "md:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3",
                  )}
                >
                  {stats.map((stat) => (
                    <div key={stat.label} className="min-w-0 rounded-2xl border border-white/10 bg-black/10 p-5 md:p-6">
                      <div className="min-w-0 text-xl leading-snug text-primary-foreground md:text-2xl [overflow-wrap:anywhere]">
                        {stat.value}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-primary-foreground/70">{stat.label}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {children ? <div className={cn("page-hero-aside max-w-[32rem]", isRtl ? "lg:justify-self-start lg:pr-2" : "lg:justify-self-end lg:pl-2")}>{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
