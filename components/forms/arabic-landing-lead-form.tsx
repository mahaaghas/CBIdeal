import { LandingLeadFormBase } from "@/components/forms/landing-lead-form-base"
import type { LandingLeadSourceCategory } from "@/lib/landing-form"

interface ArabicLandingLeadFormProps {
  sourceCategory: LandingLeadSourceCategory
  sourcePage?: string
  title?: string
  description?: string
  submitLabel?: string
  className?: string
}

export function ArabicLandingLeadForm({
  sourceCategory,
  sourcePage,
  title = "اطلب استشارة خاصة",
  description = "شارك بياناتك الأساسية وسنراجع ملفك بشكل خاص قبل اقتراح الخطوة التالية الأنسب لك.",
  submitLabel = "اطلب استشارة خاصة",
  className,
}: ArabicLandingLeadFormProps) {
  return (
    <LandingLeadFormBase
      sourceCategory={sourceCategory}
      sourcePage={sourcePage}
      language="AR"
      dir="rtl"
      className={className}
      copy={{
        eyebrow: "نموذج استشارة خاصة",
        title,
        description,
        confidentialityNote: "مراجعة سرية ومهنية. تم تصميم النموذج ليكون سريعا وواضحا وسهل الإكمال.",
        fullNameLabel: "الاسم الكامل",
        fullNamePlaceholder: "الاسم الكامل",
        nationalityLabel: "الجنسية",
        nationalityPlaceholder: "جنسيتك الحالية",
        currentResidenceLabel: "بلد الإقامة الحالي",
        currentResidencePlaceholder: "أين تقيم حاليا",
        budgetRangeLabel: "نطاق الميزانية الاستثمارية",
        budgetRangePlaceholder: "اختر نطاق الميزانية",
        timelineLabel: "الإطار الزمني",
        timelinePlaceholder: "اختر الإطار الزمني",
        whatsappLabel: "رقم واتساب",
        whatsappPlaceholder: "+971 ...",
        emailLabel: "البريد الإلكتروني",
        emailPlaceholder: "name@email.com",
        notesLabel: "ملاحظات",
        notesPlaceholder: "أضف أي معلومات مفيدة مثل أفراد العائلة أو أهداف التنقل أو التوقيت أو المسارات التي تفكر فيها حاليا.",
        optionalLabel: "اختياري",
        successMessage: "شكرا لك. تم استلام طلبك وسيتم مراجعته بشكل خاص قبل اقتراح الخطوة التالية المناسبة.",
        submitLabel,
      }}
    />
  )
}
