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
  mode?: "embedded" | "modal"
}

export function IntakeFormShell({
  title,
  description,
  step,
  steps,
  children,
  trustNote = "Submissions are reviewed privately and routed to the appropriate advisory team before any reply is arranged.",
  className,
  mode = "embedded",
}: IntakeFormShellProps) {
  const progress = ((step + 1) / steps.length) * 100
  const activeStep = steps[step]

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-[#d9d0c0] bg-[linear-gradient(180deg,#fbf8f2_0%,#f6f1e7_100%)] shadow-[0_32px_80px_rgba(16,22,35,0.22)]",
        mode === "embedded" ? "p-6 md:p-7" : "p-7 md:p-9",
        className,
      )}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-[#ddd2c0] bg-white/65 px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7a6b58]">
            Private advisory intake
          </span>
          <h3 className="max-w-[16ch] text-[2rem] leading-[1.08] tracking-[-0.03em] text-[#1d2430] md:text-[2.3rem]">
            {title}
          </h3>
          <p className="max-w-[34rem] text-[0.96rem] leading-7 text-[#5f6472] md:text-[1rem] md:leading-8">
            {description}
          </p>
        </div>

        <div className="space-y-4 rounded-[1.6rem] border border-[#dfd5c6] bg-white/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] md:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#243041]">
                Step {step + 1} of {steps.length}
              </p>
              <p className="text-sm leading-6 text-[#6d7484]">{activeStep?.summary}</p>
            </div>
            <p className="rounded-full bg-[#243041] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white">
              {activeStep?.title}
            </p>
          </div>
          <Progress value={progress} className="h-2 rounded-full bg-[#e8dfd1]" />
          <div className={cn("grid gap-2.5", mode === "embedded" ? "grid-cols-3" : "grid-cols-3")}>
            {steps.map((item, index) => {
              const active = index === step
              const completed = index < step

              return (
                <div
                  key={item.title}
                  className={cn(
                    "rounded-[1.15rem] border px-3 py-3 transition-colors",
                    active
                      ? "border-[#243041]/12 bg-[#243041] text-white shadow-[0_14px_26px_rgba(24,31,43,0.16)]"
                      : completed
                        ? "border-[#d9cfbf] bg-[#efe8dc] text-[#243041]"
                        : "border-[#e1d7c9] bg-transparent text-[#6d7484]",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-semibold",
                        active
                          ? "bg-white/18 text-white"
                          : completed
                            ? "bg-[#243041] text-white"
                            : "border border-[#d7ccbd] bg-white/75 text-[#7c7381]",
                      )}
                    >
                      {index + 1}
                    </span>
                    <p className="text-[0.78rem] font-semibold leading-5 md:text-[0.82rem]">{item.title}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {children}

        <div className="rounded-[1.4rem] border border-[#dfd5c6] bg-white/68 px-4 py-4 text-sm leading-7 text-[#666d7b]">
          {trustNote}
        </div>
      </div>
    </div>
  )
}
