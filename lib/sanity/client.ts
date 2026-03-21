import { createClient } from "next-sanity"
import { isSanityEnabled, sanityApiVersion, sanityDataset, sanityProjectId } from "@/lib/sanity/env"

export const sanityClient = isSanityEnabled()
  ? createClient({
      projectId: sanityProjectId!,
      dataset: sanityDataset!,
      apiVersion: sanityApiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null
