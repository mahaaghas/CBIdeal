export interface SanityImageValue {
  asset?: {
    _ref?: string
    _type?: string
  }
  alt?: string
  caption?: string
}

export interface CmsImageAsset {
  url: string
  alt: string
}

export interface CmsLink {
  label: string
  href: string
}

export interface CmsSeo {
  title?: string
  description?: string
  keywords?: string[]
  openGraphTitle?: string
  openGraphDescription?: string
  openGraphImage?: CmsImageAsset | null
  noIndex?: boolean
}

export interface CmsStatItem {
  value: string
  label: string
}

export interface CmsTrustItem {
  title: string
  description: string
}

export interface CmsFeatureItem {
  title: string
  description: string
  image?: CmsImageAsset | null
}

export interface CmsProcessStep {
  title: string
  description: string
  icon?: string
}

export interface CmsFaqItem {
  question: string
  answer: string
}

export interface CmsHeroSection {
  _type: "heroSection"
  eyebrow: string
  title: string
  description: string
  primaryAction: CmsLink
  secondaryAction?: CmsLink | null
  stats?: CmsStatItem[]
  highlightsLabel?: string | null
  highlights?: string[]
  secondaryCard?: {
    eyebrow?: string | null
    title: string
    description: string
    cta?: CmsLink | null
  } | null
}

export interface CmsTrustSection {
  _type: "trustSection"
  eyebrow: string
  title: string
  description: string
  items: CmsTrustItem[]
}

export interface CmsFeatureSection {
  _type: "featureSection"
  eyebrow: string
  title: string
  description: string
  items: CmsFeatureItem[]
}

export interface CmsProcessSection {
  _type: "processSection"
  eyebrow: string
  title: string
  description: string
  steps: CmsProcessStep[]
}

export interface CmsQualificationFormSection {
  _type: "qualificationFormSection"
  eyebrow: string
  title: string
  description: string
  formType: "investor" | "company" | "partner"
  formTitle: string
  formDescription: string
  submitLabel?: string | null
  source: string
  bulletPoints?: string[]
}

export interface CmsFaqSection {
  _type: "faqSection"
  eyebrow: string
  title: string
  description: string
  items: CmsFaqItem[]
}

export interface CmsCtaBannerSection {
  _type: "ctaBannerSection"
  eyebrow: string
  title: string
  description: string
  primaryAction: CmsLink
  secondaryAction?: CmsLink | null
}

export type CmsLandingSection =
  | CmsHeroSection
  | CmsTrustSection
  | CmsFeatureSection
  | CmsProcessSection
  | CmsQualificationFormSection
  | CmsFaqSection
  | CmsCtaBannerSection

export interface CmsLandingPage {
  title: string
  slug: string
  isHomepage?: boolean
  seo?: CmsSeo | null
  sections: CmsLandingSection[]
}

export interface CmsAuthorSummary {
  name: string
  role?: string | null
  image?: CmsImageAsset | null
}

export interface CmsCategorySummary {
  title: string
  slug: string
}

export interface CmsBlogPostSummary {
  title: string
  slug: string
  excerpt: string
  featuredImage?: CmsImageAsset | null
  category?: CmsCategorySummary | null
  tags: string[]
  author?: CmsAuthorSummary | null
  publishedAt: string
  seo?: CmsSeo | null
}

export interface CmsBlogRelatedPage {
  label: string
  href: string
}

export interface CmsBlogPost extends CmsBlogPostSummary {
  body: unknown[]
  relatedPages?: CmsBlogRelatedPage[]
  relatedPosts?: CmsBlogPostSummary[]
}

export interface CmsSiteSettings {
  siteName?: string | null
  siteDescription?: string | null
  siteUrl?: string | null
  defaultSeo?: CmsSeo | null
  supportEmail?: string | null
  salesEmail?: string | null
  phone?: string | null
  whatsapp?: string | null
  bookingUrl?: string | null
  demoUrl?: string | null
  location?: string | null
  footerSummary?: string | null
  footerBottomPrimary?: string | null
  footerBottomSecondary?: string | null
  socialLinks?: {
    linkedin?: string | null
    x?: string | null
    instagram?: string | null
  } | null
}
