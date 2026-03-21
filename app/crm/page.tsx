import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { buildPageMetadata } from "@/lib/metadata"
import { routeLinks } from "@/lib/site"

export const metadata: Metadata = buildPageMetadata({
  title: "CRM for Passport Companies",
  description:
    "Redirecting to the company overview for the immigration CRM, guided demos, qualified lead partnerships, and pricing.",
  path: "/crm",
})

export default function CrmAliasPage() {
  redirect(routeLinks.forCompanies)
}
