import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { buildPageMetadata } from "@/lib/metadata"
import { routeLinks } from "@/lib/site"

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy and Data Protection",
  description:
    "Redirecting to the data protection page covering confidentiality, responsible handling of enquiries, and privacy-aware workflows.",
  path: "/privacy",
})

export default function PrivacyAliasPage() {
  redirect(routeLinks.dataProtection)
}
