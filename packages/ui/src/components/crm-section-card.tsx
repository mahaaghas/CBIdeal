import type { ReactNode } from "react"
import { Card, CardContent } from "./ui/card"
import { cn } from "../lib/utils"

interface CrmSectionCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function CrmSectionCard({
  title,
  description,
  children,
  className,
}: CrmSectionCardProps) {
  return (
    <Card className={cn("section-card h-full", className)}>
      <CardContent className="card-stack p-5 md:p-6">
        <div className="space-y-2">
          <h2 className="card-title text-foreground">{title}</h2>
          {description ? <p className="fine-print">{description}</p> : null}
        </div>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  )
}
