import { Card, CardContent } from "@/components/ui/card"

interface ComparisonRow {
  factor: string
  caribbean: string
  portugal: string
}

interface ArticleComparisonGridProps {
  title: string
  description?: string
  rows: ComparisonRow[]
}

export function ArticleComparisonGrid({ title, description, rows }: ArticleComparisonGridProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="section-title text-foreground">{title}</h2>
        {description ? <p className="max-w-3xl text-base leading-8 text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-4">
        {rows.map((row) => (
          <Card key={row.factor} className="section-card">
            <CardContent className="space-y-5 p-6 md:p-7">
              <h3 className="text-xl leading-tight text-foreground md:text-2xl">{row.factor}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background px-4 py-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Caribbean passport</p>
                  <p className="mt-3 text-base leading-8 text-foreground">{row.caribbean}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background px-4 py-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Portugal Golden Visa</p>
                  <p className="mt-3 text-base leading-8 text-foreground">{row.portugal}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
