import type { ReactNode } from "react"
import { CrmShell } from "@cbideal/ui/components/crm-shell"

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <CrmShell>{children}</CrmShell>
}
