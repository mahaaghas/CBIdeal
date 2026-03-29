import Link from "next/link"
import { ArrowRight, Clock3, LockKeyhole, MessageSquareQuote, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRequestDirection, getRequestLocale } from "@/lib/i18n/request"
import { getLocalizedCtaLinks } from "@/lib/site"
import { getResolvedSiteSettings } from "@/lib/sanity/content"
import { cn } from "@/lib/utils"

interface MeetingSchedulerCardProps {
  title?: string
  description?: string
  compact?: boolean
}

export async function MeetingSchedulerCard({
  title,
  description,
  compact = false,
}: MeetingSchedulerCardProps) {
  const locale = getRequestLocale()
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const ctaLinks = getLocalizedCtaLinks(locale)
  const settings = await getResolvedSiteSettings()

  const copy =
    locale === "ar"
      ? {
          eyebrow: "استشارة خاصة",
          defaultTitle: "اطلب استشارة خاصة",
          defaultDescription:
            "تمنحك هذه الخطوة الأولى مساحة أكثر هدوءاً لفهم مدى ملاءمة المسار، وما إذا كان من المناسب الانتقال إلى نقاش أوسع.",
          suitability: "مناسبة للحالات التي تحتاج إلى مراجعة أوضح قبل اتخاذ قرار فعلي.",
          duration: "غالباً ما تكفي 20 إلى 30 دقيقة للمحادثة الأولى.",
          discretion: "تتم المحادثة بأسلوب خاص ومنظم ومن دون أي التزام بالمتابعة.",
          cardTitle: "ما الذي تضيفه هذه الخطوة؟",
          cardBody:
            "تساعد هذه المحادثة الأولية على ترتيب الصورة العامة، وتوضيح الأولويات، وتحديد ما إذا كان من المناسب الاستمرار في مسار أكثر تفصيلاً.",
          note:
            "نراجع الحالات بعدد محدود ونمنح الأولوية للطلبات الجادة والواضحة من البداية.",
          primary: "اطلب الاستشارة",
          secondary: "اطلب معاودة الاتصال",
        }
      : locale === "ru"
        ? {
            eyebrow: "Частная консультация",
            defaultTitle: "Запросить частную консультацию",
            defaultDescription:
              "Этот первый шаг даёт более спокойный формат, чтобы понять, насколько маршрут подходит именно вам и стоит ли переходить к более подробному обсуждению.",
            suitability: "Подходит, когда перед следующим решением нужен более ясный и конфиденциальный разговор.",
            duration: "Для первого разговора обычно достаточно 20–30 минут.",
            discretion: "Беседа проходит в частном, структурированном формате и не создаёт обязательств продолжать.",
            cardTitle: "Что даёт этот разговор",
            cardBody:
              "Он помогает выстроить общую картину, уточнить приоритеты и понять, есть ли основания двигаться дальше более предметно.",
            note:
              "Мы работаем с ограниченным числом обращений и отдаём приоритет серьёзным, хорошо продуманным запросам.",
            primary: "Запросить консультацию",
            secondary: "Запросить обратный звонок",
          }
        : {
            eyebrow: "Private consultation",
            defaultTitle: "Request a private consultation",
            defaultDescription:
              "This initial step offers a calmer format for understanding whether a route is suitable and whether a more detailed discussion would be worthwhile.",
            suitability: "Useful where a clearer review is needed before any more formal decision is made.",
            duration: "A first discussion is usually well covered in 20 to 30 minutes.",
            discretion: "Handled in a private and structured format, without any obligation to continue.",
            cardTitle: "What this conversation is for",
            cardBody:
              "It helps bring structure to the broader picture, clarify priorities, and determine whether a more detailed next step would be appropriate.",
            note:
              "We work with a limited number of cases and prioritise serious enquiries that benefit from a more considered first exchange.",
            primary: "Request consultation",
            secondary: "Write to us instead",
          }

  const resolvedTitle = title ?? copy.defaultTitle
  const resolvedDescription = description ?? copy.defaultDescription

  return (
    <div className="section-card p-6 md:p-9">
      <div dir={direction} className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(19rem,0.92fr)] lg:items-center">
        <div className={cn("section-stack", isRtl && "text-right")}>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h3 className="max-w-[18ch] text-[2rem] leading-[1.12] text-foreground md:text-[2.35rem]">{resolvedTitle}</h3>
          <p className="max-w-[34rem] text-base leading-8 text-muted-foreground">{resolvedDescription}</p>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse")}>
              <MessageSquareQuote className="mt-0.5 size-4 text-primary" />
              <p>{copy.suitability}</p>
            </div>
            <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse")}>
              <Clock3 className="mt-0.5 size-4 text-primary" />
              <p>{copy.duration}</p>
            </div>
            <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse")}>
              <LockKeyhole className="mt-0.5 size-4 text-primary" />
              <p>{copy.discretion}</p>
            </div>
          </div>

          <div className={cn("flex flex-col gap-3 sm:flex-row", isRtl && "sm:flex-row-reverse")}>
            <Button className="w-full sm:w-auto" asChild>
              <Link href={settings.bookingUrl} target="_blank" rel="noreferrer">
                {copy.primary}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href={ctaLinks.contactSales}>{copy.secondary}</Link>
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "rounded-[28px] border border-border/70 bg-muted/35",
            compact ? "p-5" : "p-6",
          )}
        >
          <div className="rounded-[24px] border border-border/70 bg-background/88 p-5 md:p-6">
            <div className="space-y-5">
              <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">{copy.cardTitle}</p>
                  <p className="text-sm leading-7 text-muted-foreground">{copy.cardBody}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-border/80 px-4 py-4">
                <p className="text-sm leading-7 text-muted-foreground">{copy.note}</p>
              </div>

              <Button className="w-full" asChild>
                <Link href={settings.bookingUrl} target="_blank" rel="noreferrer">
                  {copy.primary}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
