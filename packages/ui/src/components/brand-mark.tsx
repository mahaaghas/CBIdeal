import Link from "next/link"
import { cn } from "../lib/utils"

interface BrandMarkProps {
  href?: string
  className?: string
  muted?: boolean
  wordmark?: string
  monogram?: string
}

export function BrandMark({
  href = "/",
  className,
  muted = false,
  wordmark = "DEAL",
  monogram = "CBI",
}: BrandMarkProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-full border text-[0.65rem] font-semibold tracking-[0.28em]",
          muted
            ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
            : "border-primary/10 bg-primary text-primary-foreground",
        )}
      >
        {monogram}
      </span>
      <span
        className={cn(
          "text-lg font-semibold tracking-[0.22em]",
          muted ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {wordmark}
      </span>
    </Link>
  )
}
