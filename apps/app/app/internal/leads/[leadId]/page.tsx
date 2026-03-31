import { notFound } from "next/navigation"
import { LeadDetailPageClient } from "@/components/lead-detail-page-client"
import { getLeadInboxRecords } from "@/lib/lead-intake"

export default async function InternalLeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params
  const leads = await getLeadInboxRecords()
  const lead = leads.find((item) => item.recordKey === decodeURIComponent(leadId))

  if (!lead) notFound()

  return <LeadDetailPageClient lead={lead} />
}

