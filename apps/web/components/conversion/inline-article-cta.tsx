import Link from "next/link"
import { Compass } from "lucide-react"
import { getConversionCtaCopy, getConversionGuideHref } from "@/lib/conversion"
import type { Locale } from "@/lib/i18n/routing"
import { localizeHref } from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"

interface InlineArticleCtaProps {
  locale: Locale
}

export function InlineArticleCta({ locale }: InlineArticleCtaProps) {
  const copy = getConversionCtaCopy(locale)
  const consultationHref = localizeHref(locale, "/book-a-cbi-consultation")

  return (
    <div className={cn("rounded-[28px] border border-border/70 bg-muted/35 p-6 md:p-7", locale === "ar" && "text-right")} dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="space-y-4">
        <span className="eyebrow">{locale === "ar" ? "مساعدة في القرار" : "Decision support"}</span>
        <h3 className="card-title text-foreground">{copy.inlineTitle}</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={consultationHref} data-cta-kind="primary" className="conversion-primary-button">
            <Compass className="size-4" />
            {copy.inlineButton}
          </Link>
          <Link href={getConversionGuideHref(locale)} className="conversion-secondary-link">
            {copy.tertiary}
          </Link>
        </div>
      </div>
    </div>
  )
}
