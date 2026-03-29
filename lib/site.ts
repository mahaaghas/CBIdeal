import { getMessages } from "@/lib/i18n/messages"
import { localizeHref, type Locale } from "@/lib/i18n/routing"
import { siteConfig } from "@/lib/site-config"

export { siteConfig }

export const brandConfig = siteConfig.brand
export const siteMetadata = siteConfig.metadata
export const routeLinks = siteConfig.links.routes
export const ctaLinks = siteConfig.links.cta
export const socialLinks = siteConfig.socialLinks
export const legalDetails = siteConfig.legal
export const footerConfig = siteConfig.footer

export const contactDetails = {
  investorEmail: siteConfig.contact.supportEmail,
  companyEmail: siteConfig.contact.salesEmail,
  phone: siteConfig.contact.phone,
  whatsapp: siteConfig.contact.whatsapp,
  location: siteConfig.legal.location,
}

export const schedulerConfig = {
  provider: siteConfig.scheduling.provider,
  bookingUrl: siteConfig.scheduling.bookingUrl,
  helperText: siteConfig.scheduling.helperText,
}

export const mainNavLinks = [
  { href: routeLinks.home, label: "Home" },
  { href: routeLinks.programs, label: "Programs" },
  { href: routeLinks.forCompanies, label: "Work with us" },
  { href: routeLinks.insights, label: "Insights" },
  { href: routeLinks.pricing, label: "Engagement" },
  { href: routeLinks.contact, label: "Contact" },
]

export const footerNavLinks = footerConfig.exploreLinks
export const footerLegalLinks = footerConfig.legalLinks
export const footerCompanyFocus = footerConfig.companyFocusItems

export const pricingPlans = siteConfig.pricing.plans
export const futureLandingExamples = siteConfig.futureLandingExamples

export function getLocalizedRouteLinks(locale: Locale) {
  return Object.fromEntries(
    Object.entries(routeLinks).map(([key, href]) => [key, localizeHref(locale, href)]),
  ) as typeof routeLinks
}

export function getLocalizedCtaLinks(locale: Locale) {
  return Object.fromEntries(
    Object.entries(ctaLinks).map(([key, href]) => [key, localizeHref(locale, href)]),
  ) as typeof ctaLinks
}

export function getLocalizedMainNavLinks(locale: Locale) {
  const messages = getMessages(locale)
  const localizedRoutes = getLocalizedRouteLinks(locale)

  return [
    { href: localizedRoutes.home, label: messages.nav.home },
    { href: localizedRoutes.programs, label: messages.nav.programs },
    { href: localizedRoutes.forCompanies, label: messages.nav.forCompanies },
    { href: localizedRoutes.insights, label: messages.nav.insights },
    { href: localizedRoutes.pricing, label: messages.nav.pricing },
    { href: localizedRoutes.contact, label: messages.nav.contact },
  ]
}

export function getLocalizedFooterNavLinks(locale: Locale) {
  const messages = getMessages(locale)
  const localizedRoutes = getLocalizedRouteLinks(locale)

  return [
    { href: localizedRoutes.home, label: messages.nav.home },
    {
      href: localizedRoutes.about,
      label: locale === "ar" ? "نهجنا" : locale === "ru" ? "Наш подход" : "Our approach",
    },
    { href: localizedRoutes.programs, label: messages.nav.programs },
    { href: localizedRoutes.forCompanies, label: messages.nav.forCompanies },
    { href: localizedRoutes.insights, label: messages.nav.insights },
    { href: localizedRoutes.pricing, label: messages.nav.pricing },
  ]
}

export function getLocalizedFooterLegalLinks(locale: Locale) {
  const localizedRoutes = getLocalizedRouteLinks(locale)
  return [
    {
      href: localizedRoutes.dataProtection,
      label: locale === "ar" ? "حماية البيانات" : locale === "ru" ? "Защита данных" : "Data protection",
    },
    { href: localizedRoutes.contact, label: getMessages(locale).nav.contact },
  ]
}

export function getLocalizedFooterCompanyFocus(locale: Locale) {
  if (locale === "ar") {
    return [
      "مراجعة أولية هادئة",
      "توجيه دولي واضح",
      "تواصل خاص ومنظم",
    ]
  }

  if (locale === "ru") {
    return [
      "Спокойная первичная оценка",
      "Международно ориентированный подход",
      "Частный и структурированный контакт",
    ]
  }

  return footerCompanyFocus
}
