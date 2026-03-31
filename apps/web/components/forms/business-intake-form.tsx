"use client"

import { useMemo, useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "@cbideal/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@cbideal/ui/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@cbideal/ui/components/ui/form"
import { Input } from "@cbideal/ui/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@cbideal/ui/components/ui/select"
import {
  businessInterests,
  businessVolumes,
  type BusinessLeadSubmission,
} from "@cbideal/config/lead-intake"
import { trackFormSubmit } from "@/lib/analytics"
import {
  businessLeadDefaults,
  businessLeadSchema,
  submitWebsiteLead,
  type BusinessLeadFormValues,
} from "@/lib/lead-intake"
import { IntakeFormShell } from "@/components/forms/intake-form-shell"

interface BusinessIntakeFormProps {
  title?: string
  description?: string
  sourcePage: string
  submitLabel?: string
  display?: "embedded" | "modal"
  triggerLabel?: string
  initialInterest?: BusinessLeadSubmission["interest"]
  className?: string
}

const steps = [
  {
    title: "Business",
    summary: "Identify the firm, geography, and offered services.",
    fields: ["companyName", "country", "servicesOffered", "interest"] as const,
  },
  {
    title: "Volume",
    summary: "Capture approximate client volume and interest.",
    fields: ["clientVolume"] as const,
  },
  {
    title: "Contact",
    summary: "Confirm the contact point for follow-up.",
    fields: ["contactPerson", "workEmail", "phoneWhatsApp"] as const,
  },
] as const

function BusinessIntakeFormContent({
  title = "Start the conversation",
  description = "A short professional intake form to understand whether there is a natural operational fit.",
  sourcePage,
  submitLabel = "Start a conversation",
  initialInterest,
  className,
}: Omit<BusinessIntakeFormProps, "display" | "triggerLabel">) {
  const [step, setStep] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const campaign = searchParams.get("utm_campaign") ?? searchParams.get("campaign") ?? ""

  const form = useForm<BusinessLeadFormValues>({
    resolver: zodResolver(businessLeadSchema),
    defaultValues: {
      ...businessLeadDefaults,
      interest: initialInterest ?? businessLeadDefaults.interest,
      sourcePage,
      campaign,
    },
    shouldFocusError: true,
  })

  const currentStep = steps[step]

  const handleNext = async () => {
    const valid = await form.trigger(currentStep.fields)
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  const handleSubmit = form.handleSubmit((values) => {
    setReferenceId(null)
    setSubmitError(null)
    startTransition(async () => {
      const result = await submitWebsiteLead({ ...values, sourcePage, campaign, formType: "b2b" })

      if (!result.ok) {
        setSubmitError(result.message)
        return
      }

      setReferenceId(result.referenceId)
      trackFormSubmit({ form_type: "b2b", source_page: sourcePage, language: "EN" })
      form.reset({
        ...businessLeadDefaults,
        sourcePage,
        campaign,
        interest: initialInterest ?? businessLeadDefaults.interest,
      })
      setStep(0)
    })
  })

  const content = useMemo(() => {
    if (step === 0) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <FormField control={form.control} name="companyName" render={({ field }) => (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <FormControl><Input className="h-12 rounded-2xl" placeholder="Your firm or practice" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="country" render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl><Input className="h-12 rounded-2xl" placeholder="Primary operating market" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="servicesOffered" render={({ field }) => (
            <FormItem>
              <FormLabel>Services offered</FormLabel>
              <FormControl><Input className="h-12 rounded-2xl" placeholder="For example: immigration advisory, legal support, private client work" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="interest" render={({ field }) => (
            <FormItem>
              <FormLabel>Interest</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Select interest" /></SelectTrigger>
                </FormControl>
                <SelectContent>{businessInterests.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      )
    }

    if (step === 1) {
      return (
        <div className="grid gap-5 md:grid-cols-1">
          <FormField control={form.control} name="clientVolume" render={({ field }) => (
            <FormItem>
              <FormLabel>Number of clients per year</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Select volume" /></SelectTrigger>
                </FormControl>
                <SelectContent>{businessVolumes.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      )
    }

    return (
      <div className="grid gap-5 md:grid-cols-2">
        <FormField control={form.control} name="contactPerson" render={({ field }) => (
          <FormItem>
            <FormLabel>Contact person</FormLabel>
            <FormControl><Input className="h-12 rounded-2xl" placeholder="Primary contact" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="workEmail" render={({ field }) => (
          <FormItem>
            <FormLabel>Work email</FormLabel>
            <FormControl><Input className="h-12 rounded-2xl" placeholder="name@firm.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="phoneWhatsApp" render={({ field }) => (
          <FormItem>
            <FormLabel>Phone / WhatsApp</FormLabel>
            <FormControl><Input className="h-12 rounded-2xl" placeholder="+971 ..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
    )
  }, [form.control, step])

  return (
    <IntakeFormShell
      title={title}
      description={description}
      step={step}
      steps={steps as unknown as Array<{ title: string; summary: string }>}
      trustNote="Professional enquiries are reviewed discreetly and routed to the relevant commercial or platform lead before any follow-up is arranged."
      className={className}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {content}
          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
          {referenceId ? (
            <div className="flex items-start gap-3 rounded-[24px] border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm leading-7 text-foreground">
              <CheckCircle2 className="mt-1 size-4 text-emerald-500" />
              <div>
                <p className="font-medium">Your request has been received.</p>
                <p className="text-muted-foreground">Reference: <span className="font-medium text-foreground">{referenceId}</span></p>
              </div>
            </div>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" className="rounded-full" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0 || isPending}>
              <ChevronLeft className="size-4" />
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" className="rounded-full" onClick={handleNext} disabled={isPending}>
                Continue
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button type="submit" className="rounded-full" disabled={isPending}>
                {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {submitLabel}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </IntakeFormShell>
  )
}

export function BusinessIntakeForm({
  display = "embedded",
  triggerLabel = "Request an overview",
  ...props
}: BusinessIntakeFormProps) {
  if (display === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild><Button className="rounded-full">{triggerLabel}</Button></DialogTrigger>
        <DialogContent className="max-h-[92vh] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-4xl">
          <DialogHeader className="sr-only"><DialogTitle>{props.title ?? "Start the conversation"}</DialogTitle></DialogHeader>
          <BusinessIntakeFormContent {...props} />
        </DialogContent>
      </Dialog>
    )
  }

  return <BusinessIntakeFormContent {...props} />
}
