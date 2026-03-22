import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  return buildPageMetadata({
    title: "Privacy and Data Protection",
    description:
      "Redirecting to the data protection page covering confidentiality, responsible handling of enquiries, and privacy-aware workflows.",
    path: localizeHref(locale, "/privacy"),
    locale,
  })
}

export default function PrivacyAliasPage() {
  const locale = getRequestLocale()
  redirect(localizeHref(locale, "/data-protection"))
}
