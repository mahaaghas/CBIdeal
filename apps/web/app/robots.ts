import type { MetadataRoute } from "next"
import { getResolvedSiteSettings } from "@/lib/sanity/content"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getResolvedSiteSettings()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
    ],
    sitemap: `${settings.siteUrl}/sitemap.xml`,
    host: settings.siteUrl,
  }
}
