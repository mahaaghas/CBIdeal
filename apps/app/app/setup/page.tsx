"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowRight, FileSpreadsheet, LayoutTemplate, Sparkles } from "lucide-react"
import { Button } from "@cbideal/ui/components/ui/button"
import { DataImportWorkflow } from "@/components/data-import-workflow"
import { WorkspaceAccessGuard } from "@/components/workspace-access-guard"
import { usePlatformAccess } from "@/lib/platform-access-store"
import { useWorkflow } from "@/lib/workflow-store"

export default function WorkspaceSetupPage() {
  const router = useRouter()
  const { currentTenant } = usePlatformAccess()
  const { startFromScratch } = useWorkflow()
  const [mode, setMode] = useState<"options" | "import">("options")

  return (
    <WorkspaceAccessGuard>
      <div className="app-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-[1220px] space-y-8">
          <section className="section-card rounded-[32px] px-8 py-8 md:px-10 md:py-10">
            <div className="max-w-4xl space-y-4">
              <span className="app-pill inline-flex rounded-full px-4 py-1.5 text-sm font-semibold">Workspace setup</span>
              <h1 className="font-serif text-[2.7rem] leading-[1.02] tracking-[-0.045em] text-white md:text-[3.4rem]">
                Decide how {currentTenant?.companyName ?? "your workspace"} should begin.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-slate-300">
                You can start with a clean workspace, import existing operational data, or open the sample environment first to review the product structure before loading anything of your own.
              </p>
            </div>
          </section>

          {mode === "options" ? (
            <section className="grid gap-5 xl:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  startFromScratch()
                  router.push("/dashboard")
                }}
                className="app-surface rounded-[26px] px-6 py-6 text-left transition-colors hover:bg-white/[0.08]"
              >
                <div className="space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-[18px] bg-[var(--app-brand-surface-tint-strong)] text-white">
                    <LayoutTemplate className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-white">Start from scratch</p>
                    <p className="text-sm leading-7 text-slate-300">
                      Open a clean workspace and add your first client, quotation, case, or payment record directly inside the product.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200">
                    Open clean workspace
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("import")}
                className="app-surface rounded-[26px] px-6 py-6 text-left transition-colors hover:bg-white/[0.08]"
              >
                <div className="space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-[18px] bg-[var(--app-brand-surface-tint-strong)] text-white">
                    <FileSpreadsheet className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-white">Import existing data</p>
                    <p className="text-sm leading-7 text-slate-300">
                      Bring in leads, clients, cases, quotations, and payment stages from CSV or Excel before the team starts working live.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200">
                    Open import flow
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </button>

              <Link
                href="/demo"
                className="app-surface rounded-[26px] px-6 py-6 transition-colors hover:bg-white/[0.08]"
              >
                <div className="space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-[18px] bg-[var(--app-brand-surface-tint-strong)] text-white">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-white">Explore a sample workspace first</p>
                    <p className="text-sm leading-7 text-slate-300">
                      Open the demonstration environment in isolation, review the structure, then return here when you are ready to configure your own live workspace.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200">
                    Open sample workspace
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            </section>
          ) : null}

          {mode === "import" ? (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">Import existing data</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Complete the import, then move directly into the live workspace with your own records already in place.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="app-button-secondary rounded-full"
                  onClick={() => setMode("options")}
                >
                  Back to setup options
                </Button>
              </div>

              <DataImportWorkflow
                mode="inline"
                source="Onboarding"
                title="Import existing operational data"
                description="Upload a CSV or Excel file, map the columns to platform fields, review the preview, and confirm the records that should enter this workspace."
              />

              <div className="flex justify-end">
                <Button type="button" className="rounded-full" onClick={() => router.push("/dashboard")}>
                  Continue to workspace
                </Button>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </WorkspaceAccessGuard>
  )
}
