import { LeadsPageClient } from "@/components/leads-page-client"
import { getLeadInboxRecords } from "@/lib/lead-intake"

export default async function InternalLeadsPage() {
  const leads = await getLeadInboxRecords()
  return <LeadsPageClient initialLeads={leads} />
}

