"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Bell, ChevronRight } from "lucide-react"
import { Button } from "@cbideal/ui/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@cbideal/ui/components/ui/sheet"
import { cn } from "@cbideal/ui/lib/utils"
import type { WorkflowNotificationFeedItem } from "@/lib/workflow-store"

interface NotificationsPanelProps {
  items: WorkflowNotificationFeedItem[]
  unreadCount: number
  title: string
  description: string
  emptyTitle: string
  emptyBody: string
  onMarkRead: (id: string) => void
  onMarkAllRead: (ids: string[]) => void
}

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

export function NotificationsPanel({
  items,
  unreadCount,
  title,
  description,
  emptyTitle,
  emptyBody,
  onMarkRead,
  onMarkAllRead,
}: NotificationsPanelProps) {
  const groups = useMemo(() => {
    return items.reduce<Record<string, WorkflowNotificationFeedItem[]>>((accumulator, item) => {
      const group = getGroupLabel(item.timestamp)
      accumulator[group] ??= []
      accumulator[group].push(item)
      return accumulator
    }, {})
  }, [items])

  const unreadIds = items.filter((item) => item.unread).map((item) => item.id)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open notifications"
          className="app-top-icon relative flex size-12 items-center justify-center rounded-full transition-colors"
        >
          <Bell className="size-5" />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-[#f04f4f] text-[0.68rem] font-semibold text-white">
              {unreadCount}
            </span>
          ) : null}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="app-surface flex h-full w-full max-w-[28rem] flex-col gap-0 border-l border-white/10 p-0 text-white sm:max-w-[28rem]"
      >
        <SheetHeader className="border-b border-white/8 px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <SheetTitle className="font-serif text-[2rem] tracking-[-0.03em] text-white">{title}</SheetTitle>
              <SheetDescription className="max-w-md text-sm leading-7 text-slate-300">
                {description}
              </SheetDescription>
            </div>
            {unreadIds.length > 0 ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
                onClick={() => onMarkAllRead(unreadIds)}
              >
                Mark all read
              </Button>
            ) : null}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full min-h-[16rem] items-center justify-center">
              <div className="app-surface-soft max-w-sm rounded-[24px] px-6 py-6 text-center">
                <p className="text-base font-semibold text-white">{emptyTitle}</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">{emptyBody}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-7">
              {["Today", "Yesterday", "Earlier"]
                .filter((label) => groups[label]?.length)
                .map((label) => (
                  <section key={label} className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">{label}</p>
                      <div className="h-px flex-1 bg-white/8" />
                    </div>

                    <div className="space-y-3">
                      {groups[label].map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => onMarkRead(item.id)}
                          className={cn(
                            "block rounded-[22px] border px-4 py-4 transition-colors hover:bg-white/[0.07]",
                            item.unread
                              ? "border-white/12 bg-white/[0.07] shadow-[0_18px_40px_rgba(7,12,19,0.18)]"
                              : "border-white/8 bg-white/[0.03]",
                          )}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-white">{item.title}</p>
                                <p className="text-sm leading-6 text-slate-200">{item.description}</p>
                              </div>
                              <span
                                className={cn(
                                  "shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em]",
                                  item.unread
                                    ? "bg-[var(--app-brand-surface-tint-strong)] text-white"
                                    : "bg-white/[0.06] text-slate-300",
                                )}
                              >
                                {item.status}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-4 text-sm">
                              <div className="min-w-0">
                                <p className="truncate text-slate-300">{item.context}</p>
                                <p className="text-slate-400">{item.timestamp}</p>
                              </div>
                              <ChevronRight className="size-4 shrink-0 text-slate-400" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-white/8 px-6 py-4">
          <p className="text-sm leading-6 text-slate-300">
            Recent workflow movement is kept here so approvals, uploads, and quotation changes stay visible without leaving the current workspace.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
