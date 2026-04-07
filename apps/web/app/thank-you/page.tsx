import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Compass, House, ShieldCheck } from "lucide-react"
import { ConsultationThankYouState } from "@/components/forms/consultation-thank-you-state"
import { SiteShell } from "@/components/site-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"
import { getLocalizedRouteLinks } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()

  return buildPageMetadata({
    title: "Thank You",
    description: "Your consultation request has been received by CBI Deal.",
    path: localizeHref(locale, "/thank-you"),
    noIndex: true,
    locale,
  })
}

export default function ThankYouPage() {
  const locale = getRequestLocale()
  const routes = getLocalizedRouteLinks(locale)

  return (
    <SiteShell>
      <section className="section-padding">
        <div className="container-shell">
          <div className="hero-panel relative overflow-hidden px-7 py-8 sm:px-9 sm:py-10 md:px-12 md:py-11 lg:px-[4.75rem] lg:py-[4.15rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,187,131,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_36%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.9fr)] lg:items-start">
              <div className="space-y-6">
                <span className="eyebrow border-white/18 bg-white/10 text-primary-foreground/82">
                  Consultation received
                </span>
                <div className="space-y-4">
                  <h1 className="max-w-[14ch] text-[clamp(2.3rem,3vw,3.3rem)] leading-[1.05] tracking-[-0.03em] text-primary-foreground">
                    Thank you. Your private consultation request is now with the team.
                  </h1>
                  <p className="max-w-[40rem] text-base leading-8 text-primary-foreground/76 md:text-[1.05rem]">
                    We have received your submission successfully. Someone from CBI Deal will review it privately and
                    follow up shortly with the most suitable next step.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button asChild size="lg" variant="secondary" className="conversion-primary-button w-full sm:w-auto">
                    <Link href={routes.home}>
                      <House className="size-4" />
                      Back to homepage
                    </Link>
                  </Button>
                  <Link href={routes.programs} className="conversion-secondary-button w-full sm:w-auto">
                    Browse investor programs
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

              <div className="space-y-5">
                <ConsultationThankYouState />

                <Card className="section-card border-white/12 bg-white/[0.06] text-primary-foreground shadow-none">
                  <CardContent className="space-y-5 p-6 md:p-7">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white/[0.1] text-primary-foreground">
                      <ShieldCheck className="size-6" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-[1.4rem] leading-[1.14] text-primary-foreground">What happens next</h2>
                      <p className="text-sm leading-7 text-primary-foreground/72">
                        Your submission is only tracked as a conversion after successful delivery, and this page is only
                        shown after that confirmation.
                      </p>
                    </div>
                    <div className="space-y-3 text-sm leading-7 text-primary-foreground/72">
                      <p>We review the information you shared before arranging the most appropriate reply.</p>
                      <p>If you would like more context while you wait, you can continue exploring the main pathways.</p>
                    </div>
                    <Button asChild variant="outline" className="w-full border-white/20 bg-white/6 text-white hover:bg-white/12 hover:text-white">
                      <Link href={routes.bookConsultation}>
                        <Compass className="size-4" />
                        Return to the consultation page
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
