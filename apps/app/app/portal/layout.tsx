import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BrandMark } from "@cbideal/ui/components/brand-mark"
import { Button } from "@cbideal/ui/components/ui/button"

const portalNavigation = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/quotations", label: "Quotations" },
  { href: "/portal/payments", label: "Payments" },
  { href: "/portal/documents", label: "Documents Checklist" },
  { href: "/portal/messages", label: "Messages / Updates" },
  { href: "/portal/profile", label: "Profile" },
] as const

export default function ClientPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-shell py-5 md:py-6">
        <header className="section-card mb-5 overflow-hidden">
          <div className="flex flex-col gap-5 p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <BrandMark href="/portal" wordmark="DEAL" monogram="CBI" />
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Client portal</p>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                    A controlled client view for quotations, payment stages, document requests, and approved case
                    updates.
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

            <nav aria-label="Client portal navigation" className="flex flex-wrap gap-2">
              {portalNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/55"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}
