"use client"

import { useEffect } from "react"
import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import {
  GA_MEASUREMENT_ID,
  getLanguageCode,
  getNormalizedPath,
  getSourcePageFromPath,
  trackBookingCtaClick,
  trackCalendlyOpen,
  trackConsultationCtaClick,
  trackPageView,
} from "@/lib/analytics"
import { siteConfig } from "@/lib/site-config"

function AnalyticsListeners() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams?.toString()
    const fullPath = query ? `${pathname}?${query}` : pathname
    trackPageView(fullPath || "/")
  }, [pathname, searchParams])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest("a")
      if (!(anchor instanceof HTMLAnchorElement)) return

      const href = anchor.getAttribute("href")
      if (!href) return

      const currentPath = pathname || "/"
      const sourcePage = getSourcePageFromPath(currentPath)
      const language = getLanguageCode(document.documentElement.lang)

      if (href === "#consultation-form") {
        trackConsultationCtaClick({
          source_page: sourcePage,
          target_path: href,
          language,
        })
        return
      }

      let targetUrl: URL

      try {
        targetUrl = new URL(anchor.href, window.location.origin)
      } catch {
        return
      }

      const normalizedTargetPath = getNormalizedPath(targetUrl.pathname)
      const normalizedBookingPath = getNormalizedPath(new URL(siteConfig.scheduling.bookingUrl).pathname)

      if (targetUrl.origin !== window.location.origin) {
        const isCalendly =
          targetUrl.href === siteConfig.scheduling.bookingUrl ||
          (targetUrl.hostname.includes("calendly.com") && normalizedTargetPath === normalizedBookingPath)

        if (isCalendly) {
          const eventPayload = {
            source_page: sourcePage,
            target_path: targetUrl.href,
            language,
          }

          trackBookingCtaClick(eventPayload)
          trackCalendlyOpen(eventPayload)
        }

        return
      }

      if (normalizedTargetPath === "/book-a-cbi-consultation" || targetUrl.hash === "#consultation-form") {
        trackConsultationCtaClick({
          source_page: sourcePage,
          target_path: `${normalizedTargetPath}${targetUrl.hash}`,
          language,
        })
      }

      if (normalizedTargetPath === "/for-companies" && targetUrl.hash === "#meeting") {
        trackBookingCtaClick({
          source_page: sourcePage,
          target_path: `${normalizedTargetPath}${targetUrl.hash}`,
          language,
        })
      }
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [pathname])

  return null
}

export function GoogleAnalytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <AnalyticsListeners />
    </>
  )
}
