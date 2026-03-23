import { Card, CardContent } from "@/components/ui/card"
import { getRequestDirection } from "@/lib/i18n/request"

interface ComparisonColumn {
  key: string
  label: string
}

interface ComparisonRow {
  factor: string
  values: string[]
}

interface LandingComparisonTableProps {
  columns: ComparisonColumn[]
  rows: ComparisonRow[]
}

export function LandingComparisonTable({ columns, rows }: LandingComparisonTableProps) {
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const renderedColumns = isRtl ? [...columns].reverse() : columns

  return (
    <Card className="section-card overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table dir={direction} className="min-w-full border-collapse text-left">
            <thead className="bg-muted/35">
              <tr>
                <th className="min-w-44 border-b border-border/70 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Factor
                </th>
                {renderedColumns.map((column) => (
                  <th
                    key={column.key}
                    className="min-w-44 border-b border-border/70 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.factor} className="align-top">
                  <th className="border-b border-border/70 px-5 py-4 text-sm font-semibold text-foreground">
                    {row.factor}
                  </th>
                  {(isRtl ? [...row.values].reverse() : row.values).map((value, index) => (
                    <td
                      key={`${row.factor}-${renderedColumns[index]?.key ?? index}`}
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
  )
}
