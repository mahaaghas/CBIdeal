"use client"

import { Database, FileSpreadsheet, Users } from "lucide-react"
import { CrmPageHeader } from "@cbideal/ui/components/crm-page-header"
import { CrmSectionCard } from "@cbideal/ui/components/crm-section-card"
import { CrmStatCard } from "@cbideal/ui/components/crm-stat-card"
import { DataImportWorkflow } from "@/components/data-import-workflow"
import { getImportTypeDefinitions } from "@/lib/data-import"
import { useWorkflow } from "@/lib/workflow-store"

export default function SettingsDataPage() {
  const { state, getImportSummaries } = useWorkflow()
  const summaries = getImportSummaries()

  return (
    <div className="section-stack">
      <CrmPageHeader
        eyebrow="Data center"
        title="Import existing records into the workspace through one structured operational flow."
        description="This area keeps data migration disciplined: template downloads, supported record types, import validation, and a history of previous imports stay in one controlled place."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <CrmStatCard
          label="Imported clients"
          value={`${state.clients.length}`}
          note="Live client records currently visible inside the workspace."
          trend="Tenant scoped"
        />
        <CrmStatCard
          label="Imported leads"
          value={`${state.leads.length}`}
          note="Lead records brought into this workspace through the importer."
          trend="Separated per tenant"
        />
        <CrmStatCard
          label="Import runs"
          value={`${summaries.length}`}
          note="Completed import sessions across onboarding and later workspace setup."
          trend="Auditable history"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.04fr_0.96fr]">
        <CrmSectionCard
          title="Import records"
          description="Upload CSV or Excel files, map columns to platform fields, review the preview, and confirm the records that should enter this workspace."
          className="app-surface"
        >
          <DataImportWorkflow
            mode="inline"
            source="Workspace"
            title="Workspace import center"
            description="Supports leads, clients, cases, quotations, and payments, with manual column mapping and a validation pass before any records are created."
          />
        </CrmSectionCard>

        <CrmSectionCard
          title="Supported datasets"
          description="Each import type has its own clean template and validation rules so migration stays predictable for non-technical teams."
          className="app-surface"
        >
          <div className="space-y-3">
            {getImportTypeDefinitions().map((definition) => (
              <div key={definition.type} className="app-subtle-card-strong rounded-[22px] px-5 py-5">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-11 items-center justify-center rounded-[18px] bg-[var(--app-brand-surface-tint-strong)] text-white">
                    {definition.type === "leads" ? (
                      <Users className="size-5" />
                    ) : definition.type === "clients" ? (
                      <Users className="size-5" />
                    ) : (
                      <FileSpreadsheet className="size-5" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white">{definition.label}</p>
                    <p className="text-sm leading-6 text-slate-300">{definition.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CrmSectionCard>
      </div>

      <CrmSectionCard
        title="Recent import activity"
        description="A short history of the latest imports, including source, file name, and whether any rows were skipped."
        className="app-surface"
      >
        <div className="space-y-3">
          {summaries.length ? (
            summaries.map((summary) => (
              <div key={summary.id} className="app-subtle-card rounded-[22px] px-5 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">{summary.fileName}</span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                        {summary.importType}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                        {summary.source}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">
                      Imported {summary.importedCount} record{summary.importedCount === 1 ? "" : "s"} / skipped {summary.skippedCount} / issues {summary.issueCount}
                    </p>
                    <p className="text-sm leading-6 text-slate-400">{summary.completedAt}</p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-[18px] bg-[var(--app-brand-surface-tint-strong)] text-white">
                    <Database className="size-5" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="app-subtle-card rounded-[22px] px-5 py-5 text-sm leading-7 text-slate-300">
              No imports have been run yet. Use the workspace import center above to bring in existing records.
            </div>
          )}
        </div>
      </CrmSectionCard>
    </div>
  )
}
