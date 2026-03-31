"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CircleHelp,
  CreditCard,
  FileStack,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  ReceiptText,
  Settings,
  Users,
} from "lucide-react"
import { cn } from "../lib/utils"

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: CircleHelp },
  { href: "/clients", label: "Clients", icon: Building2 },
  { href: "/cases", label: "Applications", icon: BriefcaseBusiness },
  { href: "/documents", label: "Documents", icon: FileStack },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/quotations", label: "Quotations", icon: ReceiptText },
  { href: "/templates", label: "Templates", icon: Mail },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
] as const

interface CrmShellProps {
  children: ReactNode
  notificationCount?: number
  profileInitials?: string
}

export function CrmShell({
  children,
  notificationCount = 3,
  profileInitials = "AD",
}: CrmShellProps) {
  const pathname = usePathname()

  return (
    <div className="app-shell">
      <div className="grid min-h-screen xl:grid-cols-[244px_minmax(0,1fr)]">
        <aside className="app-sidebar hidden xl:flex xl:flex-col">
          <div className="app-sidebar-brand px-8 py-7">
            <Link href="/dashboard" className="inline-flex flex-col leading-none">
              <span className="font-serif text-[3.1rem] tracking-[-0.05em] text-white">CBI</span>
              <span className="mt-2 pl-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-slate-200">
                Deal Platform
              </span>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4" aria-label="Workspace navigation">
            <div className="space-y-2">
              {navigation.map((item) => {
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
              href="/portal"
              className="app-nav-link flex items-center gap-3 rounded-2xl px-4 py-3 text-[1rem] font-medium transition-colors"
            >
              <FolderKanban className="size-4" />
              <span>Client portal</span>
            </Link>
            <Link
              href="/portal/login"
              className="app-nav-link mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[1rem] font-medium transition-colors"
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </Link>
          </div>
        </aside>

        <div className="min-w-0 px-5 py-5 md:px-8 md:py-7 xl:px-10 xl:py-8">
          <div className="mx-auto flex min-h-full w-full max-w-[1280px] flex-col gap-6">
            <header className="flex items-center justify-between xl:justify-end">
              <Link href="/dashboard" className="xl:hidden">
                <span className="font-serif text-[2.2rem] tracking-[-0.05em] text-white">CBI Deal</span>
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  href="/settings#notifications"
                  aria-label="Open notifications"
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
                  href="/settings"
                  aria-label="Open profile and workspace settings"
                  className="app-avatar flex size-12 items-center justify-center rounded-full text-base font-semibold"
                >
                  {profileInitials}
                </Link>
              </div>
            </header>

            <nav className="flex gap-2 overflow-x-auto xl:hidden" aria-label="Mobile workspace navigation">
              {navigation.map((item) => {
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
