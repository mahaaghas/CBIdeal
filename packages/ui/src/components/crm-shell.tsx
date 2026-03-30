"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BellDot,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleHelp,
  FileStack,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Search,
  Settings,
  Users,
} from "lucide-react"
import { BrandMark } from "./brand-mark"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { cn } from "../lib/utils"

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: CircleHelp },
  { href: "/clients", label: "Clients", icon: Building2 },
  { href: "/cases", label: "Cases / Applications", icon: BriefcaseBusiness },
  { href: "/documents", label: "Documents", icon: FileStack },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
] as const

interface CrmShellProps {
  children: ReactNode
}

export function CrmShell({ children }: CrmShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <div className="container-shell py-4 md:py-6">
        <div className="grid gap-5 xl:grid-cols-[276px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <Card className="hero-panel overflow-hidden">
              <CardContent className="space-y-6 p-6">
                <BrandMark href="/dashboard" muted wordmark="DEAL" monogram="CBI" />
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-primary-foreground/68">
                    CBI Deal Platform
                  </p>
                  <h1 className="text-[1.8rem] leading-[1.08] tracking-[-0.03em] text-primary-foreground">
                    Calm structure for casework, client visibility, and internal coordination.
                  </h1>
                  <p className="text-sm leading-7 text-primary-foreground/78">
                    One shared workspace for investor matters, team activity, and controlled client access.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/14 bg-white/[0.08] p-4">
                  <p className="text-sm font-medium text-primary-foreground">app.cbideal.nl</p>
                  <p className="mt-1 text-sm leading-6 text-primary-foreground/72">
                    Prepared for multi-tenant workspaces, firm-level controls, and client-specific access.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="section-card overflow-hidden">
              <CardContent className="space-y-2 p-3">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between rounded-[20px] px-4 py-3 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-[0_14px_32px_rgba(21,27,42,0.18)]"
                          : "text-foreground hover:bg-muted/70",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </span>
                      <ChevronRight
                        className={cn(
                          "size-4 transition-transform",
                          isActive ? "opacity-100" : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-70",
                        )}
                      />
                    </Link>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="section-card">
              <CardContent className="space-y-4 p-5">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    External access
                  </p>
                  <p className="text-sm leading-7 text-foreground">
                    A simplified client portal can sit alongside the internal workspace without changing the core
                    system.
                  </p>
                </div>
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link href="/portal">
                    <FolderKanban className="size-4" />
                    View client portal
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>

          <div className="space-y-5">
            <header className="section-card">
              <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-5">
                <div className="flex flex-1 items-center gap-3 rounded-full border border-border/70 bg-background px-4 py-3 shadow-sm">
                  <Search className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Search clients, cases, documents, or internal notes
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <BellDot className="size-4" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                  <div className="flex items-center gap-3 rounded-full border border-border/70 bg-background px-3 py-2 shadow-sm">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      CD
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">CBI Deal Workspace</p>
                      <p className="text-xs text-muted-foreground">Admin seat</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </header>

            <nav className="section-card xl:hidden" aria-label="Mobile app navigation">
              <CardContent className="flex gap-2 overflow-x-auto p-3">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted/55 text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </CardContent>
            </nav>

            <main className="space-y-5">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}
