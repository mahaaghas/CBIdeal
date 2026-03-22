import { FaqList } from "@/components/faq-list"
import { SectionHeading } from "@/components/section-heading"

interface FaqItem {
  question: string
  answer: string
}

interface LandingFaqSectionProps {
  eyebrow: string
  title: string
  description: string
  items: FaqItem[]
}

export function LandingFaqSection({
  eyebrow,
  title,
  description,
  items,
}: LandingFaqSectionProps) {
  return (
    <section className="section-padding pt-0">
      <div className="container-shell">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <FaqList items={items} />
      </div>
    </section>
  )
}
