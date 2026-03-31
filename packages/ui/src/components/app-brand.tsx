import { cn } from "../lib/utils"

interface AppBrandProps {
  name: string
  subtitle?: string
  logoUrl?: string | null
  darkLogoUrl?: string | null
  compact?: boolean
  className?: string
}

export function AppBrand({
  name,
  subtitle,
  logoUrl,
  darkLogoUrl,
  compact = false,
  className,
}: AppBrandProps) {
  const activeLogo = darkLogoUrl || logoUrl

  if (activeLogo) {
    return (
      <div className={cn("inline-flex flex-col gap-2", compact && "gap-1", className)}>
        <div
          className={cn(
            "flex items-center overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] px-3 py-2",
            compact ? "max-w-[200px]" : "max-w-[220px]",
          )}
        >
          <img
            src={activeLogo}
            alt={name}
            className={cn(
              "h-10 w-auto max-w-full object-contain object-left",
              compact && "h-8",
            )}
          />
        </div>
        {subtitle ? (
          <span className="pl-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-slate-200">
            {subtitle}
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <div className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-serif tracking-[-0.05em] text-white",
          compact ? "text-[1.45rem] leading-tight" : "text-[2.35rem] leading-tight",
        )}
      >
        {name}
      </span>
      {subtitle ? (
        <span className="mt-2 pl-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-slate-200">
          {subtitle}
        </span>
      ) : null}
    </div>
  )
}
