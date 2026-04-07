import Link from "next/link"
import { AlertTriangle, ArrowRight, CheckCircle2, MailCheck, Route, ShieldCheck } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
import { CrmTableCard } from "@cbideal/ui/components/crm-table-card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cbideal/ui/components/ui/table"
import { getConsultationIntegrityDashboardData } from "@/lib/consultation-integrity"

export const dynamic = "force-dynamic"

function statusClass(ok: boolean) {
  return ok
    ? "border-emerald-500/30 bg-emerald-500/12 text-emerald-100"
    : "border-amber-500/30 bg-amber-500/12 text-amber-100"
}

function compactStatusClass(value: "good" | "warning" | "neutral") {
  if (value === "good") return "border-emerald-500/30 bg-emerald-500/12 text-emerald-100"
  if (value === "warning") return "border-amber-500/30 bg-amber-500/12 text-amber-100"
  return "border-white/10 bg-white/[0.04] text-slate-200"
}

export default async function FunnelHealthPage() {
  const dashboard = await getConsultationIntegrityDashboardData()

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Lead integrity dashboard"
        title="A clearer source of truth for real consultation submissions."
        description="This view is designed to answer one practical question without forcing anyone into Google Ads first: did a real consultation request get recorded, emailed, and reach the true success state?"
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/internal/leads"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/20"
            >
              Open website lead desk
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={`${dashboard.siteUrl}/book-a-cbi-consultation`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/20"
            >
              Open live consultation page
              <ArrowRight className="size-4" />
            </a>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <CrmStatCard
          label="Recorded submissions"
          value={String(dashboard.metrics.total)}
          note="Consultation requests stored in the internal source-of-truth table."
          trend={`${dashboard.metrics.emailSent} with confirmed email delivery`}
          icon={<ShieldCheck className="size-5" />}
        />
        <CrmStatCard
          label="Thank-you confirmed"
          value={String(dashboard.metrics.thankYouConfirmed)}
          note="Submissions that actually reached the success page after backend confirmation."
          trend={`${dashboard.metrics.conversionTriggered} with client-side success event attempted`}
          icon={<CheckCircle2 className="size-5" />}
        />
        <CrmStatCard
          label="Lead desk synced"
          value={String(dashboard.metrics.crmSynced)}
          note="Consultation requests also pushed into the internal lead inbox."
          trend={`${Math.max(dashboard.metrics.total - dashboard.metrics.crmSynced, 0)} still missing sync`}
          icon={<MailCheck className="size-5" />}
        />
        <CrmStatCard
          label="Warnings"
          value={String(dashboard.warnings.length)}
          note="Operational issues or unresolved states that need attention."
          trend={dashboard.warnings.length ? "Review the warnings below" : "No obvious warnings right now"}
          icon={<AlertTriangle className="size-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="section-card p-6 md:p-7">
          <span className="eyebrow">Trust definition</span>
          <h2 className="mt-3 card-title">What now counts as a trustworthy consultation lead</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              "The form validates and submits to the real backend endpoint.",
              "A submission is only treated as delivered after server-side email send succeeds.",
              "The thank-you state is only unlocked after true backend success.",
              "The dashboard shows whether the client reached the success state and whether the lead inbox sync worked.",
            ].map((item) => (
              <div key={item} className="app-subtle-card p-4">
                <p className="text-sm leading-7 text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-card p-6 md:p-7">
          <span className="eyebrow">Route health</span>
          <h2 className="mt-3 card-title">Core route and config checks</h2>
          <div className="mt-5 space-y-3">
            {dashboard.routeChecks.map((check) => (
              <div key={check.label} className="app-subtle-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{check.label}</p>
                    <p className="font-mono text-xs text-muted-foreground">{check.path}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{check.message}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusClass(check.ok)}`}>
                    {check.ok ? "Healthy" : `Check${check.statusCode ? ` ${check.statusCode}` : ""}`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 border-t border-border/70 pt-5">
            {dashboard.config ? (
              [
                {
                  label: "Resend email delivery",
                  ok: dashboard.config.resendConfigured && dashboard.config.fromEmailConfigured,
                },
                {
                  label: "Notification inbox routing",
                  ok: dashboard.config.notificationRecipientsConfigured,
                },
                {
                  label: "Success-only Ads label configured",
                  ok: dashboard.config.conversionLabelConfigured,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-[20px] border border-border/70 bg-background px-4 py-3">
                  <p className="text-sm text-foreground">{item.label}</p>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${statusClass(item.ok)}`}>
                    {item.ok ? "Ready" : "Warning"}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm leading-7 text-amber-100">
                Marketing site configuration could not be read from the live health endpoint.
                {dashboard.configurationError ? ` ${dashboard.configurationError}` : ""}
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="section-card p-6 md:p-7">
        <span className="eyebrow">Warnings</span>
        <h2 className="mt-3 card-title">Anything still broken, unsynced, or misleading</h2>
        <div className="mt-5 space-y-3">
          {dashboard.warnings.length ? (
            dashboard.warnings.map((warning) => (
              <div key={warning} className="rounded-[22px] border border-amber-500/30 bg-amber-500/10 px-5 py-4">
                <p className="text-sm leading-7 text-amber-100">{warning}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
              <p className="text-sm leading-7 text-emerald-100">
                No obvious consultation-flow warnings are currently showing in the internal checks.
              </p>
            </div>
          )}
        </div>
      </section>

      <CrmTableCard
        title="Recent consultation submissions"
        description="A human-readable log of what actually happened to each consultation request after the visitor submitted the form."
        className="app-surface"
      >
        <div className="overflow-hidden rounded-[26px] border border-white/8 bg-[#263248]">
          <Table className="app-grid-table">
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Lead desk</TableHead>
                <TableHead>Thank-you</TableHead>
                <TableHead>Success event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboard.records.length ? (
                dashboard.records.map((record) => (
                  <TableRow key={record.referenceId}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-white">{record.referenceId}</p>
                        <p className="text-xs text-slate-400">{record.fullName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{record.submittedAtLabel}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-slate-300">{record.sourcePage}</p>
                        <p className="text-xs text-slate-400">{record.sourceCategory ?? "consultation"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-100">{record.email}</p>
                        <p className="text-xs text-slate-400">{record.phoneWhatsApp}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${compactStatusClass(record.emailStatus === "sent" ? "good" : record.emailStatus === "failed" ? "warning" : "neutral")}`}>
                          {record.emailStatus}
                        </span>
                        {record.emailError ? <p className="text-xs leading-5 text-amber-100">{record.emailError}</p> : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${compactStatusClass(record.crmSyncStatus === "synced" ? "good" : record.crmSyncStatus === "failed" ? "warning" : "neutral")}`}>
                          {record.crmSyncStatus}
                        </span>
                        {record.crmRecordId ? <p className="text-xs text-slate-400">Lead ID: {record.crmRecordId}</p> : null}
                        {record.crmError ? <p className="text-xs leading-5 text-amber-100">{record.crmError}</p> : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${compactStatusClass(record.thankYouStatus === "confirmed" ? "good" : "warning")}`}>
                          {record.thankYouStatus === "confirmed" ? "confirmed" : "not confirmed"}
                        </span>
                        {record.thankYouConfirmedAtLabel ? (
                          <p className="text-xs text-slate-400">{record.thankYouConfirmedAtLabel}</p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${compactStatusClass(record.conversionStatus === "triggered" ? "good" : "neutral")}`}>
                          {record.conversionStatus === "triggered" ? "attempted" : "not confirmed"}
                        </span>
                        {record.conversionEventAtLabel ? (
                          <p className="text-xs text-slate-400">{record.conversionEventAtLabel}</p>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm leading-7 text-slate-300">
                    No consultation submissions have been recorded yet, or the source-of-truth table is not available in this environment.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CrmTableCard>
    </div>
  )
}
