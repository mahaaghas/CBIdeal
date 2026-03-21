import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Action {
  href: string
  label: string
}

interface CtaPanelProps {
  eyebrow: string
  title: string
  description: string
  primaryAction: Action
  secondaryAction?: Action
}

export function CtaPanel({ eyebrow, title, description, primaryAction, secondaryAction }: CtaPanelProps) {
  return (
    <div className="hero-panel overflow-hidden px-6 py-8 md:px-12 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-4">
          <span className="eyebrow border-white/20 bg-white/10 text-primary-foreground/80">{eyebrow}</span>
          <h2 className="section-title max-w-3xl text-primary-foreground">{title}</h2>
          <p className="max-w-2xl text-base leading-7 text-primary-foreground/75 md:text-lg md:leading-8">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
          <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
            <Link href={primaryAction.href}>
              {primaryAction.label}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          {secondaryAction ? (
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white/20 bg-transparent text-primary-foreground hover:bg-white/10 sm:w-auto"
              asChild
            >
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
