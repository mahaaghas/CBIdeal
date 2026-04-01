import { getRequestDirection } from "@/lib/i18n/request"

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
  align?: "left" | "center"
  theme?: "light" | "dark"
}

export function SectionHeading({ eyebrow, title, description, align = "left", theme = "light" }: SectionHeadingProps) {
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"
  const resolvedAlign = align === "center" ? "center" : isRtl ? "right" : "left"
  const isDark = theme === "dark"

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
      <span className={isDark ? "eyebrow border-white/20 bg-white/10 text-primary-foreground/80" : "eyebrow"}>{eyebrow}</span>
      <h2 className={isDark ? "section-title mt-3 max-w-[19ch] text-primary-foreground md:mt-4" : "section-title mt-3 max-w-[19ch] text-foreground md:mt-4"}>
        {title}
      </h2>
      <p
        className={
          resolvedAlign === "center"
            ? `mx-auto mt-3 max-w-[40rem] text-base leading-7 md:mt-4 md:text-[1.02rem] md:leading-8 ${isDark ? "text-primary-foreground/74" : "text-muted-foreground"}`
            : `mt-3 max-w-[40rem] text-base leading-7 md:mt-4 md:text-[1.02rem] md:leading-8 ${isDark ? "text-primary-foreground/74" : "text-muted-foreground"}`
        }
      >
        {description}
      </p>
    </div>
  )
}
