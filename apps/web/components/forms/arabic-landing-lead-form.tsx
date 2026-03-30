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
  description = "شارك لمحة واضحة عن وضعك الحالي حتى تبدأ المراجعة الأولى بسياق أدق وبأسلوب أكثر هدوءاً وخصوصية.",
  submitLabel = "اطلب الاستشارة",
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
        eyebrow: "استشارة خاصة",
        title,
        description,
        confidentialityNote:
          "تتم مراجعة الطلبات بسرية تامة. نعمل مع عدد محدود من الحالات ونولي الأولوية للطلبات الجادة والواضحة.",
        areaOfInterestLabel: "مجال الاهتمام",
        areaOfInterestPlaceholder: "اختر المجال",
        applicationScopeLabel: "نوع الطلب",
        applicationScopePlaceholder: "من يشمله الطلب",
        regionOfInterestLabel: "المنطقة محل الاهتمام",
        regionOfInterestPlaceholder: "اختر المنطقة",
        fullNameLabel: "الاسم الكامل",
        fullNamePlaceholder: "اكتب اسمك الكامل",
        budgetRangeLabel: "النطاق الاستثماري",
        budgetRangePlaceholder: "اختر النطاق",
        timelineLabel: "الإطار الزمني المفضل",
        timelinePlaceholder: "اختر التوقيت المناسب",
        whatsappLabel: "رقم واتساب",
        whatsappPlaceholder: "+971 ...",
        emailLabel: "البريد الإلكتروني",
        emailPlaceholder: "name@email.com",
        notesLabel: "معلومات إضافية",
        notesPlaceholder: "أضف أي تفاصيل تساعد على فهم الحالة، مثل وضع العائلة، التوقيت، أو الجهات التي تقارن بينها.",
        optionalLabel: "اختياري",
        successMessage: "شكراً لك. تم استلام طلبك وسيتم النظر فيه بشكل خاص قبل إبلاغك بالخطوة الأنسب.",
        submitLabel,
      }}
    />
  )
}
