import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { ctaLinks, mainNavLinks } from "@/lib/site"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container-shell py-3 md:py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-6">
            <BrandMark />
            <nav className="hidden items-center gap-6 md:flex">
              {mainNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <Button variant="outline" asChild>
                <Link href={ctaLinks.bookCompanyCall}>Book company call</Link>
              </Button>
              <Button asChild>
                <Link href={ctaLinks.checkEligibility}>
                  Check eligibility
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <div className="flex flex-wrap gap-2">
              {mainNavLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-border/70 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row md:hidden">
            <Button variant="outline" className="w-full sm:flex-1" asChild>
              <Link href={ctaLinks.bookCompanyCall}>Book company call</Link>
            </Button>
            <Button className="w-full sm:flex-1" asChild>
              <Link href={ctaLinks.checkEligibility}>
                Check eligibility
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
