import Link from "next/link"
import { Activity, ArrowRight, Building2, FileStack, ShieldCheck, Users } from "lucide-react"
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
import { cases, dashboardMetrics, pipelineStages, tasks, workspace } from "@/lib/mock-data"

const icons = [
  <Activity key="activity" className="size-5" />,
  <Users key="users" className="size-5" />,
  <ShieldCheck key="shield" className="size-5" />,
  <FileStack key="files" className="size-5" />,
]

export default function DashboardPage() {
  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Dashboard"
        title="A clear operating view across investor enquiries, clients, and live matters."
        description="The dashboard keeps the current picture visible without losing the calm, controlled language of the wider CBI Deal system. Use it to review active work, current priorities, and where attention is needed next."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/cases">Review active cases</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/clients">
                View client relationships
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

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <CrmTableCard
          title="Pipeline snapshot"
          description="A quick read across the current stages, so the internal team can see volume, focus, and ownership at a glance."
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/leads">Open lead register</Link>
            </Button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            {pipelineStages.map((stage) => (
              <div key={stage.label} className="surface-muted space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">{stage.label}</h3>
                    <p className="text-sm text-muted-foreground">{stage.count} matters currently in view</p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-full bg-background text-sm font-semibold text-primary shadow-sm">
                    {stage.count}
                  </div>
                </div>
                <div className="space-y-3">
                  {stage.items.map((item) => (
                    <div
                      key={`${stage.label}-${item.name}`}
                      className="rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm"
                    >
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.focus}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {item.owner}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CrmTableCard>

        <CrmSectionCard
          title="Workspace note"
          description="The app layer stays close to the public design system, but the rhythm is tightened for data-heavy views and internal decision-making."
        >
          <div className="rounded-[22px] border border-primary/10 bg-primary/[0.04] p-5">
            <p className="text-sm leading-7 text-muted-foreground">
              <span className="font-medium text-foreground">{workspace.workspaceName}</span> is configured for
              internal team seats, external client access, and later tenant-level tailoring without splitting into a
              different product language.
            </p>
          </div>
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.name}
                className="flex items-center justify-between gap-3 rounded-[20px] border border-border/70 bg-background px-4 py-3 shadow-sm"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{task.name}</p>
                  <p className="text-xs text-muted-foreground">{task.owner}</p>
                </div>
                <CrmStatusBadge status={task.status} />
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <CrmTableCard
          title="Live cases"
          description="A narrower case view for what is moving now, including stage visibility and current progress."
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
          title="Portfolio composition"
          description="A simple split of the current workspace mix, useful for capacity planning and later tenant-level reporting."
        >
          <div className="space-y-4">
            {[
              { label: "Citizenship matters", value: "41%", icon: ShieldCheck },
              { label: "Residence matters", value: "37%", icon: Building2 },
              { label: "Strategic relocation", value: "22%", icon: Users },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">Current live portfolio share</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>
    </div>
  )
}
