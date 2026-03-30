import { Badge } from "./ui/badge"
import { cn } from "../lib/utils"

interface CrmStatusBadgeProps {
  status: string
  className?: string
}

const toneMap: Record<string, string> = {
  active: "border-emerald-300/70 bg-emerald-50 text-emerald-800",
  complete: "border-emerald-300/70 bg-emerald-50 text-emerald-800",
  completed: "border-emerald-300/70 bg-emerald-50 text-emerald-800",
  portal_live: "border-emerald-300/70 bg-emerald-50 text-emerald-800",
  strategy_review_complete: "border-emerald-300/70 bg-emerald-50 text-emerald-800",
  approved: "border-emerald-300/70 bg-emerald-50 text-emerald-800",
  paid: "border-emerald-300/70 bg-emerald-50 text-emerald-800",
  open: "border-sky-300/70 bg-sky-50 text-sky-800",
  reviewing: "border-sky-300/70 bg-sky-50 text-sky-800",
  reviewing_documents: "border-sky-300/70 bg-sky-50 text-sky-800",
  under_review: "border-sky-300/70 bg-sky-50 text-sky-800",
  research_stage: "border-sky-300/70 bg-sky-50 text-sky-800",
  initial_review: "border-sky-300/70 bg-sky-50 text-sky-800",
  private_consultation: "border-sky-300/70 bg-sky-50 text-sky-800",
  formal_review: "border-sky-300/70 bg-sky-50 text-sky-800",
  portal_onboarding: "border-sky-300/70 bg-sky-50 text-sky-800",
  pending: "border-amber-300/70 bg-amber-50 text-amber-800",
  waiting: "border-amber-300/70 bg-amber-50 text-amber-800",
  awaiting: "border-amber-300/70 bg-amber-50 text-amber-800",
  awaiting_documents: "border-amber-300/70 bg-amber-50 text-amber-800",
  awaiting_upload: "border-amber-300/70 bg-amber-50 text-amber-800",
  requested: "border-amber-300/70 bg-amber-50 text-amber-800",
  invitation_sent: "border-amber-300/70 bg-amber-50 text-amber-800",
  onboarding: "border-amber-300/70 bg-amber-50 text-amber-800",
  due_soon: "border-amber-300/70 bg-amber-50 text-amber-800",
  awaiting_proof: "border-amber-300/70 bg-amber-50 text-amber-800",
  overdue: "border-amber-300/70 bg-amber-50 text-amber-800",
  in_progress: "border-violet-300/70 bg-violet-50 text-violet-800",
  uploaded: "border-violet-300/70 bg-violet-50 text-violet-800",
  due_diligence_preparation: "border-violet-300/70 bg-violet-50 text-violet-800",
  government_review: "border-violet-300/70 bg-violet-50 text-violet-800",
  document_collection: "border-violet-300/70 bg-violet-50 text-violet-800",
  queued: "border-violet-300/70 bg-violet-50 text-violet-800",
  scheduled: "border-violet-300/70 bg-violet-50 text-violet-800",
  partially_paid: "border-violet-300/70 bg-violet-50 text-violet-800",
  jurisdiction_comparison: "border-violet-300/70 bg-violet-50 text-violet-800",
  jurisdiction_reassessment: "border-violet-300/70 bg-violet-50 text-violet-800",
  paused: "border-stone-300/70 bg-stone-100 text-stone-700",
  draft: "border-stone-300/70 bg-stone-100 text-stone-700",
  waiting_on_client: "border-stone-300/70 bg-stone-100 text-stone-700",
  "client-facing_support": "border-stone-300/70 bg-stone-100 text-stone-700",
  rejected: "border-rose-300/70 bg-rose-50 text-rose-700",
  internal_seat: "border-stone-300/70 bg-stone-100 text-stone-700",
}

function normaliseStatus(status: string) {
  return status.trim().toLowerCase().replace(/\s+/g, "_")
}

export function CrmStatusBadge({ status, className }: CrmStatusBadgeProps) {
  const key = normaliseStatus(status)
  const tone = toneMap[key] ?? "border-primary/15 bg-primary/[0.08] text-primary"

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full border px-3 py-1 text-[0.7rem] uppercase tracking-[0.16em]", tone, className)}
    >
      {status}
    </Badge>
  )
}
