"use client"

import type { ReactNode } from "react"
import { CrmShell } from "@cbideal/ui/components/crm-shell"
import { useBranding } from "@/lib/branding-store"
import { useWorkflow } from "@/lib/workflow-store"

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { getOpenNotificationCount } = useWorkflow()
  const { branding } = useBranding()

  return (
    <CrmShell
      notificationCount={getOpenNotificationCount()}
      profileInitials="AD"
      brandName={branding.companyName}
      brandLogoUrl={branding.companyLogoUrl}
      brandDarkLogoUrl={branding.darkLogoUrl}
      brandSubtitle="Advisory workspace"
    >
      {children}
    </CrmShell>
  )
}
