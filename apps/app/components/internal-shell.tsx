"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, ArrowRight, LayoutDashboard, Mail, ReceiptText, Settings2 } from "lucide-react"
import { AppBrand } from "@cbideal/ui/components/app-brand"
import { cn } from "@cbideal/ui/lib/utils"
import { useBranding } from "@/lib/branding-store"

const internalNavigation = [
  { href: "/internal/funnel-health", label: "Funnel health", icon: Activity },
  { href: "/internal/leads", label: "Website leads", icon: LayoutDashboard },
  { href: "/internal/templates", label: "Email templates", icon: Mail },
  { href: "/internal/signups", label: "SaaS signups", icon: ReceiptText },
] as const

export function InternalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { branding } = useBranding()

  return (
    <div className="app-shell">
      <div className="grid min-h-screen xl:grid-cols-[244px_minmax(0,1fr)]">
        <aside className="app-sidebar hidden xl:flex xl:flex-col">
          <div className="app-sidebar-brand px-8 py-7">
            <Link href="/internal/funnel-health">
              <AppBrand
                name={branding.companyName}
                subtitle="Internal control panel"
                logoUrl={branding.companyLogoUrl}
                darkLogoUrl={branding.darkLogoUrl}
              />
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4" aria-label="Internal navigation">
            <div className="space-y-2">
              {internalNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "app-nav-link flex items-center gap-3 rounded-2xl px-4 py-3 text-[1rem] font-medium transition-colors",
                      isActive && "app-nav-link-active",
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="border-t border-white/8 px-3 py-5">
            <Link
              href="/dashboard"
              className="app-nav-link flex items-center gap-3 rounded-2xl px-4 py-3 text-[1rem] font-medium transition-colors"
            >
              <Settings2 className="size-4" />
              <span>Product workspace</span>
            </Link>
          </div>
        </aside>

        <div className="min-w-0 px-5 py-5 md:px-8 md:py-7 xl:px-10 xl:py-8">
          <div className="mx-auto flex min-h-full w-full max-w-[1280px] flex-col gap-6">
            <header className="flex items-center justify-between">
              <Link href="/internal/funnel-health" className="xl:hidden">
                <AppBrand
                  name={branding.companyName}
                  subtitle="Internal control panel"
                  logoUrl={branding.companyLogoUrl}
                  darkLogoUrl={branding.darkLogoUrl}
                  compact
                />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/20"
              >
                Open product workspace
                <ArrowRight className="size-4" />
              </Link>
            </header>

            <nav className="flex gap-2 overflow-x-auto xl:hidden" aria-label="Internal mobile navigation">
              {internalNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "app-nav-link flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive && "app-nav-link-active",
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <main className="space-y-6">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
