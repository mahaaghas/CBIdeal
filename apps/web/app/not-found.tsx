import Link from "next/link"
import { ArrowRight, Home } from "lucide-react"
import { getMessages } from "@/lib/i18n/messages"
import { getRequestLocale } from "@/lib/i18n/request"
import { SiteShell } from "@/components/site-shell"
import { Button } from "@/components/ui/button"
import { getLocalizedCtaLinks, getLocalizedRouteLinks } from "@/lib/site"

export default function NotFound() {
  const locale = getRequestLocale()
  const messages = getMessages(locale)
  const ctaLinks = getLocalizedCtaLinks(locale)
  const routeLinks = getLocalizedRouteLinks(locale)

  return (
    <SiteShell>
      <section className="section-padding">
        <div className="container-shell">
          <div className="hero-panel mx-auto max-w-4xl px-8 py-20 text-center md:px-14">
            <p className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">404</p>
            <div className="mt-7 space-y-4 md:mt-8">
              <h1 className="display-title text-primary-foreground">{messages.notFound.title}</h1>
              <p className="mx-auto max-w-2xl text-lg leading-8 text-primary-foreground/75">
                {messages.notFound.description}
              </p>
            </div>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href={ctaLinks.returnHome}>
                  <Home className="size-4" />
                  {messages.ctas.returnHome}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-transparent text-primary-foreground hover:bg-white/10"
                asChild
              >
                <Link href={routeLinks.programs}>
                  {messages.ctas.explorePrograms}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
