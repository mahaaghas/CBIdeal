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
    investorTitle:
      locale === "ar"
        ? "مراجعة للمستثمر"
        : locale === "ru"
          ? "Запрос инвестора"
          : "Investor review",
    investorDescription:
      locale === "ar"
        ? "شارك وضعك الحالي وما الذي تحاول الوصول إليه، حتى نتمكن من اقتراح الخطوة الأنسب بهدوء."
        : locale === "ru"
          ? "Поделитесь своим профилем и целью, чтобы мы могли спокойно предложить наиболее уместный следующий шаг."
          : "Share your current position and what you are trying to achieve so a more suitable next step can be considered with care.",
    investorSubmit:
      locale === "ar"
        ? "اطلب المراجعة"
        : locale === "ru"
          ? "Запросить рассмотрение"
          : "Request a private review",
    companyTitle:
      locale === "ar"
        ? "محادثة مهنية"
        : locale === "ru"
          ? "Профессиональный запрос"
          : "Professional enquiry",
    companyDescription:
      locale === "ar"
        ? "إذا كنت تمثل جهة مهنية أو استشارية، أخبرنا بطبيعة النقاش الذي تريد ترتيبه."
        : locale === "ru"
          ? "Если вы представляете профессиональную или консультативную фирму, сообщите, какой разговор вы хотели бы организовать."
          : "If you represent a professional or advisory firm, tell us what kind of discussion you would value arranging.",
    companySubmit:
      locale === "ar"
        ? "اطلب معاودة الاتصال"
        : locale === "ru"
          ? "Запросить обратный звонок"
          : "Request a reply",
  }

  return (
    <Tabs defaultValue={defaultValue} dir={isRtl ? "rtl" : "ltr"} className={isRtl ? "text-right" : undefined}>
      <div className="mb-7 space-y-4">
        <span className="eyebrow">{messages.forms.tabsEyebrow}</span>
        <h3 className="max-w-[18ch] text-[2rem] leading-[1.12] text-foreground md:text-[2.3rem]">
          {messages.forms.tabsTitle}
        </h3>
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
