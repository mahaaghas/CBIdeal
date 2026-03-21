import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  return (
    <section className="section-padding pb-14 md:pb-16">
      <div className="container-shell">
        <div className="hero-panel relative overflow-hidden px-6 py-10 md:px-12 md:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,187,131,0.18),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_40%)]" />
          <div
            className={cn(
              "relative grid gap-8",
              children ? "lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-10" : "max-w-5xl",
            )}
          >
            <div className="space-y-5 md:space-y-6">
              <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">{eyebrow}</span>
              <div className="space-y-3 md:space-y-4">
                <h1 className="display-title max-w-4xl text-primary-foreground">
                  {title}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-primary-foreground/75 md:text-xl md:leading-8">
                  {description}
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
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
                    "grid gap-4 pt-2 md:pt-4",
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
            {children ? <div className="lg:pl-4">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
