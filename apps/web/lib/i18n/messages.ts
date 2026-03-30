import type { Locale } from "@/lib/i18n/routing"

type Messages = typeof enMessages

const enMessages = {
  languageName: "English",
  languageSwitch: "Language",
  nav: {
    home: "Home",
    programs: "Programs",
    forCompanies: "Collaborations",
    insights: "Insights",
    pricing: "Solutions",
    contact: "Contact",
  },
  ctas: {
    bookCompanyCall: "Arrange a private discussion",
    checkEligibility: "Request a consultation",
    contactSales: "Request call-back",
    viewPricing: "View solutions",
    requestDemo: "Arrange a private discussion",
    backToCompany: "Back to collaborations overview",
    explorePrograms: "Explore programs",
    returnHome: "Return home",
  },
  footer: {
    follow: "Follow",
    explore: "Explore",
    commercialFocus: "Approach",
    legalAndContact: "Legal and contact",
  },
  forms: {
    tabsEyebrow: "Contact",
    tabsTitle: "Choose the route that fits the conversation you want to have.",
    tabsDescription:
      "Each path is framed differently so investor discussions and professional enquiries begin with the right level of context.",
    investorTab: "Investor",
    companyTab: "Professional discussion",
  },
  notFound: {
    title: "We could not find that page.",
    description:
      "The link may have changed, or the page may no longer form part of the current public site. You can return to the homepage or continue to the main citizenship and residency overview.",
  },
} as const

const arMessages: Messages = {
  languageName: "العربية",
  languageSwitch: "اللغة",
  nav: {
    home: "الرئيسية",
    programs: "البرامج",
    forCompanies: "للجهات المهنية",
    insights: "المقالات",
    pricing: "آلية العمل",
    contact: "تواصل معنا",
  },
  ctas: {
    bookCompanyCall: "رتب نقاشاً خاصاً",
    checkEligibility: "اطلب استشارة",
    contactSales: "اطلب معاودة الاتصال",
    viewPricing: "اطلع على آلية العمل",
    requestDemo: "رتب نقاشاً خاصاً",
    backToCompany: "العودة إلى صفحة الجهات المهنية",
    explorePrograms: "استكشف البرامج",
    returnHome: "العودة للرئيسية",
  },
  footer: {
    follow: "تابعنا",
    explore: "استكشف",
    commercialFocus: "النهج",
    legalAndContact: "القانوني والتواصل",
  },
  forms: {
    tabsEyebrow: "التواصل",
    tabsTitle: "اختر المسار الذي يناسب نوع المحادثة التي تريدها.",
    tabsDescription:
      "لكل نوع من الطلبات بداية مختلفة حتى تصل المحادثات الاستثمارية والطلبات المهنية إلى المسار الأنسب منذ البداية.",
    investorTab: "مستثمر",
    companyTab: "طلب مهني",
  },
  notFound: {
    title: "تعذر العثور على هذه الصفحة.",
    description:
      "ربما تغير الرابط أو لم تعد الصفحة جزءاً من الموقع العام الحالي. يمكنك العودة إلى الصفحة الرئيسية أو متابعة صفحة البرامج الرئيسية.",
  },
}

const ruMessages: Messages = {
  languageName: "Русский",
  languageSwitch: "Язык",
  nav: {
    home: "Главная",
    programs: "Программы",
    forCompanies: "Для профессиональных фирм",
    insights: "Статьи",
    pricing: "Формат работы",
    contact: "Контакты",
  },
  ctas: {
    bookCompanyCall: "Организовать частную беседу",
    checkEligibility: "Запросить консультацию",
    contactSales: "Запросить обратный звонок",
    viewPricing: "Смотреть формат работы",
    requestDemo: "Организовать частную беседу",
    backToCompany: "Назад к профессиональной странице",
    explorePrograms: "Смотреть программы",
    returnHome: "Вернуться на главную",
  },
  footer: {
    follow: "Следить",
    explore: "Разделы",
    commercialFocus: "Подход",
    legalAndContact: "Правовая информация и контакты",
  },
  forms: {
    tabsEyebrow: "Контакт",
    tabsTitle: "Выберите формат, который соответствует вашему запросу.",
    tabsDescription:
      "У инвесторов и профессиональных фирм разные отправные точки, поэтому для каждого запроса предусмотрен свой маршрут.",
    investorTab: "Инвестор",
    companyTab: "Профессиональный запрос",
  },
  notFound: {
    title: "Эта страница не найдена.",
    description:
      "Ссылка могла измениться, либо страница больше не входит в публичный сайт. Вы можете вернуться на главную или перейти к обзору программ.",
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
