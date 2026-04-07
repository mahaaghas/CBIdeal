"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Search, ShieldCheck, Users, Wallet } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { CrmTableCard } from "@cbideal/ui/components/crm-table-card"
import { Button } from "@cbideal/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@cbideal/ui/components/ui/dialog"
import { Input } from "@cbideal/ui/components/ui/input"
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

function getToneClass(status: string) {
  if (status.includes("Awaiting") || status.includes("Rejected")) {
    return "border-[#9f7a33]/36 bg-[#9f7a33]/16 text-[#f5e7c2]"
  }

  if (status.includes("Formal") || status.includes("Approved")) {
    return "border-[#4a8d5d]/32 bg-[#4a8d5d]/18 text-[#dff6e5]"
  }

  return "border-white/10 bg-white/[0.07] text-white"
}

export function ClientsPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"All" | "Needs attention" | "On track">("All")
  const [newClientForm, setNewClientForm] = useState({
    name: "",
    type: "Private client",
    context: "",
    region: "",
    investmentRange: "",
    jurisdictionFocus: "",
    ownerId: "usr-maha",
  })
  const { state, getAllClients, getCaseByClientId, getClientDetail, createClient } = useWorkflow()

  const createOpen = searchParams.get("create") === "new"
  const returnTo = searchParams.get("returnTo")
  const allClients = getAllClients()

  const rows = useMemo(
    () =>
      allClients.map((client) => {
        const caseRecord = getCaseByClientId(client.id)
        const detail = getClientDetail(client.id)
        const stage = caseRecord?.applicationStatus ?? client.context
        const needsAttention = stage.includes("Awaiting") || stage.includes("Rejected")

        return {
          clientId: client.id,
          name: client.name,
          email: detail?.contact ?? client.owner,
          region: client.region,
          profileType: detail?.profileType ?? client.type,
          route: caseRecord?.route ?? client.context,
          stage,
          nextMilestone: caseRecord?.nextMilestone ?? "Active file",
          needsAttention,
        }
      }),
    [allClients, getCaseByClientId, getClientDetail],
  )

  const visibleRows = rows.filter((row) => {
    const matchesSearch = [row.name, row.email, row.region, row.route, row.stage, row.profileType]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesFilter =
      filter === "All" ? true : filter === "Needs attention" ? row.needsAttention : !row.needsAttention

    return matchesSearch && matchesFilter
  })

  const totalRevenue = state.payments
    .filter((payment) => payment.status === "Paid" || payment.status === "Approved")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const attentionRows = rows.filter((row) => row.needsAttention).slice(0, 3)

  const closeCreateDialog = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("create")
    params.delete("returnTo")
    const query = params.toString()
    router.push(query ? `/clients?${query}` : "/clients")
  }

  const handleCreateClient = () => {
    if (!newClientForm.name.trim() || !newClientForm.context.trim()) return

    const clientId = createClient(newClientForm)

    setNewClientForm({
      name: "",
      type: "Private client",
      context: "",
      region: "",
      investmentRange: "",
      jurisdictionFocus: "",
      ownerId: "usr-maha",
    })

    if (returnTo) {
      router.push(`${returnTo}?client=${clientId}`)
      return
    }

    router.push(`/clients/${clientId}`)
  }

  return (
    <>
      <div className="app-page-stack">
        <CrmPageHeader
          eyebrow="Clients"
          title="Client records kept aligned with case stage, commercial progress, and portal readiness."
          description="This register is meant to be operational rather than decorative: each client stays linked to the current route, next milestone, and whether anything needs immediate follow-up."
          actions={
            <>
              <Button asChild variant="outline" className="app-button-secondary rounded-full">
                <Link href="/clients?create=new">Create client</Link>
              </Button>
              <DataImportWorkflow
                source="Workspace"
                defaultType="clients"
                triggerLabel="Import clients"
                title="Import client records"
                description="Bring existing clients into the workspace, map the uploaded columns, review the preview, and confirm the records that should be created."
              />
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <CrmStatCard
            label="Total clients"
            value={`${rows.length}`}
            note="Live client records currently present in the workspace."
            trend="Active relationships"
          />
          <CrmStatCard
            label="Needs attention"
            value={`${rows.filter((row) => row.needsAttention).length}`}
            note="Clients with a current stage that suggests follow-up, re-upload, or review pressure."
            trend="Priority watch"
          />
          <CrmStatCard
            label="Collected revenue"
            value={`EUR ${Math.round(totalRevenue / 1000)}k`}
            note="Paid and approved payment stages linked to the current register."
            trend="Commercial view"
          />
        </div>

        <CrmTableCard
          title="Client register"
          description="A calmer register for active clients, their current route, and the exact status that matters right now."
          className="app-surface"
          action={
            <div className="flex w-full flex-col gap-3 xl:w-auto xl:flex-row xl:items-center">
              <div className="relative w-full min-w-0 xl:w-[24rem]">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="app-search h-12 w-full rounded-full px-11 text-sm outline-none"
                  placeholder="Search client, region, route, or status"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["All", "Needs attention", "On track"] as const).map((option) => (
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
          }
        >
          <Table className="app-grid-table">
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Current stage</TableHead>
                <TableHead>Next milestone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow key={row.clientId}>
                  <TableCell className="min-w-[16rem]">
                    <div className="space-y-1.5">
                      <p className="text-[0.98rem] font-semibold text-white">{row.name}</p>
                      <p className="text-sm leading-6 text-slate-400">{row.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">{row.profileType}</TableCell>
                  <TableCell className="text-slate-300">{row.region}</TableCell>
                  <TableCell className="min-w-[15rem] text-slate-300">{row.route}</TableCell>
                  <TableCell>
                    <CrmStatusBadge status={row.stage} className={getToneClass(row.stage)} />
                  </TableCell>
                  <TableCell className="text-slate-300">{row.nextMilestone}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm" className="app-button-secondary rounded-full">
                      <Link href={`/clients/${row.clientId}`}>Open record</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CrmTableCard>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <CrmSectionCard
            title="Priority follow-up"
            description="The clearest cases where the register suggests an immediate next action."
            className="app-surface"
          >
            <div className="space-y-3">
              {attentionRows.length > 0 ? (
                attentionRows.map((row) => (
                  <Link
                    key={row.clientId}
                    href={`/clients/${row.clientId}`}
                    className="app-note-panel app-interactive-row flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">{row.name}</p>
                      <p className="text-sm leading-6 text-slate-300">{row.stage}</p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-[var(--text-secondary)]" />
                  </Link>
                ))
              ) : (
                <div className="app-note-panel">
                  <p className="text-sm leading-7 text-slate-300">No client record is currently flagging an urgent follow-up need.</p>
                </div>
              )}
            </div>
          </CrmSectionCard>

          <CrmSectionCard
            title="Register notes"
            description="A more usable client register keeps the advisory workflow and the client-facing portal aligned."
            className="app-surface"
          >
            <div className="space-y-3">
              {[
                "Case stage, next milestone, and client record now sit in one readable register instead of a generic admin table.",
                "The route into each client detail page stays direct so documents, payments, and communications remain one click away.",
                "The visual language now matches the broader workspace surfaces instead of dropping into an older, narrower table style.",
              ].map((item) => (
                <div key={item} className="app-note-panel flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-white">
                    <ShieldCheck className="size-4" />
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </CrmSectionCard>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={(open) => !open && closeCreateDialog()}>
        <DialogContent className="app-surface max-w-2xl border-white/10 p-0 text-white">
          <DialogHeader className="border-b border-white/8 px-6 py-6 text-left">
            <DialogTitle className="font-serif text-[2rem] tracking-[-0.03em] text-white">New client</DialogTitle>
            <DialogDescription className="max-w-2xl text-sm leading-7 text-slate-300">
              Create a new client record with the right case context so quotation, document, and portal workflows start
              from the same source of truth.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200">Client or company name</label>
              <Input
                value={newClientForm.name}
                onChange={(event) => setNewClientForm((current) => ({ ...current, name: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Profile type</label>
              <Input
                value={newClientForm.type}
                onChange={(event) => setNewClientForm((current) => ({ ...current, type: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Region</label>
              <Input
                value={newClientForm.region}
                onChange={(event) => setNewClientForm((current) => ({ ...current, region: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200">Case context</label>
              <Input
                value={newClientForm.context}
                onChange={(event) => setNewClientForm((current) => ({ ...current, context: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Investment range</label>
              <Input
                value={newClientForm.investmentRange}
                onChange={(event) => setNewClientForm((current) => ({ ...current, investmentRange: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Jurisdiction focus</label>
              <Input
                value={newClientForm.jurisdictionFocus}
                onChange={(event) => setNewClientForm((current) => ({ ...current, jurisdictionFocus: event.target.value }))}
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-white/8 px-6 py-5">
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
              onClick={closeCreateDialog}
            >
              Cancel
            </Button>
            <Button type="button" className="rounded-full" onClick={handleCreateClient}>
              Create client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
