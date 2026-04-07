"use client"

import { useEffect } from "react"
import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { CONSENT_STORAGE_KEY } from "@/lib/consent"
import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  getLanguageCode,
  getNormalizedPath,
  getSourcePageFromPath,
  trackBookingCtaClick,
  trackCalendlyOpen,
  trackPrimaryCtaClick,
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

      const actionElement = target.closest("a, button")
      if (!(actionElement instanceof HTMLElement)) return

      const sourcePage = getSourcePageFromPath(pathname || "/")
      const language = getLanguageCode(document.documentElement.lang)
      const ctaKind = actionElement.getAttribute("data-cta-kind")

      if (ctaKind === "primary") {
        trackPrimaryCtaClick({
          source_page: sourcePage,
          language,
        })
      }

      const anchor = actionElement.closest("a")
      if (!(anchor instanceof HTMLAnchorElement)) return

      const href = anchor.getAttribute("href")
      if (!href) return

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
      <Script id="google-consent-defaults" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            personalization_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
            wait_for_update: 500
          });
          gtag('set', 'ads_data_redaction', true);
          gtag('set', 'url_passthrough', true);
          try {
            const storedConsent = window.localStorage.getItem('${CONSENT_STORAGE_KEY}');
            if (storedConsent) {
              const parsed = JSON.parse(storedConsent);
              const analyticsGranted = parsed.analytics === true ? 'granted' : 'denied';
              const adsGranted = parsed.ads === true ? 'granted' : 'denied';
              gtag('consent', 'update', {
                analytics_storage: analyticsGranted,
                ad_storage: adsGranted,
                ad_user_data: adsGranted,
                ad_personalization: adsGranted,
                personalization_storage: adsGranted,
                functionality_storage: 'granted',
                security_storage: 'granted'
              });
              gtag('set', 'ads_data_redaction', parsed.ads !== true);
            }
          } catch (error) {}
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
      <AnalyticsListeners />
    </>
  )
}
