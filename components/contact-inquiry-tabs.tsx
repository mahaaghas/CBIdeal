"use client"

import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContactInquiryTabsProps {
  defaultValue?: "investor" | "company"
}

export function ContactInquiryTabs({ defaultValue = "investor" }: ContactInquiryTabsProps) {
  return (
    <Tabs defaultValue={defaultValue}>
      <div className="mb-8 space-y-4">
        <span className="eyebrow">Contact form</span>
        <h3 className="text-2xl text-foreground md:text-3xl">Choose the enquiry type that fits you best.</h3>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          Each enquiry path is tailored so investors and partner companies can share the right context from the start.
        </p>
      </div>
      <TabsList className="mb-8 grid h-auto w-full grid-cols-1 gap-2 rounded-2xl p-2 sm:grid-cols-2">
        <TabsTrigger value="investor">Investor enquiry</TabsTrigger>
        <TabsTrigger value="company">Company enquiry</TabsTrigger>
      </TabsList>
      <TabsContent value="investor" className="mt-0">
        <LeadQualificationForm
          formType="investor"
          title="Investor enquiry"
          description="Share your profile and goals so a suitable provider can come back with a relevant next step."
          submitLabel="Submit investor enquiry"
          source="contact-investor"
        />
      </TabsContent>
      <TabsContent value="company" className="mt-0">
        <LeadQualificationForm
          formType="company"
          title="Company enquiry"
          description="Tell us whether you are evaluating the CRM, qualified leads, or a combined setup."
          submitLabel="Submit company enquiry"
          source="contact-company"
        />
      </TabsContent>
    </Tabs>
  )
}
