import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface ProgramItem {
  title: string
  description: string
  image: string
  alt?: string
}

interface ProgramGridProps {
  items: ProgramItem[]
}

export function ProgramGrid({ items }: ProgramGridProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title} className="section-card overflow-hidden p-0">
          <div className="relative h-60">
            <Image src={item.image} alt={item.alt ?? item.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          </div>
          <CardContent className="space-y-4 p-7">
            <h3 className="text-2xl text-foreground">{item.title}</h3>
            <p className="fine-print">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
