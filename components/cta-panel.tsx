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
    <div className="hero-panel overflow-hidden px-6 py-8 sm:px-8 md:px-12 md:py-11">
      <div
        dir={direction}
        className="cta-panel-grid grid gap-7 md:gap-9 lg:grid-cols-[minmax(0,1.08fr)_auto] lg:items-end"
      >
        <div className={cn("section-stack", isRtl && "text-right")}>
          <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">{eyebrow}</span>
          <h2 className="section-title max-w-[17ch] text-primary-foreground">{title}</h2>
          <p className="max-w-[38rem] text-base leading-7 text-primary-foreground/76 md:text-[1.02rem] md:leading-8">{description}</p>
        </div>
        <div
          className={cn(
            "cta-panel-actions flex flex-col gap-3 sm:flex-row lg:min-w-[15rem] lg:flex-col lg:items-end",
            isRtl && "sm:flex-row-reverse lg:items-start",
          )}
        >
          <Button size="lg" variant="secondary" className="h-12 w-full rounded-full px-6 text-sm font-semibold sm:w-auto" asChild>
            <Link href={primaryAction.href}>
              {primaryAction.label}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          {secondaryAction ? (
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full border-white/20 bg-transparent px-6 text-sm font-semibold text-primary-foreground hover:bg-white/10 sm:w-auto"
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
