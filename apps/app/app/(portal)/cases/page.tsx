import { ArrowRight, Filter } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { CrmTableCard } from "@cbideal/ui/components/crm-table-card"
import { CrmToolbar } from "@cbideal/ui/components/crm-toolbar"
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
import { cases } from "@/lib/mock-data"

export default function CasesPage() {
  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Cases / Applications"
        title="Case progress, current stages, and next milestones kept in view."
        description="The case layer is where route decisions, documentation, and authority-facing steps start to converge. It is designed to keep progress clear without losing the calm tone of the wider platform."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmStatCard label="Due diligence preparation" value="9" note="Files currently being tightened before formal submission." trend="3 priority cases" />
        <CrmStatCard label="Government review" value="7" note="Applications already moving through formal external review." trend="2 updates expected" />
        <CrmStatCard label="Document collection" value="11" note="Cases still gathering records or clarifications." trend="6 awaiting uploads" />
      </div>

      <CrmTableCard
        title="Case register"
        description="A single register for current applications, residence matters, and structured relocation work."
        action={
          <CrmToolbar
            searchPlaceholder="Search routes, case references, or clients"
            actions={
              <>
                <Button variant="outline" className="rounded-full">
                  <Filter className="size-4" />
                  Filter
                </Button>
                <Button className="rounded-full">
                  Review upcoming milestones
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
              <TableHead>Reference</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Next milestone</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-foreground">{row.route}</TableCell>
                <TableCell>{row.client}</TableCell>
                <TableCell>
                  <CrmStatusBadge status={row.stage} />
                </TableCell>
                <TableCell>{row.nextMilestone}</TableCell>
                <TableCell className="min-w-40">
                  <div className="space-y-2">
                    <Progress value={row.progress} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">{row.progress}% complete</p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CrmTableCard>
    </div>
  )
}
