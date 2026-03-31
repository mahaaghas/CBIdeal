import { Badge } from "./ui/badge"
import { cn } from "../lib/utils"

interface CrmStatusBadgeProps {
  status: string
  className?: string
}

const toneMap: Record<string, string> = {
  active: "border-emerald-400/18 bg-emerald-500/14 text-emerald-100",
  complete: "border-emerald-400/18 bg-emerald-500/14 text-emerald-100",
  completed: "border-emerald-400/18 bg-emerald-500/14 text-emerald-100",
  portal_live: "border-emerald-400/18 bg-emerald-500/14 text-emerald-100",
  strategy_review_complete: "border-emerald-400/18 bg-emerald-500/14 text-emerald-100",
  approved: "border-emerald-400/18 bg-emerald-500/14 text-emerald-100",
  paid: "border-emerald-400/18 bg-emerald-500/14 text-emerald-100",
  open: "border-sky-400/18 bg-sky-500/14 text-sky-100",
  reviewing: "border-sky-400/18 bg-sky-500/14 text-sky-100",
  reviewing_documents: "border-sky-400/18 bg-sky-500/14 text-sky-100",
  under_review: "border-sky-400/18 bg-sky-500/14 text-sky-100",
  research_stage: "border-sky-400/18 bg-sky-500/14 text-sky-100",
  initial_review: "border-sky-400/18 bg-sky-500/14 text-sky-100",
  private_consultation: "border-sky-400/18 bg-sky-500/14 text-sky-100",
  formal_review: "border-sky-400/18 bg-sky-500/14 text-sky-100",
  portal_onboarding: "border-sky-400/18 bg-sky-500/14 text-sky-100",
  pending: "border-amber-400/20 bg-amber-500/16 text-amber-100",
  waiting: "border-amber-400/20 bg-amber-500/16 text-amber-100",
  awaiting: "border-amber-400/20 bg-amber-500/16 text-amber-100",
  awaiting_documents: "border-amber-400/20 bg-amber-500/16 text-amber-100",
  awaiting_upload: "border-amber-400/20 bg-amber-500/16 text-amber-100",
  requested: "border-amber-400/20 bg-amber-500/16 text-amber-100",
  invitation_sent: "border-amber-400/20 bg-amber-500/16 text-amber-100",
  onboarding: "border-amber-400/20 bg-amber-500/16 text-amber-100",
  due_soon: "border-amber-400/20 bg-amber-500/16 text-amber-100",
  awaiting_proof: "border-amber-400/20 bg-amber-500/16 text-amber-100",
  overdue: "border-amber-400/20 bg-amber-500/16 text-amber-100",
  in_progress: "border-violet-400/18 bg-violet-500/14 text-violet-100",
  uploaded: "border-violet-400/18 bg-violet-500/14 text-violet-100",
  due_diligence_preparation: "border-violet-400/18 bg-violet-500/14 text-violet-100",
  government_review: "border-violet-400/18 bg-violet-500/14 text-violet-100",
  document_collection: "border-violet-400/18 bg-violet-500/14 text-violet-100",
  queued: "border-violet-400/18 bg-violet-500/14 text-violet-100",
  scheduled: "border-violet-400/18 bg-violet-500/14 text-violet-100",
  partially_paid: "border-violet-400/18 bg-violet-500/14 text-violet-100",
  jurisdiction_comparison: "border-violet-400/18 bg-violet-500/14 text-violet-100",
  jurisdiction_reassessment: "border-violet-400/18 bg-violet-500/14 text-violet-100",
  paused: "border-slate-300/14 bg-slate-300/10 text-slate-100",
  draft: "border-slate-300/14 bg-slate-300/10 text-slate-100",
  waiting_on_client: "border-slate-300/14 bg-slate-300/10 text-slate-100",
  "client-facing_support": "border-slate-300/14 bg-slate-300/10 text-slate-100",
  rejected: "border-rose-400/20 bg-rose-500/16 text-rose-100",
  internal_seat: "border-slate-300/14 bg-slate-300/10 text-slate-100",
}

function normaliseStatus(status: string) {
  return status.trim().toLowerCase().replace(/\s+/g, "_")
}

export function CrmStatusBadge({ status, className }: CrmStatusBadgeProps) {
  const key = normaliseStatus(status)
  const tone = toneMap[key] ?? "border-white/12 bg-white/[0.08] text-white"

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-[0.72rem] font-semibold leading-none tracking-[0.03em] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        tone,
        className,
      )}
    >
      {status}
    </Badge>
  )
}
