import type { MetadataRoute } from "next"
import { fallbackInsightPosts } from "@/lib/insights/fallback-posts"
import { localizeHref } from "@/lib/i18n/routing"
import { getBlogPosts, getLandingPageSlugs, getResolvedSiteSettings } from "@/lib/sanity/content"
import { siteConfig } from "@/lib/site-config"

type SitemapEntry = MetadataRoute.Sitemap[number]

const corePaths = [
  "/",
  siteConfig.links.routes.about,
  siteConfig.links.routes.programs,
  siteConfig.links.routes.caribbeanComparison,
  siteConfig.links.routes.bookConsultation,
  siteConfig.links.routes.forCompanies,
  siteConfig.links.routes.insights,
  siteConfig.links.routes.pricing,
  siteConfig.links.routes.contact,
  siteConfig.links.routes.demo,
  siteConfig.links.routes.dataProtection,
  siteConfig.links.routes.privacyPolicy,
  siteConfig.links.routes.partners,
] as const

const excludedDynamicSlugs = new Set([
  "caribbean-cbi-comparison",
  "book-a-cbi-consultation",
  "about",
  "citizenship-by-investment",
  "contact",
  "crm",
  "data-protection",
  "demo",
  "for-companies",
  "insights",
  "partners",
  "pricing",
  "privacy-policy",
  "privacy",
  "studio",
])

function toAbsoluteUrl(siteUrl: string, path: string) {
  return new URL(path, siteUrl).toString()
}

function buildAlternates(siteUrl: string, path: string) {
  return {
    languages: {
      en: toAbsoluteUrl(siteUrl, localizeHref("en", path)),
      ar: toAbsoluteUrl(siteUrl, localizeHref("ar", path)),
      ru: toAbsoluteUrl(siteUrl, localizeHref("ru", path)),
    },
  }
}

function buildEntry(
  siteUrl: string,
  path: string,
  options?: {
    lastModified?: Date
    changeFrequency?: SitemapEntry["changeFrequency"]
    priority?: number
  },
): SitemapEntry {
  return {
    url: toAbsoluteUrl(siteUrl, path),
    lastModified: options?.lastModified ?? new Date(),
    changeFrequency: options?.changeFrequency,
    priority: options?.priority,
    alternates: buildAlternates(siteUrl, path),
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getResolvedSiteSettings()
  const siteUrl = settings.siteUrl
  const now = new Date()

  const [cmsLandingPages, cmsBlogPosts] = await Promise.all([getLandingPageSlugs(), getBlogPosts()])

  const entries: SitemapEntry[] = [
    buildEntry(siteUrl, "/", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    }),
    buildEntry(siteUrl, siteConfig.links.routes.programs, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    }),
    buildEntry(siteUrl, siteConfig.links.routes.caribbeanComparison, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    }),
    buildEntry(siteUrl, siteConfig.links.routes.bookConsultation, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    }),
    ...corePaths
      .filter((path) => path !== "/")
      .filter(
        (path) =>
          ![
            siteConfig.links.routes.programs,
            siteConfig.links.routes.caribbeanComparison,
            siteConfig.links.routes.bookConsultation,
          ].includes(path),
      )
      .map((path) =>
        buildEntry(siteUrl, path, {
          lastModified: now,
          changeFrequency: path === siteConfig.links.routes.insights ? "daily" : "monthly",
          priority:
            path === siteConfig.links.routes.insights
              ? 0.8
              : path === siteConfig.links.routes.contact || path === siteConfig.links.routes.forCompanies
                ? 0.75
                : 0.65,
        }),
      ),
  ]

  const landingEntries = cmsLandingPages
    .map((page) => page.slug.trim())
    .filter(Boolean)
    .filter((slug) => !excludedDynamicSlugs.has(slug))
    .map((slug) =>
      buildEntry(siteUrl, `/${slug}`, {
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      }),
    )

  const uniqueBlogPosts = new Map<string, { slug: string; publishedAt: string; noIndex?: boolean }>()

  for (const post of fallbackInsightPosts) {
    uniqueBlogPosts.set(post.slug, {
      slug: post.slug,
      publishedAt: post.publishedAt,
      noIndex: post.seo?.noIndex,
    })
  }

  for (const post of cmsBlogPosts) {
    uniqueBlogPosts.set(post.slug, {
      slug: post.slug,
      publishedAt: post.publishedAt,
      noIndex: post.seo?.noIndex,
    })
  }

  const blogEntries = Array.from(uniqueBlogPosts.values())
    .filter((post) => !post.noIndex)
    .map((post) =>
      buildEntry(siteUrl, `${siteConfig.links.routes.insights}/${post.slug}`, {
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly",
        priority: 0.72,
      }),
    )

  return [...entries, ...landingEntries, ...blogEntries]
}
