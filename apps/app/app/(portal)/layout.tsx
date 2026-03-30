"use client"

import type { ReactNode } from "react"
import { CrmShell } from "@cbideal/ui/components/crm-shell"
import { useWorkflow } from "@/lib/workflow-store"

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { getOpenNotificationCount } = useWorkflow()

  return (
    <CrmShell notificationCount={getOpenNotificationCount()} profileInitials="AD">
      {children}
    </CrmShell>
  )
}
