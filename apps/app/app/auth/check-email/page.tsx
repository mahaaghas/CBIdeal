"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AuthShell, AuthStateCard } from "@/components/auth-shell"
import { authRoutes } from "@/lib/auth-flow"

function CheckEmailPageContent() {
  const searchParams = useSearchParams()
  const intent = searchParams.get("intent")

  const note =
    intent === "reset-password"
      ? "We'll keep the next step secure by sending the link to your inbox."
      : "Please check your inbox and follow the instructions."

  return (
    <AuthShell
      eyebrow="Check your email"
      title="Check your email"
      description="We've sent you a link to continue."
    >
      <AuthStateCard
        title="Check your email"
        description="We've sent you a link to continue. Please check your inbox and follow the instructions."
        note={`${note} If you don't see it, check your spam folder.`}
        actions={[
          { label: "Go to login", href: authRoutes.login },
          { label: "Request a new link", href: authRoutes.forgotPassword, tone: "secondary" },
        ]}
      />
    </AuthShell>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<div className="app-shell min-h-screen" />}>
      <CheckEmailPageContent />
    </Suspense>
  )
}
