import { Suspense } from "react"
import { ClientsPageClient } from "@/components/clients-page-client"

export default function ClientsPage() {
  return (
    <Suspense fallback={<div className="space-y-6" />}>
      <ClientsPageClient />
    </Suspense>
  )
}
