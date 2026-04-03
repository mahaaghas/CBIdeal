import type { ReactNode } from "react"
import { Card, CardContent } from "./ui/card"
import { cn } from "../lib/utils"

interface CrmTableCardProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  headerClassName?: string
  introClassName?: string
  actionClassName?: string
}

export function CrmTableCard({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  introClassName,
  actionClassName,
}: CrmTableCardProps) {
  return (
    <Card className={cn("section-card", className)}>
      <CardContent className="space-y-6 p-6">
        <div
          className={cn(
            "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
            headerClassName,
          )}
        >
          <div className={cn("min-w-0 space-y-2", introClassName)}>
            <h2 className="app-type-title text-[1.85rem] leading-[1.08] md:text-[2rem]">{title}</h2>
            {description ? (
              <p className="app-type-body max-w-2xl text-sm leading-7 text-slate-300 md:text-[0.97rem]">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className={cn("flex min-w-0 items-center", actionClassName)}>{action}</div> : null}
        </div>
        {children}
      </CardContent>
    </Card>
  )
}
