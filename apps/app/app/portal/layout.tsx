"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, CreditCard, FileStack, FolderKanban, LogOut, Settings } from "lucide-react"
import { AppBrand } from "@cbideal/ui/components/app-brand"
import { useBranding } from "@/lib/branding-store"
import { useWorkflow } from "@/lib/workflow-store"

const portalNavigation = [
  { href: "/portal", label: "Overview", icon: FolderKanban },
  { href: "/portal/quotations", label: "Applications", icon: FolderKanban },
  { href: "/portal/payments", label: "Payments", icon: CreditCard },
  { href: "/portal/documents", label: "Documents", icon: FileStack },
  { href: "/portal/profile", label: "Settings", icon: Settings },
] as const

export default function ClientPortalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { branding } = useBranding()
  const { currentPortalClientId, getClientDetail, getNotificationsForClient } = useWorkflow()
  const client = getClientDetail(currentPortalClientId)
  const initials = client?.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() ?? "CP"
  const notificationCount = getNotificationsForClient(currentPortalClientId).filter(
    (item) => item.status === "Queued" || item.status === "Sent",
  ).length

  return (
    <div className="app-shell">
      <div className="grid min-h-screen xl:grid-cols-[244px_minmax(0,1fr)]">
        <aside className="app-sidebar hidden xl:flex xl:flex-col">
          <div className="app-sidebar-brand px-8 py-7">
            <Link href="/portal">
              <AppBrand
                name={branding.companyName}
                subtitle="Client portal"
                logoUrl={branding.companyLogoUrl}
                darkLogoUrl={branding.darkLogoUrl}
              />
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {portalNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`app-nav-link flex items-center gap-3 rounded-2xl px-4 py-3 text-[1rem] font-medium ${isActive ? "app-nav-link-active" : ""}`}
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="border-t border-white/8 px-3 py-5">
            <Link
              href="/portal/login"
              className="app-nav-link flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[1rem] font-medium transition-colors"
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </Link>
          </div>
        </aside>

        <div className="min-w-0 px-5 py-5 md:px-8 md:py-7 xl:px-10 xl:py-8">
          <div className="mx-auto flex min-h-full w-full max-w-[1280px] flex-col gap-6">
            <header className="flex items-center justify-between xl:justify-end">
              <Link href="/portal" className="xl:hidden">
                <AppBrand
                  name={branding.companyName}
                  subtitle="Client portal"
                  logoUrl={branding.companyLogoUrl}
                  darkLogoUrl={branding.darkLogoUrl}
                  compact
                />
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  href="/portal/messages"
                  aria-label="Open portal notifications"
                  className="app-top-icon relative flex size-12 items-center justify-center rounded-full transition-colors"
                >
                  <Bell className="size-5" />
                  {notificationCount > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-[#f04f4f] text-[0.68rem] font-semibold text-white">
                      {notificationCount}
                    </span>
                  ) : null}
                </Link>
                <Link
                  href="/portal/profile"
                  aria-label="Open client profile"
                  className="app-avatar flex size-12 items-center justify-center rounded-full text-base font-semibold"
                >
                  {initials}
                </Link>
              </div>
            </header>

            <nav className="flex gap-2 overflow-x-auto xl:hidden">
              {portalNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`app-nav-link flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ${isActive ? "app-nav-link-active" : ""}`}
                  >
                    <item.icon className="size-4" />
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
