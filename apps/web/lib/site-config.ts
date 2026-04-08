import { getSaasDemoUrl, getSaasLoginUrl, getSelfServeSignupUrl, saasAppConfig, saasPlans } from "@cbideal/config"

const routeLinks = {
  home: "/",
  about: "/about",
  programs: "/citizenship-by-investment",
  caribbeanComparison: "/caribbean-cbi-comparison",
  bookConsultation: "/book-a-cbi-consultation",
  forCompanies: "/for-companies",
  insights: "/insights",
  pricing: "/pricing",
  contact: "/contact",
  demo: "/demo",
  dataProtection: "/data-protection",
  privacyPolicy: "/privacy-policy",
  privacy: "/privacy",
  partners: "/partners",
} as const

const calendlyBookingUrl = "https://calendly.com/va-agency-hirings/crm-lead-partnership-call"

const ctaLinks = {
  checkEligibility: "/#eligibility",
  bookCompanyCall: `${routeLinks.forCompanies}#meeting`,
  requestDemo: routeLinks.demo,
  viewPricing: routeLinks.pricing,
  contactSales: routeLinks.contact,
  viewDataProtection: routeLinks.dataProtection,
  exploreCompany: routeLinks.forCompanies,
  explorePrograms: routeLinks.programs,
  requestPrivateConsultation: routeLinks.bookConsultation,
  compareCaribbeanPrograms: routeLinks.caribbeanComparison,
  exploreInsights: routeLinks.insights,
  explorePartnerships: routeLinks.partners,
  privacyContact: routeLinks.contact,
  speakToTeam: routeLinks.contact,
  contactIntentDemo: `${routeLinks.contact}?intent=demo`,
  returnHome: routeLinks.home,
  appDemo: getSaasDemoUrl(),
  appLogin: getSaasLoginUrl(),
  appSignupSolo: getSelfServeSignupUrl("solo"),
  appSignupTeam: getSelfServeSignupUrl("team"),
  appSignupBusiness: getSelfServeSignupUrl("business"),
  enterpriseContact: saasAppConfig.enterprisePath,
  requestProductDemo: saasAppConfig.requestDemoPath,
} as const

const pricingPlanCtas = {
  solo: ctaLinks.appSignupSolo,
  team: ctaLinks.appSignupTeam,
  business: ctaLinks.appSignupBusiness,
  enterprise: ctaLinks.enterpriseContact,
} as const

const pricingPlans = saasPlans.map((plan) => ({
  id: plan.id,
  name: plan.name,
  monthlyPrice: plan.monthlyPrice,
  description: plan.description,
  capacityLabel:
    plan.id === "enterprise"
      ? "Tailored implementation"
      : plan.internalSeatLimit === 1
        ? "Single operator workspace"
        : `Up to ${plan.internalSeatLimit} internal users`,
  ctaLabel: plan.id === "enterprise" ? "Contact us" : "Start subscription",
  ctaHref: pricingPlanCtas[plan.id],
  secondaryLabel: plan.secondaryLabel,
  secondaryHref: plan.id === "enterprise" ? ctaLinks.requestPrivateConsultation : ctaLinks.appDemo,
  featured: plan.id === "business",
  badge:
    plan.id === "business"
      ? "Most complete"
      : plan.id === "enterprise"
        ? "Tailored"
        : null,
  features: plan.features,
})) as const

export const siteConfig = {
  siteName: "CBI Deal",
  brand: {
    monogram: "CBI",
    wordmark: "DEAL",
  },
  metadata: {
    siteUrl: "https://www.cbideal.com",
    defaultTitle: "CBI Deal | Private Citizenship and Residency Advisory",
    titleTemplate: "%s | CBI Deal",
    description:
      "CBI Deal offers a structured, discreet starting point for investors and internationally mobile families exploring citizenship and residency by investment options.",
    defaultOgImage: "/hero-bg.png",
  },
  contact: {
    supportEmail: "offers@cbideal.com",
    salesEmail: "sales@cbideal.com",
    phone: "+357 25 010 440",
    whatsapp: "+357 99 245 120",
  },
  scheduling: {
    provider: "Private consultation requests",
    bookingUrl: calendlyBookingUrl,
    helperText:
      "You can request a suitable time for a private conversation in a more discreet format.",
  },
  demo: {
    requestUrl: ctaLinks.requestDemo,
  },
  saas: {
    appUrl: saasAppConfig.appUrl,
    loginUrl: ctaLinks.appLogin,
    demoUrl: ctaLinks.appDemo,
    signupSoloUrl: ctaLinks.appSignupSolo,
    signupTeamUrl: ctaLinks.appSignupTeam,
    signupBusinessUrl: ctaLinks.appSignupBusiness,
  },
  socialLinks: {
    linkedin: "https://www.linkedin.com/company/cbideal",
    x: "https://x.com/cbideal",
    instagram: "https://www.instagram.com/cbideal",
  },
  links: {
    routes: routeLinks,
    cta: ctaLinks,
  },
  pricing: {
    plans: pricingPlans,
  },
  legal: {
    companyName: "CBI Deal",
    location:
      "Cyprus with coverage across Europe, the Caribbean, the Gulf, and other internationally relevant jurisdictions",
    footerSummary:
      "CBI Deal is a structured advisory gateway for investors and internationally mobile families considering citizenship or residency by investment.",
    footerBottomPrimary:
      "The platform is designed around clarity, discretion, and suitability rather than promotional urgency.",
    footerBottomSecondary:
      "All enquiries are handled with a privacy-aware approach appropriate for sensitive cross-border decisions.",
  },
  footer: {
    exploreLinks: [
      { href: routeLinks.home, label: "Home" },
      { href: routeLinks.about, label: "Our approach" },
      { href: routeLinks.programs, label: "Citizenship by investment" },
      { href: routeLinks.forCompanies, label: "Collaborations" },
      { href: routeLinks.insights, label: "Insights" },
      { href: routeLinks.pricing, label: "Solutions" },
    ],
    legalLinks: [
      { href: routeLinks.dataProtection, label: "Data protection" },
      { href: routeLinks.privacyPolicy, label: "Privacy policy" },
      { href: routeLinks.contact, label: "Contact" },
    ],
    companyFocusItems: [
      "Discreet first review",
      "Internationally minded guidance",
      "Private contact routes",
      "Privacy-aware handling",
    ],
  },
  futureLandingExamples: [
    "/turkey-citizenship-by-investment",
    "/caribbean-citizenship",
    "/golden-visa-europe",
    "/residency-by-investment",
  ],
} as const

export type SiteConfig = typeof siteConfig
