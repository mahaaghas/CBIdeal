export { cbiBranding } from "./branding"
export {
  APP_URL,
  buildSaasAppUrl,
  DEFAULT_SAAS_APP_URL,
  LEGACY_SAAS_APP_HOST,
  normalizeSaasAppHref,
  normalizeSaasAppUrl,
  rewriteLegacySaasAppUrl,
  saasAppHost,
  saasAppUrl,
} from "./app-url"
export {
  buildBusinessMessage,
  buildInvestorStructuredNotes,
  buildLeadRecordKey,
  businessChallenges,
  businessCrmStates,
  businessInterests,
  businessTypes,
  businessVolumes,
  formatLeadDate,
  investorContactMethods,
  investorFamilyScopes,
  investorInterestTypes,
  investorInvestmentRanges,
  investorRegions,
  investorTimelines,
  parseInvestorStructuredNotes,
} from "./lead-intake"
export { calculateWorkspacePricing, saasPricingModel } from "./pricing"
export {
  demoWorkspaceConfig,
  formatPlanAmount,
  getPlanLimits,
  getSaasPlan,
  getSaasDemoUrl,
  getSaasLoginUrl,
  getSelfServeSignupUrl,
  isSelfServePlan,
  saasAppConfig,
  saasPlans,
} from "./saas"
export type {
  BusinessLeadSubmission,
  CrmLeadRecord,
  InvestorLeadSubmission,
  LeadLifecycleStatus,
  LeadPanelHistory,
  LeadPanelNote,
  LeadPanelOverlay,
  WebsiteLeadFormType,
  WebsiteLeadSubmission,
} from "./lead-intake"
export type {
  PaymentStatus,
  SaasPlanDefinition,
  SaasPlanId,
  SelfServePlanId,
  SubscriptionStatus,
} from "./saas"
