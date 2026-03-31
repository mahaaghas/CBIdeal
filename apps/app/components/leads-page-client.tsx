"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Mail, Search } from "lucide-react"
import type { CrmLeadRecord } from "@cbideal/config/lead-intake"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { CrmTableCard } from "@cbideal/ui/components/crm-table-card"
import { Button } from "@cbideal/ui/components/ui/button"
import { Input } from "@cbideal/ui/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cbideal/ui/components/ui/table"
import { cn } from "@cbideal/ui/lib/utils"
import { useLeadDesk } from "@/lib/lead-desk-store"

type FilterKey = "All" | "B2C" | "B2B" | "New" | "Contacted" | "Qualified" | "Converted"

const filters: FilterKey[] = ["All", "B2C", "B2B", "New", "Contacted", "Qualified", "Converted"]

function matchesFilter(lead: CrmLeadRecord, filter: FilterKey) {
  if (filter === "All") return true
  if (filter === "B2C" || filter === "B2B") return lead.type === filter
  return lead.status === filter
}

export function LeadsPageClient({ initialLeads }: { initialLeads: CrmLeadRecord[] }) {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All")
  const { enrichLead } = useLeadDesk()

  const leads = useMemo(() => initialLeads.map((lead) => enrichLead(lead)), [enrichLead, initialLeads])

  const filteredLeads = useMemo(() => {
    const lowered = query.trim().toLowerCase()

    return leads.filter((lead) => {
      if (!matchesFilter(lead, activeFilter)) return false
      if (!lowered) return true

      return [
        lead.name,
        lead.companyName ?? "",
        lead.interest,
        lead.country,
        lead.sourcePage,
        lead.assignedManagerName ?? "",
      ].some((value) => value.toLowerCase().includes(lowered))
    })
  }, [activeFilter, leads, query])

  const statCards = [
    {
      label: "Total submissions",
      value: String(leads.length),
      note: "All current website enquiries across investor and professional routes.",
      trend: `${leads.filter((lead) => lead.type === "B2C").length} investor enquiries`,
    },
    {
      label: "New",
      value: String(leads.filter((lead) => lead.status === "New").length),
      note: "Fresh submissions waiting for an initial read.",
      trend: `${leads.filter((lead) => lead.type === "B2B").length} professional enquiries`,
    },
    {
      label: "Qualified",
      value: String(leads.filter((lead) => lead.status === "Qualified").length),
      note: "Submissions already moved into a stronger follow-up path.",
      trend: `${leads.filter((lead) => lead.status === "Converted").length} converted`,
    },
  ]

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Internal lead desk"
        title="A central intake view for website investor and partner enquiries."
        description="This back-office register is reserved for CBI Deal's own lead handling. Every public website form arrives here with its source page, submitted context, campaign metadata when available, and internal handling status."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <CrmStatCard key={card.label} label={card.label} value={card.value} note={card.note} trend={card.trend} />
        ))}
      </div>

      <CrmTableCard
        title="Website submissions"
        description="A single register for the B2C and B2B website forms, designed for assignment, qualification, and early-stage review."
        className="app-surface"
        action={
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
            <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 shadow-sm">
              <Search className="size-4 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search lead inbox"
                placeholder="Search names, companies, countries, or source pages"
                className="h-auto border-0 bg-transparent px-0 py-0 text-sm text-white shadow-none placeholder:text-slate-400 focus-visible:ring-0"
              />
            </div>
          </div>
        }
      >
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const count = leads.filter((lead) => matchesFilter(lead, filter)).length
            const active = activeFilter === filter

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "app-filter-chip-active"
                    : "app-filter-chip",
                )}
              >
                {filter} <span className="ml-1 text-xs text-slate-400">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="overflow-hidden rounded-[26px] border border-white/8 bg-[#263248]">
          <Table className="app-grid-table">
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name / company</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Source page</TableHead>
                <TableHead>Assigned manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.recordKey}>
                  <TableCell>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                      {lead.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-white">{lead.name}</p>
                      {lead.companyName ? <p className="text-sm text-slate-300">{lead.companyName}</p> : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-100">{lead.interest}</TableCell>
                  <TableCell className="text-slate-300">{lead.country}</TableCell>
                  <TableCell className="text-slate-300">{lead.submittedAt}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-slate-400">{lead.sourcePage}</span>
                  </TableCell>
                  <TableCell className="text-slate-300">{lead.assignedManagerName ?? "Unassigned"}</TableCell>
                  <TableCell>
                    <CrmStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm" className="app-button-secondary rounded-full">
                        <a href={`mailto:${lead.email}`}>
                          <Mail className="size-4" />
                          Email
                        </a>
                      </Button>
                      <Button asChild size="sm" className="rounded-full">
                        <Link href={`/internal/leads/${encodeURIComponent(lead.recordKey)}`}>
                          Open
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CrmTableCard>
    </div>
  )
}
