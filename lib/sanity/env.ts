export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET
export const sanityApiVersion = process.env.SANITY_API_VERSION ?? "2026-03-19"

export function isSanityEnabled() {
  return Boolean(sanityProjectId && sanityDataset)
}
