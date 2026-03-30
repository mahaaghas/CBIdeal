import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  return buildPageMetadata({
    title: "Privacy Policy",
    description:
      "Redirecting to the privacy policy page covering cookies, analytics, advertising disclosures, and responsible handling of personal data.",
    path: localizeHref(locale, "/privacy"),
    locale,
  })
}

export default function PrivacyAliasPage() {
  const locale = getRequestLocale()
  redirect(localizeHref(locale, "/privacy-policy"))
}
