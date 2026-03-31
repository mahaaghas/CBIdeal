"use client"

import type { ReactNode } from "react"
import { CrmShell } from "@cbideal/ui/components/crm-shell"
import { NotificationsPanel } from "@/components/notifications-panel"
import { WorkspaceAccessGuard } from "@/components/workspace-access-guard"
import { useBranding } from "@/lib/branding-store"
import { usePlatformAccess } from "@/lib/platform-access-store"
import { useWorkflow } from "@/lib/workflow-store"

export default function PortalLayout({ children }: { children: ReactNode }) {
  const {
    getOpenNotificationCount,
    getWorkspaceNotificationFeed,
    markNotificationRead,
    markNotificationsRead,
  } = useWorkflow()
  const { branding } = useBranding()
  const { currentUser, mode } = usePlatformAccess()
  const notificationFeed = getWorkspaceNotificationFeed()
  const unreadCount = getOpenNotificationCount()
  const initials =
    currentUser?.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || (mode === "demo" ? "DM" : "AD")

  return (
    <WorkspaceAccessGuard>
      <CrmShell
        notificationCount={unreadCount}
        notificationsSlot={
          <NotificationsPanel
            items={notificationFeed}
            unreadCount={unreadCount}
            title="Notifications"
            description="Recent workflow events across documents, payments, quotations, and assigned work."
            emptyTitle="No recent events"
            emptyBody="Approvals, uploads, and other system activity will appear here as the workspace moves."
            onMarkRead={markNotificationRead}
            onMarkAllRead={markNotificationsRead}
          />
        }
        profileInitials={initials}
        profileHref="/settings"
        signOutHref="/logout"
        portalHref="/portal"
        brandName={branding.companyName}
        brandLogoUrl={branding.companyLogoUrl}
        brandDarkLogoUrl={branding.darkLogoUrl}
        brandSubtitle={mode === "demo" ? "Demo workspace" : "Advisory workspace"}
      >
        {children}
      </CrmShell>
    </WorkspaceAccessGuard>
  )
}
