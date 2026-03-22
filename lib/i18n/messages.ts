import type { Locale } from "@/lib/i18n/routing"

type Messages = typeof enMessages

const enMessages = {
  languageName: "English",
  languageSwitch: "Language",
  nav: {
    home: "Home",
    programs: "Programs",
    forCompanies: "For Companies",
    insights: "Insights",
    pricing: "Pricing",
    contact: "Contact",
  },
  ctas: {
    bookCompanyCall: "Book company call",
    checkEligibility: "Check eligibility",
    contactSales: "Contact sales",
    viewPricing: "View pricing",
    requestDemo: "Request demo",
    backToCompany: "Back to company overview",
    explorePrograms: "Explore programs",
    returnHome: "Return home",
  },
  footer: {
    follow: "Follow",
    explore: "Explore",
    commercialFocus: "Commercial focus",
    legalAndContact: "Legal and contact",
  },
  forms: {
    tabsEyebrow: "Contact form",
    tabsTitle: "Choose the enquiry type that fits you best.",
    tabsDescription:
      "Each enquiry path is tailored so investors and partner companies can share the right context from the start.",
    investorTab: "Investor enquiry",
    companyTab: "Company enquiry",
  },
  notFound: {
    title: "We could not find that page.",
    description:
      "The link may have changed, or the page may not be part of the current public site. You can return to the investor homepage or continue to the main citizenship and residency overview.",
  },
} as const

const arMessages: Messages = {
  languageName: "العربية",
  languageSwitch: "اللغة",
  nav: {
    home: "الرئيسية",
    programs: "البرامج",
    forCompanies: "للشركات",
    insights: "المقالات",
    pricing: "الأسعار",
    contact: "تواصل معنا",
  },
  ctas: {
    bookCompanyCall: "احجز مكالمة للشركات",
    checkEligibility: "تحقق من الأهلية",
    contactSales: "تواصل مع المبيعات",
    viewPricing: "عرض الأسعار",
    requestDemo: "اطلب عرضاً توضيحياً",
    backToCompany: "العودة إلى صفحة الشركات",
    explorePrograms: "استكشف البرامج",
    returnHome: "العودة للرئيسية",
  },
  footer: {
    follow: "تابعنا",
    explore: "استكشف",
    commercialFocus: "التركيز التجاري",
    legalAndContact: "القانوني والتواصل",
  },
  forms: {
    tabsEyebrow: "نموذج التواصل",
    tabsTitle: "اختر نوع الاستفسار المناسب لك.",
    tabsDescription:
      "تم تصميم كل مسار استفسار بحيث يشارك المستثمرون والشركات الشريكة المعلومات المناسبة من البداية.",
    investorTab: "استفسار مستثمر",
    companyTab: "استفسار شركة",
  },
  notFound: {
    title: "تعذر العثور على هذه الصفحة.",
    description:
      "ربما تم تغيير الرابط أو أن الصفحة ليست جزءاً من الموقع العام الحالي. يمكنك العودة إلى الصفحة الرئيسية للمستثمرين أو متابعة صفحة برامج الجنسية والإقامة.",
  },
}

const ruMessages: Messages = {
  languageName: "Русский",
  languageSwitch: "Язык",
  nav: {
    home: "Главная",
    programs: "Программы",
    forCompanies: "Для компаний",
    insights: "Статьи",
    pricing: "Тарифы",
    contact: "Контакты",
  },
  ctas: {
    bookCompanyCall: "Забронировать звонок",
    checkEligibility: "Проверить соответствие",
    contactSales: "Связаться с продажами",
    viewPricing: "Посмотреть цены",
    requestDemo: "Запросить демо",
    backToCompany: "Вернуться к странице для компаний",
    explorePrograms: "Смотреть программы",
    returnHome: "Вернуться на главную",
  },
  footer: {
    follow: "Следить",
    explore: "Разделы",
    commercialFocus: "Коммерческий фокус",
    legalAndContact: "Правовая информация и контакты",
  },
  forms: {
    tabsEyebrow: "Форма контакта",
    tabsTitle: "Выберите подходящий тип запроса.",
    tabsDescription:
      "Каждый сценарий адаптирован так, чтобы инвесторы и партнёрские компании сразу делились нужным контекстом.",
    investorTab: "Запрос инвестора",
    companyTab: "Запрос компании",
  },
  notFound: {
    title: "Эта страница не найдена.",
    description:
      "Ссылка могла измениться, либо страница больше не входит в публичный сайт. Вы можете вернуться на главную страницу для инвесторов или перейти к обзору программ гражданства и резидентства.",
  },
}

const messagesMap: Record<Locale, Messages> = {
  en: enMessages,
  ar: arMessages,
  ru: ruMessages,
}

export function getMessages(locale: Locale) {
  return messagesMap[locale]
}
