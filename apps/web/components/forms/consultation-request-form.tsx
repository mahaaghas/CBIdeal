"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, ShieldCheck } from "lucide-react"
import { useForm, type UseFormReturn } from "react-hook-form"
import {
  consultationBudgetOptions,
  consultationContactMethodOptions,
  consultationFamilyApplicationOptions,
  consultationInterestOptions,
  consultationRequestDefaults,
  consultationRequestSchema,
  consultationTimelineOptions,
  submitConsultationRequest,
  type ConsultationRequestFieldErrors,
  type ConsultationRequestValues,
} from "@/lib/consultation-form"
import { saveSuccessfulConsultationSubmission } from "@/lib/consultation-tracking"
import type { Locale } from "@/lib/i18n/routing"
import { localizeHref } from "@/lib/i18n/routing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

interface ConsultationRequestFormProps {
  id?: string
  locale?: Locale
  sourcePage: string
  sourceCategory?: string
  title?: string
  description?: string
  submitLabel?: string
  className?: string
}

const inputClassName =
  "h-12 rounded-[1.15rem] border-[#d6ccbc] bg-white text-[#1d2430] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] placeholder:text-[#8b8191] focus-visible:border-[#008c95] focus-visible:ring-[#008c95]/20"

const labelClassName = "text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[#5f6472]"

function getSubmissionLanguage(locale: Locale) {
  if (locale === "ar") return "AR"
  if (locale === "ru") return "RU"
  return "EN"
}

function applyFieldErrors(
  form: UseFormReturn<ConsultationRequestValues>,
  fieldErrors?: ConsultationRequestFieldErrors,
) {
  if (!fieldErrors) return

  Object.entries(fieldErrors).forEach(([fieldName, messages]) => {
    const message = messages?.[0]

    if (!message) return

    form.setError(fieldName as keyof ConsultationRequestValues, {
      type: "server",
      message,
    })
  })
}

export function ConsultationRequestForm({
  id,
  locale = "en",
  sourcePage,
  sourceCategory,
  title = "Request a private consultation",
  description = "Share the essentials below and we will review your request privately before arranging the most suitable next step.",
  submitLabel = "Request a consultation",
  className,
}: ConsultationRequestFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<ConsultationRequestValues>({
    resolver: zodResolver(consultationRequestSchema),
    defaultValues: {
      ...consultationRequestDefaults,
      sourcePage,
      sourceCategory,
      language: getSubmissionLanguage(locale),
    },
    shouldFocusError: true,
  })

  const isSubmitting = form.formState.isSubmitting

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null)

    const sourceUrl = typeof window === "undefined" ? values.sourceUrl : window.location.href
    const campaign = searchParams.get("utm_campaign") ?? searchParams.get("campaign") ?? ""
    const language = getSubmissionLanguage(locale)

    const result = await submitConsultationRequest({
      ...values,
      sourcePage,
      sourceCategory,
      sourceUrl,
      campaign,
      language,
    })

    if (!result.ok) {
      applyFieldErrors(form, result.fieldErrors)
      setSubmitError(result.message)
      return
    }

    saveSuccessfulConsultationSubmission({
      referenceId: result.referenceId,
      sourcePage,
      sourceUrl,
      language,
    })

    router.push(localizeHref(locale, result.redirectTo))
  })

  return (
    <div
      id={id}
      className={cn(
        "overflow-hidden rounded-[2.15rem] border border-[#ddd3c4] bg-[linear-gradient(180deg,#fffdf8_0%,#f4ede0_100%)] shadow-[0_36px_96px_rgba(16,22,35,0.18)]",
        className,
      )}
    >
      <div className="border-b border-[#e7dece] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,255,255,0.46))] px-7 py-7 md:px-8 md:py-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center rounded-full border border-[#dfd4c3] bg-white/82 px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#7a6b58]">
            Private consultation
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#163748] px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white">
            <ShieldCheck className="size-3.5" />
            Reviewed discreetly
          </span>
        </div>
        <div className="mt-5 space-y-3">
          <h2 className="max-w-[16ch] text-[2.05rem] leading-[1.03] tracking-[-0.04em] text-[#1d2430] md:text-[2.45rem]">
            {title}
          </h2>
          <p className="max-w-[42rem] text-[1rem] leading-7 text-[#5f6472] md:text-[1.03rem] md:leading-8">
            {description}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm leading-6 text-[#5f6472]">
          <span className="rounded-full border border-[#e2d7c8] bg-white/78 px-4 py-2">Secure server-side delivery</span>
          <span className="rounded-full border border-[#e2d7c8] bg-white/78 px-4 py-2">Reviewed by the advisory team</span>
          <span className="rounded-full border border-[#e2d7c8] bg-white/78 px-4 py-2">Redirects only after true success</span>
        </div>
      </div>

      <div className="px-7 py-7 md:px-8 md:py-8">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>Full name</FormLabel>
                    <FormControl>
                      <Input className={inputClassName} placeholder="Your full name" autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>Email</FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        placeholder="name@example.com"
                        autoComplete="email"
                        inputMode="email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneWhatsApp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>Phone / WhatsApp</FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        placeholder="+31 ..."
                        autoComplete="tel"
                        inputMode="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="countryOfResidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>Country of residence</FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        placeholder="Where you live now"
                        autoComplete="country-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>Nationality</FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        placeholder="Your current nationality"
                        autoComplete="country-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>Interested in</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputClassName}>
                          <SelectValue placeholder="Select your focus" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {consultationInterestOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="budgetRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>Approximate investment range</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputClassName}>
                          <SelectValue placeholder="Select your approximate range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {consultationBudgetOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                  <FormItem>
                    <FormLabel className={labelClassName}>
                      Timeline <span className="normal-case tracking-normal text-[#8b8191]">optional</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputClassName}>
                          <SelectValue placeholder="When would you like to move?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {consultationTimelineOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="currentResidencyStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>
                      Current residency status <span className="normal-case tracking-normal text-[#8b8191]">optional</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={inputClassName}
                        placeholder="For example: GCC resident, EU permit holder, citizen only"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyApplication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClassName}>
                      Family application <span className="normal-case tracking-normal text-[#8b8191]">optional</span>
                    </FormLabel>
                    <FormControl>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {consultationFamilyApplicationOptions.map((option) => {
                          const selected = field.value === option.value

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => field.onChange(option.value)}
                              className={cn(
                                "inline-flex min-h-12 items-center justify-center rounded-[1.15rem] border px-4 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#008c95]/15",
                                selected
                                  ? "border-[#243041] bg-[#243041] text-white shadow-[0_16px_28px_rgba(36,48,65,0.18)]"
                                  : "border-[#d6ccbc] bg-white text-[#243041] hover:border-[#243041]/35 hover:bg-[#f8f7f4]",
                              )}
                            >
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="preferredContactMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClassName}>Preferred contact method</FormLabel>
                  <FormControl>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {consultationContactMethodOptions.map((option) => {
                        const selected = field.value === option.value

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "inline-flex min-h-12 items-center justify-center rounded-[1.15rem] border px-4 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#008c95]/15",
                              selected
                                ? "border-[#008c95] bg-[#0c7f87] text-white shadow-[0_18px_32px_rgba(0,140,149,0.22)]"
                                : "border-[#d6ccbc] bg-white text-[#243041] hover:border-[#008c95]/40 hover:bg-[#f7fbfb]",
                            )}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClassName}>Message / additional notes</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-44 rounded-[1.25rem] border-[#d6ccbc] bg-white px-4 py-3 text-[#1d2430] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] placeholder:text-[#8b8191] focus-visible:border-[#008c95] focus-visible:ring-[#008c95]/20"
                      placeholder="Tell us what you are exploring, any timing pressure, and anything else that would help us review your request properly."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError ? (
              <div className="rounded-[1.25rem] border border-[#e6b8bb] bg-[#fff5f5] px-4 py-4 text-sm leading-7 text-[#9e3640]">
                {submitError}
              </div>
            ) : null}

            <div className="flex flex-col gap-4 border-t border-[#e7ddcf] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[34rem] text-sm leading-7 text-[#6d7484]">
                Your request is only counted as a completed consultation submission after the server confirms delivery and redirects you to the thank-you page.
              </p>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[3.6rem] min-w-[14.5rem] rounded-full bg-[#008c95] px-8 text-[0.95rem] font-semibold text-white shadow-[0_20px_38px_rgba(0,140,149,0.24)] hover:bg-[#00777f] active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Sending request...
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
