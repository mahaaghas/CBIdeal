import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getRequestLocale } from "@/lib/i18n/request"
import { localizeHref } from "@/lib/i18n/routing"
import { buildPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale()
  return buildPageMetadata({
    title: "CRM for Passport Companies",
    description:
      "Redirecting to the company overview for the immigration CRM, guided demos, qualified lead partnerships, and pricing.",
    path: localizeHref(locale, "/crm"),
    locale,
  })
}

export default function CrmAliasPage() {
  const locale = getRequestLocale()
  redirect(localizeHref(locale, "/for-companies"))
}
