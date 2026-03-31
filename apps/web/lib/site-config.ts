import { getSaasDemoUrl, getSaasLoginUrl, getSelfServeSignupUrl, saasAppConfig } from "@cbideal/config"

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
  appSignupStarter: getSelfServeSignupUrl("starter"),
  appSignupGrowth: getSelfServeSignupUrl("growth"),
  enterpriseSetup: saasAppConfig.enterprisePath,
  requestProductDemo: saasAppConfig.requestDemoPath,
} as const

const pricingPlans = [
  {
    name: "Starter",
    monthlyPrice: 189,
    yearlyPrice: 169,
    description:
      "For smaller citizenship and residency teams that want a clear operational workspace without a long implementation cycle.",
    seats: "Up to 3 internal users",
    ctaLabel: "Get Started",
    ctaHref: ctaLinks.appSignupStarter,
    secondaryLabel: "View Demo",
    secondaryHref: ctaLinks.appDemo,
    featured: false,
    features: [
      "Up to 40 client accounts",
      "Quotations, documents, and payments",
      "Branded client portal",
      "Email templates and reminders",
      "Self-serve onboarding",
    ],
  },
  {
    name: "Growth",
    monthlyPrice: 429,
    yearlyPrice: 389,
    description:
      "For established firms that need broader capacity, stronger coordination, and a more developed branded client experience.",
    seats: "Up to 10 internal users",
    ctaLabel: "Get Started",
    ctaHref: ctaLinks.appSignupGrowth,
    secondaryLabel: "View Demo",
    secondaryHref: ctaLinks.appDemo,
    featured: true,
    features: [
      "Up to 180 client accounts",
      "Advanced review and reminder workflows",
      "Branding personalisation",
      "Priority onboarding guidance",
      "Self-serve billing and activation",
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description:
      "For wider structures that require manual setup, tailored limits, and a more deliberate implementation path.",
    seats: "Custom structure",
    ctaLabel: "Contact Sales",
    ctaHref: ctaLinks.enterpriseSetup,
    secondaryLabel: "Request Demo",
    secondaryHref: ctaLinks.requestProductDemo,
    featured: false,
    features: [
      "Custom user and client-account limits",
      "Manual rollout and enterprise onboarding",
      "Tailored implementation planning",
      "Sales-led setup and support",
      "Custom commercial structure",
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
  saas: {
    appUrl: saasAppConfig.appUrl,
    loginUrl: ctaLinks.appLogin,
    demoUrl: ctaLinks.appDemo,
    signupStarterUrl: ctaLinks.appSignupStarter,
    signupGrowthUrl: ctaLinks.appSignupGrowth,
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
