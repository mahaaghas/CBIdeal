"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  applyConsentPreferences,
  CONSENT_STORAGE_KEY,
  getConsentPreferencesLabel,
  getDefaultConsentPreferences,
  getPrivacyPolicyHref,
  persistConsentPreferences,
  readStoredConsentPreferences,
  type ConsentPreferences,
} from "@/lib/consent"
import type { Locale } from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"

interface ConsentBannerProps {
  locale: Locale
  direction: "ltr" | "rtl"
}

function buildCopy(locale: Locale) {
  if (locale === "ar") {
    return {
      eyebrow: "إعدادات الخصوصية",
      title: "نستخدم ملفات تعريف الارتباط وتقنيات القياس لتحسين الموقع وقياس الاستفسارات الإعلانية بشكل مسؤول.",
      description:
        "يمكنكم قبول التحليلات والإعلانات، رفض غير الضروري، أو تخصيص تفضيلاتكم. تساعدنا هذه الخيارات على تشغيل Google Analytics وميزات قياس وإعلانات Google بما يتوافق مع متطلبات الموافقة.",
      necessary: "ملفات أساسية",
      necessaryDescription: "مطلوبة لتشغيل الموقع، الأمان، وتسليم الصفحات.",
      analytics: "التحليلات",
      analyticsDescription: "قياس الاستخدام وتحسين الأداء عبر Google Analytics.",
      ads: "الإعلانات والقياس",
      adsDescription: "دعم قياس الإعلانات، إعادة الاستهداف، وتخصيص الإعلانات عند السماح بذلك.",
      acceptAll: "قبول الكل",
      reject: "رفض غير الضروري",
      manage: "تخصيص",
      save: "حفظ التفضيلات",
      policy: "قراءة سياسة الخصوصية",
    }
  }

  if (locale === "ru") {
    return {
      eyebrow: "Настройки конфиденциальности",
      title: "Мы используем cookie и технологии измерения, чтобы улучшать сайт и ответственно оценивать рекламные обращения.",
      description:
        "Вы можете принять аналитику и рекламу, отклонить необязательное или настроить предпочтения. Это помогает нам использовать Google Analytics и рекламные функции Google в рамках требований по согласию.",
      necessary: "Необходимые",
      necessaryDescription: "Нужны для работы сайта, безопасности и доставки страниц.",
      analytics: "Аналитика",
      analyticsDescription: "Измерение использования и улучшение производительности через Google Analytics.",
      ads: "Реклама и измерение",
      adsDescription: "Поддержка измерения рекламы, ремаркетинга и персонализации рекламы при наличии разрешения.",
      acceptAll: "Принять все",
      reject: "Отклонить необязательное",
      manage: "Настроить",
      save: "Сохранить настройки",
      policy: "Открыть политику конфиденциальности",
    }
  }

  return {
    eyebrow: "Privacy settings",
    title: "We use cookies and measurement technologies to improve the site and measure advertising-related enquiries responsibly.",
    description:
      "You can accept analytics and advertising, reject non-essential tools, or customize your preferences. These choices help us run Google Analytics and Google advertising features in a consent-aware way.",
    necessary: "Necessary",
    necessaryDescription: "Required for site operation, security, and page delivery.",
    analytics: "Analytics",
    analyticsDescription: "Measure usage and improve performance through Google Analytics.",
    ads: "Advertising and measurement",
    adsDescription: "Support ad measurement, remarketing, and ad personalization when permitted.",
    acceptAll: "Accept all",
    reject: "Reject non-essential",
    manage: "Customize",
    save: "Save preferences",
    policy: "Read privacy policy",
  }
}

export function ConsentBanner({ locale, direction }: ConsentBannerProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>(getDefaultConsentPreferences)
  const copy = useMemo(() => buildCopy(locale), [locale])

  useEffect(() => {
    setMounted(true)
    const stored = readStoredConsentPreferences()
    if (stored) {
      setPreferences(stored)
      setIsOpen(false)
      return
    }

    setIsOpen(true)
  }, [])

  const savePreferences = (nextPreferences: ConsentPreferences) => {
    persistConsentPreferences(nextPreferences)
    applyConsentPreferences(nextPreferences)
    setPreferences(nextPreferences)
    setIsOpen(false)
    setIsCustomizing(false)
    window.dispatchEvent(new CustomEvent("cbi-consent-updated", { detail: nextPreferences }))
  }

  if (!mounted || !isOpen) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 pt-6 sm:px-6 lg:px-8" dir={direction}>
      <div className="mx-auto w-full max-w-6xl">
        <div className="section-card overflow-hidden border-white/70 shadow-[0_24px_70px_rgba(18,24,39,0.18)]">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5 p-6 md:p-8">
              <div className="space-y-3">
                <span className="eyebrow">
                  <ShieldCheck className="size-3.5" />
                  {copy.eyebrow}
                </span>
                <h2 className="max-w-3xl text-[1.6rem] leading-[1.15] tracking-[-0.025em] text-foreground md:text-[1.95rem]">
                  {copy.title}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-[0.96rem]">
                  {copy.description}
                </p>
              </div>

              <div className={cn("flex flex-wrap gap-3", direction === "rtl" && "justify-end")}>
                <Button
                  className="rounded-full px-5"
                  onClick={() =>
                    savePreferences({
                      analytics: true,
                      ads: true,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                >
                  {copy.acceptAll}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-5"
                  onClick={() =>
                    savePreferences({
                      analytics: false,
                      ads: false,
                      updatedAt: new Date().toISOString(),
                    })
                  }
                >
                  {copy.reject}
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-full px-3 text-foreground"
                  onClick={() => setIsCustomizing((value) => !value)}
                >
                  {copy.manage}
                </Button>
                <Button variant="link" className="h-auto px-0 text-sm text-primary" asChild>
                  <Link href={getPrivacyPolicyHref(locale)}>{copy.policy}</Link>
                </Button>
              </div>
            </div>

            <div className="border-t border-border/70 bg-muted/20 p-6 md:p-8 lg:border-l lg:border-t-0">
              <div className="space-y-4">
                <div className="rounded-[24px] border border-border/70 bg-background/80 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-foreground">{copy.necessary}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">{copy.necessaryDescription}</p>
                    </div>
                    <span className="rounded-full border border-border/80 bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      On
                    </span>
                  </div>
                </div>

                {isCustomizing ? (
                  <>
                    <div className="rounded-[24px] border border-border/70 bg-background/80 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-foreground">{copy.analytics}</h3>
                          <p className="text-sm leading-6 text-muted-foreground">{copy.analyticsDescription}</p>
                        </div>
                        <Switch
                          checked={preferences.analytics}
                          onCheckedChange={(checked) =>
                            setPreferences((current) => ({
                              ...current,
                              analytics: checked,
                            }))
                          }
                          aria-label={copy.analytics}
                        />
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-border/70 bg-background/80 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-foreground">{copy.ads}</h3>
                          <p className="text-sm leading-6 text-muted-foreground">{copy.adsDescription}</p>
                        </div>
                        <Switch
                          checked={preferences.ads}
                          onCheckedChange={(checked) =>
                            setPreferences((current) => ({
                              ...current,
                              ads: checked,
                            }))
                          }
                          aria-label={copy.ads}
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full rounded-full"
                      onClick={() =>
                        savePreferences({
                          ...preferences,
                          updatedAt: new Date().toISOString(),
                        })
                      }
                    >
                      {copy.save}
                    </Button>
                  </>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-border/80 bg-background/60 p-4">
                    <p className="text-sm leading-6 text-muted-foreground">
                      {getConsentPreferencesLabel(locale)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {locale === "ar"
                        ? "يمكنكم فتح التخصيص للتحكم في التحليلات والإعلانات بشكل منفصل."
                        : locale === "ru"
                          ? "Откройте настройку, чтобы отдельно управлять аналитикой и рекламными технологиями."
                          : "Open customization to control analytics and advertising technologies separately."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
