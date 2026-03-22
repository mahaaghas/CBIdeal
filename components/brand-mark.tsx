import Link from "next/link"
import { getRequestLocale } from "@/lib/i18n/request"
import { brandConfig, routeLinks } from "@/lib/site"
import { cn } from "@/lib/utils"
import { localizeHref } from "@/lib/i18n/routing"

interface BrandMarkProps {
  className?: string
  muted?: boolean
}

export function BrandMark({ className, muted = false }: BrandMarkProps) {
  const locale = getRequestLocale()

  return (
    <Link href={localizeHref(locale, routeLinks.home)} className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-full border text-sm font-semibold tracking-[0.3em]",
          muted
            ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
            : "border-primary/10 bg-primary text-primary-foreground",
        )}
      >
        {brandConfig.monogram}
      </span>
      <span
        className={cn(
          "text-lg font-semibold tracking-[0.22em]",
          muted ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {brandConfig.wordmark}
      </span>
    </Link>
  )
}
