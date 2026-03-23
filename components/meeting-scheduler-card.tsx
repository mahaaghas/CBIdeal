import Link from "next/link"
import { ArrowRight, CalendarRange, Clock3, ExternalLink, Video } from "lucide-react"
import { getMessages } from "@/lib/i18n/messages"
import { getRequestDirection, getRequestLocale } from "@/lib/i18n/request"
import { getLocalizedCtaLinks, schedulerConfig } from "@/lib/site"
import { getResolvedSiteSettings } from "@/lib/sanity/content"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const locale = getRequestLocale()
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const messages = getMessages(locale)
  const ctaLinks = getLocalizedCtaLinks(locale)
  const settings = await getResolvedSiteSettings()

  const copy = {
    eyebrow: locale === "ar" ? "حجز الاجتماع" : locale === "ru" ? "Бронирование встречи" : "Meeting scheduler",
    defaultTitle: locale === "ar" ? "احجز اجتماعًا استكشافيًا" : locale === "ru" ? "Забронируйте встречу-знакомство" : "Book a discovery meeting",
    defaultDescription:
      locale === "ar"
        ? "اختر مكالمة تعريف قصيرة لمناقشة الـ CRM أو العملاء المحتملين المؤهلين أو نهج الإطلاق المناسب لفريقك."
        : locale === "ru"
          ? "Выберите короткий вводный звонок, чтобы обсудить CRM, квалифицированные лиды или подходящий формат запуска для вашей команды."
          : "Choose a short introduction call to discuss the CRM, qualified lead delivery, or the right rollout approach for your team.",
    ideal:
      locale === "ar"
        ? "مناسب لعروض CRM ومناقشات شراكات العملاء المحتملين أو مكالمات تحديد نطاق الإطلاق."
        : locale === "ru"
          ? "Подходит для CRM-демо, обсуждения лид-партнерства и звонков по определению rollout-плана."
          : "Ideal for CRM demos, lead partnership discussions, or rollout scoping calls.",
    timing:
      locale === "ar"
        ? "المدة الموصى بها للمكالمة الأولى: من 20 إلى 30 دقيقة."
        : locale === "ru"
          ? "Рекомендуемая продолжительность первой беседы: 20–30 минут."
          : "Recommended slot length: 20 to 30 minutes for first conversations.",
    availability:
      locale === "ar"
        ? "حجز مباشر عبر Calendly"
        : locale === "ru"
          ? "Прямое бронирование через Calendly"
          : "Live booking via Calendly",
    availabilityBody:
      locale === "ar"
        ? "استخدم الرابط المباشر لفتح جدول المواعيد الحقيقي واختيار الوقت الذي يناسب فريقك."
        : locale === "ru"
          ? "Используйте прямую ссылку, чтобы открыть реальный календарь слотов и выбрать удобное время."
          : "Use the direct link to open the real scheduling calendar and choose a time that fits.",
    realLink:
      locale === "ar" ? "رابط حجز حقيقي" : locale === "ru" ? "Реальная ссылка на бронь" : "Real booking link",
    realLinkBody:
      locale === "ar"
        ? "سيفتح Calendly في علامة تبويب جديدة حتى تتمكن من اختيار الموعد الأنسب مباشرة."
        : locale === "ru"
          ? "Calendly откроется в новой вкладке, чтобы вы могли выбрать подходящий слот напрямую."
          : "Calendly opens in a new tab so you can choose the most suitable slot directly.",
    directOpen:
      locale === "ar"
        ? "افتح الجدول المباشر"
        : locale === "ru"
          ? "Открыть живое расписание"
          : "Open live scheduler",
    fallback:
      locale === "ar"
        ? "تفضل البدء عبر البريد؟ استخدم زر التواصل البديل وسننسق الخطوة التالية مباشرة مع فريقك."
        : locale === "ru"
          ? "Предпочитаете сначала email? Используйте запасной CTA, и мы скоординируем следующий шаг напрямую с вашей командой."
          : "Prefer email first? Use the fallback CTA and we will coordinate the right next step directly with your team.",
    duration: locale === "ar" ? "20 إلى 30 دقيقة" : locale === "ru" ? "20–30 минут" : "20 to 30 minutes",
  }

  const resolvedTitle = title === "Book a discovery meeting" ? copy.defaultTitle : title
  const resolvedDescription =
    description === "Choose a short introduction call to discuss the CRM, qualified lead delivery, or the right rollout approach for your team."
      ? copy.defaultDescription
      : description

  return (
    <div className="section-card p-6 md:p-10">
      <div dir={direction} className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className={cn("space-y-5", isRtl && "text-right")}>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h3 className="text-2xl text-foreground md:text-3xl">{resolvedTitle}</h3>
          <p className="text-base leading-8 text-muted-foreground">{resolvedDescription}</p>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse")}>
              <CalendarRange className="mt-0.5 size-4 text-primary" />
              <p>{copy.ideal}</p>
            </div>
            <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse")}>
              <Clock3 className="mt-0.5 size-4 text-primary" />
              <p>{copy.timing}</p>
            </div>
            <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse")}>
              <Video className="mt-0.5 size-4 text-primary" />
              <p>{schedulerConfig.helperText}</p>
            </div>
          </div>

          <div className={cn("flex flex-col gap-3 sm:flex-row", isRtl && "sm:flex-row-reverse")}>
            <Button className="w-full sm:w-auto" asChild>
              <Link href={settings.bookingUrl} target="_blank" rel="noreferrer">
                {messages.ctas.bookCompanyCall}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href={ctaLinks.contactSales}>{messages.ctas.contactSales}</Link>
            </Button>
          </div>
        </div>

        <div className={compact ? "rounded-[28px] border border-border/70 bg-muted/40 p-5" : "rounded-[28px] border border-border/70 bg-muted/40 p-6"}>
          <div className={cn("mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", isRtl && "sm:flex-row-reverse")}>
            <div>
              <p className="text-sm font-semibold text-foreground">{copy.availability}</p>
              <p className="text-sm text-muted-foreground">{schedulerConfig.provider}</p>
            </div>
            <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              {copy.duration}
            </span>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-background/85 p-5 md:p-6">
            <div className="space-y-5">
              <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-4">
                <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ExternalLink className="size-4" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">{copy.realLink}</p>
                    <p className="text-sm leading-7 text-muted-foreground">{copy.availabilityBody}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-border/80 px-4 py-4">
                <p className="text-sm font-medium text-foreground">{copy.availability}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{copy.realLinkBody}</p>
              </div>

              <Button className="w-full" asChild>
                <Link href={settings.bookingUrl} target="_blank" rel="noreferrer">
                  {copy.directOpen}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-border/80 bg-background/70 px-4 py-4 text-sm leading-7 text-muted-foreground">
            {copy.fallback}
          </div>
        </div>
      </div>
    </div>
  )
}
