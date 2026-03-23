"use client"

import { useMemo, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, LoaderCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  landingLeadBudgetOptions,
  landingLeadFormDefaults,
  landingLeadFormName,
  landingLeadFormSchema,
  landingLeadTimelineOptions,
  submitLandingLeadForm,
  type LandingLeadFormField,
  type LandingLeadFormFieldErrors,
  type LandingLeadFormValues,
  type LandingLeadSourceCategory,
} from "@/lib/landing-form"
import { trackFormSubmit } from "@/lib/analytics"
import { stripLocalePrefix } from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"

interface LandingLeadFormCopy {
  eyebrow: string
  title: string
  description: string
  confidentialityNote: string
  fullNameLabel: string
  fullNamePlaceholder: string
  nationalityLabel: string
  nationalityPlaceholder: string
  currentResidenceLabel: string
  currentResidencePlaceholder: string
  budgetRangeLabel: string
  budgetRangePlaceholder: string
  timelineLabel: string
  timelinePlaceholder: string
  whatsappLabel: string
  whatsappPlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  notesLabel: string
  notesPlaceholder: string
  optionalLabel: string
  successMessage: string
  submitLabel: string
}

interface LandingLeadFormBaseProps {
  sourceCategory: LandingLeadSourceCategory
  language: "EN" | "AR"
  copy: LandingLeadFormCopy
  sourcePage?: string
  className?: string
  dir?: "ltr" | "rtl"
}

function deriveSourcePage(pathname: string) {
  const barePath = stripLocalePrefix(pathname || "/")
  const cleaned = barePath.replace(/^\/+|\/+$/g, "")
  return cleaned || "home"
}

export function LandingLeadFormBase({
  sourceCategory,
  language,
  copy,
  sourcePage,
  className,
  dir = "ltr",
}: LandingLeadFormBaseProps) {
  const pathname = usePathname()
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const isRtl = dir === "rtl"
  const resolvedSourcePage = useMemo(
    () => sourcePage ?? deriveSourcePage(pathname ?? "/"),
    [pathname, sourcePage],
  )

  const form = useForm<LandingLeadFormValues>({
    resolver: zodResolver(landingLeadFormSchema),
    defaultValues: {
      ...landingLeadFormDefaults,
      sourcePage: resolvedSourcePage,
      sourceCategory,
      language,
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    setReferenceId(null)
    setSubmitError(null)
    form.clearErrors()

    startTransition(async () => {
      const result = await submitLandingLeadForm(values)

      if (!result.ok) {
        setSubmitError(result.message)

        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            const message = messages?.[0]

            if (message) {
              form.setError(field as LandingLeadFormField, {
                type: "server",
                message,
              })
            }
          })
        }

        return
      }

      setReferenceId(result.referenceId)
      trackFormSubmit({
        form_type: "landing_lead",
        source_page: resolvedSourcePage,
        source_category: sourceCategory,
        language,
      })
      form.reset({
        ...landingLeadFormDefaults,
        sourcePage: resolvedSourcePage,
        sourceCategory,
        language,
      })
    })
  })

  return (
    <div dir={dir} className={cn("section-card p-6 md:p-8", isRtl && "text-right", className)}>
      <div className="mb-6 space-y-3">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h3 className="text-2xl text-foreground md:text-3xl">{copy.title}</h3>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">{copy.description}</p>
        <p className="text-sm leading-6 text-muted-foreground">{copy.confidentialityNote}</p>
      </div>

      {referenceId ? (
        <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
          <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
            <CheckCircle2 className="mt-0.5 size-5 text-primary" />
            <div className="space-y-1">
              <p className="font-semibold">{copy.successMessage}</p>
              <p className="text-muted-foreground">
                Reference ID: <span className="font-medium text-foreground">{referenceId}</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {submitError ? (
        <div className="mb-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-foreground">
          <p className="font-medium text-foreground">{submitError}</p>
        </div>
      ) : null}

      <Form {...form}>
        <form
          name={landingLeadFormName}
          method="POST"
          action="/__forms.html"
          className={cn("space-y-5", isRtl && "text-right")}
          onSubmit={onSubmit}
        >
          <input type="hidden" name="form-name" value={landingLeadFormName} />
          <input type="hidden" name="bot-field" />
          <input type="hidden" {...form.register("sourcePage")} />
          <input type="hidden" {...form.register("sourceCategory")} />
          <input type="hidden" {...form.register("language")} />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className={cn(isRtl && "text-right")}>
                  <FormLabel className={cn(isRtl && "text-right")}>{copy.fullNameLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={copy.fullNamePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className={cn(isRtl && "text-right")}>
                  <FormLabel className={cn(isRtl && "text-right")}>{copy.nationalityLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={copy.nationalityPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="currentResidence"
              render={({ field }) => (
                <FormItem className={cn(isRtl && "text-right")}>
                  <FormLabel className={cn(isRtl && "text-right")}>{copy.currentResidenceLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={copy.currentResidencePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budgetRange"
              render={({ field }) => (
                <FormItem className={cn(isRtl && "text-right")}>
                  <FormLabel className={cn(isRtl && "text-right")}>{copy.budgetRangeLabel}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={cn("w-full", isRtl && "text-right")}>
                        <SelectValue placeholder={copy.budgetRangePlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {landingLeadBudgetOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {language === "AR" ? option.labelAr : option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem className={cn(isRtl && "text-right")}>
                  <FormLabel className={cn(isRtl && "text-right")}>{copy.whatsappLabel}</FormLabel>
                  <FormControl>
                    <Input dir="ltr" className="text-left" placeholder={copy.whatsappPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={cn(isRtl && "text-right")}>
                  <FormLabel>
                    {copy.emailLabel} <span className="text-muted-foreground">({copy.optionalLabel})</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      dir="ltr"
                      className="text-left"
                      placeholder={copy.emailPlaceholder}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem className={cn(isRtl && "text-right")}>
                  <FormLabel>
                    {copy.timelineLabel} <span className="text-muted-foreground">({copy.optionalLabel})</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className={cn("w-full", isRtl && "text-right")}>
                        <SelectValue placeholder={copy.timelinePlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {landingLeadTimelineOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {language === "AR" ? option.labelAr : option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="hidden md:block" />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className={cn(isRtl && "text-right")}>
                <FormLabel>
                  {copy.notesLabel} <span className="text-muted-foreground">({copy.optionalLabel})</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    className={cn(isRtl && "text-right")}
                    placeholder={copy.notesPlaceholder}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {copy.submitLabel}
          </button>
        </form>
      </Form>
    </div>
  )
}
