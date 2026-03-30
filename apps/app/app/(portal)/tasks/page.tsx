import Link from "next/link"
import { CalendarCheck2, Filter } from "lucide-react"
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
import { tasks } from "@/lib/mock-data"

export default function TasksPage() {
  const taskGroups = [
    {
      title: "In progress",
      items: tasks.filter((task) => task.status === "In progress"),
    },
    {
      title: "Waiting on client",
      items: tasks.filter((task) => task.status === "Waiting on client"),
    },
    {
      title: "Scheduled or queued",
      items: tasks.filter((task) => task.status === "Scheduled" || task.status === "Queued"),
    },
  ]

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Tasks"
        title="Follow-up work kept visible without unnecessary noise."
        description="Tasks are arranged to support orderly follow-up across advisory, coordination, and client-facing work. The layout stays compact and readable so the dashboard can remain practical under real use."
      />

      <CrmTableCard
        title="Task groups"
        description="A quick grouping by current status, useful for deciding where attention is needed first."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {taskGroups.map((group) => (
            <div key={group.title} className="surface-muted space-y-4 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
                <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                  {group.items.length}
                </span>
              </div>
              <div className="space-y-3">
                {group.items.map((task) => (
                  <div
                    key={task.name}
                    className="rounded-[18px] border border-border/70 bg-background px-4 py-3 shadow-sm"
                  >
                    <p className="text-sm font-medium text-foreground">{task.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {task.owner}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CrmTableCard>

      <CrmTableCard
        title="Task register"
        description="The full register is intended for day-to-day coordination, whether a task belongs to advisory review, documents, or client communication."
        action={
          <CrmToolbar
            searchPlaceholder="Search tasks, owners, or priority"
            actions={
              <>
                <Button asChild variant="outline" className="rounded-full">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium text-foreground">{row.name}</TableCell>
                <TableCell>{row.priority}</TableCell>
                <TableCell>{row.due}</TableCell>
                <TableCell>{row.owner}</TableCell>
                <TableCell>
                  <CrmStatusBadge status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CrmTableCard>
    </div>
  )
}
