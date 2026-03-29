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
} as const

const pricingPlans = [
  {
    name: "Private desks",
    monthlyPrice: 39,
    yearlyPrice: 31,
    description:
      "For smaller advisory desks that want a more orderly way to oversee enquiries, notes, and internal coordination.",
    seats: "Up to 3 users",
    ctaLabel: "Arrange a private discussion",
    ctaHref: ctaLinks.requestDemo,
    secondaryLabel: "Contact us directly",
    secondaryHref: ctaLinks.contactSales,
    featured: false,
    features: [
      "Confidential enquiry overview",
      "Structured internal notes",
      "Continuity reminders",
      "Case and jurisdiction grouping",
      "Guided onboarding support",
    ],
  },
  {
    name: "Advisory teams",
    monthlyPrice: 69,
    yearlyPrice: 55,
    description:
      "For established firms that need stronger oversight across advisers, cases, and internal handovers.",
    seats: "Up to 10 users",
    ctaLabel: "Arrange a private discussion",
    ctaHref: ctaLinks.requestDemo,
    secondaryLabel: "View engagement options",
    secondaryHref: ctaLinks.viewPricing,
    featured: true,
    features: [
      "Everything in Private desks",
      "Shared ownership across teams",
      "Management visibility",
      "Counterparty and referrer records",
      "Priority onboarding guidance",
    ],
  },
  {
    name: "Institutional",
    monthlyPrice: null,
    yearlyPrice: null,
    description:
      "For larger firms that require tailored access, broader operational structure, or a more bespoke engagement format.",
    seats: "Custom structure",
    ctaLabel: "Contact us directly",
    ctaHref: ctaLinks.contactSales,
    secondaryLabel: "Arrange a private discussion",
    secondaryHref: ctaLinks.bookCompanyCall,
    featured: false,
    features: [
      "Custom access structure",
      "Bespoke operating workflows",
      "Partner and referrer coordination",
      "Migration planning",
      "Dedicated support design",
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
      { href: routeLinks.forCompanies, label: "Work with us" },
      { href: routeLinks.insights, label: "Insights" },
      { href: routeLinks.pricing, label: "Engagement options" },
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
