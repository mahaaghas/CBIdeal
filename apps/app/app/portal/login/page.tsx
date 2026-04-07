"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LockKeyhole, ShieldCheck } from "lucide-react"
import { AppBrand } from "@cbideal/ui/components/app-brand"
import { Button } from "@cbideal/ui/components/ui/button"
import { Card, CardContent } from "@cbideal/ui/components/ui/card"
import { Input } from "@cbideal/ui/components/ui/input"
import { useBranding } from "@/lib/branding-store"
import { useWorkflow } from "@/lib/workflow-store"

export default function ClientPortalLoginPage() {
  const { branding } = useBranding()
  const { clearPortalAccess, loginPortalUser } = useWorkflow()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [reference, setReference] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    clearPortalAccess()
  }, [clearPortalAccess])

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-12">
      <Card className="section-card overflow-hidden">
        <CardContent className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="hero-panel card-stack rounded-none p-6 md:p-8">
            <AppBrand
              name={branding.companyName}
              subtitle="Client portal"
              logoUrl={branding.companyLogoUrl}
              darkLogoUrl={branding.darkLogoUrl}
            />
            <span className="eyebrow border-white/16 bg-white/[0.06] text-primary-foreground/75">
              Client sign in
            </span>
            <div className="section-stack">
              <h1 className="text-[2.2rem] leading-[1.08] tracking-[-0.03em] text-primary-foreground">
                A controlled sign-in for client updates and secure document sharing.
              </h1>
              <p className="text-sm leading-7 text-primary-foreground/76 md:text-base">
                Use the portal to review current progress, upload requested records, and keep communication in one protected space.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "A simplified external view, separate from the internal advisory workspace.",
                "Secure access intended for applicants, family offices, and approved counterparties.",
              ].map((item) => (
                <div key={item} className="rounded-[20px] border border-white/14 bg-white/[0.06] px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-white/12 text-primary-foreground">
                      <ShieldCheck className="size-4" />
                    </div>
                    <p className="text-sm leading-7 text-primary-foreground/78">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-stack p-6 md:p-8">
            <div className="section-stack">
              <span className="eyebrow">Portal access</span>
              <div className="section-stack">
                <h2 className="text-[1.9rem] leading-[1.08] tracking-[-0.03em] text-foreground">Sign in to continue</h2>
                <p className="text-sm leading-7 text-muted-foreground md:text-base">
                  Enter the email address used for your portal invitation. A secure access step can then be completed from the same session.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="portal-email">
                  Email address
                </label>
                <Input
                  id="portal-email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-12 rounded-2xl px-4"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="portal-reference">
                  Reference or invitation code
                </label>
                <Input
                  id="portal-reference"
                  placeholder="Optional"
                  className="h-12 rounded-2xl px-4"
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="h-12 w-full rounded-full"
                onClick={() => {
                  const result = loginPortalUser(email, reference)
                  if (!result.ok) {
                    setError(result.error ?? "Unable to continue with this portal access.")
                    return
                  }

                  setError("")
                  router.push("/portal")
                }}
              >
                <LockKeyhole className="size-4" />
                Continue securely
              </Button>
              {error ? <p className="text-sm leading-7 text-rose-300">{error}</p> : null}
              <p className="text-sm leading-7 text-muted-foreground">
                If access has already been arranged for you, this is the quickest route back into your portal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
