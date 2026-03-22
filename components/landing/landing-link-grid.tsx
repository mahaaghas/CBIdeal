import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface LinkItem {
  title: string
  description: string
  href: string
}

interface LandingLinkGridProps {
  items: LinkItem[]
}

export function LandingLinkGrid({ items }: LandingLinkGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.href} className="section-card h-full">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6">
            <div className="space-y-3">
              <h3 className="text-xl leading-tight text-foreground">{item.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
            </div>
            <Link
              href={item.href}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Learn more
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
