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

type InvestorIntakeFormContentProps = Omit<InvestorIntakeFormProps, "display" | "triggerLabel"> & {
  mode?: "embedded" | "modal"
}

const steps = [
  {
    title: "Profile",
    summary: "Identity, nationality, and residence context.",
    fields: ["nationality", "countryOfResidence", "familyApplication"] as const,
  },
  {
    title: "Planning",
    summary: "Budget range, timing, and planning direction.",
    fields: ["investmentRange", "timeline"] as const,
  },
  {
    title: "Contact",
    summary: "Reply preference and anything useful to know.",
    fields: ["fullName", "email", "phoneWhatsApp", "preferredContactMethod"] as const,
  },
] as const

const fieldClassName =
  "h-12 rounded-[1.15rem] border border-[#d7cebf] bg-white text-[#1d2430] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] placeholder:text-[#8b8191] focus-visible:border-[#415776] focus-visible:ring-[#415776]/20"

const selectTriggerClassName =
  "h-12 rounded-[1.15rem] border border-[#d7cebf] bg-white text-[#1d2430] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] data-[placeholder]:text-[#8b8191] focus:ring-[#415776]/20"

const labelClassName = "text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#5f6472]"

function InvestorIntakeFormContent({
  title = "Request a private consultation",
  description = "A short confidential intake designed to clarify fit, timing, and the most sensible next conversation.",
  sourcePage,
  submitLabel = "Request a private consultation",
  className,
  mode = "embedded",
}: InvestorIntakeFormContentProps) {
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
        <div className="rounded-[1.45rem] border border-[#e3d9cb] bg-white/62 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <div className="grid gap-4">
          <FormField control={form.control} name="nationality" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Nationality</FormLabel>
              <FormControl><Input className={fieldClassName} placeholder="Current nationality" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="countryOfResidence" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Country of residence</FormLabel>
              <FormControl><Input className={fieldClassName} placeholder="Where you live now" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="familyApplication" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Family scope</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={selectTriggerClassName}><SelectValue placeholder="Select scope" /></SelectTrigger>
                </FormControl>
                <SelectContent>{investorFamilyScopes.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          </div>
        </div>
      )
    }

    if (step === 1) {
      return (
        <div className="rounded-[1.45rem] border border-[#e3d9cb] bg-white/62 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <div className="grid gap-4">
          <FormField control={form.control} name="investmentRange" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Investment range</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={selectTriggerClassName}><SelectValue placeholder="Select range" /></SelectTrigger>
                </FormControl>
                <SelectContent>{investorInvestmentRanges.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="timeline" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Timeline</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={selectTriggerClassName}><SelectValue placeholder="Select timeline" /></SelectTrigger>
                </FormControl>
                <SelectContent>{investorTimelines.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <div className="rounded-[1.2rem] border border-[#dfd5c6] bg-white/68 px-4 py-4 text-sm leading-7 text-[#666d7b]">
            Use the final step to add any regional preference, family complexity, or timing detail that would help shape the first reply.
          </div>
          </div>
        </div>
      )
    }

    return (
      <div className="rounded-[1.45rem] border border-[#e3d9cb] bg-white/62 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
        <div className="grid gap-4">
        <FormField control={form.control} name="fullName" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClassName}>Full name</FormLabel>
            <FormControl><Input className={fieldClassName} placeholder="Your full name" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClassName}>Email</FormLabel>
            <FormControl><Input className={fieldClassName} placeholder="name@example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="phoneWhatsApp" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClassName}>Phone / WhatsApp</FormLabel>
            <FormControl><Input className={fieldClassName} placeholder="+971 ..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="preferredContactMethod" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClassName}>Preferred contact method</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className={selectTriggerClassName}><SelectValue placeholder="Select contact method" /></SelectTrigger>
              </FormControl>
              <SelectContent>{investorContactMethods.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="additionalNotes" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClassName}>Additional note</FormLabel>
            <FormControl>
              <Textarea className="min-h-32 rounded-[1.3rem] border border-[#d7cebf] bg-white text-[#1d2430] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] placeholder:text-[#8b8191] focus-visible:border-[#415776] focus-visible:ring-[#415776]/20" placeholder="Anything useful about your situation, timing, family structure, or jurisdictions under consideration." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        </div>
      </div>
    )
  }, [form.control, step])

  return (
    <IntakeFormShell title={title} description={description} step={step} steps={steps as unknown as Array<{ title: string; summary: string }>} className={className} mode={mode}>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {content}
          {submitError ? <p className="text-sm font-medium text-[#b44b52]">{submitError}</p> : null}
          {referenceId ? (
            <div className="flex items-start gap-3 rounded-[1.4rem] border border-emerald-300/45 bg-emerald-50 px-4 py-4 text-sm leading-7 text-[#1d2430]">
              <CheckCircle2 className="mt-1 size-4 text-emerald-600" />
              <div>
                <p className="font-medium">Your request has been received.</p>
                <p className="text-[#67707f]">Reference: <span className="font-medium text-[#1d2430]">{referenceId}</span></p>
              </div>
            </div>
          ) : null}
          <div className="flex flex-col gap-3 pt-1">
            <Button
              type={step < steps.length - 1 ? "button" : "submit"}
              className="h-[3.25rem] min-h-[3.25rem] rounded-full bg-[#243041] px-6 text-[0.95rem] font-semibold text-white shadow-[0_20px_38px_rgba(24,31,43,0.2)] hover:bg-[#1d2735]"
              onClick={step < steps.length - 1 ? handleNext : undefined}
              disabled={isPending}
            >
              {step === 0 ? "Continue to planning" : step === 1 ? "Continue to contact" : submitLabel}
              {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <ChevronRight className="size-4" />}
            </Button>
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full border border-[#d6ccbc] bg-white/75 px-5 text-[#243041] hover:bg-white"
                onClick={() => setStep((current) => Math.max(current - 1, 0))}
                disabled={step === 0 || isPending}
              >
              <ChevronLeft className="size-4" />
              Back
              </Button>
              <p className="text-right text-[0.82rem] leading-6 text-[#6d7484]">
                Reviewed discreetly before any reply is arranged.
              </p>
            </div>
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
          <InvestorIntakeFormContent {...props} mode="modal" />
        </DialogContent>
      </Dialog>
    )
  }

  return <InvestorIntakeFormContent {...props} mode="embedded" />
}
