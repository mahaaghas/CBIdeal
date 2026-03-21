import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { sanityDataset, sanityProjectId } from "@/lib/sanity/env"

const builder =
  sanityProjectId && sanityDataset
    ? imageUrlBuilder({
        projectId: sanityProjectId,
        dataset: sanityDataset,
      })
    : null

export function urlForSanityImage(source: SanityImageSource) {
  return builder?.image(source)
}
