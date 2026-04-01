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
          <h1 className="app-type-headline max-w-[18ch]">
            {title}
          </h1>
          <p className="app-type-body max-w-3xl">
            {description}
          </p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3 lg:justify-end">{actions}</div> : null}
    </div>
  )
}
