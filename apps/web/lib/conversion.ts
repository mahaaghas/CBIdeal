import type { Locale } from "@/lib/i18n/routing"
import { localizeHref } from "@/lib/i18n/routing"

export const conversionGuidePath = "/insights"
export const quizHash = "#conversion-quiz"

export function getConversionCtaCopy(locale: Locale) {
  if (locale === "ar") {
    return {
      primary: "اطلب استشارة خاصة",
      secondary: "استكشف الخيارات المناسبة",
      tertiary: "اطلع على المقالات",
      sticky: "اطلب استشارة خاصة",
      inlineTitle: "هل تحتاج إلى خطوة أولى أكثر وضوحاً؟",
      inlineButton: "اطلب استشارة خاصة",
      schedule: "رتب نقاشاً خاصاً",
    }
  }

  if (locale === "ru") {
    return {
      primary: "Запросить консультацию",
      secondary: "Изучить подходящие варианты",
      tertiary: "Смотреть статьи",
      sticky: "Запросить консультацию",
      inlineTitle: "Нужен более ясный первый шаг?",
      inlineButton: "Запросить консультацию",
      schedule: "Организовать частную беседу",
    }
  }

  return {
    primary: "Request a consultation",
    secondary: "Explore your options",
    tertiary: "View insights",
    sticky: "Request a consultation",
    inlineTitle: "Need a clearer first step?",
    inlineButton: "Request a consultation",
    schedule: "Arrange a private discussion",
  }
}

export function getConversionGuideHref(locale: Locale) {
  return localizeHref(locale, conversionGuidePath)
}

export type QuizBudget = "under-150k" | "150k-300k" | "300k-600k" | "600k-plus"
export type QuizGoal = "second-passport" | "residency-europe" | "tax-optimization" | "backup-plan"
export type QuizTiming = "asap" | "six-to-twelve" | "no-rush"
export type QuizHousehold = "just-me" | "couple" | "family"

export interface QuizAnswers {
  budget: QuizBudget
  goal: QuizGoal
  timing: QuizTiming
  household: QuizHousehold
}

export function getQuizResult(locale: Locale, answers: QuizAnswers) {
  const recommendation =
    answers.goal === "residency-europe"
      ? "Portugal residency"
      : answers.goal === "tax-optimization"
        ? answers.budget === "600k-plus"
          ? "Portugal residency"
          : "Grenada citizenship"
        : answers.goal === "backup-plan"
          ? answers.household === "family"
            ? "Antigua & Barbuda citizenship"
            : "Dominica citizenship"
          : answers.budget === "600k-plus"
            ? "St. Kitts & Nevis citizenship"
            : answers.household === "family"
              ? "Antigua & Barbuda citizenship"
              : "Dominica citizenship"

  if (locale === "ar") {
    const localizedTitle =
      recommendation === "Portugal residency"
        ? "الإقامة في البرتغال"
        : recommendation === "Grenada citizenship"
          ? "جنسية غرينادا"
          : recommendation === "Antigua & Barbuda citizenship"
            ? "جنسية أنتيغوا وبربودا"
            : recommendation === "St. Kitts & Nevis citizenship"
              ? "جنسية سانت كيتس ونيفيس"
              : "جنسية دومينيكا"

    const explanation =
      recommendation === "Portugal residency"
        ? "يبدو هذا المسار أكثر اتساقاً عندما تكون الأولوية للمرونة الأوروبية والتخطيط الأطول مدى، لا لقرار سريع حول جواز ثانٍ."
        : recommendation === "Grenada citizenship"
          ? "يميل هذا الخيار إلى خدمة الحالات التي تبحث عن مرونة استراتيجية أوسع، لا عن الحد الأدنى من الكلفة أو أسرع مسار ممكن."
          : recommendation === "Antigua & Barbuda citizenship"
            ? "يظهر هذا المسار غالباً عندما تكون اعتبارات العائلة حاضرة، ويصبح التوازن بين البنية العائلية والكلفة أكثر أهمية."
            : recommendation === "St. Kitts & Nevis citizenship"
              ? "يظهر هذا الخيار عادة في الملفات التي تضع السمعة والتموضع في مرتبة أعلى من الحساسية المطلقة تجاه الكلفة."
              : "يبدو هذا المسار عملياً في الحالات التي تبحث عن خيار أوضح من ناحية الكلفة والبنية العامة وسهولة المقارنة."

    return {
      title: localizedTitle,
      explanation,
    }
  }

  return {
    title: recommendation,
    explanation:
      recommendation === "Portugal residency"
        ? "This route tends to suit cases where European optionality and longer-term planning matter more than speed alone."
        : recommendation === "Grenada citizenship"
          ? "This route often makes sense where wider strategic flexibility matters more than simply choosing the cheapest threshold."
          : recommendation === "Antigua & Barbuda citizenship"
            ? "This route commonly comes into focus when family structure matters and the decision cannot be reduced to headline pricing."
            : recommendation === "St. Kitts & Nevis citizenship"
              ? "This route often suits profiles that care more about reputation and overall positioning than about minimising cost."
              : "This route often stands out when the objective is a practical second-citizenship option with cleaner economics and fewer moving parts.",
  }
}
