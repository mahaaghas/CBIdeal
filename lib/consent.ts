import { localizeHref, type Locale } from "@/lib/i18n/routing"

export const CONSENT_STORAGE_KEY = "cbi_consent_preferences_v1"
export const CONSENT_COOKIE_KEY = "cbi_consent_preferences"

export interface ConsentPreferences {
  analytics: boolean
  ads: boolean
  updatedAt: string
}

type ConsentValue = "granted" | "denied"

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (
      command: "js" | "config" | "event" | "consent" | "set",
      targetIdOrAction: string | Date,
      params?: Record<string, string | number | boolean | undefined>,
    ) => void
  }
}

export function getDefaultConsentPreferences(): ConsentPreferences {
  return {
    analytics: false,
    ads: false,
    updatedAt: new Date().toISOString(),
  }
}

export function getConsentPreferencesLabel(locale: Locale) {
  if (locale === "ar") return "إعدادات الخصوصية والملفات التعريفية"
  if (locale === "ru") return "Настройки конфиденциальности и cookie"
  return "Privacy and cookie settings"
}

export function getPrivacyPolicyHref(locale: Locale) {
  return localizeHref(locale, "/privacy-policy")
}

function toConsentValue(enabled: boolean): ConsentValue {
  return enabled ? "granted" : "denied"
}

export function buildConsentUpdate(preferences: Pick<ConsentPreferences, "analytics" | "ads">) {
  return {
    analytics_storage: toConsentValue(preferences.analytics),
    ad_storage: toConsentValue(preferences.ads),
    ad_user_data: toConsentValue(preferences.ads),
    ad_personalization: toConsentValue(preferences.ads),
    personalization_storage: toConsentValue(preferences.ads),
    functionality_storage: "granted" as const,
    security_storage: "granted" as const,
  }
}

export function readStoredConsentPreferences(): ConsentPreferences | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>
    if (typeof parsed.analytics !== "boolean" || typeof parsed.ads !== "boolean") {
      return null
    }

    return {
      analytics: parsed.analytics,
      ads: parsed.ads,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function persistConsentPreferences(preferences: ConsentPreferences) {
  if (typeof window === "undefined") return

  const serialized = JSON.stringify(preferences)
  window.localStorage.setItem(CONSENT_STORAGE_KEY, serialized)
  document.cookie = `${CONSENT_COOKIE_KEY}=${encodeURIComponent(serialized)}; Max-Age=31536000; Path=/; SameSite=Lax`
}

export function applyConsentPreferences(preferences: ConsentPreferences) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return

  const consentUpdate = buildConsentUpdate(preferences)
  window.gtag("consent", "update", consentUpdate)
  window.gtag("set", "ads_data_redaction", !preferences.ads)
}
