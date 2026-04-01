import { Badge } from "./ui/badge"
import { cn } from "../lib/utils"

interface CrmStatusBadgeProps {
  status: string
  className?: string
}

const toneMap: Record<string, string> = {
  active: "border-emerald-300/18 bg-emerald-500/14 text-emerald-50",
  complete: "border-emerald-300/18 bg-emerald-500/14 text-emerald-50",
  completed: "border-emerald-300/18 bg-emerald-500/14 text-emerald-50",
  portal_live: "border-emerald-300/18 bg-emerald-500/14 text-emerald-50",
  strategy_review_complete: "border-emerald-300/18 bg-emerald-500/14 text-emerald-50",
  approved: "border-emerald-300/18 bg-emerald-500/14 text-emerald-50",
  paid: "border-emerald-300/18 bg-emerald-500/14 text-emerald-50",
  open: "border-sky-300/18 bg-sky-500/14 text-sky-50",
  reviewing: "border-sky-300/18 bg-sky-500/14 text-sky-50",
  reviewing_documents: "border-sky-300/18 bg-sky-500/14 text-sky-50",
  under_review: "border-sky-300/18 bg-sky-500/14 text-sky-50",
  research_stage: "border-sky-300/18 bg-sky-500/14 text-sky-50",
  initial_review: "border-sky-300/18 bg-sky-500/14 text-sky-50",
  private_consultation: "border-sky-300/18 bg-sky-500/14 text-sky-50",
  formal_review: "border-sky-300/18 bg-sky-500/14 text-sky-50",
  portal_onboarding: "border-sky-300/18 bg-sky-500/14 text-sky-50",
  scheduled: "border-sky-300/18 bg-sky-500/14 text-sky-50",
  pending: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  waiting: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  awaiting: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  awaiting_documents: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  awaiting_upload: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  requested: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  invitation_sent: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  onboarding: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  due_soon: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  awaiting_proof: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  overdue: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  waiting_on_client: "border-amber-300/18 bg-amber-500/16 text-amber-50",
  in_progress: "border-violet-300/18 bg-violet-500/14 text-violet-50",
  uploaded: "border-violet-300/18 bg-violet-500/14 text-violet-50",
  due_diligence_preparation: "border-violet-300/18 bg-violet-500/14 text-violet-50",
  government_review: "border-violet-300/18 bg-violet-500/14 text-violet-50",
  document_collection: "border-violet-300/18 bg-violet-500/14 text-violet-50",
  partially_paid: "border-violet-300/18 bg-violet-500/14 text-violet-50",
  jurisdiction_comparison: "border-violet-300/18 bg-violet-500/14 text-violet-50",
  jurisdiction_reassessment: "border-violet-300/18 bg-violet-500/14 text-violet-50",
  queued: "border-slate-200/12 bg-white/[0.05] text-slate-100",
  paused: "border-slate-200/12 bg-white/[0.05] text-slate-100",
  draft: "border-slate-200/12 bg-white/[0.05] text-slate-100",
  client_facing_support: "border-slate-200/12 bg-white/[0.05] text-slate-100",
  internal_seat: "border-white/8 bg-[rgba(17,23,35,0.28)] text-slate-50",
  rejected: "border-rose-300/18 bg-rose-500/16 text-rose-50",
  new: "border-sky-300/18 bg-sky-500/14 text-sky-50",
  read: "border-slate-200/12 bg-white/[0.05] text-slate-100",
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
        "inline-flex h-8 items-center justify-center rounded-full border px-3.5 text-[0.74rem] font-semibold leading-none tracking-[0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        tone,
        className,
      )}
    >
      {status}
    </Badge>
  )
}
