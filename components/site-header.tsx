import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getRequestDirection, getRequestLocale } from "@/lib/i18n/request"
import { getMessages } from "@/lib/i18n/messages"
import { getLocalizedCtaLinks, getLocalizedMainNavLinks } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const locale = getRequestLocale()
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const messages = getMessages(locale)
  const ctaLinks = getLocalizedCtaLinks(locale)
  const mainNavLinks = getLocalizedMainNavLinks(locale)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container-shell py-3 md:py-4">
        <div className="flex flex-col gap-4">
          <div className={cn("flex items-center justify-between gap-6", isRtl && "flex-row-reverse")}>
            <BrandMark />
            <nav className={cn("hidden items-center gap-6 md:flex", isRtl && "md:flex-row-reverse")}>
              {mainNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("text-sm font-medium text-muted-foreground hover:text-foreground", isRtl && "text-right")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className={cn("hidden items-center gap-2 md:flex", isRtl && "md:flex-row-reverse")}>
              <LanguageSwitcher locale={locale} />
              <Button variant="outline" asChild>
                <Link href={ctaLinks.bookCompanyCall}>{messages.ctas.bookCompanyCall}</Link>
              </Button>
              <Button asChild>
                <Link href={ctaLinks.checkEligibility}>
                  {messages.ctas.checkEligibility}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <div className={cn("flex flex-wrap items-center gap-2", isRtl && "flex-row-reverse justify-end")}>
              <LanguageSwitcher locale={locale} />
              {mainNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground",
                    isRtl && "text-right",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={cn("flex flex-col gap-2 sm:flex-row md:hidden", isRtl && "sm:flex-row-reverse")}>
            <Button variant="outline" className="w-full sm:flex-1" asChild>
              <Link href={ctaLinks.bookCompanyCall}>{messages.ctas.bookCompanyCall}</Link>
            </Button>
            <Button className="w-full sm:flex-1" asChild>
              <Link href={ctaLinks.checkEligibility}>
                {messages.ctas.checkEligibility}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
