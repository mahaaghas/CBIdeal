interface TrustItem {
  title: string
  description: string
}

interface TrustGridProps {
  items: TrustItem[]
}

export function TrustGrid({ items }: TrustGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="section-card h-full p-6 md:p-7">
          <h3 className="text-[1.35rem] leading-snug text-foreground">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  )
}
