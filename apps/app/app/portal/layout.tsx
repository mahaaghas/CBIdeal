"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, CreditCard, FileStack, FolderKanban, LogOut, Settings } from "lucide-react"

const portalNavigation = [
  { href: "/portal", label: "Overview", icon: FolderKanban },
  { href: "/portal/quotations", label: "Applications", icon: FolderKanban },
  { href: "/portal/payments", label: "Payments", icon: CreditCard },
  { href: "/portal/documents", label: "Documents", icon: FileStack },
  { href: "/portal/profile", label: "Settings", icon: Settings },
] as const

export default function ClientPortalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="app-shell">
      <div className="grid min-h-screen xl:grid-cols-[244px_minmax(0,1fr)]">
        <aside className="app-sidebar hidden xl:flex xl:flex-col">
          <div className="app-sidebar-brand px-8 py-7">
            <Link href="/portal" className="inline-flex flex-col leading-none">
              <span className="font-serif text-[3.1rem] tracking-[-0.05em] text-white">CBI</span>
              <span className="mt-2 pl-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-slate-200">
                Client Portal
              </span>
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
                <span className="font-serif text-[2.2rem] tracking-[-0.05em] text-white">CBI Deal</span>
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  href="/portal/messages"
                  aria-label="Open portal notifications"
                  className="app-top-icon relative flex size-12 items-center justify-center rounded-full transition-colors"
                >
                  <Bell className="size-5" />
                  <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-[#f04f4f] text-[0.68rem] font-semibold text-white">
                    3
                  </span>
                </Link>
                <Link
                  href="/portal/profile"
                  aria-label="Open client profile"
                  className="app-avatar flex size-12 items-center justify-center rounded-full text-base font-semibold"
                >
                  AM
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
