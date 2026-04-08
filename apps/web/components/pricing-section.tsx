"use client"

import Link from "next/link"
import { ArrowUpRight, Check, ChevronRight } from "lucide-react"
import { getLocalizedCtaLinks, pricingPlans } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Locale } from "@/lib/i18n/routing"

interface PricingSectionProps {
  locale?: Locale
  preview?: boolean
}

export function PricingSection({ locale = "en", preview = false }: PricingSectionProps) {
  const ctaLinks = getLocalizedCtaLinks(locale)
  const copy = {
    introduction:
      locale === "ar"
        ? "تم ترتيب الخطط الأربع بوضوح حتى تكون نقطة الدخول الصحيحة واضحة من البداية: اشتراك مباشر، مشاهدة العرض، أو تواصل مخصص."
        : locale === "ru"
          ? "Четыре плана собраны так, чтобы следующий шаг был понятен сразу: прямое оформление, просмотр демо или отдельный контакт по Enterprise."
          : "The pricing structure is arranged so the next step stays obvious from the outset: subscribe directly, open the demo, or move into a higher-touch enterprise conversation.",
    supporting:
      locale === "ar"
        ? "الهيكل الذاتي مخصص لخطط Solo و Team و Business. أما Enterprise فيبقى مسار تواصل منفصل حتى تتم مناقشة النطاق والتنفيذ بصورة مناسبة."
        : locale === "ru"
          ? "Самостоятельное оформление доступно для Solo, Team и Business. Enterprise остаётся отдельным маршрутом, чтобы масштаб, внедрение и структура доступа были согласованы заранее."
          : "Solo, Team, and Business move through the self-serve signup and Stripe flow. Enterprise stays on a contact-led route so scope, integration, and rollout can be handled properly.",
    priceSuffix: locale === "ar" ? "شهرياً" : locale === "ru" ? "в месяц" : "per month",
    customPrice: locale === "ar" ? "Custom" : locale === "ru" ? "Custom" : "Custom",
    customNote:
      locale === "ar"
        ? "تواصل مباشر لتحديد الهيكل والنطاق والتنفيذ."
        : locale === "ru"
          ? "Прямой контакт для согласования структуры, масштаба и внедрения."
          : "Direct contact for tailored structure, scope, and implementation.",
    preview: locale === "ar" ? "عرض جميع الحلول" : locale === "ru" ? "Все решения" : "View all solutions",
  }

  return (
    <div className="space-y-9 md:space-y-10">
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-3">
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-[0.98rem]">
            {copy.introduction}
          </p>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-[0.98rem]">
            {copy.supporting}
          </p>
        </div>
        <div className="rounded-[28px] border border-border/70 bg-[linear-gradient(135deg,rgba(246,241,232,0.7),rgba(255,255,255,0.92))] p-6 shadow-[0_18px_50px_rgba(28,37,56,0.08)]">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Public plan structure
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {pricingPlans
              .filter((plan) => plan.monthlyPrice !== null)
              .map((plan) => (
                <div key={plan.id} className="rounded-[20px] border border-border/60 bg-background/88 px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                  <p className="mt-2 text-2xl text-foreground">USD {plan.monthlyPrice}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-4">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "section-card h-full overflow-hidden rounded-[30px] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,243,236,0.88))] shadow-[0_20px_65px_rgba(28,37,56,0.08)]",
              plan.featured ? "border-primary/30 shadow-[0_26px_80px_rgba(28,37,56,0.14)]" : "",
            )}
          >
            <CardContent className="flex h-full flex-col gap-7 p-7 md:p-8">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      {plan.id === "enterprise" ? "Advisory route" : "Self-serve plan"}
                    </p>
                    <h3 className="text-[2rem] leading-[1.02] text-foreground">{plan.name}</h3>
                  </div>
                  {plan.badge ? (
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em]",
                        plan.featured
                          ? "bg-primary text-primary-foreground"
                          : "border border-border/70 bg-background/80 text-muted-foreground",
                      )}
                    >
                      {plan.badge}
                    </span>
                  ) : null}
                </div>
                <p className="min-h-[84px] text-[0.98rem] leading-7 text-muted-foreground">{plan.description}</p>
              </div>

              <div className="rounded-[24px] border border-border/70 bg-background/88 p-5">
                {plan.monthlyPrice !== null ? (
                  <>
                    <div className="flex items-end gap-2">
                      <span className="text-[2.55rem] leading-none text-foreground">USD {plan.monthlyPrice}</span>
                      <span className="pb-1 text-sm text-muted-foreground">{copy.priceSuffix}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{plan.capacityLabel}</p>
                  </>
                ) : (
                  <>
                    <div className="text-[2.55rem] leading-none text-foreground">{copy.customPrice}</div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.customNote}</p>
                  </>
                )}
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                    <Check className="mt-1 size-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-3 border-t border-border/70 pt-5">
                <Button asChild className="h-12 w-full rounded-full text-sm font-semibold">
                  <Link href={plan.ctaHref}>
                    {plan.ctaLabel}
                    {plan.id === "enterprise" ? <ArrowUpRight className="size-4" /> : null}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-12 w-full rounded-full text-sm font-semibold">
                  <Link href={plan.secondaryHref}>{plan.secondaryLabel}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {preview ? (
        <div className="flex justify-start">
          <Button variant="outline" className="w-full rounded-full sm:w-auto" asChild>
            <Link href={ctaLinks.viewPricing}>
              {copy.preview}
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  )
}
