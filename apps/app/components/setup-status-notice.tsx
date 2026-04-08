"use client"

import type { ReactNode } from "react"
import { cn } from "@cbideal/ui/lib/utils"

type SetupStatusNoticeProps = {
  title: string
  description: string
  tone?: "neutral" | "warning"
  actions?: ReactNode
  className?: string
}

export function SetupStatusNotice({
  title,
  description,
  tone = "neutral",
  actions,
  className,
}: SetupStatusNoticeProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] border px-5 py-5 shadow-[0_20px_55px_rgba(8,13,24,0.14)]",
        tone === "warning"
          ? "border-[#d88e84]/28 bg-[rgba(121,45,45,0.12)]"
          : "border-white/10 bg-white/6",
        className,
      )}
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className={cn("text-sm leading-7", tone === "warning" ? "text-[#f2d4ce]" : "text-slate-300")}>
          {description}
        </p>
      </div>
      {actions ? <div className="mt-4 flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  )
}
