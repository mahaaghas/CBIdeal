import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface ProcessStep {
  icon: LucideIcon
  title: string
  description: string
}

interface ProcessStepsProps {
  steps: ProcessStep[]
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        steps.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      {steps.map((step) => (
        <Card key={step.title} className="section-card h-full">
          <CardContent className="space-y-4 p-7 md:p-8">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <step.icon className="size-6" />
            </div>
            <h3 className="text-2xl leading-tight text-foreground">{step.title}</h3>
            <p className="fine-print">{step.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
