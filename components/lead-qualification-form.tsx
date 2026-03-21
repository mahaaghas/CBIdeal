"use client"

import type { ReactNode } from "react"
import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  buildLeadFormSchema,
  companyTeamSizeOptions,
  investorBudgetOptions,
  investorTimeframeOptions,
  submitLeadForm,
  type LeadFormType,
  type LeadFormValues,
  leadFormDefaults,
  leadFormTypeCopy,
} from "@/lib/forms"
import { contactDetails } from "@/lib/site"
import { cn } from "@/lib/utils"

interface LeadQualificationFormProps {
  formType: LeadFormType
  title: string
  description: string
  submitLabel?: string
  source: string
}

interface FormGroupProps {
  title: string
  description?: string
  children: ReactNode
}

const investorStepOneFields: Array<keyof LeadFormValues> = [
  "fullName",
  "email",
  "phone",
  "countryOfCitizenship",
  "currentResidence",
]

const investorStepTwoFields: Array<keyof LeadFormValues> = [
  "applicantScope",
  "programInterest",
  "preferredDestination",
  "budgetRange",
  "timeframe",
  "notes",
  "consent",
]

function FormGroup({ title, description, children }: FormGroupProps) {
  return (
    <div className="rounded-[24px] border border-border/70 bg-muted/25 p-4 md:p-6">
      <div className="mb-5 space-y-1">
        <h4 className="text-lg text-foreground md:text-xl">{title}</h4>
        {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

export function LeadQualificationForm({
  formType,
  title,
  description,
  submitLabel,
  source,
}: LeadQualificationFormProps) {
  const [isPending, startTransition] = useTransition()
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const copy = leadFormTypeCopy[formType]
  const isInvestor = formType === "investor"

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(buildLeadFormSchema(formType)),
    defaultValues: leadFormDefaults(formType),
  })

  const onSubmit = form.handleSubmit((values) => {
    setReferenceId(null)
    setSubmitError(null)
    form.clearErrors()
    startTransition(async () => {
      const result = await submitLeadForm({ ...values, source, formType })

      if (!result.ok) {
        setSubmitError(result.message)

        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            const message = messages?.[0]

            if (message) {
              form.setError(field as keyof LeadFormValues, {
                type: "server",
                message,
              })
            }
          })
        }

        return
      }

      setReferenceId(result.referenceId)
      form.reset(leadFormDefaults(formType))
      setStep(0)
    })
  })

  const goToInvestorStepTwo = async () => {
    const valid = await form.trigger(investorStepOneFields)
    if (valid) setStep(1)
  }

  return (
    <div className="section-card p-6 md:p-10">
      <div className="mb-8 space-y-3">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h3 className="text-2xl text-foreground md:text-3xl">{title}</h3>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">{description}</p>
      </div>

      {referenceId ? (
        <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground md:p-5">
          <div className="flex items-start gap-3">
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
        <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-foreground md:p-5">
          <p className="font-medium text-foreground">{submitError}</p>
        </div>
      ) : null}

      {isInvestor ? (
        <div className="mb-6 rounded-[24px] border border-border/70 bg-background/80 p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-foreground">Step {step + 1} of 2</p>
            <p className="text-sm text-muted-foreground">{step === 0 ? "Contact and residence" : "Program fit and notes"}</p>
          </div>
          <div className="flex items-center gap-3">
            {[0, 1].map((stepIndex) => (
              <div key={stepIndex} className="flex flex-1 items-center gap-3">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition",
                    step === stepIndex
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground",
                  )}
                >
                  {stepIndex + 1}
                </div>
                <div className={cn("h-px flex-1 bg-border", stepIndex === 1 && "hidden")} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <Form {...form}>
        <form className="space-y-6" onSubmit={onSubmit}>
          {isInvestor ? (
            <>
              {step === 0 ? (
                <div className="space-y-5">
                  <FormGroup
                    title="Primary contact"
                    description="Start with the details a provider needs to review your enquiry quickly."
                  >
                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{copy.contactLabel}</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
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
                            <FormLabel>{copy.emailLabel}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="name@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone or WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder={contactDetails.whatsapp} {...field} />
                          </FormControl>
                          <FormDescription>Use the number you prefer for a direct follow-up.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormGroup>

                  <FormGroup
                    title="Current profile"
                    description="These details help narrow realistic routes before a provider gets in touch."
                  >
                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="countryOfCitizenship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country of citizenship</FormLabel>
                            <FormControl>
                              <Input placeholder="Current passport country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currentResidence"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current country of residence</FormLabel>
                            <FormControl>
                              <Input placeholder="Where you live now" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormGroup>
                </div>
              ) : (
                <div className="space-y-5">
                  <FormGroup
                    title="Program goals"
                    description="Help us understand the destination, scope, and timing that matter most."
                  >
                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="programInterest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Do you need citizenship or residency?</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select one" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="citizenship">Citizenship</SelectItem>
                                <SelectItem value="residency">Residency</SelectItem>
                                <SelectItem value="open-to-both">Open to both</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="applicantScope"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Is this for you or your family?</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select one" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="just-me">For me</SelectItem>
                                <SelectItem value="me-and-family">For me and my family</SelectItem>
                                <SelectItem value="family-office">For a family office or adviser-led case</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="preferredDestination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred destination or region</FormLabel>
                            <FormControl>
                              <Input placeholder="Caribbean, Europe, Turkey, or open" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budgetRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget range</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select budget" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {investorBudgetOptions.map((option) => (
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
                        name="timeframe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timeframe</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select timeframe" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {investorTimeframeOptions.map((option) => (
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
                  </FormGroup>

                  <FormGroup
                    title="Additional context"
                    description="A short note helps the first provider conversation feel more prepared."
                  >
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional notes</FormLabel>
                          <FormControl>
                            <Textarea rows={5} placeholder={copy.notesPlaceholder} {...field} />
                          </FormControl>
                          <FormDescription>{copy.notesHelp}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="rounded-2xl border border-border/70 bg-background/80 p-4">
                          <div className="flex items-start gap-3">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="text-sm">I agree to be contacted about my enquiry.</FormLabel>
                              <FormDescription>
                                Your details will be reviewed and shared only with a suitable provider or the team handling your request.
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </FormGroup>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-5">
              <FormGroup
                title="Primary contact"
                description="Tell us who we should coordinate with and which firm or desk you represent."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{copy.contactLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder="Full contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your firm or agency" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{copy.emailLabel}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="name@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone or WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder={contactDetails.whatsapp} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormGroup>

              <FormGroup
                title="Operational context"
                description="A few details help us prepare the right CRM, demo, or lead partnership conversation."
              >
                <div className="grid gap-5 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="regionServed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country or region served</FormLabel>
                        <FormControl>
                          <Input placeholder="EU, Caribbean, GCC, global" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of team members</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select team size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companyTeamSizeOptions.map((option) => (
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
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired rollout timing</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {investorTimeframeOptions.map((option) => (
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
              </FormGroup>

              <FormGroup
                title="What you are interested in"
                description="Tell us whether the conversation is about software, lead supply, or a broader commercial setup."
              >
                <FormField
                  control={form.control}
                  name="businessInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interested in CRM, leads, or both?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select one" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="crm">CRM only</SelectItem>
                          <SelectItem value="leads">Qualified leads only</SelectItem>
                          <SelectItem value="both">CRM and qualified leads</SelectItem>
                          <SelectItem value="white-label">White-label or partner model</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={5} placeholder={copy.notesPlaceholder} {...field} />
                      </FormControl>
                      <FormDescription>{copy.notesHelp}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="rounded-2xl border border-border/70 bg-background/80 p-4">
                      <div className="flex items-start gap-3">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-sm">I agree to be contacted about this enquiry.</FormLabel>
                          <FormDescription>
                            We will use these details only to respond to your request and coordinate the right next step for your team.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </FormGroup>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
            {isInvestor && step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted sm:w-auto"
              >
                <ChevronLeft className="size-4" />
                Back
              </button>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">A suitable team will review your details before following up.</p>
            )}

            {isInvestor && step === 0 ? (
              <button
                type="button"
                onClick={goToInvestorStepTwo}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 sm:w-auto"
              >
                Continue to program fit
                <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {submitLabel ?? copy.submitIdleLabel}
              </button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
