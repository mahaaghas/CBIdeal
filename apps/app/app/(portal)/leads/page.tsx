import { ArrowRight, Filter } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
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
import { leads, pipelineStages } from "@/lib/mock-data"

export default function LeadsPage() {
  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Leads"
        title="A clearer pipeline for new relationships and early-stage matters."
        description="The lead workspace is designed to show stage, focus, timing, and ownership without slipping into a generic sales dashboard. Use the stage cards for a quick read, then move into the register for detail."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmStatCard label="Initial review" value="24" note="Matters still being assessed for direction and fit." trend="8 added this week" />
        <CrmStatCard label="Private consultation" value="18" note="Conversations already advanced into a more direct exchange." trend="5 scheduled" />
        <CrmStatCard label="Awaiting documents" value="11" note="Additional records or clarifications needed before the next step." trend="3 due today" />
      </div>

      <CrmTableCard
        title="Stage view"
        description="A compact pipeline layout for quick triage across the current enquiry picture."
      >
        <div className="grid gap-4 xl:grid-cols-4">
          {pipelineStages.map((stage) => (
            <div key={stage.label} className="surface-muted space-y-4 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground">{stage.label}</h3>
                <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                  {stage.count}
                </span>
              </div>
              <div className="space-y-3">
                {stage.items.map((item) => (
                  <div
                    key={`${stage.label}-${item.name}`}
                    className="rounded-[18px] border border-border/70 bg-background px-4 py-3 shadow-sm"
                  >
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.focus}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.owner}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CrmTableCard>

      <CrmTableCard
        title="Lead register"
        description="A single register for investor, family office, and professional enquiries, with enough context to guide the next conversation."
        action={
          <CrmToolbar
            searchPlaceholder="Search names, regions, or route focus"
            actions={
              <>
                <Button variant="outline" className="rounded-full">
                  <Filter className="size-4" />
                  Filter
                </Button>
                <Button className="rounded-full">
                  Review current matters
                  <ArrowRight className="size-4" />
                </Button>
              </>
            }
          />
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Focus</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-foreground">{row.name}</TableCell>
                <TableCell>{row.focus}</TableCell>
                <TableCell>{row.region}</TableCell>
                <TableCell>{row.budget}</TableCell>
                <TableCell>
                  <CrmStatusBadge status={row.status} />
                </TableCell>
                <TableCell>{row.owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CrmTableCard>
    </div>
  )
}
