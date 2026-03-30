import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getRequestDirection } from "@/lib/i18n/request"
import { cn } from "@/lib/utils"

interface FaqItem {
  question: string
  answer: string
}

interface FaqListProps {
  items: FaqItem[]
}

export function FaqList({ items }: FaqListProps) {
  const direction = getRequestDirection()
  const isRtl = direction === "rtl"

  return (
    <Accordion type="single" collapsible className="space-y-4" dir={direction}>
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`faq-${index}`} className="section-card px-6">
          <AccordionTrigger className={cn("text-lg font-semibold text-foreground hover:no-underline", isRtl && "text-right")}>
            {item.question}
          </AccordionTrigger>
          <AccordionContent className={cn("fine-print pb-5", isRtl && "text-right")}>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
