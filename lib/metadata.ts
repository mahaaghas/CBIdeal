import type { Metadata } from "next"
import { siteConfig } from "@/lib/site-config"

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  keywords?: string[]
  image?: string
  openGraphTitle?: string
  openGraphDescription?: string
  noIndex?: boolean
  siteName?: string
  siteUrl?: string
}

const defaultKeywords = [
  "citizenship by investment",
  "residency by investment",
  "second passport",
  "immigration CRM",
  "passport company software",
]

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  openGraphTitle,
  openGraphDescription,
  noIndex = false,
  siteName = siteConfig.siteName,
  siteUrl = siteConfig.metadata.siteUrl,
}: PageMetadataOptions): Metadata {
  const url = new URL(path, siteUrl).toString()
  const ogImage = image ?? siteConfig.metadata.defaultOgImage
  const imageUrl = new URL(ogImage, siteUrl).toString()
  const resolvedOgTitle = openGraphTitle ?? title
  const resolvedOgDescription = openGraphDescription ?? description

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: resolvedOgTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  }
}
