"use client"

import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMessages } from "@/lib/i18n/messages"
import type { Locale } from "@/lib/i18n/routing"

interface ContactInquiryTabsProps {
  locale?: Locale
  defaultValue?: "investor" | "company"
}

export function ContactInquiryTabs({ locale = "en", defaultValue = "investor" }: ContactInquiryTabsProps) {
  const messages = getMessages(locale)
  const isRtl = locale === "ar"
  const copy = {
    investorTitle: locale === "ar" ? "استفسار مستثمر" : locale === "ru" ? "Запрос инвестора" : "Investor enquiry",
    investorDescription:
      locale === "ar"
        ? "شارك ملفك وأهدافك ليعود مزود مناسب بخطوة تالية ملائمة."
        : locale === "ru"
          ? "Поделитесь своим профилем и целями, чтобы подходящий провайдер вернулся с релевантным следующим шагом."
          : "Share your profile and goals so a suitable provider can come back with a relevant next step.",
    investorSubmit:
      locale === "ar" ? "إرسال استفسار المستثمر" : locale === "ru" ? "Отправить запрос инвестора" : "Submit investor enquiry",
    companyTitle: locale === "ar" ? "استفسار شركة" : locale === "ru" ? "Запрос компании" : "Company enquiry",
    companyDescription:
      locale === "ar"
        ? "أخبرنا ما إذا كنت تقيّم الـ CRM أو العملاء المؤهلين أو إعدادًا مشتركًا."
        : locale === "ru"
          ? "Сообщите, оцениваете ли вы CRM, квалифицированные лиды или комбинированную модель."
          : "Tell us whether you are evaluating the CRM, qualified leads, or a combined setup.",
    companySubmit:
      locale === "ar" ? "إرسال استفسار الشركة" : locale === "ru" ? "Отправить запрос компании" : "Submit company enquiry",
  }

  return (
    <Tabs defaultValue={defaultValue} dir={isRtl ? "rtl" : "ltr"} className={isRtl ? "text-right" : undefined}>
      <div className="mb-7 space-y-4">
        <span className="eyebrow">{messages.forms.tabsEyebrow}</span>
        <h3 className="max-w-[18ch] text-[2rem] leading-[1.12] text-foreground md:text-[2.3rem]">{messages.forms.tabsTitle}</h3>
        <p className="max-w-[38rem] text-sm leading-7 text-muted-foreground md:text-[0.98rem] md:leading-8">
          {messages.forms.tabsDescription}
        </p>
      </div>
      <TabsList className="mb-7 grid h-auto w-full grid-cols-1 gap-2 rounded-2xl p-2 sm:grid-cols-2">
        <TabsTrigger value="investor">{messages.forms.investorTab}</TabsTrigger>
        <TabsTrigger value="company">{messages.forms.companyTab}</TabsTrigger>
      </TabsList>
      <TabsContent value="investor" className="mt-0">
        <LeadQualificationForm
          locale={locale}
          formType="investor"
          title={copy.investorTitle}
          description={copy.investorDescription}
          submitLabel={copy.investorSubmit}
          source="contact-investor"
        />
      </TabsContent>
      <TabsContent value="company" className="mt-0">
        <LeadQualificationForm
          locale={locale}
          formType="company"
          title={copy.companyTitle}
          description={copy.companyDescription}
          submitLabel={copy.companySubmit}
          source="contact-company"
        />
      </TabsContent>
    </Tabs>
  )
}
