export const DEFAULT_SAAS_APP_URL = "https://app.cbideal.nl"
export const LEGACY_SAAS_APP_HOST = "cbideal-app.vercel.app"
export const APP_URL = normalizeSaasAppUrl(process.env.NEXT_PUBLIC_APP_URL || DEFAULT_SAAS_APP_URL)

const FALLBACK_APP_URL = new URL(DEFAULT_SAAS_APP_URL)

function toUrl(value: string) {
  const trimmed = value.trim()

  if (/^https?:\/\//i.test(trimmed)) {
    return new URL(trimmed)
  }

  return new URL(`https://${trimmed}`)
}

function rewriteLegacyHost(url: URL) {
  if (url.hostname !== LEGACY_SAAS_APP_HOST) {
    return url
  }

  url.protocol = FALLBACK_APP_URL.protocol
  url.hostname = FALLBACK_APP_URL.hostname
  url.port = FALLBACK_APP_URL.port

  return url
}

export function rewriteLegacySaasAppUrl(value: string) {
  return rewriteLegacyHost(toUrl(value)).toString()
}

export function normalizeSaasAppUrl(value?: string | null) {
  const normalized = rewriteLegacyHost(toUrl(value?.trim() || DEFAULT_SAAS_APP_URL))
  normalized.search = ""
  normalized.hash = ""
  normalized.pathname = normalized.pathname === "/" ? "/" : normalized.pathname.replace(/\/+$/, "")

  return normalized.toString().replace(/\/$/, "")
}

export function buildSaasAppUrl(pathname = "/") {
  const normalizedPath = pathname.startsWith("/") ? pathname.slice(1) : pathname
  return new URL(normalizedPath, `${APP_URL}/`).toString()
}

export function normalizeSaasAppHref(value?: string | null, fallback = buildSaasAppUrl("/")) {
  const trimmed = value?.trim()

  if (!trimmed) {
    return fallback
  }

  if (trimmed.startsWith("/")) {
    return buildSaasAppUrl(trimmed)
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.includes(".")) {
    return rewriteLegacySaasAppUrl(trimmed)
  }

  return trimmed
}

export const saasAppUrl = APP_URL
export const saasAppHost = new URL(saasAppUrl).host
