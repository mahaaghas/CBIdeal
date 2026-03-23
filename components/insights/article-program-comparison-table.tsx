import { Card, CardContent } from "@/components/ui/card"
import { getRequestDirection } from "@/lib/i18n/request"
import { cn } from "@/lib/utils"

interface ArticleProgramComparisonTableProps {
  title: string
  description?: string
  columns: string[]
  rows: Array<{
    label: string
    values: string[]
  }>
}

export function ArticleProgramComparisonTable({
  title,
  description,
  columns,
  rows,
}: ArticleProgramComparisonTableProps) {
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const renderedColumns = isRtl ? [...columns].reverse() : columns

  return (
    <div className={cn("space-y-6", isRtl && "text-right")}>
      <div className="space-y-3">
        <h2 className="section-title text-foreground">{title}</h2>
        {description ? (
          <p className="max-w-3xl text-base leading-8 text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <Card className="section-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table dir={direction} className="min-w-full border-collapse text-left">
              <thead className="bg-muted/40">
                <tr>
                  <th className="min-w-44 border-b border-border/70 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Factor
                  </th>
                  {renderedColumns.map((column) => (
                    <th
                      key={column}
                      className="min-w-48 border-b border-border/70 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="align-top">
                    <th className="border-b border-border/70 px-5 py-4 text-sm font-semibold text-foreground">
                      {row.label}
                    </th>
                    {(isRtl ? [...row.values].reverse() : row.values).map((value, index) => (
                      <td
                        key={`${row.label}-${renderedColumns[index]}`}
                        className="border-b border-border/70 px-5 py-4 text-sm leading-7 text-muted-foreground"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
