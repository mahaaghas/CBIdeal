import { buildSaasAppUrl, saasAppConfig } from "@cbideal/config"

export const authRoutes = {
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  checkEmail: "/auth/check-email",
  confirmed: "/auth/confirmed",
  error: "/auth/error",
  confirm: "/auth/confirm",
  inviteAccept: "/invite/accept",
} as const

export const authAbsoluteUrls = {
  login: buildSaasAppUrl(authRoutes.login),
  signup: buildSaasAppUrl(authRoutes.signup),
  forgotPassword: buildSaasAppUrl(authRoutes.forgotPassword),
  resetPassword: buildSaasAppUrl(authRoutes.resetPassword),
  checkEmail: buildSaasAppUrl(authRoutes.checkEmail),
  confirmed: buildSaasAppUrl(authRoutes.confirmed),
  error: buildSaasAppUrl(authRoutes.error),
  confirm: buildSaasAppUrl(authRoutes.confirm),
  inviteAccept: buildSaasAppUrl(authRoutes.inviteAccept),
} as const

export const supabaseAuthRedirectUrls = [
  authAbsoluteUrls.login,
  authAbsoluteUrls.signup,
  authAbsoluteUrls.forgotPassword,
  authAbsoluteUrls.resetPassword,
  authAbsoluteUrls.checkEmail,
  authAbsoluteUrls.confirmed,
  authAbsoluteUrls.error,
  authAbsoluteUrls.confirm,
  authAbsoluteUrls.inviteAccept,
] as const

export const supabaseAuthSettings = {
  siteUrl: saasAppConfig.appUrl,
  redirectUrls: supabaseAuthRedirectUrls,
} as const

export function buildAuthErrorHref(reason: "invalid-link" | "generic", ctaHref?: string) {
  const url = new URL(authAbsoluteUrls.error)
  url.searchParams.set("reason", reason)

  if (ctaHref) {
    url.searchParams.set("cta", ctaHref)
  }

  return url.toString()
}
