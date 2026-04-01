import { Badge } from "./ui/badge"
import { cn } from "../lib/utils"

interface CrmStatusBadgeProps {
  status: string
  className?: string
}

const toneMap: Record<string, string> = {
  active: "app-status-green",
  complete: "app-status-green",
  completed: "app-status-green",
  portal_live: "app-status-green",
  strategy_review_complete: "app-status-green",
  approved: "app-status-green",
  paid: "app-status-green",
  open: "app-status-blue",
  reviewing: "app-status-blue",
  reviewing_documents: "app-status-blue",
  under_review: "app-status-blue",
  research_stage: "app-status-blue",
  initial_review: "app-status-blue",
  private_consultation: "app-status-blue",
  formal_review: "app-status-blue",
  portal_onboarding: "app-status-blue",
  scheduled: "app-status-blue",
  pending: "app-status-amber",
  waiting: "app-status-amber",
  awaiting: "app-status-amber",
  awaiting_documents: "app-status-amber",
  awaiting_upload: "app-status-amber",
  requested: "app-status-amber",
  invitation_sent: "app-status-amber",
  onboarding: "app-status-amber",
  due_soon: "app-status-amber",
  awaiting_proof: "app-status-amber",
  overdue: "app-status-amber",
  waiting_on_client: "app-status-amber",
  in_progress: "app-status-blue",
  uploaded: "app-status-blue",
  due_diligence_preparation: "app-status-blue",
  government_review: "app-status-blue",
  document_collection: "app-status-blue",
  partially_paid: "app-status-blue",
  jurisdiction_comparison: "app-status-blue",
  jurisdiction_reassessment: "app-status-blue",
  queued: "app-status-neutral",
  paused: "app-status-neutral",
  draft: "app-status-neutral",
  client_facing_support: "app-status-neutral",
  internal_seat: "app-status-system",
  rejected: "app-status-red",
  new: "app-status-blue",
  read: "app-status-neutral",
}

function normaliseStatus(status: string) {
  return status.trim().toLowerCase().replace(/\s+/g, "_")
}

export function CrmStatusBadge({ status, className }: CrmStatusBadgeProps) {
  const key = normaliseStatus(status)
  const tone = toneMap[key] ?? "app-status-neutral"

  return (
    <Badge
      variant="outline"
      className={cn(
        "app-status-pill border-0 px-0 shadow-none",
        tone,
        className,
      )}
    >
      {status}
    </Badge>
  )
}
