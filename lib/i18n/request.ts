import { headers } from "next/headers"
import { defaultLocale, getDirection, isLocale, type Locale } from "@/lib/i18n/routing"

export function getRequestLocale(): Locale {
  const headerLocale = headers().get("x-locale")
  return headerLocale && isLocale(headerLocale) ? headerLocale : defaultLocale
}

export function getRequestDirection() {
  return getDirection(getRequestLocale())
}

export function getRequestPathname() {
  return headers().get("x-pathname") || "/"
}
