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
        "grid gap-5",
        steps.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      {steps.map((step) => (
        <Card key={step.title} className="section-card h-full">
          <CardContent className="card-stack justify-center p-7 md:p-8">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <step.icon className="size-6" />
            </div>
            <div className="card-stack">
              <h3 className="max-w-[16rem] text-[1.24rem] leading-[1.22] text-foreground md:text-[1.38rem]">
                {step.title}
              </h3>
              <p className="fine-print">{step.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
