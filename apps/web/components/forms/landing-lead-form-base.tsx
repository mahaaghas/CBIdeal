"use client"

import type { KeyboardEventHandler } from "react"
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
  landingLeadApplicationScopeOptions,
  landingLeadBudgetOptions,
  landingLeadFormDefaults,
  landingLeadFormName,
  landingLeadFormSchema,
  landingLeadInterestOptions,
  landingLeadRegionOptions,
  landingLeadTimelineOptions,
  submitLandingLeadForm,
  type LandingLeadFormField,
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
  areaOfInterestLabel: string
  areaOfInterestPlaceholder: string
  applicationScopeLabel: string
  applicationScopePlaceholder: string
  regionOfInterestLabel: string
  regionOfInterestPlaceholder: string
  fullNameLabel: string
  fullNamePlaceholder: string
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
    shouldFocusError: true,
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

  const fieldShellClass = cn("space-y-2.5", isRtl && "text-right")
  const labelClass = cn("text-[0.78rem] font-medium tracking-[0.01em] text-foreground/72", isRtl && "text-right")
  const controlClass =
    "h-11 rounded-2xl border-border/80 bg-white/75 px-3.5 text-sm shadow-none placeholder:text-muted-foreground/80 focus-visible:ring-[2px]"
  const selectTriggerClass = cn(
    "h-11 w-full rounded-2xl border-border/80 bg-white/75 px-3.5 text-sm shadow-none",
    isRtl && "text-right",
  )
  const textareaClass = cn(
    "min-h-[120px] rounded-2xl border-border/80 bg-white/75 px-3.5 py-3 text-sm shadow-none placeholder:text-muted-foreground/80 focus-visible:ring-[2px]",
    isRtl && "text-right",
  )

  const handleTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault()
      void onSubmit()
    }
  }

  return (
    <div
      dir={dir}
      className={cn(
        "rounded-[30px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.975),rgba(248,244,236,0.94))] p-6 shadow-[0_20px_66px_rgba(16,22,37,0.1)] md:p-8",
        isRtl && "text-right",
        className,
      )}
    >
      <div className="mb-7 space-y-4">
        <span className="eyebrow border-border/70 bg-white/70 text-muted-foreground">{copy.eyebrow}</span>
        <div className="space-y-3">
          <h3 className="max-w-[17ch] text-[1.78rem] leading-[1.14] text-foreground md:text-[2rem]">{copy.title}</h3>
          <p className="max-w-[29rem] text-sm leading-7 text-muted-foreground md:text-[0.97rem] md:leading-8">
            {copy.description}
          </p>
        </div>
        <p className="rounded-2xl border border-border/60 bg-white/45 px-4 py-3 text-[0.82rem] leading-6 text-muted-foreground">
          {copy.confidentialityNote}
        </p>
      </div>

      {referenceId ? (
        <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
          <div className={cn("flex items-start gap-3", isRtl && "flex-row-reverse text-right")}>
            <CheckCircle2 className="mt-0.5 size-5 text-primary" />
            <p className="font-semibold">{copy.successMessage}</p>
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
          className={cn(
            "space-y-[1.375rem] [&_label]:text-[0.78rem] [&_label]:font-medium [&_label]:tracking-[0.01em] [&_label]:text-foreground/72",
            isRtl && "text-right [&_label]:text-right",
          )}
          onSubmit={onSubmit}
        >
          <input type="hidden" name="form-name" value={landingLeadFormName} />
          <input type="hidden" name="bot-field" />
          <input type="hidden" {...form.register("sourcePage")} />
          <input type="hidden" {...form.register("sourceCategory")} />
          <input type="hidden" {...form.register("language")} />

          <div className="grid gap-[1.125rem] md:grid-cols-2">
            <FormField
              control={form.control}
              name="areaOfInterest"
              render={({ field }) => (
                <FormItem className={fieldShellClass}>
                  <FormLabel className={labelClass}>{copy.areaOfInterestLabel}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder={copy.areaOfInterestPlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {landingLeadInterestOptions.map((option) => (
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

            <FormField
              control={form.control}
              name="applicationScope"
              render={({ field }) => (
                <FormItem className={fieldShellClass}>
                  <FormLabel className={labelClass}>{copy.applicationScopeLabel}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder={copy.applicationScopePlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {landingLeadApplicationScopeOptions.map((option) => (
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

          <div className="grid gap-[1.125rem] md:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className={fieldShellClass}>
                  <FormLabel className={labelClass}>{copy.fullNameLabel}</FormLabel>
                  <FormControl>
                    <Input className={controlClass} placeholder={copy.fullNamePlaceholder} autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regionOfInterest"
              render={({ field }) => (
                <FormItem className={fieldShellClass}>
                  <FormLabel className={labelClass}>{copy.regionOfInterestLabel}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder={copy.regionOfInterestPlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {landingLeadRegionOptions.map((option) => (
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

          <div className="grid gap-[1.125rem] md:grid-cols-2">
            <FormField
              control={form.control}
              name="budgetRange"
              render={({ field }) => (
                <FormItem className={fieldShellClass}>
                  <FormLabel className={labelClass}>
                    {copy.budgetRangeLabel} <span className="text-muted-foreground">({copy.optionalLabel})</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
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

            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem className={fieldShellClass}>
                  <FormLabel className={labelClass}>
                    {copy.timelineLabel} <span className="text-muted-foreground">({copy.optionalLabel})</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className={selectTriggerClass}>
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
          </div>

          <div className="grid gap-[1.125rem] md:grid-cols-2">
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem className={fieldShellClass}>
                  <FormLabel className={labelClass}>{copy.whatsappLabel}</FormLabel>
                  <FormControl>
                    <Input
                      dir="ltr"
                      className={cn(controlClass, "text-left")}
                      placeholder={copy.whatsappPlaceholder}
                      autoComplete="tel"
                      inputMode="tel"
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={fieldShellClass}>
                  <FormLabel className={labelClass}>
                    {copy.emailLabel} <span className="text-muted-foreground">({copy.optionalLabel})</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      dir="ltr"
                      className={cn(controlClass, "text-left")}
                      placeholder={copy.emailPlaceholder}
                      autoComplete="email"
                      spellCheck={false}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className={fieldShellClass}>
                <FormLabel className={labelClass}>
                  {copy.notesLabel} <span className="text-muted-foreground">({copy.optionalLabel})</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    className={textareaClass}
                    placeholder={copy.notesPlaceholder}
                    onKeyDown={handleTextareaKeyDown}
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
            className="conversion-primary-button w-full disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
            {copy.submitLabel}
          </button>
        </form>
      </Form>
    </div>
  )
}
