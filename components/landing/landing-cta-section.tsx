import { CtaPanel } from "@/components/cta-panel"

interface Action {
  href: string
  label: string
}

interface LandingCtaSectionProps {
  eyebrow: string
  title: string
  description: string
  primaryAction: Action
  secondaryAction?: Action
}

export function LandingCtaSection(props: LandingCtaSectionProps) {
  return (
    <section className="section-padding pt-0">
      <div className="container-shell">
        <CtaPanel {...props} />
      </div>
    </section>
  )
}
