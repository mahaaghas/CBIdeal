import { QuotationsPageClient } from "@/components/quotations-page-client"

export default async function QuotationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ client?: string }>
}) {
  const resolved = (await searchParams) ?? {}

  return <QuotationsPageClient initialClientId={resolved.client} />
}
