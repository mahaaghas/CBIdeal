import { cache } from "react"
import type { QueryParams } from "next-sanity"
import { siteConfig } from "@/lib/site-config"
import { sanityClient } from "@/lib/sanity/client"
import { isSanityEnabled } from "@/lib/sanity/env"
import { urlForSanityImage } from "@/lib/sanity/image"
import {
  blogPostBySlugQuery,
  blogPostsIndexQuery,
  homepageLandingPageQuery,
  landingPageBySlugQuery,
  landingPageSlugsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries"
import type {
  CmsBlogPost,
  CmsBlogPostSummary,
  CmsImageAsset,
  CmsLandingPage,
  CmsLandingSection,
  CmsSeo,
  CmsSiteSettings,
  SanityImageValue,
} from "@/lib/sanity/types"

async function sanityFetch<T>(query: string, params: QueryParams = {}) {
  if (!sanityClient || !isSanityEnabled()) return null

  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate: 60,
    },
  })
}

function mapImage(image?: SanityImageValue | null): CmsImageAsset | null {
  if (!image?.asset) return null

  const url = urlForSanityImage(image)?.width(1600).quality(85).url()

  if (!url) return null

  return {
    url,
    alt: image.alt ?? "",
  }
}

function mapSeo(seo?: {
  title?: string
  description?: string
  keywords?: string[]
  openGraphTitle?: string
  openGraphDescription?: string
  openGraphImage?: SanityImageValue
  noIndex?: boolean
} | null): CmsSeo | null {
  if (!seo) return null

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords ?? [],
    openGraphTitle: seo.openGraphTitle,
    openGraphDescription: seo.openGraphDescription,
    openGraphImage: mapImage(seo.openGraphImage),
    noIndex: seo.noIndex,
  }
}

export const getCmsSiteSettings = cache(async (): Promise<CmsSiteSettings | null> => {
  const raw = await sanityFetch<{
    siteName?: string
    siteDescription?: string
    siteUrl?: string
    supportEmail?: string
    salesEmail?: string
    phone?: string
    whatsapp?: string
    bookingUrl?: string
    demoUrl?: string
    location?: string
    footerSummary?: string
    footerBottomPrimary?: string
    footerBottomSecondary?: string
    socialLinks?: {
      linkedin?: string
      x?: string
      instagram?: string
    }
    defaultSeo?: {
      title?: string
      description?: string
      keywords?: string[]
      openGraphTitle?: string
      openGraphDescription?: string
      openGraphImage?: SanityImageValue
      noIndex?: boolean
    }
  }>(siteSettingsQuery)

  if (!raw) return null

  return {
    ...raw,
    defaultSeo: mapSeo(raw.defaultSeo),
  }
})

export const getResolvedSiteSettings = cache(async () => {
  const cms = await getCmsSiteSettings()

  return {
    siteName: cms?.siteName || siteConfig.siteName,
    siteDescription: cms?.siteDescription || siteConfig.metadata.description,
    siteUrl: cms?.siteUrl || siteConfig.metadata.siteUrl,
    defaultSeo: cms?.defaultSeo || {
      title: siteConfig.metadata.defaultTitle,
      description: siteConfig.metadata.description,
      openGraphImage: {
        url: new URL(siteConfig.metadata.defaultOgImage, siteConfig.metadata.siteUrl).toString(),
        alt: siteConfig.metadata.defaultTitle,
      },
    },
    supportEmail: cms?.supportEmail || siteConfig.contact.supportEmail,
    salesEmail: cms?.salesEmail || siteConfig.contact.salesEmail,
    phone: cms?.phone || siteConfig.contact.phone,
    whatsapp: cms?.whatsapp || siteConfig.contact.whatsapp,
    bookingUrl: cms?.bookingUrl || siteConfig.scheduling.bookingUrl,
    demoUrl: cms?.demoUrl || siteConfig.demo.requestUrl,
    location: cms?.location || siteConfig.legal.location,
    footerSummary: cms?.footerSummary || siteConfig.legal.footerSummary,
    footerBottomPrimary: cms?.footerBottomPrimary || siteConfig.legal.footerBottomPrimary,
    footerBottomSecondary: cms?.footerBottomSecondary || siteConfig.legal.footerBottomSecondary,
    socialLinks: {
      linkedin: cms?.socialLinks?.linkedin || siteConfig.socialLinks.linkedin,
      x: cms?.socialLinks?.x || siteConfig.socialLinks.x,
      instagram: cms?.socialLinks?.instagram || siteConfig.socialLinks.instagram,
    },
  }
})

function mapLandingPage(raw: {
  title: string
  slug: string
  isHomepage?: boolean
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    openGraphTitle?: string
    openGraphDescription?: string
    openGraphImage?: SanityImageValue
    noIndex?: boolean
  }
  sections?: Array<Record<string, unknown>>
} | null): CmsLandingPage | null {
  if (!raw) return null

  const sections = (raw.sections ?? []).map((section) => {
    const type = section._type as CmsLandingSection["_type"]

    if (type === "featureSection") {
      return {
        ...section,
        _type: type,
        items: Array.isArray(section.items)
          ? section.items.map((item) => ({
              title: String((item as { title?: string }).title ?? ""),
              description: String((item as { description?: string }).description ?? ""),
              image: mapImage((item as { image?: SanityImageValue }).image),
            }))
          : [],
      }
    }

    return section as CmsLandingSection
  })

  return {
    title: raw.title,
    slug: raw.slug,
    isHomepage: raw.isHomepage,
    seo: mapSeo(raw.seo),
    sections,
  }
}

export const getHomepageLandingPage = cache(async () => {
  const raw = await sanityFetch<{
    title: string
    slug: string
    isHomepage?: boolean
    seo?: {
      title?: string
      description?: string
      keywords?: string[]
      openGraphTitle?: string
      openGraphDescription?: string
      openGraphImage?: SanityImageValue
      noIndex?: boolean
    }
    sections?: Array<Record<string, unknown>>
  }>(homepageLandingPageQuery)

  return mapLandingPage(raw)
})

export const getLandingPageBySlug = cache(async (slug: string) => {
  const raw = await sanityFetch<{
    title: string
    slug: string
    isHomepage?: boolean
    seo?: {
      title?: string
      description?: string
      keywords?: string[]
      openGraphTitle?: string
      openGraphDescription?: string
      openGraphImage?: SanityImageValue
      noIndex?: boolean
    }
    sections?: Array<Record<string, unknown>>
  }>(landingPageBySlugQuery, { slug })

  return mapLandingPage(raw)
})

export const getLandingPageSlugs = cache(async () => {
  const raw = await sanityFetch<Array<{ slug: string }>>(landingPageSlugsQuery)

  return raw ?? []
})

function mapBlogSummary(raw: {
  title: string
  slug: string
  excerpt: string
  featuredImage?: SanityImageValue
  category?: { title: string; slug: string }
  tags?: string[]
  author?: {
    name: string
    role?: string
    image?: SanityImageValue
  }
  publishedAt: string
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    openGraphTitle?: string
    openGraphDescription?: string
    openGraphImage?: SanityImageValue
    noIndex?: boolean
  }
}): CmsBlogPostSummary {
  return {
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt,
    featuredImage: mapImage(raw.featuredImage),
    category: raw.category,
    tags: raw.tags ?? [],
    author: raw.author
      ? {
          name: raw.author.name,
          role: raw.author.role,
          image: mapImage(raw.author.image),
        }
      : null,
    publishedAt: raw.publishedAt,
    seo: mapSeo(raw.seo),
  }
}

export const getBlogPosts = cache(async (): Promise<CmsBlogPostSummary[]> => {
  const raw = await sanityFetch<
    Array<{
      title: string
      slug: string
      excerpt: string
      featuredImage?: SanityImageValue
      category?: { title: string; slug: string }
      tags?: string[]
      author?: {
        name: string
        role?: string
        image?: SanityImageValue
      }
      publishedAt: string
      seo?: {
        title?: string
        description?: string
        keywords?: string[]
        openGraphTitle?: string
        openGraphDescription?: string
        openGraphImage?: SanityImageValue
        noIndex?: boolean
      }
    }>
  >(blogPostsIndexQuery)

  return (raw ?? []).map(mapBlogSummary)
})

export const getBlogPostBySlug = cache(async (slug: string): Promise<CmsBlogPost | null> => {
  const raw = await sanityFetch<
    | ({
        body: unknown[]
      } & Parameters<typeof mapBlogSummary>[0])
    | null
  >(blogPostBySlugQuery, { slug })

  if (!raw) return null

  return {
    ...mapBlogSummary(raw),
    body: raw.body ?? [],
  }
})
