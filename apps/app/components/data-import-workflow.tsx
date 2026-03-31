"use client"

import { useMemo, useState } from "react"
import { Download, FileSpreadsheet, Upload } from "lucide-react"
import { Button } from "@cbideal/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cbideal/ui/components/ui/dialog"
import { Input } from "@cbideal/ui/components/ui/input"
import {
  buildValidatedImportPreview,
  downloadImportTemplate,
  formatPreviewValue,
  getImportDefinition,
  getImportTypeDefinitions,
  parseImportFile,
  suggestMappings,
  type ImportMapping,
  type ImportSource,
  type ImportType,
} from "@/lib/data-import"
import { useWorkflow, type WorkspaceImportSummary } from "@/lib/workflow-store"

type DataImportWorkflowProps = {
  source: ImportSource
  defaultType?: ImportType
  mode?: "dialog" | "inline"
  triggerLabel?: string
  title?: string
  description?: string
  onComplete?: (summary: WorkspaceImportSummary) => void
  className?: string
}

const stepLabels = ["Choose type", "Upload file", "Map columns", "Preview", "Summary"]

export function DataImportWorkflow({
  source,
  defaultType,
  mode = "dialog",
  triggerLabel = "Import data",
  title = "Structured data import",
  description = "Bring existing leads and operational records into the workspace through one controlled import flow.",
  onComplete,
  className,
}: DataImportWorkflowProps) {
  const { importRecords } = useWorkflow()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(defaultType ? 2 : 1)
  const [selectedType, setSelectedType] = useState<ImportType | null>(defaultType ?? null)
  const [fileName, setFileName] = useState("")
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<Record<string, string>[]>([])
  const [mapping, setMapping] = useState<ImportMapping>({})
  const [parsing, setParsing] = useState(false)
  const [skipInvalidRows, setSkipInvalidRows] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<WorkspaceImportSummary | null>(null)

  const definition = selectedType ? getImportDefinition(selectedType) : null
  const preview = useMemo(() => {
    if (!selectedType || !rows.length) return null
    return buildValidatedImportPreview(selectedType, rows, mapping)
  }, [mapping, rows, selectedType])

  const importableRows = useMemo(() => {
    if (!preview) return []
    const invalidNumbers = new Set(preview.issues.map((issue) => issue.rowNumber))
    return preview.mappedRows.filter((_, index) => !invalidNumbers.has(index + 2))
  }, [preview])

  const resetFlow = () => {
    setStep(defaultType ? 2 : 1)
    setSelectedType(defaultType ?? null)
    setFileName("")
    setHeaders([])
    setRows([])
    setMapping({})
    setSkipInvalidRows(true)
    setError(null)
    setSummary(null)
  }

  const handleTypeSelect = (type: ImportType) => {
    setSelectedType(type)
    setMapping({})
    setError(null)
    setStep(2)
  }

  const handleFileSelected = async (file: File | null) => {
    if (!file || !selectedType) return
    setParsing(true)
    setError(null)

    try {
      const parsed = await parseImportFile(file)
      if (!parsed.headers.length || !parsed.rows.length) {
        setError("The file did not contain any readable rows.")
        setParsing(false)
        return
      }

      setFileName(file.name)
      setHeaders(parsed.headers)
      setRows(parsed.rows)
      setMapping(suggestMappings(selectedType, parsed.headers))
      setStep(3)
    } catch {
      setError("We could not read this file. Please use CSV or XLSX.")
    } finally {
      setParsing(false)
    }
  }

  const handleContinueToPreview = () => {
    if (!selectedType) return
    setError(null)
    const requiredUnmapped = getImportDefinition(selectedType).fields.filter(
      (field) => field.required && !mapping[field.key],
    )

    if (requiredUnmapped.length) {
      setError(`Please map the required fields first: ${requiredUnmapped.map((field) => field.label).join(", ")}.`)
      return
    }

    setStep(4)
  }

  const handleImport = () => {
    if (!selectedType || !preview) return

    const rowsToImport = skipInvalidRows ? importableRows : preview.mappedRows
    const importedSummary = importRecords({
      type: selectedType,
      rows: rowsToImport,
      fileName,
      source,
      skipInvalidRows,
    })

    setSummary(importedSummary)
    setStep(5)
    onComplete?.(importedSummary)
  }

  const body = (
    <div className={className}>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="app-pill rounded-full px-4 py-1.5 text-sm font-semibold">{source === "Onboarding" ? "Onboarding import" : "Workspace import"}</span>
            {selectedType ? <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{getImportDefinition(selectedType).label}</span> : null}
          </div>
          <h2 className="font-serif text-[2rem] leading-[1.05] tracking-[-0.035em] text-white">{title}</h2>
          <p className="max-w-3xl text-sm leading-7 text-slate-300">{description}</p>
        </div>

        <div className="space-y-3">
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full bg-[var(--app-brand-primary)] transition-all" style={{ width: `${(step / stepLabels.length) * 100}%` }} />
          </div>
          <div className="grid gap-2 sm:grid-cols-5">
            {stepLabels.map((label, index) => (
              <div
                key={label}
                className={`rounded-[18px] px-3 py-3 text-sm ${step === index + 1 ? "border border-[var(--app-brand-primary)]/25 bg-[var(--app-brand-surface-tint)] text-white" : index + 1 < step ? "border border-white/10 bg-white/[0.06] text-slate-200" : "border border-white/8 bg-white/[0.03] text-slate-400"}`}
              >
                <p className="font-semibold">{label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em]">Step {index + 1}</p>
              </div>
            ))}
          </div>
        </div>

        {step === 1 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {getImportTypeDefinitions().map((type) => (
              <button
                key={type.type}
                type="button"
                onClick={() => handleTypeSelect(type.type)}
                className="app-subtle-card-strong rounded-[22px] px-5 py-5 text-left transition-colors hover:bg-white/[0.08]"
              >
                <div className="space-y-3">
                  <p className="text-base font-semibold text-white">{type.label}</p>
                  <p className="text-sm leading-6 text-slate-300">{type.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200">
                    Choose type
                    <Upload className="size-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {step === 2 && definition ? (
          <div className="grid gap-5 xl:grid-cols-[1.04fr_0.96fr]">
            <div className="app-subtle-card-strong rounded-[24px] px-6 py-6">
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-white">Upload {definition.label.toLowerCase()} file</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Use a clean CSV or Excel file. You will map columns before anything is imported.
                  </p>
                </div>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-white/14 bg-white/[0.03] px-6 py-10 text-center transition hover:bg-white/[0.05]">
                  <FileSpreadsheet className="size-8 text-slate-200" />
                  <p className="mt-4 text-sm font-semibold text-white">{parsing ? "Reading file..." : "Choose CSV or XLSX"}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    We will preview the rows and let you map every important column before import.
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    className="hidden"
                    onChange={(event) => handleFileSelected(event.target.files?.[0] ?? null)}
                  />
                </label>
                {fileName ? <p className="text-sm text-slate-300">Selected file: {fileName}</p> : null}
              </div>
            </div>

            <div className="app-subtle-card-strong rounded-[24px] px-6 py-6">
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-white">Templates</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Download a clean import template if you want to restructure data before bringing it into the workspace.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { format: "csv" as const, label: "Download CSV template" },
                    { format: "xlsx" as const, label: "Download Excel template" },
                  ].map((item) => (
                    <Button
                      key={item.format}
                      type="button"
                      variant="outline"
                      className="app-button-secondary w-full rounded-full justify-between"
                      onClick={() => downloadImportTemplate(definition.type, item.format)}
                    >
                      {item.label}
                      <Download className="size-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 && definition ? (
          <div className="space-y-5">
            <div className="app-subtle-card-strong rounded-[24px] px-6 py-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">Map columns to system fields</p>
                <p className="text-sm leading-7 text-slate-300">
                  Auto-mapping is applied where possible. Review each field and adjust anything that needs a cleaner match.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {definition.fields.map((field) => (
                <div key={field.key} className="app-subtle-card rounded-[22px] px-5 py-5">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {field.label}
                        {field.required ? <span className="ml-2 text-[var(--app-brand-primary)]">*</span> : null}
                      </p>
                      {field.description ? <p className="mt-1 text-sm leading-6 text-slate-300">{field.description}</p> : null}
                    </div>
                    <select
                      value={mapping[field.key] ?? ""}
                      onChange={(event) =>
                        setMapping((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-[var(--app-brand-primary)]"
                    >
                      <option value="">Skip this field</option>
                      {headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <Button type="button" variant="outline" className="app-button-secondary rounded-full" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="button" className="rounded-full" onClick={handleContinueToPreview}>
                Continue to preview
              </Button>
            </div>
          </div>
        ) : null}

        {step === 4 && definition && preview ? (
          <div className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="app-subtle-card-strong rounded-[24px] px-6 py-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Preview rows</p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        Review a sample of the mapped rows before confirming the import.
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-semibold text-white">
                      {rows.length} rows
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-[20px] border border-white/8 bg-white/[0.02]">
                    <table className="min-w-full text-left text-sm">
                      <thead className="border-b border-white/8 bg-white/[0.03] text-slate-300">
                        <tr>
                          {definition.fields.slice(0, 5).map((field) => (
                            <th key={field.key} className="px-4 py-3 font-semibold">{field.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.mappedRows.slice(0, 6).map((row, index) => {
                          const rowIssue = preview.issues.find((issue) => issue.rowNumber === index + 2)
                          return (
                            <tr key={`preview-${index}`} className={rowIssue ? "border-t border-white/8 bg-[#5f3340]/20" : "border-t border-white/8"}>
                              {definition.fields.slice(0, 5).map((field) => (
                                <td key={`${index}-${field.key}`} className="px-4 py-3 text-slate-200">
                                  {formatPreviewValue(field, row[field.key] ?? "")}
                                </td>
                              ))}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="app-subtle-card-strong rounded-[24px] px-6 py-6">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-white">Validation</p>
                    <p className="text-sm leading-7 text-slate-300">
                      Rows with missing required fields or invalid values are highlighted before import.
                    </p>
                    <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                      <p className="text-sm text-slate-200">
                        <span className="font-semibold text-white">{importableRows.length}</span> ready to import
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        <span className="font-semibold text-white">{preview.issues.length}</span> row{preview.issues.length === 1 ? "" : "s"} need attention
                      </p>
                    </div>
                    <label className="flex items-start gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                      <input
                        type="checkbox"
                        checked={skipInvalidRows}
                        onChange={(event) => setSkipInvalidRows(event.target.checked)}
                        className="mt-1 size-4 rounded border-white/15 bg-transparent"
                      />
                      <span className="text-sm leading-6 text-slate-300">
                        Skip invalid rows automatically and import the clean records first.
                      </span>
                    </label>
                  </div>
                </div>

                {preview.issues.length ? (
                  <div className="app-subtle-card-strong rounded-[24px] px-6 py-6">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-white">Validation issues</p>
                      <div className="space-y-3">
                        {preview.issues.slice(0, 6).map((issue) => (
                          <div key={issue.rowNumber} className="rounded-[18px] border border-[#c35a63]/25 bg-[#c35a63]/10 px-4 py-4 text-sm text-slate-100">
                            <p className="font-semibold">Row {issue.rowNumber}</p>
                            <ul className="mt-2 space-y-1 text-slate-200">
                              {issue.issues.map((entry) => (
                                <li key={entry}>{entry}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <Button type="button" variant="outline" className="app-button-secondary rounded-full" onClick={() => setStep(3)}>
                Back to mapping
              </Button>
              <Button
                type="button"
                className="rounded-full"
                onClick={handleImport}
                disabled={!skipInvalidRows && preview.issues.length > 0}
              >
                Confirm import
              </Button>
            </div>
          </div>
        ) : null}

        {step === 5 && summary ? (
          <div className="space-y-5">
            <div className="app-subtle-card-strong rounded-[24px] px-6 py-6">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-white">Import complete</p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Imported</p>
                    <p className="mt-2 font-serif text-[2rem] tracking-[-0.04em] text-white">{summary.importedCount}</p>
                  </div>
                  <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Skipped</p>
                    <p className="mt-2 font-serif text-[2rem] tracking-[-0.04em] text-white">{summary.skippedCount}</p>
                  </div>
                  <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Issues</p>
                    <p className="mt-2 font-serif text-[2rem] tracking-[-0.04em] text-white">{summary.issueCount}</p>
                  </div>
                </div>
                <p className="text-sm leading-7 text-slate-300">
                  {summary.fileName} has been processed into the current workspace. Imported records are now visible in the relevant modules.
                </p>
              </div>
            </div>

            {summary.issues.length ? (
              <div className="app-subtle-card rounded-[24px] px-6 py-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-white">Items to review</p>
                  <div className="space-y-2">
                    {summary.issues.slice(0, 8).map((issue) => (
                      <div key={issue} className="rounded-[16px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                        {issue}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button type="button" className="rounded-full" onClick={resetFlow}>
                Import another file
              </Button>
              {mode === "dialog" ? (
                <Button type="button" variant="outline" className="app-button-secondary rounded-full" onClick={() => setOpen(false)}>
                  Close
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-[#c35a63]/30 bg-[#c35a63]/10 px-4 py-3 text-sm text-slate-100">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  )

  if (mode === "inline") {
    return body
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) resetFlow()
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="app-button-secondary rounded-full">
          <Upload className="size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="app-surface max-h-[90vh] max-w-[1120px] overflow-y-auto border-white/10 p-0 text-white">
        <DialogHeader className="border-b border-white/8 px-6 py-6 text-left">
          <DialogTitle className="font-serif text-[2rem] tracking-[-0.03em] text-white">{title}</DialogTitle>
          <DialogDescription className="max-w-3xl text-sm leading-7 text-slate-300">{description}</DialogDescription>
        </DialogHeader>
        <div className="px-6 py-6">{body}</div>
      </DialogContent>
    </Dialog>
  )
}
