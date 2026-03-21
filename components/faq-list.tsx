import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FaqItem {
  question: string
  answer: string
}

interface FaqListProps {
  items: FaqItem[]
}

export function FaqList({ items }: FaqListProps) {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`faq-${index}`} className="section-card px-6">
          <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="fine-print pb-5">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
