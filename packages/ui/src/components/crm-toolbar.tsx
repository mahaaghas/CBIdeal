import type { ReactNode } from "react"
import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { cn } from "../lib/utils"

interface CrmToolbarProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  actions?: ReactNode
  className?: string
}

export function CrmToolbar({
  searchPlaceholder = "Search",
  searchValue,
  onSearchChange,
  actions,
  className,
}: CrmToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", className)}>
      <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-border/70 bg-background px-4 py-2.5 shadow-sm">
        <Search className="size-4 text-muted-foreground" />
        <Input
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          disabled={!onSearchChange}
          readOnly={!onSearchChange}
          className="h-auto border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  )
}
