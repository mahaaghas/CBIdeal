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
        <div key={item.title} className="section-card flex h-full min-h-[228px] flex-col justify-center p-7 md:p-8">
          <div className="card-stack justify-center">
            <h3 className="max-w-[15rem] text-[1.24rem] leading-[1.22] text-foreground md:text-[1.38rem]">
              {item.title}
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
