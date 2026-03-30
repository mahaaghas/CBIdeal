import type { ReactNode } from "react"
import { Card, CardContent } from "./ui/card"
import { cn } from "../lib/utils"

interface CrmTableCardProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function CrmTableCard({
  title,
  description,
  action,
  children,
  className,
}: CrmTableCardProps) {
  return (
    <Card className={cn("section-card", className)}>
      <CardContent className="space-y-6 p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="card-title text-foreground">{title}</h2>
            {description ? <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p> : null}
          </div>
          {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
        </div>
        {children}
      </CardContent>
    </Card>
  )
}
