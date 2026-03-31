"use client"

import type { ReactNode } from "react"
import { InternalShell } from "@/components/internal-shell"

export default function InternalLayout({ children }: { children: ReactNode }) {
  return <InternalShell>{children}</InternalShell>
}

