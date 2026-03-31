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
import { Textarea } from "@cbideal/ui/components/ui/textarea"
import {
  investorContactMethods,
  investorFamilyScopes,
  investorInvestmentRanges,
  investorTimelines,
} from "@cbideal/config/lead-intake"
import { trackFormSubmit } from "@/lib/analytics"
import {
  investorLeadDefaults,
  investorLeadSchema,
  submitWebsiteLead,
  type InvestorLeadFormValues,
} from "@/lib/lead-intake"
import { IntakeFormShell } from "@/components/forms/intake-form-shell"

interface InvestorIntakeFormProps {
  title?: string
  description?: string
  sourcePage: string
  submitLabel?: string
  display?: "embedded" | "modal"
  triggerLabel?: string
  className?: string
}

const steps = [
  {
    title: "Profile",
    summary: "Capture identity and residence context.",
    fields: ["fullName", "nationality", "countryOfResidence"] as const,
  },
  {
    title: "Planning",
    summary: "Record investment range, family scope, and timing.",
    fields: ["investmentRange", "familyApplication", "timeline"] as const,
  },
  {
    title: "Contact",
    summary: "Choose the reply method and leave any useful note.",
    fields: ["fullName", "email", "phoneWhatsApp", "preferredContactMethod"] as const,
  },
] as const

function InvestorIntakeFormContent({
  title = "Request a private consultation",
  description = "A short, structured form to help narrow the field before a more considered advisory discussion.",
  sourcePage,
  submitLabel = "Request consultation",
  className,
}: Omit<InvestorIntakeFormProps, "display" | "triggerLabel">) {
  const [step, setStep] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const campaign = searchParams.get("utm_campaign") ?? searchParams.get("campaign") ?? ""

  const form = useForm<InvestorLeadFormValues>({
    resolver: zodResolver(investorLeadSchema),
    defaultValues: {
      ...investorLeadDefaults,
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
      const result = await submitWebsiteLead({ ...values, sourcePage, campaign, formType: "b2c" })

      if (!result.ok) {
        setSubmitError(result.message)
        return
      }

      setReferenceId(result.referenceId)
      trackFormSubmit({ form_type: "b2c", source_page: sourcePage, language: "EN" })
      form.reset({ ...investorLeadDefaults, sourcePage, campaign })
      setStep(0)
    })
  })

  const content = useMemo(() => {
    if (step === 0) {
      return (
        <div className="grid gap-5 md:grid-cols-3">
          <FormField control={form.control} name="fullName" render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl><Input className="h-12 rounded-2xl" placeholder="Your full name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="nationality" render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl><Input className="h-12 rounded-2xl" placeholder="Current nationality" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="countryOfResidence" render={({ field }) => (
            <FormItem>
              <FormLabel>Country of residence</FormLabel>
              <FormControl><Input className="h-12 rounded-2xl" placeholder="Where you live now" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      )
    }

    if (step === 1) {
      return (
        <div className="grid gap-5 md:grid-cols-3">
          <FormField control={form.control} name="investmentRange" render={({ field }) => (
            <FormItem>
              <FormLabel>Investment range</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Select range" /></SelectTrigger>
                </FormControl>
                <SelectContent>{investorInvestmentRanges.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="familyApplication" render={({ field }) => (
            <FormItem>
              <FormLabel>Family size</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Select scope" /></SelectTrigger>
                </FormControl>
                <SelectContent>{investorFamilyScopes.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="timeline" render={({ field }) => (
            <FormItem>
              <FormLabel>Timeline</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Select timeline" /></SelectTrigger>
                </FormControl>
                <SelectContent>{investorTimelines.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>
      )
    }

    return (
      <div className="grid gap-5 md:grid-cols-2">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input className="h-12 rounded-2xl" placeholder="name@example.com" {...field} /></FormControl>
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
        <FormField control={form.control} name="preferredContactMethod" render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred contact method</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Select contact method" /></SelectTrigger>
              </FormControl>
              <SelectContent>{investorContactMethods.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="additionalNotes" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Additional notes</FormLabel>
            <FormControl>
              <Textarea className="min-h-32 rounded-3xl" placeholder="Anything useful about your situation, timing, or jurisdictions under consideration." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
    )
  }, [form.control, step])

  return (
    <IntakeFormShell title={title} description={description} step={step} steps={steps as unknown as Array<{ title: string; summary: string }>} className={className}>
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

export function InvestorIntakeForm({
  display = "embedded",
  triggerLabel = "Explore your options",
  ...props
}: InvestorIntakeFormProps) {
  if (display === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild><Button className="rounded-full">{triggerLabel}</Button></DialogTrigger>
        <DialogContent className="max-h-[92vh] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-4xl">
          <DialogHeader className="sr-only"><DialogTitle>{props.title ?? "Request a private consultation"}</DialogTitle></DialogHeader>
          <InvestorIntakeFormContent {...props} />
        </DialogContent>
      </Dialog>
    )
  }

  return <InvestorIntakeFormContent {...props} />
}
