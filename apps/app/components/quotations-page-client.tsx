"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Download, ReceiptText, Search } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { CrmTableCard } from "@cbideal/ui/components/crm-table-card"
import { Button } from "@cbideal/ui/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cbideal/ui/components/ui/table"
import { CommunicationComposer } from "@/components/communication-composer"
import { QuotationWorkflow } from "@/components/quotation-workflow"
import { useBranding } from "@/lib/branding-store"
import { exportQuotationRegister } from "@/lib/quotation-export"
import { useWorkflow } from "@/lib/workflow-store"

function formatMoney(currency: string, value: number) {
  return `${currency} ${value.toLocaleString()}`
}

export function QuotationsPageClient({ initialClientId }: { initialClientId?: string | null }) {
  const { branding } = useBranding()
  const { state, getAllClients, getCaseByClientId } = useWorkflow()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [isExporting, setIsExporting] = useState(false)

  const quotations = state.quotations
  const totals = {
    draft: quotations.filter((item) => item.status === "Draft").length,
    sent: quotations.filter((item) => item.status === "Sent").length,
    accepted: quotations.filter((item) => item.status === "Accepted" || item.status === "Partially Paid" || item.status === "Paid").length,
  }

  const visibleQuotations = useMemo(() => {
    return quotations.filter((quotation) => {
      const matchesSearch = [
        quotation.id,
        quotation.client,
        quotation.note,
        quotation.advisorName,
        getCaseByClientId(quotation.clientId)?.route,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "All" || quotation.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [getCaseByClientId, quotations, searchTerm, statusFilter])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await exportQuotationRegister({
        branding,
        quotations,
        cases: state.cases,
        clients: getAllClients(),
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Quotations"
        title="Quotations built around client context, fee clarity, and operational readiness."
        description="The quotation workspace now supports a real creation flow, a live fee builder, and a branded export register. Internal teams can move from client selection to a ready-to-review quotation without leaving the module."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              className="app-button-secondary rounded-full"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="size-4" />
              {isExporting ? "Preparing export" : "Export register"}
            </Button>
            <QuotationWorkflow initialClientId={initialClientId} />
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmStatCard
          label="Draft quotations"
          value={`${totals.draft}`}
          note="Fee schedules still being refined before release."
          trend="Internal review"
        />
        <CrmStatCard
          label="Sent to clients"
          value={`${totals.sent}`}
          note="Quotations already shared through the structured client path."
          trend="Awaiting response"
        />
        <CrmStatCard
          label="Accepted or active"
          value={`${totals.accepted}`}
          note="Accepted quotations already linked to payment stages and live casework."
          trend="Financially active"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.16fr_0.84fr]">
        <CrmTableCard
          title="Quotation register"
          description="A live register across draft, issued, accepted, and paid quotations, with filters and direct workflow entry points that now behave like real product actions."
          className="app-surface"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="app-search h-12 w-full rounded-2xl px-11 text-base outline-none"
                placeholder="Search quotation ID, client, route, or advisor"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "Draft", "Sent", "Accepted", "Partially Paid", "Paid"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    statusFilter === status ? "app-filter-chip-active" : "app-filter-chip"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <Table className="app-grid-table">
            <TableHeader>
              <TableRow>
                <TableHead>Quotation</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Commercial structure</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleQuotations.map((quotation) => {
                const caseRecord = getCaseByClientId(quotation.clientId)
                return (
                  <TableRow key={quotation.id}>
                    <TableCell className="min-w-[16rem]">
                    <div className="space-y-2">
                      <p className="text-[0.98rem] font-semibold text-white">{quotation.id.toUpperCase()}</p>
                      <p className="text-sm leading-6 text-slate-200">{quotation.title ?? quotation.note}</p>
                    </div>
                  </TableCell>
                    <TableCell className="min-w-[15rem]">
                      <div className="space-y-2">
                        <p className="font-semibold text-slate-100">{quotation.client}</p>
                        <p className="text-sm leading-6 text-slate-300">{caseRecord?.route ?? quotation.note}</p>
                        <p className="text-sm leading-6 text-slate-400">{quotation.advisorName ?? quotation.owner}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CrmStatusBadge status={quotation.status} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-white">{formatMoney(quotation.currency, quotation.total ?? 0)}</p>
                        <p className="text-slate-300">
                          Subtotal {formatMoney(quotation.currency, quotation.subtotal ?? 0)}
                        </p>
                        <p className="text-slate-400">
                          VAT {quotation.vatApplied ? `${quotation.vatPercentage}%` : "not applied"} / Discount {formatMoney(quotation.currency, quotation.discountAmount ?? 0)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-slate-100">{quotation.validUntil}</p>
                        <p className="text-slate-400">
                          {quotation.sentDate ? `Sent ${quotation.sentDate}` : "Not yet sent"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm" className="app-button-secondary rounded-full">
                        <Link href={`/clients/${quotation.clientId}`}>Open record</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CrmTableCard>

        <CrmSectionCard
          title="Current quotation focus"
          description="A quieter operational summary of quotations most likely to need movement or a client-facing follow-up."
          className="app-surface"
        >
          <div className="space-y-3">
            {quotations.slice(0, 3).map((quotation) => (
              <div key={quotation.id} className="app-subtle-card-strong rounded-[22px] px-5 py-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">{quotation.client}</p>
                      <p className="text-sm leading-6 text-slate-300">{quotation.title ?? quotation.note}</p>
                    </div>
                    <CrmStatusBadge status={quotation.status} />
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-300">{quotation.id.toUpperCase()}</span>
                    <span className="font-semibold text-white">{formatMoney(quotation.currency, quotation.total ?? 0)}</span>
                  </div>
                  {quotation.status !== "Paid" ? (
                    <CommunicationComposer
                      clientId={quotation.clientId}
                      caseId={quotation.caseId}
                      quotationId={quotation.id}
                      defaultCategory="Quotation follow-up"
                      triggerLabel="Send quotation follow-up"
                      className="w-full rounded-full"
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <CrmTableCard
        title="Quotation detail snapshot"
        description="Selected quotations stay easy to review, with clearer totals, VAT position, discount logic, and direct links back to the client file."
        className="app-surface"
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {visibleQuotations.slice(0, 4).map((quotation) => (
            <div key={quotation.id} className="app-subtle-card rounded-[24px] px-5 py-5">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{quotation.id.toUpperCase()}</p>
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-white">{quotation.client}</h3>
                    <p className="text-sm leading-6 text-slate-300">{quotation.notes ?? quotation.note}</p>
                  </div>
                  <CrmStatusBadge status={quotation.status} />
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    {
                      title: "Service fees",
                      items: quotation.serviceFees,
                    },
                    {
                      title: "Government fees",
                      items: quotation.governmentFees,
                    },
                    {
                      title: "Optional items",
                      items: quotation.optionalItems.length ? quotation.optionalItems : [{ label: "No optional items", amount: 0, quantity: 1 }],
                    },
                  ].map((group) => (
                    <div key={group.title} className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{group.title}</p>
                      <div className="mt-3 space-y-2">
                        {group.items.map((item) => (
                            <div key={`${group.title}-${item.label}`} className="space-y-1 text-sm">
                              <div className="flex items-start justify-between gap-3">
                                <span className="leading-6 text-slate-200">{item.label}</span>
                              <span className="shrink-0 font-medium text-white">
                                {item.amount ? formatMoney(quotation.currency, item.amount * (item.quantity ?? 1)) : "Included"}
                              </span>
                            </div>
                            {(item.quantity ?? 1) > 1 ? (
                              <p className="text-slate-400">{item.quantity} units</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <p className="text-sm font-medium text-slate-200">VAT and discount</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      VAT {quotation.vatApplied ? `${quotation.vatPercentage}% applied` : "not applied"} / Discount {formatMoney(quotation.currency, quotation.discountAmount ?? 0)}
                    </p>
                    {quotation.discountReason ? (
                      <p className="mt-1 text-sm leading-6 text-slate-400">{quotation.discountReason}</p>
                    ) : null}
                  </div>
                  <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <p className="text-sm font-medium text-slate-200">Final total</p>
                    <p className="mt-2 font-serif text-[2rem] leading-none tracking-[-0.04em] text-white">
                      {formatMoney(quotation.currency, quotation.total ?? 0)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Subtotal {formatMoney(quotation.currency, quotation.subtotal ?? 0)} / VAT {formatMoney(quotation.currency, quotation.vatAmount ?? 0)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button asChild variant="outline" className="app-button-secondary w-full rounded-full">
                    <Link href={`/clients/${quotation.clientId}`}>
                      View client record
                      <ReceiptText className="size-4" />
                    </Link>
                  </Button>
                  <CommunicationComposer
                    clientId={quotation.clientId}
                    caseId={quotation.caseId}
                    quotationId={quotation.id}
                    defaultCategory="Quotation follow-up"
                    triggerLabel="Send quotation follow-up"
                    className="w-full rounded-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CrmTableCard>
    </div>
  )
}
