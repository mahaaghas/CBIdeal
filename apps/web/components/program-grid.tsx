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
    <div className="grid gap-5 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title} className="group section-card overflow-hidden p-0">
          <div className="relative h-56 md:h-60">
            <Image
              src={item.image}
              alt={item.alt ?? item.title}
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          </div>
          <CardContent className="card-stack justify-start p-7">
            <h3 className="max-w-[16rem] text-[1.42rem] leading-[1.16] text-foreground">{item.title}</h3>
            <p className="fine-print">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
