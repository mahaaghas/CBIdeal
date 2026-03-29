import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getRequestDirection, getRequestLocale } from "@/lib/i18n/request"
import { cn } from "@/lib/utils"

interface LinkItem {
  title: string
  description: string
  href: string
}

interface LandingLinkGridProps {
  items: LinkItem[]
}

export function LandingLinkGrid({ items }: LandingLinkGridProps) {
  const locale = getRequestLocale()
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const actionLabel = locale === "ar" ? "عرض الصفحة" : locale === "ru" ? "Открыть страницу" : "View page"

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.href} className="section-card h-full">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
            <div className={cn("space-y-3", isRtl && "text-right")}>
              <h3 className="text-xl leading-tight text-foreground">{item.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
            </div>
            <Link
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80",
                isRtl && "flex-row-reverse self-end",
              )}
            >
              {actionLabel}
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
