import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import { getRequestDirection, getRequestLocale } from "@/lib/i18n/request"
import { siteConfig } from "@/lib/site-config"
import { getResolvedSiteSettings } from "@/lib/sanity/content"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getResolvedSiteSettings()
  const defaultTitle = settings.defaultSeo?.title || siteConfig.metadata.defaultTitle
  const defaultDescription = settings.defaultSeo?.description || settings.siteDescription
  const defaultOgImage = settings.defaultSeo?.openGraphImage?.url || siteConfig.metadata.defaultOgImage

  return {
    metadataBase: new URL(settings.siteUrl),
    applicationName: settings.siteName,
    title: {
      default: defaultTitle,
      template: siteConfig.metadata.titleTemplate,
    },
    description: defaultDescription,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: settings.siteUrl,
      siteName: settings.siteName,
      title: settings.defaultSeo?.openGraphTitle || defaultTitle,
      description: settings.defaultSeo?.openGraphDescription || defaultDescription,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: settings.defaultSeo?.openGraphTitle || defaultTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.defaultSeo?.openGraphTitle || defaultTitle,
      description: settings.defaultSeo?.openGraphDescription || defaultDescription,
      images: [defaultOgImage],
    },
    robots: settings.defaultSeo?.noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = getRequestLocale()
  const direction = getRequestDirection()

  return (
    <html lang={locale} dir={direction}>
      <body className={`${manrope.variable} ${cormorant.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
