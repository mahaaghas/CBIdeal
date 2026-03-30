import Link from "next/link"
import { ArrowRight, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRequestDirection, getRequestLocale } from "@/lib/i18n/request"
import { getConversionCtaCopy, getConversionGuideHref } from "@/lib/conversion"
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
  showGuideLink?: boolean
}

export function CtaPanel({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  showGuideLink = true,
}: CtaPanelProps) {
  const locale = getRequestLocale()
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const conversionCopy = getConversionCtaCopy(locale)
  const guideHref = getConversionGuideHref(locale)

  return (
    <div className="hero-panel overflow-hidden px-6 py-8 sm:px-8 md:px-12 md:py-11">
      <div
        dir={direction}
        className="cta-panel-grid grid gap-7 md:gap-9 lg:grid-cols-[minmax(0,1.05fr)_auto] lg:items-end"
      >
        <div className={cn("section-stack", isRtl && "text-right")}>
          <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">{eyebrow}</span>
          <h2 className="section-title max-w-[18ch] text-primary-foreground">{title}</h2>
          <p className="max-w-[40rem] text-base leading-7 text-primary-foreground/74 md:text-[1.02rem] md:leading-8">{description}</p>
        </div>
        <div
          className={cn(
            "cta-panel-actions flex flex-col gap-3 sm:flex-row lg:min-w-[15rem] lg:flex-col lg:items-end",
            isRtl && "sm:flex-row-reverse lg:items-start",
          )}
        >
          <Button size="lg" variant="secondary" data-cta-kind="primary" className="conversion-primary-button w-full sm:w-auto" asChild>
            <Link href={primaryAction.href}>
              <Compass className="size-4" />
              {primaryAction.label}
            </Link>
          </Button>
          <Link href={secondaryAction?.href ?? primaryAction.href} className="conversion-secondary-button w-full sm:w-auto">
            {secondaryAction?.label ?? conversionCopy.secondary}
            <ArrowRight className="size-4" />
          </Link>
          {showGuideLink ? (
            <Link href={guideHref} className="conversion-tertiary-link mt-1">
              {conversionCopy.tertiary}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}
