"use client"

import type { ReactNode } from "react"
import { Progress } from "@cbideal/ui/components/ui/progress"
import { cn } from "@/lib/utils"

interface IntakeFormShellProps {
  title: string
  description: string
  step: number
  steps: Array<{ title: string; summary: string }>
  children: ReactNode
  trustNote?: string
  className?: string
}

export function IntakeFormShell({
  title,
  description,
  step,
  steps,
  children,
  trustNote = "Submissions are reviewed privately and routed to the appropriate advisory team before any reply is arranged.",
  className,
}: IntakeFormShellProps) {
  const progress = ((step + 1) / steps.length) * 100

  return (
    <div className={cn("section-card overflow-hidden p-6 md:p-8", className)}>
      <div className="space-y-5">
        <div className="space-y-3">
          <span className="eyebrow">Structured enquiry</span>
          <h3 className="max-w-[18ch] text-[1.9rem] leading-[1.12] text-foreground md:text-[2.25rem]">{title}</h3>
          <p className="max-w-[38rem] text-sm leading-7 text-muted-foreground md:text-[0.98rem] md:leading-8">
            {description}
          </p>
        </div>

        <div className="space-y-4 rounded-[28px] border border-border/70 bg-muted/35 p-4 md:p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-foreground">
              Step {step + 1} of {steps.length}
            </p>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{steps[step]?.title}</p>
          </div>
          <Progress value={progress} className="h-2.5 rounded-full bg-primary/10" />
          <div className="grid gap-3 md:grid-cols-3">
            {steps.map((item, index) => {
              const active = index === step
              const completed = index < step

              return (
                <div
                  key={item.title}
                  className={cn(
                    "rounded-[24px] border px-4 py-4 transition-colors",
                    active
                      ? "border-primary/20 bg-background text-foreground shadow-sm"
                      : completed
                        ? "border-primary/12 bg-primary/5 text-foreground"
                        : "border-border/60 bg-transparent text-muted-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                        active || completed
                          ? "bg-primary text-primary-foreground"
                          : "border border-border/70 bg-background text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium">{item.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6">{item.summary}</p>
                </div>
              )
            })}
          </div>
        </div>

        {children}

        <div className="rounded-[24px] border border-border/60 bg-background px-4 py-4 text-sm leading-7 text-muted-foreground">
          {trustNote}
        </div>
      </div>
    </div>
  )
}
