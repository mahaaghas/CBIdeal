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
import { DataImportWorkflow } from "@/components/data-import-workflow"
import { QuotationWorkflow } from "@/components/quotation-workflow"
import { useBranding } from "@/lib/branding-store"
import { exportQuotationRegister } from "@/lib/quotation-export"
import { useWorkflow } from "@/lib/workflow-store"

function formatMoney(currency: string, value: number) {
  return `${currency} ${value.toLocaleString()}`
}

function buildQuotationFocusSummary({
  route,
  advisorName,
  validUntil,
}: {
  route?: string | null
  advisorName?: string | null
  validUntil?: string | null
}) {
  return [route, advisorName ? `Advisor: ${advisorName}` : null, validUntil ? `Valid until ${validUntil}` : null]
    .filter(Boolean)
    .join(" · ")
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
    <div className="app-page-stack">
      <CrmPageHeader
        eyebrow="Quotations"
        title="Quotations built around client context, fee clarity, and operational readiness."
        description="The quotation workspace now supports a real creation flow, a live fee builder, and a branded export register. Internal teams can move from client selection to a ready-to-review quotation without leaving the module."
        actions={
          <>
            <DataImportWorkflow
              source="Workspace"
              defaultType="quotations"
              triggerLabel="Import quotations"
              title="Import quotations"
              description="Upload existing quotation data, map it to the platform fields, and bring it into the live commercial register."
            />
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(23rem,0.92fr)]">
        <CrmTableCard
          title="Quotation register"
          description="A live register across draft, issued, accepted, and paid quotations, with filters and direct workflow entry points that now behave like real product actions."
          className="app-surface"
          headerClassName="gap-6 border-b border-white/8 pb-6 xl:grid xl:grid-cols-[minmax(18rem,0.9fr)_minmax(28rem,1.45fr)] xl:items-start xl:gap-8"
          introClassName="max-w-[34rem]"
          actionClassName="w-full xl:justify-end"
          action={
            <div className="flex w-full flex-col gap-4 xl:max-w-[46rem] xl:items-end">
              <div className="flex w-full flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-center">
                <div className="relative w-full min-w-0 xl:min-w-[18rem] xl:flex-[1.25]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="app-search h-12 w-full rounded-full px-11 text-sm outline-none"
                    placeholder="Search quotation ID, client, route, or advisor"
                  />
                </div>
                <div className="flex flex-wrap gap-2 xl:flex-1">
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
            </div>
          }
        >
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
                        <p className="app-type-caption text-sm leading-6">{quotation.title ?? quotation.note}</p>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[15rem]">
                      <div className="space-y-2">
                        <p className="font-semibold leading-6 text-[var(--text-primary)]">{quotation.client}</p>
                        <p className="app-type-caption text-sm leading-6">{caseRecord?.route ?? quotation.note}</p>
                        <p className="text-sm leading-6 text-[var(--text-muted)]">{quotation.advisorName ?? quotation.owner}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <CrmStatusBadge status={quotation.status} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold text-white">{formatMoney(quotation.currency, quotation.total ?? 0)}</p>
                        <p className="app-copy-secondary leading-6">
                          Subtotal {formatMoney(quotation.currency, quotation.subtotal ?? 0)}
                        </p>
                        <p className="app-copy-muted leading-6">
                          VAT {quotation.vatApplied ? `${quotation.vatPercentage}%` : "not applied"} / Discount {formatMoney(quotation.currency, quotation.discountAmount ?? 0)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium leading-6 text-[var(--text-primary)]">{quotation.validUntil}</p>
                        <p className="app-copy-muted leading-6">
                          {quotation.sentDate ? `Sent ${quotation.sentDate}` : "Not yet sent"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle text-right">
                      <Button asChild variant="outline" size="sm" className="app-button-secondary min-w-[7.5rem] rounded-full">
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
          headerClassName="max-w-[23rem] space-y-3 border-b border-white/8 pb-5"
          titleClassName="text-[1.7rem] leading-[1.12] md:text-[1.85rem]"
          descriptionClassName="max-w-[21rem] text-sm leading-7 text-slate-300"
          bodyClassName="space-y-5"
        >
          <div className="space-y-5">
            {quotations.slice(0, 3).map((quotation) => {
              const caseRecord = getCaseByClientId(quotation.clientId)
              const summary = buildQuotationFocusSummary({
                route: caseRecord?.route,
                advisorName: quotation.advisorName ?? quotation.owner,
                validUntil: quotation.validUntil,
              })

              return (
                <div
                  key={quotation.id}
                  className="app-subtle-card-strong rounded-[24px] px-6 py-6 xl:px-7 xl:py-7"
                >
                  <div className="flex h-full flex-col gap-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 space-y-2.5">
                        <p className="text-[1rem] font-semibold leading-7 text-white">{quotation.client}</p>
                        {summary ? (
                          <p className="app-type-caption max-w-[20rem] text-sm leading-6">{summary}</p>
                        ) : null}
                      </div>
                      <CrmStatusBadge status={quotation.status} className="shrink-0 self-start lg:mt-0.5" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="app-note-panel min-w-0">
                        <p className="app-type-overline">Quote number</p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-white">{quotation.id.toUpperCase()}</p>
                      </div>
                      <div className="app-note-panel min-w-0">
                        <p className="app-type-overline">Currency</p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-white">{quotation.currency}</p>
                      </div>
                      <div className="app-note-panel min-w-0">
                        <p className="app-type-overline">Total amount</p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-white">
                          {formatMoney(quotation.currency, quotation.total ?? 0)}
                        </p>
                      </div>
                    </div>

                    {quotation.status !== "Paid" ? (
                      <div className="border-t border-white/8 pt-4">
                        <CommunicationComposer
                          clientId={quotation.clientId}
                          caseId={quotation.caseId}
                          quotationId={quotation.id}
                          defaultCategory="Quotation follow-up"
                          triggerLabel="Send quotation follow-up"
                          className="app-button-secondary w-full justify-center rounded-full"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
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
            <div key={quotation.id} className="app-subtle-card rounded-[24px] px-6 py-6">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="app-type-overline">{quotation.id.toUpperCase()}</p>
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-white">{quotation.client}</h3>
                    <p className="app-type-caption text-sm">{quotation.notes ?? quotation.note}</p>
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
                    <div key={group.title} className="app-note-panel">
                      <p className="app-type-overline">{group.title}</p>
                      <div className="mt-3 space-y-2">
                        {group.items.map((item) => (
                            <div key={`${group.title}-${item.label}`} className="space-y-1 text-sm">
                              <div className="flex items-start justify-between gap-3">
                                <span className="leading-6 text-[var(--text-secondary)]">{item.label}</span>
                              <span className="shrink-0 font-medium text-white">
                                {item.amount ? formatMoney(quotation.currency, item.amount * (item.quantity ?? 1)) : "Included"}
                              </span>
                            </div>
                            {(item.quantity ?? 1) > 1 ? (
                              <p className="app-copy-muted">{item.quantity} units</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="app-note-panel">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">VAT and discount</p>
                    <p className="app-type-caption mt-2 text-sm">
                      VAT {quotation.vatApplied ? `${quotation.vatPercentage}% applied` : "not applied"} / Discount {formatMoney(quotation.currency, quotation.discountAmount ?? 0)}
                    </p>
                    {quotation.discountReason ? (
                      <p className="app-copy-muted mt-1 text-sm leading-6">{quotation.discountReason}</p>
                    ) : null}
                  </div>
                  <div className="app-note-panel">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">Final total</p>
                    <p className="mt-2 font-serif text-[2rem] leading-none tracking-[-0.04em] text-white">
                      {formatMoney(quotation.currency, quotation.total ?? 0)}
                    </p>
                    <p className="app-copy-muted mt-2 text-sm leading-6">
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
