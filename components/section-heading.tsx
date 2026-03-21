interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
  align?: "left" | "center"
}

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto mb-9 max-w-3xl text-center md:mb-11" : "mb-9 max-w-3xl md:mb-11"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title mt-3 text-foreground md:mt-4">{title}</h2>
      <p className="mt-3 text-base leading-7 text-muted-foreground md:mt-4 md:text-lg md:leading-8">{description}</p>
    </div>
  )
}
