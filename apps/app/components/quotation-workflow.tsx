"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Plus, Search, Trash2 } from "lucide-react"
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
import { Switch } from "@cbideal/ui/components/ui/switch"
import { Textarea } from "@cbideal/ui/components/ui/textarea"
import { cn } from "@cbideal/ui/lib/utils"
import { internalUsers } from "@/lib/mock-data"
import { useWorkflow } from "@/lib/workflow-store"

type BuilderLineItem = {
  id: string
  label: string
  quantity: number
  amount: number
}

type BuilderState = {
  title: string
  quotationDate: string
  advisorName: string
  currency: string
  serviceFees: BuilderLineItem[]
  governmentFees: BuilderLineItem[]
  optionalItems: BuilderLineItem[]
  discountAmount: number
  discountReason: string
  vatApplied: boolean
  vatPercentage: number
  notes: string
  terms: string
}

const defaultTerms =
  "This quotation is based on the current route, scope, and known programme requirements. Final implementation remains subject to document readiness, provider review, and any jurisdiction-specific updates."

function createLineItem(prefix: string): BuilderLineItem {
  return {
    id: `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    label: "",
    quantity: 1,
    amount: 0,
  }
}

function lineTotal(item: BuilderLineItem) {
  return item.quantity * item.amount
}

function formatCurrency(currency: string, value: number) {
  return `${currency} ${value.toLocaleString()}`
}

function toIsoDate(value?: string | null) {
  const parsed = value ? new Date(value.replace(",", "")) : new Date()
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }
  return parsed.toISOString().slice(0, 10)
}

function buildInitialState(options: {
  clientName: string
  advisorName: string
  caseRoute?: string
}): BuilderState {
  return {
    title: `${options.clientName} quotation`,
    quotationDate: new Date().toISOString().slice(0, 10),
    advisorName: options.advisorName,
    currency: "EUR",
    serviceFees: [createLineItem("service")],
    governmentFees: [createLineItem("government")],
    optionalItems: [createLineItem("optional")],
    discountAmount: 0,
    discountReason: "",
    vatApplied: false,
    vatPercentage: 21,
    notes: options.caseRoute
      ? `Prepared in relation to ${options.caseRoute.toLowerCase()}.`
      : "Prepared for structured review and client discussion.",
    terms: defaultTerms,
  }
}

function QuotationLineEditor({
  title,
  description,
  items,
  onChange,
}: {
  title: string
  description: string
  items: BuilderLineItem[]
  onChange: (items: BuilderLineItem[]) => void
}) {
  return (
    <div className="app-subtle-card rounded-[22px] px-5 py-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-sm leading-6 text-slate-300">{description}</p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1.3fr)_0.55fr_0.7fr_auto]">
                <Input
                  value={item.label}
                  onChange={(event) =>
                    onChange(
                      items.map((entry) =>
                        entry.id === item.id ? { ...entry, label: event.target.value } : entry,
                      ),
                    )
                  }
                  placeholder="Line item description"
                  className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-400"
                />
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    onChange(
                      items.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, quantity: Math.max(1, Number(event.target.value) || 1) }
                          : entry,
                      ),
                    )
                  }
                  placeholder="Qty"
                  className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-400"
                />
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.amount}
                  onChange={(event) =>
                    onChange(
                      items.map((entry) =>
                        entry.id === item.id
                          ? { ...entry, amount: Math.max(0, Number(event.target.value) || 0) }
                          : entry,
                      ),
                    )
                  }
                  placeholder="Amount"
                  className="border-white/10 bg-white/[0.04] text-white placeholder:text-slate-400"
                />
                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <p className="text-sm font-semibold text-white">{lineTotal(item).toLocaleString()}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full text-slate-200 hover:bg-white/[0.08] hover:text-white"
                    onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="app-button-secondary rounded-full"
          onClick={() => onChange([...items, createLineItem(title.toLowerCase().replace(/\s+/g, "-"))])}
        >
          <Plus className="size-4" />
          Add line item
        </Button>
      </div>
    </div>
  )
}

export function QuotationWorkflow({
  initialClientId,
  onCreated,
}: {
  initialClientId?: string | null
  onCreated?: (quotationId: string) => void
}) {
  const { getAllClients, getCaseByClientId, getClientDetail, createQuotation } = useWorkflow()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [builderOpen, setBuilderOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedClientId, setSelectedClientId] = useState<string | null>(initialClientId ?? null)
  const [builder, setBuilder] = useState<BuilderState | null>(null)

  const allClients = getAllClients()
  const selectedClient = selectedClientId ? allClients.find((client) => client.id === selectedClientId) : undefined
  const selectedDetail = selectedClientId ? getClientDetail(selectedClientId) : undefined
  const selectedCase = selectedClientId ? getCaseByClientId(selectedClientId) : undefined

  useEffect(() => {
    if (initialClientId) {
      const client = allClients.find((entry) => entry.id === initialClientId)
      if (client) {
        setSelectedClientId(initialClientId)
        setBuilder(
          buildInitialState({
            clientName: client.name,
            advisorName: selectedDetail?.owner ?? client.owner,
            caseRoute: selectedCase?.route,
          }),
        )
        setBuilderOpen(true)
      }
    }
  }, [allClients, initialClientId, selectedCase?.route, selectedDetail?.owner])

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return allClients
    return allClients.filter((client) =>
      [client.name, client.region, client.context, client.jurisdictionFocus, client.owner]
        .join(" ")
        .toLowerCase()
        .includes(term),
    )
  }, [allClients, search])

  const totals = useMemo(() => {
    if (!builder) {
      return { subtotal: 0, vatAmount: 0, total: 0 }
    }

    const subtotal = [...builder.serviceFees, ...builder.governmentFees, ...builder.optionalItems].reduce(
      (sum, item) => sum + lineTotal(item),
      0,
    )
    const discounted = Math.max(subtotal - builder.discountAmount, 0)
    const vatAmount = builder.vatApplied ? discounted * (builder.vatPercentage / 100) : 0
    return {
      subtotal,
      vatAmount,
      total: discounted + vatAmount,
    }
  }, [builder])

  const openBuilderForClient = (clientId: string) => {
    const client = allClients.find((entry) => entry.id === clientId)
    if (!client) return

    const detail = getClientDetail(clientId)
    const caseRecord = getCaseByClientId(clientId)
    setSelectedClientId(clientId)
    setBuilder(
      buildInitialState({
        clientName: client.name,
        advisorName: detail?.owner ?? client.owner,
        caseRoute: caseRecord?.route,
      }),
    )
    setPickerOpen(false)
    setBuilderOpen(true)
  }

  const saveQuotation = () => {
    if (!selectedClientId || !builder) return

    const quotationId = createQuotation({
      clientId: selectedClientId,
      title: builder.title,
      quotationDate: builder.quotationDate,
      advisorName: builder.advisorName,
      currency: builder.currency,
      serviceFees: builder.serviceFees.filter((item) => item.label.trim()),
      governmentFees: builder.governmentFees.filter((item) => item.label.trim()),
      optionalItems: builder.optionalItems.filter((item) => item.label.trim()),
      discountAmount: builder.discountAmount,
      discountReason: builder.discountReason.trim() || null,
      vatApplied: builder.vatApplied,
      vatPercentage: builder.vatPercentage,
      notes: builder.notes,
      terms: builder.terms,
    })

    setBuilderOpen(false)
    onCreated?.(quotationId)
  }

  return (
    <>
      <Button className="rounded-full" onClick={() => setPickerOpen(true)}>
        <Plus className="size-4" />
        Create quotation
      </Button>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="app-surface max-w-3xl border-white/10 p-0 text-white">
          <DialogHeader className="border-b border-white/8 px-6 py-6 text-left">
            <DialogTitle className="font-serif text-[2rem] tracking-[-0.03em] text-white">Select a client</DialogTitle>
            <DialogDescription className="max-w-2xl text-sm leading-7 text-slate-300">
              Choose an existing client to start a quotation, or move into the new client flow first if the record has not yet been opened.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-6 py-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search client, region, route, or account manager"
                className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="grid gap-3">
              <Link
                href="/clients?create=new&returnTo=/quotations"
                className="app-subtle-card-strong flex items-center justify-between rounded-[22px] px-5 py-5 transition-colors hover:bg-white/[0.08]"
              >
                <div className="space-y-1">
                  <p className="text-base font-semibold text-white">+ New client</p>
                  <p className="text-sm leading-6 text-slate-300">Open the client creation flow before preparing a new quotation.</p>
                </div>
                <Plus className="size-4 text-white" />
              </Link>

              {filteredClients.map((client) => {
                const detail = getClientDetail(client.id)
                const caseRecord = getCaseByClientId(client.id)
                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => openBuilderForClient(client.id)}
                    className={cn(
                      "app-subtle-card rounded-[22px] px-5 py-5 text-left transition-colors hover:bg-white/[0.07]",
                      selectedClientId === client.id && "border-[var(--app-brand-outline)] bg-white/[0.07]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-base font-semibold text-white">{client.name}</p>
                        <p className="text-sm leading-6 text-slate-300">{detail?.summary ?? client.summary}</p>
                        <p className="text-sm leading-6 text-slate-300">
                          {caseRecord?.route ?? client.context} / {client.owner}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
                        {client.type}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="app-surface max-h-[92vh] max-w-[1180px] overflow-y-auto border-white/10 p-0 text-white">
          <DialogHeader className="border-b border-white/8 px-6 py-6 text-left">
            <DialogTitle className="font-serif text-[2rem] tracking-[-0.03em] text-white">Quotation builder</DialogTitle>
            <DialogDescription className="max-w-3xl text-sm leading-7 text-slate-300">
              Build a quotation around the selected client, route, and fee structure. Totals update live as scope, discount, and VAT are adjusted.
            </DialogDescription>
          </DialogHeader>

          {selectedClient && builder ? (
            <div className="grid gap-6 px-6 py-6 xl:grid-cols-[1.08fr_0.92fr]">
              <div className="space-y-5">
                <div className="app-subtle-card-strong rounded-[22px] px-5 py-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Selected client</p>
                      <p className="text-base font-semibold text-white">{selectedClient.name}</p>
                      <p className="text-sm leading-6 text-slate-300">{selectedDetail?.summary ?? selectedClient.summary}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Case context</p>
                      <p className="text-sm font-medium text-slate-100">{selectedCase?.route ?? selectedClient.context}</p>
                      <p className="text-sm leading-6 text-slate-300">{selectedClient.region}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Quotation title</label>
                    <Input
                      value={builder.title}
                      onChange={(event) => setBuilder((current) => current ? { ...current, title: event.target.value } : current)}
                      className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
                    />
                  </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Quotation ID</label>
                    <div className="flex h-12 items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-300">
                      Assigned on save
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Quotation date</label>
                    <Input
                      type="date"
                      value={builder.quotationDate}
                      onChange={(event) => setBuilder((current) => current ? { ...current, quotationDate: event.target.value } : current)}
                      className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Advisor / account manager</label>
                    <select
                      value={builder.advisorName}
                      onChange={(event) => setBuilder((current) => current ? { ...current, advisorName: event.target.value } : current)}
                      className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
                    >
                      {internalUsers.map((user) => (
                        <option key={user.id} value={user.name} className="text-slate-950">
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <QuotationLineEditor
                  title="Service fees"
                  description="Advisory, coordination, structuring, and any internally managed work."
                  items={builder.serviceFees}
                  onChange={(items) => setBuilder((current) => current ? { ...current, serviceFees: items } : current)}
                />
                <QuotationLineEditor
                  title="Government fees"
                  description="Programme fees, diligence charges, filing costs, and jurisdiction-linked amounts."
                  items={builder.governmentFees}
                  onChange={(items) => setBuilder((current) => current ? { ...current, governmentFees: items } : current)}
                />
                <QuotationLineEditor
                  title="Optional items"
                  description="Add-ons and optional workstreams that should remain clearly separate from the core scope."
                  items={builder.optionalItems}
                  onChange={(items) => setBuilder((current) => current ? { ...current, optionalItems: items } : current)}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="app-subtle-card rounded-[22px] px-5 py-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">Discount</p>
                          <p className="text-sm leading-6 text-slate-300">Apply a specific reduction and keep the reason visible.</p>
                        </div>
                      </div>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={builder.discountAmount}
                        onChange={(event) =>
                          setBuilder((current) =>
                            current ? { ...current, discountAmount: Math.max(0, Number(event.target.value) || 0) } : current,
                          )
                        }
                        className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white"
                      />
                      <Textarea
                        value={builder.discountReason}
                        onChange={(event) => setBuilder((current) => current ? { ...current, discountReason: event.target.value } : current)}
                        placeholder="Explain the reason for the discount, if one is applied."
                        className="min-h-24 rounded-2xl border-white/10 bg-white/[0.04] text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="app-subtle-card rounded-[22px] px-5 py-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">VAT</p>
                          <p className="text-sm leading-6 text-slate-300">Add or remove VAT and keep the impact visible in the total.</p>
                        </div>
                        <Switch
                          checked={builder.vatApplied}
                          onCheckedChange={(checked) => setBuilder((current) => current ? { ...current, vatApplied: checked } : current)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">VAT percentage</label>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={builder.vatPercentage}
                          disabled={!builder.vatApplied}
                          onChange={(event) =>
                            setBuilder((current) =>
                              current ? { ...current, vatPercentage: Math.max(0, Number(event.target.value) || 0) } : current,
                            )
                          }
                          className="h-12 rounded-2xl border-white/10 bg-white/[0.04] text-white disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Notes</label>
                    <Textarea
                      value={builder.notes}
                      onChange={(event) => setBuilder((current) => current ? { ...current, notes: event.target.value } : current)}
                      className="min-h-28 rounded-2xl border-white/10 bg-white/[0.04] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Terms</label>
                    <Textarea
                      value={builder.terms}
                      onChange={(event) => setBuilder((current) => current ? { ...current, terms: event.target.value } : current)}
                      className="min-h-28 rounded-2xl border-white/10 bg-white/[0.04] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="app-subtle-card-strong rounded-[24px] px-5 py-5">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Live totals</p>
                      <h3 className="font-serif text-[2rem] tracking-[-0.03em] text-white">Quotation summary</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-slate-300">Subtotal</span>
                        <span className="font-semibold text-white">{formatCurrency(builder.currency, totals.subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-slate-300">Discount</span>
                        <span className="font-semibold text-white">{formatCurrency(builder.currency, builder.discountAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-slate-300">VAT {builder.vatApplied ? `(${builder.vatPercentage}%)` : "(not applied)"}</span>
                        <span className="font-semibold text-white">{formatCurrency(builder.currency, totals.vatAmount)}</span>
                      </div>
                    </div>

                    <div className="h-px bg-white/8" />

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-base font-semibold text-white">Final total</span>
                      <span className="font-serif text-[2.2rem] leading-none tracking-[-0.04em] text-white">
                        {formatCurrency(builder.currency, totals.total)}
                      </span>
                    </div>

                    <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-4">
                      <p className="text-sm font-semibold text-white">How VAT and discount work</p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        The discount is taken off the subtotal first. If VAT is enabled, the VAT percentage is then applied to the discounted amount so the final total is explicit and easy to justify.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="app-subtle-card rounded-[24px] px-5 py-5">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-white">Selected file</p>
                    <p className="text-sm leading-6 text-slate-300">{selectedClient.name}</p>
                    <p className="text-sm leading-6 text-slate-400">{selectedCase?.route ?? selectedClient.context}</p>
                    <p className="text-sm leading-6 text-slate-400">{selectedDetail?.region ?? selectedClient.region}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="border-t border-white/8 px-6 py-5 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
              onClick={() => {
                setBuilderOpen(false)
                setPickerOpen(true)
              }}
            >
              Change client
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
                onClick={() => setBuilderOpen(false)}
              >
                Close
              </Button>
              <Button type="button" className="rounded-full" onClick={saveQuotation}>
                Save quotation draft
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
