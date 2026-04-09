"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AuthShell, AuthStateCard } from "@/components/auth-shell"
import { authRoutes } from "@/lib/auth-flow"

function AuthConfirmedPageContent() {
  const searchParams = useSearchParams()
  const intent = searchParams.get("intent")

  const isPasswordUpdated = intent === "password-updated"

  return (
    <AuthShell
      eyebrow={isPasswordUpdated ? "Password updated" : "Email confirmed"}
      title={isPasswordUpdated ? "Password updated" : "Email confirmed"}
      description={
        isPasswordUpdated
          ? "Your password has been successfully updated."
          : "Your email has been confirmed and your account can continue from here."
      }
    >
      <AuthStateCard
        title={isPasswordUpdated ? "Password updated" : "Email confirmed"}
        description={
          isPasswordUpdated
            ? "Your password has been successfully updated. You can now sign in using your new credentials."
            : "Your email has been confirmed. You can now sign in and continue."
        }
        actions={[{ label: "Go to login", href: authRoutes.login }]}
      />
    </AuthShell>
  )
}

export default function AuthConfirmedPage() {
  return (
    <Suspense fallback={<div className="app-shell min-h-screen" />}>
      <AuthConfirmedPageContent />
    </Suspense>
  )
}
