import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface ArticleHighlightProps {
  eyebrow?: string
  title: string
  children: ReactNode
}

export function ArticleHighlight({ eyebrow, title, children }: ArticleHighlightProps) {
  return (
    <Card className="section-card border-primary/10 bg-muted/30">
      <CardContent className="space-y-4 p-6 md:p-7">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2 className="text-2xl leading-tight text-foreground md:text-[2rem]">{title}</h2>
        <div className="space-y-4 text-base leading-8 text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  )
}
