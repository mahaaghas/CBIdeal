import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BrandMark } from "@cbideal/ui/components/brand-mark"
import { Button } from "@cbideal/ui/components/ui/button"

export default function ClientPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-shell py-5 md:py-6">
        <header className="section-card mb-5">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <BrandMark href="/portal" wordmark="DEAL" monogram="CBI" />
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Client portal</p>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  A simplified space for application updates, document sharing, and current progress.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/portal/login">Client sign in</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/dashboard">
                  Internal workspace
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}
