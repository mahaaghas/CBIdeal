"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, FolderClock, Search, ShieldCheck } from "lucide-react"
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
import { DataImportWorkflow } from "@/components/data-import-workflow"
import { useWorkflow } from "@/lib/workflow-store"

export default function CasesPage() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"All" | "Active" | "Review" | "Strategy">("All")
  const { state, getChecklistForCase, getPaymentsForClient } = useWorkflow()
  const cases = state.cases

  const visibleCases = useMemo(() => {
    return cases.filter((item) => {
      const matchesQuery = [item.route, item.client, item.stage, item.region]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())

      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Active"
            ? item.progress < 100
            : filter === "Review"
              ? item.stage === "Government review"
              : item.stage === "Jurisdiction comparison" || item.stage === "Jurisdiction reassessment"

      return matchesQuery && matchesFilter
    })
  }, [filter, query])

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
          value={`${cases.filter((item) => item.stage === "Jurisdiction comparison" || item.stage === "Jurisdiction reassessment").length}`}
          note="Cases where the route is still being narrowed or recalibrated."
          trend="Strategy work"
        />
      </div>

      <CrmTableCard
        title="Case register"
        description="A structured register for current applications, residence files, and relocation matters."
        className="app-surface"
        headerClassName="gap-6 border-b border-white/8 pb-6 xl:grid xl:grid-cols-[minmax(18rem,0.95fr)_minmax(32rem,1.65fr)] xl:items-start xl:gap-8"
        introClassName="max-w-[30rem] xl:max-w-[34rem]"
        actionClassName="w-full xl:justify-end"
        action={
          <div className="flex w-full flex-col gap-4 xl:max-w-[52rem] xl:items-end">
            <div className="flex w-full flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-center xl:justify-end">
              <div className="relative w-full min-w-0 xl:w-[21rem] xl:flex-none">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="app-search h-12 w-full rounded-full px-11 text-sm outline-none"
                  placeholder="Search route, client, stage, or region"
                />
              </div>
              <div className="flex flex-wrap gap-2 xl:flex-1 xl:justify-start">
                {(["All", "Active", "Review", "Strategy"] as const).map((option) => (
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
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
              <Button asChild className="rounded-full">
                <Link href="/documents">
                  Review document queue
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <DataImportWorkflow
                source="Workspace"
                defaultType="cases"
                triggerLabel="Import cases"
                title="Import cases and applications"
                description="Upload existing cases, map the incoming columns, and confirm the records that should become live case files in this workspace."
              />
            </div>
          </div>
        }
      >
        <Table className="app-grid-table">
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
            {visibleCases.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-white">{row.route}</TableCell>
                <TableCell className="text-slate-300">{row.client}</TableCell>
                <TableCell>
                  <CrmStatusBadge status={row.stage} />
                </TableCell>
                <TableCell className="text-slate-300">{row.nextMilestone}</TableCell>
                <TableCell className="min-w-40">
                  <div className="space-y-2">
                    <Progress value={row.progress} className="h-2.5" />
                    <p className="text-xs text-slate-400">{row.progress}% complete</p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CrmTableCard>

      <div className="grid gap-5 xl:grid-cols-2">
        {visibleCases.map((item) => {
          const checklist = getChecklistForCase(item.id)
          const payments = getPaymentsForClient(item.clientId)
          const openItems = checklist.filter((entry) => entry.status !== "Approved").length

          return (
            <CrmSectionCard
              key={item.id}
              title={item.route}
              description={`${item.client} · ${item.region} · next milestone ${item.nextMilestone}`}
              className="app-surface"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <div className="app-subtle-card rounded-[18px] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Stage</p>
                  <div className="mt-2">
                    <CrmStatusBadge status={item.stage} />
                  </div>
                </div>
                <div className="app-subtle-card rounded-[18px] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Payment stages</p>
                  <p className="mt-2 text-sm font-medium text-white">{payments.length} linked stages</p>
                </div>
                <div className="app-subtle-card rounded-[18px] px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Open checklist items</p>
                  <p className="mt-2 text-sm font-medium text-white">{openItems}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">Case progress</p>
                  <p className="text-sm text-slate-300">{item.progress}%</p>
                </div>
                <Progress value={item.progress} className="h-2.5" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="app-subtle-card rounded-[20px] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-[var(--app-brand-surface-tint-strong)] text-white">
                      <FolderClock className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">Operational next step</p>
                      <p className="text-sm leading-6 text-slate-300">{item.applicationStatus}</p>
                    </div>
                  </div>
                </div>
                <div className="app-subtle-card rounded-[20px] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-[var(--app-brand-surface-tint-strong)] text-white">
                      <ShieldCheck className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">Case integrity</p>
                      <p className="text-sm leading-6 text-slate-300">
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
