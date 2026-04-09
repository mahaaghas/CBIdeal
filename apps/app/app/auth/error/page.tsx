"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AuthShell, AuthStateCard } from "@/components/auth-shell"
import { authRoutes } from "@/lib/auth-flow"

function resolveSafeHref(rawHref: string | null) {
  if (!rawHref) return authRoutes.forgotPassword
  if (rawHref.startsWith("/")) return rawHref

  try {
    const parsed = new URL(rawHref)
    return parsed.hostname === "app.cbideal.nl" ? `${parsed.pathname}${parsed.search}` : authRoutes.forgotPassword
  } catch {
    return authRoutes.forgotPassword
  }
}

function AuthErrorPageContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")
  const ctaHref = resolveSafeHref(searchParams.get("cta"))

  const invalidLink = reason === "invalid-link"

  return (
    <AuthShell
      eyebrow={invalidLink ? "Link expired" : "Auth error"}
      title={invalidLink ? "This link is no longer valid" : "Something went wrong"}
      description={
        invalidLink
          ? "The link may have expired or already been used."
          : "We're unable to complete this right now. Please try again in a moment."
      }
    >
      <AuthStateCard
        title={invalidLink ? "This link is no longer valid" : "Something went wrong"}
        description={
          invalidLink
            ? "The link may have expired or already been used. Please request a new one to continue."
            : "We're unable to complete this right now. Please try again in a moment."
        }
        actions={[
          {
            label: invalidLink ? "Request a new link" : "Go to login",
            href: invalidLink ? ctaHref : authRoutes.login,
          },
          { label: "Contact support", href: "https://www.cbideal.nl/contact", tone: "secondary" },
        ]}
      />
    </AuthShell>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="app-shell min-h-screen" />}>
      <AuthErrorPageContent />
    </Suspense>
  )
}
