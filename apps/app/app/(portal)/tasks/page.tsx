"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, CalendarCheck2, ListChecks, Search } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { CrmTableCard } from "@cbideal/ui/components/crm-table-card"
import { Button } from "@cbideal/ui/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cbideal/ui/components/ui/table"
import { cases, tasks } from "@/lib/mock-data"

function getPriorityTone(priority: string) {
  if (priority === "High") return "app-status-pill app-status-red"
  if (priority === "Medium") return "app-status-pill app-status-amber"
  return "app-status-pill app-status-blue"
}

export default function TasksPage() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"All" | "Due today" | "Waiting on client" | "High priority">("All")

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const caseRecord = cases.find((item) => item.id === task.caseId)
      const matchesQuery = [task.name, task.owner, task.priority, task.status, caseRecord?.client, caseRecord?.route]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())

      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Due today"
            ? task.due === "Today"
            : filter === "Waiting on client"
              ? task.status === "Waiting on client"
              : task.priority === "High"

      return matchesQuery && matchesFilter
    })
  }, [filter, query])

  const taskGroups = [
    {
      title: "In progress",
      items: visibleTasks.filter((task) => task.status === "In progress"),
      note: "Already underway and expected to move soon.",
    },
    {
      title: "Waiting on client",
      items: visibleTasks.filter((task) => task.status === "Waiting on client"),
      note: "Held back by a client response, upload, or confirmation.",
    },
    {
      title: "Scheduled or queued",
      items: visibleTasks.filter((task) => task.status === "Scheduled" || task.status === "Queued"),
      note: "Ready to move once the current pressure eases.",
    },
  ]

  const todayCount = tasks.filter((task) => task.due === "Today").length
  const highPriorityCount = tasks.filter((task) => task.priority === "High").length
  const clientDependentCount = tasks.filter((task) => task.status === "Waiting on client").length

  return (
    <div className="app-page-stack">
      <CrmPageHeader
        eyebrow="Tasks"
        title="Operational follow-up kept visible, ordered, and easy to move."
        description="The task workspace stays calm and practical: clear hierarchy, stronger priority contrast, and a more legible register for the items that need internal action or client follow-up."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Due today",
            value: `${todayCount}`,
            note: "Tasks that should be cleared before the day closes.",
          },
          {
            label: "High priority",
            value: `${highPriorityCount}`,
            note: "Items carrying operational or client-facing urgency.",
          },
          {
            label: "Waiting on client",
            value: `${clientDependentCount}`,
            note: "Tasks that need a client-side step before they can move.",
          },
        ].map((item) => (
          <div key={item.label} className="app-subtle-card-strong rounded-[22px] px-6 py-6">
            <p className="app-type-overline">{item.label}</p>
            <p className="app-type-metric mt-3">{item.value}</p>
            <p className="app-type-caption mt-3 text-sm">{item.note}</p>
          </div>
        ))}
      </div>

      <CrmTableCard
        title="Task groups"
        description="A quick read on where active task pressure currently sits before moving into the full register."
        className="app-surface"
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {taskGroups.map((group) => (
            <div key={group.title} className="app-subtle-card-strong rounded-[22px] px-6 py-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-white">{group.title}</h3>
                    <p className="app-type-caption text-sm">{group.note}</p>
                  </div>
                  <span className="app-pill-count">
                    {group.items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {group.items.slice(0, 4).map((task) => {
                    const caseRecord = cases.find((item) => item.id === task.caseId)
                    return (
                      <Link
                        key={task.id}
                        href={`/clients/${caseRecord?.clientId ?? ""}`}
                        className="app-note-panel app-interactive-card block"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-white">{task.name}</p>
                            <span className={getPriorityTone(task.priority)}>{task.priority}</span>
                          </div>
                          <p className="app-type-caption text-sm">
                            {caseRecord?.client} / {task.owner}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CrmTableCard>

      <CrmTableCard
        title="Task register"
        description="A cleaner daily coordination register, with clearer task hierarchy, stronger priority treatment, and fully visible actions."
        className="app-surface"
        action={
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
            <div className="relative w-full min-w-0 lg:w-[23rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="app-search h-12 w-full rounded-full px-11 text-sm outline-none"
                placeholder="Search task, client, owner, or route"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["All", "Due today", "Waiting on client", "High priority"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    filter === option ? "app-filter-chip-active" : "app-filter-chip"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <Button className="rounded-full" onClick={() => setFilter("Due today")}>
              <CalendarCheck2 className="size-4" />
              Review due today
            </Button>
          </div>
        }
      >
        <Table className="app-grid-table">
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleTasks.map((task) => {
              const caseRecord = cases.find((item) => item.id === task.caseId)
              return (
                <TableRow key={task.id}>
                  <TableCell className="min-w-[22rem]">
                    <div className="space-y-2">
                      <Link
                        href={`/clients/${caseRecord?.clientId ?? ""}`}
                        className="text-[1rem] font-semibold text-white transition-colors hover:text-slate-100"
                      >
                        {task.name}
                      </Link>
                      <div className="space-y-1 text-sm">
                        <p className="text-slate-300">{caseRecord?.client}</p>
                        <p className="text-slate-400">{caseRecord?.route}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={getPriorityTone(task.priority)}>{task.priority}</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-slate-100">{task.due}</p>
                      <p className="text-slate-400">Current target</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-slate-100">{task.owner}</p>
                      <p className="text-slate-400">Assigned owner</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CrmStatusBadge status={task.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm" className="app-button-secondary rounded-full">
                      <Link href={`/clients/${caseRecord?.clientId ?? ""}`}>
                        Open case
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

          <div className="app-note-panel flex items-start gap-3">
            <div className="mt-0.5 flex size-10 items-center justify-center rounded-[16px] bg-[var(--app-brand-surface-tint-strong)] text-white">
              <ListChecks className="size-4" />
            </div>
          <p className="app-type-caption text-sm leading-7">
            The register stays concise on purpose. It keeps daily task pressure readable without turning the page into a noisy generic operations board.
          </p>
        </div>
      </CrmTableCard>
    </div>
  )
}
