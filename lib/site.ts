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
  { href: routeLinks.forCompanies, label: "For Companies" },
  { href: routeLinks.insights, label: "Insights" },
  { href: routeLinks.pricing, label: "Pricing" },
  { href: routeLinks.contact, label: "Contact" },
]

export const footerNavLinks = footerConfig.exploreLinks
export const footerLegalLinks = footerConfig.legalLinks
export const footerCompanyFocus = footerConfig.companyFocusItems

export const pricingPlans = siteConfig.pricing.plans
export const futureLandingExamples = siteConfig.futureLandingExamples
