"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { getMessages } from "@/lib/i18n/messages"
import { locales, replacePathLocale, type Locale } from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
  locale: Locale
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const messages = getMessages(locale)
  const isRtl = locale === "ar"

  return (
    <div className={cn("inline-flex items-center gap-2", isRtl && "flex-row-reverse")}>
      <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground lg:inline">
        {messages.languageSwitch}
      </span>
      <div className="inline-flex rounded-full border border-border/70 bg-background/85 p-1">
        {locales.map((targetLocale) => (
          <Link
            key={targetLocale}
            href={replacePathLocale(pathname, targetLocale)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition",
              locale === targetLocale ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {targetLocale}
          </Link>
        ))}
      </div>
    </div>
  )
}
