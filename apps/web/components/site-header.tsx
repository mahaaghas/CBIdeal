import Link from "next/link"
import { Compass } from "lucide-react"
import { APP_URL } from "@cbideal/config"
import { BrandMark } from "@/components/brand-mark"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getRequestDirection, getRequestLocale } from "@/lib/i18n/request"
import { getConversionCtaCopy } from "@/lib/conversion"
import { getLocalizedMainNavLinks, getLocalizedRouteLinks } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const locale = getRequestLocale()
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const mainNavLinks = getLocalizedMainNavLinks(locale)
  const routeLinks = getLocalizedRouteLinks(locale)
  const conversionCopy = getConversionCtaCopy(locale)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container-shell py-3 md:py-3.5">
        <div className="flex flex-col gap-3">
          <div className={cn("flex items-center justify-between gap-6", isRtl && "flex-row-reverse")}>
            <BrandMark />
            <nav className={cn("hidden items-center gap-4 lg:gap-5 md:flex", isRtl && "md:flex-row-reverse")}>
              {mainNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("text-[0.81rem] font-medium text-muted-foreground/88 hover:text-foreground lg:text-sm", isRtl && "text-right")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className={cn("hidden items-center gap-2 md:flex", isRtl && "md:flex-row-reverse")}>
              <LanguageSwitcher locale={locale} />
              <Button variant="outline" className="conversion-header-secondary" asChild>
                <Link href={routeLinks.programs}>{conversionCopy.secondary}</Link>
              </Button>
              <Button className="conversion-primary-button" data-cta-kind="primary" asChild>
                <Link href={routeLinks.bookConsultation}>
                  <Compass className="size-4" />
                  {conversionCopy.primary}
                </Link>
              </Button>
              <Link
                href={`${APP_URL}`}
                className="quiet-link hidden cursor-pointer items-center px-1 py-2 transition-all duration-200 ease-in-out hover:opacity-75 hover:no-underline xl:inline-flex"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <div className={cn("flex items-center gap-2.5 overflow-x-auto pb-1", isRtl && "flex-row-reverse justify-end")}>
              <LanguageSwitcher locale={locale} />
              {mainNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-full border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground",
                    isRtl && "text-right",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={cn("flex flex-col gap-2.5 sm:flex-row md:hidden", isRtl && "sm:flex-row-reverse")}>
            <Button variant="outline" className="conversion-header-secondary w-full sm:flex-1" asChild>
              <Link href={routeLinks.programs}>{conversionCopy.secondary}</Link>
            </Button>
            <Button className="conversion-primary-button w-full sm:flex-1" data-cta-kind="primary" asChild>
              <Link href={routeLinks.bookConsultation}>
                <Compass className="size-4" />
                {conversionCopy.primary}
              </Link>
            </Button>
            <Link
              href={`${APP_URL}`}
              className="quiet-link inline-flex min-h-12 w-full items-center justify-center rounded-full border border-border/70 bg-background/92 px-5 text-sm font-medium shadow-sm transition-all duration-200 ease-in-out hover:bg-muted/40 hover:opacity-80 hover:no-underline sm:flex-1"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
