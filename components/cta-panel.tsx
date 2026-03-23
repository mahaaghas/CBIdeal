import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRequestDirection } from "@/lib/i18n/request"
import { cn } from "@/lib/utils"

interface Action {
  href: string
  label: string
}

interface CtaPanelProps {
  eyebrow: string
  title: string
  description: string
  primaryAction: Action
  secondaryAction?: Action
}

export function CtaPanel({ eyebrow, title, description, primaryAction, secondaryAction }: CtaPanelProps) {
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"

  return (
    <div className="hero-panel overflow-hidden px-6 py-8 sm:px-8 md:px-12 md:py-10">
      <div
        dir={direction}
        className="cta-panel-grid grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end"
      >
        <div className={cn("space-y-4 md:space-y-5", isRtl && "text-right")}>
          <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">{eyebrow}</span>
          <h2 className="section-title max-w-[42rem] text-primary-foreground">{title}</h2>
          <p className="max-w-[40rem] text-base leading-7 text-primary-foreground/75 md:text-lg md:leading-8">{description}</p>
        </div>
        <div className={cn("cta-panel-actions flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end", isRtl && "sm:flex-row-reverse lg:items-start")}>
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
      </div>
    </div>
  )
}
