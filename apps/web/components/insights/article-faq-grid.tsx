import { SectionHeading } from "@/components/section-heading"
import { Card, CardContent } from "@/components/ui/card"

interface FaqItem {
  question: string
  answer: string
}

interface ArticleFaqGridProps {
  title: string
  description: string
  items: FaqItem[]
}

export function ArticleFaqGrid({ title, description, items }: ArticleFaqGridProps) {
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="FAQ" title={title} description={description} />
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.question} className="section-card">
            <CardContent className="space-y-3 p-6">
              <h3 className="text-xl leading-tight text-foreground">{item.question}</h3>
              <p className="text-base leading-8 text-muted-foreground">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
