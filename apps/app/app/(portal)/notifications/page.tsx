"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { Button } from "@cbideal/ui/components/ui/button"
import { useWorkflow } from "@/lib/workflow-store"

function getGroupLabel(timestamp: string) {
  const parsed = new Date(timestamp.replace(",", ""))

  if (Number.isNaN(parsed.getTime())) return "Earlier"

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const itemDay = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())

  if (itemDay.getTime() === today.getTime()) return "Today"
  if (itemDay.getTime() === yesterday.getTime()) return "Yesterday"
  return "Earlier"
}

export default function NotificationsPage() {
  const { getWorkspaceNotificationFeed, markNotificationRead, markNotificationsRead } = useWorkflow()
  const items = getWorkspaceNotificationFeed()
  const unreadIds = items.filter((item) => item.unread).map((item) => item.id)

  const groups = items.reduce<Record<string, typeof items>>((accumulator, item) => {
    const label = getGroupLabel(item.timestamp)
    accumulator[label] ??= []
    accumulator[label].push(item)
    return accumulator
  }, {})

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Notifications"
        title="Recent workflow movement kept in one readable activity view."
        description="Uploads, approvals, payment changes, quotation movement, and assigned work are collected here so account managers can scan what changed without losing context."
        actions={
          unreadIds.length > 0 ? (
            <Button variant="outline" className="app-button-secondary rounded-full" onClick={() => markNotificationsRead(unreadIds)}>
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <div className="app-surface rounded-[26px] px-6 py-6 md:px-8 md:py-7">
        <div className="space-y-7">
          {["Today", "Yesterday", "Earlier"]
            .filter((label) => groups[label]?.length)
            .map((label) => (
              <section key={label} className="space-y-4">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">{label}</p>
                  <div className="h-px flex-1 bg-white/8" />
                </div>

                <div className="grid gap-3">
                  {groups[label].map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-[22px] border px-5 py-5 ${
                        item.unread
                          ? "border-white/12 bg-white/[0.07] shadow-[0_18px_40px_rgba(7,12,19,0.18)]"
                          : "border-white/8 bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {item.unread ? <span className="size-2 rounded-full bg-[var(--app-brand-secondary)]" /> : null}
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                          </div>
                          <p className="text-sm leading-6 text-slate-200">{item.description}</p>
                          <p className="text-sm text-slate-400">{item.context}</p>
                          <p className="text-sm text-slate-400">{item.timestamp}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {item.unread ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="app-button-secondary rounded-full"
                              onClick={() => markNotificationRead(item.id)}
                            >
                              Mark read
                            </Button>
                          ) : null}
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="app-button-secondary rounded-full"
                          >
                            <Link href={item.href} onClick={() => markNotificationRead(item.id)}>
                              Open context
                              <ChevronRight className="size-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>
    </div>
  )
}
