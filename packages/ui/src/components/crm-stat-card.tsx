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
      <CardContent className="card-stack justify-between p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="app-type-overline">{label}</p>
            <p className="app-type-metric">{value}</p>
          </div>
          {icon ? (
            <div className="app-kpi-icon flex size-11 items-center justify-center rounded-[18px] text-white">
              {icon}
            </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <p className="app-type-caption">{note}</p>
          {trend ? <p className="text-sm font-medium text-[var(--state-success)]">{trend}</p> : null}
        </div>
      </CardContent>
    </Card>
  )
}
