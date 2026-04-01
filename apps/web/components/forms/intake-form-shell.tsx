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
        "overflow-hidden rounded-[2.15rem] border border-[#d9d0c0] bg-[linear-gradient(180deg,#fdfaf4_0%,#f5efe4_100%)] shadow-[0_34px_92px_rgba(16,22,35,0.24)]",
        mode === "embedded" ? "p-6 md:p-7 lg:p-8" : "p-7 md:p-9",
        className,
      )}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex rounded-full border border-[#ddd2c0] bg-white/75 px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7a6b58]">
              Private advisory intake
            </span>
            <span className="inline-flex rounded-full bg-[#efe6d9] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#5f6472]">
              Reviewed discreetly
            </span>
          </div>
          <h3 className="max-w-[13ch] text-[2.05rem] leading-[1.04] tracking-[-0.035em] text-[#1d2430] md:text-[2.35rem]">
            {title}
          </h3>
          <p className="max-w-[32rem] text-[0.97rem] leading-7 text-[#5f6472] md:text-[1.02rem] md:leading-8">
            {description}
          </p>
        </div>

        <div className="space-y-5 rounded-[1.7rem] border border-[#dfd5c6] bg-white/78 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
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
            <Progress value={progress} className="h-2.5 rounded-full bg-[#e8dfd1]" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {steps.map((item, index) => {
              const active = index === step
              const completed = index < step

              return (
                <div
                  key={item.title}
                  className={cn(
                    "rounded-[1.25rem] border px-4 py-4 transition-colors",
                    active
                      ? "border-[#243041]/12 bg-[#243041] text-white shadow-[0_14px_26px_rgba(24,31,43,0.16)]"
                      : completed
                        ? "border-[#d9cfbf] bg-[#efe8dc] text-[#243041]"
                        : "border-[#e1d7c9] bg-transparent text-[#6d7484]",
                  )}
                >
                  <div className="flex items-start gap-3">
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
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.82rem] font-semibold leading-5 md:text-[0.86rem]">{item.title}</p>
                      <p
                        className={cn(
                          "mt-1 text-[0.74rem] leading-5",
                          active ? "text-white/80" : completed ? "text-[#445064]" : "text-[#7c7381]",
                        )}
                      >
                        {item.summary}
                      </p>
                      <p
                        className={cn(
                          "mt-1.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] leading-5",
                          active ? "text-white/74" : completed ? "text-[#445064]" : "text-[#7c7381]",
                        )}
                      >
                        {completed ? "Completed" : active ? "Current step" : "Upcoming"}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-[#e4dacb] bg-white/56 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <div className="space-y-1">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#6d7484]">
              Current step
            </p>
            <p className="text-sm font-medium text-[#243041]">
              {activeStep?.title}
            </p>
          </div>
        </div>

        {children}

        <div className="rounded-[1.45rem] border border-[#dfd5c6] bg-white/68 px-5 py-4 text-sm leading-7 text-[#666d7b]">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#6d7484]">
            Private reassurance
          </p>
          <p className="mt-1.5">{trustNote}</p>
        </div>
      </div>
    </div>
  )
}
