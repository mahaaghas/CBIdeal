import type { ReactNode } from "react"
import { cn } from "../lib/utils"

interface CrmPageHeaderProps {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
  className?: string
}

export function CrmPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: CrmPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="section-stack max-w-[46rem]">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <div className="section-stack">
          <h1 className="text-[2rem] leading-[1.08] tracking-[-0.03em] text-foreground md:text-[2.55rem]">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-[1.02rem] md:leading-8">
            {description}
          </p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3 lg:justify-end">{actions}</div> : null}
    </div>
  )
}
