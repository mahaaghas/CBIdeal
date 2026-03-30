import Link from "next/link"
import {
  ArrowRight,
  BellRing,
  CreditCard,
  FileStack,
  ReceiptText,
  ShieldCheck,
} from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { CrmTableCard } from "@cbideal/ui/components/crm-table-card"
import { Button } from "@cbideal/ui/components/ui/button"
import { Progress } from "@cbideal/ui/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cbideal/ui/components/ui/table"
import {
  cases,
  dashboardMetrics,
  documentChecklistItems,
  notificationLog,
  paymentSchedules,
  quotations,
  reminderSettings,
  tasks,
  workspace,
} from "@/lib/mock-data"

const icons = [
  <ReceiptText key="quotations" className="size-5" />,
  <CreditCard key="payments" className="size-5" />,
  <FileStack key="checklist" className="size-5" />,
  <BellRing key="reminders" className="size-5" />,
]

export default function DashboardPage() {
  const overduePayments = paymentSchedules.filter((item) => item.status === "Overdue" || item.status === "Rejected")
  const reviewQueue = documentChecklistItems.filter(
    (item) => item.status === "Uploaded" || item.status === "Under Review" || item.status === "Rejected",
  )

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Account manager dashboard"
        title="A structured operating view across quotations, payments, documents, and current cases."
        description="The workspace is designed to keep financial steps, document review, and client communication visible from one place. Use this view to see what needs attention today, what is waiting on clients, and where internal follow-through should happen next."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/documents">Open review queue</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/quotations">
                Review quotations
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric, index) => (
          <CrmStatCard key={metric.label} {...metric} icon={icons[index]} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <CrmTableCard
          title="Attention required today"
          description="Priority tasks across payment handling, document review, and active case progression."
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/tasks">View all tasks</Link>
            </Button>
          }
        >
          <div className="grid gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between gap-4 rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{task.name}</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {task.owner} · {task.priority} priority · due {task.due}
                  </p>
                </div>
                <CrmStatusBadge status={task.status} />
              </div>
            ))}
          </div>
        </CrmTableCard>

        <CrmSectionCard
          title="Workspace summary"
          description="A quick read on the operating model behind the current workload."
        >
          <div className="rounded-[22px] border border-primary/10 bg-primary/[0.04] p-5">
            <p className="text-sm leading-7 text-muted-foreground">
              <span className="font-medium text-foreground">{workspace.workspaceName}</span> is running one internal
              operating layer for advisers, coordinators, and finance, with a separate client-facing layer for
              quotations, payment proofs, and document uploads.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              {
                label: "Quotations in circulation",
                value: `${quotations.length}`,
                note: "Draft, sent, and accepted schedules kept close to the relevant case.",
              },
              {
                label: "Payments needing attention",
                value: `${overduePayments.length + paymentSchedules.filter((item) => item.status === "Awaiting proof").length}`,
                note: "Upcoming stages, missing proofs, and rejected payment evidence.",
              },
              {
                label: "Documents in review",
                value: `${reviewQueue.length}`,
                note: "Uploads waiting on review, approval, or re-upload guidance.",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <CrmTableCard
          title="Payments and review checkpoints"
          description="Financial stages and client evidence that still require coordination or approval."
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/payments">Open payment tracking</Link>
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentSchedules.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-foreground">{row.client}</TableCell>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.dueDate}</TableCell>
                  <TableCell>
                    <CrmStatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CrmTableCard>

        <CrmSectionCard
          title="Reminder and notification activity"
          description="Automated follow-through across quotations, payments, uploads, and missing records."
        >
          <div className="space-y-3">
            {notificationLog.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{item.type}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.recipient} · {item.channel} · {item.sentAt}
                    </p>
                  </div>
                  <CrmStatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3 border-t border-border/70 pt-4">
            {reminderSettings.map((setting) => (
              <div key={setting.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{setting.name}</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {setting.trigger} · {setting.audience}
                  </p>
                </div>
                <CrmStatusBadge status={setting.status} />
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <CrmTableCard
          title="Live cases"
          description="Current matters, where they stand, and how far each one has moved through the work already in hand."
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/cases">View all cases</Link>
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-foreground">{item.route}</TableCell>
                  <TableCell>{item.client}</TableCell>
                  <TableCell>
                    <CrmStatusBadge status={item.stage} />
                  </TableCell>
                  <TableCell className="min-w-44">
                    <div className="space-y-2">
                      <Progress value={item.progress} className="h-2.5" />
                      <p className="text-xs text-muted-foreground">{item.progress}% complete</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CrmTableCard>

        <CrmSectionCard
          title="Review discipline"
          description="The same operating logic runs across casework, document handling, and client-facing communication."
        >
          <div className="space-y-3">
            {[
              {
                icon: ShieldCheck,
                title: "Approved uploads are visible",
                body: "External users only see the progress, requests, and updates that are ready to be shown.",
              },
              {
                icon: FileStack,
                title: "Rejected items stay actionable",
                body: "Re-upload requests keep the reason close to the item so follow-up stays precise rather than generic.",
              },
              {
                icon: CreditCard,
                title: "Payments stay tied to cases",
                body: "Each payment stage remains linked to its quotation, case, and assigned account manager.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}
