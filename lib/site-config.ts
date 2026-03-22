const routeLinks = {
  home: "/",
  programs: "/citizenship-by-investment",
  forCompanies: "/for-companies",
  insights: "/insights",
  pricing: "/pricing",
  contact: "/contact",
  demo: "/demo",
  dataProtection: "/data-protection",
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
  exploreInsights: routeLinks.insights,
  explorePartnerships: routeLinks.partners,
  privacyContact: routeLinks.contact,
  speakToTeam: routeLinks.contact,
  contactIntentDemo: `${routeLinks.contact}?intent=demo`,
  returnHome: routeLinks.home,
} as const

const pricingPlans = [
  {
    name: "Starter",
    monthlyPrice: 39,
    yearlyPrice: 31,
    description:
      "For small immigration desks that need lead intake, follow-up structure, and a clean starting workflow.",
    seats: "Up to 3 users",
    ctaLabel: "Try guided demo",
    ctaHref: ctaLinks.requestDemo,
    secondaryLabel: "Contact sales",
    secondaryHref: ctaLinks.contactSales,
    featured: false,
    features: [
      "Lead pipeline and enquiry capture",
      "Client records and internal notes",
      "Basic follow-up reminders",
      "Program and case categorization",
      "Email support during rollout",
    ],
  },
  {
    name: "Growth",
    monthlyPrice: 69,
    yearlyPrice: 55,
    description:
      "For firms that want deeper visibility across teams, stronger reporting, and lead partnership readiness.",
    seats: "Up to 10 users",
    ctaLabel: "Book a demo",
    ctaHref: ctaLinks.requestDemo,
    secondaryLabel: "View full pricing",
    secondaryHref: ctaLinks.viewPricing,
    featured: true,
    features: [
      "Everything in Starter",
      "Multi-user pipeline ownership",
      "Reporting visibility and workload tracking",
      "Partner and referrer management",
      "Priority onboarding guidance",
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description:
      "For larger passport companies, multi-office firms, or teams combining CRM rollout with qualified lead partnerships.",
    seats: "Custom rollout",
    ctaLabel: "Contact sales",
    ctaHref: ctaLinks.contactSales,
    secondaryLabel: "Book a strategy call",
    secondaryHref: ctaLinks.bookCompanyCall,
    featured: false,
    features: [
      "Custom workflows and access structure",
      "White-label and partner options",
      "Lead partnership commercial setup",
      "Guided migration planning",
      "Custom support and rollout design",
    ],
  },
] as const

export const siteConfig = {
  siteName: "CBI Deal",
  brand: {
    monogram: "CBI",
    wordmark: "DEAL",
  },
  metadata: {
    siteUrl: "https://www.cbideal.com",
    defaultTitle: "CBI Deal | Citizenship Advisory and Immigration CRM",
    titleTemplate: "%s | CBI Deal",
    description:
      "CBI Deal helps investors evaluate citizenship and residency by investment programs while giving immigration firms a serious CRM built for compliant intake, case management, and partner growth.",
    defaultOgImage: "/hero-bg.png",
  },
  contact: {
    supportEmail: "offers@cbideal.com",
    salesEmail: "sales@cbideal.com",
    phone: "+357 25 010 440",
    whatsapp: "+357 99 245 120",
  },
  scheduling: {
    provider: "Calendly",
    bookingUrl: calendlyBookingUrl,
    helperText:
      "Calendly opens in a new tab for a short introduction call focused on CRM rollout, qualified leads, or both.",
  },
  demo: {
    requestUrl: ctaLinks.requestDemo,
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
      "Cyprus with provider and partner coverage across Europe, the Caribbean, and the Middle East",
    footerSummary:
      "CBI Deal helps investors compare suitable citizenship and residency options while giving immigration firms a cleaner way to manage leads, demos, and follow-up.",
    footerBottomPrimary:
      "CBI Deal brings investor enquiries, company pages, demos, and specialist immigration workflows together under one domain.",
    footerBottomSecondary:
      "All enquiries are handled with a privacy-aware approach designed for sensitive investor and company conversations.",
  },
  footer: {
    exploreLinks: [
      { href: routeLinks.home, label: "Home" },
      { href: routeLinks.programs, label: "Citizenship by investment" },
      { href: routeLinks.forCompanies, label: "For companies" },
      { href: routeLinks.insights, label: "Insights" },
      { href: routeLinks.pricing, label: "Pricing" },
    ],
    legalLinks: [
      { href: routeLinks.dataProtection, label: "Data protection" },
      { href: routeLinks.contact, label: "Contact" },
    ],
    companyFocusItems: [
      "Warm investor lead qualification",
      "CRM software for immigration firms",
      "Qualified lead partnerships",
      "Privacy-aware workflow positioning",
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
