import type { ReactNode } from "react"
import { Card, CardContent } from "./ui/card"

interface CrmStatCardProps {
  label: string
  value: string
  note: string
  icon?: ReactNode
  trend?: string
}

export function CrmStatCard({ label, value, note, icon, trend }: CrmStatCardProps) {
  return (
    <Card className="section-card h-full">
      <CardContent className="card-stack justify-between p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
            <p className="text-3xl font-semibold tracking-[-0.03em] text-foreground">{value}</p>
          </div>
          {icon ? (
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <p className="fine-print">{note}</p>
          {trend ? <p className="text-sm font-medium text-primary">{trend}</p> : null}
        </div>
      </CardContent>
    </Card>
  )
}
