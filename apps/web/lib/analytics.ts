import { stripLocalePrefix } from "@/lib/i18n/routing"

export const GA_MEASUREMENT_ID = "G-9KX85B0FMX"
export const GOOGLE_ADS_ID = "AW-18036841344"

type AnalyticsValue = string | number | boolean | undefined
type AnalyticsParams = Record<string, AnalyticsValue>

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (
      command: "js" | "config" | "event",
      targetIdOrAction: string | Date,
      params?: AnalyticsParams,
    ) => void
  }
}

function canTrack() {
  return typeof window !== "undefined" && typeof window.gtag === "function"
}

export function trackPageView(path: string) {
  if (!canTrack()) return

  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  window.gtag?.("event", "page_view", {
    page_path: normalizedPath,
    page_location: `${window.location.origin}${normalizedPath}`,
    page_title: document.title,
  })
}

export function trackEvent(action: string, params: AnalyticsParams = {}) {
  if (!canTrack()) return
  window.gtag?.("event", action, params)
}

export function trackFormSubmit(params: AnalyticsParams = {}) {
  trackEvent("form_submit", params)
}

export function trackConsultationCtaClick(params: AnalyticsParams = {}) {
  trackEvent("consultation_cta_click", params)
}

export function trackCalendlyOpen(params: AnalyticsParams = {}) {
  trackEvent("calendly_open", params)
}

export function trackBookingCtaClick(params: AnalyticsParams = {}) {
  trackEvent("booking_cta_click", params)
}

export function trackPrimaryCtaClick(params: AnalyticsParams = {}) {
  trackEvent("cta_click_primary", params)
}

export function trackQuizStarted(params: AnalyticsParams = {}) {
  trackEvent("quiz_started", params)
}

export function trackQuizCompleted(params: AnalyticsParams = {}) {
  trackEvent("quiz_completed", params)
}

export function trackLeadGenerated(params: AnalyticsParams = {}) {
  trackEvent("lead_generated", params)
}

export function getLanguageCode(lang: string | null | undefined) {
  const normalized = (lang || "en").toLowerCase()
  if (normalized.startsWith("ar")) return "AR"
  return "EN"
}

export function getSourcePageFromPath(pathname: string) {
  const stripped = stripLocalePrefix(pathname || "/")
  const cleaned = stripped.replace(/^\/+|\/+$/g, "")
  return cleaned || "home"
}

export function getNormalizedPath(pathname: string) {
  const stripped = stripLocalePrefix(pathname || "/")
  return stripped === "" ? "/" : stripped
}
