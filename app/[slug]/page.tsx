import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingPageRenderer } from "@/components/cms/landing-page-renderer"
import { SiteShell } from "@/components/site-shell"
import { buildPageMetadata } from "@/lib/metadata"
import { getLandingPageBySlug, getResolvedSiteSettings } from "@/lib/sanity/content"

interface DynamicLandingPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: DynamicLandingPageProps): Promise<Metadata> {
  const [{ slug }, settings] = await Promise.all([params, getResolvedSiteSettings()])
  const page = await getLandingPageBySlug(slug)

  if (!page) {
    return buildPageMetadata({
      title: "Page not found",
      description: settings.siteDescription,
      path: `/${slug}`,
      siteName: settings.siteName,
      siteUrl: settings.siteUrl,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: page.seo?.title || page.title,
    description: page.seo?.description || settings.siteDescription,
    path: `/${page.slug}`,
    keywords: page.seo?.keywords ?? [],
    image: page.seo?.openGraphImage?.url,
    openGraphTitle: page.seo?.openGraphTitle,
    openGraphDescription: page.seo?.openGraphDescription,
    noIndex: page.seo?.noIndex,
    siteName: settings.siteName,
    siteUrl: settings.siteUrl,
  })
}

export default async function DynamicLandingPage({ params }: DynamicLandingPageProps) {
  const { slug } = await params
  const page = await getLandingPageBySlug(slug)

  if (!page) {
    notFound()
  }

  return (
    <SiteShell>
      <LandingPageRenderer page={page} />
    </SiteShell>
  )
}
