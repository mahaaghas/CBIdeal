import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarRange, Clock3, Video } from "lucide-react"
import { ctaLinks, schedulerConfig } from "@/lib/site"
import { siteImages } from "@/lib/site-images"
import { getResolvedSiteSettings } from "@/lib/sanity/content"
import { Button } from "@/components/ui/button"

interface MeetingSchedulerCardProps {
  title?: string
  description?: string
  compact?: boolean
}

export async function MeetingSchedulerCard({
  title = "Book a discovery meeting",
  description = "Choose a short introduction call to discuss the CRM, qualified lead delivery, or the right rollout approach for your team.",
  compact = false,
}: MeetingSchedulerCardProps) {
  const settings = await getResolvedSiteSettings()

  return (
    <div className="section-card p-6 md:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-5">
          <span className="eyebrow">Meeting scheduler</span>
          <h3 className="text-2xl text-foreground md:text-3xl">{title}</h3>
          <p className="text-base leading-8 text-muted-foreground">{description}</p>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <CalendarRange className="mt-0.5 size-4 text-primary" />
              <p>Ideal for CRM demos, lead partnership discussions, or rollout scoping calls.</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 size-4 text-primary" />
              <p>Recommended slot length: 20 to 30 minutes for first conversations.</p>
            </div>
            <div className="flex items-start gap-3">
              <Video className="mt-0.5 size-4 text-primary" />
              <p>{schedulerConfig.helperText}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" asChild>
              <Link href={settings.bookingUrl} target="_blank" rel="noreferrer">
                Book a meeting
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href={ctaLinks.contactSales}>Contact sales instead</Link>
            </Button>
          </div>
        </div>

        <div className={compact ? "rounded-[28px] border border-border/70 bg-muted/40 p-5" : "rounded-[28px] border border-border/70 bg-muted/40 p-6"}>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Booking preview</p>
              <p className="text-sm text-muted-foreground">{schedulerConfig.provider}</p>
            </div>
            <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              20 to 30 minutes
            </span>
          </div>
          <div className="relative overflow-hidden rounded-[24px] border border-background/80 bg-background/80">
            <div className="relative h-56">
              <Image src={siteImages.stockholmNight.src} alt={siteImages.stockholmNight.alt} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur">
                <p className="text-sm font-medium text-primary-foreground">Real booking link</p>
                <p className="mt-2 text-sm leading-7 text-primary-foreground/75">
                  Open Calendly in a new tab to choose the slot that suits your team best.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-border/80 bg-background/70 px-4 py-4 text-sm leading-7 text-muted-foreground">
            Prefer email first? Use the fallback CTA and we will coordinate the right next step directly with your team.
          </div>
        </div>
      </div>
    </div>
  )
}
