import { getRequestDirection } from "@/lib/i18n/request"

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
  align?: "left" | "center"
}

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const resolvedAlign = align === "center" ? "center" : isRtl ? "right" : "left"

  return (
    <div
      className={
        resolvedAlign === "center"
          ? "mx-auto mb-7 max-w-[41rem] text-center md:mb-8"
          : resolvedAlign === "right"
            ? "mb-7 max-w-[41rem] text-right md:mb-8"
            : "mb-7 max-w-[41rem] md:mb-8"
      }
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title mt-3 max-w-[18ch] text-foreground md:mt-4">{title}</h2>
      <p
        className={
          resolvedAlign === "center"
            ? "mx-auto mt-3 max-w-[38rem] text-base leading-7 text-muted-foreground md:mt-4 md:text-[1.02rem] md:leading-8"
            : "mt-3 max-w-[38rem] text-base leading-7 text-muted-foreground md:mt-4 md:text-[1.02rem] md:leading-8"
        }
      >
        {description}
      </p>
    </div>
  )
}
