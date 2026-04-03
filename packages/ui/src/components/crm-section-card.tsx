import type { ReactNode } from "react"
import { Card, CardContent } from "./ui/card"
import { cn } from "../lib/utils"

interface CrmSectionCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  headerClassName?: string
  bodyClassName?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function CrmSectionCard({
  title,
  description,
  children,
  className,
  headerClassName,
  bodyClassName,
  titleClassName,
  descriptionClassName,
}: CrmSectionCardProps) {
  return (
    <Card className={cn("section-card h-full", className)}>
      <CardContent className="card-stack p-6">
        <div className={cn("space-y-2", headerClassName)}>
          <h2 className={cn("app-type-title", titleClassName)}>{title}</h2>
          {description ? <p className={cn("app-type-caption", descriptionClassName)}>{description}</p> : null}
        </div>
        <div className={cn("space-y-4", bodyClassName)}>{children}</div>
      </CardContent>
    </Card>
  )
}
