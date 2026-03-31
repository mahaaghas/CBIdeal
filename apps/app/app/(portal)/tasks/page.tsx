import Link from "next/link"
import { ArrowRight, CalendarCheck2, Filter, ListChecks } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { CrmTableCard } from "@cbideal/ui/components/crm-table-card"
import { CrmToolbar } from "@cbideal/ui/components/crm-toolbar"
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
  if (priority === "High") return "bg-[#5d2f38] text-[#ffd4d8]"
  if (priority === "Medium") return "bg-[#564423] text-[#ffe2a2]"
  return "bg-[#31455e] text-[#cce1ff]"
}

export default function TasksPage() {
  const taskGroups = [
    {
      title: "In progress",
      items: tasks.filter((task) => task.status === "In progress"),
      note: "Already being handled and expected to move quickly.",
    },
    {
      title: "Waiting on client",
      items: tasks.filter((task) => task.status === "Waiting on client"),
      note: "Dependent on a client response, upload, or confirmation.",
    },
    {
      title: "Scheduled or queued",
      items: tasks.filter((task) => task.status === "Scheduled" || task.status === "Queued"),
      note: "Ready to be pulled forward once the current pressure eases.",
    },
  ]

  const todayCount = tasks.filter((task) => task.due === "Today").length
  const highPriorityCount = tasks.filter((task) => task.priority === "High").length
  const clientDependentCount = tasks.filter((task) => task.status === "Waiting on client").length

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Tasks"
        title="Operational follow-up kept visible, ordered, and easy to act on."
        description="The task view stays practical: clear priority, clear ownership, and a clean read on what belongs to internal coordination versus client follow-up."
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
          <div key={item.label} className="app-subtle-card rounded-[22px] px-5 py-5">
            <p className="text-sm font-semibold text-white">{item.label}</p>
            <p className="mt-3 font-serif text-[2.3rem] leading-none tracking-[-0.04em] text-white">{item.value}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.note}</p>
          </div>
        ))}
      </div>

      <CrmTableCard
        title="Task groups"
        description="A compact grouping by current status, useful for deciding where attention belongs first before moving into the full register."
        className="app-surface"
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {taskGroups.map((group) => (
            <div key={group.title} className="app-subtle-card rounded-[22px] px-5 py-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-white">{group.title}</h3>
                    <p className="text-sm leading-6 text-slate-300">{group.note}</p>
                  </div>
                  <span className="rounded-full bg-white/[0.08] px-3 py-1 text-sm font-semibold text-white">
                    {group.items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {group.items.map((task) => {
                    const caseRecord = cases.find((item) => item.id === task.caseId)
                    return (
                      <Link
                        key={task.id}
                        href={`/clients/${caseRecord?.clientId ?? ""}`}
                        className="block rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4 transition-colors hover:bg-white/[0.07]"
                      >
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-white">{task.name}</p>
                          <p className="text-sm leading-6 text-slate-300">
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
        description="A structured register for daily coordination, with stronger hierarchy for task title, owner, due date, and current priority."
        className="app-surface"
        action={
          <CrmToolbar
            searchPlaceholder="Search tasks, owners, or priority"
            actions={
              <>
                <Button asChild variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white">
                  <Link href="/tasks?filter=priority">
                    <Filter className="size-4" />
                    Filter
                  </Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link href="/tasks?view=due-today">
                    <CalendarCheck2 className="size-4" />
                    Review due today
                  </Link>
                </Button>
              </>
            }
          />
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
            {tasks.map((task) => {
              const caseRecord = cases.find((item) => item.id === task.caseId)
              const dueTone =
                task.due === "Today"
                  ? "text-white"
                  : task.due === "Tomorrow"
                    ? "text-slate-200"
                    : "text-slate-300"

              return (
                <TableRow key={task.id}>
                  <TableCell className="min-w-[21rem]">
                    <div className="space-y-2">
                      <Link
                        href={`/clients/${caseRecord?.clientId ?? ""}`}
                        className="text-[0.98rem] font-semibold text-white transition-colors hover:text-slate-100"
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
                    <span className={`inline-flex rounded-full px-3 py-1.5 text-[0.74rem] font-semibold ${getPriorityTone(task.priority)}`}>
                      {task.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <p className={`font-semibold ${dueTone}`}>{task.due}</p>
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
                    <Button asChild variant="ghost" className="rounded-full text-slate-200 hover:bg-white/[0.08] hover:text-white">
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

        <div className="flex items-start gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-5 py-4">
          <div className="mt-0.5 flex size-10 items-center justify-center rounded-[16px] bg-[var(--app-brand-surface-tint-strong)] text-white">
            <ListChecks className="size-4" />
          </div>
          <p className="text-sm leading-7 text-slate-300">
            The register is intentionally concise. It shows the operational signal first, while deeper case detail still lives inside the client record rather than bloating the table.
          </p>
        </div>
      </CrmTableCard>
    </div>
  )
}
