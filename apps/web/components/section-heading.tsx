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
          ? "mx-auto mb-8 max-w-[44rem] text-center md:mb-9"
          : resolvedAlign === "right"
            ? "mb-8 max-w-[44rem] text-right md:mb-9"
            : "mb-8 max-w-[44rem] md:mb-9"
      }
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title mt-3 max-w-[19ch] text-foreground md:mt-4">{title}</h2>
      <p
        className={
          resolvedAlign === "center"
            ? "mx-auto mt-3 max-w-[40rem] text-base leading-7 text-muted-foreground md:mt-4 md:text-[1.02rem] md:leading-8"
            : "mt-3 max-w-[40rem] text-base leading-7 text-muted-foreground md:mt-4 md:text-[1.02rem] md:leading-8"
        }
      >
        {description}
      </p>
    </div>
  )
}
