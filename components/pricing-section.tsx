"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, ChevronRight } from "lucide-react"
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
  const [billingMode, setBillingMode] = useState<"monthly" | "yearly">("monthly")
  const ctaLinks = getLocalizedCtaLinks(locale)
  const copy = {
    monthly: locale === "ar" ? "شهري" : locale === "ru" ? "Ежемесячно" : "Monthly",
    yearly: locale === "ar" ? "سنوي" : locale === "ru" ? "Ежегодно" : "Yearly",
    savings:
      locale === "ar"
        ? "وفّر ما يعادل شهرين تقريباً مع الفوترة السنوية."
        : locale === "ru"
          ? "Экономия примерно двух месяцев при годовой оплате."
          : "Save roughly two months with annual billing.",
    preview: locale === "ar" ? "عرض الأسعار كاملة" : locale === "ru" ? "Полные тарифы" : "View full pricing",
    bestValue: locale === "ar" ? "أفضل قيمة" : locale === "ru" ? "Лучшее предложение" : "Best value",
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm leading-7 text-muted-foreground">
            Pricing is per user for software seats. Lead partnership setup is scoped separately depending on geography, volume, and qualification rules.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            Annual billing reflects roughly two months saved versus monthly billing.
          </p>
        </div>
        <div className="space-y-2">
          <div className="inline-flex w-full rounded-full border border-border/70 bg-background p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => setBillingMode("monthly")}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium transition sm:flex-none",
                billingMode === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {copy.monthly}
            </button>
            <button
              type="button"
              onClick={() => setBillingMode("yearly")}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium transition sm:flex-none",
                billingMode === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {copy.yearly}
            </button>
          </div>
          <p className="text-xs text-muted-foreground sm:text-right">{copy.savings}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((plan) => {
          const price = billingMode === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
          return (
            <Card
              key={plan.name}
              className={cn(
                "section-card relative overflow-hidden",
                plan.featured ? "border-primary/25 shadow-[0_28px_90px_rgba(28,37,56,0.16)]" : "",
              )}
            >
              <CardContent className="space-y-6 p-7 md:p-8">
                {plan.featured ? (
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">
                    {copy.bestValue}
                  </span>
                ) : null}
                <div className="space-y-3">
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="text-3xl text-foreground">{plan.name}</h3>
                    <span className="text-sm text-muted-foreground">{plan.seats}</span>
                  </div>
                  <p className="fine-print">{plan.description}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-5">
                  {price ? (
                    <>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl text-foreground">EUR {price}</span>
                        <span className="pb-1 text-sm text-muted-foreground">per user / month</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {billingMode === "yearly" ? "Billed annually" : "Flexible monthly billing"}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl text-foreground">Custom</div>
                      <p className="mt-2 text-sm text-muted-foreground">Enterprise teams, custom workflows, and lead partnership options.</p>
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
                <div className="flex flex-col gap-3 border-t border-border/70 pt-2">
                  <Button asChild className="w-full">
                    <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={plan.secondaryHref}>{plan.secondaryLabel}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {preview ? (
        <div className="flex justify-start">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
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
