import Link from "next/link"
import { ArrowRight, Filter, FolderClock, ShieldCheck } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
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
import { cases, getChecklistForCase, getPaymentsForClient } from "@/lib/mock-data"

export default function CasesPage() {
  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Cases / Applications"
        title="Cases organised around stage visibility, operational progress, and the next required action."
        description="Each case sits at the centre of the wider workflow: quotation, payment schedule, document readiness, and client-facing updates. This view keeps the current position clear without flattening everything into a generic pipeline."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmStatCard
          label="Preparation and structuring"
          value={`${cases.filter((item) => item.stage === "Due diligence preparation" || item.stage === "Document collection").length}`}
          note="Matters still being organised before the formal next step."
          trend="Internal focus"
        />
        <CrmStatCard
          label="Formal review"
          value={`${cases.filter((item) => item.stage === "Government review").length}`}
          note="Files already in an external or programme-facing review stage."
          trend="External progress"
        />
        <CrmStatCard
          label="Comparison and reassessment"
          value={`${cases.filter((item) => item.stage === "Jurisdiction comparison").length}`}
          note="Cases where the route is still being narrowed or recalibrated."
          trend="Strategy work"
        />
      </div>

      <CrmTableCard
        title="Case register"
        description="A structured register for current applications, residence files, and relocation matters."
        action={
          <CrmToolbar
            searchPlaceholder="Search routes, case references, or clients"
            actions={
              <>
                <Button variant="outline" className="rounded-full">
                  <Filter className="size-4" />
                  Filter
                </Button>
                <Button asChild className="rounded-full">
                  <Link href="/documents">
                    Review document queue
                    <ArrowRight className="size-4" />
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
              <TableHead>Case</TableHead>
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

      <div className="grid gap-5 xl:grid-cols-2">
        {cases.map((item) => {
          const checklist = getChecklistForCase(item.id)
          const payments = getPaymentsForClient(item.clientId)
          const openItems = checklist.filter((entry) => entry.status !== "Approved").length

          return (
            <CrmSectionCard
              key={item.id}
              title={item.route}
              description={`${item.client} · ${item.region} · next milestone ${item.nextMilestone}`}
            >
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-[18px] border border-border/70 bg-background px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Stage</p>
                  <div className="mt-2">
                    <CrmStatusBadge status={item.stage} />
                  </div>
                </div>
                <div className="rounded-[18px] border border-border/70 bg-background px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Payment stages</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{payments.length} linked stages</p>
                </div>
                <div className="rounded-[18px] border border-border/70 bg-background px-4 py-3 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Open checklist items</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{openItems}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Case progress</p>
                  <p className="text-sm text-muted-foreground">{item.progress}%</p>
                </div>
                <Progress value={item.progress} className="h-2.5" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <FolderClock className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Operational next step</p>
                      <p className="text-sm leading-6 text-muted-foreground">{item.applicationStatus}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[20px] border border-border/70 bg-background px-4 py-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ShieldCheck className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Case integrity</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Quotation, payment stages, and documents remain linked to the same case record.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CrmSectionCard>
          )
        })}
      </div>
    </div>
  )
}
