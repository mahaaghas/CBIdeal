"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Mail, PlusCircle, UserRoundPlus } from "lucide-react"
import type { CrmLeadRecord, LeadLifecycleStatus } from "@cbideal/config/lead-intake"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmStatusBadge } from "@cbideal/ui/components/crm-status-badge"
import { Button } from "@cbideal/ui/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@cbideal/ui/components/ui/select"
import { Textarea } from "@cbideal/ui/components/ui/textarea"
import { getAssignableManagers } from "@/lib/lead-intake"
import { useLeadDesk } from "@/lib/lead-desk-store"

const statusOptions: LeadLifecycleStatus[] = ["New", "Contacted", "Qualified", "Converted"]

export function LeadDetailPageClient({ lead }: { lead: CrmLeadRecord }) {
  const {
    enrichLead,
    assignLead,
    setLeadStatus,
    addLeadNote,
    convertLeadToInternalClient,
    createInternalCase,
  } = useLeadDesk()
  const [note, setNote] = useState("")
  const enrichedLead = enrichLead(lead)
  const assignableManagers = useMemo(() => getAssignableManagers(), [])
  const internalClientId = enrichedLead.linkedInternalClientId ?? null
  const internalCaseId = enrichedLead.linkedInternalCaseId ?? null

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Internal lead detail"
        title={enrichedLead.companyName ? `${enrichedLead.companyName} with ${enrichedLead.name}` : enrichedLead.name}
        description="Review the original website submission, assign ownership, and decide whether it should move into an internal client record or a more qualified follow-up. This desk is separate from the client-facing SaaS workspace."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/internal/templates?lead=${encodeURIComponent(enrichedLead.recordKey)}`}>
                <Mail className="size-4" />
                Use email template
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <a href={`mailto:${enrichedLead.email}`}>
                Quick email
              </a>
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
        <div className="space-y-5">
          <section className="section-card p-6 md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <span className="eyebrow">Submitted details</span>
                <h2 className="card-title">Original form data</h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  Source page: <span className="font-mono text-xs text-foreground">{enrichedLead.sourcePage}</span>
                </p>
                {enrichedLead.campaign ? (
                  <p className="text-sm leading-7 text-muted-foreground">
                    Campaign: <span className="font-medium text-foreground">{enrichedLead.campaign}</span>
                  </p>
                ) : null}
              </div>
              <CrmStatusBadge status={enrichedLead.status} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {enrichedLead.detailRows.map((row) => (
                <div key={row.label} className="app-subtle-card space-y-1 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{row.label}</p>
                  <p className="text-sm leading-7 text-foreground">{row.value}</p>
                </div>
              ))}
            </div>

            {enrichedLead.notes.length > 0 ? (
              <div className="mt-6 app-subtle-card-strong p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Notes</p>
                <div className="mt-3 space-y-3">
                  {enrichedLead.notes.map((item, index) => (
                    <p key={`${item}-${index}`} className="text-sm leading-7 text-foreground">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="section-card p-6 md:p-7">
            <span className="eyebrow">Contact record</span>
            <h2 className="mt-3 card-title">Submission context</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="app-subtle-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Email</p>
                <p className="mt-2 text-sm leading-7 text-foreground">{enrichedLead.email}</p>
              </div>
              <div className="app-subtle-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Phone</p>
                <p className="mt-2 text-sm leading-7 text-foreground">{enrichedLead.phone}</p>
              </div>
              <div className="app-subtle-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Submitted</p>
                <p className="mt-2 text-sm leading-7 text-foreground">{enrichedLead.submittedAt}</p>
              </div>
              <div className="app-subtle-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Lead type</p>
                <p className="mt-2 text-sm leading-7 text-foreground">{enrichedLead.type}</p>
              </div>
            </div>
          </section>

          <section className="section-card p-6 md:p-7">
            <span className="eyebrow">History</span>
            <h2 className="mt-3 card-title">Internal handling trail</h2>
            <div className="mt-5 space-y-3">
              {enrichedLead.history.length > 0 ? (
                enrichedLead.history
                  .slice()
                  .reverse()
                  .map((item) => (
                    <div key={item.id} className="app-subtle-card p-4">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{new Date(item.createdAt).toLocaleString("en-GB")}</p>
                    </div>
                  ))
              ) : (
                <div className="app-subtle-card p-4 text-sm leading-7 text-muted-foreground">
                  No internal actions have been recorded yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="section-card p-6 md:p-7">
            <span className="eyebrow">Handling</span>
            <h2 className="mt-3 card-title">Ownership and status</h2>
            <div className="mt-5 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Assigned account manager</label>
                <Select
                  value={enrichedLead.assignedManagerId ?? ""}
                  onValueChange={(value) => {
                    const selected = assignableManagers.find((manager) => manager.id === value)
                    if (selected) assignLead(enrichedLead.recordKey, selected.id, selected.name)
                  }}
                >
                  <SelectTrigger className="h-12 rounded-2xl">
                    <SelectValue placeholder="Assign a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name} · {manager.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Lead status</label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setLeadStatus(enrichedLead.recordKey, status)}
                      className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                        enrichedLead.status === status
                          ? "border-[color:var(--app-accent-strong)] bg-[color:var(--app-accent)]/16 text-foreground"
                          : "border-border/70 bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="justify-between rounded-full"
                  onClick={() => setLeadStatus(enrichedLead.recordKey, "Qualified")}
                >
                  Mark qualified
                  <CheckCircle2 className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="justify-between rounded-full"
                  onClick={() => convertLeadToInternalClient(enrichedLead)}
                >
                  {internalClientId ? `Internal client: ${internalClientId}` : "Convert to internal client record"}
                  <UserRoundPlus className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="justify-between rounded-full"
                  onClick={() => createInternalCase(enrichedLead)}
                >
                  {internalCaseId ? `Internal case: ${internalCaseId}` : "Create internal case"}
                  <PlusCircle className="size-4" />
                </Button>
              </div>
            </div>
          </section>

          <section className="section-card p-6 md:p-7">
            <span className="eyebrow">Internal notes</span>
            <h2 className="mt-3 card-title">Team comments</h2>
            <div className="mt-5 space-y-4">
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="min-h-28 rounded-3xl"
                placeholder="Add a concise internal note for the team handling this lead."
              />
              <Button
                type="button"
                className="rounded-full"
                onClick={() => {
                  const trimmed = note.trim()
                  if (!trimmed) return
                  addLeadNote(enrichedLead.recordKey, trimmed)
                  setNote("")
                }}
              >
                Save internal note
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
