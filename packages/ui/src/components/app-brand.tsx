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
            "flex items-center overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.08] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
            compact ? "min-h-[48px] max-w-[180px]" : "min-h-[60px] max-w-[220px]",
          )}
        >
          <img
            src={activeLogo}
            alt={name}
            className={cn(
              "block w-auto max-w-full object-contain object-left",
              compact ? "h-7 max-w-[150px]" : "h-9 max-w-[188px]",
            )}
          />
        </div>
        {subtitle && !compact ? (
          <span className="pl-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-slate-200">
            {subtitle}
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <div className={cn("inline-flex max-w-[220px] flex-col leading-none", className)}>
      <span
        className={cn(
          "font-serif tracking-[-0.05em] text-white",
          compact ? "text-[1.2rem] leading-tight" : "text-[2rem] leading-tight",
        )}
      >
        {name}
      </span>
      {subtitle && !compact ? (
        <span className="mt-2 pl-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-slate-200">
          {subtitle}
        </span>
      ) : null}
    </div>
  )
}
