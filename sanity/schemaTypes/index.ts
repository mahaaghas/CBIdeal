import { authorType } from "./documents/authorType"
import { blogPostType } from "./documents/blogPostType"
import { categoryType } from "./documents/categoryType"
import { faqEntryType } from "./documents/faqEntryType"
import { landingPageType } from "./documents/landingPageType"
import { siteSettingsType } from "./documents/siteSettingsType"
import { ctaBannerSectionType } from "./objects/ctaBannerSectionType"
import { faqSectionType } from "./objects/faqSectionType"
import { featureCardType } from "./objects/featureCardType"
import { featureSectionType } from "./objects/featureSectionType"
import { heroSecondaryCardType } from "./objects/heroSecondaryCardType"
import { heroSectionType } from "./objects/heroSectionType"
import { linkObjectType } from "./objects/linkObjectType"
import { portableRichTextType } from "./objects/portableRichTextType"
import { processSectionType } from "./objects/processSectionType"
import { processStepType } from "./objects/processStepType"
import { qualificationFormSectionType } from "./objects/qualificationFormSectionType"
import { richImageType } from "./objects/richImageType"
import { seoType } from "./objects/seoType"
import { statItemType } from "./objects/statItemType"
import { trustItemType } from "./objects/trustItemType"
import { trustSectionType } from "./objects/trustSectionType"

export const schemaTypes = [
  siteSettingsType,
  landingPageType,
  blogPostType,
  authorType,
  categoryType,
  faqEntryType,
  seoType,
  linkObjectType,
  richImageType,
  statItemType,
  heroSecondaryCardType,
  heroSectionType,
  trustItemType,
  trustSectionType,
  featureCardType,
  featureSectionType,
  processStepType,
  processSectionType,
  qualificationFormSectionType,
  faqSectionType,
  ctaBannerSectionType,
  portableRichTextType,
]
