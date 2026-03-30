export const locales = ["en", "ar", "ru"] as const
export const defaultLocale = "en" as const

export type Locale = (typeof locales)[number]

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function getDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr"
}

export function localizeHref(locale: Locale, href: string) {
  if (!href) return href
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href
  }
  if (href.startsWith("#")) {
    return href
  }

  const [pathWithMaybeQuery, hash = ""] = href.split("#")
  const [path = "", query = ""] = pathWithMaybeQuery.split("?")

  if (!path.startsWith("/")) {
    return href
  }

  const normalizedPath = path === "/" ? "" : path
  const localizedPath = locale === defaultLocale ? normalizedPath || "/" : `/${locale}${normalizedPath || ""}`
  const withQuery = query ? `${localizedPath}?${query}` : localizedPath

  return hash ? `${withQuery}#${hash}` : withQuery
}

export function stripLocalePrefix(pathname: string) {
  const segments = pathname.split("/")
  const first = segments[1]

  if (isLocale(first)) {
    const rest = pathname.replace(new RegExp(`^/${first}(?=/|$)`), "") || "/"
    return rest.startsWith("/") ? rest : `/${rest}`
  }

  return pathname || "/"
}

export function replacePathLocale(pathname: string, locale: Locale) {
  const bare = stripLocalePrefix(pathname)
  return localizeHref(locale, bare)
}

export function getAlternateLanguageLinks(path: string) {
  return {
    en: localizeHref("en", path),
    ar: localizeHref("ar", path),
    ru: localizeHref("ru", path),
    "x-default": localizeHref("en", path),
  } as const
}
