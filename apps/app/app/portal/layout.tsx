"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CreditCard, FileStack, FolderKanban, LogOut, MessageSquareMore, UserRound } from "lucide-react"
import { AppBrand } from "@cbideal/ui/components/app-brand"
import { NotificationsPanel } from "@/components/notifications-panel"
import { useBranding } from "@/lib/branding-store"
import { useWorkflow } from "@/lib/workflow-store"

const portalNavigation = [
  { href: "/portal", label: "Overview", icon: FolderKanban },
  { href: "/portal/quotations", label: "Quotation", icon: FolderKanban },
  { href: "/portal/payments", label: "Payments", icon: CreditCard },
  { href: "/portal/documents", label: "Documents", icon: FileStack },
  { href: "/portal/messages", label: "Messages", icon: MessageSquareMore },
  { href: "/portal/profile", label: "Profile", icon: UserRound },
] as const

export default function ClientPortalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)
  const { branding } = useBranding()
  const {
    hasPortalAccess,
    currentPortalClientId,
    getClientDetail,
    getCaseByClientId,
    getPortalNotificationCount,
    getPortalNotificationFeed,
    markNotificationRead,
    markNotificationsRead,
    setCurrentPortalClient,
  } = useWorkflow()
  const client = getClientDetail(currentPortalClientId)
  const caseRecord = getCaseByClientId(currentPortalClientId)
  const initials = client?.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() ?? "CP"
  const notificationFeed = getPortalNotificationFeed(currentPortalClientId)
  const notificationCount = getPortalNotificationCount(currentPortalClientId)
  const isLoginRoute = pathname === "/portal/login"

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const requestedClient = new URLSearchParams(window.location.search).get("client")

    if (requestedClient) {
      setCurrentPortalClient(requestedClient)
    }
  }, [pathname, setCurrentPortalClient])

  useEffect(() => {
    if (!isLoginRoute && !hasPortalAccess) {
      router.replace("/portal/login")
    }
  }, [hasPortalAccess, isLoginRoute, router])

  if (!isLoginRoute && (!isHydrated || !hasPortalAccess)) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-6">
        <div className="section-card max-w-[720px] rounded-[32px] px-10 py-12 text-center">
          <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">Portal access</span>
          <h1 className="mt-5 font-serif text-[2.4rem] leading-[1.02] tracking-[-0.04em] text-white">
            {isHydrated ? "Redirecting to secure client sign-in." : "Preparing secure client access."}
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {isHydrated
              ? "Client portal pages are only shown after access is granted from the portal login or an intentional internal preview."
              : "Protected portal content stays hidden until this session confirms access."}
          </p>
        </div>
      </div>
    )
  }

  if (isLoginRoute) {
    return (
      <div className="app-shell px-5 py-5 md:px-8 md:py-7 xl:px-10 xl:py-8">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1280px] items-center">
          <main className="w-full">{children}</main>
        </div>
      </div>
    )
  }

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

          <div className="px-5 py-5">
            <div className="app-surface-soft rounded-[22px] px-4 py-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-300">
                Active file
              </p>
              <p className="mt-3 text-base font-semibold text-white">{client?.name ?? "Portal client"}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                {caseRecord?.route ?? "Case information becomes visible once access is configured."}
              </p>
            </div>
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
              <span>Switch access</span>
            </Link>
          </div>
        </aside>

        <div className="min-w-0 px-5 py-5 md:px-8 md:py-7 xl:px-10 xl:py-8">
          <div className="mx-auto flex min-h-full w-full max-w-[1280px] flex-col gap-6">
            <header className="flex items-center justify-between xl:justify-end">
              <div className="flex items-center gap-4 xl:hidden">
                <Link href="/portal">
                  <AppBrand
                    name={branding.companyName}
                    subtitle="Client portal"
                    logoUrl={branding.companyLogoUrl}
                    darkLogoUrl={branding.darkLogoUrl}
                    compact
                  />
                </Link>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{client?.name ?? "Portal client"}</p>
                  <p className="truncate text-xs text-slate-400">{caseRecord?.route ?? "Secure portal access"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <NotificationsPanel
                  items={notificationFeed}
                  unreadCount={notificationCount}
                  title="Recent updates"
                  description="Important document, payment, and application changes tied to your active file."
                  emptyTitle="Nothing new right now"
                  emptyBody="You will see approvals, requests, and payment updates here as your case progresses."
                  onMarkRead={markNotificationRead}
                  onMarkAllRead={markNotificationsRead}
                  viewAllHref="/portal/messages"
                />
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
